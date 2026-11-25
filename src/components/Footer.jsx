import { ArrowUp, Flame, MapPin } from 'lucide-react';

export default function Footer({ onScrollToTop }) {
  const handleScrollTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full min-h-screen bg-[#0C0806] text-[#F7F3EB] relative flex flex-col justify-between py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">

      {/* Background ember glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] bg-gradient-to-tr from-[#E84A27]/10 via-[#E5A83B]/6 to-transparent rounded-full blur-[180px] pointer-events-none" />

      {/* ── Top Header Row ── */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-8 border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-wider text-[#F7F3EB]">HIGH</span>
          <span className="w-2 h-2 rounded-full bg-[#E84A27]" />
          <span className="font-display text-2xl tracking-wider text-[#F7F3EB]">TOSS</span>
        </div>
        <span className="text-[11px] font-mono tracking-widest text-[#F7F3EB]/50 uppercase hidden sm:inline">
          OPEN LATE · 11 AM — 2 AM
        </span>
      </div>

      {/* ── Giant Center CTA matching reference: "HUNGRY AGAIN?" ── */}
      <div className="my-auto py-12 max-w-5xl mx-auto w-full text-center z-10 flex flex-col items-center justify-center">

        {/* Massive Headline */}
        <h2 className="font-display text-7xl sm:text-9xl md:text-[11.5rem] lg:text-[13rem] leading-[0.82] uppercase tracking-tight text-[#F7F3EB] drop-shadow-[0_15px_45px_rgba(0,0,0,0.95)]">
          HUNGRY <br />
          <span className="text-[#E84A27]">AGAIN?</span>
        </h2>

        {/* Red Button: "Throw me another" matching reference */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-5">
          <button
            type="button"
            onClick={handleScrollTop}
            className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-[#E84A27] hover:bg-[#ff5733] text-white font-display text-2xl sm:text-3xl tracking-wider uppercase transition-all shadow-2xl shadow-[#E84A27]/35 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Flame className="w-6 h-6 text-amber-200 fill-amber-200 group-hover:rotate-12 transition-transform" />
            <span>Throw me another</span>
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Phone Section matching reference */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#F7F3EB]/50 uppercase mb-2">
            OR CALL THE COUNTER
          </span>
          <a
            href="tel:5555550142"
            className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold text-[#F7F3EB] hover:text-[#E84A27] transition-colors tracking-widest drop-shadow-md"
          >
            (555) 555-0142
          </a>
        </div>

      </div>

      {/* ── Bottom Metadata Bar ── */}
      <div className="max-w-7xl mx-auto w-full pt-8 border-t border-white/10 z-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[#F7F3EB]/50 font-mono">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#E84A27] shrink-0" />
          <span>412 Mulberry St, Little Italy, New York, NY 10012</span>
        </div>
        <div className="text-left md:text-center">
          <span>TUE–SUN: 12PM–11PM • COURIER RADIUS 5 MILES</span>
        </div>
        <div className="text-left md:text-right">
          <span>© {new Date().getFullYear()} HIGH TOSS ARTISAN PIZZA CO.</span>
        </div>
      </div>

    </footer>
  );
}
