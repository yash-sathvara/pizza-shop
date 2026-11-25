# Antigravity / Cursor / developer માટે handoff prompt

નીચેનો English prompt technical handoff માટે છે. Current pizza project સમજાવવા માટે પ્રથમ prompt સીધો આપી શકો. બીજા project માટે reusable briefમાં તમારી values ભરો.

આ prompt એક MD document છે; installed skill, automatic workflow અથવા extra software નથી. AI પાસે video/browser/file access ન હોય તો તે limits honestly report કરાવવી. કોઈ model માટે exact resultની guarantee આ prompt આપતો નથી.

## 1. Current pizza project prompt

```text
I am giving you an existing React + Vite pizza-shop project and a reference
screen recording at public/pizza_shop_screen_recording.mp4.

Read these first:
- docs/README.md
- docs/01_PIZZA_ANIMATION_IMPLEMENTATION.md
- docs/02_REFERENCE_VIDEO_AND_ASSETS.md
- docs/04_TESTING_PERFORMANCE_AND_DEBUGGING.md
- the actual source files involved in the requested change

Treat the current source as authoritative. The docs describe an implementation,
not a requirement to preserve a bug or claim a feature that is absent.

The current website is a hybrid:
- A 96-frame chef sequence is scrubbed on Canvas by scroll.
- The builder uses a clean kitchen plate and separate raw/cooked pizza textures.
- Toppings, UI and pricing are actual React/CSS behavior.
- Baking is a timed transition with a shared order state.
- The receipt, scooter, review fan and menu are real frontend components.
It is not an editable 3D chef scene, and the whole reference recording must not
be played as a substitute for implementing the interactions.

My requested change:
[WRITE THE SPECIFIC CHANGE / OBSERVED MISMATCH HERE]

Work method:
1. Inspect the repo, package.json/lockfile, reference and active assets before
   editing. Preserve the existing folder structure and unrelated functionality.
2. Describe the specific cause, scene/layer responsibilities, chosen technique,
   asset needs and acceptance criteria. Do not stop after a plan when I have
   asked you to implement the change.
3. Compare the same phases in the reference and current implementation. Record
   positions, scale, angle, crop, timing, occlusion and state behavior. Do not
   guess exact implementation technology from the reference's visual style.
4. Use one shared coordinate mapping for a scene and its interactive overlays.
   Keep scroll progress, user selections, timed bake state and backend data as
   separate concerns. Preserve selected toppings and derived price consistently.
5. Use the existing stack when sufficient. Add a dependency only for a concrete
   missing capability, with compatibility checked against the current project.
6. Implement a complete affected flow, including reset, repeat actions, resize,
   reverse scroll, loading/error behavior and lifecycle cleanup.
7. Test desktop, mobile and tablet composition. Check the 700/900px boundaries,
   short viewport heights, real touch where available, and reduced motion.
8. Start the site and inspect it visually in an available browser. Exercise the
   relevant controls. If browser access or real-device testing is unavailable,
   say so and distinguish code checks from observed UI evidence.
9. Fix observed mismatches and errors; do not claim fidelity based only on a
   successful build. Record the specific checks that passed and remaining gaps.
10. Provide the full updated source, setup commands, actual changed/new files,
    and an updated preview when the task calls for it. Update the corresponding
    docs to match the final code. Remove temporary debug and QA files.

Important constraints:
- Keep brand styling, current component responsibilities and shared order state.
- No unrelated folder migration or broad refactor for a small animation change.
- Do not use recorded headings/navigation as a replacement for live UI.
- Do not hide broken geometry with arbitrary blur/overlays without explaining
  the asset/camera limitation and checking the result.
- Do not call a 2D texture transform a real 3D model or a duplicate render a
  seamless shared-object morph.
- Do not claim a new backend, real delivery tracking or order placement when
  the implementation is a frontend demo.
- Do not claim measured frame rate, mobile-device testing or exact visual
  matching unless you have the corresponding evidence.

Final report:
- What changed and why.
- Which source/assets were modified or added.
- How the affected animation and state flow work.
- Build and visual/interaction verification actually completed.
- Known limits or remaining test gaps.
- Where to open the preview and obtain the updated code, if requested.
```

## 2. Reusable animation brief — નવા project માટે

```text
PROJECT
- Purpose / audience:
- Existing repository or ZIP:
- Framework and package manager:
- Folder structure constraints:
- Reference file / URL:
- Important reference moments:

VISUAL CONSTRAINTS
- Brand colors / fonts:
- Objects and assets to preserve:
- Shape / line-thickness / aspect-ratio constraints:
- Camera / crop / lighting requirements:
- What may be adapted:

SCENE SPECIFICATION
For each scene:
- Scene name:
- Starting visible state:
- Ending visible state:
- Input driver: scroll / time / click / drag / data
- Subject and background layers:
- Position / scale / angle / crop anchors:
- Duration or scroll range:
- Text / controls and safe zones:
- Occlusion / layer-order rules:
- Reverse-scroll behavior:
- Repeated-action / reset behavior:
- Mobile adaptation:
- Loading / failure fallback:

REAL FUNCTIONALITY
- Shared state:
- Derived values such as price/progress:
- API calls, if any:
- Cache/reuse behavior, if any:
- What is demo-only:
- What must persist across reload:

DEVICES / PERFORMANCE
- Target browsers and actual device classes:
- Target viewports and orientations:
- Reduced-motion behavior:
- Asset download / memory / responsiveness goals:
- Fallback for low-power or slow-network devices:

DELIVERY
- Full source or patch:
- Live preview required:
- Changed-file list required:
- Setup and animation docs required:
- Required tests and visual evidence:

ACCEPTANCE CRITERIA
1.
2.
3.
```

## 3. Specific mismatch report template

```text
Scene:
Viewport / browser / device:
Input and steps to reproduce:
Reference moment / expected state:
Actual state:
Object center / size / angle / layer issue:
Does it happen forward, backward or both?
Does resizing / reloading change it?
Relevant source file or asset if known:
Screenshot / short capture if available:
Expected correction:
```

ઉદાહરણ: “Mobileમાં pizza નથી દેખાતી” કરતાં “390 × 844, builder phase પર pizza center left edge તરફ crop થાય છે; target center ઉપરના sceneમાં રહેવું જોઈએ; desktop ઠીક છે” ઘણું વધુ actionable છે.

## 4. Iteration માટે concise follow-up

```text
Compare the current result with the reference at the same viewport and phase.
Find the cause of this specific mismatch: [DESCRIPTION].
Inspect asset bounds, the coordinate mapping, parent transforms, scroll state,
and transform ownership before editing. Fix the cause in the existing structure,
then verify forward/backward movement, resize, and affected interactions.
Report actual changed files and evidence. Keep unrelated working behavior intact.
```

## 5. Completion કેવી રીતે judge કરવું?

“Animation added” અથવા “build passed” એકલા પૂરતા નથી. Visible start/end states, working input, correct state values, repeat/reset behavior, responsive composition અને honest verification report સાથે result review કરો.
