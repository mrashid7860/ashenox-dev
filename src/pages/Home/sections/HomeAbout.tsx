import { useRef } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';

import { homeData } from '@/data/home.data';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.62, 1]);

  const color = useTransform(progress, range, ['rgb(190, 190, 190)', 'rgb(241, 243, 247)']);

  return (
    <motion.span style={{ opacity, color }} className="inline">
      {word}{' '}
    </motion.span>
  );
}

export function HomeAbout() {
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end end'],
  });

  const { about } = homeData;
  const words = about.paragraph.split(' ');

  return (
    <section id="about" ref={ref} className="relative h-[62svh] w-full overflow-hidden bg-[#080808] sm:h-[70svh] md:h-[65svh] lg:h-[80svh]">
      <div className="absolute inset-0 bg-[#080808]" />

      <div className="relative z-10 flex h-full w-full items-center px-[14px] sm:px-[24px] md:px-[32px] lg:px-[24px]">
        <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-[80px_minmax(0,1fr)] md:grid-cols-[110px_minmax(0,1fr)] lg:grid-cols-[105px_minmax(0,1fr)] xl:grid-cols-[110px_minmax(0,1fr)] 2xl:grid-cols-[110px_minmax(0,1fr)]">
          {/* Label */}
          <div className="mb-[18px] sm:mb-0 sm:pt-[4px] md:pt-[6px]">
            <span className="block text-[13px] font-medium uppercase tracking-[-0.01em] text-white/70 sm:text-[16px] md:text-[12px] lg:text-[13px]">{about.label}</span>
          </div>

          {/* Content */}
          <div className="w-full min-w-0">
            <h3 className="m-0 w-full max-w-full break-words text-[28px] leading-[0.91] tracking-[-0.06em] [word-spacing:2px] sm:text-[35px] sm:leading-[0.92] md:text-[52px] md:leading-[0.93] md:[word-spacing:2px] lg:text-[clamp(4.2rem,4.15vw,5.3rem)] lg:leading-[0.94]">
              {words.map((word, index) => (
                <span key={`${word}-${index}`} className={index === 0 ? 'ml-[45px] inline sm:ml-[25px] md:ml-[45px] lg:ml-[150px] xl:ml-[110px] 2xl:ml-[150px]' : 'inline'}>
                  <Word word={word} progress={scrollYProgress} range={[index / words.length, (index + 1) / words.length]} />
                </span>
              ))}
            </h3>

            {/* Line + Plus after description */}
            <div className="translate-y-8 sm:translate-y-8 md:translate-y-10 lg:translate-y-[100px]">
              {/* Mobile */}
              <div className="translate-y-10 md:hidden">
                <LinePlusBlock
                  lineColor="#D8D8D8"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="22%"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#D8D8D8"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 87%"
                  scrollEnd="start 30%"
                />
              </div>

              {/* Tablet */}
              <div className="hidden translate-y-40 md:block lg:hidden">
                <LinePlusBlock
                  lineColor="#D8D8D8"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="clamp(45%, calc(49% + (100vw - 900px) * 0.04), 52%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#D8D8D8"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 77%"
                  scrollEnd="start 40%"
                />
              </div>

              {/* Large desktop */}
              <div className="hidden translate-y-10 lg:block xl:hidden">
                <LinePlusBlock
                  lineColor="#D8D8D8"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="clamp(9%, calc(9% + (100vw - 1024px) * 0.12), 20%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#D8D8D8"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 77%"
                  scrollEnd="start 20%"
                />
              </div>

              {/* XL */}
              <div className="hidden translate-y-10 xl:block 2xl:hidden">
                <LinePlusBlock
                  lineColor="#D8D8D8"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="clamp(52%, calc(52% + (100vw - 1280px) * 0.36), 59%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#D8D8D8"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 77%"
                  scrollEnd="start 20%"
                />
              </div>

              {/* 2XL and above */}
              <div className="hidden translate-y-10 2xl:block">
                <LinePlusBlock
                  lineColor="#D8D8D8"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="clamp(59%, calc(59% + (100vw - 1536px) * 0.035), 59%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#D8D8D8"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 77%"
                  scrollEnd="start 20%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
