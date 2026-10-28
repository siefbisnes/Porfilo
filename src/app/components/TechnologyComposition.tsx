import type { CSSProperties } from 'react';
import type { Language, TechnologyShare } from '../../projects/types';
import { t } from '../../i18n/translations';

const technologyColors: Record<string, string> = {
  Python: '#3776AB',
  HTML: '#E34F26',
  HTML5: '#E34F26',
  CSS: '#1572B6',
  CSS3: '#1572B6',
  JavaScript: '#F0DB4F',
  'Node.js': '#539E43',
  'Node.js + JavaScript': 'linear-gradient(90deg, #539E43 0 50%, #F0DB4F 50% 100%)',
  Shell: '#4EAA25',
  Bash: '#4EAA25',
  Batchfile: '#667085',
  'Inno Setup': '#0E8C85',
};

function shareColor(share: TechnologyShare): string {
  return share.color ?? technologyColors[share.name] ?? '#718096';
}

function formatPercentage(value: number): string {
  return `${Number(value.toFixed(1))}%`;
}

export default function TechnologyComposition({
  composition,
  language,
}: {
  composition?: TechnologyShare[];
  language: Language;
}) {
  if (!composition?.length) return null;

  const total = composition.reduce((sum, share) => sum + Math.max(0, share.percentage), 0);
  if (total <= 0) return null;

  const summary = composition.map((share) => `${share.name} ${formatPercentage(share.percentage)}`).join(', ');

  return (
    <section className="technology-composition" aria-label={`${t(language, 'stackComposition')}: ${summary}`}>
      <div className="composition-heading">
        <span>{t(language, 'stackComposition')}</span>
        <span className="composition-rule" aria-hidden="true" />
      </div>
      <div className="composition-bar" dir="ltr" role="img" aria-label={summary}>
        {composition.map((share) => {
          const style = {
            width: `${(Math.max(0, share.percentage) / total) * 100}%`,
            background: shareColor(share),
          } as CSSProperties;
          return <span className="composition-segment" key={share.name} style={style} title={`${share.name} ${formatPercentage(share.percentage)}`} />;
        })}
      </div>
      <div className="composition-legend" dir="ltr">
        {composition.map((share) => (
          <div className="composition-legend-item" key={share.name}>
            <span className="composition-swatch" style={{ background: shareColor(share) }} aria-hidden="true" />
            <span className="composition-name">{share.name}</span>
            <strong>{formatPercentage(share.percentage)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
