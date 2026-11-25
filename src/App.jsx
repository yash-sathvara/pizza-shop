import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ReceiptSection from './components/ReceiptSection';
import DeliverySection from './components/DeliverySection';
import ReviewsAndMenu from './components/ReviewsAndMenu';
import Footer from './components/Footer';
import { TOPPINGS } from './data/pizzaData';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
    const lenisRef = useRef(null);
    const [selectedToppings, setSelectedToppings] = useState({});
    const [status, setStatus] = useState('idle');
    const [resetKey, setResetKey] = useState(0);

    const totalPrice = 21 + TOPPINGS.reduce(
        (sum, item) => sum + (selectedToppings[item.id] ? item.price : 0),
        0,
    );

    const reset = useCallback(() => {
        setSelectedToppings({});
        setStatus('idle');
        setResetKey((value) => value + 1);
    }, []);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lenis = new Lenis({
            duration: reducedMotion ? 0 : 1.05,
            smoothWheel: !reducedMotion,
            autoRaf: false,
        });

        lenisRef.current = lenis;
        window.__lenis = lenis;
        lenis.on('scroll', ScrollTrigger.update);

        const tick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        const refresh = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(refresh);
        window.addEventListener('load', refresh);

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
            window.__lenis = null;
            window.removeEventListener('load', refresh);
        };
    }, []);

    const scrollToTop = () => {
        reset();
        lenisRef.current?.scrollTo(0, { duration: 1.5 });
    };

    return (
        <div className="app-shell">
            <a className="skip-link" href="#menu">Skip animation to menu</a>
            <Navbar />
            <main>
                <HeroSection
                    selectedToppings={selectedToppings}
                    setSelectedToppings={setSelectedToppings}
                    totalPrice={totalPrice}
                    status={status}
                    setStatus={setStatus}
                    onReset={reset}
                    resetKey={resetKey}
                />
                <ReceiptSection
                    selectedToppings={selectedToppings}
                    totalPrice={totalPrice}
                    status={status}
                />
                <DeliverySection />
                <ReviewsAndMenu />
            </main>
            <Footer onScrollToTop={scrollToTop} />
        </div>
    );
}
