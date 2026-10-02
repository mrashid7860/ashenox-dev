'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';

import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { homeData } from '@/data/home.data';

const PHASE = {
  hold: 0.12,
  splitStart: 0.14,
  splitEnd: 0.42,
  flipStart: 0.5,
  flipEnd: 0.86,
  flipStagger: 0.045,
};

type PanelContent = (typeof homeData.journey.panels)[number];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
}

function usePanelFlip(progress: MotionValue<number>, index: number, fanRotateZ: number, fanY: number) {
  const start = PHASE.flipStart + index * PHASE.flipStagger;
  const end = PHASE.flipEnd + index * PHASE.flipStagger;

  const rotateY = useTransform(progress, [start, end], [0, 180]);

  const rotateZ = useTransform(progress, [start, end], [0, fanRotateZ]);

  const translateY = useTransform(progress, [start, end], [0, fanY]);

  const liftScale = useTransform(progress, [start, (start + end) / 2, end], [1, 1.04, 1]);

  return {
    rotateY,
    rotateZ,
    translateY,
    liftScale,
  };
}

function Panel({ index, progress, fanRotateZ, fanY, content, image }: { index: number; progress: MotionValue<number>; fanRotateZ: number; fanY: number; content: PanelContent; image: string }) {
  const { rotateY, rotateZ, translateY, liftScale } = usePanelFlip(progress, index, fanRotateZ, fanY);

  const backgroundPositionX = `${(index / 2) * 100}%`;

  return (
    <motion.div
      style={{
        rotateZ,
        y: translateY,
        scale: liftScale,
        transformPerspective: 1600,
      }}
      className="relative aspect-[3/3.6] w-full max-w-[400px]"
    >
      <motion.div
        style={{
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full w-full"
      >
        {/* Front */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: '300% 100%',
              backgroundPosition: `${backgroundPositionX} center`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[20px] p-6"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: content.background,
            color: content.textColor,
          }}
        >
          <span className="text-xl opacity-80">{content.icon}</span>

          <div>
            <h3 className="whitespace-pre-line text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">{content.title}</h3>

            <p className="mt-4 max-w-[85%] text-[13px] leading-relaxed opacity-70">{content.description}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MobileCard({ content }: { content: PanelContent }) {
  return (
    <div
      className="relative h-[48vh] w-[80vw] shrink-0 overflow-hidden rounded-[8px] p-6"
      style={{
        background: content.background,
        color: content.textColor,
      }}
    >
      <span className="text-xl opacity-80">{content.icon}</span>

      <div className="absolute bottom-7 left-6 right-6">
        <h3 className="whitespace-pre-line text-[29px] font-medium leading-[1.05] tracking-[-0.045em]">{content.title}</h3>

        <p className="mt-4 max-w-[92%] text-[13px] leading-[1.55] opacity-70">{content.description}</p>
      </div>
    </div>
  );
}

function MobileProgress({ progress }: { progress: MotionValue<number> }) {
  const indicator1 = useTransform(progress, [0.14, 0.3], [0.3, 1]);

  const indicator2 = useTransform(progress, [0.36, 0.55], [0.3, 1]);

  const indicator3 = useTransform(progress, [0.6, 0.78], [0.3, 1]);

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <motion.span style={{ opacity: indicator1 }} className="h-[3px] w-[20px] rounded-full bg-[#222]" />

      <motion.span style={{ opacity: indicator2 }} className="h-[3px] w-[20px] rounded-full bg-[#222]" />

      <motion.span style={{ opacity: indicator3 }} className="h-[3px] w-[20px] rounded-full bg-[#222]" />
    </div>
  );
}

export function JourneySplitFlip() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const { image, heading, description, partnersLabel, partners, panels } = homeData.journey;

  // Desktop stage
  const stageScale = useTransform(scrollYProgress, [0, PHASE.hold, PHASE.splitEnd], [1, 1, 0.86]);

  const gapPx = useTransform(scrollYProgress, [PHASE.splitStart, PHASE.splitEnd], [0, 22]);

  const gapCss = useTransform(gapPx, (value) => `${value}px`);

  const bgOpacity = useTransform(scrollYProgress, [PHASE.splitStart, PHASE.flipStart], [0, 1]);

  const stageRadius = useTransform(scrollYProgress, [PHASE.splitStart, PHASE.splitEnd], [28, 20]);

  const stageRadiusCss = useTransform(stageRadius, (value) => `${value}px`);

  // Mobile horizontal movement
  const mobileX = useTransform(scrollYProgress, [0.16, 0.82], ['0vw', '-166vw']);

  const sectionHeight = isMobile ? '200svh' : '250vh';

  return (
    <section ref={sectionRef} style={{ height: sectionHeight }} className="relative w-full overflow-visible bg-white">
      <div className="sticky top-0 h-[105svh] w-full overflow-hidden md:h-screen lg:h-auto">
        {/* Background grid */}
        <motion.div style={{ opacity: bgOpacity }} className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </motion.div>

        <div className="relative flex h-full flex-col items-center justify-center">
          {/* Heading */}
          <div className="relative z-20 w-full flex-shrink-0 px-6 pt-[10vh] text-center md:mb-8 md:pt-[8vh]">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="text-[clamp(2.75rem,6.5vw,6rem)] font-normal leading-[0.95] tracking-[-0.03em] text-[#3c3c3c]"
            >
              {createCharacterAnimation(heading)}
            </motion.h2>

            <p className="mx-auto mt-3 max-w-[320px] text-sm leading-relaxed tracking-[-0.01em] text-[#1b1b1b]/55">
              {description[0]}
              <br />
              {description[1]}
            </p>
          </div>

          {/* Mobile cards */}
          {isMobile ? (
            <div className="mt-[5vh] w-full flex-shrink-0">
              <div className="relative w-full overflow-hidden">
                <motion.div style={{ x: mobileX }} className="flex w-max items-stretch gap-[5vw] pl-[11vw] pr-[11vw]">
                  {panels.map((content) => (
                    <MobileCard key={content.title} content={content} />
                  ))}
                </motion.div>
              </div>

              <MobileProgress progress={scrollYProgress} />
            </div>
          ) : (
            /* Desktop cards */
            <motion.div
              style={{
                scale: stageScale,
                gap: gapCss,
                borderRadius: stageRadiusCss,
              }}
              className="flex w-full max-w-[1000px] items-stretch justify-center overflow-visible px-6"
            >
              {panels.map((content, index) => (
                <Panel key={content.title} index={index} progress={scrollYProgress} content={content} image={image} fanRotateZ={index === 0 ? -7 : index === 2 ? 7 : 0} fanY={index === 1 ? -14 : 10} />
              ))}
            </motion.div>
          )}

          {/* Partners */}
          <div className="mb-10 mt-8 w-full flex-shrink-0 overflow-hidden px-6 pb-[3vh] md:mt-10">
            <p className="mb-5 mt-5 text-center text-[13px] uppercase text-[#000]/80 lg:text-[14px]">{partnersLabel}</p>

            {/* Mobile marquee */}
            <div className="relative overflow-hidden md:hidden">
              <motion.div
                className="flex w-max items-center"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  duration: 18,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                {[0, 1].map((set) => (
                  <div key={set} className="flex items-center">
                    {partners.map((partner, index) => (
                      <div key={`${set}-${partner}`} className="flex items-center">
                        <span className="whitespace-nowrap text-[13px] tracking-[-0.02em] text-[#000]/80">{partner}</span>

                        {index < partners.length - 1 && <span aria-hidden="true" className="mx-5 h-4 w-px shrink-0 bg-[#1a1a1a]/20" />}
                      </div>
                    ))}

                    <span className="w-10 shrink-0" />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Desktop partners */}
            <div className="hidden items-center justify-center md:flex">
              {partners.map((partner, index) => (
                <div key={partner} className="flex items-center">
                  <span className="whitespace-nowrap text-[13px] tracking-[-0.02em] text-[#000]/80 sm:text-[17px]">{partner}</span>

                  {index < partners.length - 1 && <span aria-hidden="true" className="mx-5 h-4 w-[0.5px] bg-[#1a1a1a]/20 sm:mx-7 sm:h-5" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
