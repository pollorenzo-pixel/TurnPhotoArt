# TurnPhotoArt

TurnPhotoArt turns one reference photo into up to three downloadable artwork versions using one of two locked house styles. Phase 2 adds an invite-only, disabled-by-default GPT Image 2 generation foundation. No public generation, payment, account, analytics, image storage, or real provider call was enabled during implementation.

## Operating modes

The public default requires no secrets and shows the brand, two house styles, an empty future showcase, and “Private testing underway.” It contains no upload, fake artwork preview, local effect, or preview download.

Real generation requires every server-side gate:

```text
TURNPHOTOART_AI_ENABLED=true
TURNPHOTOART_PRIVATE_TEST_ENABLED=true
TURNPHOTOART_GENERATION_PAUSED=false
TURNPHOTOART_IMAGE_PROVIDER=openai
```

It also requires valid private-access, Supabase, and OpenAI configuration. Missing or unsupported configuration fails closed. `TURNPHOTOART_IMAGE_PROVIDER` defaults to `fake`; the official OpenAI client is dynamically imported and constructed only inside the OpenAI adapter after Cost Guard approval.

## Private-test architecture

- Constant-time access-code comparison and a signed 12-hour HttpOnly, SameSite=Lax session cookie.
- One cryptographically random artwork-set token returned only to the current tab; only its SHA-256 hash is stored.
- Server-side SHA-256 fingerprint locks exactly one reference byte sequence to the set.
- Browser resubmits the reference for each generation; the backend validates MIME, magic bytes, decoding, dimensions, and fingerprint.
- Raw references, generated images, filenames, complete prompts, and complete personality text are never stored in Supabase.
- Generated PNGs return as `no-store` binary responses and live only in current-tab blob URLs until downloaded.
- Two server-owned styles: `bold-playful` and `playful-storybook`, prompt version `turnphotoart-prompt-v1`.
- Optional normalized personality direction is limited to 160 characters and remains secondary to preservation and style rules.

## Three successful versions and Cost Guard

Atomic Supabase RPCs enforce three successful generations, one active operation per set/session, global concurrency, daily reserved-cost units, and idempotency. Hourly-IP and daily-request counts are retained in the compatible state-layer interface but are not active tester-facing blockers in this friends-and-family flow. Confirmed failures and moderation blocks do not increment the successful count. Unknown provider timeouts retain their reservation and are not retried automatically.

A successful usable PNG consumes its version when server settlement succeeds, whether or not the tester clicks download. Download is a browser delivery convenience; every successful card remains available until the tab is refreshed or closed.

Cost units are conservative internal reservation units, not currency or guaranteed provider billing. OpenAI dashboard alerts are supplementary and never the only hard control.

## Providers

`fake` generates a deterministic local PNG visibly marked `FAKE PROVIDER — NOT AI ARTWORK`. It supports simulated success, moderation, failure, unknown timeout, and malformed output. Automated validation always uses fake mode and makes no external provider request.

`openai` uses the official Node SDK, `gpt-image-2`, Image Edit, one non-streamed PNG, `partial_images: 0`, automatic moderation, server-selected 1024 output orientation, and medium/high server configuration. SDK automatic retries are disabled.

## Database

Apply `supabase/migrations/20260712225940_controlled_generation_foundation.sql`. It creates RLS-enabled tables `artwork_sets`, `generations`, and `daily_usage`, service-role-only grants, indexes, constraints, and atomic reservation/settlement RPCs. Supabase Storage is not used and the service-role key must remain server-only.

## Local development

```bash
npm ci
npm audit
npm test
npm run lint
npm run build
```

The public mode runs with no `.env.local`. Use only fake provider and memory state for automated/local route tests; memory state must never back a real deployment.

See [PRIVATE_TEST_SETUP.md](./PRIVATE_TEST_SETUP.md) before configuring private testing and [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment/rollback checks.

## Privacy and result lifetime

In public mode no photo upload occurs. In private test mode the backend sends the reference to OpenAI when the owner has explicitly enabled the provider. TurnPhotoArt stores fingerprints and minimal operational metadata, not image bytes. Results may be lost on refresh; download each one before leaving.

## Friends-and-family showcase

Private images are never published automatically. The manual process is: the tester receives and chooses whether to share a result; separate written consent is obtained; approved original/generated images are manually prepared; personal information is removed where appropriate; only then may approved files be added in a future commit. Participation alone grants no marketing permission.

## Current limitations

Invite-only access; no Stripe, public accounts, server gallery, email delivery, physical prints, automated showcase consent, public indexing, automatic provider retries, 2K/4K output, partial streaming, or durable generated-image storage.

Phase 3—not this phase—may add Stripe Checkout, paid entitlement, webhook verification, measured pricing, receipts, refund-safe handling, commercial legal review, and optional secure temporary result storage.

## License

MIT licensed. Original demo and third-party notices remain in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
