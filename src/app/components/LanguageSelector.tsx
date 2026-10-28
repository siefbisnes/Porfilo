import type { Language } from '../../projects/types';
import { languages } from '../../i18n/translations';

interface LanguageSelectorProps {
  language: Language;
  onChange: (language: Language) => void;
}

const languageMarks: Record<Language, string> = { en: 'EN', ja: 'あ', ar: 'ع' };

export default function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  return (
    <div className="language-switch" aria-label="Choose language" role="group">
      {languages.map((item) => (
        <button
          className={`language-option${language === item.id ? ' is-active' : ''}`}
          type="button"
          key={item.id}
          onClick={() => onChange(item.id)}
          aria-pressed={language === item.id}
          lang={item.id}
          aria-label={item.id === 'ja' ? 'Japanese (for aesthetics, mostly Google-translated)' : item.label}
          title={item.id === 'ja' ? 'Japanese (for aesthetics, mostly Google-translated)' : item.label}
        >
          <span className={`language-option-icon language-option-icon-${item.id}`} aria-hidden="true">{languageMarks[item.id]}</span>
          <span className="language-option-label">{item.label}</span>
          {item.id === 'ja' && <span className="language-translation-note">Japanese (for aesthetics, mostly Google-translated)</span>}
        </button>
      ))}
    </div>
  );
}
