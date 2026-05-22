# Assessment Answers

---

## 1. How to Run

No install required. Open `index.html` directly in any browser, or serve locally:

```bash
npx serve .
```

Then visit `http://localhost:3000`.

**Live URL:** https://ahmeraza.github.io/tip-calculator

---

## 2. Stack & Design Choices

**Stack:** Vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

Claude initially pointed toward more sophisticated tooling (component frameworks, bundlers). I pushed back. For a focused single-screen utility, vanilla JS is the right call — zero setup friction, nothing to explain away, and every line is readable without knowing a framework. It also means the reviewer can open `index.html` directly and it just works.

**Design decision 1 — Segmented control for tip presets.**
Rather than three separate buttons, I used a pill-style segmented control that reads as a single unified input. This makes it visually obvious that only one preset can be active at a time, which mirrors how native iOS/Android controls work. The active segment uses the gold accent color so the selection state is never ambiguous. This affects the tip percentage section directly.

**Design decision 2 — Dark card on warm off-white background.**
The inputs and output live on a near-black card (#1a1a1a) against a warm off-white page (#f5f2ee). This creates a strong focal contrast that draws the eye to the calculator without being harsh. It also lets the gold accent color (used for the active tip segment and the per-person amount) pop clearly — it would be lost on a white background. This affects the overall page composition and the hierarchy of the output panel.

---

## 3. Responsive & Accessibility

**Responsive behavior:**
On a 360px phone, padding tightens, font sizes scale down slightly, and the segmented control still fits comfortably across the full width. The two-card layout stacks vertically and both cards remain full width — no horizontal scrolling. On a 1440px laptop, the app centers itself vertically in the viewport at a max-width of 440px, so it never stretches into an uncomfortable wide form.

**Accessibility — what I handled:**
- All inputs have explicit `<label>` elements or `aria-label` attributes
- Error messages use `role="alert"` and `aria-live="polite"` so screen readers announce them without interrupting the user
- Segmented control uses `role="group"` with `aria-pressed` on each segment, updated on every click
- All interactive elements have `:focus-visible` outlines in the gold accent color — keyboard navigation is fully visible
- Tab order follows the natural reading flow: Bill → Tip segments → Custom % → People → Reset

**Accessibility — what I knowingly skipped:**
I did not add a skip-to-results link. On a screen reader, the user has to tab through all inputs before reaching the output panel. For a short single-screen app this is a minor issue, but in a production build I would add an anchor link at the top that jumps focus to the results section after calculation.

---

## 4. AI Usage

I used two Claude tools throughout this build:

- **Claude Code** for vibe coding — generating the HTML structure, CSS tokens, and JS logic iteratively, committing in stages
- **Claude (chat)** for design architecture — deciding the component layout, interaction model, and what to include or leave out

The workflow was collaborative, not copy-paste. I directed the decisions; Claude executed them.

**Specific things I changed from Claude's output:**

1. **Stack simplification:** Claude recommended a component framework with a build pipeline. I pushed back and kept it vanilla HTML/CSS/JS — a single-screen calculator does not need a framework, and vanilla means zero setup for the reviewer and every line is explainable.

2. **Tip cap:** Claude set the maximum custom tip at 80%. I changed it to 60% — anything above that is realistically a mistype, and a tighter bound makes the validation more meaningful.

3. **Segmented control:** Claude's initial tip buttons were three separate inputs. I suggested a unified segmented pill control — one group, one active state, cleaner UX — which Claude then implemented with proper `role="group"` and `aria-pressed` semantics.

---

## 5. Honest Gap

The per-person rounding note ("Amounts rounded up so the group never underpays") is small and sits at the bottom of the output card where it is easy to miss. In a polished version I would surface this contextually — for example, showing the exact remainder being distributed when rounding actually kicks in (e.g., "Rs 0.01 distributed across 3 people"). That would make the rounding policy visible and trustworthy rather than just declared in fine print.
