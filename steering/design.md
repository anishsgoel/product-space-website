# Product Space @ Georgetown — Website Redesign Brief

## 1. Site structure: multi-page

Move from a single scrolling page to distinct pages, with a persistent top nav:

- **Home**
- **About**
- **Clients**
- **Students**
- **Careers**
- **Apply** — standalone button in the top nav (not a page tab), links to the real
  application (see §5, open item — current site links "Apply"/"Join" to a contact
  form, not an actual application).

Each page should own its content instead of everything living as anchor-linked
sections on one page. Current single-page sections (`#home #about #services
#fellowship #work #where-we-work #contact`) get redistributed into the pages
above — see §4 mapping.

## 2. Visual direction

- **Icons**: replace the current Font Awesome icon set (`fa-graduation-cap`,
  `fa-rocket`, `fa-brain`, etc.) — reads as generic/"vibe-coded." Want a more
  custom, considered icon treatment.
- **Hero**: current hero uses a `<canvas id="hero-canvas">` node/particle
  effect (see `gsap-animations.js`) — drop the node effect. Replace with a
  more dynamic hero treatment (motion/typography-driven, not particle-based).
- **Hero alignment**: left-align hero content (title, subtitle, CTA) instead
  of the current centered layout.

## 3. Content changes

- **Active application**: the "Apply"/"Start Your Project"/"Join" CTAs
  currently all point to `#contact`, a generic inquiry form. Replace with a
  link to the real, current application (need the actual URL/form from the
  club — see open items).
- **Portfolio of past work**: add a section/page presenting past client
  engagements as **descriptions of the work**, not literal work-sample
  artifacts (no decks/screenshots of deliverables — write-ups of the
  problem, approach, and outcome instead). The existing client cards
  (Google, Uber, WaPo, Noom, Product Madness, GMAC, Cencora, ID4D) are a
  starting point but need real, current descriptions.
- **Capstone highlights**: call out capstone projects specifically (current
  site has no capstone concept — this is new content, needs source material
  from the club).
- **Board & VP introductions**: add a leadership section (About or a
  dedicated block) introducing board members and VPs — photo, name, role,
  optionally current internship/placement (UCLA's site does this well, e.g.
  "Name, Co-President, TPM Intern @ Google" — signals current industry
  relevance). Needs real roster from the club.
- **Company logos**: current "Where We Work" section
  (`index.html:236-265`) mixes real alumni-placement companies (Meta,
  Microsoft, Amazon, Google, Salesforce, Tesla, etc.) with Font Awesome
  brand icons as a placeholder. Needs to be replaced with real logos and a
  roster that reflects **actual** alumni placements, not an aspirational
  list.
- **Explain product management**: add explicit copy defining what product
  management is for visitors unfamiliar with the field — none of the
  reference sites do this well either (see §6), so this is a differentiator,
  not just a gap to fill.
- **Explain program structure**: make the fellowship → client work pipeline
  explicit as a two-stage model:
  1. **Fellowship** (training) — current site's 10-week, 6-module program
     (`index.html:171-214`: Product Fundamentals, AI & LLM Products, Data &
     Analytics, Problem Discovery, Design & Prototyping, Technical
     Foundations) is good raw material.
  2. **Client work** (applied) — the client portfolio (§ above) is the
     evidence for this stage.
  Present these as sequential stages of the org, not two disconnected
  sections.

## 4. Page-by-page content mapping

- **Home**: hero (redesigned per §2), a short "what we are" intro, top-level
  stats (`$40k+` client revenue, `20+` enterprise clients, `50+` members —
  verify these are still current), and links out to About/Clients/Students.
- **About**: mission/what-is-PM explainer, fellowship → client-work structure
  explainer, board & VP introductions.
- **Clients**: portfolio of past work (descriptions, not samples), capstone
  highlights, real client logos.
- **Students**: fellowship program details (the 6 modules), how to join,
  what members get out of it — this is the "for students" counterpart to
  Clients being "for companies."
- **Careers**: real alumni placements/company logos, outcomes, testimonials
  if available.
- **Nav bar**: persistent Apply button, separate from the page tabs.

## 5. Social links

- Add Instagram and LinkedIn links (footer and/or header, per reference
  sites — UCLA and Penn both place these in the header/footer as icons).
  Need the actual @handles/URLs from the club — not yet provided.

## 6. Reference sites — takeaways

- **UCLA Product Space** (productspaceatucla.org/about): nav is Home / About
  / Careers / For Students / For Companies / Join Us, with Instagram +
  LinkedIn icons in the header. Fellowship is organized by discipline
  (Product Design / Product Management / Product Growth), each paired with
  mentors. Board members shown with photo, title, and current internship
  ("Name, Co-President, TPM Intern @ Google") — directly informs our board/VP
  section. Three pillars framing: Educate / Connect / Support.
- **Penn Product** (pennproduct.com/students): nav is Home / About /
  Students / Companies / Resources, with footer nav split into
  General/Students/Companies/Contact. Students page cleanly separates
  **Fellowship** ("semester-long crash course in product management") from
  **Consulting** ("real world experience," client teams, for more
  experienced members) — this maps directly onto our fellowship →
  client-work structure. Notably has **no** board/leadership profiles, no
  portfolio/past-work examples, and no alumni outcomes — i.e. gaps we should
  make sure our site fills rather than copies. Social icons present in
  footer but understated (Instagram @productspaceatpenn, LinkedIn
  company/87217523) — we should make ours more prominent CTAs, not
  placeholder icons.
- **Berkeley Product Space** (product.studentorg.berkeley.edu): could not be
  scraped — it's a JS-rendered SPA that returns only a page title
  ("Product Space @ Berkeley") to fetch tools. If it has patterns worth
  copying, someone needs to review it directly in a browser.

## 7. Open items — need real content/decisions from the club before build

- [ ] Real application URL/form (replacing the generic contact form as the
      "Apply" destination)
- [ ] Board & VP roster: names, roles, photos, current placements
- [ ] Real, current client logos + accurate engagement descriptions
- [ ] Capstone project write-ups
- [ ] Real alumni placement list for Careers (replace aspirational company
      list)
- [ ] Instagram and LinkedIn handles/URLs
- [ ] Confirm whether stats ($40k+, 20+, 50+) are still accurate
- [ ] Someone to manually review Berkeley's site in-browser (JS SPA, not
      scrapable)
