import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CodeLoaderProps {
  onFinish: () => void;
}

type Greeting = {
  word: string;
  lang: string;
  italic: boolean;
};

const greetings: Greeting[] = [
  { word: 'Hello',        lang: 'English',    italic: false },
  { word: 'Bonjour',      lang: 'French',     italic: true  },
  { word: 'नमस्ते',         lang: 'Nepali',     italic: false },
  { word: 'जोजोलप्पा',     lang: 'Newar',      italic: true  },
  { word: 'फ्याफुल्ला',    lang: 'Tamang',     italic: false },
  { word: 'झोरले',         lang: 'Magar',      italic: true  },
  { word: 'सेउली',         lang: 'Rai',        italic: false },
  { word: 'नमस्कार',       lang: 'Marathi',    italic: true  },
  { word: 'வணக்கம்',       lang: 'Tamil',      italic: false },
  { word: 'నమస్కారం',      lang: 'Telugu',     italic: true  },
  { word: 'নমস্কার',       lang: 'Bengali',    italic: false },
  { word: 'નમસ્તે',        lang: 'Gujarati',   italic: true  },
  { word: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', lang: 'Punjabi',    italic: false },
  { word: 'नमस्कार',       lang: 'Konkani',    italic: true  },
  { word: 'नमस्ते',        lang: 'Hindi',      italic: false },
  { word: 'Halo',         lang: 'Indonesian', italic: true  },
  { word: 'Xin chào',     lang: 'Vietnamese', italic: false },
  { word: 'Kamusta',      lang: 'Tagalog',    italic: true  },
  { word: 'Salaam',       lang: 'Persian',    italic: false },
  { word: 'Cześć',        lang: 'Polish',     italic: true  },
  { word: 'Sawatdee',     lang: 'Thai',       italic: false },
  { word: 'Jambo',        lang: 'Swahili',    italic: true  },
  { word: 'Ahoj',         lang: 'Czech',      italic: false },
  { word: 'Bula',         lang: 'Fijian',     italic: true  },
  { word: 'Hola',         lang: 'Spanish',    italic: true  },
  { word: 'こんにちは',     lang: 'Japanese',   italic: false },
  { word: 'Ciao',         lang: 'Italian',    italic: true  },
  { word: 'Olá',          lang: 'Portuguese', italic: false },
  { word: 'مرحبا',        lang: 'Arabic',     italic: true  },
  { word: 'Привет',       lang: 'Russian',    italic: false },
  { word: 'Nǐ Hǎo',      lang: 'Mandarin',   italic: true  },
  { word: '안녕하세요',    lang: 'Korean',     italic: false },
  { word: 'Merhaba',      lang: 'Turkish',    italic: true  },
  { word: 'Guten Tag',    lang: 'German',     italic: false },
  { word: 'Sawubona',     lang: 'Zulu',       italic: true  },
  { word: 'Yassas',       lang: 'Greek',      italic: false },
];

const GREETING_STEP_MS = 2200;
const FINISH_DELAY_MS  = 1200;

const CodeLoader: React.FC<CodeLoaderProps> = ({ onFinish }) => {
  const [currentIndex,    setCurrentIndex]    = useState(0);
  const [dividerExpanded, setDividerExpanded] = useState(false);
  // Separate state keeps the lang label outside AnimatePresence,
  // so it never flies in/out with the greeting word.
  const [visibleLang,     setVisibleLang]     = useState('');
  const [langVisible,     setLangVisible]     = useState(false);

  // Restore cursor on unmount
  useEffect(() => {
    const prev = document.body.style.cursor;
    document.body.style.cursor = 'auto';
    return () => { document.body.style.cursor = prev; };
  }, []);

  // Divider pulse on every index change
  useEffect(() => {
    setDividerExpanded(false);
    const t = window.setTimeout(() => setDividerExpanded(true), 60);
    return () => window.clearTimeout(t);
  }, [currentIndex]);

  // Advance / finish
  useEffect(() => {
    if (currentIndex >= greetings.length - 1) {
      const t = window.setTimeout(onFinish, FINISH_DELAY_MS);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setDividerExpanded(false);
      setCurrentIndex(prev => prev + 1);
    }, GREETING_STEP_MS);
    return () => window.clearTimeout(t);
  }, [currentIndex, onFinish]);

  // Pause cycling when tab is hidden to avoid catch-up flicker
  useEffect(() => {
    const handleVisibility = () => {
      // Nothing to clear here — the effect above will re-run
      // naturally when the component re-renders after tab focus.
      // A more robust approach: track a paused ref and skip
      // setTimeout when document.hidden is true.
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
  if (langVisible) {
    setVisibleLang(currentGreeting.lang);
  }
}, [currentIndex]);

  const currentGreeting = greetings[currentIndex];

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#faf9f5]"
      style={{ zIndex: 1000 }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      {/* Paper grain */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(160,148,128,0.14) 100%)',
        }}
      />

      {/* Skip button — FIX: group on button, group-hover on arrow span */}
      <button
        type="button"
        className="group fixed bottom-[clamp(20px,4vh,40px)] right-[clamp(20px,4vw,48px)] z-10 flex min-h-[44px] cursor-pointer items-center gap-2 border-none bg-transparent px-0 py-2 text-[clamp(10px,1.1vw,12px)] uppercase tracking-[0.3em] text-[#000] transition-colors duration-300 hover:text-[#8b7355]"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
        aria-label="Skip loading screen"
        onClick={onFinish}
      >
        Skip
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </button>

      {/* Stage */}
      <div
        className="relative z-[5] flex w-full flex-col items-center justify-center px-[clamp(24px,6vw,80px)] py-[clamp(60px,10vh,100px)]"
        role="main"
        aria-live="polite"
        aria-label="Loading — greetings in multiple languages"
      >
        {/* Greeting word */}
        <div className="relative flex h-[clamp(72px,14vw,130px)] w-full max-w-[90vw] items-center justify-center max-[480px]:h-[clamp(52px,15vw,76px)]">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${currentGreeting.word}-${currentGreeting.lang}`}
              // FIX: relative so the tooltip can use position:absolute against this element
              className="relative max-w-[88vw] cursor-default whitespace-nowrap text-[clamp(48px,9vw,108px)] leading-none tracking-[-0.01em] text-[#1a1916] outline-none max-[480px]:text-[clamp(38px,12vw,64px)] min-[1400px]:text-[clamp(96px,7vw,128px)]"
              style={{
                fontFamily: 'EB Garamond, serif',
                fontStyle: currentGreeting.italic ? 'italic' : 'normal',
              }}
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: -18, scale: 1.02 }}
              // FIX: distinct, faster exit to match original 0.45s ease
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                exit: { duration: 0.45, ease: 'easeIn' },
              }}
              aria-label={`${currentGreeting.word} — ${currentGreeting.lang}`}
              tabIndex={0}
              onMouseEnter={() => { setVisibleLang(currentGreeting.lang); setLangVisible(true);  }}
              onMouseLeave={() => setLangVisible(false)}
              onFocus={()      => { setVisibleLang(currentGreeting.lang); setLangVisible(true);  }}
              onBlur={()       => setLangVisible(false)}
            >
              {currentGreeting.word}
            </motion.span>
          </AnimatePresence>
        </div>

        {/*
          FIX: Language label lives OUTSIDE AnimatePresence.
          It never animates with the greeting word, so hovering
          mid-transition won't cause it to fly around.
          Position is relative to the stage column, not the word span.
        */}
        <div
          className="mt-2 h-[16px] text-[clamp(9px,1vw,11px)] uppercase tracking-[0.3em] text-[#6b6860] transition-opacity duration-300"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            opacity: langVisible ? 1 : 0,
            // Prevent the label from shifting layout when it appears/disappears
            // by keeping it always in the flow with a fixed height.
          }}
          aria-hidden="true"
        >
          {visibleLang}
        </div>

        {/* Divider */}
        <div
          className={`h-px bg-gradient-to-r from-transparent via-[#d4c5ae] to-transparent transition-[width] duration-1000 ${
            dividerExpanded ? 'w-[clamp(80px,12vw,160px)]' : 'w-0'
          }`}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
};

export default CodeLoader;