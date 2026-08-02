import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Touch / coarse-pointer devices get native cursor — no JS needed.
const isTouchDevice =
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

const DOT_SIZE = 6;
const RING_DEFAULT = 32;
const RING_HOVER = 48;
const RING_CLICK = 24;

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Dot follows cursor with zero lag — direct motion values.
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Ring lags behind the dot via a loose spring.
  const ringSpring = { damping: 28, stiffness: 200, mass: 0.8 };
  const ringX = useSpring(dotX, ringSpring);
  const ringY = useSpring(dotY, ringSpring);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const onMove = (e: MouseEvent) => {
      if (!mounted.current) return;
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      setIsVisible(true);

      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('[data-cursor-hover]') !== null ||
        window.getComputedStyle(target).cursor === 'pointer',
      );
    };

    const onDown = () => { if (mounted.current) setIsClicking(true); };
    const onUp   = () => { if (mounted.current) setIsClicking(false); };
    const onLeave = () => { if (mounted.current) setIsVisible(false); };
    const onEnter = () => { if (mounted.current) setIsVisible(true); };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.body.classList.add('cursor-none');

    return () => {
      mounted.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.body.classList.remove('cursor-none');
    };
  }, [dotX, dotY]);

  if (isTouchDevice) return null;

  const ringSize = isClicking ? RING_CLICK : isHovering ? RING_HOVER : RING_DEFAULT;

  return (
    <>
      {/* ── Ring — lagging, larger circle ───────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        animate={{
          opacity: isVisible ? 1 : 0,
          width: ringSize,
          height: ringSize,
        }}
        transition={{
          opacity: { duration: 0.15 },
          width:   { type: 'spring', damping: 22, stiffness: 400 },
          height:  { type: 'spring', damping: 22, stiffness: 400 },
        }}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          border: '1.5px solid rgba(99, 102, 241, 0.75)',
          backgroundColor: isHovering
            ? 'rgba(99, 102, 241, 0.08)'
            : 'transparent',
        }}
      />

      {/* ── Dot — sharp, direct, mix-blend-difference ───────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        animate={{
          opacity: isVisible ? 1 : 0,
          // Dot hides when hovering — ring alone signals the target
          scale: isHovering ? 0 : isClicking ? 1.8 : 1,
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale:   { type: 'spring', damping: 20, stiffness: 600 },
        }}
        style={{
          x: dotX,
          y: dotY,
          width: DOT_SIZE,
          height: DOT_SIZE,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: 'rgba(99, 102, 241, 1)',
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
};

export default CustomCursor;
