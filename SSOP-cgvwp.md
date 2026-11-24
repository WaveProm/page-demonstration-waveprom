# SSOP cgvwp

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| The password the visitor typed | The form field `password`, posted as FormData | `grantCgvAccess` | `unlockCgv`, through `typeof password === "string"` | `string` | A file or a missing field read as a password |
| The expected password | The environment variable `CGV_PASSWORD` | `lib/cgv-access.ts` | `expectedPassword`, which throws when the variable is unset or empty | A non-empty `string` | An empty password that an empty field would match |
| The proof the password was typed | The httpOnly cookie `cgvwp`, sent back by the browser | `hasCgvAccess` | `hasCgvAccess`, which compares it to the hash of `CGV_PASSWORD` | `string \| undefined`, the SHA-256 of the password in base64url | The password in clear in the cookie, and a cookie that outlives a change of password |
| Whether the visitor may read the CGV | `hasCgvAccess` | `CgvGate` in the page | None, the value is typed | `boolean` | The text of the CGV sent before the check |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| hasCgvAccess, grantCgvAccess | `CGV_PASSWORD`, the request cookies | `()`, `(password: string)` | `Promise<boolean>`: whether the visitor may read, whether the access was granted | lib/cgv-access.ts |
| unlockCgv | grantCgvAccess, FormData | `(formData: FormData)` | `Promise<void>`, a redirect to `/cgvwp` once the access is granted | lib/unlock-cgv.ts |
| CgvText | none | none | The text of the CGV, articles 1 to 19 | components/cgv/CgvText.tsx |
| PasswordForm | unlockCgv | none | One password field and one button | components/cgv/PasswordForm.tsx |
| CgvPage | hasCgvAccess, CgvText, PasswordForm | none | The CGV for a visitor holding the cookie, the form for anyone else, marked `noindex, nofollow` | app/cgvwp/page.tsx |

Edges: unlockCgv needs grantCgvAccess. PasswordForm needs unlockCgv. CgvPage needs hasCgvAccess, CgvText and PasswordForm. `CGV_PASSWORD`, the request cookies and FormData are boundary data.

Sort:

1. lib/cgv-access.ts, CgvText
2. unlockCgv
3. PasswordForm
4. CgvPage

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| lib/cgv-access.ts | Where the password lives and how its proof is kept: the cookie, its hash, its lifetime | `hasCgvAccess()` reads the request cookies, so it renders inside `<Suspense>`; `grantCgvAccess(password)` writes a cookie, so it runs in a Server Action only; both throw when `CGV_PASSWORD` is unset |
| unlockCgv | What the form posts and where a success lands | It is the `action` of a form holding a field named `password`; it redirects to `/cgvwp` on success and returns on failure |
| CgvText | The words of the CGV | Nothing |
| PasswordForm | The markup of the form | Nothing |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| Whether the visitor typed the right password | The cookie `cgvwp`, written and read by the server only | hasCgvAccess | grantCgvAccess |
| The password | The environment variable `CGV_PASSWORD` | lib/cgv-access.ts | The human, in Vercel and in `.env.local` |
| The password being typed, not yet sent | The password field, uncontrolled | The browser, on submit | The visitor |
