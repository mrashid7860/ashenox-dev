import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
const STEPS = [
  {
    n: '01',
    title: 'Discover',
    desc: 'We immerse in your vision, audience, and ambitions to define the creative territory.',
  },
  {
    n: '02',
    title: 'Concept',
    desc: 'Art direction, narrative, and design language shaped into a coherent system.',
  },
  {
    n: '03',
    title: 'Craft',
    desc: 'Design and engineering in parallel — every detail refined to cinematic precision.',
  },
  {
    n: '04',
    title: 'Launch',
    desc: 'We ship, measure, and evolve — building momentum beyond go-live.',
  },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.75', 'end 0.35'],
  });

  /* ============================================================
     TIMELINE PROGRESS
  ============================================================ */

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="relative overflow-hidden bg-[#fff] px-6 py-28 text-[#282828] sm:py-32 md:py-40">
      <div className="mx-auto w-full max-w-6xl">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="w-full max-w-[650px]">
          {/* EYEBROW */}

          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/40 sm:text-[11px]">HOW WE WORK</p>

          {/* TITLE */}

          <h2 className="mt-4 max-w-[600px] text-[42px] font-light leading-[0.9] tracking-[-0.065em] text-[#282828] sm:text-[52px] md:text-[64px] md:leading-[0.88]">
            {createCharacterAnimation('A process built for')}
            <br />
            {createCharacterAnimation('momentum')}
          </h2>
        </header>

        {/* ======================================================
            TIMELINE
        ====================================================== */}

        <div ref={ref} className="relative mt-16 sm:mt-20 md:mt-24">
          {/* ====================================================
              BASE LINE
          ==================================================== */}

          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-[18px] top-0 w-px bg-black/10 md:left-1/2 md:-translate-x-1/2" />

          {/* ====================================================
              ANIMATED LINE
          ==================================================== */}

          <motion.div
            aria-hidden="true"
            style={{
              scaleY: lineScale,
            }}
            className="pointer-events-none absolute bottom-0 left-[18px] top-0 w-px origin-top bg-black md:left-1/2 md:-translate-x-1/2"
          />

          {/* ====================================================
              STEPS

              Reduced spacing:
              Mobile:
                space-y-4
                min-h-[125px]

              Tablet:
                space-y-3
                min-h-[120px]

              Desktop:
                space-y-2
                min-h-[130px]
          ==================================================== */}

          <div className="space-y-4 sm:space-y-3 md:space-y-2">
            {STEPS.map((step, index) => (
              <motion.article
                key={step.n}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: '-15% 0px',
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative flex min-h-[125px] items-start sm:min-h-[120px] md:min-h-[130px] ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} `}
              >
                {/* =================================================
                    TIMELINE DOT

                    Wrapper handles positioning.
                    Inner motion handles animation.
                    This keeps the dot perfectly centered.
                ================================================= */}

                <span className="absolute left-[19px] top-[10px] z-20 flex h-[14px] w-[14px] -translate-x-1/2 items-center justify-center md:left-1/2 md:-translate-x-1/2">
                  <motion.span
                    initial={{
                      scale: 0,
                      opacity: 0,
                    }}
                    whileInView={{
                      scale: 1,
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.15 + index * 0.07,
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="block h-[13px] w-[13px] rounded-full bg-black"
                  />
                </span>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className={`w-full pl-[48px] md:w-[44%] md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} `}>
                  {/* =================================================
                      NUMBER + TITLE
                  ================================================= */}

                  <div className="flex items-baseline gap-4">
                    <span className="shrink-0 text-[10px] font-normal tracking-[0.08em] text-black/35 sm:text-[11px]">{step.n}</span>

                    <h3 className="text-[27px] font-light leading-none tracking-[-0.055em] text-[#202020] sm:text-[31px] md:text-[34px]">{step.title}</h3>
                  </div>

                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  <p className="mt-3 max-w-[390px] text-[13px] font-light leading-[1.5] tracking-[-0.01em] text-black/50 sm:mt-3 sm:text-[14px] md:mt-4 md:text-[15px] md:leading-[1.55]">
                    {step.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
