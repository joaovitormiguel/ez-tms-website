# EZ TMS Website — Build Handoff

This document gives a new Claude everything needed to continue the EZ TMS website build without losing context.

---

## Project overview

**Client:** EZ TMS — a cloud-based TMS (Transportation Management System) for freight brokerages.  
**Goal:** Code the EZ TMS marketing site 1:1 from Figma and host it on GitHub Pages.  
**Status:** ALL pages coded and live: homepage, `why-ez.html`, `truckload-shipping.html`, `ltl-portal.html`, `edi-connectivity.html`, `integrations.html`, `pricing.html`, and 3 campaign landing pages (`campaign-1/2/3.html`, noindexed).

**Live URL:** https://joaovitormiguel.github.io/ez-tms-website/  
**GitHub repo:** https://github.com/joaovitormiguel/ez-tms-website (public)

Clone it anywhere on your machine to get started:
```bash
git clone https://github.com/joaovitormiguel/ez-tms-website.git
cd ez-tms-website
```

---

## Figma file

**URL:** https://www.figma.com/design/mAi3ldeK0zZfRJTlTKztii/CDM---EZ-TMS  
**File key:** `mAi3ldeK0zZfRJTlTKztii`  
**Page:** "Website Design Exploration" (canvas node `567:190`)  

All page frames are laid out as a **horizontal row** on the canvas. Here are the top-level frame node IDs:

| Frame name | Node ID | Canvas position |
|---|---|---|
| Homepage | `567:191` | x=-678 |
| 2 Why EZ | `809:694` | x=4051 |
| 3 Truckload Shipping | `879:505` | x=6378 |
| 4 LTL Portal | `879:654` | x=8705 |
| 9 EDI Connectivity | `883:817` | x=11032 |
| 10 Integrations | `921:97` | x=16073 (rebuilt — old `885:990` no longer exists) |
| 11 Pricing | `887:1089` | x=15686 |
| Campaign Landing Page (×3) | `800:2`, `844:2`, `872:224` | x=-678, 1321, 3320 (y=6708) |

> The alt/draft frames mentioned in earlier versions of this doc (`902:11`, `910:11`) have been removed from the Figma file. The Integrations frame `921:97` is the current source of truth (1600×3101).

---

## Tech stack

- **Static HTML + CSS** — no build step, no framework, no npm
- **Hosted:** GitHub Pages, branch `main`, root `/`
- **Deployment:** every push to `main` auto-deploys (~1 min build time)
- **Local preview:** `node server.js` (included in repo) serves on port 4173

To preview locally (from the repo root):
```bash
node server.js
# open http://localhost:4173
```

---

## Brand / design tokens

```css
--navy:  #0a1225   /* main dark background */
--navy2: #182954   /* secondary dark, testimonial bg */
--navy3: #223669   /* tertiary dark, hero gradient */
--red:   #ef151a   /* accent, CTAs, quote marks */
--white: #ffffff
```

**Fonts (self-hosted, in `assets/fonts/`):**

| CSS variable | Font | Files |
|---|---|---|
| `--display` | Momo Trust Display | `Momo_Trust_Display/MomoTrustDisplay-Regular.ttf` (single weight — use `font-weight:400`) |
| `--body` | Momo Trust Sans | `Momo_Trust_Sans/MomoTrustSans-VariableFont_wght.ttf` (variable, 100–900) + static files in `static/` |

> **Important:** Momo Trust Display is a single-weight typeface. Never set `font-weight` higher than 400 on `--display` elements — the browser will synthesize a fake bold that looks wrong. Its visual weight comes from the letterform design, not the CSS weight.

**Figma font names** (as they appear in design context output): `Momo_Trust_Display:Regular`, `Momo_Trust_Sans:Regular`, `Momo_Trust_Sans:Bold`

**Section divider:** the red/navy/red stripe is a `<div class="stripes">` with three `<span>` children (red 16px / navy3 16px / red 16px). It appears between every major section.

---

## File structure

