# TODO

Open questions and deferred work. One entry, one decision. An entry leaves this
file when it is done or when it is dropped, never when it is forgotten.

## Poster widths: our own srcset

A 4K AVIF served as authored to a phone is bytes spent for nothing. Two roads.
Let `next/image` scale it down, and the framework picks format, size and quality
on its own. Or encode two or three widths ourselves and declare them in a
`srcset` we control, carried by `picture` and `source`.

The second one, which hands the control back without losing anything. `Poster`
already renders a plain `img` for exactly that reason: it is the half of the
markup that does not change when the widths arrive.

## no-mistakes: decide whether we adopt it

The `no-mistakes` gate (github.com/kunchenguid/no-mistakes) installs through a
`curl | sh`, hooks itself into `git push` and opens pull requests on its own.
Worth a look now that the end-to-end test is green.

**It cannot be run alone.** A gate run holds the repository for a long stretch,
and the page has to keep moving in the meantime, so it goes into a treehouse
worktree. Blocking the project for forty-five minutes is not an option.
