# Congress Legislation RAG Chat — Visual Style Guide

Single source of truth for product UI across design, engineering, and PM.

## 1. Introduction & Governance

**Purpose.** Define a cohesive, accessible, and responsive UI for a Retrieval‑Augmented Generation (RAG) chatbot that helps users explore U.S. Congress legislation (bills, versions, summaries, context, and citations). This guide is implementation‑ready for web (React) and flexible for future native shells.

**Scope.** Brand foundations, layout/spacing, core components (chat, navigation, forms, cards, overlays, alerts), accessibility, responsive behavior, tokens, and maintenance.

**Versioning.**
- Guide versioning: MAJOR.MINOR.PATCH (e.g., 1.3.0).
- Design token package: @congress-chat/tokens mirrors guide versions.
- Component library: @congress-chat/ui follows SemVer; any breaking UI change bumps MAJOR.

**Change requests.**
- Open a Design System issue with proposal + screenshots.
- Include accessibility impact and token diffs.
- DS maintainers triage weekly; accepted items go to design-system branch.
- Figma/Storybook PR + unit/visual tests required before release.
- Changelog and migration notes published with tags.

### At‑a‑Glance
- SemVer for guide, tokens, and components
- Issue → triage → PR → tests → release
- Accessibility impact required on every change

This guide is the single source of truth for patterns and specs (reinforced by industry practice for living style guides).

## 2. Brand Foundations

### 2.1 Logo Usage
- Safe area: ≥ 0.5× logomark height on all sides.
- Min size: 24px height in nav; 16px in favicon contexts.
- Backgrounds: Prefer light surfaces; on dark, use white or mono variant.
- Don'ts: Stretch, skew, re‑color, or overlay on busy imagery.

<Insert logo grid + safe area diagram>

### 2.2 Color Palette (Gov‑neutral, authoritative)

WCAG targets: Normal text AA ≥ 4.5:1, Large text AA ≥ 3:1, AAA ≥ 7:1.

#### Primary & UI Colors

| Role | Name | Light Mode HEX | Dark Mode HEX | Usage |
|------|------|----------------|---------------|-------|
| Primary | Federal Navy 700 | #153E75 | #6B9FFF | Main actions, links |
| Secondary | Congressional Red 700 | #7A1F1F | #FF9B9B | Alerts, secondary actions |
| Accent | Federal Gold 600 | #B6862C | #FFD466 | Highlights, badges |
| Info | Info Blue 700 | #0A4AA6 | #6BB6FF | Information states |
| Success | Green 700 | #166534 | #66D9A8 | Success states |
| Warning | Amber 700 | #92400E | #FFD466 | Warning states |
| Error | Red 700 | #7A1F1F | #FF9B9B | Error states |

#### Neutrals & Surfaces

| Role | Name | Light Mode | Dark Mode | Usage |
|------|------|------------|-----------|-------|
| Text‑Primary | Gray 900 | #101828 | #FFFFFF | Main text |
| Text‑Secondary | Gray 700 | #344054 | #D1D5DB | Secondary labels |
| Text‑Muted | Gray 500 | #667085 | #E5E7EB | Helper text, timestamps |
| Surface‑Base | Gray 50 | #F9FAFB | #111827 | Main background |
| Surface‑Alt | Soft Blue 50 | #F0F4F8 | #1F2937 | Card backgrounds |
| Pure White | White | #FFFFFF | #1F2937 | Cards in dark mode |
| Pure Black | Black | #000000 | #FFFFFF | Inverted elements |

#### Contrast Matrix (color as background vs text color)

