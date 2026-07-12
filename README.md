# TurnPhotoArt

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

TurnPhotoArt is a mobile-first experience for exploring how a favourite photo could feel as cheerful, handmade-style artwork. Phase 1.2 prepares the browser-local public preview for a safe first deployment without activating AI generation, uploads, payments, accounts, analytics, or storage.

## Public-preview flow

1. Choose or drag in a JPEG, PNG, or WebP image.
2. Validate its type, signature, decoding, dimensions, and size locally.
3. Watch a short mock progress sequence.
4. Compare the original with an interactive CSS style treatment.
5. Download a locally rendered PNG preview.

The artwork effect is illustrative, not final AI artwork. Photos remain in the current browser tab and are not intentionally uploaded or permanently stored by TurnPhotoArt. Temporary browser blob URLs and Canvas resources are released after use.

## Safety boundary

- No OpenAI or other image-generation API call is active.
- `POST /api/photobooth` is hard-disabled with HTTP 410 and `Cache-Control: no-store`.
- No Local Storage, Session Storage, IndexedDB, database, analytics, payment, account, or external image-storage flow is used.
- `/results` is a safe informational route that links back to the one-page studio.
- `/api/health` exposes only `{ "status": "ok", "mode": "local-preview" }`.

## Upload limits

- JPEG, PNG, and WebP only
- Maximum file size: 10 MB
- Maximum dimensions: 12,000 × 12,000 pixels
- Maximum decoded size: 50 megapixels
- Downloaded PNG preview longest edge: 2,048 pixels

Validation uses browser-native decoding plus MIME, extension, and magic-byte checks. SVG, GIF, HEIC, PDF, AVIF, TIFF, BMP, and arbitrary binaries are not accepted.

## Tech stack and security

- Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS 4
- Node `>=20.9.0 <27`; Node 26.0.0 and npm 11.12.1 were validated locally
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Camera, microphone, and geolocation disabled through `Permissions-Policy`
- `X-Frame-Options: DENY`; `X-Powered-By` disabled
- CSP intentionally deferred until it can be tested separately with Next.js scripts and blob previews
- `npm audit` reports zero vulnerabilities at Phase 1.2 completion

## Local setup

No environment file or API key is required.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production-style validation:

```bash
npm audit
npm run lint
npm run build
npm run start
```

## Optional deployment configuration

`SITE_URL` is a non-sensitive, server-side absolute HTTP(S) deployment URL, such as `https://turnphotoart.example`. Invalid or absent values are ignored; localhost is never added automatically as a canonical URL.

`SITE_INDEXING_ENABLED=true` enables indexing only when `SITE_URL` is also valid. The default is `noindex`, `nofollow`, and a robots rule that disallows crawling. When enabled, the sitemap contains only `/`, `/privacy`, and `/terms`.

## Vercel

Import the GitHub repository with the repository root as the Root Directory. Vercel should detect Next.js automatically and use `npm run build`. There are no required environment variables, secrets, persistent runtime files, databases, or long-running jobs. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete safe-deployment and smoke-test checklist.

## Current limitations

- The style preview is a CSS/Canvas approximation and varies slightly by browser and device.
- The downloaded Canvas result may be visually simpler than the live comparison.
- No purchase, print fulfilment, final artwork, or commercial guarantee is offered.
- Hosting platforms may create ordinary technical delivery logs even though customer photos remain browser-local.

Legal review and updated privacy/contract terms are required before enabling payments, real AI processing, accounts, remote storage, or fulfilment.

## Phase 2 direction

Keep the current one-page state model, but introduce generation only through an authenticated server-side job with explicit consent, retention/deletion rules, validation, rate limits, cost controls, and server-only credentials. The locked prompt must move to server-only configuration before activation.

## License and attribution

TurnPhotoArt is licensed under the [MIT License](./LICENSE). The project began from OpenAI’s ImageGen Photobooth demo. Original third-party notices remain in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
