# Testing, performance, debugging અને limitations

## 1. Current verification record

આ record અગાઉના animation implementation passનું છે. Documentation ઉમેરતી વખતે application source બદલાયું નથી. નીચે “Observed”નો અર્થ limited browser/build evidence છે; full cross-browser certification નથી.

| Check | Evidence / status |
| --- | --- |
| Production build | Vite build completed successfully. |
| Desktop composition | 1363 × 936 Chromium browser viewport inspected. |
| Compact composition | 390 × 844 mobile-size and 768 × 1024 tablet-size iframe views inspected in the desktop browser. |
| Topping selection | Base $21; all four selected → $30. |
| Partial selection | Pepperoni + basil → $26; pepperoni alone → $24 during interaction checks. |
| Baking | Ingredient controls disabled; completed label and 899°F observed. |
| Receipt | Selected items and corresponding total observed in the shared receipt. |
| Navigation / sections | Builder, receipt, delivery, review fan and menu inspected; review next action changed active selection. |
| Replay / guided controls | Implemented and exercised during the browser pass; see behavior and differences in implementation notes. |
| Source archive | Original delivery archive integrity checked. This docs update also verifies all old entry bytes are unchanged. |
| Hosting | Deployment operation reported success. Production URL opened to a ChatGPT sign-in gate in the inspection browser; post-login production UI was not separately inspected there. |
| Real Android / iOS hardware | Not verified. |
| Measured FPS, peak memory, slow-network results | Not measured. |
| Screen-reader and full keyboard audit | Not completed. |
| Full drag edge-case / all breakpoint matrix | Not completed. |

A browser-size preview is useful layout evidence, but it is not the same as testing a physical phone's touch, memory, address bar, rendering engine or thermal behavior.

## 2. Core acceptance checks

Run these again after future code/asset changes. Record actual result, viewport, browser, and screenshot/notes when relevant.

| ID | Action | Expected result |
| --- | --- | --- |
| A01 | Open page with cache disabled | Poster/readable UI appears; no dependency on downloading the whole recording first. |
| A02 | Scroll slowly from start | Chef sequence advances; headings follow defined phases; no doubled recorded navigation. |
| A03 | Scroll backward | Chef frames reverse without losing user choices unexpectedly. |
| A04 | Press Build a pie | Reach usable builder; product and controls remain visible. |
| A05 | Toggle one topping on/off | Selection state, visual pieces and total agree; remove returns to prior total. |
| A06 | Select all four | Total is $30; each ingredient group appears. |
| A07 | Fire once, then try again quickly | Only one bake flow runs; controls cannot change ingredients while baking. |
| A08 | Wait for completion | 899°F, cooked cheese base, same selected toppings, Order up control. |
| A09 | Open receipt | Exact selected options and derived total; cooked/raw state consistent with current status. |
| A10 | Reset during bake | Active bake tween stops; ingredients clear; total $21; no delayed stale completion. |
| A11 | Replay after bake | Return to beginning and clean idle state. |
| A12 | Start guided play then wheel/touch | User input cancels guided motion; no scrolling fight. |
| A13 | Pause guided play | Playhead stops; new play/replay remains usable. |
| A14 | Move through delivery | Scooter advances with scroll, ETA/milestones reflect demo progress, road alignment holds. |
| A15 | Review arrows/click/swipe | Active card changes; drag result is not overwritten by a following click. |
| A16 | Scroll vertically over review fan | Page remains scrollable; no unnecessary horizontal/vertical input trap. |
| A17 | Use Menu and compact menu | Destination is correct; menu closes; focus/readability remain usable. |
| A18 | Resize at opening, toss, builder, bake | Canvas sharpness and live pizza anchor update together; no detached overlay. |
| A19 | Reload while halfway down | Browser scroll restoration and story state do not leave blank or mismatched UI. |
| A20 | Visit receipt before firing | Current behavior: raw/current pizza may appear; this is not a checkout lock. |

## 3. Responsive test matrix

