import React, { useState, useCallback, useRef, useEffect } from 'react';

interface Page {
  id: number;
  title: string;
  content: string;
}

interface BookProps {
  pages: Page[];
}

const Book: React.FC<BookProps> = ({ pages }) => {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [dragDirection, setDragDirection] = useState<'next' | 'prev' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const bookRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const animationRef = useRef<number | null>(null);

  const totalSpreads = Math.ceil(pages.length / 2);

  // Get pages for current spread
  const getLeftPage = (spread: number) => pages[spread * 2] || null;
  const getRightPage = (spread: number) => pages[spread * 2 + 1] || null;

  // Physics-based easing for natural motion
  const easeInOutCubic = (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Animate to target with physics
  const animateToTarget = useCallback((
    start: number, 
    end: number, 
    duration: number,
    onComplete: () => void
  ) => {
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = easeInOutCubic(progress);
      const currentValue = start + (end - start) * easedProgress;
      
      setDragProgress(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Handle page turn completion
  const completeTurn = useCallback((direction: 'next' | 'prev') => {
    setIsAnimating(true);
    
    const startProgress = dragProgress;
    const endProgress = direction === 'next' ? -1 : 1;
    const distance = Math.abs(endProgress - startProgress);
    const duration = 400 + distance * 400;
    
    animateToTarget(startProgress, endProgress, duration, () => {
      if (direction === 'next' && currentSpread < totalSpreads - 1) {
        setCurrentSpread(prev => prev + 1);
      } else if (direction === 'prev' && currentSpread > 0) {
        setCurrentSpread(prev => prev - 1);
      }
      setDragProgress(0);
      setDragDirection(null);
      setIsAnimating(false);
    });
  }, [dragProgress, currentSpread, totalSpreads, animateToTarget]);

  // Cancel turn and spring back
  const cancelTurn = useCallback(() => {
    setIsAnimating(true);
    const distance = Math.abs(dragProgress);
    const duration = 300 + distance * 400;
    
    animateToTarget(dragProgress, 0, duration, () => {
      setDragProgress(0);
      setDragDirection(null);
      setIsAnimating(false);
    });
  }, [dragProgress, animateToTarget]);

  // Mouse/Touch handlers
  const handleDragStart = useCallback((clientX: number) => {
    if (isAnimating) return;
    
    setIsDragging(true);
    dragStartX.current = clientX;
  }, [isAnimating]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || isAnimating) return;
    
    const bookElement = bookRef.current;
    if (!bookElement) return;
    
    const rect = bookElement.getBoundingClientRect();
    const bookWidth = rect.width;
    const deltaX = clientX - dragStartX.current;
    
    let progress = deltaX / (bookWidth * 0.5);
    progress = Math.max(-1, Math.min(1, progress));
    
    if (Math.abs(progress) > 0.02) {
      const newDirection = progress < 0 ? 'next' : 'prev';
      
      if (newDirection === 'next' && currentSpread >= totalSpreads - 1) {
        progress = Math.max(progress, -0.15);
      }
      if (newDirection === 'prev' && currentSpread <= 0) {
        progress = Math.min(progress, 0.15);
      }
      
      setDragDirection(newDirection);
    }
    
    setDragProgress(progress);
  }, [isDragging, isAnimating, currentSpread, totalSpreads]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 0.2;
    
    if (Math.abs(dragProgress) > threshold && dragDirection) {
      if (dragDirection === 'next' && currentSpread < totalSpreads - 1) {
        completeTurn('next');
      } else if (dragDirection === 'prev' && currentSpread > 0) {
        completeTurn('prev');
      } else {
        cancelTurn();
      }
    } else {
      cancelTurn();
    }
  }, [isDragging, dragProgress, dragDirection, currentSpread, totalSpreads, completeTurn, cancelTurn]);

  // Event listeners
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientX);
    const onEnd = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      
      if (e.key === 'ArrowRight' && currentSpread < totalSpreads - 1) {
        setDragDirection('next');
        completeTurn('next');
      }
      if (e.key === 'ArrowLeft' && currentSpread > 0) {
        setDragDirection('prev');
        completeTurn('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating, currentSpread, totalSpreads, completeTurn]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Calculate flip angle from progress
  const getFlipAngle = () => {
    const absProgress = Math.abs(dragProgress);
    return absProgress * 180;
  };

  // Dynamic shadow based on flip
  const getPageShadow = () => {
    const absProgress = Math.abs(dragProgress);
    return absProgress * 0.5;
  };

  const leftPage = getLeftPage(currentSpread);
  const rightPage = getRightPage(currentSpread);
  const nextLeftPage = getLeftPage(currentSpread + 1);
  const prevRightPage = getRightPage(currentSpread - 1);

  const isFlipping = (isDragging || isAnimating) && dragDirection !== null;
  const flipAngle = getFlipAngle();
  const shadowIntensity = getPageShadow();

  return (
    <div className="book-wrapper">
      <div 
        ref={bookRef}
        className="book-container"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      >
        <div className="book">
          {/* Left page */}
          <div className="book-page book-page-left">
            <div className="page-paper">
              {leftPage && (
                <div className="page-content">
                  <span className="page-number">{currentSpread * 2 + 1}</span>
                  <h3 className="page-title handwritten">{leftPage.title}</h3>
                  <p className="page-text handwritten">{leftPage.content}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right page */}
          <div className="book-page book-page-right">
            <div className="page-paper">
              {rightPage ? (
                <div className="page-content">
                  <span className="page-number">{currentSpread * 2 + 2}</span>
                  <h3 className="page-title handwritten">{rightPage.title}</h3>
                  <p className="page-text handwritten">{rightPage.content}</p>
                </div>
              ) : (
                <div className="page-content page-end">
                  <p className="handwritten">The End</p>
                  <span className="handwritten">Thank you for reading...</span>
                </div>
              )}
            </div>
          </div>

          {/* Flipping page - Forward */}
          {isFlipping && dragDirection === 'next' && (
            <div 
              className="flipping-page flipping-page-right"
              style={{
                transform: `rotateY(${-flipAngle}deg)`,
              }}
            >
              {/* Front of page */}
              <div className="flip-page-front">
                <div className="page-paper">
                  {rightPage && (
                    <div className="page-content">
                      <span className="page-number">{currentSpread * 2 + 2}</span>
                      <h3 className="page-title handwritten">{rightPage.title}</h3>
                      <p className="page-text handwritten">{rightPage.content}</p>
                    </div>
                  )}
                </div>
                {/* Shadow on front */}
                <div 
                  className="page-shadow-front"
                  style={{ opacity: shadowIntensity }}
                />
              </div>
              {/* Back of page */}
              <div className="flip-page-back">
                <div className="page-paper">
                  {nextLeftPage && (
                    <div className="page-content">
                      <span className="page-number">{(currentSpread + 1) * 2 + 1}</span>
                      <h3 className="page-title handwritten">{nextLeftPage.title}</h3>
                      <p className="page-text handwritten">{nextLeftPage.content}</p>
                    </div>
                  )}
                </div>
                {/* Shadow on back */}
                <div 
                  className="page-shadow-back"
                  style={{ opacity: shadowIntensity * 0.7 }}
                />
              </div>
            </div>
          )}

          {/* Flipping page - Backward */}
          {isFlipping && dragDirection === 'prev' && (
            <div 
              className="flipping-page flipping-page-left"
              style={{
                transform: `rotateY(${flipAngle}deg)`,
              }}
            >
              {/* Front of page (left side) */}
              <div className="flip-page-front">
                <div className="page-paper">
                  {leftPage && (
                    <div className="page-content">
                      <span className="page-number">{currentSpread * 2 + 1}</span>
                      <h3 className="page-title handwritten">{leftPage.title}</h3>
                      <p className="page-text handwritten">{leftPage.content}</p>
                    </div>
                  )}
                </div>
                <div 
                  className="page-shadow-front"
                  style={{ opacity: shadowIntensity }}
                />
              </div>
              {/* Back of page */}
              <div className="flip-page-back">
                <div className="page-paper">
                  {prevRightPage && (
                    <div className="page-content">
                      <span className="page-number">{(currentSpread - 1) * 2 + 2}</span>
                      <h3 className="page-title handwritten">{prevRightPage.title}</h3>
                      <p className="page-text handwritten">{prevRightPage.content}</p>
                    </div>
                  )}
                </div>
                <div 
                  className="page-shadow-back"
                  style={{ opacity: shadowIntensity * 0.7 }}
                />
              </div>
            </div>
          )}

          {/* Center binding */}
          <div className="book-binding" />
        </div>

        <div className="book-shadow" />
      </div>

      {/* Navigation */}
      <div className="book-controls">
        <button 
          onClick={() => {
            if (currentSpread > 0 && !isAnimating) {
              setDragDirection('prev');
              completeTurn('prev');
            }
          }}
          disabled={currentSpread === 0 || isAnimating}
          className="book-nav-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        
        <div className="book-pagination">
          {Array.from({ length: totalSpreads }).map((_, i) => (
            <button
              key={i}
              onClick={() => !isAnimating && setCurrentSpread(i)}
              className={`pagination-dot ${currentSpread === i ? 'active' : ''}`}
            />
          ))}
        </div>

        <button 
          onClick={() => {
            if (currentSpread < totalSpreads - 1 && !isAnimating) {
              setDragDirection('next');
              completeTurn('next');
            }
          }}
          disabled={currentSpread >= totalSpreads - 1 || isAnimating}
          className="book-nav-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <p className="book-hint">Drag to turn pages or use arrow keys</p>
    </div>
  );
};

export default Book;
