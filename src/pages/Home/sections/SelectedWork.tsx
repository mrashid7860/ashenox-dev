'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { PROJECTS } from '@/data/projects.data';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';
import { usePageTransition } from '@/components/common/PageLoader';

const SELECTED_PROJECT_SLUGS = ['pc-secure', 'fitanaz', 'kao'];
const SELECTED_PROJECTS = PROJECTS.filter((project) => SELECTED_PROJECT_SLUGS.includes(project.slug));

type Project = (typeof PROJECTS)[number];

/* ─────────────────────────────────────────────
   Desktop / Tablet project card
───────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
  scrollYProgress,
  scrollDistance,
  screenWidth,
}: {
  project: Project;
  index: number;
  scrollYProgress: MotionValue<number>;
  scrollDistance: number;
  screenWidth: number;
}) {
  const isDiagonalCard = index > 0;

  // Match card width with the Tailwind breakpoints.
  const cardWidth = screenWidth >= 1536 ? screenWidth * 0.49 : screenWidth >= 1280 ? screenWidth * 0.55 : screenWidth >= 1024 ? screenWidth * 0.45 : screenWidth * 0.8;

  const headingWidth = screenWidth * 0.5;
  const cardX = headingWidth + index * cardWidth;

  // Calculate when the card reaches the viewport.
  const horizontalEnd = 0.72;
  const viewportTrigger = screenWidth * 0.9;
  const distanceToTrigger = cardX - viewportTrigger;

  const cardArrival = scrollDistance > 0 ? (distanceToTrigger / scrollDistance) * horizontalEnd : 0;

  // Keep the animation distance proportional across screen sizes.
  const animationDistance = screenWidth * 0.22;

  const animationProgress = scrollDistance > 0 ? (animationDistance / scrollDistance) * horizontalEnd : 0.05;

  const entryStart = Math.max(0, cardArrival - animationProgress);
  const entryEnd = Math.min(horizontalEnd, cardArrival + animationProgress);

  // Card entrance animation.
  const diagonalX = useTransform(scrollYProgress, [entryStart, entryEnd], isDiagonalCard ? ['-1vw', '0vw'] : ['0vw', '0vw']);

  const diagonalY = useTransform(scrollYProgress, [entryStart, entryEnd], isDiagonalCard ? ['85vh', '0vh'] : ['0vh', '0vh']);

  const diagonalScale = useTransform(scrollYProgress, [entryStart, entryEnd], isDiagonalCard ? [0.92, 1] : [1, 1]);

  const diagonalOpacity = useTransform(scrollYProgress, [entryStart, entryEnd], isDiagonalCard ? [0.35, 1] : [1, 1]);

  return (
    <div className="relative h-full flex-shrink-0 px-8 md:w-[80vw] lg:w-[45vw] xl:w-[55vw] 2xl:w-[49vw]">
      {/* Divider */}
      <div className="absolute left-0 top-0 h-full w-px bg-black/10" />

      {/* Card viewport */}
      <div className="relative ml-8 mr-8 mt-6 h-full overflow-hidden">
        <motion.article
          style={{
            x: diagonalX,
            y: diagonalY,
            scale: diagonalScale,
            opacity: diagonalOpacity,
            transformOrigin: 'center center',
          }}
          className="flex h-full w-full flex-col justify-center will-change-transform"
        >
          {/* Image */}
          <div className="group w-full overflow-hidden rounded-md">
            <img src={project.image} alt={project.title} className="block h-auto w-full object-contain transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Content */}
          <div className="mt-8 flex items-end justify-between gap-8">
            <div>
              <h2 className="text-[28px] font-light leading-none tracking-[-0.05em] text-[#4A4A4A]">{project.title}</h2>

              <p className="mt-4 w-[280px] max-w-xs text-[14px] leading-[1.2] text-neutral-500">{project.description}</p>
            </div>

            <AnimatedButton
              variant="animated"
              textColor="#4A4A4A"
              hoverTextColor="#000"
              borderColor="#4A4A4A"
              hoverBorderColor="#000"
              iconColor="#4A4A4A"
              icon="up-right"
              hoverIconColor="#000"
              charShift={52}
              charStagger={0.025}
              charDuration={0.75}
              widthClassName="w-[160px] sm:w-[160px] md:w-[160px] lg:w-[160px]"
              className="group flex shrink-0 items-center gap-3 font-mono uppercase"
            >
              EXPLORE PROJECT
            </AnimatedButton>
          </div>
        </motion.article>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mobile project card
