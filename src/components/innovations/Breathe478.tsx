import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  HelpCircle,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Settings,
  SkipForward,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import './Breathe478.css';

type ViewMode = 'landing' | 'session' | 'complete';
type Phase = 'inhale' | 'hold' | 'exhale';
type SoundPack = 'sine' | 'bell' | 'ocean';

const PHASES: Phase[] = ['inhale', 'hold', 'exhale'];
const DURATIONS: Record<Phase, number> = { inhale: 4, hold: 7, exhale: 8 };
const PHASE_LABELS: Record<Phase, string> = { inhale: 'Inhale', hold: 'Hold', exhale: 'Exhale' };
const ARC_CIRC = 2 * Math.PI * 120;

const PHASE_COLORS: Record<
  Phase,
  { stroke: string; fill: string; petal: string; ring: string; word: string }
> = {
  inhale: {
    stroke: '#4a90d9',
    fill: 'url(#gInhale)',
    petal: 'rgba(74,144,217,0.4)',
    ring: 'rgba(74,144,217,0.3)',
    word: 'var(--accent2)',
  },
  hold: {
    stroke: '#7c6fd4',
    fill: 'url(#gHold)',
    petal: 'rgba(124,111,212,0.4)',
    ring: 'rgba(124,111,212,0.3)',
    word: 'var(--hold)',
  },
  exhale: {
    stroke: '#4ab8a0',
    fill: 'url(#gExhale)',
    petal: 'rgba(74,184,160,0.35)',
    ring: 'rgba(74,184,160,0.25)',
    word: 'var(--exhale)',
  },
};

