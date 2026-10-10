'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { Fingerprint, PenTool, Clapperboard, MonitorSmartphone, Camera, Megaphone } from 'lucide-react';
import { useRef, useLayoutEffect, useState } from 'react';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';

/* ============================================================
   IMPORT YOUR ASSETS
============================================================ */

import homeServiceVideo from '@/assets/video/homepage-services-video.mp4';
import stoneImage from '@/assets/img/ashenox_stone.png';

/* ============================================================
   SERVICES
============================================================ */

const SERVICES = [
  {
    icon: Fingerprint,
    title: 'Brand & Identity',
    desc: 'Distinctive visual identities built to make brands recognizable, memorable, and consistent.',
  },
  {
    icon: PenTool,
    title: 'Graphic Design',
    desc: 'Purposeful visuals for campaigns, social media, marketing, and digital brand communication.',
  },
  {
    icon: Clapperboard,
    title: 'Video & Motion',
    desc: 'Cinematic video, motion graphics, and creative content designed to capture attention.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Web Design & Development',
    desc: 'Modern, responsive websites crafted for strong experiences, performance, and growth.',
  },
  {
    icon: Camera,
    title: 'UGC & Model Content',
    desc: 'Authentic creator-led and model-driven content designed to showcase products, tell stories, and connect with audiences.',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    desc: 'Creative digital strategies and content designed to build visibility, engagement, and brand growth.',
  },
];

/* ============================================================
   DESKTOP ANIMATION SETTINGS
============================================================ */

const SEG = 0.4;
const STAGGER = 0.19;

const pairRange = (i: number) => {
  const s = i * STAGGER;

  return [s, s + SEG * 0.45, s + SEG * 0.65, s + SEG * 0.85, s + SEG];
};

const COL_CENTER_VW = 24;

type Side = 'left' | 'right';

/* ============================================================
   SERVICES VISUAL
============================================================ */

function ServicesVisual({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? 'pointer-events-none absolute left-0 right-0 top-0 z-0 h-[100svh] overflow-hidden' : 'pointer-events-none absolute inset-0 z-0 overflow-hidden'}>
      {/* ======================================================
          WHITE OVERLAY
      ====================================================== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[25] bg-white opacity-0" />
      {/* ======================================================
          OUR SERVICES
          ONE TAG + TOP SPACING
      ====================================================== */}
      <div
        data-services-copy="true"
        className="absolute left-1/2 top-[90px] z-[20] -translate-x-1/2"
        style={{
          mixBlendMode: 'difference',
        }}
      >
        <h2 className="mt-6 whitespace-nowrap text-center text-[14px] leading-none tracking-normal text-white md:mt-24 md:text-[14px] lg:mt-0 lg:text-[14px]">
          {createCharacterAnimation('OUR SERVICES')}
        </h2>
      </div>
      {/* ======================================================
          CENTER STONE
      ====================================================== */}

      <img
        src={stoneImage}
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-[1] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 select-none object-contain md:h-[500px] md:w-[500px] xl:h-[550px] xl:w-[550px] 2xl:h-[550px] 2xl:w-[500px]"
      />
      {/* ======================================================
          VIDEO
      ====================================================== */}
      <video
        src={homeServiceVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 z-[5] h-full w-full object-cover mix-blend-screen"
        style={{
          opacity: 0.5,
          transform: 'rotate(180deg) translateZ(0px)',
          willChange: 'opacity, transform',
        }}
      />
      <div data-services-copy="true" className="absolute inset-x-0 top-[calc(100dvh-60px)] z-[20] whitespace-nowrap md:bottom-auto md:top-[610px]" style={{ mixBlendMode: 'difference' }}>
        <h2 className="text-center text-[14px] font-light uppercase leading-none tracking-[-0.02em] md:mt-[250px] xl:mt-[calc(30px_-_((100vw_-_1580px)_/_8))] 2xl:mt-0">
          Different disciplines. One standard of craft.
        </h2>
      </div>
    </div>
  );
}

/* ============================================================
   DESKTOP CARD MOTION
============================================================ */

function useCardMotion(scrollYProgress: MotionValue<number>, pairIndex: number, side: Side) {
  const range = pairRange(pairIndex);

  const targetVw = side === 'right' ? COL_CENTER_VW : -COL_CENTER_VW;

  const xValues =
    side === 'right' ? ['55vw', `${targetVw + 4}vw`, `${targetVw}vw`, `${targetVw}vw`, `${targetVw}vw`] : ['-55vw', `${targetVw - 4}vw`, `${targetVw}vw`, `${targetVw}vw`, `${targetVw}vw`];

  const x = useTransform(scrollYProgress, range, xValues);

  const yValues = side === 'right' ? ['-80vh', '-15vh', '0vh', '30vh', '60vh'] : ['80vh', '15vh', '0vh', '-30vh', '-60vh'];

  const y = useTransform(scrollYProgress, range, yValues);

  const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 0.6, 0]);

  return {
    x,
    y,
    opacity,
  };
}

/* ============================================================
   DESKTOP SERVICE CARD
============================================================ */

