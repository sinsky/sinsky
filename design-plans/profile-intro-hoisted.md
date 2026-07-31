# Profile intro sits outside the identity card, matching the Contact section's structural rhythm

Written against: 3488acc

## Evidence chain

- Surface: `src/components/Profile.vue`, rendered by `src/pages/index.vue` as the `#profile` section of the single-page `sinsky.me` site.
- Problem: `Profile.vue` wraps avatar, name, intro paragraph, and SNS list in one centered `rounded-3xl bg-white/50 backdrop-blur-sm` card. The intro paragraph and the identity block (avatar + name + SNS) place different reading modes inside the same surface, so the visual weight of the identity block competes with the readable paragraph. The card also diverges from the surrounding motif: `Bubble.vue`, `PrCard.vue`, and `Contact.vue`'s `bubble-card` are all built around `rounded` FBR + translucent backdrop fill, while `Profile.vue` uses a static `rounded-3xl`.
- Design evidence: `src/components/Contact.vue` establishes the site-wide section rhythm: `<h2>` section title, a supporting `<p>` paragraph directly under the title, then the translucent `bubble-card` panel for the interactive element. `src/components/Hero.vue` uses the same title + supporting `<p>` + bubble composition for the hero. `src/components/blocks/PrCard.vue` and `src/components/Contact.vue` define the shared FBR panel motif (`border-radius: 38% 62% 56% 44% / 56% 44% 60% 40%`, backdrop blur, white/60 fill). No `DESIGN.md` or token contract covers Profile, so the nearest exemplar is the Contact section itself.
- Owner: `src/components/Profile.vue`
- Scope and affected surfaces: `src/components/Profile.vue` only. Consumed by `src/pages/index.vue` (already renders Profile as-is). No props, events, or slots change, so no other consumer is affected.
- Uncertainty: none. The intro copy is currently a placeholder (`const intro = "TODO: ..."`) and is explicitly intended to be replaced with real self-introduction text; restructuring the layout must keep the intro as a single bound string rendered into the DOM. The placeholder copy itself is out of scope for this plan.

## Design decision

Restructure the Profile section so the identity block (avatar + name + SNS) becomes a compact translucent `bubble-card` panel and the intro paragraph is hoisted outside the card as a section-level supporting paragraph, sitting directly under the `h2`-level heading — mirroring the existing `Contact.vue` / `Hero.vue` pattern of `<h2/sr-only heading>` + supporting `<p>` + bubble panel. This keeps the readable intro copy on the section's primary text axis (uncontested by icon/row layout), keeps the identity block compact (which is the part users glance at), and lets Profile share the FBR + translucent-fill motif used by Hero, PrCard, and Contact across the single-page site.

## Reuse

- `<h2>` + supporting `<p>` + translucent panel composition, reused from `src/components/Contact.vue` (lines 78-86) and `src/components/Hero.vue` (lines 9-14, 16).
- FBR + translucent panel motif, reused from `src/components/Contact.vue` `.bubble-card` and `src/components/blocks/PrCard.vue` `.blob-card`. Profile's identity panel will reuse `.bubble-card`'s exact `border-radius`, `animation`, `@keyframes`, and `prefers-reduced-motion` block — therefore the existing `<style scoped>` keyframes block in `Contact.vue` is the named exemplar to follow.
- Translucent fill `bg-white/60` + `backdrop-blur-sm` + `shadow-sm`: reused from `Contact.vue`'s `bubble-card`.
- Section container classes (`relative flex min-h-svh flex-col items-center`, `gap-10`, `px-6 py-24`): reused from `Contact.vue`'s section wrapper. Current `Profile.vue` uses `gap-8 py-20` — this plan replaces them with the site-wide `gap-10 py-24` so all three inner sections share the same rhythm.
- Avatar, name, and SNS markup (image, `ring-4 ring-white`, social `<ul>`) are kept verbatim; only their wrapper changes.
- Exemplar: `src/components/Contact.vue`

If a new primitive were required, it would belong as a shared `BubblePanel.vue`. This plan does not introduce it, because only `Contact.vue` and `Profile.vue` would currently share the exact FBR panel (PrCard uses `.blob-card` with its own keyframes) and extracting a primitive from two consumers is premature. Each file keeps its own scoped `<style>` block duplicating the same keyframes, matching how `PrCard.vue` already does it.

## Changes

