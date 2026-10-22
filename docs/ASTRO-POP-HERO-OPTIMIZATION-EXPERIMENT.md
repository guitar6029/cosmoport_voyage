# Astro Pop hero optimization experiment

Experiment date: 2026-10-22

## 1. Objective

This experiment tests a small, reproducible Sharp workflow against the existing Astro Pop hero artwork. It creates review-only WebP and AVIF candidates outside `public/`, measures their actual bytes, and preserves the production source and Vue delivery unchanged.

The experiment does **not** change `app/pages/astro-pop/index.vue`, the production hero URL, responsive markup, loading priority, or any other Astro Pop artwork. It is evidence for a later production-delivery decision, not that implementation.

## 2. Reproduction

Prerequisite: Node 22.23.3 and installed dependencies.

```bash
nvm use 22.23.3
npm ci
npm run images:hero
```

The command runs `scripts/optimize-astro-pop-hero.mjs`. It:

1. Reads `public/images/astro-pop/hero/AstroPopDeliveryMan.png` without writing to it.
2. Validates that the source is a 1448x1086 PNG.
3. Decodes it with Sharp/libvips, resizes with Lanczos3 only when the target is narrower (and never upscales), then encodes the explicit WebP or AVIF settings.
4. Writes candidates and a measured `manifest.json` only to `artwork/astro-pop/experiments/hero/`.
5. Prints candidate dimensions, bytes, savings, and conversion times.

The outputs are deterministic for this source, Sharp version, and settings: a second full generation produced identical SHA-256 hashes for all five candidate files. Conversion duration is diagnostic only and naturally varies by host/load.

## 3. Source characteristics and preservation

| Source | Format | Dimensions | Bytes | SHA-256 |
| --- | --- | ---: | ---: | --- |
| `public/images/astro-pop/hero/AstroPopDeliveryMan.png` | PNG | 1448x1086 | 2,658,187 (2.54 MiB) | `1ef724fc116e193087e86cd944f984a6f443fcd2861c5e1a68ce0dbee2326d6c` |

The script has no source write path. The post-generation SHA-256 matches the source value recorded in the manifest, and Git reports no change to the original PNG.

## 4. Generated candidates and actual measurements

All bytes and reductions below are from the generated files, not estimates. The percent is `(1 - candidate bytes / 2,658,187) × 100`.

| Candidate | Output / settings | Dimensions | Bytes | Reduction | Last measured encode time |
| --- | --- | ---: | ---: | ---: | ---: |
| Original | Existing PNG | 1448x1086 | 2,658,187 | — | — |
| Desktop A | [WebP q80](../artwork/astro-pop/experiments/hero/astro-pop-delivery-man-1448w-q80.webp), quality 80, effort 6 | 1448x1086 | 287,246 | 89.19% | 519.45 ms |
| Desktop B | [WebP q90](../artwork/astro-pop/experiments/hero/astro-pop-delivery-man-1448w-q90.webp), quality 90, effort 6 | 1448x1086 | 432,084 | 83.75% | 626.71 ms |
| Tablet | [WebP q80](../artwork/astro-pop/experiments/hero/astro-pop-delivery-man-960w-q80.webp), quality 80, effort 6 | 960x720 | 165,396 | 93.78% | 282.31 ms |
| Mobile | [WebP q80](../artwork/astro-pop/experiments/hero/astro-pop-delivery-man-640w-q80.webp), quality 80, effort 6 | 640x480 | 91,496 | 96.56% | 158.89 ms |
| Desktop C | [AVIF q55](../artwork/astro-pop/experiments/hero/astro-pop-delivery-man-1448w-q55.avif), quality 55, effort 6, 4:4:4 chroma | 1448x1086 | 169,980 | 93.61% | 20,599.36 ms |

The full machine-readable record, including settings, SHA-256 values, source identity, and runtime library versions, is [manifest.json](../artwork/astro-pop/experiments/hero/manifest.json).

## 5. Visual comparison and observations

Open [comparison.html](../artwork/astro-pop/experiments/hero/comparison.html) in a browser to inspect the original and all five candidates side by side. This artifact is intentionally a review guide rather than a claim of artistic approval.

Automated checks completed:

- Sharp successfully decoded every generated candidate and recorded its resulting dimensions.
- A browser loaded all original, WebP, and AVIF candidates in the comparison page.
- Full-file SHA-256 values were stable across two generation runs.

Side-by-side inspection at the comparison page's normal card size found the illustrated lettering, faces, bottle labels, color gradients, and retro texture legible in every candidate. No gross color shift or obvious artifact was visible at that scale. This is not sufficient to approve the artwork: fine lettering, halftone texture, and bottle-label edges still need human sign-off at the intended hero display sizes and on representative displays.

Specific review prompts:

- Compare the large `AstroPop Man!` lettering and the smaller truck-side/box lettering at 100% and at the page's viewport-capped hero size.
- Examine facial highlights, shirt/teal edges, bottle caps and labels, and the distressed border for ringing, color bleeding, or texture smoothing.
- Compare WebP q80 against q90 in the high-detail lettering areas; q90 costs 144,838 additional bytes.
- Compare AVIF q55 against WebP q80 before choosing AVIF; its much smaller file is not by itself evidence of acceptable artistic fidelity.

## 6. WebP and AVIF trade-offs

The full-size WebP q80 candidate cuts 2,370,941 bytes (89.19%) while preserving the original 1448x1086 dimensions. WebP q90 is 144,838 bytes larger than q80 but remains 83.75% smaller than the PNG, making it the relevant quality fallback if visual review finds q80 too aggressive.

The full-size AVIF q55 is the smallest desktop-size candidate at 169,980 bytes (93.61% reduction), 117,266 bytes smaller than WebP q80. Its last measured encode took about 20.6 seconds versus about 0.5 seconds for full-size WebP q80. That build-time cost is acceptable for a one-off static pipeline but warrants judgment before it becomes part of a frequent asset workflow.

The resized WebP variants demonstrate that responsive dimensions compound format savings: 960px q80 is 165,396 bytes and 640px q80 is 91,496 bytes. Smaller files alone do not prove faster page loading; production-host network and LCP measurements remain a required next step.

## 7. Tentative production candidate

Use **1448px WebP quality 80** as the leading candidate for a future responsive-delivery PR, with 960px and 640px q80 derivatives. It provides a large measured byte reduction, fast generation, unchanged desktop dimensions, and a straightforward browser-compatible fallback story.

This is a technical recommendation, not final visual approval. Keep the source PNG as the immutable master and retain it as the fallback until a reviewer signs off on the candidate's lettering and texture. AVIF q55 remains a compelling optional `<picture>` source to reconsider only after that visual review; WebP q90 is the immediate quality alternative.

## 8. Proposed next step: responsive hero delivery

After visual sign-off, use a separate, focused production PR to:

1. Move the accepted derivatives into the production asset path while retaining the PNG master outside the served path.
2. Add `<picture>`/`srcset`/`sizes` for 640px, 960px, and 1448px variants with PNG fallback.
3. Add explicit intrinsic dimensions and preserve the hero's eager/LCP-appropriate loading behavior.
4. Measure production-host image transfer, LCP, layout shift, and visual rendering on desktop and mobile.

That PR should not be merged until the art review and measured delivery results are accepted.
