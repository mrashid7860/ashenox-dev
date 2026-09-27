import { motion } from 'framer-motion';
import { createWordAnimation } from '@/components/animations/wordAnimation';
import { MarqueeSection } from '@/components/common/MarqueeSection';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { homeData } from '@/data/home.data';
import { usePageTransition } from '@/components/common/PageLoader';
const EASE = [0.16, 1, 0.3, 1] as const;

const reveal = {
  initial: {
    opacity: 0,
    y: 20,
  },
  whileInView: {
    opacity: 1,
    y: 0,
  },
  viewport: {
    once: true,
    amount: 0.3,
  },
  transition: {
    duration: 1,
    ease: EASE,
  },
};

function ScrollMarquee() {
  const { marquee, marqueeCaption } = homeData.aboutMisson;

  return (
    <MarqueeSection
      words={marquee}
      caption={marqueeCaption}
      heightClass="h-[38svh] min-h-[280px] md:h-[36vh] lg:h-[34vh]"
      textSizeClass="text-[clamp(4rem,8.5vw,9.5rem)]"
      captionPositionClass="bottom-[15%]"
    />
  );
}

function DesignStatement() {
  const { design } = homeData.aboutMisson;

  return (
    <motion.div
      {...reveal}
      className="absolute left-[100px] top-[1%] w-[190px] sm:left-[28px] sm:top-[15%] sm:w-[220px] md:left-[5%] md:top-[20%] md:w-[260px] lg:left-[9.6%] lg:top-[16%] lg:w-[310px]"
    >
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-5 text-[14px] font-[400] uppercase leading-[1.04] tracking-[-0.035em] text-white/75 sm:text-[12px] md:text-[14px] lg:text-[14px]"
      >
        {design.map((line, index) => (
          <span key={line}>
            {createWordAnimation(line)}
            {index < design.length - 1 && <br />}
          </span>
        ))}
      </motion.p>
    </motion.div>
  );
}

function MissionStatement() {
  const { mission } = homeData.aboutMisson;
  const go = usePageTransition();

  return (
    <motion.div
      {...reveal}
      className="absolute left-[100px] right-auto top-[12%] w-[250px] sm:left-auto sm:right-[28px] sm:top-[15%] sm:w-[270px] md:right-[5%] md:top-[16%] md:w-[315px] lg:right-[9.6%] lg:top-[16%] lg:w-[405px] xl:w-[430px]"
    >
      <p className="mt-5 text-[15px] font-[200] leading-[1.2] tracking-[-0.02em] text-white/75 sm:text-[12px] md:text-[14px] lg:text-[16px]">{mission}</p>

      <AnimatedButton
        variant="animated"
        icon="up-right"
        charShift={57}
        onClick={() => go('/about', 'ABOUT')}
        widthClassName="w-[150px] sm:w-[150px] md:w-[150px] lg:w-[150px]"
        className="mt-[27px] pb-[7px] font-mono text-white/70 sm:mt-[40px] md:mt-[40px] lg:mt-[60px] lg:pb-0"
      >
        MORE ABOUT US
      </AnimatedButton>
    </motion.div>
  );
}

function FocusedVision() {
  const { vision } = homeData.aboutMisson;

  return (
    <motion.div
      {...reveal}
      transition={{
        ...reveal.transition,
        delay: 0.25,
      }}
      className="absolute bottom-[10%] left-[23px] sm:left-[28px] md:bottom-[19%] md:left-[5%] lg:bottom-[20%] lg:left-[9.6%]"
    >
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="text-[14px] font-[400] uppercase leading-[1.04] tracking-[-0.035em] text-white/70 sm:text-[12px] md:text-[14px] lg:text-[13px]"
      >
        {vision.map((line, index) => (
          <span key={line}>
            {createWordAnimation(line)}
            {index < vision.length - 1 && <br />}
          </span>
        ))}
      </motion.p>
    </motion.div>
  );
}

export function AboutMission() {
  return (
    <>
      <section id="mission" className="relative h-[480px] min-h-0 w-full overflow-hidden bg-[#080808] sm:h-[480px] md:h-[50vh] lg:h-[75vh] xl:h-[76vh]">
        <div className="noise-overlay pointer-events-none absolute inset-0 z-[1]" />

        <div className="absolute left-0 right-0 top-0 z-30 h-px" />

        <div className="relative z-20 mx-auto h-full w-full max-w-[1920px] px-[23px] sm:px-[28px] md:px-[5%] lg:px-[9.6%]">
          <DesignStatement />
          <MissionStatement />
          <FocusedVision />
        </div>
      </section>

      <ScrollMarquee />
    </>
  );
}
