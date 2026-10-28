import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import ParticleNetwork from './components/ParticleNetwork';
import ProjectGallery from './components/ProjectGallery';
import StatusPanel from './components/StatusPanel';
import WindowManager, { type OpenWindowRequest } from './components/WindowManager';
import { projects } from '../projects/registry';
import type { Language } from '../projects/types';
import { t } from '../i18n/translations';

const LANGUAGE_STORAGE_KEY = 'sief-portfolio-language';

function readSavedLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'ja' || stored === 'ar') return stored;
  } catch {
    // Storage can be disabled; English remains the safe default.
  }
  return 'en';
}

export default function App() {
  const [language, setLanguage] = useState<Language>(readSavedLanguage);
  const [glitching, setGlitching] = useState(false);
  const [openRequest, setOpenRequest] = useState<OpenWindowRequest | null>(null);
  const requestCounter = useRef(0);
  const glitchTimer = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = language === 'ar' ? 'سيف — مطور برمجيات' : language === 'ja' ? 'Sief — ソフトウェア開発者' : 'Sief — Software Developer';
    try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* Ignore unavailable storage. */ }
  }, [language]);

  useEffect(() => () => {
    if (glitchTimer.current !== null) window.clearTimeout(glitchTimer.current);
  }, []);

  const changeLanguage = useCallback((nextLanguage: Language) => {
    if (nextLanguage === language) return;
    setGlitching(true);
    setLanguage(nextLanguage);
    if (glitchTimer.current !== null) window.clearTimeout(glitchTimer.current);
    glitchTimer.current = window.setTimeout(() => setGlitching(false), 440);
  }, [language]);

  const handleOpenProject = useCallback((id: string) => {
    requestCounter.current += 1;
    setOpenRequest({ id, requestId: requestCounter.current });
    const hero = document.getElementById('home');
    if (hero && window.scrollY > hero.offsetTop + hero.offsetHeight * 0.45) {
      hero.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }, []);

  const clearOpenRequest = useCallback(() => setOpenRequest(null), []);

  return (
    <div className={`site-shell${glitching ? ' language-glitch-active' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language}>
      <ParticleNetwork />
      <Header language={language} onLanguageChange={changeLanguage} />
      <main>
        <section className="hero-section" id="home" aria-labelledby="hero-title">
          <div className="hero-orbit-label hero-orbit-label-top" aria-hidden="true"><span className="tiny-cross">+</span> INDEPENDENT BY DESIGN</div>
          <div className="hero-orbit-label hero-orbit-label-bottom" aria-hidden="true"><span className="tiny-cross">+</span> BUILD / ITERATE / IMPROVE</div>
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow glitchable"><span className="eyebrow-line" />{t(language, 'eyebrow')}</p>
            <h1 id="hero-title" className={`hero-name glitchable${glitching ? ' glitch-text' : ''}`} data-text={t(language, 'name')}>{t(language, 'name')}<span className="hero-name-period">.</span></h1>
            <p className="hero-tagline glitchable">{t(language, 'tagline')}</p>
            <StatusPanel language={language} />
          </div>
          <div className="hero-bottomline">
            <a className="scroll-cue glitchable" href="#projects"><span className="scroll-cue-line" /><span>{t(language, 'scroll')}</span><span className="scroll-arrow">↓</span></a>
            <span className="hero-coordinate" aria-hidden="true">30°02′N&nbsp; 31°13′E</span>
          </div>
          <WindowManager projects={projects} language={language} openRequest={openRequest} onRequestHandled={clearOpenRequest} />
        </section>

        <ProjectGallery projects={projects} language={language} onOpenProject={handleOpenProject} />

        <section className="about-section" id="about">
          <div className="section-number">01 <span>/ ABOUT</span></div>
          <div className="about-layout">
            <div className="about-heading">
              <p className="eyebrow glitchable"><span className="eyebrow-line" />{t(language, 'aboutEyebrow')}</p>
              <h2 className="glitchable">{t(language, 'aboutTitle')}</h2>
            </div>
            <div className="about-detail">
              <span className="detail-index">A—01</span>
              <p className="about-body glitchable">{t(language, 'aboutBody')}</p>
              <div className="values-row"><span>01 / PRACTICAL</span><span>02 / THOUGHTFUL</span><span>03 / EXTENSIBLE</span></div>
            </div>
          </div>
          <div className="about-bottom-rule"><span>SOFTWARE IS A CRAFT</span><span>EGYPT · MMXXVI</span></div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-left">
            <p className="eyebrow glitchable"><span className="eyebrow-line" />{t(language, 'contactEyebrow')}</p>
            <h2 className="glitchable">{t(language, 'contactTitle')}</h2>
            <p className="contact-description glitchable">{t(language, 'contactBody')}</p>
          </div>
          <div className="contact-right">
            <a className="contact-cta" href="https://wa.me/201020889951" target="_blank" rel="noopener noreferrer">
              <span>{t(language, 'whatsapp')}</span><span className="cta-arrow">↗</span>
            </a>
            <p>{t(language, 'emailNote')}</p>
            <span className="contact-number" dir="ltr">+20 102 088 9951</span>
          </div>
          <div className="contact-watermark" aria-hidden="true">S.</div>
        </section>
      </main>
      <footer className="site-footer">
        <a href="#home" className="footer-wordmark">s<span>.</span></a>
        <span className="footer-message glitchable">{t(language, 'footer')}</span>
        <a href="#home" className="back-to-top">BACK TO TOP ↑</a>
      </footer>
    </div>
  );
}