| Color | Contrast vs #FFFFFF | Contrast vs #000000 | Pass Guidance |
|-------|-------------------|-------------------|---------------|
| Federal Navy 700 #153E75 | 10.64:1 | 1.97:1 | Use white text (AA/AAA). |
| Congressional Red 700 #7A1F1F | 10.29:1 | 2.04:1 | Use white text (AA/AAA). |
| Federal Gold 600 #B6862C | 3.28:1 | 6.40:1 | Use black text (AA). |
| Info Blue 700 #0A4AA6 | 8.25:1 | 2.55:1 | Use white text (AA/AAA). |
| Green 700 #166534 | 7.14:1 | 2.94:1 | Use white text (AA/AAA). |
| Amber 700 #92400E | 7.09:1 | 2.96:1 | Use white text (AA/AAA). |
| Gray 900 #101828 | 17.74:1 | 1.18:1 | Use white accents or place black text on light surfaces. |
| Gray 700 #344054 | 10.44:1 | 2.01:1 | Use white text on chips/badges. |
| Gray 50 #F9FAFB | 1.05:1 | 20.09:1 | Use black/Gray‑900 text. |
| Soft Blue 50 #F0F4F8 | 1.11:1 | 18.92:1 | Use black/Gray‑900 text. |
| White | 1.00:1 | 21.00:1 | Use Gray‑900 text. |
| Black | 21.00:1 | 1.00:1 | Use white text on black only if needed. |

**Validated:** All recommended text/background pairings meet WCAG 2.1 AA for normal text.

### 2.3 Typography

- Primary UI: Inter, system‑ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans‑serif
- Mono (code/citations): ui‑monospace, SFMono‑Regular, Menlo, Consolas, monospace
- Minimum sizes: Body 16px; Captions 12–14px; Legal footnotes ≥12px.

#### Type Scale (Responsive, 1.25 ratio)
- Display: 48/56/700
- H1: 36/44/700
- H2: 30/38/700
- H3: 24/32/600
- H4: 20/28/600
- Body‑L: 18/28/500
- Body: 16/24/400
- Small: 14/20/400
- Code: 13/20/500 (mono)

### 2.4 Iconography & Imagery
- Icons: Stroke 1.5px (24px grid), rounded joins; semantic colors (Info/Success/Warning/Error).
- Meaning: Never use color alone; pair icons with labels in critical UI.
- Imagery: Avoid partisan photos; prefer neutral seals/illustrations for chambers or processes.
- Bill thumbnails: Use typographic monograms (e.g., "H.R." / "S.") with bill number.

### At‑a‑Glance
- Authoritative blue‑gold‑neutral palette with validated contrast
- Inter for clarity; 16px base body
- 24px grid icons, not color‑only meaning

## 3. Layout & Spacing

### 3.1 Grid System
- Desktop: 12‑col, 72px gutter, max content 1200px
- Tablet: 8‑col, 32px gutter, content 720–960px
- Mobile: Fluid, 4‑col, 16px gutter, edge padding 16px

<Insert XS‑to‑L grid diagram>

### 3.2 Spacing Scale (8‑pt + half steps)
2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80

Token examples:
- `--space-1: 4px; --space-2: 8px; … --space-8: 32px; --space-12: 80px;`

### 3.3 Elevation / Shadows / z‑index

#### Elevation
- e0 (flat): none
- e1 (cards): 0 1px 2px rgba(16,24,40,.06), 0 1px 1px rgba(16,24,40,.04)
- e2 (popover): 0 4px 16px rgba(16,24,40,.12)
- e3 (modal): 0 8px 28px rgba(16,24,40,.24)

#### z‑tokens
- z.skiplink: 1200
- z.header: 1100
- z.overlay: 1300
- z.modal: 1400
- z.toast: 1500

### 3.4 Responsive Breakpoints
- XS: 0–599px — single column, stacked chat
- S: 600–899px — 8‑col, compact nav
- M: 900–1199px — 12‑col, optional right panel
- L: ≥1200px — 12‑col, persistent side filters & sources

### At‑a‑Glance
- 12/8/4 column grid by viewport
- 8‑pt spacing
- Elevation tokens e0–e3 and z‑index map

## 4. Core UI Components

For every component: anatomy, states, accessibility, code, DO/DON'T.

### 4.1 Buttons & Links

#### Anatomy
```
[Icon] Label [Caret] (optional)
```

