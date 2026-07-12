# Phase 2 deployment and rollback

Phase 2 is not approved for public generation. Deploy only to a private/preview environment after owner review.

## Before deployment

1. Run `npm ci`, `npm audit`, `npm test`, `npm run lint`, and `npm run build` in fake/default mode.
2. Apply the versioned Supabase migration and inspect RLS/grants/RPC execution privileges.
3. Keep `TURNPHOTOART_GENERATION_PAUSED=true`, `TURNPHOTOART_IMAGE_PROVIDER=fake`, and indexing disabled.
4. Confirm the browser bundle contains no OpenAI key, Supabase service key, access code, server prompts, or `NEXT_PUBLIC_` secret.
5. Push the reviewed commit; import the repository root into a private Vercel preview.

## Fake-provider smoke test

Configure both enable flags, a long access code/session secret, server-only Supabase values, strict limits, provider `fake`, and generation paused. Confirm public mode has no upload. Enter the private gate, validate image lock/style/personality/gallery behavior, then temporarily unpause fake mode only. Create three watermarked fake results; confirm a fourth is blocked, downloads use safe names, refresh loses result blobs, and `/api/photobooth` remains 410.

## Manual OpenAI boundary

Follow `PRIVATE_TEST_SETUP.md`. Do not unpause an OpenAI provider until the repository owner explicitly approves the spend. No automatic provider smoke test belongs in CI or deployment.

## Emergency pause and revocation

- Set `TURNPHOTOART_GENERATION_PAUSED=true` and redeploy/restart immediately.
- To revoke all private access, set `TURNPHOTOART_PRIVATE_TEST_ENABLED=false`, rotate `TURNPHOTOART_SESSION_SECRET`, and rotate the access code.
- To rotate the OpenAI key, pause first, revoke the project key in OpenAI, create a restricted replacement, update only the server environment, and revalidate in paused mode.
- Inspect `daily_usage` and safe generation metadata; never log/query raw images or personality text because neither should be stored.

## Rollback

Pause generation first. Promote the last known-good deployment and preserve database records for cost reconciliation. Do not release `unknown` reservations automatically; review provider usage/request records and allow the documented owner reconciliation process to settle or expire them. Never force-push to handle an incident.
