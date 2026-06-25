import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [useNativeFallback, setUseNativeFallback] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Tight spring — lens should feel like a rigid glass object, not fluid
  const springConfig = { damping: 32, stiffness: 420, mass: 0.6 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const prevPos = React.useRef({ x: -100, y: -100 });

  useEffect(() => {
    let mounted = true;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;
      prevPos.current = { x: e.clientX, y: e.clientY };

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Tilt the lens subtly based on velocity direction
      if (mounted) {
        setTilt({
          x: Math.max(-12, Math.min(12, dy * 0.6)),
          y: Math.max(-12, Math.min(12, -dx * 0.6)),
        });
        setUseNativeFallback(false);

        const target = e.target as HTMLElement;
        const isClickable =
          target.tagName.toLowerCase() === 'a' ||
          target.tagName.toLowerCase() === 'button' ||
          target.closest('a') !== null ||
          target.closest('button') !== null ||
          target.closest('[data-cursor-hover]') !== null ||
          window.getComputedStyle(target).cursor === 'pointer';

        setIsHovering(isClickable);
        setIsVisible(true);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!mounted) return;
      setIsClicking(true);
      setRipples(prev => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }]);
    };

    const handleMouseUp = () => { if (mounted) setIsClicking(false); };
    const handleMouseLeave = () => { if (mounted) setIsVisible(false); };
    const handleMouseEnter = () => { if (mounted) setIsVisible(true); };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      mounted = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('cursor-none');
    };
  }, [cursorX, cursorY]);

  useEffect(() => {
    if (useNativeFallback) {
      document.body.classList.remove('cursor-none');
      return;
    }
    document.body.classList.add('cursor-none');
    return () => { document.body.classList.remove('cursor-none'); };
  }, [useNativeFallback]);

  const removeRipple = useCallback((id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  // Sizes relative to default OS cursor (~20px arrow tip)
  // Default: 28px — slightly larger than cursor, you can clearly see "through" it
  // Hover:   38px — expands to wrap the target, slight magnification cue
  // Click:   24px — contracts sharply like a shutter closing
  const size = isClicking ? 24 : isHovering ? 38 : 28;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: size,
            height: size,
            rotateX: tilt.x,
            rotateY: tilt.y,
            scale: isClicking ? 0.88 : 1,
          }}
          transition={{
            width: { type: 'spring', damping: 22, stiffness: 500 },
            height: { type: 'spring', damping: 22, stiffness: 500 },
            rotateX: { type: 'spring', damping: 18, stiffness: 260 },
            rotateY: { type: 'spring', damping: 18, stiffness: 260 },
            scale: { type: 'spring', damping: 20, stiffness: 600 },
          }}
          style={{
            borderRadius: '50%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            perspective: 120,

            // ── Core glass body ──────────────────────────────────────────
            // A real convex lens: dark at the very rim (thick glass edge),
            // clears toward center where the glass is thinnest.
            background: `
              radial-gradient(
                circle at 50% 50%,
                rgba(255,255,255,0.06)   0%,
                rgba(220,235,255,0.10)  35%,
                rgba(180,210,255,0.14)  65%,
                rgba(140,175,230,0.22)  85%,
                rgba(100,140,210,0.36) 100%
              )
            `,

            // ── Multi-layer shadow = optical depth ────────────────────────
            // 1. Outer hard ring → lens barrel / ground edge
            // 2. Mid soft shadow → depth beneath lens
            // 3. Inner top inset → concave bevel on the rim interior
            // 4. Inner bottom inset → opposite rim, slight warm tint
            boxShadow: `
              0 0 0 0.75px rgba(160,190,235,0.55),
              0 0 0 1.5px  rgba(100,140,210,0.18),
              0 2px 6px    rgba(0,0,0,0.18),
              0 1px 2px    rgba(0,0,0,0.12),
              inset 0  1px 2px rgba(255,255,255,0.70),
              inset 0 -1px 2px rgba(120,160,220,0.30)
            `,

            // ── Optical zoom ──────────────────────────────────────────────
            // contrast + saturate simulates the magnifying effect of a real
            // convex lens compressing light. brightness very slightly over 1
            // because glass transmits ~99% light but focuses it.
            backdropFilter: `
              blur(0px)
              brightness(1.06)
              contrast(1.18)
              saturate(1.22)
            `,
            WebkitBackdropFilter: `
              blur(0px)
              brightness(1.06)
              contrast(1.18)
              saturate(1.22)
            `,
          }}
        >
          {/* ── Layer 1: Primary specular — top-left arc ─────────────── */}
          {/* Real convex lens reflects a crescent from the dominant light source */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `
              radial-gradient(
                ellipse 58% 36% at 32% 24%,
                rgba(255,255,255,0.82) 0%,
                rgba(255,255,255,0.28) 40%,
                transparent 70%
              )
            `,
          }} />

          {/* ── Layer 2: Secondary specular — bottom-right counter-light ─ */}
          {/* The backface of glass catches ambient fill light */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `
              radial-gradient(
                ellipse 30% 18% at 72% 76%,
                rgba(210,228,255,0.44) 0%,
                transparent 70%
              )
            `,
          }} />

          {/* ── Layer 3: Lens coating sheen — thin-film interference ring ─ */}
          {/* Camera lenses have AR coating that produces a faint colored ring */}
          <div style={{
            position: 'absolute',
            inset: '8%',
            borderRadius: '50%',
            border: '0.75px solid rgba(180,200,255,0.20)',
            boxShadow: 'inset 0 0 4px rgba(160,190,255,0.12)',
          }} />

          {/* ── Layer 4: Center transmission zone ────────────────────────── */}
          {/* The very center of a convex lens is optically clearest — almost no tint */}
          <div style={{
            position: 'absolute',
            inset: '28%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 100%)',
          }} />
        </motion.div>

        {/* ── Outer barrel ring — sits outside the glass ───────────────── */}
        {/* Real lenses have a metal or plastic housing ring around the glass element */}
        <motion.div
          animate={{ width: size + 4, height: size + 4 }}
          transition={{ type: 'spring', damping: 22, stiffness: 500 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            translateX: '-50%',
            translateY: '-50%',
            borderRadius: '50%',
            border: '1px solid rgba(140,170,220,0.28)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      {/* ── Click: optical diffraction rings ─────────────────────────── */}
      {/* When you press a glass lens, light diffracts in concentric rings */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <React.Fragment key={ripple.id}>
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[9997]"
              style={{
                left: ripple.x,
                top: ripple.y,
                translateX: '-50%',
                translateY: '-50%',
                borderRadius: '50%',
                border: '0.75px solid rgba(180,210,255,0.5)',
              }}
              initial={{ width: size, height: size, opacity: 0.65 }}
              animate={{ width: size + 28, height: size + 28, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.45, ease: [0.2, 0, 0.4, 1] }}
              onAnimationComplete={() => removeRipple(ripple.id)}
            />
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[9996]"
              style={{
                left: ripple.x,
                top: ripple.y,
                translateX: '-50%',
                translateY: '-50%',
                borderRadius: '50%',
                border: '0.5px solid rgba(200,220,255,0.28)',
              }}
              initial={{ width: size, height: size, opacity: 0.4 }}
              animate={{ width: size + 52, height: size + 52, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.6, ease: [0.2, 0, 0.4, 1], delay: 0.05 }}
            />
          </React.Fragment>
        ))}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;