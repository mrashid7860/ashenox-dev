'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { CLIENT_STORIES_CONTENT, TESTIMONIALS } from '@/data/clientStories.data';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';
import { usePageTransition } from '@/components/common/PageLoader';
const AUTOPLAY_DELAY = 6000;

// Reusable carousel navigation button.
type NavigationButtonProps = {
  direction: 'prev' | 'next';
  onClick: () => void;
};

function NavigationButton({ direction, onClick }: NavigationButtonProps) {
  const isPrevious = direction === 'prev';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${isPrevious ? 'Previous' : 'Next'} testimonial`}
      className={`flex h-14 w-14 items-center justify-center border border-neutral-300 transition-all duration-300 hover:bg-black hover:text-white lg:h-16 lg:w-16 ${isPrevious ? '' : '-ml-px'}`}
    >
      <motion.span whileHover={{ x: isPrevious ? -5 : 5 }} transition={{ duration: 0.2 }}>
        {isPrevious ? '←' : '→'}
      </motion.span>
    </button>
  );
}

// Reusable mobile pagination.
type PaginationProps = {
  count: number;
  activeIndex: number;
  onChange: (index: number) => void;
};

function Pagination({ count, activeIndex, onChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-[6px]">
      {Array.from({ length: count }, (_, index) => (
        <button key={index} type="button" onClick={() => onChange(index)} aria-label={`Go to testimonial ${index + 1}`} className="flex h-4 items-center justify-center">
          <motion.span
            animate={{
              width: activeIndex === index ? 22 : 5,
              opacity: activeIndex === index ? 1 : 0.3,
            }}
            transition={{ duration: 0.3 }}
            className="block h-[3px] rounded-full bg-black"
          />
        </button>
      ))}
    </div>
  );
}

export function ClientStories() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeStory = TESTIMONIALS[activeIndex];
  const go = usePageTransition();

  // Automatically advance the active testimonial.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(interval);
  }, []);

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
  };

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="overflow-hidden bg-[linear-gradient(0deg,#D2D2D2_0%,#FFFFFF_100%)] px-6 py-16 text-[#222] sm:px-8 sm:py-20 md:py-24 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[43px] font-light leading-[0.9] tracking-[-0.08em] sm:text-[50px] md:text-[54px] lg:text-[60px]"
          >
            {createCharacterAnimation(CLIENT_STORIES_CONTENT.heading)}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="max-w-[240px] text-[14px] leading-[1.25] tracking-[-0.04em] text-neutral-600 md:max-w-[220px] md:text-[13px]"
          >
            {CLIENT_STORIES_CONTENT.description}
          </motion.p>
        </div>

        {/* Header divider */}
        <div className="relative min-h-[40px] sm:min-h-[40px] 2xl:mt-16">
          {/* Mobile */}
          <div className="relative translate-y-8 md:hidden">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.35}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="left"
              plusPosition="48%"
              plusSize={14}
              plusStrokeWidth={2.5}
              plusColor="#4A4A4A"
              plusOpacity={0.7}
              plusTop="3.2px"
              rotateFrom={0}
              rotateTo={360}
              scrollStart="start 97%"
              scrollEnd="start 40%"
            />
          </div>

          {/* Tablet */}
          <div className="relative hidden translate-y-2 md:block lg:hidden">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.35}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="left"
              plusPosition="clamp(52%, calc(49% + (100vw - 900px) * 0.04), 52%)"
              plusSize={14}
              plusStrokeWidth={2.5}
              plusColor="#4A4A4A"
              plusOpacity={0.7}
              plusTop="3.2px"
              rotateFrom={0}
              rotateTo={360}
              scrollStart="start 97%"
              scrollEnd="start 60%"
            />
          </div>

          {/* Large desktop */}
          <div className="relative hidden translate-y-10 lg:block xl:hidden">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.35}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="left"
              plusPosition="clamp(9%, calc(9% + (100vw - 1024px) * 0.12), 20%)"
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
          <div className="relative hidden translate-y-10 xl:block 2xl:hidden">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.35}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="left"
              plusPosition="clamp(42%, calc(52% + (100vw - 1280px) * 0.0), 59%)"
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

          {/* 2XL */}
          <div className="relative hidden translate-y-2 2xl:block">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.35}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="left"
              plusPosition="51.8%"
              plusSize={14}
              plusStrokeWidth={2.5}
              plusColor="#4A4A4A"
              plusOpacity={0.7}
              plusTop="3.2px"
              rotateFrom={0}
              rotateTo={360}
              scrollStart="start 97%"
              scrollEnd="start 50%"
            />
          </div>
        </div>
      </div>

      {/* Stories */}
      <div className="mx-auto max-w-7xl pt-12 sm:pt-14 md:pt-16">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-10 lg:gap-14">
          {/* Desktop / tablet navigation */}
          <div className="hidden min-h-full flex-col md:flex">
            <div className="space-y-1">
              {TESTIMONIALS.map((story, index) => {
                const isActive = activeIndex === index;

                return (
                  <button key={story.company} type="button" onClick={() => setActiveIndex(index)} className="group flex items-center gap-3 text-left">
                    <motion.span
                      animate={{
                        opacity: isActive ? 1 : 0.28,
                      }}
                      transition={{ duration: 0.25 }}
                      className="text-[11px] leading-[1.2] tracking-[-0.03em]"
                    >
                      {story.company}
                    </motion.span>

                    <motion.span
                      animate={{
                        opacity: isActive ? 1 : 0,
                        x: isActive ? 0 : -8,
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      →
                    </motion.span>
                  </button>
                );
              })}
            </div>

            {/* Previous / next */}
            <div className="mt-24 flex items-center">
              <NavigationButton direction="prev" onClick={showPrevious} />

              <NavigationButton direction="next" onClick={showNext} />
            </div>
          </div>

          {/* Active story */}
          <div className="flex min-w-0 flex-col">
            {/* Review */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="max-w-[700px] text-[23px] leading-[0.98] tracking-[-0.05em] text-[#2f2f2f] sm:text-[25px] md:text-[25px] lg:text-[25px]">{activeStory.review}</p>
              </motion.div>
            </AnimatePresence>

            {/* Client information */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-info`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: 0.08,
                  duration: 0.55,
                }}
                className="mt-10 flex items-center sm:mt-12 md:mt-6 lg:mt-16"
              >
                <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
                  <img src={activeStory.image} alt={activeStory.name} className="h-14 w-14 shrink-0 rounded-md object-cover object-top sm:h-16 sm:w-16" />

                  <div>
                    <h4 className="text-[14px] font-light leading-none tracking-[-0.03em] text-[#3b3b3b] sm:text-[15px]">{activeStory.name}</h4>

                    <p className="mt-1 text-[12px] leading-none tracking-[-0.03em] text-neutral-500 sm:text-[13px]">{activeStory.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Desktop CTA */}
            <div className="mt-4 hidden md:flex md:items-center">
              <AnimatedButton
                onClick={() => go('/contact', 'CONTACT')}
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
                widthClassName="w-[170px] sm:w-[170px] md:w-[170px] lg:w-[170px]"
                className="group mt-1 flex items-center gap-3 font-mono uppercase"
              >
                {CLIENT_STORIES_CONTENT.cta}
              </AnimatedButton>
            </div>

            {/* Mobile controls */}
            <div className="mt-8 flex items-center justify-between md:hidden">
              <div className="flex flex-col">
                <AnimatedButton
                  onClick={() => go('/contact', 'CONTACT')}
                  variant="animated"
                  textColor="#4A4A4A"
                  hoverTextColor="#000"
                  borderColor="#4A4A4A"
                  hoverBorderColor="#000"
                  iconColor="#4A4A4A"
                  icon="up-right"
                  hoverIconColor="#000"
                  charShift={42}
                  charStagger={0.025}
                  charDuration={0.75}
                  widthClassName="w-[140px]"
                  className="group mt-1 flex items-center gap-3 font-mono text-[9px] uppercase"
                >
                  {CLIENT_STORIES_CONTENT.cta}
                </AnimatedButton>

                {/* <div className="mt-2 h-px w-[118px] bg-neutral-400" /> */}
              </div>

              <Pagination count={TESTIMONIALS.length} activeIndex={activeIndex} onChange={setActiveIndex} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
