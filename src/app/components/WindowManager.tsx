import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language, ProjectDefinition } from '../../projects/types';
import FloatingWindow, { type WindowGeometry } from './FloatingWindow';
import { t } from '../../i18n/translations';

export interface OpenWindowRequest {
  id: string;
  requestId: number;
}

interface ManagedWindow {
  geometry: WindowGeometry;
  zIndex: number;
  minimized: boolean;
  closed: boolean;
  maximized: boolean;
  demoLoaded: boolean;
}

interface WindowManagerProps {
  projects: ProjectDefinition[];
  language: Language;
  openRequest: OpenWindowRequest | null;
  onRequestHandled: () => void;
}

function createWindowState(projects: ProjectDefinition[]): Record<string, ManagedWindow> {
  return Object.fromEntries(projects.map((project, index) => {
    const defaultWidth = Math.min(project.initialSize?.width ?? 540, Math.max(320, window.innerWidth - 32));
    const defaultHeight = Math.min(project.initialSize?.height ?? 390, Math.max(260, window.innerHeight - 140));
    const requestedX = project.initialPosition?.relative
      ? Math.round(window.innerWidth * project.initialPosition.x)
      : project.initialPosition?.x ?? Math.round(window.innerWidth * 0.51 + (index % 3) * 34);
    const requestedY = project.initialPosition?.relative
      ? Math.round((window.innerHeight - 82) * project.initialPosition.y)
      : project.initialPosition?.y ?? 118 + (index % 4) * 31;
    return [project.id, {
      geometry: {
        x: Math.max(12, Math.min(requestedX, window.innerWidth - defaultWidth - 12)),
        y: Math.max(76, Math.min(requestedY, window.innerHeight - defaultHeight - 20)),
        width: defaultWidth,
        height: defaultHeight,
      },
      zIndex: 2 + index,
      minimized: false,
      closed: false,
      maximized: false,
      demoLoaded: false,
    } satisfies ManagedWindow];
  }));
}

export default function WindowManager({ projects, language, openRequest, onRequestHandled }: WindowManagerProps) {
  const [windows, setWindows] = useState<Record<string, ManagedWindow>>(() => createWindowState(projects));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [topZIndex, setTopZIndex] = useState(projects.length + 3);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWindows((current) => {
      const next = { ...current };
      for (const project of projects) {
        if (!next[project.id]) next[project.id] = createWindowState([project])[project.id];
      }
      return next;
    });
  }, [projects]);

  useEffect(() => {
    if (!openRequest) return;
    const project = projects.find((item) => item.id === openRequest.id);
    if (!project) {
      onRequestHandled();
      return;
    }
    setWindows((current) => {
      const next = current[project.id] ?? createWindowState([project])[project.id];
      return { ...current, [project.id]: { ...next, closed: false, minimized: false, maximized: false, zIndex: topZIndex + 1 } };
    });
    setTopZIndex((value) => value + 1);
    setActiveId(project.id);
    onRequestHandled();
  }, [openRequest?.requestId]); // requestId makes repeat opens of the same project work too.

  useEffect(() => {
    const onOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('[data-floating-window="true"]') && !target?.closest('.window-dock')) {
        setActiveId(null);
      }
    };
    document.addEventListener('pointerdown', onOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', onOutsidePointerDown);
  }, []);

  useEffect(() => {
    const clampOpenWindows = () => {
      const bounds = desktopRef.current?.getBoundingClientRect();
      const width = bounds?.width ?? window.innerWidth;
      const height = bounds?.height ?? window.innerHeight;
      setWindows((current) => Object.fromEntries(Object.entries(current).map(([id, state]) => {
        const maxWidth = Math.max(310, width - 24);
        const maxHeight = Math.max(230, height - 92);
        const nextWidth = Math.min(state.geometry.width, maxWidth);
        const nextHeight = Math.min(state.geometry.height, maxHeight);
        return [id, {
          ...state,
          geometry: {
            ...state.geometry,
            width: nextWidth,
            height: nextHeight,
            x: Math.max(12, Math.min(state.geometry.x, width - nextWidth - 12)),
            y: Math.max(74, Math.min(state.geometry.y, height - nextHeight - 12)),
          },
        }];
      })));
    };
    window.addEventListener('resize', clampOpenWindows);
    return () => window.removeEventListener('resize', clampOpenWindows);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setActiveId(id);
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setWindows((current) => ({ ...current, [id]: { ...current[id], zIndex: nextZ } }));
  }, [topZIndex]);

  const updateGeometry = useCallback((id: string, geometry: WindowGeometry) => {
    const bounds = desktopRef.current?.getBoundingClientRect();
    const width = bounds?.width ?? window.innerWidth;
    const height = bounds?.height ?? window.innerHeight;
    setWindows((current) => ({
      ...current,
      [id]: {
        ...current[id],
        geometry: {
          width: Math.min(Math.max(310, geometry.width), Math.max(310, width - 24)),
          height: Math.min(Math.max(230, geometry.height), Math.max(230, height - 88)),
          x: Math.max(12, Math.min(geometry.x, width - Math.min(geometry.width, width - 24) - 12)),
          y: Math.max(74, Math.min(geometry.y, height - Math.min(geometry.height, height - 88) - 12)),
        },
      },
    }));
  }, []);

  const updateWindow = (id: string, updates: Partial<ManagedWindow>) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], ...updates } }));
  };

  if (projects.length === 0) return null;
  const hiddenProjects = projects.filter((project) => windows[project.id]?.closed || windows[project.id]?.minimized);

  return (
    <>
      <div
        className="floating-desktop"
        ref={desktopRef}
        aria-label="Interactive project desktop"
        onPointerDown={(event) => {
          if (!(event.target as HTMLElement).closest('[data-floating-window="true"]')) setActiveId(null);
        }}
      >
        {projects.map((project) => {
          const state = windows[project.id];
          if (!state || state.closed) return null;
          return (
            <FloatingWindow
              key={project.id}
              project={project}
              language={language}
              geometry={state.geometry}
              zIndex={state.zIndex}
              active={activeId === project.id}
              minimized={state.minimized}
              maximized={state.maximized}
              demoLoaded={state.demoLoaded}
              onFocus={() => focusWindow(project.id)}
              onMove={(geometry) => updateGeometry(project.id, geometry)}
              onResize={(geometry) => updateGeometry(project.id, geometry)}
              onMinimize={() => updateWindow(project.id, { minimized: true })}
              onMaximize={() => updateWindow(project.id, { maximized: !state.maximized })}
              onClose={() => { updateWindow(project.id, { closed: true }); if (activeId === project.id) setActiveId(null); }}
              onToggleDemo={() => updateWindow(project.id, { demoLoaded: !state.demoLoaded })}
            />
          );
        })}
      </div>
      {hiddenProjects.length > 0 && (
        <div className="window-dock" aria-label="Restore project windows">
          {hiddenProjects.map((project) => {
            return <button key={project.id} type="button" onClick={() => {
              updateWindow(project.id, { closed: false, minimized: false });
              focusWindow(project.id);
            }}><span>{project.icon || project.title.slice(0, 1)}</span>{project.title}</button>;
          })}
        </div>
      )}
      <span className="visually-hidden">{activeId ? `${projects.find((project) => project.id === activeId)?.title ?? ''} focused` : t(language, 'navProjects')}</span>
    </>
  );
}
