# Sief — Interactive Software Developer Portfolio

A white, minimal portfolio built with React + TypeScript. Its signature interactions are a cursor-reactive particle network, an extensible floating application desktop, scroll-driven horizontal project exploration, and glitch-style language transitions for English, Japanese, and Arabic (RTL).

**Four projects are registered:** Al-Qemma POS (my first POS application for a real client), Panel (an early Linux utility), Mygit (under construction), and Brokerage (a private real-estate platform in development). Public source links are shown only for Al-Qemma POS and Panel. Mygit and Brokerage do not expose private repository URLs. No live demos or fake application interfaces are claimed.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite. Create a production build with:

```bash
npm run build
npm run preview
```

## Project layout

```text
src/
  app/
    App.tsx
    components/
      Header.tsx
      LanguageSelector.tsx
      ParticleNetwork.tsx
      StatusPanel.tsx
      ProjectGallery.tsx
      FloatingWindow.tsx
      WindowManager.tsx
  i18n/
    translations.ts
  projects/
    registry.ts
    types.ts
  styles/
    global.css
public/
docs/
```

## Register a project

Open `src/projects/registry.ts` and add a project to the `projects` array. The registry drives both the floating desktop and horizontal project gallery, so you only register it once. A schema and security notes are in [`docs/REGISTERING_PROJECTS.md`](docs/REGISTERING_PROJECTS.md).

Basic example:

```ts
{
  id: 'my-real-project',
  title: 'My Real Project',
  description: 'A concise, factual description of the application.',
  technologies: ['TypeScript', 'Flask', 'PostgreSQL'],
  accentColor: '#4169a1',
  appUrl: 'https://demo.example.com/',
  integrationType: 'iframe',
  icon: 'M',
  previewImage: '/previews/my-real-project.webp',
  demoEnabled: true,
  demoRestrictions: ['Synthetic records only', 'Demo reset on a schedule'],
  initialSize: { width: 780, height: 520 },
  initialPosition: { x: 640, y: 105 },
  float: { enabled: true, durationSeconds: 9, rotationDegrees: 0.6 },
  status: 'available',
  lazyLoad: true,
}
```

Only add the URL after a real demo exists. To add a screenshot, place it inside `public/previews/` (for example `public/previews/al-qemma-pos.webp`) and set `previewImage: '/previews/al-qemma-pos.webp'`. The project panel automatically styles it to blend into the page. No image is required, and no fake application UI is shown. For an iframe integration, the interactive application is not requested until a visitor activates the window and chooses **Try live demo**. An external integration opens the real URL in a new tab.

## Recent fix

- Fixed the Arabic horizontal-project scrolling issue by keeping the translated project track LTR while each Arabic project panel remains RTL. Scroll progress is measured from the horizontal track distance and recalculated after language changes.

## Features implemented

- Full-viewport, responsive canvas particle web; reacts to pointer movement and draws connections to registered floating windows.
- Floating windows with focus/z-order, draggable title bars, resizing, minimize, maximize/restore, close, and dock restoration.
- Lazy iframe loading, external-link integration, optional screenshot previews with soft edges and subtle floating motion, project status, and color-coded technology badges with icon marks.
- Scroll-pinned horizontal showcase generated from the same registry as the floating windows.
- English, Japanese, and Arabic UI dictionaries; Japanese includes a note that it is primarily aesthetic and mostly Google-translated; Arabic sets RTL document direction. Language preference is saved locally.
- Brief glitch transition when switching languages.
- Higher-contrast particle dots/links and enlarged secondary typography for readability.
- Discord identity shown as Roap... / altftheoriginal, plus a clickable GitHub profile link.
- Reduced-motion support, keyboard-visible focus, semantic navigation and mobile-specific layouts.
- No backend or API credentials are required for the portfolio shell itself.

## Important limitations

- The Discord card opens Discord generally because a direct Discord profile URL needs the numeric user ID; the username is displayed so visitors can search for it.
- The actual applications are not included in this repository. They must be deployed separately or supplied as a trusted URL.
- A browser cannot reliably embed every external site; the target server may block iframes with `X-Frame-Options` or Content Security Policy. Use `integrationType: 'external'` for such projects.
- An iframe is **not** a security boundary. Use a dedicated demo environment with synthetic data, least privilege, rate limits and a reset strategy. Do not connect these windows to production data or expose admin credentials.
- Japanese translations are editable local strings, not live Google Translate calls. This avoids sending every render to a third party and lets translations be corrected.
- Fonts are loaded from Google Fonts; add self-hosted font files if you require a fully offline deployment.
