# TurnPhotoArt public-preview deployment

This checklist prepares a deployment; it does not indicate that one has been created.

## 1. Pre-deployment checks

From the repository root, confirm a clean intended commit and run:

```bash
npm ci
npm audit
npm run lint
npm run build
```

Expected: zero audit findings and successful lint/build. Confirm `POST /api/photobooth` still contains the unconditional Phase 1 HTTP 410 handler and that the homepage does not import the legacy generation client.

## 2. Push to GitHub

Review the commit, then have the repository owner push the intended `main` commit to `pollorenzo-pixel/TurnPhotoArt`. Do not force-push or rewrite history.

## 3. Import into Vercel

1. In Vercel, choose **Add New → Project** and import `pollorenzo-pixel/TurnPhotoArt`.
2. Leave Framework Preset as **Next.js**.
3. Use the repository root as Root Directory.
4. Use `npm run build` as Build Command and the default Next.js output.
5. Do not add a database, Blob store, analytics integration, or image-generation secret.

No `vercel.json` or Vercel CLI dependency is required.

## 4. Environment settings

No variable is required. Optional server-side variables:

```text
SITE_URL=https://your-public-preview.example
SITE_INDEXING_ENABLED=false
```

`SITE_URL` is not secret. Use the final HTTPS origin without a trailing slash. Indexing remains disabled unless `SITE_INDEXING_ENABLED=true` and `SITE_URL` is valid. Do not create `NEXT_PUBLIC_` versions.

## 5. Production smoke tests

Replace `$ORIGIN` with the deployed HTTPS origin:

```bash
curl -I "$ORIGIN/"
curl -I "$ORIGIN/privacy"
curl -I "$ORIGIN/terms"
curl -i "$ORIGIN/api/health"
curl -i -X POST -H 'Content-Type: application/json' -H "Origin: $ORIGIN" --data '{}' "$ORIGIN/api/photobooth"
```

Confirm homepage/legal routes return 200, health returns small `local-preview` JSON with `no-store`, and generation returns 410 with `no-store`.

## 6. Browser checks

- Upload temporary JPEG, PNG, and WebP fixtures; do not commit customer images.
- Verify invalid files are rejected and replace/remove/reset work.
- Complete progress, comparison, and local PNG download.
- Refresh and confirm the active image state disappears.
- Open Privacy, Preview Terms, an unknown route, and `/results`.
- Confirm no generation request, customer-image network request, console error, hydration error, or exposed API key.
- Inspect metadata and the local social card; confirm there is no localhost canonical.

## 7. Privacy and indexing checks

- Confirm Privacy accurately says photos remain in the current tab and mentions ordinary hosting logs.
- With indexing disabled, verify `noindex`, `nofollow`, and `/robots.txt` disallow crawling.
- Enable indexing only after owner approval; verify canonical URLs, `/robots.txt`, and `/sitemap.xml` list only the homepage and legal pages.

## 8. Rollback

Use Vercel’s deployment history to promote the last known-good deployment. Do not fix a deployment incident by force-pushing or rewriting Git history. If privacy or generation boundaries are uncertain, remove public access or roll back first, then investigate locally.

## 9. Post-deployment

- Record the deployed commit and production origin.
- Re-run route, header, metadata, upload, download, privacy, and disabled-API checks.
- Keep indexing off for the initial preview unless explicitly approved.
- Update this documentation and legal wording before any AI, payment, analytics, account, or remote-storage integration.
