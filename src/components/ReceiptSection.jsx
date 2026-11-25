import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Phone } from 'lucide-react';
import { TOPPINGS } from '../data/pizzaData';
import { PizzaDisc } from './PizzaCustomizer';
import '../assets/css/ReceiptSection.css';

gsap.registerPlugin(ScrollTrigger);

function getPickupTime() {
  const d = new Date(Date.now() + 14 * 60 * 1000);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function ReceiptSection({ selectedToppings, totalPrice, status }) {
  const sectionRef = useRef(null);
  const pizzaSlotRef = useRef(null);
  const pizzaFlightRef = useRef(null);
  const receiptContentRef = useRef(null);
  const [mode, setMode] = useState('pickup');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pizzaSlot = pizzaSlotRef.current;
    const pizzaFlight = pizzaFlightRef.current;
    const content = receiptContentRef.current;

    if (!section || !pizzaSlot || !pizzaFlight || !content) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const receiptItems = content.querySelectorAll(
      '.receipt-kicker, .receipt-hot-title, .order-mode, .receipt-lines, .receipt-note, .receipt-actions',
    );
    let refreshHandler = null;

    // Measure the slot with its transform removed, so scale/rotation already applied
    // by GSAP never feed back into the next measurement (that skews size and shape).
    const measureSlot = () => {
      const prev = pizzaSlot.style.transform;
      pizzaSlot.style.transform = 'none';
      const rect = pizzaSlot.getBoundingClientRect();
      pizzaSlot.style.transform = prev;
      return rect;
    };

    const getEntryMetrics = () => {
      const customizer = document.getElementById('customizer');
      const stage = customizer?.querySelector('.pizza-stage');
      const sectionRect = section.getBoundingClientRect();
      const slotRect = measureSlot();
      if (!customizer || !stage || slotRect.width === 0) {
        return { dx: 160, dy: -window.innerHeight, scale: 1.15 };
      }
      const stageRect = stage.getBoundingClientRect();
      const orderW =
        parseFloat(getComputedStyle(customizer).getPropertyValue('--order-pizza-width')) ||
        Math.min(stageRect.width * 0.32, stageRect.height * 1.15);
      const slotCenterX = slotRect.left + slotRect.width / 2;
      const slotOffsetY = slotRect.top + slotRect.height / 2 - sectionRect.top;
      const orderCenterX = stageRect.width / 2;
      const orderCenterY = stageRect.height / 2;
      return {
        dx: orderCenterX - slotCenterX,
        dy: orderCenterY - (window.innerHeight + slotOffsetY),
        scale: orderW / slotRect.width,
      };
    };

    const getFlightMetrics = () => {
      const scooter = document.querySelector('#delivery .delivery-scooter');
      if (!scooter) {
        return { dx: -120, dy: 420, scale: 0.2 };
      }
      const slotRect = measureSlot();
      const scooterRect = scooter.getBoundingClientRect();
      const slotCenterX = slotRect.left + slotRect.width / 2;
      const slotCenterY = slotRect.top + slotRect.height / 2;
      const targetX = scooterRect.left + scooterRect.width * 0.22;
      const targetY = scooterRect.top + scooterRect.height * 0.42;
      const targetSize = Math.max(58, scooterRect.width * 0.26);
      return {
        dx: targetX - slotCenterX,
        dy: targetY - slotCenterY,
        scale: slotRect.width > 0 ? targetSize / slotRect.width : 0.2,
      };
    };

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(pizzaSlot, { autoAlpha: 1, y: 0, scale: 1, rotation: -3 });
        gsap.set(pizzaFlight, { x: 0, y: 0, scale: 1, autoAlpha: 1 });
        gsap.set(receiptItems, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(pizzaSlot, {
        autoAlpha: 0,
        x: () => getEntryMetrics().dx,
        y: () => getEntryMetrics().dy,
        scale: () => getEntryMetrics().scale,
        rotation: 8,
        rotationX: 0,
        rotationY: 0,
        skewX: 0,
        skewY: 0,
        transformPerspective: 0,
        transformOrigin: '50% 50%',
      });
      gsap.set(pizzaFlight, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        skewX: 0,
        skewY: 0,
        transformPerspective: 0,
        autoAlpha: 1,
        transformOrigin: '50% 50%',
      });
      gsap.set(receiptItems, { autoAlpha: 0, y: 24 });

      // Phase 1: hand off directly from Hero ORDER UP center into the Receipt pizza slot.
      const heroPizza = document.querySelector('#customizer .flying-pizza');
      const enter = gsap.timeline({
        scrollTrigger: {
          id: 'customizer-to-receipt-pizza',
          trigger: section,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (heroPizza) {
              heroPizza.style.visibility = self.progress > 0.005 ? 'hidden' : 'visible';
            }
          },
          onLeaveBack: () => {
            if (heroPizza) heroPizza.style.visibility = 'visible';
          },
        },
      });

      enter
        .fromTo(
          pizzaSlot,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.01, ease: 'none' },
          0,
        )
        .fromTo(
          pizzaSlot,
          {
            x: () => getEntryMetrics().dx,
            y: () => getEntryMetrics().dy,
            scale: () => getEntryMetrics().scale,
            rotation: 0,
            transformOrigin: '50% 50%',
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: -3,
            duration: 1,
            ease: 'power2.inOut',
          },
          0,
        );

      const reveal = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          id: 'receipt-reveal',
          trigger: section,
          start: 'top 76%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      });

      reveal.to(receiptItems, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
      }, 0.08);

      // As user scrolls from Receipt toward Delivery, fly and shrink the pizza onto the delivery scooter.
      const flight = gsap.timeline({
        scrollTrigger: {
          id: 'receipt-to-delivery-pizza',
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      flight
        .to(pizzaFlight, {
          x: () => getFlightMetrics().dx,
          y: () => getFlightMetrics().dy,
          scale: () => getFlightMetrics().scale,
          rotation: -12,
          duration: 0.9,
          ease: 'power2.inOut',
        }, 0)
        .to(pizzaFlight, {
          autoAlpha: 0,
          duration: 0.12,
          ease: 'power1.in',
        }, 0.88);

      refreshHandler = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(() => {
        if (section.isConnected) refreshHandler?.();
      });
      window.addEventListener('load', refreshHandler, { once: true });
    }, section);

    return () => {
      if (refreshHandler) window.removeEventListener('load', refreshHandler);
      ctx.revert();
    };
  }, []);

  return (
    <section id="receipt" ref={sectionRef} className="receipt-story">
      <div className="receipt-story-stage">
        <div className="receipt-scene">
          <div className="receipt-layout">
            <div className="receipt-visual">
              <div className="receipt-pizza-target" ref={pizzaSlotRef} style={{ aspectRatio: '1 / 1', transformStyle: 'flat' }}>
                <div className="receipt-moving-pizza-inner" ref={pizzaFlightRef} style={{ width: '100%', height: '100%', aspectRatio: '1 / 1', transformStyle: 'flat' }}>
                  <PizzaDisc selectedToppings={selectedToppings} baked={status === 'baked'} />
                </div>
              </div>
            </div>

            <div className="receipt-content" ref={receiptContentRef}>
              <p className="eyebrow receipt-kicker">YOUR PIE · TICKET #044</p>
              <h2 className="receipt-hot-title">
                <span>HOT IN</span>
                <span><em>14</em> MIN.</span>
              </h2>

              <div className="order-mode" role="group" aria-label="Order type">
                <button
                  type="button"
                  aria-pressed={mode === 'pickup'}
                  onClick={() => setMode('pickup')}
                >
                  Pickup
                </button>
                <button
                  type="button"
                  aria-pressed={mode === 'delivery'}
                  onClick={() => setMode('delivery')}
                >
                  Delivery
                </button>
              </div>

              <div className="receipt-lines">
                <div><span>18&quot; New York cheese pie</span><b>${(21).toFixed(2)}</b></div>
                {TOPPINGS.filter((item) => selectedToppings[item.id]).map((item) => (
                  <div key={item.id}>
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="receipt-total">
                  <span>TOTAL</span>
                  <strong>${totalPrice.toFixed(2)}</strong>
                </div>
              </div>

              <p className="receipt-note">
                {mode === 'pickup'
                  ? `Ready for pickup at ${getPickupTime()}. Walk in, say your name, grab it hot.`
                  : 'The same hot pie, delivered a little closer to your door.'}
                <br />Illustrative order · Place your order by phone.
              </p>

              <div className="receipt-actions">
                <a href="tel:5555550142">Call it in · 555-0142 <Phone size={14} /></a>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('pizza:build'))}
                >
                  Build another <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}