| Area | Suggested coverage | What to inspect |
| --- | --- | --- |
| Narrow phones | 320/360px widths | Builder fits, labels readable, buttons reachable. |
| Standard mobile | 390 × 844 and similar | Product above panel, no unwanted horizontal scroll, fixed nav clear. |
| Short phone / landscape | 667 × 375 or similar | Stage minimum height, clipped controls, long sticky travel; fallback may be needed. |
| Tablet portrait | 768 × 1024 | Focus/crop, panel maximum width, content density. |
| Tablet landscape | 1024 × 768 | Desktop/compact handover and navigation spacing. |
| Laptop | 1366 × 768 | Scene framing, title size, card/pizza overlap. |
| Wide desktop | 1920 × 1080 and wider if targeted | Maximum widths, excess crop, product scale, fine image detail. |
| Breakpoint boundaries | 699/700/701, 899/900/901, 1000/1001, 1599/1600 | CSS/JS condition consistency. |
| Zoom and larger text | 125–200% as appropriate | Panel height, focus visibility, card clipping, navigation. |

Current CSS compact breakpoint includes 900px, but JS focus test is `<900`; the scooter JS test is `<700` while its small CSS override includes 700px. These exact boundaries deserve inspection. This docs pass records them; it does not silently change them.

## 4. Performance: download size is not memory size

Chef files together are **4,240,222 compressed bytes** (about 4.24 MB decimal / 4.04 MiB). A rough uncompressed RGBA calculation for 96 frames is:

```text
1280 × 720 × 4 bytes × 96
= 353,894,400 bytes
≈ 337.5 MiB
```

આ theoretical pixel-buffer estimate છે, measured browser memory નથી. Browser representation, decode strategy, texture copies and eviction differ. It still explains why a small WebP download can create significant memory pressure.

### Already implemented

- Six concurrent loading/decoding workers.
- WebP frame compression and smaller 600 × 600 product textures.
- Poster fallback and earlier decoded-frame fallback.
- Canvas DPR cap 1.5.
- Refs for frame images and playhead rather than storing frame images in React state.
- Phase state changes only when the caption phase changes.
- Lazy loading for review images.
- Listener/ticker/observer/tween cleanup.

### Future optimizations, not current features

1. Measure first. Record cold-load transfer, decode stalls, peak memory and scroll recording on the target phone.
2. Consider a sliding-window frame cache rather than retaining all 96 decoded images.
3. Add smaller mobile sequence variants when full 1280 × 720 decode cost is unnecessary.
4. Prioritize nearby frames after a far jump; current loader advances mostly in source order.
5. Coalesce repeated decode/resize/scroll draw requests into one draw per display tick if profiling shows redundant work.
6. Avoid assigning `canvas.width` / `height` unless size changes, as current code already does.
7. Throttle temperature React renders or update a dedicated text ref if that becomes a bottleneck.
8. Pause offscreen decorative motion. The delivery GSAP bobbing tween currently repeats even when its section is offscreen.
9. Profile compact scene-height changes and scooter `left` updates; they involve layout-sensitive properties.
10. Prefer transform/opacity for suitable motion, and use `will-change` only when profiling justifies it. Do not apply it to every node by default.
11. Remove reference-only media from the deployable public folder in a future packaging change if artifact size matters.

Six-worker concurrency limits simultaneous work; it does not bound total retained frame memory. DPR cap changes Canvas output workload, not the source image cache.

### Performance targets કેવી રીતે નક્કી કરવા?

Fixed universal limits જાહેર કરવાને બદલે target device/network લખો. Then define acceptable time to first usable content, input delay, scroll smoothness, maximum download, peak memory and fallback behavior. A 60fps claim requires measurement; a successful build does not prove it.

For frame budget intuition, 60Hz gives approximately 16.7ms per display interval. Actual refresh rate, CPU/GPU, page work and device conditions vary. Use a performance trace to find where time is spent rather than increasing smoothing blindly.

## 5. Failure and loading scenarios

| Scenario | Current behavior / what to test |
| --- | --- |
| A target frame is still loading | Search for an earlier decoded frame; may hold an older pose temporarily. |
| Several frame requests fail | Attempts count toward loading progress; error count remains; retry control appears after all attempts complete. |
| All frames fail | Poster fallback is intended; verify the complete failure path in the actual browser. |
| Builder plate fails | Error is caught without a dedicated error indicator; renderer falls back to sequence selection. Separate retry is a future improvement. |
| User navigates away during load | Disposed flag suppresses stale state updates; active network image requests are not explicitly aborted. |
| User jumps to builder on slow connection | A much earlier available frame may briefly remain while panel/independent pizza reveals. Test whether this is acceptable. |
| Font request unavailable | Fallback typography is used; line wrapping and timings should still be checked. |
| Refresh while deeply scrolled | Native restored position can disagree with initial local state until measurements update; test this specifically. |

