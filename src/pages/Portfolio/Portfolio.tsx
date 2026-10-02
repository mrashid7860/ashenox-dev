'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { PROJECT_IMAGES } from '@/data/projects.data';
import { WireJourney } from '@/pages/Portfolio/sections/WireJourney';
import AshenoxLogo from '@/components/common/AshenoxLogo';
import FloatingProjectCard from '@/pages/Portfolio/sections/FloatingProjectCard';
import { TOTAL_CARDS, MOBILE_CARD_COUNT } from '@/utils/floatingMotion';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { ArrowDown } from 'lucide-react';
export function Portfolio() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const { scrollY } = useScroll();

  const scrollIndicatorOpacity = useTransform(scrollY, [0, 180], [1, 0]);
  /* ==========================================================
     CARD INDEXES
  ========================================================== */

  const desktopCards = Array.from(
    {
      length: TOTAL_CARDS,
    },
    (_, index) => index
  );

  const mobileCards = Array.from(
    {
      length: MOBILE_CARD_COUNT,
    },
    (_, index) => index
  );

  return (
    <>
      {/* ======================================================
          PHASE 1
      ====================================================== */}

      <section ref={sectionRef} id="work" className="relative z-10 h-[320vh] w-full bg-[#030405] text-white">
        <div className="sticky top-0 z-20 h-screen min-h-[650px] w-full overflow-hidden">
          {/* ==================================================
              DESKTOP FLOATING FIELD
          ================================================== */}

          <div className="absolute inset-0 hidden h-full w-full overflow-visible md:block">
            {desktopCards.map((index) => (
              <FloatingProjectCard key={`desktop-project-${index}`} image={PROJECT_IMAGES[index % PROJECT_IMAGES.length]} index={index} scrollYProgress={scrollYProgress} />
            ))}
          </div>

          {/* ==================================================
              MOBILE FLOATING FIELD
          ================================================== */}

          <div className="absolute inset-0 h-full w-full overflow-hidden md:hidden">
            {mobileCards.map((index) => (
              <FloatingProjectCard key={`mobile-project-${index}`} image={PROJECT_IMAGES[index % PROJECT_IMAGES.length]} index={index} scrollYProgress={scrollYProgress} />
            ))}
          </div>

          {/* ==================================================
              OUR WORK CONTENT
          ================================================== */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 w-full -translate-x-1/2 -translate-y-1/2 px-5 text-center md:px-10">
            {/* LOGO */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.92,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-6 flex justify-center md:mb-8"
            >
              <div className="w-[150px] md:w-[210px]">
                <AshenoxLogo progress={scrollYProgress} />
              </div>
            </motion.div>

            {/* HEADING */}

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="mt-16 text-[clamp(4rem,10vw,5rem)] font-light leading-[0.8] tracking-[-0.085em] text-white/90"
            >
              {createCharacterAnimation('Our  work')}
            </motion.h2>

            {/* DESCRIPTION */}

            <motion.p
              initial={{
                opacity: 0,
                y: 22,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto mt-7 max-w-[340px] text-[14px] leading-[1.2] tracking-[-0.025em] text-white/80 md:max-w-[420px] md:text-[16px]"
            >
              A curated showcase of branding, digital products,
              <br className="hidden md:block" />
              websites, and mobile experiences.
            </motion.p>
          </div>

          {/* ==================================================
              SCROLL INDICATOR
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.2,
              delay: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              opacity: scrollIndicatorOpacity,
            }}
            className="pointer-events-none absolute bottom-7 left-1/2 z-40 flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border border-white"
          >
            <motion.div
              animate={{
                y: ['-250%', '0%', '0%', '250%'],
              }}
              transition={{
                duration: 1.8,
                times: [0, 0.32, 0.38, 1],
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute left-[2.5px] flex -translate-x-1/2 items-center justify-center"
            >
              <ArrowDown size={10} strokeWidth={1.2} className="shrink-0 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          PHASE 2
      ====================================================== */}

      <WireJourney />
    </>
  );
}

export default Portfolio;
