'use client';

import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { createCharacterAnimation } from '@/components/animations/CharAnimation';

import { KEY_FACTS, KEY_FACT_CONTENT, MEDIA, PARTNERS } from '@/data/keyFacts.data';

// ============================================================
// ANIMATION
// ============================================================

const SECTION_OFFSET_START = 'start 60%';
const SECTION_OFFSET_END = 'end 35%';

const HEADING_END = 0.12;

// Desktop / Tablet hinge
const CARD_START = 0.08;
const CARD_DURATION = 0.24;
const DESKTOP_CARD_STAGGER = 0.055;

// Mobile horizontal scroll
const MOBILE_SCROLL_START = 0.16;
const MOBILE_SCROLL_END = 0.82;
const MOBILE_SCROLL_X = '-166vw';

const PARTNER_MARQUEE_DURATION = 18;

// ============================================================
// TYPES
// ============================================================

type KeyFact = (typeof KEY_FACTS)[number];

type KeyFactNumberProps = {
  number: string;
  suffix: string;
  color?: string;
};

// ============================================================
// MOBILE DETECTION
// ============================================================

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const update = () => {
      setIsMobile(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
}

// ============================================================
// NUMBER
// ============================================================

function KeyFactNumber({ number, suffix, color = 'text-white' }: KeyFactNumberProps) {
  return (
    <div className={`flex items-start tabular-nums ${color}`}>
      <span className="text-[40px] font-normal leading-none tracking-[-0.07em] md:text-[48px] lg:text-[50px] xl:text-[52px]">{number}</span>

      <span className="ml-1 text-[28px] tracking-[-0.06em] md:text-[32px] lg:text-[34px]">{suffix}</span>
    </div>
  );
}

// ============================================================
// CARD WRAPPER
// ============================================================

function CardWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg ${className}`}
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// AWARDS CARD
// ============================================================

function AwardsCard() {
  const content = KEY_FACT_CONTENT.awards;

  return (
    <CardWrapper className="h-[350px] bg-black text-white md:h-[365px] lg:h-[365px]">
      <img src={MEDIA.left} alt="" className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-8 lg:p-8">
        <span className="block text-[13px] uppercase tracking-[-0.02em] text-white/90 md:text-[14px]">{content.label}</span>

        <div>
          <div className="flex items-end justify-between gap-5">
            <p className="max-w-[68%] text-[13px] leading-[1.25] text-white/80 md:text-[14px] lg:max-w-[65%]">{content.description}</p>

            <KeyFactNumber number={content.number} suffix={content.suffix} />
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

// ============================================================
// PROJECTS CARD
// ============================================================

function ProjectsCard() {
  const content = KEY_FACT_CONTENT.projects;

  return (
    <CardWrapper className="h-[350px] bg-[#e7e5e3] p-4 text-center text-[#343434] md:h-[365px] md:p-8 lg:p-8">
      <div className="flex h-full flex-col justify-between">
        <span className="block text-[13px] uppercase tracking-[-0.02em] md:text-[14px]">{content.label}</span>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white md:h-[175px] md:w-[175px] lg:h-[182px] lg:w-[182px]" />

          <div className="relative z-10">
            <KeyFactNumber number={content.number} suffix={content.suffix} color="text-[#343434]" />
          </div>
        </div>

        <p className="text-center text-[13px] leading-[1.35] text-[#343434]/70 md:text-[14px]">
          {content.description.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </CardWrapper>
  );
}

// ============================================================
// TEAM CARD
// ============================================================

function TeamCard() {
  const content = KEY_FACT_CONTENT.team;

  return (
    <CardWrapper className="h-[350px] bg-[#2f3135] text-white md:h-[365px]">
      <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-8 lg:p-8">
        <span className="block text-right text-[13px] uppercase tracking-[-0.02em] md:text-[14px]">{content.label}</span>

        <div className="flex flex-1 items-center overflow-hidden rounded-sm py-5 md:py-8">
          <img src={MEDIA.right} alt="" className="h-full w-full rounded-sm object-cover object-top" />
        </div>

        <div className="flex items-end justify-between">
          <KeyFactNumber number={content.number} suffix={content.suffix} />

          <p className="text-right text-[13px] leading-[1.3] text-white/60 md:text-[14px]">
            {content.description.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </CardWrapper>
  );
}

// ============================================================
// DESKTOP / TABLET — ACTUAL HINGE CARD
// ============================================================

function DesktopCard({ fact, index, progress }: { fact: KeyFact; index: number; progress: MotionValue<number> }) {
  /*
    Each card behaves like a physical flap.

    CLOSED
      rotateX = -90deg

    OPEN
      rotateX = 0deg

    The top edge is the hinge:
      transformOrigin = 50% 0%

    Card 1 opens first,
    then Card 2,
    then Card 3.
  */

  const start = CARD_START + index * DESKTOP_CARD_STAGGER;
  const end = start + CARD_DURATION;

  // ----------------------------------------------------------
  // HINGE ROTATION
  // ----------------------------------------------------------

  const rotateX = useTransform(progress, [start, end], [-90, 0]);

  // ----------------------------------------------------------
  // SMALL PHYSICAL MOVEMENT
  // ----------------------------------------------------------

  const y = useTransform(progress, [start, end], [-8, 0]);

  // ----------------------------------------------------------
  // SMALL SCALE POP
  // ----------------------------------------------------------

  const scale = useTransform(progress, [start, start + CARD_DURATION * 0.45, end], [0.985, 1.01, 1]);

  // ----------------------------------------------------------
  // OPACITY
  // ----------------------------------------------------------

  const midpoint = start + CARD_DURATION * 0.5;

  const opacity = useTransform(progress, [start, midpoint, end], [0, 0.45, 1]);

  return (
    <motion.div
      className="relative w-[330px] shrink-0 lg:mt-10 lg:w-[calc((100%-120px)/3)]"
      style={{
        rotateX,
        y,
        scale,
        opacity,
        transformOrigin: '50% 0%',
        transformStyle: 'preserve-3d',
        zIndex: 10 - index,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {fact.type === 'awards' && <AwardsCard />}

      {fact.type === 'projects' && <ProjectsCard />}

      {fact.type === 'team' && <TeamCard />}
    </motion.div>
  );
}

// ============================================================
// MOBILE CARD
// ============================================================

function MobileCard({ fact }: { fact: KeyFact }) {
  return (
    <div className="mt-5 min-h-full w-[76vw] shrink-0 sm:w-[76vw]">
      {fact.type === 'awards' && <AwardsCard />}

      {fact.type === 'projects' && <ProjectsCard />}

      {fact.type === 'team' && <TeamCard />}
    </div>
  );
}

// ============================================================
// PARTNER LOGO
// ============================================================

function PartnerLogo({ logo, index, mobile = false }: { logo: string; index: number; mobile?: boolean }) {
  const desktopWidths = ['w-[5rem]', 'w-[6rem]', 'w-[7.5rem]', 'w-[7rem]', 'w-[4.5rem]'];

  const mobileWidths = ['w-[4.5rem]', 'w-[5.75rem]', 'w-[5.5rem]', 'w-[5.75rem]', 'w-[4rem]'];

  const widthClass = mobile ? mobileWidths[index] : desktopWidths[index];

  return (
    <div className={mobile ? 'flex items-center justify-center border-r border-black/15 px-6' : 'flex items-center justify-center border-r border-black/15 px-6 last:border-r-0 lg:px-8'}>
      <img src={logo} alt={`Partner ${index + 1}`} loading="lazy" width={108} height={50} className={`h-auto object-contain ${widthClass}`} />
    </div>
  );
}

// ============================================================
// PARTNERS
// ============================================================

function PartnersBlock() {
  const content = KEY_FACT_CONTENT.partners;

  return (
    <div className="lg:mt-30 mt-10 flex flex-col gap-7 md:gap-7">
      {/* Heading */}

      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.4,
        }}
        className="mt-2 block text-center text-[13px] uppercase text-black"
      >
        {createCharacterAnimation(content.title)}
      </motion.span>

      {/* Desktop */}

      <div className="-mx-4 hidden justify-center lg:-mx-10 lg:flex">
        {PARTNERS.map((logo, index) => (
          <PartnerLogo key={`desktop-${index}`} logo={logo} index={index} />
        ))}
      </div>

      {/* Tablet */}

      <div className="hidden justify-center md:flex lg:hidden">
        {PARTNERS.map((logo, index) => (
          <PartnerLogo key={`tablet-${index}`} logo={logo} index={index} />
        ))}
      </div>

      {/* Mobile */}

      <div className="relative -mx-10 block w-auto overflow-hidden md:hidden">
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: PARTNER_MARQUEE_DURATION,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {[0, 1].map((set) => (
            <div key={set} className="shrink-0">
              <div className="flex flex-nowrap">
                {PARTNERS.map((logo, index) => (
                  <PartnerLogo key={`${set}-${index}`} logo={logo} index={index} mobile />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================

export function KeyFacts() {
  const sectionRef = useRef<HTMLElement>(null);

  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,

    /*
      MOBILE:
      Keep the original mobile scroll behavior.

      TABLET + DESKTOP:
      Use the same viewport-based progress model
      required for the hinge animation.
    */
    offset: isMobile ? ['start start', 'end end'] : [SECTION_OFFSET_START, SECTION_OFFSET_END],
  });

  // ==========================================================
  // HEADING
  // ==========================================================

  const headingOpacity = useTransform(scrollYProgress, [0, 0.05, HEADING_END], [0, 0, 1]);

  const headingY = useTransform(scrollYProgress, [0, HEADING_END], [0, 0]);

  // ==========================================================
  // INTRO
  // ==========================================================

  const introOpacity = useTransform(scrollYProgress, [0.03, 0.12], [0, 1]);

  const introY = useTransform(scrollYProgress, [0.03, 0.12], [12, 0]);

  // ==========================================================
  // MOBILE HORIZONTAL SCROLL
  //
  // UNCHANGED
  // ==========================================================

  const mobileX = useTransform(scrollYProgress, [MOBILE_SCROLL_START, MOBILE_SCROLL_END], ['0vw', MOBILE_SCROLL_X]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-visible bg-[linear-gradient(180deg,#D2D2D2_0%,#FFFFFF_100%)] max-md:h-[200svh] md:min-h-[115svh] lg:min-h-0">
      {/* ======================================================
          DESKTOP / TABLET / MOBILE
      ====================================================== */}

      <div className="hscreen sticky top-0 w-full overflow-hidden md:static md:h-auto">
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center md:min-h-0 md:justify-start">
          {/* ==================================================
              TITLE
          ================================================== */}

          <div className="relative z-20 w-full flex-shrink-0 px-6 pt-[calc(9dvh)] text-center md:mb-10 md:pt-[12vh] lg:mb-8 lg:pt-[10vh]">
            <motion.h2
              style={{
                y: headingY,
              }}
              className="text-[clamp(1.9rem,6.5vw,6rem)] font-normal leading-[1.2] tracking-[-0.03em] text-[#343434] lg:text-[clamp(3rem,7vw,4.2rem)] lg:leading-[0.88] lg:tracking-[-0.065em]"
            >
              {createCharacterAnimation(KEY_FACT_CONTENT.intro.title)}
            </motion.h2>

            <motion.p
              style={{
                y: headingY,
              }}
              className="mx-auto mt-3 max-w-[150px] text-sm leading-[1.2] tracking-[-0.01em] text-[#000]/65 md:max-w-[210px] lg:text-[13px] lg:leading-[1.25]"
            >
              <span className="block">{KEY_FACT_CONTENT.intro.description}</span>
            </motion.p>
          </div>

          {/* ==================================================
              MOBILE

              ORIGINAL MOBILE IMPLEMENTATION — UNCHANGED
          ================================================== */}

          {isMobile ? (
            <div className="mt-[1vh] w-full flex-shrink-0">
              <div className="relative w-full overflow-hidden">
                <motion.div
                  style={{
                    x: mobileX,
                  }}
                  className="flex w-max items-stretch gap-[5vw] pl-[15.5vw] pr-[11vw]"
                >
                  {KEY_FACTS.map((fact) => (
                    <MobileCard key={fact.id} fact={fact} />
                  ))}
                </motion.div>
              </div>
            </div>
          ) : (
            /* ==================================================
               TABLET + DESKTOP

               REAL 3D HINGE
            ================================================== */

            <div
              className="relative w-full flex-shrink-0 px-0"
              style={{
                perspective: '1400px',
                perspectiveOrigin: '50% 0%',
              }}
            >
              {/* TABLET */}

              <div
                className="mx-auto grid w-fit grid-cols-2 gap-4 lg:hidden"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <DesktopCard fact={KEY_FACTS[0]} index={0} progress={scrollYProgress} />

                <DesktopCard fact={KEY_FACTS[1]} index={1} progress={scrollYProgress} />

                <div className="col-span-2 flex justify-center">
                  <DesktopCard fact={KEY_FACTS[2]} index={2} progress={scrollYProgress} />
                </div>
              </div>

              {/* DESKTOP — ALL 3 IN ONE ROW */}

              <div
                className="mx-auto hidden w-full max-w-[1050px] items-start justify-center gap-4 lg:flex"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {KEY_FACTS.map((fact, index) => (
                  <DesktopCard key={fact.id} fact={fact} index={index} progress={scrollYProgress} />
                ))}
              </div>
            </div>
          )}

          {/* ==================================================
              PARTNERS
          ================================================== */}

          <div className="w-full flex-shrink-0 overflow-hidden px-6 pb-[clamp(16px,3dvh,32px)] md:mb-10 md:mt-0 md:pb-[3vh] lg:mt-1">
            <PartnersBlock />
          </div>
        </div>
      </div>
    </section>
  );
}
