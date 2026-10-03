import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Plus } from 'lucide-react';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { createWordAnimation } from '@/components/animations/wordAnimation';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';
const VALUES = [
  {
    number: '01',
    title: 'Driven by excellence',
    description: 'Our work is shaped by high standards, continuous learning, and deep respect for craft, pushing every project beyond the expected.',
  },
  {
    number: '02',
    title: 'Honesty and authenticity',
    description: 'In an industry full of noise and inflated promises, we focus on clarity, transparency, and results we are proud to stand behind.pushing every project beyond the expected. ',
  },
  {
    number: '03',
    title: 'Designs that last',
    description: 'We design systems, products, and brands built to endure, balancing creativity, technology, and purpose for long-term impact. pushing every project beyond the expected',
  },
  {
    number: '04',
    title: 'Purposeful decisions',
    description: 'We are an independent studio of design and coding experts, prioritizing quality and emotional value.pushing every project beyond the expected.  ',
  },
  {
    number: '05',
    title: 'Built around people',
    description: 'We believe the best digital experiences begin with understanding people, their needs, behaviors, and ambitions. pushing every project beyond the expected',
  },
  {
    number: '06',
    title: 'Always evolving',
    description: 'Technology never stands still, and neither do we. We continuously explore new ideas, tools, and ways of working. pushing every project beyond the expected',
  },
];

function ValueCard({ value, index, scrollYProgress }: { value: (typeof VALUES)[number]; index: number; scrollYProgress: any }) {
  const start = 0.08 + index * 0.12;
  const end = start + 0.1;

  const rotateX = useTransform(scrollYProgress, [start, end], [-90, 0]);

  const y = useTransform(scrollYProgress, [start, end], [-4, 0]);

  const textOpacity = useTransform(scrollYProgress, [start, start + 0.06, end], [0, 0, 1]);

  const backgroundColor = useTransform(scrollYProgress, [start, end], ['#bab6b6', '#ffffff']);

  return (
    <motion.div
      className="top-[calc(var(--index)*136px)] md:top-[calc(var(--index)*98px)] lg:top-[calc(var(--index)*98px)]"
      style={
        {
          position: 'absolute',
          left: 0,
          '--index': index,
          width: '100%',
          rotateX,
          y,
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          zIndex: VALUES.length - index,
        } as any
      }
    >
      <motion.div
        className="relative flex h-[134px] w-full flex-col items-start justify-center rounded px-5 py-5 md:h-[96px] md:flex-row md:items-center md:px-6 md:py-5 lg:h-[96px] lg:px-5"
        style={{
          backgroundColor,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* TITLE */}

        <motion.div
          className="flex w-[50%] w-full items-start justify-start pr-0 md:w-[60%] md:items-center md:pr-12"
          style={{
            opacity: textOpacity,
          }}
        >
          <p className="text-[clamp(1.4rem,2vw,2.5rem)] leading-[0.95] tracking-[-0.055em] text-black/70 md:text-[clamp(1.5rem,2vw,2.5rem)]">{value.title}</p>
        </motion.div>

        {/* DESCRIPTION */}

        <motion.div
          className="mt-4 w-full pl-0 md:ml-auto md:mt-0 md:w-[66%] md:pl-3 lg:w-[55%]"
          style={{
            opacity: textOpacity,
          }}
        >
          <p className="text-[14px] leading-[1.35] tracking-[-0.02em] text-[#555] md:text-[12px] md:text-[14px]">{value.description}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function AboutValues() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 55%', 'end 45%'],
  });

  return (
    <section ref={sectionRef} className="relative w-full bg-[#eeeeee]">
      {/* TOP LINE */}
      <div className="grid grid-cols-12 gap-x-6">
        <div className="relative col-span-12 md:col-span-10 md:col-start-2">
          <div className="relative col-span-12 md:col-span-10 md:col-start-2">
            <div className="">
              <div className="relative px-4 md:hidden">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.35}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="center"
                  plusPosition="48%"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#4A4A4A"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 98%"
                  scrollEnd="start 40%"
                />
              </div>
              {/* Tablet */}
              <div className="hidden md:block lg:hidden">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="clamp(50%, calc(49% + (100vw - 900px) * 0.04), 52%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#4A4A4A"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 94%"
                  scrollEnd="start 50%"
                />
              </div>

              {/* Large desktop */}
              <div className="hidden lg:block xl:hidden">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="clamp(49%, calc(49% + (100vw - 900px) * 0.04), 52%)"
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

              {/* XL */}
              <div className="hidden xl:block 2xl:hidden">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="clamp(41.4%, calc(41.4% + (100vw - 1280px) * 0.004), 41.8%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#4A4A4A"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 97%"
                  scrollEnd="start 44%"
                />
              </div>

              {/* 2XL and above */}
              <div className="hidden 2xl:block">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="clamp(68.3%, calc(49% + (100vw - 1536px) * 0.035), 59%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#4A4A4A"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 98%"
                  scrollEnd="start 30%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-3 md:px-20">
        <div className="grid grid-cols-12 gap-x-6">
          {/* ================= LEFT ================= */}

          <div className="col-span-12 md:col-span-11 lg:col-span-3 xl:col-span-4 2xl:col-span-3">
            <div className="relative lg:min-h-[120vh] xl:min-h-[110vh] 2xl:min-h-[120vh]">
              <div className="relative z-[50] mb-[20px] mt-[60px] md:mb-[0px] md:mt-[50px] lg:sticky lg:top-[20vh] lg:mb-[180px] lg:mt-[120px]">
                <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
                  {/* LEFT — OUR VALUES */}
                  <h2 className="text-center text-[clamp(1.8rem,4vw,5rem)] leading-[0.86] tracking-[-0.05em] text-black/70 md:text-left md:text-[clamp(3rem,4vw,5rem)] lg:text-[clamp(4rem,4vw,5rem)]">
                    {createCharacterAnimation('Our Values')}
                  </h2>

                  {/* RIGHT — INTRO */}
                  <p className="max-w-[280px] text-center text-[14px] leading-[1.3] text-black/70 md:max-w-[270px] md:text-left md:text-[13px] lg:hidden">
                    We're proud to be one of India's most creative and recognized web design studios, driven by purpose, aesthetics, and bold ideas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}

          <div className="col-span-12 md:col-span-12 lg:col-span-9 lg:pl-24 xl:col-span-8 2xl:col-span-9">
            <div className="relative lg:pt-[20vh] xl:pt-[17vh] 2xl:pt-[19vh]">
              {/* ================= INTRO ================= */}

              <p className="hidden max-w-[280px] text-[14px] leading-[1.3] text-black/70 lg:block lg:max-w-[300px] lg:text-[13px]">
                We're proud to be one of India's most creative and recognized web design studios, driven by purpose, aesthetics, and bold ideas.
              </p>

              {/* ================= CARDS ================= */}

              <div
                className="relative mt-10 h-[820px] w-full md:mt-16 md:h-[580px] lg:h-[620px] xl:h-[620px] 2xl:h-[620px]"
                style={{
                  perspective: '1600px',
                  perspectiveOrigin: 'center top',
                }}
              >
                {VALUES.map((value, index) => (
                  <ValueCard key={value.number} value={value} index={index} scrollYProgress={scrollYProgress} />
                ))}
              </div>

              {/* ================= TEXT BELOW ================= */}

              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.4,
                }}
                className="mb-10 mt-8 text-center text-[14px] leading-[1.3] text-black/60 md:mt-16 md:text-left lg:mt-0"
              >
                {createWordAnimation('✦ What we believe shapes better work.')}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
