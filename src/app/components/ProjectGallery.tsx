import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Language, ProjectDefinition } from '../../projects/types';
import { t } from '../../i18n/translations';
import TechnologyStack from './TechnologyStack';
import TechnologyComposition from './TechnologyComposition';

interface ProjectGalleryProps {
  projects: ProjectDefinition[];
  language: Language;
  onOpenProject: (id: string) => void;
}

function statusLabel(project: ProjectDefinition, language: Language) {
  if (project.status === 'available') return t(language, 'statusAvailable');
  if (project.status === 'experimental') return t(language, 'statusExperimental');
  return t(language, 'statusDevelopment');
}

export default function ProjectGallery({ projects, language, onOpenProject }: ProjectGalleryProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const maxTranslateRef = useRef(0);

  const hasProjects = projects.length > 0;
  const isHorizontal = hasProjects && !reducedMotion;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  const galleryHeight = useMemo(() => Math.max(1, scrollHeight), [scrollHeight]);

  useEffect(() => {
    if (!isHorizontal) return;
    const measure = () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky) return;
      const maxTranslate = Math.max(0, track.scrollWidth - sticky.clientWidth);
      maxTranslateRef.current = maxTranslate;
      setScrollHeight(window.innerHeight + maxTranslate);
      const wrapper = wrapperRef.current;
      if (wrapper) {
        // The sticky section's scroll range is exactly the horizontal distance.
        // Measuring from that distance avoids transient stale heights after a
        // language or viewport change.
        const range = Math.max(1, maxTranslate);
        const progressed = Math.min(1, Math.max(0, -wrapper.getBoundingClientRect().top / range));
        setProgress(progressed);
        setTranslateX(progressed * maxTranslate);
      }
    };
    const onScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const range = Math.max(1, maxTranslateRef.current);
      const progressed = Math.min(1, Math.max(0, -wrapper.getBoundingClientRect().top / range));
      setProgress(progressed);
      setTranslateX(progressed * maxTranslateRef.current);
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHorizontal, language, projects.length]);

  return (
    <section
      className={`project-gallery${hasProjects ? ' has-projects' : ' empty-gallery'}`}
      id="projects"
      ref={wrapperRef}
      style={isHorizontal ? { height: `${galleryHeight}px` } : undefined}
    >
      {isHorizontal ? (
        <div className="gallery-sticky" ref={stickyRef}>
          <div className="gallery-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" />{t(language, 'projectsEyebrow')}</p>
              <h2>{t(language, 'projectsTitle')}</h2>
            </div>
            <div className="gallery-side-note">
              <p>{t(language, 'projectsLead')}</p>
              <span className="gallery-progress-label">{String(Math.min(projects.length, Math.floor(progress * projects.length) + 1)).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
              <div className="gallery-progress-track"><span style={{ width: `${progress * 100}%` }} /></div>
            </div>
          </div>
          <div className="gallery-window">
            <div className="gallery-track" dir="ltr" ref={trackRef} style={{ transform: `translate3d(${-translateX}px, 0, 0)` }}>
              {projects.map((project, index) => {
                const title = project.translations?.title?.[language] || project.title;
                const description = project.translations?.description?.[language] || project.description;
                return (
                  <article
                    className={`project-panel project-${project.id}`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    key={project.id}
                    style={{ '--project-accent': project.accentColor ?? '#52769a' } as CSSProperties}
                  >
                    <div className="project-panel-topline"><span>{String(index + 1).padStart(2, '0')} <span className="slash">/</span> {String(projects.length).padStart(2, '0')}</span><span className={`project-status status-${project.status}`}>{statusLabel(project, language)}</span></div>
                    <div className="project-panel-content">
                      <div className="project-copy">
                        <span className="project-icon-large">{project.icon || '↗'}</span>
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <TechnologyStack technologies={project.technologies} />
                        <TechnologyComposition composition={project.technologyComposition} language={language} />
                        <div className="project-actions">
                          <button className="button button-dark" onClick={() => onOpenProject(project.id)} type="button">{t(language, 'openProject')} <span aria-hidden="true">↗</span></button>
                          {project.sourceCodeUrl && <a className="text-link" href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer">{t(language, 'sourceCode')} ↗</a>}
                        </div>
                      </div>
                      <button type="button" className={`project-preview${project.previewImage ? ' has-preview-image' : ''}`} onClick={() => onOpenProject(project.id)} aria-label={`${t(language, 'openProject')}: ${title}`}>
                        {project.previewImage ? <img src={project.previewImage} alt={`${title} preview`} loading="lazy" /> : (
                          <div className="project-preview-empty">
                            <span className="preview-art-orbit" aria-hidden="true" />
                            <span className="preview-art-sheet" aria-hidden="true"><span className="preview-art-mark">{project.icon || title.slice(0, 1)}</span></span>
                            <span className="preview-art-label">{t(language, 'screenshotPreview')}</span>
                          </div>
                        )}
                        <span className="preview-corner preview-corner-tl" /><span className="preview-corner preview-corner-br" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="gallery-scroll-hint"><span className="scroll-key">↓</span>{t(language, 'scrollProjects')}</div>
        </div>
      ) : hasProjects ? (
        <div className="vertical-gallery-list">
          <div className="vertical-gallery-heading">
            <p className="eyebrow"><span className="eyebrow-line" />{t(language, 'projectsEyebrow')}</p>
            <h2>{t(language, 'projectsTitle')}</h2>
            <p className="section-lead">{t(language, 'projectsLead')}</p>
          </div>
          {projects.map((project, index) => {
            const title = project.translations?.title?.[language] || project.title;
            const description = project.translations?.description?.[language] || project.description;
            return (
              <article
                className={`vertical-project-card project-${project.id}`}
                key={project.id}
                style={{ '--project-accent': project.accentColor ?? '#52769a' } as CSSProperties}
              >
                <div className="project-panel-topline"><span>{String(index + 1).padStart(2, '0')} <span className="slash">/</span> {String(projects.length).padStart(2, '0')}</span><span className={`project-status status-${project.status}`}>{statusLabel(project, language)}</span></div>
                <div className="vertical-project-content">
                  <div className="project-copy">
                    <span className="project-icon-large">{project.icon || '↗'}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <TechnologyStack technologies={project.technologies} />
                    <TechnologyComposition composition={project.technologyComposition} language={language} />
                    <div className="project-actions">
                      <button className="button button-dark" onClick={() => onOpenProject(project.id)} type="button">{t(language, 'openProject')} <span aria-hidden="true">↗</span></button>
                      {project.sourceCodeUrl && <a className="text-link" href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer">{t(language, 'sourceCode')} ↗</a>}
                    </div>
                  </div>
                  <button type="button" className={`project-preview${project.previewImage ? ' has-preview-image' : ''}`} onClick={() => onOpenProject(project.id)} aria-label={`${t(language, 'openProject')}: ${title}`}>
                    {project.previewImage ? <img src={project.previewImage} alt={`${title} preview`} loading="lazy" /> : (
                          <div className="project-preview-empty">
                            <span className="preview-art-orbit" aria-hidden="true" />
                            <span className="preview-art-sheet" aria-hidden="true"><span className="preview-art-mark">{project.icon || title.slice(0, 1)}</span></span>
                            <span className="preview-art-label">{t(language, 'screenshotPreview')}</span>
                          </div>
                        )}
                    <span className="preview-corner preview-corner-tl" /><span className="preview-corner preview-corner-br" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-gallery-inner">
          <div className="empty-copy">
            <p className="eyebrow"><span className="eyebrow-line" />{t(language, 'projectsEyebrow')}</p>
            <h2>{t(language, 'projectsTitle')}</h2>
            <p className="section-lead">{t(language, 'projectsLead')}</p>
            <div className="empty-workbench">
              <div className="workbench-top"><span /><span /><span /><small>PROJECTS / 00</small></div>
              <div className="workbench-body">
                <span className="workbench-orbit" aria-hidden="true"><span /><span /><span /></span>
                <span className="workbench-heading">{t(language, 'noProjects')}</span>
                <p>{t(language, 'noProjectsDescription')}</p>
                <span className="registry-hint"><span className="registry-dot" />{t(language, 'registryHint')}</span>
              </div>
            </div>
          </div>
          <div className="empty-side-ornament" aria-hidden="true">
            <span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit orbit-three" />
            <span className="orbit-core" />
            <span className="orbit-label orbit-label-top">REAL SOFTWARE</span>
            <span className="orbit-label orbit-label-bottom">NO MOCKUPS</span>
          </div>
        </div>
      )}
    </section>
  );
}
