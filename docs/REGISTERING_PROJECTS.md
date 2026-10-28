# Registering a real application

Edit `src/projects/registry.ts`. Add one `ProjectDefinition` to the `projects` array; do not create a second list for the hero windows or the gallery.

## Fields

| Field | Required | Purpose |
|---|---|---|
| `id` | Yes | Stable, unique slug. Do not reuse an ID for a different project. |
| `title` | Yes | Real project name. |
| `description` | Yes | Short, accurate description. |
| `technologies` | Yes | Technology names shown as small labels. |
| `integrationType` | Yes | `iframe`, `external`, `preview`, or `custom`. `iframe` and `external` currently have interactive behavior. |
| `appUrl` | No | Real public/demo application URL. |
| `icon` | No | One-character/small text mark for the window. |
| `accentColor` | No | Accent color for that project's mark and image artwork, e.g. `#4169a1`. |
| `previewImage` | No | Path to a real screenshot/image, e.g. under `public/previews/`. |
| `sourceCodeUrl` | No | Public repository link, only when appropriate to share. |
| `demoEnabled` | Yes | Whether the interface may offer a demo action. |
| `demoRestrictions` | No | Documentation metadata describing demo protections. |
| `initialSize` | No | Floating window width and height in pixels. Defaults to 540 × 390 and is clamped to the desktop. |
| `initialPosition` | No | Initial position in pixels, or set `relative: true` and provide x/y ratios from `0` to `1` for responsive placement. |
| `float` | No | Set `enabled: false` to skip decorative floating motion. |
| `translations` | No | Optional translated project title/description per language (`en`, `ja`, `ar`). |
| `status` | Yes | `available`, `experimental`, or `in-development`. |
| `lazyLoad` | No | Documentary/configuration flag; full iframe content is loaded only when requested. |

## Integration types

### `iframe`

Use when the application is actually deployed and explicitly allows embedding. The visitor first sees the supplied preview image or neutral project summary; selecting **Try live demo** loads `appUrl` into the active window.

The iframe currently uses a conservative sandbox (`allow-scripts allow-forms allow-downloads`). Apps that need additional capabilities may require deliberate adjustments in `FloatingWindow.tsx`. Do not automatically add broader permissions just to silence an error. In particular, avoid casually combining `allow-scripts` and `allow-same-origin` for a same-origin iframe, because that can weaken the sandbox.

### `external`

Use when the real application cannot be embedded. Activating its demo action gives the visitor a link that opens the actual URL in a separate tab.

### `preview` / `custom`

Reserved integration identifiers for later project-specific preview components. Until those integrations are implemented, don't use these modes to imply that a live application exists. Use `iframe` or `external` for projects with a working target URL, or leave the project unregistered until its integration is ready.

## Demo-security checklist

- Use a separate demo deployment and database, not production.
- Populate it with invented/sample records only.
- Give the demo a limited role; never expose owner/admin credentials.
- Add server-side authorization, rate limiting and sensible request limits.
- Provide scheduled or manual data reset.
- Review file uploads, exports, messaging and external integrations before enabling them in a public demo.
- If embedding is allowed, configure the application's `frame-ancestors` policy for the portfolio origin. Configure the portfolio's Content Security Policy deliberately as well.
- Confirm the target app's authentication/cookie behavior in the intended browser. A working standalone URL may not work inside an iframe.

## Language strings

Use `translations` on a project when its title or description needs a non-English version:

```ts
translations: {
  title: { en: 'Stock Desk', ja: '在庫管理', ar: 'إدارة المخزون' },
  description: {
    en: 'Stock and sales management.',
    ja: '在庫と販売の管理。',
    ar: 'إدارة المخزون والمبيعات.',
  },
}
```

Keep project IDs, application URLs, code, and technology names untranslated unless there is a specific reason.

## Image guide: add screenshots that blend into the page

### 1. Choose and prepare the screenshots

- Use genuine screenshots of the actual application, not a redesigned mockup.
- Prefer **WebP** for smaller files. PNG is also fine for crisp UI text; use JPEG for photographs.
- Aim for a source width of roughly **1200–1800 px**. Do not upscale a small image.
- Crop to the application UI and remove unnecessary desktop clutter, but keep enough UI visible that visitors can understand the project.
- Hide customer names, phone numbers, addresses, transactions, credentials, API keys, and any other private data before saving the image.
- A transparent PNG can work for a cut-out illustration or product mark. For ordinary application screenshots, a normal rectangular screenshot works best because the website applies the soft-edge treatment.

### 2. Put the files in the previews folder

The folder is:

```text
public/previews/
```

Create it if it does not exist. Use lowercase, descriptive filenames with hyphens, for example:

```text
public/previews/
  al-qemma-pos.webp
  panel.webp
  mygit.webp
  brokerage.webp
```

The filenames above are suggestions; use whichever ones match the screenshots you actually add. Keep filenames simple—avoid spaces and special characters.

### 3. Connect an image to its project

Open:

```text
src/projects/registry.ts
```

Find the project object inside the `projects` array and add or update its `previewImage` field. The path starts with `/previews/`, **not** `public/previews/`:

```ts
{
  id: 'al-qemma-pos',
  title: 'Al-Qemma POS',
  // Keep the project's other existing fields.
  previewImage: '/previews/al-qemma-pos.webp',
}
```

Do not replace the entire project object with this shortened example. Add the `previewImage` property to the existing object, and keep a comma between fields.

Repeat for other projects using their actual file paths. For example:

```ts
// Inside the existing Panel project object
previewImage: '/previews/panel.webp',

// Inside the existing Mygit project object
previewImage: '/previews/mygit.webp',

// Inside the existing Brokerage project object
previewImage: '/previews/brokerage.webp',
```

### 4. Where the image appears

The same `previewImage` is used in both the floating application window and the project showcase. It gets a restrained shadow, soft edge treatment, and subtle motion. The image stays anchored to its own project; it does **not** drift randomly around the whole page. If no image is configured, the existing minimal placeholder remains visible.

### 5. Check it locally

Run:

```bash
npm run dev
```

Open the local address printed by Vite, visit Projects, and check both the English and Arabic layouts. If an image is missing, verify that the filename and letter case match exactly, that the file is under `public/previews/`, and that `previewImage` starts with `/previews/`.

The technology stack renders as color-coded badges with compact icon/letter marks. Add entries to `src/app/components/TechnologyStack.tsx` when a technology needs a recognizable brand color and mark; unknown entries receive a neutral fallback instead of disappearing.
