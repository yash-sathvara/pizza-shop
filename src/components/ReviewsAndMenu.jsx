import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import review1 from '../assets/images/review-pizza-1.jpg';
import review2 from '../assets/images/review-pizza-2.jpg';
import review3 from '../assets/images/review-pizza-3.jpg';
import review4 from '../assets/images/review-pizza-4.jpg';
import review5 from '../assets/images/review-pizza-5.jpg';

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  { name: 'Marisol T.', text: 'Folded it, dripped on my shoes, zero regrets. A proper New York slice.', image: review5 },
  { name: 'Chris L.', text: 'Cup-and-char pepperoni. Perfect every single time.', image: review2 },
  { name: 'Vasilis P.', text: 'Watched them throw my dough. Dinner and a show.', image: review1 },
  { name: 'Priya K.', text: 'You can feel the oven heat from the register. Smells heavenly.', image: review3 },
  { name: 'Liam M.', text: 'Air bubbles in this crust defy physics. My new late-night spot.', image: review4 },
];

const menu = [
  ['01', 'CHEESE', 'The one that started it all.', '$3.50', '$21'],
  ['02', 'PEPPERONI', 'Crispy cups. Just enough heat.', '$4.25', '$24'],
  ['03', 'FRESH MOZZ & BASIL', 'Simple things, done properly.', '$4.50', '$26'],
  ['04', 'HOT ONE', 'Pepperoni. Chili. No apologies.', '$4.25', '$25'],
];

export default function ReviewsAndMenu() {
  const root = useRef(null);
  const reviewsSectionRef = useRef(null);
  const fan = useRef(null);
  const touchStart = useRef(null);
  const dragged = useRef(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.from('.review-fan', {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      });

      if (!reduceMotion && reviewsSectionRef.current) {
        gsap.timeline({
          scrollTrigger: {
            id: 'reviews-spin',
            trigger: reviewsSectionRef.current,
            start: 'top top',
            end: '+=240%',
            pin: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = Math.min(reviews.length - 1, Math.floor(self.progress * reviews.length));
              setActive((prev) => (prev === next ? prev : next));
            },
          },
        });
      }

      gsap.from('.menu-row', {
        y: 25,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        scrollTrigger: { trigger: '.menu-board', start: 'top 85%' },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const goToReview = (targetIndex) => {
    const clamped = (targetIndex + reviews.length) % reviews.length;
    setActive(clamped);

    const st = ScrollTrigger.getById('reviews-spin');
    if (st) {
      const targetProgress = (clamped + 0.5) / reviews.length;
      const targetY = st.start + (st.end - st.start) * targetProgress;
      if (window.__lenis) {
        window.__lenis.scrollTo(targetY, { duration: 0.7 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  const move = (delta) => goToReview(active + delta);

  return (
    <div ref={root}>
      <section id="reviews" ref={reviewsSectionRef} className="reviews-section">
        <p className="eyebrow">GOOD PIZZA. BETTER COMPANY.</p>
        <div
          className="review-fan"
          ref={fan}
          onPointerDown={(e) => {
            touchStart.current = e.clientX;
            dragged.current = false;
          }}
          onPointerUp={(e) => {
            if (touchStart.current !== null && Math.abs(e.clientX - touchStart.current) > 35) {
              dragged.current = true;
              move(e.clientX > touchStart.current ? -1 : 1);
            }
            touchStart.current = null;
          }}
          onPointerCancel={() => {
            touchStart.current = null;
          }}
        >
          {reviews.map((review, i) => {
            let offset = (i - active + 5) % 5;
            if (offset > 2) offset -= 5;
            return (
              <button
                type="button"
                className={`review-card ${offset === 0 ? 'active' : ''}`}
                key={review.name}
                onClick={() => {
                  if (!dragged.current) goToReview(i);
                }}
                style={{ '--offset': offset, '--abs': Math.abs(offset) }}
                aria-label={`Review by ${review.name}`}
                aria-pressed={offset === 0}
              >
                <img src={review.image} alt="Freshly baked pizza" loading="lazy" draggable="false" />
                <div className="review-card-copy">
                  <span className="review-stars">★★★★★</span>
                  <p>“{review.text}”</p>
                  <strong>{review.name}</strong>
                  <small>Pizza enthusiast</small>
                </div>
              </button>
            );
          })}
          <div className="review-score">
            <strong>4.9</strong>
            <span>★★★★★</span>
            <p>Made with love. Loved by the neighborhood.</p>
          </div>
        </div>
        <div className="review-controls">
          <span>SCROLL TO SPIN · {active + 1} / 5</span>
        </div>
      </section>

      <section id="menu" className="menu-section">
        <p className="eyebrow">THE USUALS. NEVER ORDINARY.</p>
        <h2>BY THE SLICE.<br /><em>OR THE WHOLE THING.</em></h2>
        <div className="menu-board">
          <div className="menu-board-head">
            <span>STRAIGHT FROM THE OVEN</span>
            <span>SLICE / PIE</span>
          </div>
          {menu.map(([num, name, description, slice, pie]) => (
            <div className="menu-row" key={num}>
              <span className="menu-num">{num}</span>
              <div>
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
              <span>{slice}<small>{pie}</small></span>
            </div>
          ))}
          <button className="menu-cta" onClick={() => window.dispatchEvent(new Event('pizza:build'))}>
            GOOD TASTE? MAKE IT YOUR OWN. <ArrowUpRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
