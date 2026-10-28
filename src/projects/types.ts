export type Language = 'en' | 'ja' | 'ar';
export type IntegrationType = 'iframe' | 'external' | 'preview' | 'custom';

export interface ProjectTranslations {
  title?: Partial<Record<Language, string>>;
  description?: Partial<Record<Language, string>>;
}

/** A single source of truth for windows and the horizontal project gallery. */
export interface TechnologyShare {
  name: string;
  percentage: number;
  /** Optional CSS color or gradient, useful for combined language shares. */
  color?: string;
}

export interface ProjectDefinition {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  /** Optional language / technology percentages shown as a compact composition bar. */
  technologyComposition?: TechnologyShare[];
  appUrl?: string;
  integrationType: IntegrationType;
  icon?: string;
  /** Accent used for the project's app mark and preview artwork. */
  accentColor?: string;
  previewImage?: string;
  /** Optional route for a project-specific preview component. */
  previewComponent?: string;
  sourceCodeUrl?: string;
  demoEnabled: boolean;
  demoRestrictions?: string[];
  initialSize?: { width: number; height: number };
  initialPosition?: { x: number; y: number; relative?: boolean };
  float?: { enabled?: boolean; durationSeconds?: number; rotationDegrees?: number };
  translations?: ProjectTranslations;
  status: 'available' | 'experimental' | 'in-development';
  /** If true, the actual app is loaded only after the visitor activates the window. */
  lazyLoad?: boolean;
}
