import { useRef, useState, type CSSProperties } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Language, ProjectDefinition } from '../../projects/types';
import { t } from '../../i18n/translations';
import TechnologyStack from './TechnologyStack';

export interface WindowGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FloatingWindowProps {
  project: ProjectDefinition;
  language: Language;
  geometry: WindowGeometry;
  zIndex: number;
  active: boolean;
  minimized: boolean;
  maximized: boolean;
  onFocus: () => void;
  onMove: (geometry: WindowGeometry) => void;
  onResize: (geometry: WindowGeometry) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onToggleDemo: () => void;
  demoLoaded: boolean;
}

export default function FloatingWindow(props: FloatingWindowProps) {
  const {
    project, language, geometry, zIndex, active, minimized, maximized,
    onFocus, onMove, onResize, onMinimize, onMaximize, onClose, onToggleDemo, demoLoaded,
  } = props;
  const dragOrigin = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);
  const resizeOrigin = useRef<{ pointerX: number; pointerY: number; width: number; height: number } | null>(null);
  const [internalPreviewVisible, setInternalPreviewVisible] = useState(false);

  const title = project.translations?.title?.[language] || project.title;
  const description = project.translations?.description?.[language] || project.description;
  const statusKey = project.status === 'available' ? 'statusAvailable' : project.status === 'experimental' ? 'statusExperimental' : 'statusDevelopment';

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    event.preventDefault();
    onFocus();
    if (maximized) return;
    dragOrigin.current = { pointerX: event.clientX, pointerY: event.clientY, x: geometry.x, y: geometry.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragOrigin.current) return;
    const origin = dragOrigin.current;
    onMove({ ...geometry, x: origin.x + event.clientX - origin.pointerX, y: origin.y + event.clientY - origin.pointerY });
  };
  const endDrag = () => { dragOrigin.current = null; };

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onFocus();
    resizeOrigin.current = { pointerX: event.clientX, pointerY: event.clientY, width: geometry.width, height: geometry.height };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!resizeOrigin.current) return;
    const origin = resizeOrigin.current;
    onResize({ ...geometry, width: Math.max(310, origin.width + event.clientX - origin.pointerX), height: Math.max(230, origin.height + event.clientY - origin.pointerY) });
  };
  const endResize = () => { resizeOrigin.current = null; };

  if (minimized) return null;
  const frameStyle = maximized ? undefined : {
    left: geometry.x,
    top: geometry.y,
    width: geometry.width,
    height: geometry.height,
    zIndex,
  };

  return (
    <section
      className={`floating-window${active ? ' is-active' : ''}${maximized ? ' is-maximized' : ''}${project.float?.enabled === false ? ' no-float' : ''}`}
      style={{
        ...frameStyle,
        '--project-accent': project.accentColor ?? '#52769a',
        '--float-duration': `${project.float?.durationSeconds ?? 9}s`,
        '--float-rotation': `${project.float?.rotationDegrees ?? 0.5}deg`,
      } as CSSProperties}
      data-floating-window="true"
      aria-label={`${title} application window`}
      onPointerDown={onFocus}
    >
      <div className="window-titlebar" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <div className="window-brand">
          <span className="window-app-icon" style={{ '--project-accent': project.accentColor ?? '#52769a' } as CSSProperties}>{project.icon || title.slice(0, 1).toUpperCase()}</span>
          <span className="window-title-text">{title}</span>
          {active && <span className="window-live-label">{t(language, 'windowActive')}</span>}
        </div>
        <div className="window-actions">
          <button type="button" className="window-control minimize-control" aria-label={t(language, 'minimize')} title={t(language, 'minimize')} onClick={(event) => { event.stopPropagation(); onMinimize(); }}>−</button>
          <button type="button" className="window-control maximize-control" aria-label={maximized ? t(language, 'restore') : t(language, 'maximize')} title={maximized ? t(language, 'restore') : t(language, 'maximize')} onClick={(event) => { event.stopPropagation(); onMaximize(); }}>{maximized ? '❐' : '□'}</button>
          <button type="button" className="window-control close-control" aria-label={t(language, 'close')} title={t(language, 'close')} onClick={(event) => { event.stopPropagation(); onClose(); }}>×</button>
        </div>
      </div>
      <div className="window-content">
        {active && project.integrationType === 'iframe' && project.appUrl && demoLoaded ? (
          <iframe
            src={project.appUrl}
            title={`${title} live application`}
            loading="lazy"
            sandbox="allow-scripts allow-forms allow-downloads"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : project.integrationType === 'external' && active && internalPreviewVisible && project.appUrl ? (
          <div className="window-external-open">
            <p>{description}</p>
            <a href={project.appUrl} target="_blank" rel="noopener noreferrer">{t(language, 'externalOpen')} ↗</a>
          </div>
        ) : (
          <div className="window-preview">
            {project.previewImage ? <img src={project.previewImage} alt={`${title} application preview`} /> : <div className="preview-empty-symbol">{project.icon || '↗'}</div>}
            <div className="preview-meta"><span className={`project-status status-${project.status}`}>{t(language, statusKey)}</span></div>
            <TechnologyStack technologies={project.technologies.slice(0, 4)} />
            <p>{description}</p>
            {project.demoEnabled && project.appUrl ? (
              <button type="button" className="window-open-demo" onClick={() => {
                if (project.integrationType === 'external') setInternalPreviewVisible(true);
                else onToggleDemo();
              }}>{t(language, 'tryDemo')} <span aria-hidden="true">↗</span></button>
            ) : <span className="demo-note">{t(language, 'unavailableDemo')}</span>}
          </div>
        )}
      </div>
      {!maximized && <button className="window-resize-handle" aria-label="Resize window" onPointerDown={startResize} onPointerMove={moveResize} onPointerUp={endResize} onPointerCancel={endResize} />}
    </section>
  );
}
