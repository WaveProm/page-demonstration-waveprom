# Deploying

## How this project deploys

- One production deployment, and it comes from git.
- A push to `main` deploys through the Vercel integration.
- Never run `vercel --prod` : it races the push deploy for the alias.
- `NEXT_PUBLIC_MEDIA_URL` lives in the Vercel project env vars.
- It is inlined at build time, so a change to it needs a redeploy.

## The site online is stale

Incident : 2026-08-28, the new version was never pushed, localhost played the new page while the domain served the only version ever deployed.

- First check git, not the browser.
- Compare `git log origin/main` with the local log.
- Check for uncommitted changes.
- The deployed site only moves on a push to `main`.
- Only after that, suspect browser cache.
- Safari especially : hard reload, or Develop > Empty Caches.

## Videos do not play on a new origin

Incidents : 2026-08-20 and 2026-08-28, an origin missing from the bucket CORS allowlist, no video played when waveprom.com went live.

- Media streams from the public R2 bucket `waveprom-media`, at `NEXT_PUBLIC_MEDIA_URL`.
- The bucket answers CORS only to an explicit origin allowlist.
- Symptom : posters show, no video plays, CORS errors on `master.m3u8` in the console.
- It looks like a broken media layer, and it is not.
- Any new origin, domain or dev port, is added to the bucket CORS before it goes live.
- Inspect : `CLOUDFLARE_ACCOUNT_ID=b1ecc2c0695510edf19ac24e796f0b7f av inject +CLOUDFLARE_API_TOKEN -- npx wrangler r2 bucket cors list waveprom-media`
- Fix : the same command, with `cors set waveprom-media --file <rules.json> -y`.
- `set` overwrites the whole policy : list first, keep every existing origin.
- Current allowlist (2026-08-28) : localhost 3000/3001/3002/3100, https://page-demonstration-waveprom.vercel.app, https://*.vercel.app, https://www.waveprom.com, https://waveprom.com.
- `av` is a local agent tool only : it never becomes a dependency of the app or the deploy.
