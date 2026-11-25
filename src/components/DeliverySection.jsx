import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import deliveryNightBg from '../assets/images/delivery-night-bg.jpg';
import chefScooter from '../assets/images/chef-scooter.png';

gsap.registerPlugin(ScrollTrigger);

export default function DeliverySection() {
  const containerRef = useRef(null);
  const scooterTrackRef = useRef(null);
  const scooterRef = useRef(null);
  const timelineProgressRef = useRef(null);
  const [eta, setEta] = useState(14);
  const [activeStepIndex, setActiveStepIndex] = useState(1);

  const STEPS = [
    { label: 'Fired', time: '4:19 PM' },
    { label: 'Boxed', time: '4:22 PM' },
    { label: 'On the move', time: '4:24 PM' },
    { label: 'At your door', time: '4:31 PM' },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const updateScooterPosition = (p) => {
        if (!scooterRef.current || !scooterTrackRef.current) return;
        const edgePad = window.innerWidth < 700 ? 8 : 24;
        const maxX = Math.max(0, scooterTrackRef.current.clientWidth - scooterRef.current.offsetWidth - edgePad * 2);
        gsap.set(scooterRef.current, { x: edgePad + p * maxX });
      };

      updateScooterPosition(0);

      // 1. Scooter driving across road with ScrollTrigger
      gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Scooter drives cleanly from left edge to right edge of the full road
            updateScooterPosition(p);

            // Timeline bar width
            if (timelineProgressRef.current) {
              timelineProgressRef.current.style.width = `${Math.min(100, Math.max(5, p * 100))}%`;
            }

            // Milestone active step calculation
            if (p < 0.25) {
              setActiveStepIndex(0);
              setEta(14);
            } else if (p < 0.55) {
              setActiveStepIndex(1);
              setEta(11);
            } else if (p < 0.85) {
              setActiveStepIndex(2);
              setEta(7);
            } else {
              setActiveStepIndex(3);
              setEta(2);
            }
          },
        },
      });

      // 2. Subtle continuous engine vibration/bobbing
      gsap.to(scooterRef.current, {
        y: -4,
        duration: 0.26,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="delivery"
      className="relative w-full h-screen bg-[#0D0A09] text-[#F7F3EB] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ── Background Night Skyline Image ── */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={deliveryNightBg}
          alt="Night City Skyline"
          className="w-full h-full object-cover object-bottom filter brightness-[0.88] contrast-[1.08]"
        />
        {/* Subtle dark vignette overlay for typography legibility */}
        <div className="delivery-bg-shade absolute inset-0 bg-gradient-to-b from-[#0D0A09]/85 via-transparent to-[#0D0A09]/50 pointer-events-none" />
      </div>

      {/* ── Top Header & Live Tracker ETA ── */}
      <div className="relative z-10 pt-24 sm:pt-28 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          {/* Tag */}
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#F7F3EB]/65 uppercase block mb-2 font-semibold">
            THE LAST MILE · SCROLL TO RIDE
          </span>

          {/* Headline: OR WE RIDE. */}
          <h2 className="font-display text-6xl sm:text-8xl md:text-9xl uppercase tracking-tight text-[#F7F3EB] leading-none">
            OR WE <span className="text-[#E84A27]">RIDE.</span>
          </h2>
        </div>

        {/* ETA Badge matching reference: "ETA 7 MIN" */}
        <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-black/80 border border-[#E84A27]/40 backdrop-blur-md shadow-2xl self-start sm:self-auto">
          <span className="text-[11px] font-mono tracking-widest text-[#F7F3EB]/60 uppercase">
            DEMO ETA
          </span>
          <span className="font-mono text-3xl font-bold text-[#E84A27]">
            {eta}
          </span>
          <span className="text-[11px] font-mono tracking-widest text-[#F7F3EB]/60 uppercase">
            MIN
          </span>
        </div>
      </div>

      {/* ── Center Road & 3D Scooter Scene ── */}
      <div className="relative z-10 w-full mt-auto mb-10 sm:mb-14">

        {/* Animated Scooter Riding on Road */}
        <div ref={scooterTrackRef} className="w-full relative h-32 sm:h-44">
          <div
            ref={scooterRef}
            className="delivery-scooter absolute bottom-2 sm:bottom-4 left-0 w-52 sm:w-68 md:w-80 pointer-events-none z-30 transition-none"
          >
            <img
              src={chefScooter}
              alt="Pizza Delivery Scooter"
              className="w-full h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>

        {/* Road Surface with Dashed Centerlines */}
        <div className="w-full h-10 bg-[#161210] border-t-2 border-[#E84A27]/50 relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[3px] flex justify-between gap-5 px-4 overflow-hidden">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="w-8 h-full bg-[#E5A83B]/60 shrink-0" />
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom Timeline Strip matching reference ── */}
      <div className="relative z-10 w-full pb-10 sm:pb-14 px-4 sm:px-8 max-w-5xl mx-auto">

        {/* Progress Line */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
          <div
            ref={timelineProgressRef}
            className="h-full bg-[#E84A27] rounded-full transition-all duration-100"
            style={{ width: '25%' }}
          />
        </div>

        {/* 4 Milestones */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {STEPS.map((step, idx) => {
            const isCompleted = idx <= activeStepIndex;
            const isCurrent = idx === activeStepIndex;

            return (
              <div
                key={step.label}
                className={`flex flex-col items-center transition-all duration-300 ${isCompleted ? 'opacity-100' : 'opacity-40'
                  }`}
              >
                {/* Dot */}
                <div
                  className={`w-3 h-3 rounded-full mb-2 transition-all duration-300 ${isCurrent
                      ? 'bg-[#E84A27] ring-4 ring-[#E84A27]/30 scale-125'
                      : isCompleted
                        ? 'bg-emerald-400'
                        : 'bg-white/30'
                    }`}
                />

                {/* Label */}
                <span
                  className={`text-xs sm:text-sm font-mono font-bold uppercase tracking-wider block ${isCurrent ? 'text-[#E84A27]' : 'text-[#F7F3EB]'
                    }`}
                >
                  {step.label}
                </span>

                {/* Time */}
                <span className="text-[10px] sm:text-xs font-mono text-[#F7F3EB]/60 mt-0.5">
                  {step.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
