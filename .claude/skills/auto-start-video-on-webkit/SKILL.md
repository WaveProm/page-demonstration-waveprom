---
name: auto-start-video-on-webkit
description: Make a video actually start on Safari and on every iOS browser, and recognise the two ways WebKit lies about it - refusing to play without saying so, and claiming to support a codec it cannot decode. Use this whenever a task involves autoplay video, a muted background or hero video, a video that plays on Chrome but not on Safari, a black or frozen video on iPhone or iPad, HLS or hls.js or MSE or ManagedMediaSource, a codec probe with isTypeSupported, AV1 or H.264 fallback ladders, "the video does not start", "the poster stays up", "it works on my machine but not on my phone", or reading pixels out of a playing video. Reach for it before writing the first play() call, not after the bug report.
---

# Start a video on WebKit

WebKit fails silently, in two different ways, and a page that calls `play()` and moves on cannot tell them apart.

**It refuses to start.** No error event, no console warning, `paused` stays `true`, the frame stays frozen. The rejected promise returned by `play()` is the only place it ever says so.

**It claims to start something it cannot decode.** `paused` goes to `false`, `error` stays `null`, and no frame ever arrives.

Both look identical from the outside: a still image served to an entire platform, with nothing in the console. Everything below exists to turn that silence into a state your application can read and act on.

WebKit is not only Safari. Every browser on iOS renders with WebKit, so Chrome on an iPhone behaves exactly like Safari here, and "my colleague on Chrome cannot reproduce it" means nothing until you know which device they hold.

## The one thing that stays irreducible

**Nothing starts a video WebKit has decided not to start.**

Low Power Mode and the per-site "Auto-Play: Never" setting are user decisions. The only key that opens them is a user gesture, and no library can fabricate one. Retrying harder changes nothing.

So the goal is never "always play". The goal is:

1. Play unattended whenever the browser allows it.
2. Know, at the instant of the refusal, that you were refused.
3. Give the visitor a visible affordance whose tap doubles as the gesture that unlocks the page.

There is also no way to learn *why* you were refused. `NotAllowedError` is all WebKit ever says.

## What is measured and what is received

Everything in "Safari lies about codecs" and in "Reading pixels costs 22 ms" was measured on 2026-08-13, on WebKit, in a real page. Those sections say so where the numbers are.

The autoplay policies are received knowledge, confirmed in production but not re-measured with instruments. Treat them as reliable behaviour, not as a specification you can quote.

The distinction matters when a measurement disagrees with this document: the measurement wins, and this document is what needs updating.

# Part 1 - Getting past the autoplay policy

## Muted and inline are conditions of the permission, not decorations

WebKit grants unattended playback to an element that is muted AND inline. It re-evaluates that condition on every source attach, so an element that qualified a second ago may not qualify now.

The trap is that React sets the `muted` **property** and never the attribute. An element re-read from its attributes comes back unmuted, and the permission is gone.

Set the attribute reflection, not the property alone:

```js
const prepare = (el) => {
  el.muted = true;
  el.defaultMuted = true;              // this one IS the attribute, re-read on every source attach
  el.playsInline = true;
  el.setAttribute("webkit-playsinline", ""); // legacy in-app WebViews still read this
  el.autoplay = true;
};
```

Call it before the source is attached, and again on every attempt. Attaching a source is exactly the moment the element can be reset under you.

## The rejected promise is the only signal

`play()` returns a promise. Its rejection carries a `DOMException` whose `name` is the whole diagnosis.

| Name | Meaning | Answer |
| --- | --- | --- |
| `NotAllowedError` | The browser refused. Low Power Mode, or "Auto-Play: Never", indistinguishable. | Arm a gesture unlock, mark the state blocked, show an affordance. |
| `AbortError` | "The play() request was interrupted by a new load request". Normal when a source is attached, detached or switched. | Ignore it. The new source's media events drive the next attempt. |
| anything else | A real failure. | Report it. |

