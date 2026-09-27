import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { getLenis, setLenisInstance } from '@/utils/lenis';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 3.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    setLenisInstance(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const lenis = getLenis();

      if (lenis) {
        lenis.scrollTo(0, {
          immediate: true,
        });
      } else {
        window.scrollTo(0, 0);
      }

      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);
}
