# TurnPhotoArt

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

TurnPhotoArt is a mobile-first consumer experience for turning a favourite photo into cheerful, handmade-style artwork. Phase 1 validates the complete one-page journey with an honest browser-generated style preview.

## Phase 1 preview status

Phase 1 is intentionally local-only. It does **not** invoke OpenAI, another paid image API, external storage, a database, analytics, payments, or authentication. It needs no API key. Uploaded images are held only in a temporary browser object URL, are never permanently stored, and are released when replaced, removed, or the page closes.

The preserved legacy OpenAI generation implementation is future-only. The home page does not import its service, write a generation request to session storage, or navigate to the legacy results flow. `POST /api/photobooth` is hard-disabled with HTTP 410.

## Current flow

1. Read the product promise and privacy boundary.
2. Drag in a photo or choose one from the device photo library.
3. Validate and preview the selected image; replace or remove it at any time.
4. Select **Make it playful ✨** for a short local progress sequence.
5. Compare the original with a CSS-treated playful preview on the same page.
6. Download a locally rendered Canvas preview or try another photo.

The result is labelled “Interactive style preview — full AI artwork coming in the next phase.” It is not presented as AI-generated artwork.

## Tech stack

- Next.js 15 App Router
- React 19 and TypeScript
- Tailwind CSS 4 entry pipeline with custom responsive CSS
- Lucide icons
- Browser object URLs, CSS filters, and Canvas export

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env` file is required.

Other commands:

```bash
npm run lint
npm run build
npm start
```

## Supported uploads

- JPEG, PNG, and WebP
- File picker, mobile photo library, and drag-and-drop
- Maximum file size: 10 MB

Unsupported, oversized, and unreadable images receive an inline accessible error. Photos are not uploaded or retained.

## Current limitations

- The playful treatment is an illustrative CSS/Canvas approximation, not generative AI.
- It applies a single locked signature style; there are no prompts or style presets.
- Canvas download intentionally approximates the live CSS treatment and may vary slightly by browser.
- The preserved `/results` URL is an informational hand-back to the one-page studio.

## Phase 2 integration points

- Keep the public one-page state model and replace only the local preview adapter with an authenticated server-side generation job.
- Move the locked `playful-art` prompt definition in `lib/turn-photo-art.ts` to server-only configuration before enabling it.
- Introduce explicit consent, retention, error, retry, and deletion policies before any image upload.
- Re-enable or replace the isolated legacy route only after adding server-side authorization, rate limits, request validation, and cost controls.
- Keep API credentials server-only; never expose them through `NEXT_PUBLIC_*` variables or browser bundles.

## License and attribution

TurnPhotoArt is licensed under the [MIT License](./LICENSE). The project began from OpenAI’s ImageGen Photobooth demo. Original third-party notices remain preserved in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
