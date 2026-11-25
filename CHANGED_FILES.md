# Changes from the uploaded project

## Modified

- `src/App.jsx` — shared order state and smooth scrolling lifecycle.
- `src/components/Navbar.jsx` — working menu/build navigation, mobile drawer.
- `src/components/HeroSection.jsx` — rebuilt scroll-driven chef and pizza experience.
- `src/components/PizzaCustomizer.jsx` — real ingredient layers and reusable pizza.
- `src/components/ReceiptSection.jsx` — receipt reads the selected toppings/total.
- `src/components/DeliverySection.jsx` — small-screen scooter bounds, demo ETA copy.
- `src/components/ReviewsAndMenu.jsx` — animated, draggable fan plus slice/pie menu.
- `src/index.css` — responsive design, effects and sticky-scrolling correction.
- `index.html` — metadata.
- `package-lock.json` — install lockfile verified by the build.
- `README.md` — setup, behavior, asset explanation and checks.

## New

- `.nvmrc` — Node 24.
- `CHANGED_FILES.md` — this change list.
- `public/chef/` — 96 kitchen/chef frames.
- `public/kitchen-poster.webp` — initial scene fallback.
- `public/kitchen-builder.webp` — kitchen plate for the interactive stage.
- `src/assets/images/pizza-cheese-raw.webp` — transparent uncooked cheese pizza.
- `src/assets/images/pizza-cheese-baked.webp` — transparent baked cheese pizza.

## Replaced / restored

- `public/frames/` is replaced by `public/chef/`; the old frames had recorded UI.
- The original unused `pizza-raw-base.png` is preserved for source compatibility.
- The reference MP4 is preserved under its original public path.

`Footer.jsx`, `MarqueeStrip.jsx`, `main.jsx`, `pizzaData.js`, and the existing
framework configuration retain their original roles. No backend or database was
introduced. No additional runtime dependencies were added.