const Breathe478 = () => {
  const [view, setView] = useState<ViewMode>('landing');
  const [phase, setPhase] = useState<Phase>('inhale');
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(4);
  const [soundPack, setSoundPack] = useState<SoundPack>('sine');
  const [soundOn, setSoundOn] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [autoPause, setAutoPause] = useState(true);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [phaseDuration, setPhaseDuration] = useState(DURATIONS.inhale);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [pausedBannerVisible, setPausedBannerVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const stateRef = useRef({
    view,
    running,
    paused,
    phase,
    cycle,
    totalCycles,
    phaseElapsed,
    phaseDuration,
    soundPack,
    soundOn,
    autoPause,
  });

  useEffect(() => {
    stateRef.current = {
      view,
      running,
      paused,
      phase,
      cycle,
      totalCycles,
      phaseElapsed,
      phaseDuration,
      soundPack,
      soundOn,
      autoPause,
    };
  }, [view, running, paused, phase, cycle, totalCycles, phaseElapsed, phaseDuration, soundPack, soundOn, autoPause]);

  const showToast = useCallback((message: string) => {
    setToastText(message);
    setToastVisible(true);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const getAudioCtx = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      void audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (pack: SoundPack, tonePhase: Phase) => {
      if (!stateRef.current.soundOn) {
        return;
      }

      try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0, now);
        master.connect(ctx.destination);

        if (pack === 'sine') {
          if (tonePhase === 'inhale') {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.linearRampToValueAtTime(440, now + 1.2);
            osc.connect(master);
            master.gain.linearRampToValueAtTime(0.18, now + 0.15);
            master.gain.linearRampToValueAtTime(0.08, now + 1.2);
            master.gain.linearRampToValueAtTime(0, now + 1.6);
            osc.start(now);
            osc.stop(now + 1.7);

            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(440, now);
            osc2.frequency.linearRampToValueAtTime(660, now + 1.2);
            const g2 = ctx.createGain();
            g2.gain.setValueAtTime(0.06, now);
            g2.gain.linearRampToValueAtTime(0, now + 1.4);
            osc2.connect(g2);
            g2.connect(ctx.destination);
            osc2.start(now);
            osc2.stop(now + 1.5);
          } else if (tonePhase === 'hold') {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(528, now);
            osc.connect(master);
            master.gain.linearRampToValueAtTime(0.2, now + 0.05);
            master.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
            osc.start(now);
            osc.stop(now + 2);
          } else {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(396, now);
            osc.frequency.linearRampToValueAtTime(176, now + 1.8);
            osc.connect(master);
            master.gain.linearRampToValueAtTime(0.15, now + 0.1);
            master.gain.linearRampToValueAtTime(0, now + 2);
            osc.start(now);
            osc.stop(now + 2.1);
          }
        } else if (pack === 'bell') {
          const freqs: Record<Phase, number[]> = {
            inhale: [659, 880, 1100],
            hold: [440, 660],
            exhale: [330, 220, 165],
          };
          freqs[tonePhase].forEach((freq, index) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const gain = ctx.createGain();
            const t = now + index * 0.22;
            gain.gain.setValueAtTime(0.001, t);
            gain.gain.linearRampToValueAtTime(tonePhase === 'hold' ? 0.18 : 0.14, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 1.8);
          });
        } else {
          const bufferLength = ctx.sampleRate * 2.5;
          const buffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferLength; i += 1) {
            data[i] = Math.random() * 2 - 1;
          }
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = tonePhase === 'inhale' ? 600 : tonePhase === 'hold' ? 300 : 200;
          filter.Q.value = 0.8;
          source.connect(filter);
          filter.connect(master);
          master.gain.linearRampToValueAtTime(0.22, now + 0.3);
          master.gain.linearRampToValueAtTime(0.12, now + 1.5);
          master.gain.linearRampToValueAtTime(0, now + 2.5);
          source.start(now);
          source.stop(now + 2.8);
        }
      } catch {
        // Keep session running even if audio fails.
      }
    },
    [getAudioCtx]
  );

  const acquireWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) {
      return;
    }
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
    } catch {
      wakeLockRef.current = null;
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (!wakeLockRef.current) {
      return;
    }
    try {
      await wakeLockRef.current.release();
    } catch {
      // no-op
    }
    wakeLockRef.current = null;
  }, []);

  const endSession = useCallback(async () => {
    setRunning(false);
    setPaused(false);
    setPausedBannerVisible(false);
    setView('complete');
    await releaseWakeLock();
  }, [releaseWakeLock]);

  const advancePhase = useCallback(() => {
    const s = stateRef.current;
    const currentIndex = PHASES.indexOf(s.phase);
    const nextIndex = (currentIndex + 1) % PHASES.length;

    let nextCycle = s.cycle;
    if (nextIndex === 0) {
      nextCycle += 1;
      setCycle(nextCycle);
      if (nextCycle >= s.totalCycles) {
        void endSession();
        return;
      }
    }

    const nextPhase = PHASES[nextIndex];
    setPhase(nextPhase);
    setPhaseDuration(DURATIONS[nextPhase]);
    setPhaseElapsed(0);
    lastTimestampRef.current = null;
    playTone(s.soundPack, nextPhase);
  }, [endSession, playTone]);

  const startSession = useCallback(async () => {
    setView('session');
    setCycle(0);
    setPhase('inhale');
    setPhaseDuration(DURATIONS.inhale);
    setPhaseElapsed(0);
    setRunning(true);
    setPaused(false);
    setPausedBannerVisible(false);
    lastTimestampRef.current = null;
    await acquireWakeLock();
    playTone(stateRef.current.soundPack, 'inhale');
  }, [acquireWakeLock, playTone]);

  const pauseSession = useCallback(async () => {
    setPaused(true);
    await releaseWakeLock();
  }, [releaseWakeLock]);

  const resumeSession = useCallback(async () => {
    setPaused(false);
    setPausedBannerVisible(false);
    lastTimestampRef.current = null;
    await acquireWakeLock();
  }, [acquireWakeLock]);

  const resetSession = useCallback(async () => {
    setRunning(false);
    setPaused(false);
    setPausedBannerVisible(false);
    setPhase('inhale');
    setPhaseDuration(DURATIONS.inhale);
    setPhaseElapsed(0);
    setCycle(0);
    setView('landing');
    await releaseWakeLock();
  }, [releaseWakeLock]);

  useEffect(() => {
    if (!running || paused) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const frame = (timestamp: number) => {
      const s = stateRef.current;
      if (!s.running || s.paused) {
        return;
      }

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const delta = (timestamp - (lastTimestampRef.current ?? timestamp)) / 1000;
      lastTimestampRef.current = timestamp;
      const nextElapsed = s.phaseElapsed + delta;

      if (nextElapsed >= s.phaseDuration) {
        setPhaseElapsed(s.phaseDuration);
        advancePhase();
      } else {
        setPhaseElapsed(nextElapsed);
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
    };
  }, [running, paused, advancePhase]);

  useEffect(() => {
    const body = document.body;
    if (lightMode) {
      body.classList.add('light-mode');
    } else {
      body.classList.remove('light-mode');
    }

    const themeMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (themeMeta) {
      themeMeta.content = lightMode ? '#e4ecf7' : '#0a0f1e';
    }
  }, [lightMode]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const s = stateRef.current;
      if (document.hidden && s.running && !s.paused && s.autoPause) {
        void pauseSession();
        setPausedBannerVisible(true);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [pauseSession]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        if (stateRef.current.view === 'landing') {
          void startSession();
        } else if (stateRef.current.view === 'session') {
          if (stateRef.current.paused) {
            void resumeSession();
          } else {
            void pauseSession();
          }
        }
      }

      if (event.key === 'ArrowRight' && stateRef.current.view === 'session' && stateRef.current.running) {
        advancePhase();
      }

      if ((event.key === 'r' || event.key === 'R') && stateRef.current.view === 'session') {
        void resetSession();
      }

      if (event.key === 's' || event.key === 'S') {
        setSoundOn((prev) => {
          const next = !prev;
          if (next) {
            getAudioCtx();
          }
          showToast(next ? 'Sound on' : 'Sound off');
          return next;
        });
      }

      if (event.key === 't' || event.key === 'T') {
        setLightMode((prev) => {
          const next = !prev;
          showToast(next ? 'Light mode' : 'Dark mode');
          return next;
        });
      }

      if (event.key === 'Escape') {
        setSettingsOpen(false);
        setHelpOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [advancePhase, getAudioCtx, pauseSession, resetSession, resumeSession, showToast, startSession]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      void releaseWakeLock();
      document.body.classList.remove('light-mode');
    };
  }, [releaseWakeLock]);

  const progress = Math.min(phaseElapsed / Math.max(phaseDuration, 0.0001), 1);
  const phaseColor = PHASE_COLORS[phase];
  const cycleText = `Cycle ${Math.min(cycle + 1, totalCycles)} of ${totalCycles}`;
  const activeCycleIndex = Math.min(cycle, Math.max(totalCycles - 1, 0));

  const breathingVisual = useMemo(() => {
    let scale = 1;
    let glowOpacity = 0;

    if (phase === 'inhale') {
      scale = 0.3 + progress * 0.7;
      glowOpacity = progress * 0.85;
    } else if (phase === 'hold') {
      scale = 1;
      glowOpacity = 0.85;
    } else {
      scale = 1 - progress * 0.7;
      glowOpacity = (1 - progress) * 0.85;
    }

    return {
      scale,
      glowOpacity,
      glowRadius: 40 + scale * 70,
      dashOffset: ARC_CIRC * (1 - progress),
      remaining: Math.ceil(phaseDuration - phaseElapsed),
    };
  }, [phase, progress, phaseDuration, phaseElapsed]);

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev;
      if (next) {
        getAudioCtx();
      }
      showToast(next ? 'Sound on' : 'Sound off');
      return next;
    });
  };

  const toggleTheme = () => {
    setLightMode((prev) => {
      const next = !prev;
      showToast(next ? 'Light mode' : 'Dark mode');
      return next;
    });
  };

  const selectCycles = (value: number) => {
    setTotalCycles(value);
    showToast(`${value} cycles set`);
  };

  const selectPack = (pack: SoundPack) => {
    setSoundPack(pack);
    showToast(`Sound: ${pack === 'sine' ? 'Tones' : pack === 'bell' ? 'Bells' : 'Ocean'}`);
  };

  const skipPhase = () => {
    if (!running) {
      return;
    }
    advancePhase();
  };

  return (
    <div className="breathe-container">
      <div className={`ambient phase-${phase}`} />

      <header className="header" role="banner">
        <div className="logo">
          4<span>·</span>7<span>·</span>8 <span style={{ opacity: 0.4, margin: '0 4px' }}>|</span> breathe
        </div>
        <div className="header-controls">
          <button
            className={`icon-btn ${soundOn ? 'active' : ''}`}
            aria-label={soundOn ? 'Sound on' : 'Sound off'}
            aria-pressed={soundOn}
            title="Toggle sound (S)"
            onClick={toggleSound}
          >
            {soundOn ? <Volume2 size={18} strokeWidth={2} /> : <VolumeX size={18} strokeWidth={2} />}
          </button>
          <button className="icon-btn" aria-label="Toggle light mode" title="Toggle theme (T)" onClick={toggleTheme}>
            {lightMode ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
          </button>
          <button className="icon-btn" aria-label="Open settings" title="Settings" onClick={() => setSettingsOpen(true)}>
            <Settings size={18} strokeWidth={2} />
          </button>
          <button className="icon-btn" aria-label="How it works" title="Help" onClick={() => setHelpOpen(true)}>
            <HelpCircle size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      {view === 'landing' && (
        <main className="view landing" role="main" aria-label="Landing">
          <p className="landing-eyebrow">The breathing cheat code</p>
          <h1 className="landing-title">
            Deep <em>rest</em>,
            <br />
            on demand.
          </h1>
          <p className="landing-sub">
            4 seconds inhale. 7 seconds hold. 8 seconds exhale. A single cycle activates your body's
            rest-and-digest response.
          </p>
          <div className="landing-pillars" aria-label="Breathing phases">
            <div className="pillar">
              <span className="pillar-num" style={{ color: 'var(--accent2)' }}>
                4s
              </span>
              <span className="pillar-label">Inhale</span>
            </div>
            <div className="pillar">
              <span className="pillar-num" style={{ color: 'var(--hold)' }}>
                7s
              </span>
              <span className="pillar-label">Hold</span>
            </div>
            <div className="pillar">
              <span className="pillar-num" style={{ color: 'var(--exhale)' }}>
                8s
              </span>
              <span className="pillar-label">Exhale</span>
            </div>
          </div>
          <button className="start-btn" aria-label="Start breathing session" onClick={() => void startSession()}>
            Begin Session
          </button>
        </main>
      )}

      {view === 'session' && (
        <section className="view session" role="main" aria-label="Breathing session" aria-live="polite">
          <div className="phase-label">{cycleText}</div>
          <div className="phase-word" style={{ color: phaseColor.word }}>
            {PHASE_LABELS[phase]}
          </div>

          <div className="breather-wrap" aria-hidden="true">
            <div className="ring-outer" style={{ borderColor: phaseColor.ring }}></div>
            <div className="ring-mid"></div>
            <svg className="breather-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <radialGradient id="gInhale" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6bb8f0" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#4a90d9" stopOpacity="0.2" />
                </radialGradient>
                <radialGradient id="gHold" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a090e8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#7c6fd4" stopOpacity="0.2" />
                </radialGradient>
                <radialGradient id="gExhale" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#60d0b8" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#4ab8a0" stopOpacity="0.1" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <circle
                cx="150"
                cy="150"
                r={breathingVisual.glowRadius}
                fill={phaseColor.fill}
                filter="url(#glow)"
                opacity={breathingVisual.glowOpacity}
              />

              <g className="petal-group" transform={`translate(150,150) scale(${breathingVisual.scale})`} opacity="0.6">
                <ellipse rx="18" ry="52" transform="rotate(0) translate(0,-36)" fill={phaseColor.petal} />
                <ellipse rx="18" ry="52" transform="rotate(60) translate(0,-36)" fill={phaseColor.petal} />
                <ellipse rx="18" ry="52" transform="rotate(120) translate(0,-36)" fill={phaseColor.petal} />
                <ellipse rx="18" ry="52" transform="rotate(180) translate(0,-36)" fill={phaseColor.petal} />
                <ellipse rx="18" ry="52" transform="rotate(240) translate(0,-36)" fill={phaseColor.petal} />
                <ellipse rx="18" ry="52" transform="rotate(300) translate(0,-36)" fill={phaseColor.petal} />
              </g>

              <circle className="arc-track" cx="150" cy="150" r="120" />
              <circle
                className="arc-progress"
                cx="150"
                cy="150"
                r="120"
                strokeDasharray={ARC_CIRC}
                strokeDashoffset={breathingVisual.dashOffset}
                stroke={phaseColor.stroke}
              />

              <text className="center-time" x="150" y="144">
                {breathingVisual.remaining > 0 ? breathingVisual.remaining : ''}
              </text>
              <text className="center-sub" x="150" y="170">
                {PHASE_LABELS[phase].toLowerCase()}
              </text>
            </svg>
          </div>

          <div className="cycle-dots" aria-label="Cycle progress">
            {Array.from({ length: totalCycles }).map((_, index) => {
              const className =
                index < cycle ? 'dot complete' : index === activeCycleIndex ? 'dot active' : 'dot';
              return <div key={`dot-${index + 1}`} className={className} aria-label={`Cycle ${index + 1}`} />;
            })}
          </div>

          <div
            className="phase-bar-wrap"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Phase progress"
          >
            <div className="phase-bar" style={{ width: `${progress * 100}%`, background: phaseColor.stroke }}></div>
          </div>

          <div className="session-controls">
            <button className="ctrl-btn" aria-label="Reset session" title="Reset (R)" onClick={() => void resetSession()}>
              <RotateCcw size={18} strokeWidth={2} />
            </button>
            <button
              className="ctrl-btn primary"
              aria-label={paused ? 'Resume session' : 'Pause session'}
              title="Pause (Space)"
              onClick={() => {
                if (!running) {
                  return;
                }
                if (paused) {
                  void resumeSession();
                } else {
                  void pauseSession();
                }
              }}
            >
              {paused ? <Play size={18} strokeWidth={2} /> : <Pause size={18} strokeWidth={2} />}
            </button>
            <button className="ctrl-btn" aria-label="Skip to next phase" title="Skip phase (→)" onClick={skipPhase}>
              <SkipForward size={18} strokeWidth={2} />
            </button>
          </div>
        </section>
      )}

      {view === 'complete' && (
        <section className="view complete" role="main" aria-label="Session complete">
          <div className="complete-icon" aria-hidden="true">
            <Moon size={34} strokeWidth={2} />
          </div>
          <h2 className="complete-title">Well done.</h2>
          <p className="complete-sub">
            Your nervous system has shifted. Notice the stillness. Your body knows how to rest, you just gave it the signal.
          </p>
          <div className="complete-actions">
            <button className="complete-btn primary" onClick={() => void startSession()}>
              Practice Again
            </button>
            <button className="complete-btn" onClick={() => setSettingsOpen(true)}>
              Change Settings
            </button>
          </div>
          <div className="resources-link" aria-label="Research resources">
            Research:{' '}
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5455070/" target="_blank" rel="noopener noreferrer" aria-label="NIH research on breathing">
              NIH Study
            </a>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/relaxation-technique/art-20045368" target="_blank" rel="noopener noreferrer" aria-label="Mayo Clinic relaxation techniques">
              Mayo Clinic
            </a>
          </div>
        </section>
      )}

      <div className={`paused-banner ${pausedBannerVisible ? 'visible' : ''}`} role="status" aria-live="assertive">
        <p>Session paused</p>
        <h2>Tab away, I am here.</h2>
        <button
          className="ctrl-btn primary"
          aria-label="Resume session"
          onClick={() => void resumeSession()}
          style={{ width: 'auto', padding: '0 32px', borderRadius: '50px', fontFamily: 'var(--mono)', fontSize: '13px', letterSpacing: '0.12em' }}
        >
          Resume →
        </button>
      </div>

      <div
        className={`panel-overlay ${settingsOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={(event) => {
          if (event.currentTarget === event.target) {
            setSettingsOpen(false);
          }
        }}
      >
        <div className="panel">
          <div className="panel-handle" aria-hidden="true"></div>
          <p className="panel-title">Session settings</p>

          <div className="setting-row">
            <div className="setting-label">
              Cycles
              <small>Full breath rounds</small>
            </div>
            <div className="seg-ctrl" role="group" aria-label="Select number of cycles">
              {[2, 4, 8].map((value) => (
                <button key={`cycles-${value}`} className={`seg-btn ${totalCycles === value ? 'active' : ''}`} aria-pressed={totalCycles === value} onClick={() => selectCycles(value)}>
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-label">
              Sound pack
              <small>Audio guidance style</small>
            </div>
            <div className="seg-ctrl" role="group" aria-label="Select sound pack">
              {[
                { label: 'Tones', value: 'sine' as SoundPack },
                { label: 'Bells', value: 'bell' as SoundPack },
                { label: 'Ocean', value: 'ocean' as SoundPack },
              ].map((pack) => (
                <button key={pack.value} className={`seg-btn ${soundPack === pack.value ? 'active' : ''}`} aria-pressed={soundPack === pack.value} onClick={() => selectPack(pack.value)}>
                  {pack.label}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-label">
              Auto-pause on tab switch
              <small>Pause when you navigate away</small>
            </div>
            <div className="seg-ctrl" role="group" aria-label="Auto-pause setting">
              <button className={`seg-btn ${autoPause ? 'active' : ''}`} aria-pressed={autoPause} onClick={() => setAutoPause(true)}>
                On
              </button>
              <button className={`seg-btn ${!autoPause ? 'active' : ''}`} aria-pressed={!autoPause} onClick={() => setAutoPause(false)}>
                Off
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`help-overlay ${helpOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="How it works"
        onClick={(event) => {
          if (event.currentTarget === event.target) {
            setHelpOpen(false);
          }
        }}
      >
        <div className="help-card">
          <h2>The 4·7·8 technique</h2>
          <p>
            Developed by Dr. Andrew Weil, this breathing pattern acts as a natural tranquilizer for the nervous system. With practice, it becomes more effective.
          </p>
          <ul className="help-steps">
            <li>
              <span className="step-num inhale">4</span>
              <div className="step-info">
                <h4>Inhale through your nose</h4>
                <p>Breathe in slowly and steadily for 4 seconds, filling your lungs fully.</p>
              </div>
            </li>
            <li>
              <span className="step-num hold">7</span>
              <div className="step-info">
                <h4>Hold the breath</h4>
                <p>Keep the air in. This allows oxygen to saturate the bloodstream.</p>
              </div>
            </li>
            <li>
              <span className="step-num exhale">8</span>
              <div className="step-info">
                <h4>Exhale through your mouth</h4>
                <p>Release slowly, completely emptying the lungs. Let tension leave.</p>
              </div>
            </li>
          </ul>
          <p style={{ marginTop: '16px', marginBottom: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Keyboard: <strong style={{ color: 'var(--text)' }}>Space</strong> pause · <strong style={{ color: 'var(--text)' }}>S</strong> sound · <strong style={{ color: 'var(--text)' }}>T</strong> theme · <strong style={{ color: 'var(--text)' }}>R</strong> reset · <strong style={{ color: 'var(--text)' }}>→</strong> skip
          </p>
          <button className="help-close" aria-label="Close help" onClick={() => setHelpOpen(false)}>
            Got it
          </button>
        </div>
      </div>

      <div className={`toast ${toastVisible ? 'show' : ''}`} role="status" aria-live="polite">
        {toastText}
      </div>
    </div>
  );
};

export default Breathe478;
