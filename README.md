# borgwardt.me

My personal site. It holds the AI-for-learning tools I build, the talks I give,
and the ways to reach me. Live at [borgwardt.me](https://borgwardt.me).

If you got here from the colophon at the bottom of the page: this is what you
were looking at.

## One HTML file, on purpose

The whole page is a single `index.html`: the markup, one inline `<style>` block,
and one inline `<script>` at the bottom. The behaviour that a few pages share
(the split-flap name, the photo parallax, the pronunciation line, two of the
demos) lives in `scripts/effects.js`. That is the entire stack. No framework, no
bundler, no build step.

The reason is maintenance. The site changes a few times a month, often from a
phone or between classes. A build step is one more thing that can break between
the edit and the deploy, and a broken build here means the page is down. With
plain files, what I edit is what ships: I push to `main` and GitHub Pages serves
it a minute later. The fonts are self-hosted in `fonts/` for a related reason,
and because German courts treat loading them from Google's CDN as a data
transfer that needs consent.

## The hand-built parts

Nothing here comes from a component library. The pieces worth reading:

- **3-D coverflow carousel** (`.cf-*`, inline in `index.html`). Seven project
  cards on a CSS `perspective` stage: one in focus, two faded neighbours each
  side, and a seamless wrap-around, so the deck always travels the shortest way
  to a card and the ends join. Every path into it (arrows, swipe, keyboard, the
  deep-link hash, the index nav) runs through one `selectProject()` function. On
  a phone the stage takes the height of the centred card, which took four
  specific ordering rules to stop it slicing text mid-transition; they are
  written up in the comments where they live.
- **UTE demo** (`scripts/effects.js`). A scripted walk-through of a voice
  point-of-sale: speech comes in, the order fills itself in the background. The
  scenes are timed and driven by a small state machine.
- **Sensei canvas scroll** (inline). A frame-by-frame figure animation tied to
  scroll position and painted to a `<canvas>`. Its frames and background load
  only when the story that uses them opens.
- **Split-flap name** (`scripts/effects.js`). The name in the masthead resolves
  one character at a time, like a departure board.

## Accessibility

Held to zero [axe](https://github.com/dequelabs/axe-core) violations, checked at
desktop and phone width with the project stories both closed and open. Alongside
that:

- `prefers-reduced-motion` is honoured throughout. The carousel, the split-flap,
  the canvas scroll and the reveal transitions all fall still.
- Touch targets are at least 44x44px.
- The section tabs follow the ARIA roving-tabindex pattern: arrow keys move
  between them and only the active tab sits in the tab order. The carousel takes
  keyboard input, and the centred card's control is reachable by Tab.
- Contrast meets WCAG AA. The small monospaced captions were darkened until they
  clear 4.5:1 on the paper background.
- With JavaScript off, the carousel falls back to a plain vertical list of the
  seven cards.

## Running it locally

There is nothing to install.

```sh
open index.html          # or double-click it
```

Anything that loads a sibling file (the fonts, the demo images, `effects.js`)
wants a real origin, so to see the full page, serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Layout

```
index.html            the whole site: markup, inline CSS, inline carousel JS
scripts/effects.js    split-flap, photo parallax, pronunciation, Compass + UTE demos
fonts/                self-hosted Cormorant Garamond + JetBrains Mono (woff2)
img/, sensei-scroll/  story figures and the sensei animation frames
impressum.html        legal notice (German, then English)
datenschutz.html      privacy policy (German, then English)
404.html              not-found page
```