───────────────────────────────────────────── */

function MobileProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.7,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full"
    >
      {/* Image */}
      <div className="group w-full overflow-hidden rounded-[5px]">
        <img
          src={project.image}
          alt={project.title}
          loading={index === 0 ? 'eager' : 'lazy'}
          className="block aspect-[1.46/1] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      {/* Content */}
      <div className="mt-[17px]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[27px] font-light leading-none tracking-[-0.05em] text-[#252525]">{project.title}</h3>

            <p className="mt-[9px] max-w-[310px] text-[13px] font-light leading-[1.35] tracking-[-0.01em] text-[#666]">{project.description}</p>
          </div>
        </div>

        {/* <button className="group mt-[22px] flex items-center gap-[12px] border-b border-black/60 pb-[7px] text-[9px] font-normal uppercase tracking-[0.2em] text-[#252525]">
          EXPLORE PROJECT
          <ArrowUpRight size={13} strokeWidth={1.2} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </button> */}

        <AnimatedButton
          variant="animated"
          textColor="#4A4A4A"
          hoverTextColor="#000"
          borderColor="#4A4A4A"
          hoverBorderColor="#000"
          iconColor="#4A4A4A"
          icon="up-right"
          hoverIconColor="#000"
          charShift={52}
          charStagger={0.025}
          charDuration={0.75}
          widthClassName="w-[160px] sm:w-[160px] md:w-[160px] lg:w-[160px]"
          className="group mt-[22px] flex shrink-0 items-center gap-3 font-mono uppercase"
        >
          EXPLORE PROJECT
        </AnimatedButton>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────
   Mobile discover → services transition
───────────────────────────────────────────── */