```
ez-tms-website/
├── index.html          ← Homepage (only page coded so far)
├── style.css           ← All styles
├── server.js           ← Local dev server (excluded from git via .gitignore)
├── HANDOFF.md          ← This file
└── assets/
    ├── fonts/
    │   ├── Momo_Trust_Display/   ← Display font (TTF)
    │   └── Momo_Trust_Sans/      ← Sans font (variable TTF + static/)
    ├── icons/                    ← 12 feature card icons (PNG, white/red on dark)
    │   ├── crm.png, docs.png, team.png, invoicing.png
    │   ├── rating.png, freight.png, portals.png, onboarding.png
    │   ├── tracking.png, dashboards.png, ltl.png, controls.png
    ├── logo.png                  ← EZ TMS full-color logo
    ├── hero-bg.png               ← Hero background photo (smoking mouse + foam finger)
    ├── foam-finger.png           ← Foam finger thumbs-up (used in testimonials left)
    ├── foam-8bit.png             ← 8-bit foam finger mascot (footer center)
    ├── space-bg.png              ← Star field background (features section)
    ├── testimonial.png           ← Alien/Zeke image (closing CTA left side)
    ├── myloads.png               ← App screenshot: My Loads
    ├── load-pipelines.png        ← App screenshot: Load Pipelines
    ├── company-dashboard.png     ← App screenshot: Company Dashboard
    ├── feature-box.png           ← Generic feature illustration
    ├── icon1–4.png               ← Foam finger counting icons (#1–#4)
    ├── parade.png, triumph.png, truckstop.png, dat.png, denim.png  ← Integration logos
    └── space-bg.png
```

---

## Homepage sections (completed)

### 1. Header (sticky)
- Logo left, nav right (About / Discover / Integrations / Pricing / Contact / Login button)
- Class: `.site-header` / `.header-inner`
- Background: translucent navy with backdrop blur

### 2. Hero
- Full-bleed photo background (`assets/hero-bg.png`) with dark overlay gradient
- `h1`: "LESS CLICKS." (red) / "MORE GROWTH." (white) — Momo Trust Display
- Subtext + "Request a Demo" outline button
- **Note:** the foam finger in the photo is part of the background image — do NOT add a separate img overlay on top

### 3. Problem section (white bg)
- `h2`: "IF YOUR TMS IS SLOWING YOUR BROKERAGE DOWN, IT'S COSTING YOU MARGIN."
- Mockup screenshot carousel (3 images, prev/next arrows — currently no JS, static display)
- 4 icon columns with foam-finger counting icons: Built by brokers / Flat-rate pricing / Seamless transition / Team that has your back

### 4. Features (dark, starfield bg)
- `h2`: "BUILT TO HELP YOU LEVEL UP"
- **Interactive 2-column hover grid** — 12 cards, each with icon + title. Hovering/focusing a card expands to reveal its description. This is NOT a static image; it's live HTML.
- Cards are mirrored: left column has icon-left/text-right; right column is reversed
- Icons from `assets/icons/*.png`
- The 12 features in order: Built-in CRM, Digital Documentation, Team Task Manager, Automated Batch Invoicing, Rating and Capacity, Freight Matching, Customer Portals, Digital Carrier Onboarding, Live Tracking, Live Dashboards, LTL Portal, Extensive User Controls

### 5. Integrations strip (dark, inside features section)
- `h2`: "INTEGRATIONS"
- Logo strip (Parade, Triumph, Truckstop, DAT, Denim) in a red-bordered rounded box
- "See all integrations" button

### 6. Testimonials (white bg)
- Layout: `[foam-finger | quote content | › arrow]` as a flex row
- Open `"` (red, 180px, top-left) and close `"` (red, 180px, bottom-right) — both same size, positioned absolutely within `.test-quote`
- Quote text in navy, attribution "LEE CONNELL - CEO, LRT SOLUTIONS" (name navy / title red) in Momo Trust Display
- Red HR below attribution
- `›` arrow on right — infrastructure is ready for multiple slides (add `.test-slide` divs to `#testSlider`)
- **Currently only one testimonial** (Lee Connell, CEO LRT Solutions)

### 7. Closing CTA (dark)
- Split layout: alien/Zeke image left (`assets/testimonial.png`), copy right
- `h2`: "THE BEST KEPT SECRET IN FREIGHT." (SECRET in red)
- "Request a Demo" button

### 8. Footer
- Left: logo + contact info; center: 8-bit foam finger; right: nav links
- Copyright line

---

## Figma → code workflow

When coding a new page:

1. **Get section screenshots** with `get_screenshot` (node ID from metadata) to understand the layout visually
2. **Get design context** with `get_design_context` (same node ID) to extract exact copy, colors, font sizes, and asset URLs
3. **Download assets** via `curl` from the Figma asset URLs (they expire in ~7 days — always re-fetch)
4. For **illustration-heavy / icon-dense blocks**, export as a PNG rather than trying to recreate pixel-by-pixel in HTML
5. For **interactive sections**, build as live HTML elements (the features grid is a good reference)
6. Use the **local preview server** (`node server.js` → port 4173) to verify before pushing

**Getting Figma metadata efficiently:**
- The canvas metadata file is large (~200KB). When it overflows the context window it saves to a temp file — use `python3` to parse it (the format is a JSON array of `{text: string}` objects; join the `.text` fields to get the XML).
- Smart quote corruption: always use ASCII straight quotes (`"`) in HTML attributes. If HTML was written via an AI tool and classes aren't matching CSS, run: `python3 -c "import sys; data=open(sys.argv[1],'rb').read(); data=data.replace(b'\xe2\x80\x9c',b'\"').replace(b'\xe2\x80\x9d',b'\"'); open(sys.argv[1],'wb').write(data)"  index.html`

---

## Pages still to build

All pages are now coded (June 2026):

| Page | Figma node | File |
|---|---|---|
| 2 Why EZ | `809:694` | `why-ez.html` |
| 3 Truckload Shipping | `879:505` | `truckload-shipping.html` |
| 4 LTL Portal | `879:654` | `ltl-portal.html` |
| 9 EDI Connectivity | `883:817` | `edi-connectivity.html` (frame grew to 1600×2786) |
| 10 Integrations | `921:97` | `integrations.html` (logos in `assets/integrations/`) |
| 11 Pricing | `887:1089` | `pricing.html` (FAQ answers taken from designer's off-canvas draft at x≈20312) |
| Campaign Landing Pages | `800:2`, `844:2`, `872:224` | `campaign-1/2/3.html` (noindex; not linked from nav) |

Shared interior-page patterns live in `style.css`: `.site-header.light`, `.site-footer.light`, `.stripes.light[.flip]`, `.page-hero`, `.cta-band`, `.btn-outline.lg`, `.btn-solid`, `.rhd` (Red Hat Display Black — self-hosted in `assets/fonts/Red_Hat_Display/`, used by the newer Figma pages alongside Momo).

---

## Known issues / TODOs (updated June 2026)

- **"Discover" nav link** is still `href="#"` everywhere — no Discover page exists in Figma. Truckload/LTL/EDI pages have no nav entry; consider a Discover dropdown.
- **Campaign "Request Access" form** uses a `mailto:` action as a placeholder — wire to a real form backend before running ads.
- **Pricing FAQ Q1 answer** is the designer's placeholder copy (it repeats the Operations feature list); confirm real copy.
- **THREAT LEVEL field** on campaign dossiers reads "Growth-minded brokerages." — duplicated from CLEARANCE in the Figma; confirm intended copy.

### Original list

- **Mockup carousel** (problem section): the prev/next arrows are present in HTML but have no JS — they don't actually slide yet. Needs a small vanilla JS carousel.
- **Testimonials slider**: the `›` arrow is present but no JS. Add `.test-slide` divs + wire click handler on `#testNext` to cycle through them.
- **Logo quality**: all logos are low-res PNGs from Figma. Higher-res versions should be swapped in when available.
- **Integrations logo strip** (homepage): only shows 5 logos (Parade, Triumph, Truckstop, DAT, Denim). The full catalog lives in the Figma draft frame `910:11` — consider linking to the Integrations page or expanding the strip.
- **4 missing LTL carrier logos** in Integrations: QUAD, UPS, FedEx, Holland. Placeholder dashed boxes exist in the Figma draft. Drop in the real PNGs when available.
- **Meta tags / OG tags**: only basic title/description set. Add OG image, Twitter card, favicon.
- **No `<a>` hrefs**: nav links are `href="#"` placeholders — wire up once page files exist.

---

## Deploying

```bash
# make changes, then:
git add -A
git commit -m "your message"
git push origin main
# GitHub Pages rebuilds automatically (~1 min)
```

GitHub CLI is installed (`gh`). The account `joaovitormiguel` is authenticated.
