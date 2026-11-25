# Asset briefs, reproducibility અને technical references

## 1. Final assetsની origin

| Final file | Origin | Runtime use |
| --- | --- | --- |
| `public/chef/frame_000.webp` … `frame_095.webp` | Supplied videoનું extraction + documented cleanup | Canvas frames |
| `public/kitchen-poster.webp` | Cleaned first frame | CSS fallback |
| `public/kitchen-builder.webp` | Image-generation edit based on the final chef frame | Final scene without a baked-in pizza |
| `src/assets/images/pizza-cheese-raw.webp` | Generated transparent top-down raw cheese pizza | Interactive raw base |
| `src/assets/images/pizza-cheese-baked.webp` | Generated transparent top-down baked cheese pizza | Cooked base crossfade |
| Scooter / night background / review JPGs | Supplied project assets | Delivery and review sections |
| Ingredient pieces | CSS gradients, radii, shadows and coordinate data | Actual selectable overlays |

The built-in image-generation tool was used for the three final generated images. The generated image outputs were then resized/converted into project WebP files: pizza textures to 600 × 600 with alpha, and the kitchen plate to 1280 × 720 RGB, WebP quality 90/method 6. Original generated PNGs are not required by the runtime.

Intermediate extraction/unwarp attempts were discarded as active pizza textures because their edges included scene background. The final renderer imports the generated WebP bases; the older raw PNG remains unused for compatibility.

## 2. Generation briefs used

આ briefs actual creation instructionsના readable, normalized records છે. ફરી generation કરવાથી identical pixels મળશે તેવી guarantee નથી. Existing bundled files preserve the current appearance.

### A. Cooked cheese pizza

```text
Use case: product-mockup.
Asset: a single transparent pizza texture for an interactive pizza-shop website.

Create one whole round freshly wood-fired plain cheese pizza, viewed perfectly
straight from overhead. Real photographic food texture: golden leopard-char
puffy crust, red tomato sauce subtly visible beneath evenly melted mozzarella.

No toppings: no basil, pepperoni, vegetables, or white fresh-mozzarella balls.
The user-selected toppings will be added separately by code.

Orthographic top-down view. Circular pizza centered in a square canvas, entirely
visible, approximately filling the canvas with a slim transparent margin.
No plate, board, props, text, logo, cut slice, surroundings or external shadow.
Real alpha transparency and clean isolated edges. Suitable for CSS rotation.
```

### B. Uncooked cheese pizza

```text
Asset: one photorealistic uncooked round cheese pizza for a web/game interface.

Perfect overhead view, centered on a square transparent canvas. Pale ivory raw
dough rim, red tomato sauce, and evenly scattered fine shredded white mozzarella.
Entire circular pizza visible with a small margin. No browning or burnt crust.

No meat, pepperoni, basil leaves, vegetables or fresh mozzarella balls.
No board, plate, props, outside shadow or typography. Crisp photographic food.
Real transparent background; user toppings will be added by code as layers.
```

### C. Clean final kitchen plate

```text
Use case: precise-object-edit.
Reference/edit target: final cleaned chef frame from the supplied recording.

Remove only the large floating pizza above the miniature chef. Reconstruct the
kitchen background hidden behind it: wall tiles, utensils and kitchen details.
Keep the landscape composition and camera framing, warm miniature-chef style,
raised-arm pose, foreground olive-oil bottle on the left, countertop ingredients,
pizza cutter at lower right and ovens on the right.

Do not remove the chef. Do not add another pizza, characters, text or navigation.
Preserve the dark top/bottom vignette. The output will be a background plate
behind a separate interactive pizza layer.
```

The generated plate preserved the scene's intent but changed some background/detail styling. Current code switches to it directly; matching its pose, camera, lighting and texture more exactly would require another deliberate asset pass and browser comparison.

## 3. Future asset replacement briefમાં શું ઉમેરવું?