#### States (Default / Hover / Active / Focus / Disabled / Loading)

**Primary (Navy 700):**
- Default: #153E75 on White text (10.64:1)
- Hover: darken 6% ; Active: darken 10% ; Disabled: Gray‑700 @ 30% α
- Focus: 3px outline #0A4AA6 outside border

**Secondary (outline):** Gray‑700 border, text Gray‑900; Hover fills Gray‑50

**Tertiary (text):** Info Blue text; underline on hover

#### Accessibility
- Hit area ≥ 44×44px
- Visible focus ring (never removed without replacement)
- Loading uses aria‑busy, not disabled (so SR announces label)

#### DO / DON'T

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use Primary for main actions per view | Stack multiple Primary CTAs together |
| Keep labels concise, verb‑first ("Ask bill question") | Use vague labels ("Submit") |
| Provide icons only with accessible label | Use color alone to denote priority |

#### Code – Primary Button (React + CSS Tokens)

<details>
<summary>HTML/JSX</summary>

```jsx
<button
  className="btn btn--primary"
  type="button"
  aria-live="off"
>
  Ask about this bill
</button>
```

</details>

<details>
<summary>CSS (tokens)</summary>

```css
:root {
  /* Light Theme (Default) */
  --color-primary: #153E75;
  --color-info: #0A4AA6;
  --color-text-primary: #101828;
  --color-text-secondary: #344054;
  --color-text-muted: #667085;
  --color-surface-base: #F9FAFB;
  --color-surface-alt: #F0F4F8;
  --color-surface-white: #FFFFFF;
}

.dark {
  /* Dark Theme */
  --color-primary: #6B9FFF;
  --color-info: #6BB6FF;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #D1D5DB;
  --color-text-muted: #E5E7EB;
  --color-surface-base: #111827;
  --color-surface-alt: #1F2937;
  --color-surface-white: #1F2937;

  /* Typography */
  --font-sans: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  /* Radii & Spacing */
  --radius-md: 8px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;

  /* Focus */
  --focus-ring: 3px solid var(--info-700);
}

.btn {
  font-family: var(--font-sans);
  font-weight: 600;
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  line-height: 1.25;
  cursor: pointer;
  transition: background-color .15s ease, box-shadow .15s ease, color .15s ease;
}

.btn--primary {
  background: var(--blue-700);
  color: var(--white);
  border: 1px solid transparent;
}

.btn--primary:hover { background: var(--blue-700-hov); }
.btn--primary:active { transform: translateY(1px); }

.btn--primary:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.btn[disabled],
.btn[aria-busy="true"] {
  opacity: .6;
  cursor: not-allowed;
}
```

</details>

### 4.2 Navigation Patterns

#### Top Bar (Anatomy)
```
[SkipLink] [Logo] [Search bills…] [Scope switch: All|H.R.|S.] [Theme]
```

**Updates:**
- Removed Sign-in button for cleaner interface
- Search bar vertically aligned with 8px top margin for better visual balance
- Scope toggle uses neutral gray colors (not primary blue) for subtle presence
- Dark mode toggle shows moon icon (🌙) in light mode, sun icon (☀️) in dark mode

#### Side Drawer (Filters)
- Facets: Chamber, Status, Sponsor, Party, Introduced date range, Topic
- Sticky "Apply" CTA on mobile

#### Tabs
```
Details • Text • Summary • Votes • Related • Sources
```

#### Breadcrumb
```
Home / Bills / H.R. 1234 / Summary
```

#### Accessibility
- Skip link to #main appears on keyboard focus
- Landmarks: header, nav[aria-label="Primary"], main, aside, footer
- Search has role="search" and <label> (visually hidden)
- Drawer is dialog[aria-modal="true"] on mobile with focus trap

#### DO / DON'T

| ✅ DO | ❌ DON'T |
|-------|----------|
| Provide skip‑to‑content | Trap focus in header on desktop |
| Label nav landmarks | Use icon‑only nav without labels |
| Keep tab order logical L→R | Reorder DOM differently from visual |