Never `catch` and continue. A swallowed rejection is exactly the silence this whole document is about.

## A hidden tab is a "not now", not a refusal

Safari does not start playback in a background tab, and pauses playback when the device locks.

Calling `play()` there spends an attempt and can report a refusal that is not one. So do not attempt while `document.visibilityState === "hidden"`. Let `visibilitychange` make that attempt when the page comes back.

The same listener is what restarts a video the lock screen paused. Add `pageshow` for the iOS back-forward cache, which restores a page with its video paused and no other event to tell you.

## A gesture is the only key, and it turns only while the hand is on it

WebKit carries the user activation through the **synchronous call stack** of the handler. Await anything first and the activation is gone.

```js
const onGesture = () => {
  disarm();
  // No await above this line. play() must run inside the gesture's own call stack.
  for (const el of waiting) el.play();
};
```

One gesture unlocks every element you call `play()` on inside that stack, so a single tap anywhere can start the whole page.

Listen on `pointerdown`, `touchend` and `keydown`, in the **capture** phase, passive. Capture matters because a handler that stops propagation must not be able to hide the one gesture that unlocks the page.

Arm those listeners only after a `NotAllowedError` has actually been seen. A page the browser never refused should pay nothing for them.

## `play()` resolving is not proof of playback

A resolved promise says the request was accepted, not that frames are moving.

The `playing` event is the confirmation. It alone should clear a blocked flag and reset an attempt budget.

## Retry on events, never on a timer

Every retry should answer a real signal:

- `canplay`, `loadeddata` - the media became playable.
- `pause` - something took playback away.
- `visibilitychange`, `pageshow` - the page came back.
- a user gesture - new permission may exist.

`stalled` and `waiting` are deliberately **not** retry triggers. Replaying an empty buffer changes nothing, and the streaming layer owns buffer starvation.

Cap the media-event retries between two confirmed `playing` events - three is a reasonable budget - so an element the browser keeps pausing cannot spin forever. A gesture or a return to the foreground is new information rather than a blind retry, so it may always attempt and reset the budget.

Do not gate the attempt on readiness. `play()` on an element with no data is a pending request the browser honours as soon as it can buffer, whereas waiting for `canplay` widens the window in which a user activation expires.

## What you owe the visitor when the refusal is real

A poster frame, always, so the refusal degrades to a still image rather than to a black rectangle.

A visible affordance the moment the state becomes blocked. Its tap is both the answer to the visitor and the gesture that unlocks every video on the page.

# Part 2 - When Safari lies about a codec

**Measured 2026-08-13, on WebKit, in a real page.**

Safari answers `MediaSource.isTypeSupported('video/mp4; codecs="av01.0.08M.10"')` with `true`, and then fails to append a single AV1 segment.

The observed chain, through hls.js:

```
hlsBufferCreated -> bufferAppendingError -> mediaSourceRequiresReset -> two retries -> fatal
```

The element is left in this state:

```
readyState: 0     // nothing decodable, ever
networkState: 3   // NETWORK_NO_SOURCE
paused: false     // it believes it is playing
error: null       // and it does not complain
```

It believes it is playing, it has nothing to play, and it says nothing. Nothing is logged, nothing errors, and the page ships a frozen poster.

Tested in 8 bit and in 10 bit, same failure both times. The same stream in H.264, same page, same engine, same code path, plays immediately. So this is the codec, not the pipeline.

## The rule this produces

**Never take `isTypeSupported` as proof that a codec will play.** It is a claim about parsing the MIME string, not a promise about the decoder behind Media Source Extensions.

Confirm the engine is not WebKit before choosing AV1:

```js
// ManagedMediaSource is a WebKit-only API. Its presence identifies the engine that lies.
const isWebKitMediaSource = "ManagedMediaSource" in window;

const av1Usable =
  Hls.isSupported() &&
  !isWebKitMediaSource &&
  Boolean(MediaSource.isTypeSupported('video/mp4; codecs="av01.0.08M.10"'));
```

