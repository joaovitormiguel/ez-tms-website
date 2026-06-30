# EZ TMS Website — Pre-Launch Checklist

Things to resolve before the site goes live / before driving paid traffic to it.

## Forms / lead handling

- [ ] **Wire up form handling.** The site has no backend, so not every form delivers leads server-side yet:
  - **Demo modal** (every "Request a Demo" / "Book a Demo" button) → posts to **HubSpot** (portal `7348614`, form `457a5429-3d74-43af-8845-0731544be4e2`). ✅ Working — submissions land in HubSpot.
  - **Contact modal** (every "Contact" nav link) → currently composes a `mailto:` to `Sales@EZ-TMS.com`, which opens the visitor's email client. Decide whether that's acceptable or wire it to a real endpoint (HubSpot form, Formspree, or a webhook) so submissions are captured automatically. _File:_ `assets/contact-modal.js` (the `form submit` handler).
  - **Campaign landing pages** (`campaign-1/2/3.html`) "Request Access" forms still use `action="mailto:Sales@EZ-TMS.com"` as a placeholder — wire to a real backend before running ads. _File:_ each campaign HTML (`.access-form`).

## Privacy / compliance

- [ ] **Disclose HubSpot in the privacy policy.** The demo form now loads HubSpot's embed script, which can set cookies — the current policy says "we do not use cookies for tracking." Update `privacy.html` accordingly.
- [ ] **Cookie banner model.** Current banner uses implied consent ("by using this site you agree") + OK — fine for a US audience, but **not** GDPR-compliant. If meaningful EU/UK traffic is expected (or analytics/ads get added), switch to explicit opt-in with a real reject option.
- [ ] **Confirm `support@ez-tms.com` exists.** Used in `terms.html` for cancellations and user-seat changes (changed from the old `support@ezloadertms.com`).
- [ ] **Have counsel review `terms.html`.** Confirm the entity names ("EZ TMS LLC", "EZ TMS Software LLC"), the Georgia/Whitfield County jurisdiction, and the $1,500 setup fee are correct for the EZ TMS entity.

## Content / polish

- [ ] **"Discover" nav link** is still `href="#"` everywhere — decide on a Discover page or dropdown.
- [ ] **Meta / OG tags + favicon** — only basic title/description set; add OG image, Twitter card, favicon.
- [ ] **Quad logo** — needed for the integrations marquees (homepage + LTL Portal). It was only a placeholder in the original ticker, so there's no logo file; once a real Quad logo (PNG/SVG) is added to `assets/integrations/`, drop it into both marquees.