### 4.3 Form Elements

- Inputs: label (top), field, help text, validation line, error icon.
- States: default / hover / focus / filled / error / disabled.

#### Patterns
- Input: 40px height, 12px x padding; focus ring #0A4AA6.
- Select: native where possible; custom select must expose aria-expanded & aria-activedescendant.
- Checkbox/Radio: 20px; labels clickable; hit area ≥ 44px.
- Toggle: semantic labels "On/Off" with aria-pressed.

#### Error Handling
Inline error message in Error Red (on light surface); icon aria-hidden="true" and text for SR.

#### DO / DON'T

| ✅ DO | ❌ DON'T |
|-------|----------|
| Associate every input with a <label for> | Rely on placeholder as label |
| Provide specific error text | Use color alone to signal error |
| Announce async validation politely | Block typing during validation |

### 4.4 Cards & List Items

#### Bill Card (Anatomy)
```
[Badge: H.R. / S.] [Bill Number & Title]
[Meta: Sponsor · Party · Introduced YYYY‑MM‑DD]
[Status chip] [Top subjects]
[Actions: View bill] [Ask about this bill]
```

#### States
hover raises to e1, focus ring outside, pressed lowers elevation.

#### Accessibility
- Entire card is not a single link; use an internal primary link + secondary actions.
- Status chip carries text; color is supplementary only.

#### DO / DON'T

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use clear hierarchy: number → title → status | Make whole card a link (hurts SR clarity) |
| Keep metadata concise | Overflow long titles without wrapping |
| Provide keyboard‑reachable actions | Hide actions until hover only |

#### Code – Bill Card (React + semantic HTML)

<details>
<summary>JSX</summary>

```jsx
<article className="bill-card" aria-labelledby="bill-hr1234-title">
  <header className="bill-card__header">
    <span className="badge badge--bill" aria-label="House Bill">H.R.</span>
    <h3 id="bill-hr1234-title">H.R. 1234 — Accessible Web Act</h3>
  </header>

  <p className="bill-card__meta">
    Sponsor: Rep. Doe (D‑CA) · Introduced: 2025‑02‑14
  </p>

  <ul className="bill-card__tags" aria-label="Top subjects">
    <li><span className="chip chip--subject">Technology</span></li>
    <li><span className="chip chip--subject">Accessibility</span></li>
  </ul>

  <div className="bill-card__status">
    <span className="chip chip--status chip--info">Passed House</span>
  </div>

  <footer className="bill-card__actions">
    <a className="btn btn--primary" href="/bills/hr-1234">View bill</a>
    <button className="btn btn--secondary">Ask about this bill</button>
  </footer>
</article>
```

</details>

<details>
<summary>CSS (excerpt)</summary>

```css
.bill-card {
  background: var(--white);
  border: 1px solid #EAECF0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(16,24,40,.06);
}
.bill-card:focus-within { outline: var(--focus-ring); outline-offset: 4px; }
.bill-card__header { display: grid; grid-template-columns: auto 1fr; gap: 8px; align-items: center; }
.badge--bill { background: var(--gray-50); color: var(--gray-900); border-radius: 6px; padding: 4px 8px; font-weight: 600; }
.chip { border-radius: 999px; padding: 2px 8px; font-size: 12px; line-height: 18px; }
.chip--subject { background: #EEF2F6; color: var(--gray-700); }
.chip--info { background: var(--info-700); color: var(--white); } /* 8.25:1 */
.bill-card__actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
```

</details>

### 4.5 Modals & Overlays

#### Use cases
Source details, "Compare bill versions", "Citation context".

#### Specs
- Width: 640px (S), 800px (M+), max-height 80vh, scrollable body
- Backdrop: rgba(16,24,40,.56)
- Close affordances: X button, ESC key, click backdrop (unless destructive dialog)

#### Accessibility
- role="dialog" with aria-modal="true", labelled by modal title h2
- Focus trap; restore focus to invoker on close
- Live regions not inside modal unless progressive updates required

