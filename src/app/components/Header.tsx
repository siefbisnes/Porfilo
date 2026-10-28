import type { Language } from '../../projects/types';
import { t } from '../../i18n/translations';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Sief, home">
        <span className="wordmark-mark">s.</span>
        <span className="wordmark-label">SIEF<span className="wordmark-dot">/</span>DEV</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#home">{t(language, 'navHome')}</a>
        <a href="#projects">{t(language, 'navProjects')}</a>
        <a href="#about">{t(language, 'navAbout')}</a>
        <a href="#contact">{t(language, 'navContact')}</a>
      </nav>
      <LanguageSelector language={language} onChange={onLanguageChange} />
    </header>
  );
}
