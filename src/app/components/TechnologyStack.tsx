import type { CSSProperties } from 'react';

interface TechnologyStyle {
  mark: string;
  color: string;
  background: string;
  foreground?: string;
}

const technologyStyles: Record<string, TechnologyStyle> = {
  Python: { mark: 'Py', color: '#3776AB', background: '#EAF3FA' },
  Flask: { mark: 'F', color: '#292D32', background: '#EEF0F2' },
  SQLite: { mark: 'DB', color: '#176B87', background: '#E8F5F8' },
  HTML5: { mark: '5', color: '#E34F26', background: '#FFF0E9' },
  HTML: { mark: '5', color: '#E34F26', background: '#FFF0E9' },
  CSS3: { mark: '3', color: '#1572B6', background: '#EAF4FC' },
  CSS: { mark: '3', color: '#1572B6', background: '#EAF4FC' },
  JavaScript: { mark: 'JS', color: '#8A7100', background: '#FFF8CC', foreground: '#5A4900' },
  TypeScript: { mark: 'TS', color: '#3178C6', background: '#EAF3FF' },
  Jinja2: { mark: 'J²', color: '#B41717', background: '#FCECEC' },
  PyWebView: { mark: 'WV', color: '#526C83', background: '#EEF3F7' },
  Playwright: { mark: 'PW', color: '#2E8B57', background: '#E8F7EE' },
  Tailscale: { mark: 'TS', color: '#242B2E', background: '#EBEFF0' },
  'PyInstaller': { mark: 'Py', color: '#4263B8', background: '#EEF1FF' },
  'Batchfile': { mark: 'BAT', color: '#667085', background: '#F0F2F5' },
  'Inno Setup': { mark: 'IS', color: '#0E8C85', background: '#E8F7F5' },
  'Node.js': { mark: 'JS', color: '#539E43', background: '#ECF7EA' },
  'Shell': { mark: '$', color: '#4EAA25', background: '#EEF8E9' },
  'GTK 4': { mark: 'GTK', color: '#356FAD', background: '#EAF2FC' },
  GTK: { mark: 'GTK', color: '#356FAD', background: '#EAF2FC' },
  YAML: { mark: 'Y', color: '#CB171E', background: '#FCEBEC' },
  Bash: { mark: '$_', color: '#2D8A45', background: '#EAF7ED' },
  Linux: { mark: 'LX', color: '#282C32', background: '#F0F2F4' },
  pytest: { mark: 'PyT', color: '#1688B8', background: '#E7F6FC' },
  PostgreSQL: { mark: 'PG', color: '#4169E1', background: '#EDF1FF' },
  'WhatsApp WebJS': { mark: 'WA', color: '#168F4D', background: '#E6F8EE' },
  WhatsApp: { mark: 'WA', color: '#168F4D', background: '#E6F8EE' },
  Webhooks: { mark: '↗', color: '#7660C7', background: '#F0ECFF' },
  'AI workflows': { mark: 'AI', color: '#7551B8', background: '#F2EBFF' },
  'Node.js + JavaScript': { mark: 'JS', color: '#539E43', background: '#ECF7EA' },
  React: { mark: '⚛', color: '#087EA4', background: '#E5F8FE' },
  Vite: { mark: 'V', color: '#8265E8', background: '#F0EBFF' },
};

function fallbackStyle(name: string): TechnologyStyle {
  const mark = name.length <= 3 ? name : name.slice(0, 2).toUpperCase();
  return { mark, color: '#5E6874', background: '#F0F2F4' };
}

export default function TechnologyStack({ technologies }: { technologies: string[] }) {
  if (technologies.length === 0) return null;

  return (
    <div className="technology-list" aria-label="Development stack">
      {technologies.map((technology) => {
        const style = technologyStyles[technology] ?? fallbackStyle(technology);
        const badgeStyle = {
          '--tech-color': style.color,
          '--tech-background': style.background,
          '--tech-foreground': style.foreground ?? style.color,
        } as CSSProperties;

        return (
          <span className="tech-badge" key={technology} style={badgeStyle} title={technology}>
            <span className="tech-badge-icon" aria-hidden="true">{style.mark}</span>
            <span className="tech-badge-label">{technology}</span>
          </span>
        );
      })}
    </div>
  );
}
