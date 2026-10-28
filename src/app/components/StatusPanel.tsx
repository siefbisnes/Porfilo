import type { Language } from '../../projects/types';
import { t } from '../../i18n/translations';

export default function StatusPanel({ language }: { language: Language }) {
  return (
    <div className="contact-cluster">
      <div className="status-panel">
        <span className="discord-glyph" aria-hidden="true">
          <svg viewBox="0 0 28 22" fill="none">
            <path d="M5.1 3.1A23 23 0 0 1 10.3 1.5l.7 1.4a19.5 19.5 0 0 1 6 0l.7-1.4A23 23 0 0 1 23 3.1c3.3 4.8 4.2 9.6 3.7 14.4a23.4 23.4 0 0 1-7.1 3.6l-1.6-2.5c.9-.3 1.8-.8 2.5-1.3l-.6-.5a16.2 16.2 0 0 1-11.7 0l-.6.5c.8.5 1.6 1 2.5 1.3l-1.6 2.5a23.4 23.4 0 0 1-7.1-3.6C.9 12.6 1.8 7.9 5.1 3.1Z" fill="currentColor" />
            <circle cx="10" cy="11" r="1.7" fill="#fff" />
            <circle cx="18" cy="11" r="1.7" fill="#fff" />
          </svg>
        </span>
        <span className="status-dot" aria-hidden="true" />
        <span>{t(language, 'online')}</span>
      </div>
      <p className="whatsapp-line">
        {t(language, 'contactFallback')}{' '}
        <a href="https://wa.me/201020889951" target="_blank" rel="noreferrer noopener" dir="ltr">01020889951</a>
      </p>
      <div className="social-links" aria-label="Social profiles">
        <a
          className="social-link discord-social"
          href="https://discord.com/app"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Open Discord and find Roap..., username altftheoriginal"
          title="Open Discord, then search for altftheoriginal"
        >
          <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.7 5.3a18.2 18.2 0 0 0-4.5-1.4l-.6 1.2a16.8 16.8 0 0 0-5.2 0l-.6-1.2a18.2 18.2 0 0 0-4.5 1.4C1.5 9.5.7 13.6 1.1 17.7a18.3 18.3 0 0 0 5.6 2.8l1.2-2a11.8 11.8 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 10.9 0l.5.4a11.8 11.8 0 0 1-1.9.9l1.2 2a18.3 18.3 0 0 0 5.6-2.8c.5-4.8-.8-8.9-3.1-12.4ZM8.8 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
          </svg>
          <span className="social-copy">
            <span className="social-name">Discord</span>
            <span className="social-handle"><span>Roap...</span><span dir="ltr">@altftheoriginal</span></span>
          </span>
          <span className="social-arrow" aria-hidden="true">↗</span>
        </a>
        <a
          className="social-link github-social"
          href="https://github.com/siefbisnes"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Visit Sief's GitHub profile"
        >
          <svg className="social-icon github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.6v-2.1c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.9 2.2 3.8 1.5.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.1 1.2-2.9-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1a10.3 10.3 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.2 1.7 1.2 2.9 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 2v2.9c0 .3.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" />
          </svg>
          <span className="social-copy">
            <span className="social-name">GitHub</span>
            <span className="social-handle" dir="ltr">siefbisnes</span>
          </span>
          <span className="social-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