#### DO / DON'T

| ✅ DO | ❌ DON'T |
|-------|----------|
| Constrain width and height | Full‑bleed modal without escape |
| Provide close button + ESC | Hide focusable elements behind |
| Set initial focus to meaningful element | Land focus on backdrop |

### 4.6 Alerts, Toasts, Badges

#### Alerts (inline)
info, success, warning, error.
- Info: #0A4AA6 on #F0F4F8, icon + text
- Error: #7A1F1F on #FDF2F2

#### ARIA
- Non‑blocking updates: role="status" (live‑polite)
- Important errors: role="alert" (live‑assertive)

#### Toast
top‑right (z.toast), 5s default, pausable on hover.

#### Badges
subject chips, bill status chips (use color + label).

#### DO / DON'T

| ✅ DO | ❌ DON'T |
|-------|----------|
| Include clear icon + label | Use color alone |
| Keep toast content concise | Stack multiple alerts for same message |
| Provide SR‑only context if needed | Announce toasts assertively for trivial info |

## 5. Accessibility Checklist (Integrated & Standalone)

### Color & Contrast
- Normal text ≥ 4.5:1; large text (≥ 18px/14px bold) ≥ 3:1
- UI icons/graphics ≥ 3:1 against adjacent colors
- Use pairing guidance from palette matrix

### Focus & Keyboard
- Focus visible at all times; 3px Info ring
- Keyboard order matches visual order; trap only in modals/menus
- Skip link before header; target #main

### Screen Readers & Live Regions
- Chat stream list: container has aria-live="polite" and aria-busy="true" during generation; insert messages with correct role semantics (list/listitem)
- On model error: fire alert (role="alert") with human‑readable fallback
- Toggling "Save bill" uses aria-pressed and updates SR text

### Icons & Images
- Decorative icons aria-hidden="true"
- Icon buttons have aria-label or visible text
- Imagery and bill seals include useful alt text

### Errors & Validation
- Inputs show text error + icon; SR announcement via aria-describedby
- Don't disable submit on error; allow fix + re‑submit

### At‑a‑Glance
- Contrast verified by pairings
- Focus ring, skip link, and logical tab order
- Live regions for chat; alerts for errors
- No color‑only meaning; explicit labels everywhere

## 6. Content & Voice

**Tone.** Neutral, concise, and non‑partisan. Prefer plain language.

### Microcopy Conventions
- Buttons: Verb‑first ("Ask", "Open sources", "Compare versions")
- Empty states: Explain capability + next step ("No matches. Try 'H.R. 1234' or filter by chamber.")
- Tooltips: 1 sentence max, avoid jargon.

### Inclusive Language
- Avoid idioms; spell out abbreviations on first mention (e.g., CRS, CBO).
- Use person‑first language when applicable (e.g., "people with disabilities").

### Sample Error Strings
- "We couldn't fetch this bill version. Try again or open Sources."
- "Connection lost. Your message is saved—retrying…"
- "No results for '{{query}}'. Check spelling or filters."

### At‑a‑Glance
- Neutral and instructional
- Verb‑first CTAs
- Clear, human‑readable errors

## 7. Responsive Behaviour

### Breakpoint Table

| Breakpoint | Layout changes |
|------------|---------------|
| XS (≤599) | Single column; top bar compresses; search expands full‑width; filters become modal drawer; chat input docked. |
| S (600–899) | 8‑col grid; tabs scrollable; optional right panel collapses. |
| M (900–1199) | 12‑col; show persistent right "Sources" panel; two‑column lists. |
| L (≥1200) | 12‑col wide; left filters persistent; content + sources side‑by‑side. |

### Component Adaptations
- Bill Card: grid → stacked; actions wrap under content on XS
- Tabs: overflow → scroll with shadow fade
- Chat: message bubbles full‑width on XS; compact with timestamps on M+
- Tables (vote records): collapse to key‑value stacks on XS

