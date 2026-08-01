import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './hero.css';

const Hero: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Inject hero-only external stylesheets ─────────────────────────────────
    function injectLink(attrs: Record<string, string>): HTMLLinkElement {
      const el = document.createElement('link');
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      el.dataset.heroAsset = '1';
      document.head.appendChild(el);
      return el;
    }

    const heroLinks = [
      injectLink({ rel: 'preconnect', href: 'https://fonts.googleapis.com' }),
      injectLink({ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }),
      injectLink({
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700;800&display=swap',
      }),
      injectLink({
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        crossorigin: 'anonymous',
        referrerpolicy: 'no-referrer',
      }),
    ];

    const root = rootRef.current;
    if (!root) return;

    // ── Counter animation ──────────────────────────────────────────────────────
    function animateCount(
      el: HTMLElement,
      target: number,
      prefix: string,
      duration = 1200,
    ) {
      let start: number | null = null;
      function step(ts: number) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        el.textContent = prefix + Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target;
      }
      requestAnimationFrame(step);
    }

    const counters = root.querySelectorAll<HTMLElement>('[data-target]');
    const seen = new WeakSet<Element>();

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen.has(entry.target)) {
            seen.add(entry.target);
            const el = entry.target as HTMLElement;
            const target = parseInt(el.dataset.target ?? '0', 10);
            const prefix =
              el.classList.contains('stat-num') &&
              el.textContent?.trim().startsWith('+')
                ? '+'
                : '';
            animateCount(el, target, prefix);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((c) => counterObserver.observe(c));

    // ── Role badge cycling ─────────────────────────────────────────────────────
    const roles = ['Developer', 'Designer'];
    const badgeText = root.querySelector<HTMLElement>('.badge-text');
    let roleIndex = 0;
    let roleInterval: ReturnType<typeof setInterval> | null = null;
    let roleTimeout: ReturnType<typeof setTimeout> | null = null;

    if (badgeText && roles.length > 0) {
      roleInterval = setInterval(() => {
        badgeText.classList.add('exit');

        roleTimeout = setTimeout(() => {
          roleIndex = (roleIndex + 1) % roles.length;
          badgeText.textContent = roles[roleIndex];

          badgeText.classList.remove('exit');
          badgeText.classList.add('enter-prepare');

          // Force reflow so CSS transition fires cleanly
          void badgeText.offsetHeight;

          badgeText.classList.remove('enter-prepare');
        }, 350);
      }, 3000);
    }

    // ── Stat card group-aware hover ────────────────────────────────────────────
    const statsRight = root.querySelector<HTMLElement>('.stats-right');
    const items = statsRight
      ? [...statsRight.querySelectorAll<HTMLElement>('.stat-item')]
      : [];

    let activeCard: HTMLElement | null = null;
    let activeItem: HTMLElement | null = null;
    let dismissTimer: ReturnType<typeof setTimeout> | null = null;

    function showCard(item: HTMLElement) {
      const card = item.querySelector<HTMLElement>('.stat-card');
      if (!card) return;

      if (activeCard && activeCard !== card) {
        activeCard.classList.remove('stat-card--visible', 'stat-card--dismissing');
        activeItem?.classList.remove('stat-item--active');
      }

      clearDismiss();
      activeCard = card;
      activeItem = item;

      card.classList.remove('stat-card--dismissing');
      void card.offsetWidth;
      card.classList.add('stat-card--visible');
      item.classList.add('stat-item--active');
    }

    function scheduleDismiss() {
      if (!activeCard) return;
      dismissTimer = setTimeout(() => {
        if (!activeCard) return;
        const cardRef = activeCard;
        const itemRef = activeItem;
        activeCard = null;
        activeItem = null;

        cardRef.classList.remove('stat-card--visible');
        cardRef.classList.add('stat-card--dismissing');
        itemRef?.classList.remove('stat-item--active');

        const cleanup = (e: TransitionEvent) => {
          if (e.propertyName !== 'opacity') return;
          cardRef.classList.remove('stat-card--dismissing');
          cardRef.removeEventListener('transitionend', cleanup);
        };
        cardRef.addEventListener('transitionend', cleanup);
      }, 200);
    }

    function clearDismiss() {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
        dismissTimer = null;
      }
    }

    items.forEach((item) => {
      item.addEventListener('mouseenter', () => showCard(item));
    });
    statsRight?.addEventListener('mouseleave', scheduleDismiss);
    statsRight?.addEventListener('mouseenter', clearDismiss);

    // ── Hire Me SVG border draw on hover ──────────────────────────────────────
    const btn = root.querySelector<HTMLElement>('.btn-fill');
    const rectEl = btn?.querySelector<SVGRectElement>('.btn-border-rect') ?? null;

    function syncRect() {
      if (!btn || !rectEl) return;
      const w = btn.offsetWidth;
      const h = btn.offsetHeight;
      rectEl.setAttribute('x', '1');
      rectEl.setAttribute('y', '1');
      rectEl.setAttribute('width', String(w - 2));
      rectEl.setAttribute('height', String(h - 2));
      const perimeter = 2 * (w + h - 4);
      rectEl.style.strokeDasharray = String(perimeter);
      rectEl.style.strokeDashoffset = String(perimeter);
    }

    syncRect();

    function onBtnEnter() {
      if (!rectEl) return;
      rectEl.style.transition = 'stroke-dashoffset .65s cubic-bezier(.65, 0, .35, 1)';
      rectEl.style.strokeDashoffset = '0';
    }
    function onBtnLeave() {
      if (!rectEl) return;
      rectEl.style.transition = 'none';
      rectEl.style.strokeDashoffset = rectEl.style.strokeDasharray;
    }

    btn?.addEventListener('mouseenter', onBtnEnter);
    btn?.addEventListener('mouseleave', onBtnLeave);
    window.addEventListener('resize', syncRect);

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      counterObserver.disconnect();
      if (roleInterval) clearInterval(roleInterval);
      if (roleTimeout) clearTimeout(roleTimeout);
      if (dismissTimer) clearTimeout(dismissTimer);
      btn?.removeEventListener('mouseenter', onBtnEnter);
      btn?.removeEventListener('mouseleave', onBtnLeave);
      window.removeEventListener('resize', syncRect);
      heroLinks.forEach((el) => el.parentNode?.removeChild(el));
    };
  }, []);

  return (
    <div ref={rootRef} className="hero-section-root">
      {/* ── HERO ── */}
      <section className="hero" id="home">

        {/* Right panel — image + floating badges + newsletter */}
        <div className="hero-right">
          <div className="hero-copy">
            <div className="word active">Design</div>
            <div className="word">Develop</div>
            <div className="word active">Deliver</div>
          </div>

          {/* Node.js badge */}
          <div className="float-badge badge-js">
            <i className="fa-brands fa-node-js"></i>
            <div className="sub-bubbles">
              <div className="sub-bubble" style={{ '--delay': 1 } as React.CSSProperties} title="React">
                <i className="fa-brands fa-react"></i>
              </div>
              <div className="sub-bubble" style={{ '--delay': 2 } as React.CSSProperties} title="JavaScript">
                <i className="fa-brands fa-js"></i>
              </div>
              <div className="sub-bubble" style={{ '--delay': 3 } as React.CSSProperties} title="Vue.js">
                <i className="fa-brands fa-vuejs"></i>
              </div>
            </div>
          </div>

          {/* Figma badge */}
          <div className="float-badge badge-figma">
            <i className="fa-brands fa-figma"></i>
            <div className="sub-bubbles">
              <div className="sub-bubble" style={{ '--delay': 1 } as React.CSSProperties} title="Vector Paths">
                <i className="fa-solid fa-bezier-curve"></i>
              </div>
              <div className="sub-bubble" style={{ '--delay': 2 } as React.CSSProperties} title="Color Theory">
                <i className="fa-solid fa-palette"></i>
              </div>
              <div className="sub-bubble" style={{ '--delay': 3 } as React.CSSProperties} title="UI Design">
                <i className="fa-solid fa-pen-nib"></i>
              </div>
            </div>
          </div>

          {/* Python badge */}
          <div className="float-badge badge-py">
            <i className="fa-brands fa-python"></i>
            <div className="sub-bubbles">
              <div className="sub-bubble" style={{ '--delay': 1 } as React.CSSProperties} title="Database">
                <i className="fa-solid fa-database"></i>
              </div>
              <div className="sub-bubble" style={{ '--delay': 2 } as React.CSSProperties} title="Infrastructure">
                <i className="fa-solid fa-server"></i>
              </div>
              <div className="sub-bubble" style={{ '--delay': 3 } as React.CSSProperties} title="Scripting">
                <i className="fa-solid fa-terminal"></i>
              </div>
            </div>
          </div>

          <div className="newsletter-bar">
            <input type="email" placeholder="Subscribe my Newsletter" />
            <button aria-label="Subscribe">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Left panel — copy, CTA, stats */}
        <div className="hero-left">
          <div className="greeting-row">
            <h1><span className="hi-line">Hi! I Am</span></h1>
            <span className="badge-dev"><span className="badge-text">Developer</span></span>
          </div>
          <h1 style={{ marginTop: '-24px' }}>Ritesh Raj Pandit</h1>

          <p className="hero-desc">
            Bringing imaginations to user experience with code as a{' '}
            <b>designer</b> and <b>developer</b>
          </p>

          <div className="cta-row">
            <Link to="/contact" className="btn-fill">
              Hire Me
              <svg className="btn-border" aria-hidden="true">
                <rect className="btn-border-rect" rx="8" ry="8" />
              </svg>
            </Link>
            <Link to="/projects" className="link-arrow">
              Projects <i className="fa-solid fa-arrow-up-right"></i>
            </Link>
          </div>

          <div className="stat-row">
            <div className="stat-block">
              <div className="stat-num" data-target="1">+0</div>
              <div className="stat-label">Clients on work worldwide</div>
            </div>
            <div className="stat-block">
              <div className="stat-num" data-target="3">0</div>
              <div className="stat-label">Projects Done</div>
            </div>
            <div className="stat-block" id="contact">
              <div className="contact-label">Contact</div>
              <div className="contact-email">wooliecodes@gmail.com</div>
            </div>
          </div>
        </div>

      </section>

      {/* ── PROJECT STATS ── */}
      <section className="stats-section">
        <div className="stats-left">
          <h2>Project Statistics 2022</h2>
          <button className="btn-know">Know More</button>
        </div>

        <div className="stats-right">

          {/* Website Designs */}
          <div className="stat-item">
            <div className="stat-card">
              <div className="stat-card-slides">
                <div className="stat-card-slide slide-web-1">
                  <div className="card-mockup web-1">
                    <div className="mockup-header">
                      <span className="dot-red"></span>
                      <span className="dot-yellow"></span>
                      <span className="dot-green"></span>
                    </div>
                    <div className="mockup-content">
                      <i className="fa-solid fa-chart-pie mockup-icon"></i>
                      <div className="mockup-title">SaaS UI</div>
                      <div className="mockup-bars">
                        <div className="mockup-bar" style={{ width: '80%' }}></div>
                        <div className="mockup-bar" style={{ width: '45%' }}></div>
                        <div className="mockup-bar" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="stat-card-slide slide-web-2">
                  <div className="card-mockup web-2">
                    <div className="mockup-header">
                      <span className="dot-red"></span>
                      <span className="dot-yellow"></span>
                      <span className="dot-green"></span>
                    </div>
                    <div className="mockup-content">
                      <i className="fa-solid fa-basket-shopping mockup-icon"></i>
                      <div className="mockup-title">Storefront</div>
                      <div className="mockup-grid">
                        <div className="mockup-item"></div>
                        <div className="mockup-item"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="stat-card-slide slide-web-3">
                  <div className="card-mockup web-3">
                    <div className="mockup-header">
                      <span className="dot-red"></span>
                      <span className="dot-yellow"></span>
                      <span className="dot-green"></span>
                    </div>
                    <div className="mockup-content">
                      <i className="fa-solid fa-circle-user mockup-icon"></i>
                      <div className="mockup-title">Profile</div>
                      <div className="mockup-profile">
                        <div className="mockup-avatar"></div>
                        <div className="mockup-line" style={{ width: '80%' }}></div>
                        <div className="mockup-line" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-label-container">
              <span className="label stat-trigger">Website Designs</span>
            </div>
            <span className="count" data-target="3">0</span>
          </div>

          {/* Mobile Apps */}
          <div className="stat-item">
            <div className="stat-card">
              <div className="stat-card-slides">
                <div className="stat-card-slide slide-app-1">
                  <div className="card-mockup app-1">
                    <div className="phone-notch"></div>
                    <div className="mockup-content" style={{ marginTop: '6px' }}>
                      <i className="fa-solid fa-wallet mockup-icon"></i>
                      <div className="mockup-title">Wallet</div>
                      <div className="mockup-balance">$14,250</div>
                      <div className="mockup-card-shape"></div>
                    </div>
                  </div>
                </div>
                <div className="stat-card-slide slide-app-2">
                  <div className="card-mockup app-2">
                    <div className="phone-notch"></div>
                    <div className="mockup-content" style={{ marginTop: '6px' }}>
                      <i className="fa-solid fa-heart-pulse mockup-icon"></i>
                      <div className="mockup-title">Fitness</div>
                      <div className="heart-pulse-wave">
                        <i className="fa-solid fa-wave-square"></i>
                      </div>
                      <div className="mockup-steps">8,421 steps</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-label-container">
              <span className="label stat-trigger">Mobile Apps</span>
            </div>
            <span className="count" data-target="2">0</span>
          </div>

          {/* Brand Identity */}
          <div className="stat-item">
            <div className="stat-card">
              <div className="stat-card-slides">
                <div className="stat-card-slide slide-brand-1">
                  <div className="card-mockup brand-1">
                    <div className="mockup-content">
                      <div className="brand-logo"><i className="fa-solid fa-shapes"></i></div>
                      <div className="mockup-title">Identity</div>
                      <div className="brand-colors">
                        <span className="color-dot" style={{ background: '#ff5c00' }}></span>
                        <span className="color-dot" style={{ background: '#a259ff' }}></span>
                        <span className="color-dot" style={{ background: '#00c2ff' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="stat-card-slide slide-brand-2">
                  <div className="card-mockup brand-2">
                    <div className="mockup-content">
                      <i className="fa-solid fa-envelope-open-text mockup-icon" style={{ color: '#2a2b2f' }}></i>
                      <div className="mockup-title" style={{ color: '#2a2b2f' }}>Collateral</div>
                      <div className="stationery-mockup">
                        <div className="mockup-paper-sheet"></div>
                        <div className="mockup-card-sheet"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-label-container">
              <span className="label stat-trigger">Brand Identity</span>
            </div>
            <span className="count" data-target="2">0</span>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Hero;
