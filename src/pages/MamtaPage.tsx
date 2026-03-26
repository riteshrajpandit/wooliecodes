import '@fontsource/caveat';
import '@fontsource/urbanist';
import { useEffect, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// ─── CSS VARIABLES & GLOBAL STYLES ───────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    :root {
      --color-deep:  #0D0D1A;
      --color-dusk:  #1A1035;
      --color-blush: #F2D4CC;
      --color-gold:  #E8C97A;
      --color-cream: #FAF6F0;
      --color-rose:  #C97A8A;
      --color-mist:  #E8EAF6;
      --text-light:  #F5F0EB;
      --text-dark:   #2D2A26;
      --text-muted:  rgba(245,240,235,0.55);
    }
    html { scroll-behavior: smooth; }
    body { margin: 0; padding: 0; background: var(--color-deep); }
    * { box-sizing: border-box; }
    .f-caveat   { font-family: 'Caveat', cursive; }
    .f-urbanist { font-family: 'Urbanist', sans-serif; }

    @keyframes floatUp {
      0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
      10%  { opacity: var(--float-op, 0.28); }
      88%  { opacity: var(--float-op, 0.28); }
      100% { transform: translateY(-300px) translateX(var(--drift, 14px)); opacity: 0; }
    }
    @keyframes bounceY {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50%       { transform: translateX(-50%) translateY(10px); }
    }
    @keyframes pulseScale {
      0%, 100% { transform: scale(1); }
      50%       { transform: scale(1.08); }
    }
    @keyframes floatGentle {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-12px); }
    }
    @keyframes tapGlow {
      0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0   rgba(201,122,138,0.35); }
      50%       { transform: scale(1.04); box-shadow: 0 0 0 6px rgba(201,122,138,0); }
    }
    .tap-pulse  { animation: tapGlow    2s  ease-in-out infinite; }
    .pulse-anim { animation: pulseScale 3s  ease-in-out infinite; }
    .float-anim { animation: floatGentle 4s ease-in-out infinite; }

    .dot-grid {
      background-image: radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `}</style>
);

// ─── SCROLL PROGRESS BAR ─────────────────────────────────────────────────────
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: '0%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'var(--color-gold)',
        zIndex: 9999,
      }}
    />
  );
};

// ─── FLOATING EMOJI ───────────────────────────────────────────────────────────
interface FloatEmojiProps {
  emoji: string;
  fontSize: string;
  left: string;
  bottom: string;
  duration: string;
  delay: string;
  drift: string;
  opacity: string;
}
const FloatingEmoji = ({ emoji, fontSize, left, bottom, duration, delay, drift, opacity }: FloatEmojiProps) => (
  <span
    style={{
      position: 'absolute',
      fontSize,
      left,
      bottom,
      '--drift': drift,
      '--float-op': opacity,
      animation: `floatUp ${duration} ${delay} ease-in infinite`,
      pointerEvents: 'none',
      userSelect: 'none',
    } as React.CSSProperties}
  >
    {emoji}
  </span>
);

const FLOATING_EMOJIS: FloatEmojiProps[] = [
  { emoji: '✨', fontSize: '18px', left: '8%',  bottom: '14%', duration: '9s',  delay: '0s',   drift: '14px',  opacity: '0.30' },
  { emoji: '🌸', fontSize: '28px', left: '20%', bottom: '24%', duration: '12s', delay: '1.5s', drift: '-12px', opacity: '0.35' },
  { emoji: '💫', fontSize: '22px', left: '40%', bottom: '10%', duration: '8s',  delay: '0.8s', drift: '20px',  opacity: '0.25' },
  { emoji: '🌙', fontSize: '16px', left: '58%', bottom: '30%', duration: '11s', delay: '2.2s', drift: '-8px',  opacity: '0.20' },
  { emoji: '⭐', fontSize: '20px', left: '70%', bottom: '18%', duration: '10s', delay: '0.3s', drift: '16px',  opacity: '0.28' },
  { emoji: '🌿', fontSize: '24px', left: '82%', bottom: '22%', duration: '13s', delay: '3s',   drift: '-18px', opacity: '0.22' },
  { emoji: '🤍', fontSize: '18px', left: '90%', bottom: '12%', duration: '7s',  delay: '1s',   drift: '10px',  opacity: '0.30' },
  { emoji: '✨', fontSize: '14px', left: '32%', bottom: '35%', duration: '9s',  delay: '4s',   drift: '-15px', opacity: '0.18' },
];

// ─── GOLD RULE (load-time) ────────────────────────────────────────────────────
const GoldRuleLoad = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ delay, duration: 0.8, ease: 'easeOut' }}
    style={{ width: '40px', height: '1px', background: 'var(--color-gold)', margin: '20px auto', transformOrigin: 'center' }}
  />
);

// ─── GOLD RULE (scroll-triggered) ────────────────────────────────────────────
const GoldRuleView = () => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    style={{ width: '40px', height: '1px', background: 'var(--color-gold)', margin: '20px auto', transformOrigin: 'center' }}
  />
);

// ─── FADE UP (scroll-triggered) ───────────────────────────────────────────────
const FadeUp = ({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    style={style}
  >
    {children}
  </motion.div>
);

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
const SectionLabel = ({ text, color = 'var(--color-rose)' }: { text: string; color?: string }) => (
  <p
    className="f-urbanist"
    style={{ fontSize: '11px', letterSpacing: '3px', color, textTransform: 'uppercase', textAlign: 'center', margin: '0 0 14px', fontWeight: 600 }}
  >
    {text}
  </p>
);

// ─── TYPEWRITER HOOK ──────────────────────────────────────────────────────────
const useTypewriter = (text: string, active: boolean, speed = 28) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!active) { setDisplayed(''); return; }
    let i = 0;
    setDisplayed('');
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [active, text, speed]);

  return displayed;
};

// ─── QUIZ CARD ────────────────────────────────────────────────────────────────
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #FFF0EC, #FCDDD6)',
  'linear-gradient(135deg, #EEF0FF, #DDE1FA)',
  'linear-gradient(135deg, #FFF8EC, #FAECD4)',
  'linear-gradient(135deg, #F0FFF4, #D4F0DD)',
  'linear-gradient(135deg, #FFF0F5, #FAD4E0)',
];

interface CardProps {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onOpen: () => void;
}

const QuizCard = ({ index, question, answer, isOpen, onOpen }: CardProps) => {
  const [typingActive, setTypingActive] = useState(false);
  const displayed = useTypewriter(answer, typingActive);

  useEffect(() => { if (!isOpen) setTypingActive(false); }, [isOpen]);

  const num = String(index + 1).padStart(2, '0');

  return (
    <FadeUp delay={index * 0.08}>
      <motion.article
        layout
        onClick={() => { if (!isOpen) onOpen(); }}
        style={{
          background: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          cursor: isOpen ? 'default' : 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
        whileHover={!isOpen ? { scale: 1.012, boxShadow: '0 8px 40px rgba(0,0,0,0.13)' } : {}}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        aria-expanded={isOpen}
      >
        {/* Ghost number */}
        <span
          className="f-caveat"
          style={{ position: 'absolute', top: '10px', right: '16px', fontSize: '52px', opacity: 0.07, color: 'var(--text-dark)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}
        >
          {num}
        </span>

        {/* Question */}
        <p
          className="f-caveat"
          style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-dark)', margin: '0 0 18px', lineHeight: 1.35, paddingRight: '36px' }}
        >
          {question}
        </p>

        {/* Tap button */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              key="tap-btn"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.2 }}
              className="tap-pulse f-urbanist"
              onClick={(e) => { e.stopPropagation(); onOpen(); }}
              aria-label="Reveal my answer"
              style={{
                fontSize: '13px',
                padding: '8px 20px',
                borderRadius: '999px',
                border: '1px solid var(--color-rose)',
                background: 'transparent',
                color: 'var(--color-rose)',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                fontWeight: 500,
                transition: 'background 0.2s, color 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-rose)'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-rose)'; }}
            >
              Tap to see what I think 👀
            </motion.button>
          )}
        </AnimatePresence>

        {/* Answer with typewriter */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="answer-wrap"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => setTypingActive(true)}
            >
              <p
                className="f-urbanist"
                style={{ fontSize: '15px', lineHeight: 1.65, color: 'rgba(45,42,38,0.76)', margin: 0, minHeight: '64px' }}
              >
                {displayed}
                {typingActive && displayed.length < answer.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--color-rose)', marginLeft: '2px', verticalAlign: 'text-bottom', borderRadius: '1px' }}
                  />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </FadeUp>
  );
};

// ─── HONEST STATEMENT ROW ─────────────────────────────────────────────────────
const StatementRow = ({ emoji, text, isLast }: { emoji: string; text: string; isLast: boolean }) => (
  <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '22px 0' }}>
      <motion.span
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: { scale: [0, 1.3, 1], opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
        }}
        style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px', display: 'block' }}
      >
        {emoji}
      </motion.span>
      <motion.p
        variants={{
          hidden: { x: -20, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
        }}
        className="f-urbanist"
        style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--text-dark)', margin: 0 }}
      >
        {text}
      </motion.p>
    </div>
    {!isLast && <div style={{ height: '1px', background: 'var(--color-rose)', opacity: 0.15, marginLeft: '40px' }} />}
  </motion.div>
);

// ─── WORD-BY-WORD REVEAL ──────────────────────────────────────────────────────
const WordReveal = ({ text }: { text: string }) => (
  <motion.span
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    style={{ display: 'inline' }}
  >
    {text.split(' ').map((w, i) => (
      <motion.span
        key={i}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        style={{ display: 'inline-block', marginRight: '0.28em' }}
      >
        {w}
      </motion.span>
    ))}
  </motion.span>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const QUIZ_DATA = [
  {
    question: "What's the most awkward thing about all of this?",
    answer: "That I had to build a website to say what I should've just said. But here we are, and honestly? I'm glad I did. 😅",
  },
  {
    question: "Do you think I'm a good texter?",
    answer: "I'm going to be honest — no. But I know I can do better. You deserve better. And I'm working on it. 😄",
  },
  {
    question: "What do you think I noticed first about you?",
    answer: "The way you carry yourself. Before any words, that already said something. And I was paying attention.",
  },
  {
    question: "How do you think this story ends?",
    answer: "I genuinely don't know yet. But I'd really like to find out — and I'd like to find out with you. 🌸",
  },
  {
    question: "What's one thing you'd want me to know right now?",
    answer: "That I'm actually here. Not performing. Not in a rush. Just genuinely here, and glad that you are too.",
  },
];

const HONEST_DATA = [
  { emoji: '🙏', text: "I'm sorry for the times I wasn't fully present. That changes." },
  { emoji: '👂', text: "I want to hear you — not just wait for my turn to talk." },
  { emoji: '😊', text: "Your happiness isn't an afterthought to me. It actually matters." },
  { emoji: '🌱', text: "I'm a work in progress. But I'm trying, and I wanted you to know that." },
];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function MamtaPage() {
  const [openCard, setOpenCard] = useState<number | null>(null);

  const handleCardOpen = useCallback((i: number) => {
    setOpenCard(prev => (prev === i ? null : i));
  }, []);

  return (
    <>
      <GlobalStyles />
      <ScrollProgressBar />

      <main style={{ background: 'var(--color-deep)', overflowX: 'hidden' }}>

        {/* ══════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════ */}
        <section
          style={{
            minHeight: '100svh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, var(--color-dusk), var(--color-deep))',
          }}
        >
          {/* Grain texture */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.04, zIndex: 1 }}
            aria-hidden="true"
          >
            <filter id="grain-hero">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain-hero)" />
          </svg>

          {/* Glow orb */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '320px', height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--color-rose) 0%, transparent 70%)',
              opacity: 0.15,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Floating emojis */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            {FLOATING_EMOJIS.map((fe, i) => <FloatingEmoji key={i} {...fe} />)}
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 28px', maxWidth: '480px', width: '100%' }}>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.85, ease: 'easeOut' }}
              className="f-caveat"
              style={{ fontSize: 'clamp(52px, 16vw, 72px)', color: 'var(--text-light)', letterSpacing: '-1px', lineHeight: 1.1, margin: 0 }}
            >
              Hey Mamta 🌸
            </motion.h1>

            <GoldRuleLoad delay={0.6} />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
              className="f-urbanist"
              style={{ fontSize: '18px', color: 'var(--text-muted)', fontStyle: 'italic', margin: '0 0 10px', lineHeight: 1.6 }}
            >
              I made you something small.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7, ease: 'easeOut' }}
              className="f-urbanist"
              style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.03em' }}
            >
              Please scroll.
            </motion.p>
          </div>

          {/* Bouncing chevron */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            style={{
              position: 'absolute', bottom: '32px', left: '50%',
              animation: 'bounceY 1.8s ease-in-out infinite',
              color: 'var(--color-gold)', zIndex: 2,
            }}
            aria-hidden="true"
          >
            <ChevronDown size={24} />
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 2 — QUIZ CARDS
        ══════════════════════════════════════════ */}
        <section
          className="dot-grid"
          style={{ background: 'var(--color-cream)', padding: '96px 20px', position: 'relative' }}
        >
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <FadeUp>
              <SectionLabel text="A Little Game" />
              <h2
                className="f-caveat"
                style={{ fontSize: 'clamp(36px, 10vw, 48px)', color: 'var(--text-dark)', textAlign: 'center', margin: '0 0 10px', lineHeight: 1.15 }}
              >
                I had some questions.
              </h2>
              <p
                className="f-urbanist"
                style={{ fontSize: '16px', color: 'rgba(45,42,38,0.6)', textAlign: 'center', fontStyle: 'italic', margin: '0 0 40px', lineHeight: 1.5 }}
              >
                I also took the liberty of answering them. 😄
              </p>
            </FadeUp>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {QUIZ_DATA.map((card, i) => (
                <QuizCard
                  key={i}
                  index={i}
                  question={card.question}
                  answer={card.answer}
                  isOpen={openCard === i}
                  onOpen={() => handleCardOpen(i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — HONEST SECTION
        ══════════════════════════════════════════ */}
        <section
          style={{
            background: 'linear-gradient(180deg, var(--color-blush) 0%, var(--color-cream) 100%)',
            padding: '96px 24px',
          }}
        >
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <FadeUp>
              <SectionLabel text="No Filter" />
              <h2
                className="f-caveat"
                style={{ fontSize: 'clamp(32px, 9vw, 44px)', color: 'var(--text-dark)', textAlign: 'center', margin: '0 0 40px', lineHeight: 1.2 }}
              >
                A few things I want you to know.
              </h2>
            </FadeUp>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
            >
              {HONEST_DATA.map((s, i) => (
                <StatementRow key={i} emoji={s.emoji} text={s.text} isLast={i === HONEST_DATA.length - 1} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4 — HER TURN
        ══════════════════════════════════════════ */}
        <section
          style={{
            background: 'var(--color-dusk)',
            padding: '96px 24px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {/* Top-right glow orb */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', width: '280px', height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--color-blush) 0%, transparent 70%)',
              opacity: 0.12, top: '-40px', right: '-60px',
              filter: 'blur(60px)', pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <FadeUp>
              <SectionLabel text="Your Turn" color="var(--color-gold)" />
              <p
                className="f-urbanist"
                style={{ fontSize: '16px', color: 'var(--text-muted)', fontStyle: 'italic', margin: '0 0 20px', lineHeight: 1.6 }}
              >
                I've done all the talking.
              </p>
            </FadeUp>

            <FadeUp delay={0.12}>
              <h2
                className="f-caveat"
                style={{ fontSize: 'clamp(48px, 14vw, 64px)', color: 'var(--text-light)', lineHeight: 1.15, margin: '0 0 4px' }}
              >
                <WordReveal text="How are you, really?" />
              </h2>
            </FadeUp>

            <FadeUp delay={0.28}>
              <GoldRuleView />
              <p
                className="f-urbanist"
                style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 48px', letterSpacing: '0.02em' }}
              >
                No right answer. Just yours.
              </p>
            </FadeUp>

            {/* Delayed floating emoji */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 1.5, duration: 0.7, ease: 'easeOut' }}
              className="float-anim"
              style={{ fontSize: '48px', display: 'inline-block', filter: 'drop-shadow(0 0 14px rgba(232,201,122,0.42))' }}
              aria-hidden="true"
            >
              💬
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 5 — FOOTER
        ══════════════════════════════════════════ */}
        <footer
          style={{
            background: 'var(--color-deep)',
            padding: '80px 24px',
            textAlign: 'center',
            borderTop: '1px solid rgba(245,240,235,0.06)',
          }}
        >
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <FadeUp>
              <span
                className="pulse-anim"
                style={{ fontSize: '32px', display: 'inline-block', marginBottom: '24px' }}
                aria-hidden="true"
              >
                🌸
              </span>

              <p
                className="f-urbanist"
                style={{ fontSize: '15px', color: 'var(--text-muted)', margin: '0 0 6px', lineHeight: 1.6 }}
              >
                Made with a lot of second-guessing
              </p>

              <p
                className="f-caveat"
                style={{ fontSize: '28px', color: 'var(--color-gold)', margin: '0 0 28px', lineHeight: 1.3 }}
              >
                and one very good decision.
              </p>

              <div style={{ height: '1px', background: 'rgba(245,240,235,0.1)', margin: '0 auto 24px', width: '80px' }} />

              <p
                className="f-urbanist"
                style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', opacity: 0.5, margin: 0, lineHeight: 1.6 }}
              >
                — Someone who's glad life brought us here
              </p>
            </FadeUp>
          </div>
        </footer>

      </main>
    </>
  );
}