# TODO

Open questions and deferred work. One entry, one decision. An entry leaves this
file when it is done or when it is dropped, never when it is forgotten.

## Portrait on mobile: playback reads as random

Scrolling the page on a phone held upright, videos start and stop in a way that
feels arbitrary. The cause is geometry, not the state machine: a 16:9 video at
full width is a 220 pixel band on a phone, so several of them share the screen
at once and the playback boundary is crossed by more than one at a time.

Nothing to fix before the real content lands. A section carrying its copy will
most likely fill a screen on mobile, which puts one video per screen again and
restores the assumption the boundary is built on. Re-measure then, with
`scripts` untouched and the end-to-end test as the judge.

## no-mistakes: decide whether we adopt it

The `no-mistakes` gate (github.com/kunchenguid/no-mistakes) installs through a
`curl | sh`, hooks itself into `git push` and opens pull requests on its own.
Worth a look now that the end-to-end test is green.

**It cannot be run alone.** A gate run holds the repository for a long stretch,
and the page has to keep moving in the meantime, so it goes into a treehouse
worktree. Blocking the project for forty-five minutes is not an option.