1. `src/components/Profile.vue`
   - Change: replace the single centered card markup with this structure:
     - Keep `<section id="profile" :class="bgColor">` wrapper; change wrapper classes from `flex flex-col items-center justify-center gap-8 px-6 py-20` to `flex flex-col items-center gap-10 px-6 py-24` (site-wide inner-section rhythm).
     - Keep `<h2 class="sr-only">Profile</h2>` unchanged.
     - Add a section-level supporting element: a visible `<p class="max-w-2xl text-center text-sm leading-8 text-slate-600 md:text-base md:leading-8">` containing `{{ intro }}`. Place it as the first child after `<h2>`, before the identity card. This hoists the intro copy out of the card and onto the section's primary text axis.
     - Replace the existing `rounded-3xl bg-white/50 ... md:px-14` card with a `bubble-card` panel: `<div class="bubble-card flex flex-col items-center gap-5 bg-white/60 px-8 py-10 shadow-sm backdrop-blur-sm md:px-14">`. Inside it keep only the `<img>` avatar, `<h3 class="text-2xl font-bold text-slate-800">sinsky</h3>`, and the social `<ul class="mt-2 flex gap-6">`. Remove the intro `<p>` from inside the card.
     - Add a `<style scoped>` block with the `.bubble-card` class, its `border-radius: 38% 62% 56% 44% / 56% 44% 60% 40%`, the `contact-blob`-equivalent keyframes (renamed to a neutral name like `profile-blob`), and the matching `prefers-reduced-motion` fallback that switches to `border-radius: 1.5rem`. Copy the exact timing function, duration `16s`, and `infinite` behavior from `Contact.vue`.
   - Preserve: avatar `src`/`alt`/`size-28 ring-4 ring-white shadow-md`; the visible name `<h3>sinsky</h3>`; the three SNS links with their `aria-label`, `target="_blank"`, `rel="noopener noreferrer"`, hover `scale-110` behavior, and `size-8` icons; the `bgColor` prop and its binding; the `socials` array and `intro` constant; the `sr-only` visible-label-free heading policy.
   - Verify: rendered Profile section shows the intro paragraph centered above a compact identity bubble; the identity bubble animates its FBR corners on desktop and falls back to `rounded-3xl` under `prefers-reduced-motion`; the avatar, name, and SNS icons remain inside the bubble; no content is lost or duplicated; `index.vue` continues to render `<Profile bg-color="bg-pink-100" />` without changes.

## Scope

- Inherit: `src/pages/index.vue` (renders Profile unchanged).
- Verify: neighbors `src/components/Hero.vue`, `src/components/Skills.vue`, `src/components/Contact.vue` (confirm Profile's new rhythm visually matches Contact's section rhythm, and that the Profile bubble motif visually matches Contact's bubble and PrCard's blob within the same pastel palette — no new visual pattern introduced).
- Exclude: the actual intro copy (still a placeholder, replaced in a separate step by the user); avatar image source; SNS list contents; Skills / Contact redesign; introduction of a shared `BubblePanel.vue` primitive; any Tailwind token or `DESIGN.md` changes; any change to the `bg-pink-100` section background chosen by `index.vue`.

## Validation

- Product: open `sinsky.me` (or `aube run dev`) and scroll to `#profile`. Expected: a centered intro paragraph reads above a single compact bubble containing avatar + name + SNS. The bubble's corners animate softly. Under `prefers-reduced-motion: reduce`, the bubble becomes a fixed `rounded-3xl`-equivalent.
- Interface: check viewports `sm` (mobile) and `lg` (desktop). Expected: the intro paragraph remains centered and legible at all widths; the identity bubble does not exceed the same `max-w-xl`-class width profile as the Contact card; SNS icons remain tappable on touch viewports. Check the `#profile` scroll target still lands cleanly (no new headings or section wrappers introduced that would break `scroll-mt` from `index.css`).
- System: confirm `.bubble-card` styles in `Profile.vue` mirror `Contact.vue`'s values exactly (border-radius, duration, keyframes shape, reduced-motion fallback) so no second FBR shape language is accidentally introduced. Confirm `Contact.vue` is unchanged.
- Repository: `aube run build` → exits 0; `aube run test` → 11 passed (existing tests do not reference Profile.vue markup, so they should still pass; if a Profile test is added by the executor, it must pass too); `aube exec vue-tsc -b` → exits 0.

## Stop conditions

- Stop if introducing the hoisted intro `<p>` breaks the `sr-only` heading composition (e.g., the new `<p>` is mistakenly read as the section's only label by assistive tech — then keep the `sr-only` h2 and confirm the `<p>` is not promoted to a heading).
- Stop if the user supplies real intro copy during execution that requires different typography (a copy-changing plan, not this plan, handles copy choices).
- Stop if `index.vue`'s `bg-pink-100` choice conflicts with the hoisted intro readability — then the fix belongs in `index.vue` as a separate tenant of the section background, not in Profile.
- Stop if any other section's `bubble-card` / `blob-card` keyframes need to change as a consequence — that would widen scope to a shared primitive extraction, which this plan explicitly defers.

## Design documentation

- After acceptance and validation: record the site-wide section rhythm ("each inner section is `<h2>` or sr-only heading + supporting paragraph + translucent panel") and the FBR bubble panel motif (`.bubble-card` / `.blob-card` with `border-radius: 38% 62% 56% 44% / 56% 44% 60% 40%`, `backdrop-blur-sm`, white/60 fill) in a new `DESIGN.md` at repo root, so a future `BubblePanel.vue` extraction has a contract to de-duplicate against. Until that doc exists, the executor does not need to create it; this plan's exemplar (`Contact.vue`) is the interim contract.
