# SSOP cgvwp relock

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| The password the visitor typed | The form field `password`, posted as FormData to the Server Action | `isCgvPassword` | `unlockCgv`, through `typeof password === "string"` | `string` | A file or a missing field read as a password |
| The expected password | The environment variable `CGV_PASSWORD` | `lib/cgv-access.ts` | `expectedPassword`, which throws when the variable is unset or empty | A non-empty `string` | An empty password that an empty field would match |
| The state of the gate | `unlockCgv`, returned in the response to the submit | `CgvGate` | None, the value is typed through `useActionState` | `{ status: "locked" } \| { status: "refused" } \| { status: "open"; terms: ReactNode }` | The terms held without an open status, the error shown beside the terms, the terms kept anywhere but in the memory of the page |
| How the browser may keep the /cgvwp document | `next.config.ts` | The browser | The `Cache-Control` response header | `no-store` | A back button restoring an unlocked page from the browser cache |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| isCgvPassword | `CGV_PASSWORD` | `(password: string)` | `boolean`, whether the typed password is the expected one | lib/cgv-access.ts |
| CgvText | none | none | The text of the CGV, articles 1 to 19, unchanged | components/cgv/CgvText.tsx |
| CtaButton | none | `{ children, className?, href }` or `{ children, className?, type: "submit" }` | The face of the site's CTA, as a link or as a submit button | components/cta-button/CtaButton.tsx |
| The /cgvwp headers | none | none | `Cache-Control: no-store` on /cgvwp | next.config.ts |
| unlockCgv, CgvGateState | isCgvPassword, CgvText, FormData | `(previous: CgvGateState, formData: FormData)` | `Promise<CgvGateState>`, the terms rendered on the server when the password matches, a refusal otherwise | lib/unlock-cgv.tsx |
| PasswordForm | CtaButton | `({ action, refused })` | The password screen: one field, one button, one error line, centered on black | components/cgv/PasswordForm.tsx |
| CgvGate | unlockCgv, CgvGateState, PasswordForm | none | The password screen until the gate opens, then the terms in black on white | components/cgv/CgvGate.tsx |
| CgvPage | CgvGate | none | The gate, marked `noindex, nofollow` | app/cgvwp/page.tsx |

Edges: unlockCgv needs isCgvPassword and CgvText. PasswordForm needs CtaButton. CgvGate needs unlockCgv, CgvGateState and PasswordForm. CgvPage needs CgvGate. `CGV_PASSWORD` and FormData are boundary data.

Sort:

1. isCgvPassword, CgvText, CtaButton, the /cgvwp headers
2. unlockCgv, PasswordForm
3. CgvGate
4. CgvPage

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| lib/cgv-access.ts | Where the password lives and how a typed one is compared | `isCgvPassword(password)` runs on the server only, and throws when `CGV_PASSWORD` is unset |
| unlockCgv | What the form posts and what an opening sends back | It is the action of a `useActionState` whose form holds a field named `password`; it returns the next state of the gate, the terms rendered on the server inside it |
| CtaButton | The face of the site's CTA | A link takes `href`, a submit button takes `type: "submit"`; `className` merges last |
| PasswordForm | The markup of the password screen | `action` runs on submit, `refused` shows the error line |
| CgvGate | Which screen the visitor sees | Nothing |
| The /cgvwp headers | How the browser may keep the page | Nothing |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| Whether the terms are open | CgvGate, through `useActionState`, in the memory of the page only | CgvGate | unlockCgv, by its return value |
| The password | The environment variable `CGV_PASSWORD` | lib/cgv-access.ts | The human, in Vercel and in `.env.local` |
| The password being typed, not yet sent | The password field, uncontrolled | The browser, on submit | The visitor |

## Amendments
