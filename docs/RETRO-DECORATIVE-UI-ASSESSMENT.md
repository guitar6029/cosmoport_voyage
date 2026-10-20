# CosmoPort Voyage — Retro Decorative UI Assessment

## Scope and conclusion

This is a documentation-only assessment of the current homepage. The goal is to strengthen the existing 1950s atomic-age travel-brochure identity with small, reusable decorative details; it is not a proposal to redesign the layout, replace the imagery, or add a new visual framework.

The current foundation is strong: the Fontdiner Swanky / Cherry Cream Soda pairing, deep teal and warm accent palette, large destination typography, irregular image framing, and horizontal attraction carousel already read as optimistic interplanetary travel. The highest-value next step is a restrained layer of “printed brochure hardware”: numbered badges, short divider rules, small starbursts, and occasional framed callouts. These should clarify hierarchy and establish place-branding, not compete with the hero image or destination photography.

## 1. Existing visual identity assessment

### What is already working

- The hero combines a full-bleed rocketliner image, a dark teal readability scrim, warm gold/coral accents, and a shaped text panel. It has the strongest existing travel-poster signal.
- Fontdiner Swanky gives the hero and destination names a distinctive display voice. Cherry Cream Soda provides a compatible hand-lettered supporting voice for taglines, guide headings, and attraction titles.
- `DestinationSection` is a useful shared system for Aurora City, Pearlwater Coast, and Saffron Expanse. The common intro, hero image, guide heading, carousel, card numbering, and theme variables make it possible to add decoration once and let the three destinations diverge mainly through color.
- The hero panel and destination image/card borders already use irregular, rounded forms rather than a modern rectangular dashboard language.
- Existing `01 / 05` positioning, directional arrows, uppercase eyebrows, and `CPV / destination` fallback text provide natural anchors for a vintage information-design vocabulary.
- Reduced-motion handling already exists for the hero controls and destination cards, so future decorative motion can follow an established convention.

### Guardrails for the next pass

- Keep decoration sparse against the large image areas. The primary contrast should remain between content and image, not between multiple competing ornaments.
- Treat cream, aqua, gold, coral, and deep teal as a controlled ink palette. Avoid adding a separate “retro” color set per destination.
- Prefer marks that can be removed at narrow widths without changing content order or meaning.
- Keep labels and counters legible at the existing small sizes; decoration should not force more tracking, smaller text, or lower contrast.

## 2. Findings from the supplied references

The three Pinterest pins were inspected in the open browser:

