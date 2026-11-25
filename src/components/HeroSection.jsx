import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, RotateCcw, Play, Pause, Flame } from 'lucide-react';
import { CustomizerCard, PizzaDisc } from './PizzaCustomizer';

gsap.registerPlugin(ScrollTrigger);
const FRAME_COUNT = 96;
// The decoded frames carry blurred letterbox bands (rows 0-105 and 675-719); only this slice is real picture.
const SRC_Y = 106, SRC_H = 568;
const clamp = gsap.utils.clamp(0, 1);
const ease = t => t * t * (3 - 2 * t);
const phases = [
  ['72 HOURS. ZERO SHORTCUTS.', 'HIGH TOSS.', 'Every pie starts with a little patience. Then we throw it.'],
  ['01 / THE DOUGH', 'NO ROLLING PIN.', 'Just good hands. And a very good dough.'],
  ['02 / THE STRETCH', 'STRETCHED THIN.', 'A light touch. A little air. The perfect foundation.'],
  ['03 / THE FLIGHT', 'THEN IT FLIES.', 'Some things are better up in the air.'],
  ['04 / THE BASE', 'SAUCE. MOZZ.', 'The good stuff. Nothing to hide behind.'],
];

export default function HeroSection({ selectedToppings, setSelectedToppings, totalPrice, status, setStatus, onReset, resetKey }) {
  const track = useRef(null);
  const scene = useRef(null);
  const canvas = useRef(null);
  const pizza = useRef(null);
  const images = useRef([]);
  const builderPlate = useRef(null);
  const progress = useRef({ value: 0 });
  const frameDraw = useRef(() => { });
  const bakeTween = useRef(null);
  const tourTween = useRef(null);
  const [loaded, setLoaded] = useState(0);
  const [errors, setErrors] = useState(0);
  const [phase, setPhase] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(false);
  const [retry, setRetry] = useState(0);

  // Decode a bounded number concurrently. The page is usable before all frames arrive.
  useEffect(() => {
    let disposed = false;
    let next = 0;
    let complete = 0;
    setLoaded(0); setErrors(0);
    const plate = new Image();
    plate.src = `${import.meta.env.BASE_URL}kitchen-builder.webp`;
    plate.decode().then(() => { if (!disposed) { builderPlate.current = plate; frameDraw.current(); } }).catch(() => { });
    const load = async () => {
      while (next < FRAME_COUNT && !disposed) {
        const index = next++;
        const img = new Image();
        img.src = `${import.meta.env.BASE_URL}chef/frame_${String(index).padStart(3, '0')}.webp`;
        try { await img.decode(); if (!disposed) images.current[index] = img; }
        catch { if (!disposed) setErrors(n => n + 1); }
        if (!disposed) { setLoaded(++complete); frameDraw.current(); }
      }
    };
    for (let i = 0; i < 6; i++) load();
    return () => { disposed = true; };
  }, [retry]);

  useEffect(() => {
    const root = track.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lastPhase = -1;
    const draw = () => {
      const el = canvas.current;
      if (!el) return;
      const box = scene.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(box.width * dpr), height = Math.round(box.height * dpr);
      if (el.width !== width || el.height !== height) { el.width = width; el.height = height; }
      const p = progress.current.value;
      const frame = Math.round(clamp(p / 0.62) * (FRAME_COUNT - 1));
      let img = p >= 0.62 && builderPlate.current ? builderPlate.current : images.current[frame];
      if (!img) { for (let i = frame; i >= 0; i--) { if (images.current[i]) { img = images.current[i]; break; } } }
      if (img) {
        // Crop away the letterbox bands, then cover-fit the real picture.
        const scale = Math.max(width / 1280, height / SRC_H);
        const dw = 1280 * scale, dh = SRC_H * scale;
        // Mobile stays focused on the chef and the flying dough.
        const anchor = box.width < 900 ? 0.58 - 0.26 * clamp((p - 0.4) / 0.22) : 0.5;
        const x = (width - dw) * anchor;
        const y = (height - dh) * 0.5;
        const ctx = el.getContext('2d', { alpha: false });
        ctx.drawImage(img, 0, SRC_Y, 1280, SRC_H, x, y, dw, dh);
        // The interactive pizza occupies precisely the filmed pizza's coordinates.
        if (pizza.current) {
          // The pie rises toward the camera for the ORDER UP finish with its selected ingredients.
          const o = ease(clamp((p - 0.80) / 0.17));
          const baseCx = (x + 503 * scale) / dpr, baseCy = (y + (198 - SRC_Y) * scale) / dpr;
          const baseW = 505 * scale / dpr;
          const targetW = Math.min(box.width * 0.28, box.height * 0.88);
          pizza.current.style.left = `${baseCx + (box.width / 2 - baseCx) * o}px`;
          pizza.current.style.top = `${baseCy + (box.height * 0.5 - baseCy) * o}px`;
          pizza.current.style.width = `${baseW + (targetW - baseW) * o}px`;
          pizza.current.style.setProperty('--order', o);
          root.style.setProperty('--order-pizza-width', `${targetW}px`);
        }
      }
      root.style.setProperty('--scene-height', `${100 - 36 * clamp((p - 0.53) / 0.09)}%`);
      root.style.setProperty('--intro-opacity', 1 - clamp((p - 0.02) / 0.07));
      root.style.setProperty('--copy-opacity', clamp((p - 0.12) / 0.035) * (1 - clamp((p - 0.54) / 0.05)));
      root.style.setProperty('--builder-opacity', clamp((p - 0.62) / 0.045) * (1 - clamp((p - 0.80) / 0.07)));
      root.style.setProperty('--order-opacity', ease(clamp((p - 0.82) / 0.10)));
      root.style.setProperty('--pizza-opacity', clamp((p - 0.60) / 0.035));
      root.style.setProperty('--story-progress', `${p * 100}%`);
      root.dataset.building = p >= 0.64 ? 'true' : 'false';
      const nextPhase = p < 0.12 ? 0 : p < 0.27 ? 1 : p < 0.40 ? 2 : p < 0.51 ? 3 : 4;
      if (nextPhase !== lastPhase) { setPhase(nextPhase); lastPhase = nextPhase; }
    };
    frameDraw.current = draw;
    const animation = gsap.to(progress.current, {
      value: 1, ease: 'none',
      scrollTrigger: { id: 'pizza-story', trigger: root, start: 'top top', end: 'bottom bottom', scrub: media.matches ? true : 0.32, invalidateOnRefresh: true },
      onUpdate: draw,
    });
    const observer = new ResizeObserver(draw);
    observer.observe(scene.current);
    const build = () => {
      tourTween.current?.kill(); setTourPlaying(false);
      const st = animation.scrollTrigger;
      window.__lenis?.scrollTo(st.start + (st.end - st.start) * 0.76, { duration: 1.7 });
      if (!window.__lenis) window.scrollTo({ top: st.start + (st.end - st.start) * 0.76, behavior: media.matches ? 'instant' : 'smooth' });
    };
    window.addEventListener('pizza:build', build);
    draw();
    return () => { observer.disconnect(); animation.scrollTrigger?.kill(); animation.kill(); frameDraw.current = () => { }; window.removeEventListener('pizza:build', build); };
  }, []);

  useEffect(() => {
    bakeTween.current?.kill();
    setTemperature(0);
    if (pizza.current) gsap.set(pizza.current, { '--bake': 0 });
  }, [resetKey]);

  // Re-run the layout math when baking finishes so the ORDER UP finish engages immediately.
  useEffect(() => { frameDraw.current(); }, [status]);

  useEffect(() => () => { bakeTween.current?.kill(); tourTween.current?.kill(); }, []);

  const fire = () => {
    if (status !== 'idle') return;
    tourTween.current?.kill(); setTourPlaying(false);
    setStatus('baking');
    const heat = { value: 0 };
    bakeTween.current = gsap.to(heat, {
      value: 899, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.1 : 3.4, ease: 'power2.inOut',
      onUpdate: () => { setTemperature(Math.round(heat.value)); pizza.current?.style.setProperty('--bake', heat.value / 899); },
      onComplete: () => setStatus('baked'),
    });
  };
  const replay = useCallback(() => {
    bakeTween.current?.kill(); tourTween.current?.kill(); setTourPlaying(false); onReset();
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onReset]);

  const toggleTour = () => {
    if (tourPlaying) { tourTween.current?.kill(); setTourPlaying(false); return; }
    const st = ScrollTrigger.getById('pizza-story');
    if (!st) return;
    const start = progress.current.value > 0.62 ? 0 : progress.current.value;
    const playhead = { value: start };
    setTourPlaying(true);
    tourTween.current = gsap.to(playhead, {
      value: 0.76, duration: Math.max(3, (0.76 - start) * 16), ease: 'none',
      onUpdate: () => {
        const top = st.start + (st.end - st.start) * playhead.value;
        if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true }); else window.scrollTo(0, top);
      }, onComplete: () => setTourPlaying(false)
    });
  };
  useEffect(() => {
    const cancel = e => { if (e.target instanceof Element && e.target.closest('.story-controls')) return; tourTween.current?.kill(); setTourPlaying(false); };
    window.addEventListener('wheel', cancel, { passive: true }); window.addEventListener('touchstart', cancel, { passive: true });
    return () => { window.removeEventListener('wheel', cancel); window.removeEventListener('touchstart', cancel); };
  }, []);

  return (
    <section className="pizza-story" ref={track} id="customizer" data-status={status}>
      <div className="pizza-stage">
        <div className="kitchen-scene" ref={scene}>
          <canvas ref={canvas} role="img" aria-label="Chef hand-stretches and tosses your pizza as you scroll" />
          <div className="kitchen-shade" />
          <div ref={pizza} className={`flying-pizza ${status}`} aria-hidden="true">
            <div className="pizza-perspective"><div className="pizza-turntable"><PizzaDisc selectedToppings={selectedToppings} baked={status === 'baked'} /></div></div>
          </div>
          <div className="oven-glow" />
          <div className="order-banner" aria-hidden="true"><span>ORDER</span><span>UP<i>.</i></span></div>
        </div>

        <div className="hero-intro">
          <p className="eyebrow">NEW YORK SOUL. NEAPOLITAN FIRE.</p>
          <h1>HIGH TOSS<span className="orange-period">.</span></h1>
          <p className="hero-description">Every pie starts with a little patience.<br />Then we throw it.</p>
          <button className="text-link" onClick={() => window.dispatchEvent(new Event('pizza:build'))}>MAKE IT YOURS <ArrowDown size={15} /></button>
        </div>

        <div className={`story-copy phase-${phase}`} key={phase} aria-live="polite">
          <span className="eyebrow">{phases[phase][0]}</span>
          <h2>{phase === 4 ? <>SAUCE. <em>MOZZ.</em></> : phases[phase][1]}</h2>
          <p>{phases[phase][2]}</p>
        </div>

        <div className="builder-position">
          <CustomizerCard selectedToppings={selectedToppings} totalPrice={totalPrice} status={status} onFireIt={fire} onReset={onReset} onToggleTopping={id => setSelectedToppings(prev => ({ ...prev, [id]: !prev[id] }))} />
        </div>

        {status !== 'idle' && <div className="oven-temperature" role="status"><span className="eyebrow"><Flame size={13} /> {status === 'baking' ? 'IN THE WOOD-FIRED OVEN' : 'PERFECTLY BLISTERED'}</span><div>{status === 'baked' ? 899 : temperature}<em>°F</em></div><p>{status === 'baked' ? 'Okay. That was worth the wait.' : temperature < 450 ? 'Bringing the heat.' : 'Watch that crust come alive.'}</p></div>}

        <div className="story-controls">
          <button onClick={replay} aria-label="Replay pizza toss"><RotateCcw size={14} /><span>REPLAY</span></button>
          <span className="scroll-instruction"><ArrowDown size={14} /><span>SCROLL TO {status === 'baked' ? 'ORDER UP' : 'TOSS'}</span></span>
          <button onClick={toggleTour} aria-label={tourPlaying ? 'Pause guided animation' : 'Play guided animation'}>{tourPlaying ? <Pause size={14} /> : <Play size={14} />}<span>{tourPlaying ? 'PAUSE' : 'PLAY THE TOSS'}</span></button>
        </div>
        {loaded < FRAME_COUNT && <span className="frame-loading" role="status">Warming up · {Math.round(loaded / FRAME_COUNT * 100)}%</span>}
        {errors > 0 && loaded === FRAME_COUNT && <button className="frame-loading" onClick={() => setRetry(n => n + 1)}>Some frames unavailable · Retry</button>}
        <div className="story-progress"><span /></div>
      </div>
    </section>
  );
}