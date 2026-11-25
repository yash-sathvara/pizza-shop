
const MARQUEE_ITEMS = [
  'HAND TOSSED',
  'SAN MARZANO D.O.P.',
  '72-HR SLOW FERMENT',
  '900°F OAK FIRE',
  'FIOR DI LATTE',
  'NEAPOLITAN TRADITION',
  'NO ROLLING PIN',
  'LITTLE ITALY NYC',
  'BAKED IN 90 SECONDS',
  'CUPPED PEPPERONI',
  'OAK FIRED HEARTH',
];

/**
 * Infinite scrolling text marquee strip.
 * @param {boolean} variant - 'fire' (orange bg) | 'dark' (dark bg) | 'cream' (cream bg)
 * @param {string}  speed   - 'normal' | 'slow'
 */
export default function MarqueeStrip({ variant = 'fire', speed = 'normal' }) {
  // Double the items array so the CSS animation loops seamlessly
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  const bgClass =
    variant === 'fire'
      ? 'bg-[#E84A27] border-[#C42A16]'
      : variant === 'cream'
        ? 'bg-[#F7F3EB] border-[#D9D3C8]'
        : 'bg-[#1A1210] border-white/10';

  const textClass =
    variant === 'fire'
      ? 'text-white'
      : variant === 'cream'
        ? 'text-[#120D0A]'
        : 'text-[#E84A27]';

  const dotClass =
    variant === 'fire'
      ? 'bg-white/50'
      : variant === 'cream'
        ? 'bg-[#120D0A]/30'
        : 'bg-[#E84A27]/50';

  const animClass = speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee';

  return (
    <div className={`w-full overflow-hidden border-y py-3.5 select-none ${bgClass}`}>
      <div
        className={`flex items-center gap-8 whitespace-nowrap ${animClass}`}
        style={{ width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8 shrink-0">
            <span
              className={`font-display text-sm sm:text-base tracking-[0.22em] uppercase ${textClass}`}
            >
              {item}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
          </span>
        ))}
      </div>
    </div>
  );
}