### Performance Notes
- Responsive images (srcset, sizes) for seals/illustrations
- Lazy‑load heavy panels (Sources, long bill text)
- Defer code for modals and non‑critical charts

### At‑a‑Glance
- Mobile‑first; clear rules at each breakpoint
- Sources and Filters collapse on small screens
- Performance built‑in (lazy loading)

## 8. Assets & Design Tokens

### File Structure
```
design-system/
  tokens/
    color.json
    spacing.json
    typography.json
    elevation.json
  css/
    tokens.css
    base.css
    components/
  react/
    Button.tsx
    Card.tsx
    Modal.tsx
  docs/
    storybook/
    figma-links.md
```

### Consuming Tokens (CSS Custom Properties)

```css
/* tokens.css (generated) */
:root {
  --color-primary: #153E75;
  --color-secondary: #7A1F1F;
  --color-accent: #B6862C;
  --color-info: #0A4AA6;
  --color-success: #166534;
  --color-warning: #92400E;
  --color-error: #7A1F1F;
  --color-text: #101828;
  --color-text-muted: #344054;
  --color-surface: #F9FAFB;
  --color-surface-alt: #F0F4F8;

  --font-sans: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --radius-sm: 6px; --radius-md: 8px; --radius-lg: 12px;

  --shadow-e1: 0 1px 2px rgba(16,24,40,.06), 0 1px 1px rgba(16,24,40,.04);
  --z-header: 1100; --z-overlay: 1300; --z-modal: 1400; --z-toast: 1500;
}
```

### Design Library
- Figma: Components (Buttons, Inputs, Cards, Modals, Alerts); text & color styles.
- Storybook: Interactive states for each component; accessibility add‑on.
- Docs hub: Link tokens → Storybook → usage pages (living guide best‑practice).

### At‑a‑Glance
- Tokens as code (@congress-chat/tokens)
- Figma + Storybook as living sources
- Generated tokens.css and JSON maps

## 9. Maintenance & Contribution

### Roles
- Design System Lead: roadmap, reviews
- Accessibility Lead: audits, contrast checks, SR flows
- Component Owners: per domain (chat, cards, nav)

### PR Checklist
- [ ] Screenshots (light/dark if applicable)
- [ ] Token changes documented
- [ ] Focus states & keyboard support included
- [ ] Contrast verified for new color usage
- [ ] Unit/visual tests passing
- [ ] Changelog entry

### Automation
- Linting: stylelint, eslint, axe CI for Storybook stories
- Visual regression: Chromatic/Playwright
- Token build: style‑dictionary (JSON → CSS/TS)

### At‑a‑Glance
- Clear owners, CI checks, and changelogs
- Accessibility enforced in CI
- Living system with synchronized docs and code

## 10. Appendix

### 10.1 UI Implementation Updates