| Field | Why it matters |
| --- | --- |
| Asset role | Background, object texture, ingredient cutout, sprite કે video સ્પષ્ટ થાય. |
| Viewpoint | Top-down, side, camera orbit, focal length / perspective match. |
| Composition | Center, margin, aspect ratio, normalized anchor, full-object visibility. |
| Invariants | Face/pose, logo shape, line thickness, brand colors અથવા exact silhouette. |
| Transparency | Actual alpha કે opaque background; “white background” transparent નથી. |
| Lighting | Direction/temperature/shadow reference સાથે match કરવી. |
| Separate layers | Selectable details baseમાં permanently ન આવે. |
| Output dimensions | Texture અને reference canvasના coordinate assumptions જળવાય. |
| Avoid list | Baked-in UI, text, extra toppings, props, extra objects. |
| Validation | Edge, rotation, crop અને scene handover browserમાં તપાસવા. |

Prompt વધારે લાંબો હોવો successનો માપદંડ નથી. Clear invariants, correct reference role અને final output inspection વધુ ઉપયોગી છે.

## 4. Reproducibility

- Frame extraction/cleanup repeat કરવા [asset pipeline](02_REFERENCE_VIDEO_AND_ASSETS.md)માં interval, frame count અને mask values આપેલા છે.
- Current generated appearance reuse કરવા bundled WebP files જ વાપરો; નવા AI outputsથી source coordinates ફરી tune કરવાની જરૂર પડી શકે.
- Application install માટે supplied `package-lock.json` સાથે `npm ci` વાપરો.
- Root `.nvmrc`, setup notes અને actual engine constraints વાંચો.
- Final assetsની checksum/version note ભવિષ્યમાં રાખવી ઉપયોગી છે, ખાસ કરીને current file name જ રાખીને texture બદલાતી હોય ત્યારે.
- Frame count/resolution/camera/anchor બદલો તો `FRAME_COUNT`, mapping અને responsive framing પણ review કરો.

## 5. Official technical references

Reviewed for this documentation on **13 November 2026**. These links explain underlying APIs; current implementation constants are derived from the bundled source, not copied from a tutorial. Future versions may differ, so use the lockfile and compatible documentation when changing dependencies.

| Reference | Relevant topic |
| --- | --- |
| [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Scroll ranges, linked animation progress, scrub, refresh and pin behavior. |
| [Lenis official repository](https://github.com/darkroomengineering/lenis) | Manual RAF and GSAP/ScrollTrigger integration. |
| [MDN: HTMLImageElement.decode](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode) | Promise-based image decode readiness and error handling. |
| [web.dev: high-performance CSS animations](https://web.dev/articles/animations-guide) | Transform/opacity preference, layout/paint profiling and careful layer promotion. |
| [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | Detecting a user's reduced-motion preference. |

### How these references inform the guide

- ScrollTrigger supports scroll-linked animation progress; numeric scrub adds playhead catch-up smoothing. A callback that directly writes styles should not automatically be assumed to inherit tween smoothing.
- Lenis's documented GSAP integration synchronizes its scroll event with ScrollTrigger and converts ticker seconds to RAF milliseconds. Avoid starting a second automatic loop unintentionally.
- Image decode readiness is asynchronous and can fail. Loading UI should distinguish a completed attempt from successful visual readiness.
- Transform and opacity are useful motion properties; layout-sensitive changes should be measured. Add `will-change` selectively after identifying a rendering issue.
- Reduced-motion preference needs deliberate behavior across CSS and JavaScript. Detecting it does not by itself stop every animation in the application.

## 6. Ownership of facts in these docs

**Project facts:** values read from the current source/asset bytes and observations from the earlier build/browser pass.  
**Recommendations:** implementation judgment for future work, explicitly separated from delivered functionality.  
**API principles:** brief paraphrases supported by the official references above.  
**Unverified areas:** real-device behavior, frame-rate/memory measurements, full accessibility coverage and perfect visual matching are not claimed as completed.
