# HIGH TOSS — Interactive Pizza Shop

An interactive, scroll-driven pizza shop experience built with **React**, **Vite**, **GSAP (ScrollTrigger)**, **Lenis**, and **Tailwind CSS**.

---

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Animations:** GSAP 3 (`ScrollTrigger`) + Lenis smooth scrolling
- **Styling:** Tailwind CSS v4 + custom CSS (`src/index.css`, `src/assets/css/ReceiptSection.css`)
- **Icons:** `lucide-react`

---

## Getting Started

### Prerequisites
- **Node.js 22.12+** (a `.nvmrc` for Node 24 is included)

### Installation & Local Development

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Animation & Scroll Flow

1. **Chef Toss & Dough Stretch (`HeroSection.jsx`)**
   - Scroll-scrubbed 96-frame canvas sequence (`public/chef/frame_000.webp` – `frame_095.webp`) with a guided **Play the Toss** tour and **Replay** control.
2. **Interactive Pizza Customizer (`PizzaCustomizer.jsx` + `HeroSection.jsx`)**
   - Toggle **Pepperoni**, **Fresh basil**, **Fresh mozz**, and **Chili flakes** with animated topping drops (`topping-drop`) and live pricing (`$21` base up to `$30`).
   - Click **Fire It** to bake at `899°F` (smoothly crossfading raw dough to blistered baked crust while hiding the builder card during baking).
   - Scrolling past the builder (baked or unbaked) smoothly un-tilts the pizza into a full circle and reveals **ORDER UP.** with all selected ingredients.
3. **Receipt Handoff & Sticky Pause (`ReceiptSection.jsx`)**
   - The pizza hands off directly from the **ORDER UP.** center into the left-hand receipt slot, pauses while you view the itemized receipt (`Pickup` / `Delivery` toggle, live pickup time, total), and then flies and shrinks onto the delivery scooter as you scroll into the next section.
4. **Live Delivery Tracker (`DeliverySection.jsx`)**
   - Pinned scroll-scrubbed scooter animation driving cleanly across the full road width with dynamic ETA (`14` → `2` min) and milestone progress (`Fired` → `Boxed` → `On the move` → `At your door`).
5. **Reviews & Menu (`ReviewsAndMenu.jsx`)**
   - Scroll-pinned 5-card review fan (`Scroll to Spin`) with card click and swipe/drag support, followed by the slice/whole-pie menu board and **Hungry Again?** footer (`Footer.jsx`).

---

## Project Structure

```text
pizza-shop-animated/
├── public/
│   ├── chef/                        # 96-frame chef toss WebP sequence
│   ├── kitchen-poster.webp          # Initial fallback scene
│   ├── kitchen-builder.webp         # Clean kitchen plate behind customizer
│   └── pizza_shop_screen_recording.mp4
├── src/
│   ├── assets/
│   │   ├── css/ReceiptSection.css   # Receipt section & handoff styles
│   │   └── images/                  # Raw/baked pizza bases, scooter, reviews
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── PizzaCustomizer.jsx
│   │   ├── ReceiptSection.jsx
│   │   ├── DeliverySection.jsx
│   │   ├── ReviewsAndMenu.jsx
│   │   ├── MarqueeStrip.jsx
│   │   └── Footer.jsx
│   ├── data/pizzaData.js            # Toppings, prices, coordinates
│   ├── App.jsx                      # Shared order state & Lenis setup
│   └── index.css                    # Core styles, keyframes, responsive rules
├── .gitignore
├── .nvmrc
├── eslint.config.js
├── package.json
└── vite.config.js
```

---

## Accessibility & Performance

- Respects `prefers-reduced-motion: reduce` across CSS and GSAP `ScrollTrigger` timelines.
- Includes a skip-to-menu link, keyboard-accessible controls, and `aria-pressed` states.
- Canvas rendering caps `devicePixelRatio` at `1.5` and decodes chef frames with bounded concurrency (`6` workers) and progressive fallback.