#### Dark Mode
- **Toggle**: Moon icon (🌙) in light mode, sun icon (☀️) in dark mode
- **Colors**: High-contrast palette with brighter blues (#6B9FFF) and improved text readability
- **Persistence**: Settings saved to localStorage and applied on page load
- **Smooth transitions**: 250ms ease on all color changes

#### Input Fields
- **Focus state**: Removed blue outline, now subtle gray border with soft shadow
- **Search alignment**: 8px top margin for proper vertical centering
- **Dark mode support**: Inputs adapt to theme colors automatically

#### Header Layout
- **Simplified**: Removed Sign-in button for cleaner interface
- **Scope toggle**: Uses neutral gray colors instead of primary blue
- **Search bar**: Properly centered with 12px top margin for alignment
- **Logo**: Clickable "Congress Chat" title reloads home page

#### Chat Interface
- **Message styling**: Matches sources box design with surface.base background and left border
- **Text colors**: Secondary text in light mode, white text in dark mode
- **Border colors**: Primary blue for user messages, info blue for assistant messages
- **Input styling**: Removed blue focus borders, uses subtle gray border with shadow
- **Send button**: Bottom margin for better alignment, white text in dark mode

### 10.2 Glossary
- RAG: Retrieval‑Augmented Generation (LLM answers grounded in retrieved bill chunks)
- Bill versions: e.g., Introduced, Reported, Engrossed, Enrolled
- Chambers: House (H.R.), Senate (S.)

### 10.2 Quick‑Links Cheat‑Sheet
- Skip link: `a.skip-link[href="#main"]` (visible on focus)
- Live region: `<section aria-live="polite" aria-busy="true">` for chat stream
- Modal base: `role="dialog" aria-modal="true"` + focus trap
- Primary button: Navy 700 + white text (10.64:1)

### 10.3 References (embedded context)
Structure and maintenance practices draw on well‑accepted patterns for living style guides and documentation used in aggregator‑style products.

## Component Reference (Detailed)

### A. Links
- Default: Info Blue text; underline on hover; focus ring
- Visited: Darker blue; keep underline on hover
- External: add external icon with aria-label="Opens in a new tab" and rel="noopener"

**DO / DON'T**
- ✅ Use descriptive link text ("Read bill text")
- ❌ "Click here"

### B. Textarea (Chat Prompt)
- 2–6 line auto‑grow, 16px padding, corner radius 12px
- Submit on Enter; Shift+Enter for newline; add button for mobile

**Accessibility**
- `<label>` (visually hidden) and helper text ID via aria-describedby
- Loading: disable submit button only; keep textarea editable

### C. Breadcrumbs
- nav[aria-label="Breadcrumb"] with ordered list
- Each item uses short, human labels; truncate middles on small screens

### D. Toasts
- Position: top‑right; max width 360px
- Roles: status (polite), alert (assertive) for critical only

## Composite Example: Bill "Compare Versions" Overlay

### Anatomy
```
[Title] [Close X]
[Version A selector] [Version B selector]
[Diff view: added/removed highlights]
[Actions: Swap versions] [Open in full page]
```

### States
- Loading diff → skeleton lines (not spinner only)
- Error → inline alert with "Try again" action

### Accessibility
- role="dialog" aria-labelledby="compare-title"
- Keyboard: Esc closes; Tab cycles within; arrow keys navigate diff hunks
- Color coding for add/remove plus prefixes (+/−) and legends

**DO / DON'T**
- ✅ Offer textual legends for colors
- ❌ Use green/red alone for diff changes

## Sample Token Map (Sass-like aliasing)
```scss
$color-primary: #153E75;
$color-secondary: #7A1F1F;
$color-accent: #B6862C;
$color-info: #0A4AA6;
$color-success: #166534;
$color-warning: #92400E;
$color-error: #7A1F1F;

$color-text: #101828;
$color-text-muted: #344054;
$surface-base: #F9FAFB;
$surface-alt: #F0F4F8;

$radius-md: 8px;
$shadow-e1: 0 1px 2px rgba(16,24,40,.06), 0 1px 1px rgba(16,24,40,.04);
```

## Accessibility Quick‑Audit per Component

| Component | Focus | Keyboard | SR/Lives | Contrast |
|-----------|-------|----------|----------|----------|
| Buttons | Visible ring (3px Info) | Space/Enter activate | ARIA busy for loading | ≥ 4.5:1 text/bg |
| Inputs | Ring + caret visible | Tab/Shift+Tab; Esc clears (opt) | aria-describedby for errors | ≥ 4.5:1 |
| Cards | Focus‑within ring | Tab to internal actions | Not one giant link | Chips follow matrix |
| Modals | Trap + close on Esc | Cycle; restore focus | aria-modal | Backdrop ≥ 3:1 vs content |
| Alerts/Toasts | N/A | Dismiss via keyboard | role=alert/status | Text ≥ 4.5:1 |

## Engineering Notes
- State management: components are pure; async chat state lives above.
- ARIA IDs: generate stable IDs to avoid duplicate aria-describedby.
- Theming (future): introduce data-theme="dark" with equivalent contrast‑safe pairs (e.g., Navy 800 surfaces with Gray‑50 text).

---

*Last updated 2025‑09‑25*