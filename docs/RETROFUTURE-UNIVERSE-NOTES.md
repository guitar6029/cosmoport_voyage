# The Radiant Age — Shared Universe Notes

> **Status:** Creative exploration, not final canon. Names, slogans, planets, and product ideas below are working concepts unless explicitly approved later.
>
> **Development principle:** One shared fictional universe, many *possible* standalone experiences, but only one active application at a time. Finish CosmoPort Voyage before building spin-offs.

## The big idea

CosmoPort Voyage can be more than an isolated fictional space-tourism website. It can be the first window into an interconnected retrofuturistic universe: an alternate future imagined through the optimistic, consumer-oriented lens of the 1950s.

Humanity has settled distant worlds. Families vacation by rocketliner. Atomic-powered cars and domestic robots are everyday conveniences. Radio stations broadcast across colonies, and every corporation is eager to sell the next miracle product.

The universe should feel much larger than any one application. A visitor may encounter a cereal advertisement, a robotic hotel concierge, or a particular automobile model in a CosmoPort illustration. Those details establish recurring companies and lore. Any of those companies *could* someday become the subject of its own small application.

**Creative north star:** *The future is fantastic — and the advertisements insist it is even better.*

## Tone and visual identity

Our current preference is a blend of two modes:

1. **Bright retrofuture:** glamorous interplanetary travel, appealing gadgets, Googie architecture, cheerful illustrated advertisements, heroic rockets, and inviting planetary resorts.
2. **Gentle corporate satire:** absurd slogans, questionable inventions, overenthusiastic spokespeople, suspiciously reassuring safety claims, and companies competing for attention.

A working tonal ratio is roughly **75% hopeful wonder / 25% playful corporate absurdity**. This is a direction to test, not an enforced formula. The experience should be charming, lively, and original rather than grim, relentlessly cynical, or dependent on recognizable franchises.

Visual references and ingredients:

- Mid-century commercial illustration and fictional travel posters
- Atomic Age / Atompunk industrial design, chrome, fins, ray-gun geometry
- Googie architecture, bubble-domed vehicles, sky-trams, rocketliners
- Cream, turquoise, coral, mustard, deep navy, and metallic accents
- Printed brochures, cereal packaging, airline tickets, radio dials, period advertisements
- A contrast between immaculate marketing claims and occasionally ridiculous fine print

Avoid copying specific brands, characters, artwork, or protected iconography from Fallout or other existing properties. The world should have its own identity.

## Setting foundations — working concepts

| Element | Current idea | Status |
| --- | --- | --- |
| Shared setting | **The Radiant Age** | Working universe title |
| Era | An alternate, spacefaring future imagined through 1950s optimism | Direction |
| Space travel | Commercially ordinary: rocketliners, spaceports, interplanetary tourism | Direction |
| Technology | Atomic propulsion, domestic robots, exotic vehicles, orbital infrastructure | Direction |
| Commercial culture | Brands, endorsements, jingles, slogans, consumer gadgets, corporate rivalries | Central motif |
| First featured planet | **Velora-7** | Working name |
| First featured travel regions | **Aurora City**, **Pearlwater Coast**, **Saffron Expanse** | Working names |

We do **not** need a complete timeline, a map of the galaxy, hundreds of settlements, or scientific explanations for every device. Consistency matters more than encyclopedic detail.

## Fictional company directory

These companies are early lore seeds and possible future app concepts, not an implementation backlog.

| Company | In-universe role | Working slogan / personality | Potential standalone experience |
| --- | --- | --- | --- |
| **CosmoPort Voyage** | Interplanetary travel agency and the entry point into the setting | *Your World Away!* Cheerful, aspirational, polished | Destination browser, vacation finder, shareable itinerary and printable travel dossier |
| **Atomic Cluster Cereal** | Mass-market atomic breakfast cereal | *You'll go bunkers for every bite!* Mascots, collectible rocket toys, improbable nutritional promises | Playful product marketing microsite, interactive cereal box, collector experience |
| **Mike & Mike's RoboFactory** | Domestic and industrial robot manufacturer | *Two Mikes. A Million Possibilities!* Two founders with competing ideas about robots | Build-a-Robot configurator, lightweight factory-management simulator |
| **Starline Motors** | Atomic-powered cars, cruisers, and futuristic family transportation | *Tomorrow Drives Today!* Glossy styling and exceedingly confident safety advertising | Retro automobile catalog or vehicle configurator |
| **Galaxy Wave Broadcasting** | Interplanetary news, entertainment, radio, and advertising network | *The Voice of a Thousand Worlds!* Jingles, broadcasts, personality-driven presenters | In-universe radio player, curated programs and commercials |

Additional companies may arise naturally from illustrations, destinations, stories, or product references. Resist building a large company taxonomy before it becomes useful.

### Seeds of personality and lore

- **Atomic Cluster:** Every cereal box might promise an impossible prize or contain a collectible rocket. Its commercials are relentlessly cheerful.
- **Mike & Mike's:** The two founders disagree about robot personalities, repairability, or whether robots should be allowed to complain. Product descriptions reveal their rivalry.
- **Starline Motors:** Advertising treats its latest Atomic Cruiser as perfectly ordinary and unreasonably glamorous; the fine print hints at colorful product history.
- **Galaxy Wave:** A radio announcer can mention travel delays, sponsors, new inventions, weather on distant worlds, and events at other fictional companies.
- **CosmoPort:** A brochure can enthusiastically frame a moderately alarming planetary attraction as a once-in-a-lifetime adventure.

These are storytelling prompts, not facts the application must simulate.

## How the universe feels connected

Crossovers should be visible and optional. They begin as *set dressing*, not technical integrations.

