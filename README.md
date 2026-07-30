# Ayushi Sharma — Portfolio

Next.js 15 · React 19 · Tailwind 3.4 · Three.js · GSAP. Statically prerendered, dark-only,
recruiter-facing single page.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static prerender + generated OG image
```

---

## 1. Set the real domain (do this first)

One line, in [`lib/site.ts`](lib/site.ts):

```ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ayushi-sharma.vercel.app'
```

Change the fallback, **or** set `NEXT_PUBLIC_SITE_URL` in Vercel → Settings → Environment
Variables. Canonical tag, `sitemap.xml`, `robots.txt`, `og:url` and the JSON-LD `Person.url` all
derive from it, so nothing else needs editing.

## 2. Portrait — done

`public/ayushi.jpg` is in place and `lib/site.ts` points at it. The hero tile is square
(the source is an 800x800 crop), so nothing about Ayushi's face is cropped.

To swap it: replace the file, keeping a square source of at least 800x800. Set
`portrait: null` to fall back to the monogram tile — the hero handles both.

## 3. Résumé — done

`public/ayushi-sharma-resume.pdf` is in place and linked from two places: the hero and
the contact section. Both carry the `download` attribute, so a click saves the file
rather than opening the browser's PDF viewer.

Note: that PDF contains a phone number the page itself does not display. It is now
publicly downloadable and crawlable. To change that, either replace the PDF with a
variant that omits the number, or set `resumeHref: null` in `lib/site.ts` to remove
both buttons.

## 4. Deploy

```bash
npx vercel --prod
```

Framework preset auto-detects as Next.js. No environment variables are required beyond the
optional `NEXT_PUBLIC_SITE_URL`.

---

## Image prompts

The page needs **no** generated imagery to look finished — the hero visual is live WebGL and the
social card is generated at build time from `app/opengraph-image.tsx`. These are only if you want
to add optional texture.

Everything below is abstract. Do **not** generate a face: the portrait must be a real photograph of
Ayushi, otherwise the page is showing a fabricated likeness of a real person.

### A. Hero backdrop texture (optional, replaces nothing)

> Abstract dark technical texture, near-black charcoal background (#09090B), extremely subtle
> deep-blue point constellation scattered across the frame, faint depth-of-field falloff toward the
> edges, no visible shapes or objects, no text, no logos, no people. Grainy film-like noise at very
> low intensity. Flat composition, evenly weighted, suitable as a tiling background. Muted,
> restrained, editorial. 2560×1440.

### B. Project card thumbnails (optional — three, one per project)

Keep the same treatment across all three or they will not read as a set.

> **Webnaut** — Abstract representation of a web conversion funnel as thin luminous blue lines
> narrowing across a near-black field, isometric, minimal, no text, no UI screenshots, no logos.
> Deep blue (#1D4ED8) on charcoal (#09090B), high contrast, generous negative space. 1600×1000.

> **LUTBuilder.ai** — Abstract colour-grading motif: three overlapping translucent colour gradient
> ramps (teal, amber, magenta) drifting across a near-black field, soft film-grain, cinematic,
> minimal, no text, no interface elements, no people. 1600×1000.

> **Client Web & ML Applications** — Abstract scatter plot forming a soft diagonal regression
> trend, small glowing blue points on charcoal, thin gridlines barely visible, minimal, technical,
> no text, no axis labels, no logos. 1600×1000.

Save as `public/work/webnaut.jpg`, `public/work/lutbuilder.jpg`, `public/work/client-ml.jpg` and
tell me — the project cards need a small layout change to show them, which I have not built yet
since the current text-only cards are deliberately dense and fast.

---

### The game — Ship It

`components/ShipItGame.tsx`. A component arrives with a width; you place it in a slot that
width fits. Arrow keys move the highlight, space (or tap) places, wrong slot costs a break,
three breaks ends the run. Finishing a page loads a denser one with less time per piece.

Slot widths are deliberately spaced far enough apart to tell apart by eye, and the piece
glides over the highlighted slot so you compare them overlaid. `PAGES` at the top of the
file is the layout table if you want to add pages.

## Performance & SEO notes

Deliberate decisions worth not undoing:

- **`three` and `gsap` are dynamically imported.** They are absent from the 111 kB first-load
  bundle. Converting either to a static top-level import will regress LCP.
- **The WebGL scene does not initialise until it is on screen and the main thread is idle**, stops
  its render loop when scrolled away or the tab is hidden, clamps DPR to 1.75, and halves its point
  count under 640 px.
- **`prefers-reduced-motion` renders one static frame** and never starts the loop. Reveal
  animations are skipped entirely and content renders visible.
- **Reveal animations are opt-in, not opt-out.** The inline script in `app/layout.tsx` adds
  `motion-ready` pre-paint; only then does CSS hide `[data-reveal]`. No JS, reduced motion, or a
  crawler means everything is visible. If GSAP fails to load, `Motion.tsx` removes the class so
  content is never trapped behind a broken animation.
- Every route prerenders to static HTML. `sitemap.xml`, `robots.txt` and the 1200×630 OG PNG are
  generated at build.
