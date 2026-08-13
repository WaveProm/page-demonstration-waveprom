@AGENTS.md

# Stack

Next 16 (App Router, Turbopack), React Compiler, Tailwind 4, Biome, Cache Components, Vitest, Playwright.

## Commands

| Command              | What it does                                                             |
| -------------------- | ------------------------------------------------------------------------ |
| `npm run dev`        | Dev server. The MCP server in `.mcp.json` attaches to it.                |
| `npm run typecheck`  | `next typegen && tsc --noEmit`. The only thing that decides type safety. |
| `npm run lint`       | Biome check. Does not type-check.                                        |
| `npm run format`     | Biome write: formatting, safe fixes and import sorting in one pass.      |
| `npm test`           | Vitest, single run.                                                      |
| `npm run test:watch` | Vitest in watch mode.                                                    |
| `npm run e2e`        | Playwright. Boots the dev server itself.                                 |
| `npm run build`      | Where `cacheComponents` enforces its rules.                              |
| `npm run verify`     | All of the above, in order. The one to run before saying it works.       |

Green lint means nothing about types, and a green build means nothing about behaviour. `verify` is what "it works" means here.

**Routes are typed.** `typedRoutes` is on, so `<Link href="...">` only accepts a route that exists. A link that fails to type-check is a dead link, not a typing nuisance to cast away.

**After deleting a route, `rm -rf .next`.** The generated validator keeps a reference to the removed file and `typecheck` fails with `Cannot find module '../../../app/<gone>/page.js'`. That error is stale cache, not your code.

## Tests

**Vitest owns the unit tests beside the source.** `lib/utils.test.ts` sits next to `lib/utils.ts`. Pure logic, helpers, and synchronous components.

**Playwright owns `tests/`.** Real browser, real app, real user flow. Its config boots the dev server on its own, so `npm run e2e` needs nothing running first.

**`async` Server Components cannot be unit tested.** Vitest does not support them, which the framework's own guide states plainly. They belong in an e2e test.

A change that touches runtime behaviour is not verified by types or by a green build. Reproduce it the way a user reaches it, then keep that reproduction as a test.

Setup guides for both ship with the install: `node_modules/next/dist/docs/01-app/02-guides/testing/`.

## Conventions

**Tailwind 4 has no config file.** The theme lives in `app/globals.css` under `@theme`. There is no `tailwind.config.js` to look for.

**Components take a `className` prop and merge it last.** Base styles live in the component, `cn()` from `@/lib/utils` puts the caller's classes last so they win. This is what lets one component ship across brands without being reset first.

```tsx
<hr
  className={cn(
    "m-0 shrink-0 border-0",
    isVertical ? "h-full w-px" : "h-px w-full",
    className,
  )}
/>
```

`cn()` wraps `tailwind-merge` only. It handles strings, arrays, and falsy values, but not object syntax (`{ "p-2": on }`). Use a ternary or `&&` rather than adding `clsx`.

**Biome is the only linter and formatter.** No ESLint, no Prettier. Anything Biome cannot express goes in a code review, not in a second tool.

**`noFloatingPromises` is on** through Biome's `types` domain. An un-awaited promise is an error. Await it, return it, handle it, or `void` it deliberately.

**Cache Components is on.** Dynamic reads (`cookies()`, `headers()`, `searchParams`) must sit inside a `<Suspense>` boundary or behind `'use cache'`. This is a build-time rule, so a route that ignores it fails `npm run build`, not `npm run dev`.

**Partial Prefetching is on**, which `cacheComponents` is a prerequisite for. Every `<Link>` prefetches its route's shared App Shell. `<Link prefetch={true}>` no longer carries the route's dynamic content, so reach for it deliberately when a destination needs its URL data resolved before the click. Insights about this appear in the dev overlay and never block the build.

**No shadcn/ui.** Do not install it or vendor its components. Raise the need and wait for a decision.

## Deploying

**One production deployment, and it comes from git.** The repo is connected to the Vercel project, so a push to `main` deploys. Running `vercel --prod` alongside a push makes two production deployments race for the alias. Push, then check.

**The Vercel CLI ignores `.gitignore`.** It uploads whatever `.vercelignore` does not exclude, and refuses any file over 100 MB. The video masters live in the working tree during processing and are excluded there. Anything heavy that lands in the tree - encoder output, downloaded media - belongs in that file the moment it appears, or the next deploy dies mid-upload.

## The media layer is closed

`lib/orchestrator.ts`, `lib/autoplay.ts`, `components/media/`, `scripts/` and
`tests/sequences.spec.ts` hold a guarantee measured end to end: a 4K video is
playing less than 200 ms after the screen switches. That number comes from
timing nobody can eyeball. **Consume this layer, do not edit it.** Touching it
means writing the protocol first and measuring after, the way `~/perf-pro-max`
does, not reasoning about it.

Everything else is open. Sections in `components/sections/` are the ground
partner content lands on: markup, copy, layout, all yours. `HANDOFF.md` maps
what exists and how a section receives content.

**The end-to-end test is the tripwire.** `npm run e2e` asserts that a read
through the page switches screens under 200 ms. If it turns red after a change
that was meant to be markup, the change reached the media path. Say so, do not
relax the assertion.

## Verifying a change

Compiling is not working. Confirm behaviour in the running app: the `next-dev-loop` skill drives `next dev` through the framework's own view and a real browser. Reach for it when a change touches runtime behaviour rather than types alone.

## Errors

Every error falls in exactly one of these. There is no overlap to arbitrate.

**Expected** (validation, a resource that is not there) is a **return value**, never a throw. A thrown message is replaced by a digest in production, so the user reads "Something went wrong" instead of what you wrote. Server Actions surface these through `useActionState`, typed.

**Unexpected** (the database is down, a payment is refused) **travels up untouched**. `instrumentation.ts` catches it with its route, execution kind and request attached. Wrapping it in a `try`/`catch` to log it destroys exactly that context.

**Catch only to name an operation**, then rethrow with `cause` so the original survives:

```ts
catch (err) {
  throw new Error(`Stripe charge failed for order ${orderId}`, { cause: err });
}
```

Next reports where the failure happened. This says what was being attempted. The framework cannot know the second, which is the only reason to write the catch.

The one thing never to do: catch, log, and continue. That is what produces "something failed somewhere".

## Framework docs

`node_modules/next/dist/docs/` holds the docs for the exact installed version. Next 16 broke APIs the training data still remembers, `middleware` becoming `proxy` among them. When these files and recollection disagree, or these files and a skill disagree, these files win.

`AGENTS.md` is regenerated by `next dev` between its `BEGIN`/`END` markers. Edits inside that block are lost. This file is never regenerated, so house rules belong here.
