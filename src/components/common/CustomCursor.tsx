import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null || 
        target.closest('button') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Add cursor styles to body
    document.body.classList.add('cursor-none');

    // Add pointer-events-none to all links and buttons
    const elements = document.querySelectorAll('a, button');
    elements.forEach(el => el.classList.add('cursor-none'));

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('cursor-none');
      elements.forEach(el => el.classList.remove('cursor-none'));
    };
  }, []);

  // Don't render custom cursor on mobile/touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="custom-cursor pointer-events-none"
        animate={{
          x: position.x,
          y: position.y,
          scale: isClicking ? 0.8 : isPointer ? 1.2 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 500,
          mass: 0.3,
        }}
      >
        <div 
          className={`rounded-full mix-blend-difference ${
            isPointer ? 'bg-white w-4 h-4' : 'border-2 border-white w-8 h-8'
          } transition-all duration-200`}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;