**Example: A CosmoPort visit to Aurora City**

1. The brochure illustration shows a **Starline Motors** cruiser outside the hotel.
2. A billboard advertises **Atomic Cluster Cereal**.
3. A **Mike & Mike's** hotel robot carries luggage.
4. A radio in the lobby plays **Galaxy Wave Broadcasting**.
5. A vacation package includes a playful sponsor promotion: a complimentary Starline cruiser excursion.

Someone who notices the brand names repeatedly begins to recognize a shared culture. If we eventually build Starline Motors as a standalone app, an in-universe ad or subtle link can lead there.

Crossovers can also appear in:

- Product packaging, model numbers, warranties, and collectible inserts
- Advertising posters, jingles, sponsorships, and corporate endorsements
- Hotel amenities, shops, automobiles, signage, public transport
- Editorial news stories or radio segments
- Small jokes repeated across separate applications

**Important:** Do not create fake storefronts, dead links, or unbuilt routes merely to imply a large universe. For now, illustrations and copy are enough.

## The application-universe opportunity

Each brand may provide a different, self-contained project and a different engineering challenge.

| Experience | Main interaction | Possible skills to explore |
| --- | --- | --- |
| CosmoPort Voyage | Choose a holiday and receive a travel itinerary | Nuxt, Sanity, SEO, recommendations, testing |
| Atomic Cluster Cereal | Explore a brand and its collectible packaging | Motion design, playful UI, storytelling |
| Mike & Mike's RoboFactory | Configure robots or manage a small production line | State modeling, simulation, interactive dashboards |
| Starline Motors | Configure an Atomic Cruiser | Reactive UI, product customization, possibly 3D later |
| Galaxy Wave Broadcasting | Tune a fictional interplanetary radio | Audio UX, curated media, time-based interactions |

If spin-offs materialize, they can be separate repositories and independently deployed websites. Sharing lore does **not** imply shared authentication, databases, APIs, microservices, or deployment infrastructure. A common design system could be extracted only when there is demonstrated reuse.

This makes the universe a coherent collection of projects rather than one enormous application.

## CosmoPort remains the first finished product

The initial product goal has not changed:

> A visitor can explore three gorgeous destinations on one inhabited planet, answer a short vacation-finder questionnaire, receive a personalized itinerary, and print or share a retro travel dossier.

Suggested minimal flow:

1. **Discover:** explore the fictional travel agency and its destinations.
2. **Choose:** select vacation type (City, Coast, Adventure), duration (3, 5, 7 days), and an interest or mood.
3. **Match:** recommend a destination using simple deterministic logic and Sanity-managed content.
4. **Plan:** assemble arrival, departure, and matching experiences into an itinerary.
5. **Take away:** present the result as a vintage travel dossier or boarding pass.

No runtime AI service or large custom backend is required to make that experience satisfying.

### First destination concepts

- **Aurora City — City:** sky-trams, sparkling architecture, cultural attractions, floating markets, and rooftop jazz.
- **Pearlwater Coast — Relaxation:** crystalline seas, domed beachfront resorts, and leisurely holidays.
- **Saffron Expanse — Adventure:** golden deserts, extraordinary rock formations, and observatories beneath alien skies.

Treat the planet and destination names as working titles until we approve them.

### Practical launch boundary

**In scope for CosmoPort V1**

- One inhabited planet, three destination regions
- Illustrations and retrofuturistic brand presentation
- Sanity-managed destination and experience content
- Vacation-finder preferences and matching
- A generated itinerary and printable/shareable travel dossier
- Responsive, accessible pages and appropriate tests/SEO

**Explicitly out of scope**

- Procedurally generating thousands of planets
- Live booking, payment, inventory, or real commerce
- User accounts or a custom database
- Factory simulations or car configurators inside CosmoPort
- A shared technical platform for every fictional company
- An encyclopedic lore CMS before the content requires it

### Content modeling rule

Do not preemptively add a separate Sanity document type for every fictional corporation. Destination descriptions and illustrations can mention sponsor names naturally. Introduce structured brands, planets, vehicles, and cross-app references only when a real feature needs them.

## Lightweight world-building process

Maintain a compact, human-readable canon record as the universe takes shape. Useful fields for a future brand entry might include:

- Company name, sector, and tagline
- Flagship products or services
- Personality and tone of its advertising
- Home planet or headquarters (if relevant)
- Known relationships, endorsements, and rivalries
- First appearance in a published experience
- Potential app idea — clearly marked as an idea

A brand's existence in lore **does not** create an obligation to build its app. A future brand app should have its own clear user experience, small MVP, and completion criteria before development begins.

## Open creative decisions

Before treating these notes as canon, decide:

1. Should the universe be called **The Radiant Age**, or something else?
2. How prominent should corporate satire be relative to genuine optimism?
3. Is **Velora-7** the right first planet, and do the three destinations feel distinct enough?
4. Which two or three brands should recur in CosmoPort's initial advertisements?
5. Should sponsor mentions remain decorative in V1, with cross-links introduced only after a second app exists?
6. What visual rules make every company feel part of the same era without making their websites look identical?

## Delivery principles

- **One task per PR.** Break broad features into reviewable pieces.
- **Finish CosmoPort first.** The universe is a source of creative depth, not scope expansion.
- Build a company-specific app only when it has a compelling independent end goal.
- Add lore through finished product details, not speculative infrastructure.
- Keep working names and slogans provisional until reviewed; check names and potential trademarks before public branding.
- Prefer original intellectual property over direct imitation of existing game universes.

The near-term next step is to finalize CosmoPort's content needs, then introduce Sanity Studio and the smallest useful destination schema in separate focused tasks.