Detect the engine by a capability it alone exposes, not by sniffing the user agent, which lies in a different way and is edited by every privacy setting.

## The consequences to design in

**Ship an H.264 ladder next to the AV1 one, always.** It is the parachute, and it is the only rendition guaranteed to decode everywhere. A pipeline that emits AV1 alone has no answer on WebKit.

**Choosing native HLS on Safari is a real alternative with a real cost.** Handing the manifest straight to `<video src>` on Safari does decode more formats, but it takes hls.js out of the loop, and with it everything built on top of hls.js - preloading, buffer control, segment priming, quality pinning. Decide that tradeoff deliberately rather than inheriting it.

**Record the incident, not just the fix.** A `true` that means `false` is the kind of thing a future reader will re-discover the hard way, because the code that guards against it looks like superstition.

# Part 3 - Reading pixels out of a playing video

**Measured 2026-08-13, on WebKit.**

Sampling the pixels of a playing video costs about **22 ms per sample** on WebKit.

That cost is independent of the canvas size and of the region read. Shrinking the canvas to a few pixels does not help, because what you are paying for is the GPU to CPU synchronisation, not the pixels themselves.

Moving the work into a Worker with an `OffscreenCanvas` rescues Chromium. It does **not** rescue WebKit: the synchronisation still happens, and it still costs the same.

22 ms is more than a frame at 60 Hz. Anything sampling per frame drops frames on WebKit, on the main thread and off it.

What works instead:

- Sample rarely, on a timer measured in seconds rather than in frames.
- Compute the value offline, at encode time, and ship it as data next to the video.
- Accept a stale value between samples, since the thing being derived (an average colour, a brightness) rarely changes as fast as the frames do.

**Tainting is not the obstacle here.** A video fed by Media Source Extensions does not taint the canvas: its source is a same-origin `blob:` URL, whatever the origin the segments were fetched from. The cost above is the only thing standing in the way.

# Diagnosing "the video is black on my iPhone"

Read four properties of the element, in this order, and the family of the failure falls out.

| What you read | What it means | Where to go |
| --- | --- | --- |
| `paused: true`, a rejected `play()` named `NotAllowedError` | The browser refused. | Part 1. Only a gesture opens it. |
| `paused: true`, a rejected `play()` named `AbortError` | A source attach interrupted the request. | Normal. Retry from the next media event. |
| `paused: false`, `readyState: 0`, `error: null` | The engine accepted a stream it cannot decode. | Part 2. Check the codec, not the autoplay code. |
| `paused: false`, `readyState >= 2`, no frames moving | Decoding, not compositing. Look at CSS, at the stacking context, at a zero-sized element. | Neither part. This is layout. |
| `error` is set | A real `MediaError`. | Read the code. The network or the file is the subject. |

Read them from the device, not from a desktop Safari standing in for it. Low Power Mode exists only on the phone, and it is the single most common cause of the first row.

# Checklist before shipping a video

- [ ] `defaultMuted` and `playsInline` set as attributes, applied again on every source attach.
- [ ] The rejection of `play()` is handled, `NotAllowedError` and `AbortError` told apart.
- [ ] A gesture unlock is armed on the first real `NotAllowedError`, in the capture phase, and calls `play()` synchronously.
- [ ] No attempt is made while the page is hidden. `visibilitychange` and `pageshow` make it later.
- [ ] The `playing` event, not the resolved promise, is what confirms playback.
- [ ] Retries answer events, are capped between two `playing` events, and no timer drives them.
- [ ] A blocked state reaches the UI, and the affordance it shows is tappable.
- [ ] A poster frame covers every case where nothing plays.
- [ ] An H.264 rendition exists next to any AV1 one, and AV1 is gated on the engine, not on `isTypeSupported` alone.
- [ ] Tested on a real iPhone, once with Low Power Mode on.