Useful manual tests: cache disabled, network throttled, one `frame_*.webp` request blocked, builder-plate request blocked, images disabled if supported, and a mid-load reload. These were not all run during the original implementation pass.

## 6. Accessibility

### Present

- Skip-to-menu link.
- Semantic buttons/links and visible focus styling.
- Pressed states on toggle controls.
- Canvas description and pizza image text.
- Compact menu with expanded state.
- CSS reduced-motion overrides, reduced bake duration and disabled smooth wheel setting.

### Still inspect / improve as needed

- Keyboard reachability while some scene elements have opacity 0.
- Screen-reader announcement frequency: `aria-live` captions and heat counter can be noisy.
- Focus destination when using section-jump buttons.
- Larger text and minimum touch-target comfort on real phones.
- Full static reduced-motion alternative. Current frame scrubbing remains and not every JavaScript tween is gated by reduced motion.
- Contrast over every source frame, not just the opening image.
- Pausing decorative offscreen animation.

Do not treat a global CSS `animation:none` rule as proof that GSAP JavaScript animations have stopped.

## 7. Debugging symptoms

| Symptom | Check first | Practical correction path |
| --- | --- | --- |
| Two navbars/headings | Are they inside the source image itself? | Use clean assets / masked footage and real DOM UI separately. |
| Chef appears on the pizza disc | Wrong texture imported? | Inspect the actual image and active import, not only the filename. |
| Pizza drifts on resize | Different coordinate systems or crop formulas? | Derive Canvas and overlay from the same source dimensions/scale/offset. |
| White/black rectangle around pizza | Missing alpha or wrong export? | Inspect PNG/WebP transparency; do not rely on blend modes to hide an unwanted background. |
| Raw rim behind cooked texture | Alpha margins/base opacity differ? | Align texture bounds and inspect crossfade opacity/size at completion. |
| Scene disappears while scrolling | Wrong scroll ancestor / sticky containment? | Inspect computed overflow and bounding rectangles for each ancestor. |
| Scroll fights the user | Multiple scroll owners or active guided tween? | Keep one owner; stop guided play on user input. |
| Animation starts twice in development | Effect cleanup/StrictMode lifecycle? | Remove duplicate ticker/listeners/tweens; do not solve by disabling StrictMode first. |
| Review state changes, cards do not | GSAP inline transform overriding CSS? | Animate wrapper or consistently own card transforms in one system. |
| Drag selects wrong card | Click follows pointer drag? | Track drag threshold and suppress subsequent click selection. |
| Scooter floats above road | Transparent PNG margins? | Align visible wheel position, not just image box bottom. |
| Slow scroll on mobile | Decode, paint, layout, memory, duplicate draws? | Measure trace and memory; reduce relevant cost before adding more smoothing. |
| Spinner reaches 100% but footage missing | “Completed attempts” versus successful decodes? | Inspect errors and network; loading percentage is not a success guarantee. |
| Local works, hosted assets 404 | Base URL, case, public paths, build output? | Inspect production network and the built assets; preserve exact filename case. |
| Works until a font/image loads | Stale start/end/layout measurements? | Refresh measurements after layout-affecting resources settle. |
| Hot reload clears selections | Development module reload? | Re-test on a stable production build; reload-state persistence is not implemented. |

## 8. A disciplined debugging sequence

1. Reproduce at a named viewport and story phase.
2. Read actual console/network errors.
3. Temporarily identify progress, frame index and state through safe developer diagnostics.
4. Inspect ancestor overflow and object bounding boxes.
5. Check source image content and transparency.
6. Confirm which code owns each transform and state.
7. Fix one cause; compare the same phase again.
8. Remove temporary diagnostics before final delivery.
9. Re-run the relevant interaction and build; broaden checks only if the change affects other areas.

## 9. Packaging checks

```bash
npm ci
npm run build
npm run preview
```

For application changes, test that production preview too. For a documentation-only archive edit, integrity/link checks and exact old-entry comparison are appropriate; rebuilding unchanged JavaScript provides little extra evidence.

Before delivery, verify that source, lockfile, assets and docs are present; temporary QA pages, dependency folders, personal credentials and environment files are absent. Confirm that the live URL's audience is intentional and note a sign-in gate when relevant.
