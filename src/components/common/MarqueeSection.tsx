'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import { createWordAnimation } from '@/components/animations/wordAnimation';

type MarqueeSectionProps = {
  words: readonly string[];
  caption?: string;

  heightClass: string;
  topClass?: string;

  textSizeClass?: string;

  duration?: number;
  translateX?: string;

  plusSizeClass?: string;
  plusSpacingClass?: string;
  plusColorClass?: string;
  plusMarginTopClass?: string;

  captionPositionClass?: string;
  animateCaption?: boolean;
};

export function MarqueeSection({
  words,
  caption,
  heightClass,
  topClass = 'top-[8%]',
  textSizeClass = 'text-[clamp(4rem,8.5vw,9.5rem)]',
  duration = 30,
  translateX = '-50%',

  plusSizeClass = 'h-[0.3em] w-[0.3em]',
  plusSpacingClass = 'mx-[0.15em]',
  plusColorClass = 'text-white/40',
  plusMarginTopClass = 'mt-6',

  captionPositionClass = 'bottom-[15%]',
  animateCaption = true,
}: MarqueeSectionProps) {
  const marqueeWords = [...words, ...words];

  return (
    <section className={`relative w-full overflow-hidden bg-transparent ${heightClass}`}>
      <div className={`absolute left-0 ${topClass} flex w-full overflow-hidden`}>
        <motion.div
          className={`flex w-max items-center whitespace-nowrap ${textSizeClass} font-[400] uppercase leading-none tracking-[-0.075em] text-white/[0.87]`}
          animate={{ x: ['0%', translateX] }}
          transition={{
            duration,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {marqueeWords.map((word, index) => (
            <div key={`${word}-${index}`} className="flex items-center">
              <span className="mx-[0.22em]">{word}</span>

              <span className={`flex items-center justify-center self-center ${plusSpacingClass}`}>
                <Plus className={`${plusSizeClass} ${plusMarginTopClass} ${plusColorClass}`} strokeWidth={1} />
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {caption && (
        <div className={`absolute left-0 z-20 flex w-full justify-center ${captionPositionClass}`}>
          <motion.p
            initial={animateCaption ? 'hidden' : false}
            whileInView={animateCaption ? 'visible' : undefined}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            className="flex items-center gap-[5px] whitespace-nowrap text-[12px] uppercase leading-[1.04] tracking-[-0.04em] text-white/80 sm:text-[11px] md:text-[10px] lg:text-[14px]"
          >
            <span className="text-white/80">✦</span>

            <span>{createWordAnimation(caption)}</span>
          </motion.p>
        </div>
      )}
    </section>
  );
}