function MobileServicesTransition() {
  const transitionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: ['start start', 'end end'],
  });

  // Discover exits while services reveal behind it.
  const discoverY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-100%']);

  const discoverScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.985]);

  const servicesScale = useTransform(scrollYProgress, [0, 0.5], [0.985, 1]);

  const servicesBackground = useTransform(scrollYProgress, [0, 0.25, 0.5], ['#7b7b77', '#f5f5f5', '#ffffff']);
  const go = usePageTransition();
  return (
    <section ref={transitionRef} className="relative h-[200svh] w-full overflow-visible bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Services background */}
        <motion.div
          style={{
            scale: servicesScale,
            backgroundColor: servicesBackground,
          }}
          className="absolute inset-0 z-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden will-change-transform"
        >
          <p className="absolute top-[152px] text-[13px] font-medium uppercase text-black">OUR SERVICES</p>

          <div className="flex flex-col items-center leading-[0.68] tracking-[-0.31em] text-[#202020]">
            <h2 className="text-[16vw]">A.I.</h2>
            <h2 className="text-[16vw]">DESIGN</h2>
            <h2 className="text-[16vw] font-light">DEVELOPMENT</h2>
            <h2 className="text-[16vw] font-light">BRANDING</h2>
          </div>

          <p className="absolute bottom-[150px] text-[14px] font-normal uppercase tracking-[-0.01em] text-black">✦ DESIGN WITH INTENT. BUILT TO WORK.</p>

          <AnimatedButton
            onClick={() => go('/services', 'SERVICES')}
            variant="animated"
            textColor="#4A4A4A"
            hoverTextColor="#000"
            borderColor="#4A4A4A"
            hoverBorderColor="#000"
            iconColor="#4A4A4A"
            icon="up-right"
            hoverIconColor="#000"
            charShift={62}
            charStagger={0.025}
            charDuration={0.75}
            widthClassName="w-[155px]"
            className="group mx-auto mt-10 flex items-center gap-3 font-mono uppercase"
          >
            VIEW SERVICES
          </AnimatedButton>
        </motion.div>

        {/* Discover panel */}
        <motion.div
          style={{
            y: discoverY,
            scale: discoverScale,
          }}
          className="absolute inset-0 z-10 flex h-screen w-full items-center justify-center bg-[#f5f5f5] will-change-transform"
        >
          <div className="w-full max-w-[410px] px-7 text-center">
            <p className="text-[25px] leading-[1.05] tracking-[-0.045em] text-[#444]">Discover our complete collection of digital experiences, brands and platforms.</p>

            {/* <button className="group mx-auto mt-8 flex items-center gap-3 border-b border-black/40 pb-[7px] text-[16px] uppercase text-[#333]">
              <span>VIEW ALL PROJECTS</span>

              <ArrowRight size={12} strokeWidth={1.1} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button> */}

            <AnimatedButton
              onClick={() => go('/portfolio', 'WORK')}
              variant="animated"
              textColor="#4A4A4A"
              hoverTextColor="#000"
              borderColor="#4A4A4A"
              hoverBorderColor="#000"
              iconColor="#4A4A4A"
              icon="up-right"
              hoverIconColor="#000"
              charShift={58}
              charStagger={0.025}
              charDuration={0.75}
              widthClassName="w-[180px] sm:w-[180px] md:w-[180px] lg:w-[180px]"
              className="group mx-auto mt-10 flex items-center gap-3 font-mono uppercase"
            >
              VIEW ALL PROJECTS
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Main selected work section
───────────────────────────────────────────── */

export function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [scrollDistance, setScrollDistance] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(1000);
  const [screenWidth, setScreenWidth] = useState(0);

  // Calculate horizontal distance and section height.
  useLayoutEffect(() => {
    const calculate = () => {
      if (!trackRef.current) return;

      const width = window.innerWidth;

      setScreenWidth(width);

      if (width < 768) {
        setScrollDistance(0);
        setSectionHeight(0);
        return;
      }

      const distance = trackRef.current.scrollWidth - width;

      setScrollDistance(Math.max(0, distance));
      setSectionHeight(Math.max(1000, distance * 2.7 + window.innerHeight));
    };

    calculate();

    window.addEventListener('resize', calculate);

    return () => {
      window.removeEventListener('resize', calculate);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Move the project track horizontally.
  const horizontal = useTransform(scrollYProgress, [0, 0.72], [0, -scrollDistance]);

  // Slide the work section away at the end.
  const slideSection = useTransform(scrollYProgress, [0.72, 1], [0, -screenWidth]);

  // Fade out the work content.
  const workOpacity = useTransform(scrollYProgress, [0.92, 0.98], [1, 0]);

  // Reveal services.
  const servicesOpacity = useTransform(scrollYProgress, [0.72, 1], [0, 1]);

  const servicesScale = useTransform(scrollYProgress, [0.72, 1], [0.985, 1]);

  const servicesBg = useTransform(scrollYProgress, [0.92, 1], ['#7b7b77', '#ffffff']);
  const go = usePageTransition();
  return (
    <>
      {/* Mobile */}
      <section className="relative block bg-[#f5f5f5] md:hidden">
        <div className="relative px-[11px] pt-[70px]">
          {/* Heading */}
          <div className="mb-[62px] px-[1px] text-center">
            <h2 className="max-auto text-[32px] font-light leading-[0.9] tracking-[-0.065em] text-[#282828]">
              {/* Selected work
              <br />& explorations */}
              {createCharacterAnimation('Selected work')}
              <br />
              {createCharacterAnimation('& explorations')}
            </h2>
          </div>

          {/* Projects */}
          <div className="flex flex-col gap-[72px]">
            {SELECTED_PROJECTS.map((project, index) => (
              <MobileProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>

          <div className="h-[10px]" />
        </div>

        <MobileServicesTransition />
      </section>

      {/* Tablet / Desktop */}
      <section id="work" ref={sectionRef} className="relative hidden bg-[linear-gradient(0deg,#D2D2D2_0%,#FFFFFF_100%)] md:block" style={{ height: sectionHeight }}>
        <div className="px-7 md:translate-y-0 lg:translate-y-[0px]">
          {/* Tablet */}
          <div className="hidden translate-y-0 md:block lg:hidden">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.2}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="center"
              plusPosition="clamp(49.2%, calc(49% + (100vw - 900px) * 0.04), 52%)"
              plusSize={14}
              plusStrokeWidth={2.5}
              plusColor="#4A4A4A"
              plusOpacity={0.7}
              plusTop="3.2px"
              rotateFrom={0}
              rotateTo={360}
              scrollStart="start 98%"
              scrollEnd="start 60%"
            />
          </div>

          {/* Large desktop */}
          <div className="hidden translate-y-10 lg:block xl:hidden">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.2}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="center"
              plusPosition="clamp(49.5%, calc(49.5% + (100vw - 1280px) * 0.06), 50%)"
              plusSize={14}
              plusStrokeWidth={2.5}
              plusColor="#4A4A4A"
              plusOpacity={0.7}
              plusTop="3.2px"
              rotateFrom={0}
              rotateTo={360}
              scrollStart="start 77%"
              scrollEnd="start 20%"
            />
          </div>

          {/* XL */}
          <div className="hidden translate-y-0 xl:block 2xl:hidden">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.2}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="center"
              plusPosition="clamp(49.5%, calc(49.5% + (100vw - 1280px) * 0.06), 50%)"
              plusSize={14}
              plusStrokeWidth={2.5}
              plusColor="#4A4A4A"
              plusOpacity={0.7}
              plusTop="3.2px"
              rotateFrom={0}
              rotateTo={360}
              scrollStart="start 97%"
              scrollEnd="start 15%"
            />
          </div>

          {/* 2XL and above */}
          <div className="hidden translate-y-0 2xl:block">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.2}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="center"
              plusPosition="clamp(50%, calc(50% + (100vw - 1536px) * 0.035), 59%)"
              plusSize={14}
              plusStrokeWidth={2.5}
              plusColor="#4A4A4A"
              plusOpacity={0.7}
              plusTop="3.2px"
              rotateFrom={0}
              rotateTo={360}
              scrollStart="start 97%"
              scrollEnd="start 20%"
            />
          </div>
        </div>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Services background */}

          <motion.div
            style={{
              opacity: servicesOpacity,
              scale: servicesScale,
              backgroundColor: servicesBg,
            }}
            className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
          >
            <div className="relative flex h-full w-full flex-col items-center justify-center text-black">
              <p className="absolute top-[12%] text-[13px] font-bold uppercase tracking-[-0.05em]">OUR SERVICES</p>
              <div className="flex flex-col items-center leading-[0.74] md:leading-[0.8] md:tracking-[-0.6em] lg:leading-[0.74] lg:tracking-[-0.7em]">
                <h2 className="text-[12vw] lg:text-[8vw]">A.I.</h2>
                <h2 className="-mt-2 text-[12vw] lg:text-[8vw]">DESIGN</h2>
                <h2 className="-mt-3 text-[12vw] lg:text-[8vw]">DEVELOPMENT</h2>
                <h2 className="-mt-2 text-[12vw] lg:text-[8vw]">BRANDING</h2>
              </div>
              <p className="absolute bottom-9 text-[13px] font-bold tracking-[-0.01em] md:left-10 lg:left-auto xl:bottom-11 2xl:bottom-10">DESIGN WITH INTENT. BUILT TO WORK.</p>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-10 md:left-auto md:right-7 md:top-auto md:translate-x-0">
                <AnimatedButton
                  onClick={() => go('/services', 'SERVICES')}
                  variant="animated"
                  textColor="#4A4A4A"
                  hoverTextColor="#000"
                  borderColor="#4A4A4A"
                  hoverBorderColor="#000"
                  iconColor="#4A4A4A"
                  icon="up-right"
                  hoverIconColor="#000"
                  charShift={66}
                  charStagger={0.025}
                  charDuration={0.75}
                  widthClassName="w-[160px]"
                  className="group flex items-center gap-4 font-mono text-[10px] font-bold"
                >
                  VIEW SERVICES
                </AnimatedButton>
              </div>
            </div>
          </motion.div>

          {/* Work content */}
          <motion.div
            style={{
              x: slideSection,
              opacity: workOpacity,
            }}
            className="absolute inset-0 z-10 md:bg-[linear-gradient(0deg,#D2D2D2_0%,#FFFFFF_100%)]"
          >
            <motion.div
              ref={trackRef}
              style={{
                x: horizontal,
                opacity: workOpacity,
              }}
              className="flex h-full items-center will-change-transform md:pr-[30vw] lg:pr-[50vw]"
            >
              {/* Heading */}
              <div className="mt-10 flex h-full w-[42] flex-shrink-0 items-center justify-center md:w-[50vw]">
                <div className="w-full max-w-[520px] text-center">
                  <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                      amount: 0.4,
                    }}
                    className="font-light leading-[0.88] tracking-[-0.06em] text-[#4A4A4A] md:text-[6vw] lg:text-[5vw]"
                  >
                    {createCharacterAnimation('Selected work')}
                    <br />
                    {createCharacterAnimation('& explorations')}
                  </motion.h2>

                  <AnimatedButton
                    onClick={() => go('/portfolio', 'WORK')}
                    variant="animated"
                    textColor="#4A4A4A"
                    hoverTextColor="#000"
                    borderColor="#4A4A4A"
                    hoverBorderColor="#000"
                    iconColor="#4A4A4A"
                    icon="up-right"
                    hoverIconColor="#000"
                    charShift={58}
                    charStagger={0.025}
                    charDuration={0.75}
                    widthClassName="w-[180px] sm:w-[180px] md:w-[180px] lg:w-[180px]"
                    className="group mx-auto mt-14 flex items-center gap-3 font-mono uppercase"
                  >
                    VIEW ALL PROJECTS
                  </AnimatedButton>
                </div>
              </div>

              {/* Project cards */}
              {SELECTED_PROJECTS.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} scrollYProgress={scrollYProgress} scrollDistance={scrollDistance} screenWidth={screenWidth} />
              ))}

              {/* Final discover area */}
              <div className="px-15 flex h-screen w-full flex-shrink-0 items-center justify-center text-[#4C4C4C]">
                <div className="flex max-w-xl flex-col items-center text-center">
                  <h2 className="text-[2vw] font-light leading-tight md:mr-2 md:text-[3vw] lg:text-[2vw]">Discover our complete collection of digital experiences, brands and platforms.</h2>

                  <AnimatedButton
                    onClick={() => go('/portfolio', 'WORK')}
                    variant="animated"
                    textColor="#4A4A4A"
                    hoverTextColor="#000000"
                    borderColor="#4A4A4A"
                    hoverBorderColor="#000000"
                    iconColor="#4A4A4A"
                    hoverIconColor="#000000"
                    icon="up-right"
                    charShift={48}
                    charStagger={0.025}
                    charDuration={0.75}
                    widthClassName="w-[170px] sm:w-[170px] md:w-[170px] lg:w-[170px]"
                    className="mt-12 shrink-0 font-mono uppercase"
                  >
                    View All Projects
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