1. [Mahjong guide pin](https://www.pinterest.com/pin/351984527147897185/) — a hand-lettered instructional composition with rounded information panels, circular numbered markers, small atomic starbursts, directional lines, and a lively cream/teal/coral palette.
2. [Retro flyer / hot-dog advertisement pin](https://www.pinterest.com/pin/354306695668647882/) — a commercial-advertising reference board with bold sign lettering, badge-like marks, blocky color fields, illustrated product framing, and compact promotional details.
3. [Summer at the Library / daily-specials pin](https://www.pinterest.com/pin/969610994787107187/) — a grid of mid-century promotional panels using strong color blocking, editorial image/text cells, small seals, and repeated poster-like compartments.

The Pinterest page itself is not available to the direct text web reader, but all three pins were readable through the browser UI and screenshots. No local reference image paths were supplied.

### Appropriate takeaways for CosmoPort

- **Numbered circular markers:** appropriate for attraction order and destination wayfinding because the existing cards already expose numeric position. Use them as a small badge or outlined disc, not as a new navigation model.
- **Short rules and separators:** appropriate between an eyebrow and title, or beside a guide subtitle. They reinforce “printed brochure” structure with almost no visual weight.
- **Atomic starbursts and Sputnik-like points:** appropriate as occasional corner accents near a heading or counter. Use a few sizes and rotate them rather than scattering repeated icons everywhere.
- **Framed information panels:** appropriate for the existing hero description panel, destination guide subtitle, future radio promos, and sponsorship copy. Their usefulness comes from grouping short copy, not from adding extra containers to every card.
- **Color-blocked poster cells:** useful as inspiration for future sponsor ads or radio modules, but too dense for the current destination intro and card imagery. CosmoPort’s existing photographs/illustrations need more breathing room.
- **Vintage advertising micro-details:** small “CPV / 1958”, route codes, issue marks, or fictional sponsor seals can add world-building. They should remain clearly secondary and should not imply unavailable actions or links.

### What not to copy

Do not reproduce the reference artwork, characters, lettering, brand marks, or exact panel compositions. Avoid turning the homepage into a collage of unrelated poster tiles. CosmoPort should borrow the period’s information logic and shape language while retaining its own imagery, names, fonts, and destination palettes.

## 3. Proposed decorative vocabulary

The following primitives are intentionally small and CSS/SVG-friendly.

### 3.1 Orbit rule

**Visual:** A 2–3px warm rule with a short offset segment, dot, or tiny four-point flare. It should feel like a brochure divider or orbital trajectory rather than a generic UI border.

**Placement:** Hero kicker, destination eyebrow/title transition, guide heading, and optional footer section breaks.

**Sizing/color:** Approximately 2–5rem long on desktop, 1.5–3rem on mobile; use the local gold, aqua, or coral theme token against a quiet surface.

**Responsive behavior:** Let the rule shorten or become a dot-plus-line below 800px. Never let it create horizontal overflow.

**CSS or SVG:** CSS is sufficient for rules, dots, and pseudo-elements. Use a tiny SVG only when the flare geometry needs to be consistent across browsers.

**Accessibility:** Decorative-only elements should be `aria-hidden="true"`. Do not use color or the rule alone to communicate a state.

**Reuse:** Suitable for CosmoPort Radio, sponsor modules, promo popups, and footer groups.

### 3.2 Atomic burst

**Visual:** A small eight- or ten-ray starburst, optionally with one offset satellite dot. Keep the rays blunt and geometric rather than sparkly.

**Placement:** Hero mark, a guide heading corner, a selected carousel card, or a sponsor seal.

**Sizing/color:** About 1–2rem in normal use; reserve larger marks for the hero. Use one accent color at a time with opacity controlled by the surface behind it.

**Responsive behavior:** Hide nonessential bursts on narrow screens or reduce them to a single four-point mark. Do not place them over faces, important image details, or text.

**CSS or SVG:** CSS gradients can make a simple burst; a small inline SVG is preferable for a precise reusable atomic mark.

**Accessibility:** Decorative bursts are hidden from assistive technology. If a burst ever carries an award or sponsor meaning, pair it with visible text.

**Reuse:** A shared mark for destination introductions, radio station identity, fictional sponsorships, and the footer.

### 3.3 Route badge

**Visual:** An outlined circular or pill badge containing `01`, `02`, or a short route code such as `V-7`. It should look like a travel-ticket stamp, not a notification bubble.

**Placement:** Beside destination eyebrows and at the leading edge of attraction card metadata.

**Sizing/color:** 1.75–2.5rem circle for destination-level markers; roughly 1.5rem for card metadata. Use cream/gold outlines and a theme accent fill only when contrast is sufficient.

**Responsive behavior:** Keep the shape but reduce padding and text size on mobile. If space is tight, preserve the number and drop the route code.

**CSS or SVG:** CSS border-radius and text are enough. SVG is unnecessary unless a ticket perforation or custom emblem is eventually approved.

**Accessibility:** Put the meaningful number/code in real text. Do not rely on the badge color or shape to distinguish destinations.

**Reuse:** Directly reusable for itinerary steps, radio channels, sponsor spots, and future travel-dossier output.

### 3.4 Brochure bracket

**Visual:** Two or four short corner strokes that imply a frame without boxing the whole section. A slight offset or uneven corner preserves the period print feel.

**Placement:** Around guide headings, a compact radio promo, or selected card metadata; not around every paragraph.

**Sizing/color:** Corner strokes around 0.75–2rem long, 1–2px thick, using a low-opacity theme accent.

**Responsive behavior:** Reduce the corner length on mobile; omit lower corners when they collide with the carousel or image edge.

**CSS or SVG:** CSS pseudo-elements are the lightest implementation. A small SVG may be useful for a complex ornamental corner shared across campaigns.

**Accessibility:** Decorative strokes are hidden. Maintain a normal semantic heading and content structure inside the implied frame.

**Reuse:** Useful for future promotional popups and footer callouts where a full border would feel heavy.

### 3.5 Asymmetric swoop

**Visual:** A single boomerang-like curved band or offset capsule, echoing mid-century vehicle fins and brochure tabs. It should be a background accent with generous empty space.

**Placement:** One per large section at most: the hero text panel or destination intro, never inside every card.

**Sizing/color:** 4–12rem wide depending on context, with a translucent aqua, coral, or gold fill; avoid gradients that reduce text contrast.

**Responsive behavior:** Crop or remove it at mobile widths rather than letting it squeeze the content column.

**CSS or SVG:** CSS border-radius can handle simple capsules; SVG is better for a controlled boomerang silhouette.

**Accessibility:** Background-only and `aria-hidden`. It must not be the only visual cue for a theme or action.

**Reuse:** Best reserved for campaign-level modules, sponsor advertisements, and the footer rather than a global every-section ornament.

### 3.6 Information tab

**Visual:** A small label tab with a notched or angled edge, such as `CITY GUIDE`, `VELORA-7`, or `RADIO 01`.

**Placement:** Guide heading, destination hero image caption, and future radio/sponsor modules.

**Sizing/color:** 0.65–0.75rem uppercase system text, moderate tracking, with a solid cream/gold/coral fill and dark text. Keep the tab compact.

**Responsive behavior:** Allow wrapping only at a deliberate word boundary; shorten the label on mobile if necessary.

**CSS or SVG:** CSS clip-path or border-radius is adequate; avoid a dependency for this shape.

**Accessibility:** Use a real text element. Do not encode destination identity only through color.

**Reuse:** A strong bridge between current eyebrows and future in-universe advertising.

## 4. Component-by-component enhancement opportunities

### Hero section

The hero already has the most complete brochure composition: kicker, oversized headline, shaped copy panel, and `CPV ✦ 1958` mark. Add at most two details:

- Turn the kicker’s existing leading line into the shared orbit rule, optionally ending in a tiny starburst.
- Give the `CPV / 1958` mark a small route-badge or seal treatment, keeping it decorative and pinned away from the title.
- If the panel is revisited later, add a single brochure bracket or asymmetric band to the panel edge rather than another interior box.

On mobile, keep the current centered hierarchy and remove any burst that competes with the copy panel. Do not add floating controls or extra hero text.

### Destination introductions

The eyebrow, large name, tagline, description, and irregular hero image form a strong editorial opening. The best addition is a route badge or information tab beside the eyebrow, plus one short orbit rule between eyebrow and name. Keep Aurora City, Pearlwater Coast, and Saffron Expanse structurally identical; vary only the existing theme tokens and perhaps the accent choice.

The irregular image frame already supplies enough personality. Avoid adding an extra frame around the copy and image as a pair.

### Destination guide headings

The guide heading is the clearest place for a small atomic burst or brochure bracket. A compact `CITY GUIDE`, `COASTAL GUIDE`, or `ADVENTURE GUIDE` tab can strengthen the “travel desk” voice while preserving the existing labels. The subtitle should remain plain enough to read quickly; decoration belongs around it, not behind it.

On mobile the controls already move below the heading. Keep that behavior and place any ornament on the heading block so the arrows and counter remain a clear, separate control group.

### Attraction highlight cards

The current `destination-card__number` is an obvious foundation for circular numbered markers. Use the number as real text inside a small outlined disc or half-disc, and keep the card title/description typography unchanged. A tiny corner burst on the selected card could reinforce the current state, but it is optional and must not be the only indication of selection.

Do not add a full vintage poster border to every card: the image crop, irregular card radius, selected lift, and carousel already provide enough variation. Keep card decoration CSS-only and clipped to the card so horizontal scrolling stays predictable.

### Carousel controls

The existing round arrow buttons already fit the period language. Strengthen them with a consistent ring/route treatment rather than replacing the arrows with custom icons. Keep the accessible labels, disabled state, keyboard behavior, and live counter exactly as content behavior. If a burst is used, place it outside the hit target and mark it decorative.

The `01 / 05` counter could gain a small route rule or a compact label such as `ATTRACTIONS`, but only if it remains readable at mobile widths.

### Labels, counters, and small metadata

Eyebrows, card numbers, the hero mark, and fallback `CPV / destination` text are the safest places for small period details. A shared route-code convention can make the destinations feel like pages in one brochure without changing the content model. Keep metadata short, high contrast, and text-based so it works while Sanity content is loading or absent.

## 5. Recommended shortlist

### Essential improvements

1. **Route badge** for destination and attraction numbering. It uses an existing content cue and improves wayfinding with minimal visual noise.
2. **Orbit rule** for kicker/eyebrow-to-heading transitions. It adds brochure structure without changing layout.
3. **Information tab** for guide labels. It gives the shared destination component a more explicit travel-desk character.
4. **Atomic burst** used sparingly at the hero mark and one guide/card accent. It provides the strongest atomic-age signal when kept rare.
5. **Brochure bracket** for one guide heading or future compact callout. It creates framing without adding heavy panels.

### Optional embellishments

6. **Asymmetric swoop** for the hero panel or one campaign module. It is expressive but more likely to compete with imagery.
7. **Sponsor seal / route stamp** for future fictional ads or radio modules, once those features have real copy and a clear purpose.
8. **Color-blocked promotional cells** only for a dedicated future ad/radio module; do not retrofit them into the destination cards.

## 6. Suggested implementation priorities

1. **Foundation:** document shared decorative tokens and build the route badge, orbit rule, and information tab as the smallest CSS-level vocabulary. Apply only to the hero kicker, destination eyebrow, and existing card number.
2. **Atomic signal:** add one restrained SVG/CSS burst and test it at desktop and mobile widths, including the three destination theme palettes.
3. **Framing pass:** trial brochure brackets on the guide heading and inspect contrast, wrapping, and interaction with the carousel controls.
4. **Campaign layer:** defer swoops, sponsor seals, and color-blocked ad panels until CosmoPort Radio or sponsorship content exists to justify them.

For every stage, verify keyboard focus visibility, screen-reader naming, overflow at the 800px breakpoint, contrast against each theme, and `prefers-reduced-motion`. Decorative elements should have no animation by default; if a future orbit or burst animates, disable it under reduced motion.

## 7. Small, incremental PR breakdown

1. **PR 1 — Decorative tokens and route badge:** add only shared color/size conventions and route/card number treatment. No layout changes.
2. **PR 2 — Orbit rules and information tabs:** apply them to existing eyebrow/kicker and guide-label locations, with responsive fallbacks.
3. **PR 3 — Atomic burst and brochure bracket:** introduce the small mark and one carefully chosen heading treatment; validate all three destination themes.
4. **PR 4 — Future campaign decoration:** only when Radio, sponsorship, or popup content is approved; add swoops/seals within that feature’s scope.

Each PR should remain independently reviewable and should include a desktop/mobile visual check plus accessibility checks. This keeps the decorative layer reversible and prevents the shared destination component from accumulating ornament before the content needs it.

## Final recommendation

Start with the route badge, orbit rule, information tab, and one atomic burst. Together they supply the clearest “premium interplanetary brochure” signal while preserving the current imagery, typography, destination palettes, carousel behavior, and responsive layout. Treat swoops, dense poster grids, and sponsor-specific marks as optional campaign tools rather than baseline chrome.
