import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Phase = 'sealed' | 'cracking' | 'opening' | 'open';

const ENV_W = 500;
const ENV_H = 330;
const CX = ENV_W / 2;
const CY = ENV_H / 2;
const FLAP_H = CY + 18;

export default function Invite() {
  const [phase, setPhase] = useState<Phase>('sealed');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => setScale(Math.min(1, (window.innerWidth - 32) / (ENV_W + 40)));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#13100B',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Ambient warmth — brightens when letter is revealed */}
      <motion.div
        animate={{ opacity: phase === 'open' ? 0.22 : 0.07 }}
        transition={{ duration: 2 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse 55% 45% at 50% 48%, #C8901A, transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Paper grain SVG filter */}
      <svg
        aria-hidden
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <filter id="grain" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="gn" />
            <feBlend in="SourceGraphic" in2="gn" mode="overlay" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Envelope scene — scaled for mobile */}
      <motion.div
        animate={{ scale, y: phase === 'open' ? -20 : 0 }}
        transition={{ scale: { duration: 0 }, y: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
        style={{ perspective: 1400, perspectiveOrigin: '50% 38%', transformOrigin: 'center center' }}
      >
        <EnvelopeScene phase={phase} setPhase={setPhase} />
      </motion.div>

      {/* Hint text */}
      <AnimatePresence>
        {phase === 'sealed' && (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.42, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ delay: 1.8, duration: 1 }}
            style={{
              position: 'absolute',
              bottom: '8%',
              margin: 0,
              fontFamily: 'Urbanist, sans-serif',
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#B08840',
              pointerEvents: 'none',
            }}
          >
            Break the seal to open
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Envelope Scene ──────────────────────────────────────────────────────────

function EnvelopeScene({ phase, setPhase }: { phase: Phase; setPhase: (p: Phase) => void }) {
  const isOpening = phase === 'opening' || phase === 'open';

  return (
    <div style={{ position: 'relative', width: ENV_W, height: ENV_H }}>

      {/* ── LETTER ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={false}
        animate={
          isOpening
            ? { y: phase === 'open' ? -200 : -70, opacity: 1 }
            : { y: 70, opacity: 0 }
        }
        transition={
          isOpening
            ? { delay: 0.44, duration: 1.05, ease: [0.16, 1, 0.3, 1] }
            : { duration: 0 }
        }
        style={{
          position: 'absolute',
          left: 40,
          top: 16,
          width: 420,
          height: 570,
          background: '#FAF3DF',
          borderRadius: 2,
          zIndex: 20,
          filter: 'url(#grain)',
          boxShadow: [
            '0 20px 80px rgba(0,0,0,0.60)',
            '0 5px 14px rgba(0,0,0,0.35)',
            '0 1px 0 rgba(255,255,255,0.08)',
          ].join(', '),
          overflow: 'hidden',
        }}
      >
        <LetterContent />
      </motion.div>

      {/* ── ENVELOPE BODY ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          borderRadius: 4,
          background: '#DFBF78',
          filter: 'url(#grain)',
          boxShadow: [
            '0 32px 100px rgba(0,0,0,0.70)',
            '0 8px 28px rgba(0,0,0,0.45)',
            '0 1px 0 rgba(255,255,255,0.10)',
          ].join(', '),
          overflow: 'hidden',
        }}
      >
        {/* Left fold panel */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #B88030 0%, #C8A050 100%)',
          clipPath: `polygon(0 0, ${CX}px ${CY}px, 0 ${ENV_H}px)`,
        }} />
        {/* Right fold panel */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(225deg, #B88030 0%, #C8A050 100%)',
          clipPath: `polygon(${ENV_W}px 0, ${CX}px ${CY}px, ${ENV_W}px ${ENV_H}px)`,
        }} />
        {/* Bottom fold panel */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #A87828, #B88030)',
          clipPath: `polygon(0 ${ENV_H}px, ${CX}px ${CY}px, ${ENV_W}px ${ENV_H}px)`,
        }} />
        {/* Inside of envelope — top triangle — revealed when flap opens */}
        <motion.div
          animate={{ opacity: isOpening ? 1 : 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, #F0E4C0, #E8D8A8)',
            clipPath: `polygon(0 0, ${ENV_W}px 0, ${CX}px ${FLAP_H}px)`,
          }}
        />
        {/* Center vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 50%, rgba(0,0,0,0.08) 100%)',
        }} />
      </div>

      {/* ── TOP FLAP (3D) ──────────────────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: ENV_W,
          height: FLAP_H,
          transformOrigin: 'top center',
          zIndex: isOpening ? 6 : 13,
          clipPath: `polygon(0 0, ${ENV_W}px 0, ${CX}px ${FLAP_H}px)`,
          background: 'linear-gradient(to bottom, #CFAB60, #BF9530)',
          filter: 'url(#grain)',
          backfaceVisibility: 'hidden',
          willChange: 'transform',
        }}
        animate={{ rotateX: isOpening ? -176 : 0 }}
        transition={{
          delay: phase === 'opening' ? 0.06 : 0,
          duration: 0.9,
          ease: [0.36, 0, 0.08, 1],
        }}
      />

      {/* Fold-line shadow along top-flap edge (stays static for realism) */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: ENV_W,
        height: FLAP_H,
        zIndex: 11,
        clipPath: `polygon(0 0, ${ENV_W}px 0, ${CX}px ${FLAP_H}px)`,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />

      {/* ── WAX SEAL ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {(phase === 'sealed' || phase === 'cracking') && (
          <motion.button
            key="seal"
            initial={{ scale: 0.78, opacity: 0 }}
            animate={
              phase === 'cracking'
                ? {
                    scale: [1, 1.22, 0.55, 0],
                    rotate: [0, -9, 24, 32],
                    opacity: [1, 1, 0.45, 0],
                  }
                : { scale: 1, opacity: 1 }
            }
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={
              phase === 'cracking'
                ? { duration: 0.5, times: [0, 0.26, 0.66, 1] }
                : { delay: 0.55, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
            }
            onAnimationComplete={() => {
              if (phase === 'cracking') setPhase('opening');
            }}
            onClick={() => {
              if (phase === 'sealed') setPhase('cracking');
            }}
            aria-label="Open envelope"
            style={{
              position: 'absolute',
              left: CX - 37,
              top: CY - 37,
              width: 74,
              height: 74,
              zIndex: 25,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <WaxSeal />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Wax Seal ─────────────────────────────────────────────────────────────────

function WaxSeal() {
  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', damping: 18, stiffness: 380 }}
      style={{
        width: 74,
        height: 74,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 34% 28%, #B42222 0%, #720D0D 52%, #4C0707 100%)',
        boxShadow: [
          '0 5px 24px rgba(100,8,8,0.80)',
          '0 2px 6px rgba(0,0,0,0.55)',
          'inset 0 2px 5px rgba(255,255,255,0.16)',
          'inset 0 -3px 8px rgba(0,0,0,0.55)',
        ].join(', '),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Embossed ring detail */}
      <svg
        width="74" height="74" viewBox="0 0 74 74"
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden
      >
        {/* Scalloped outer ring */}
        <circle cx="37" cy="37" r="31" fill="none"
          stroke="rgba(215,165,75,0.28)" strokeWidth="1.5" strokeDasharray="4.5 3" />
        {/* Inner crisp ring */}
        <circle cx="37" cy="37" r="20" fill="none"
          stroke="rgba(215,165,75,0.22)" strokeWidth="0.9" />
        {/* Subtle cross engraving */}
        <line x1="21" y1="37" x2="53" y2="37"
          stroke="rgba(215,165,75,0.15)" strokeWidth="0.8" />
        <line x1="37" y1="21" x2="37" y2="53"
          stroke="rgba(215,165,75,0.15)" strokeWidth="0.8" />
      </svg>

      {/* W monogram */}
      <span
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 30,
          fontWeight: 700,
          color: 'rgba(252, 218, 128, 0.96)',
          letterSpacing: '-0.02em',
          position: 'relative',
          zIndex: 1,
          textShadow: '0 1px 5px rgba(0,0,0,0.65)',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        W
      </span>

      {/* Gloss highlight */}
      <div style={{
        position: 'absolute',
        top: 6, left: 8,
        width: 26, height: 18,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.20), transparent)',
        transform: 'rotate(-30deg)',
        pointerEvents: 'none',
      }} />
    </motion.div>
  );
}

// ─── Letter Content ───────────────────────────────────────────────────────────

function LetterContent() {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div
      style={{
        padding: '52px 50px 44px 58px',
        height: '100%',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Ruled lines */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 58, right: 50,
            top: 100 + i * 33,
            height: 1,
            background: 'rgba(120, 88, 38, 0.09)',
          }}
        />
      ))}

      {/* Left red margin line */}
      <div style={{
        position: 'absolute',
        top: 52, bottom: 44,
        left: 82,
        width: 1,
        background: 'rgba(190, 80, 60, 0.22)',
      }} />

      {/* Text */}
      <div style={{ position: 'relative', zIndex: 1, fontFamily: "'Caveat', cursive", color: '#241508' }}>

        <p style={{ margin: '0 0 22px', fontSize: 14, color: '#8A6530', letterSpacing: '0.04em' }}>
          {today}
        </p>

        <p style={{ margin: '0 0 28px', fontSize: 24, fontWeight: 700, lineHeight: 1.35 }}>
          Dear Friend,
        </p>

        <p style={{ margin: '0 0 20px', fontSize: 21, lineHeight: 1.9 }}>
          You are warmly invited to something<br />
          worth remembering.
        </p>

        <p style={{ margin: '0 0 20px', fontSize: 21, lineHeight: 1.9 }}>
          Find your way to where the evening<br />
          light catches the sea, and the music<br />
          plays just quietly enough to think.
        </p>

        <p style={{ margin: '0 0 34px', fontSize: 21, lineHeight: 1.9 }}>
          Bring nothing but yourself,<br />
          and arrive whenever feels right.
        </p>

        <p style={{ margin: 0, fontSize: 28, fontWeight: 700, fontStyle: 'italic', color: '#3C1C08' }}>
          — W
        </p>
      </div>
    </div>
  );
}
