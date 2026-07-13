# Private test owner setup

> **Do not run the first real generation until the repository owner explicitly approves the spend.**

1. Create or select the dedicated TurnPhotoArt OpenAI API project.
2. Confirm that project has GPT Image 2 access and review current pricing/rate limits.
3. Create a restricted project API key. Do not paste it into source code, chat, logs, or a `NEXT_PUBLIC_` variable.
4. Create a Supabase project or isolated schema environment for the private test.
5. Apply `supabase/migrations/20260712225940_controlled_generation_foundation.sql`; verify tables have RLS, anon/authenticated have no grants, and only service role can execute the two RPCs.
6. Configure all server-only variables listed in `.env.example`, using long random access/session secrets and strict default limits.
7. Keep `TURNPHOTOART_GENERATION_PAUSED=true`.
8. Deploy to a private Vercel preview environment with indexing disabled.
9. Set provider `fake`; validate access, fingerprint locking, both styles, personality limits, idempotency, three-success rule, downloads, and safe failure simulations.
10. Review and set strict global concurrency and daily cost-reservation limits. Hourly-IP and daily-request counts do not limit the current friends-and-family tester flow; the per-set cap is three successful versions.
11. After code/database review, change `TURNPHOTOART_IMAGE_PROVIDER=openai` while generation remains paused.
12. Confirm the server can boot without exposing configuration; do not make a generation call yet.
13. Only after explicit owner approval of one charge, set `TURNPHOTOART_GENERATION_PAUSED=false` and perform exactly one manually approved generation.
14. Immediately inspect OpenAI project usage and TurnPhotoArt `daily_usage`/generation records. Confirm no image bytes, filenames, prompt, personality text, access code, or raw IP were stored.
15. Set `TURNPHOTOART_GENERATION_PAUSED=true` again.
16. Calculate actual end-to-end cost for medium/high and each supported orientation before inviting testers.

There are no automatic retries. If a timeout is marked unknown, pause and reconcile provider usage before any manual decision. Never retry an unknown operation immediately.