function ServiceCard({ scrollYProgress, pairIndex, side, service }: { scrollYProgress: MotionValue<number>; pairIndex: number; side: Side; service: (typeof SERVICES)[number] }) {
  const { x, y, opacity } = useCardMotion(scrollYProgress, pairIndex, side);

  const Icon = service.icon;

  return (
    <motion.div
      style={{
        x,
        y,
        opacity,
      }}
      className="absolute left-1/2 top-1/2 z-10 -ml-[190px] -mt-[120px]"
    >
      <motion.div className="group relative w-[380px] overflow-hidden rounded-[10px] border border-black/10 bg-black/[0.4] p-7 shadow-[0_20px_80px_rgba(0,0,0,.45)]">
        {/* =====================================================
            TOP ROW — TITLE LEFT / ICON RIGHT
        ===================================================== */}

        <div className="flex w-full items-center justify-between">
          {/* Title */}
          <h3 className="w-20 text-[26px] leading-none tracking-[-0.01em] text-white md:w-40">{service.title}</h3>

          {/* Icon */}
          <motion.div
            whileHover={{
              rotate: 12,
              scale: 1.1,
            }}
            transition={{
              duration: 0.3,
            }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
          >
            <Icon className="h-7 w-7 text-white" strokeWidth={1.7} />
          </motion.div>
        </div>

        {/* =====================================================
            DESCRIPTION
        ===================================================== */}

        <p className="mt-16 w-[260px] text-[15px] leading-4 tracking-[-0.04em] text-neutral-300">{service.desc}</p>
      </motion.div>
    </motion.div>
  );
}
/* ============================================================
   MOBILE SERVICE CARD
============================================================ */

function MobileServiceCard({ service, index }: { service: (typeof SERVICES)[number]; index: number }) {
  const Icon = service.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.65,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative w-full overflow-hidden rounded-[10px] border border-black/10 bg-black/[0.4] p-6 shadow-[0_15px_50px_rgba(0,0,0,.25)] backdrop-blur-[5px]"
    >
      <div className="flex w-full items-center justify-between">
        <h3 className="w-40 text-[26px] leading-none tracking-[-0.01em] text-white md:w-20">{service.title}</h3>

        <motion.div
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
        >
          <Icon className="h-7 w-7 text-white" strokeWidth={1.7} />
        </motion.div>
      </div>

      <p className="mt-16 w-[260px] text-[15px] leading-4 tracking-[-0.04em] text-neutral-300">{service.desc}</p>
    </motion.article>
  );
}

/* ============================================================
   MOBILE SERVICES
============================================================ */

function MobileServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  const [scrollDistance, setScrollDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!cardsWrapperRef.current) return;

      // Match the actual visible viewport.
      const viewportHeight = window.innerHeight;
      const cardsHeight = cardsWrapperRef.current.scrollHeight;

      const reservedSpace = 250;
      const availableForCards = viewportHeight - reservedSpace;

      const distance = Math.max(cardsHeight - availableForCards, 0);

      setScrollDistance(distance);
    };

    measure();

    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <section
      ref={sectionRef}
      id="services-mobile"
      className="relative block w-full md:hidden"
      style={{
        height: `calc(100dvh + ${scrollDistance}px)`,
      }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden px-[15px] py-[20px]">
        <ServicesVisual mobile />

        <div className="relative z-10 flex h-full flex-col">
          {/* Header */}
          <div className="mb-[55px] text-center">
            <h2 className="mx-auto mt-10 max-w-[330px] text-[42px] font-light leading-[0.9] tracking-[-0.07em] text-white">What we do.</h2>
          </div>

          {/* Animated cards */}
          <motion.div ref={cardsWrapperRef} style={{ y }} className="flex flex-col gap-16">
            {SERVICES.map((service, index) => (
              <MobileServiceCard key={service.title} service={service} index={index} />
            ))}
          </motion.div>

          {/* Bottom text */}
          <div className="top-[calc(100dvh-120px)] mt-auto">
            <p className="text-center text-[8px] uppercase tracking-[0.08em] text-white/45">✦ DESIGN WITH INTENT. BUILT TO WORK.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DESKTOP SERVICES
============================================================ */

function DesktopServices() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 28,
    mass: 1,
  });

  const pairs: [number, number][] = [
    [0, 1],
    [2, 3],
    [4, 5],
  ];

  return (
    <section ref={ref} id="services" className="relative hidden h-[400vh] md:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ==================================================
            SERVICES VISUAL
        ================================================== */}

        <ServicesVisual />

        {/* ==================================================
            DESKTOP SERVICE CARDS
        ================================================== */}

        {pairs.map(([leftIdx, rightIdx], i) => (
          <div key={i}>
            <ServiceCard scrollYProgress={smoothProgress} pairIndex={i} side="right" service={SERVICES[rightIdx]} />

            <ServiceCard scrollYProgress={smoothProgress} pairIndex={i} side="left" service={SERVICES[leftIdx]} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   MAIN SERVICES COMPONENT
============================================================ */

export function Services() {
  return (
    <>
      {/* MOBILE */}

      <MobileServices />

      {/* TABLET + DESKTOP */}

      <DesktopServices />
    </>
  );
}
