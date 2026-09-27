import { motion, useScroll, useTransform } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import awardVideo from '@/assets/video/awards-video.mp4';
import { createWordAnimation } from '@/components/animations/wordAnimation';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
function AwardsRecognition() {
  const sectionRef = useRef<HTMLElement | null>(null);

  /*
   * =========================================================
   * RESPONSIVE VIEWPORT
   * =========================================================
   */
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setViewport('mobile');
      } else if (width < 1024) {
        setViewport('tablet');
      } else {
        setViewport('desktop');
      }
    };

    updateViewport();

    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  /*
   * =========================================================
   * VIDEO REVEAL
   * =========================================================
   */

  /*
   * MOBILE
   */
  const mobileClipPath = [
    'inset(22.5% 7.8% 22.5% 7.8% round 999px)',
    'inset(22.5% 7.8% 22.5% 7.8% round 999px)',
    'inset(20% 7% 20% 7% round 999px)',
    'inset(17% 6% 17% 6% round 700px)',
    'inset(14% 5% 14% 5% round 600px)',
    'inset(10% 4% 10% 4% round 450px)',
    'inset(7% 3% 7% 3% round 300px)',
    'inset(4% 2% 4% 2% round 180px)',
    'inset(2% 1% 2% 1% round 100px)',
    'inset(0.5% 0.5% 0.5% 0.5% round 20px)',
    'inset(0% 0% 0% 0% round 0px)',
  ];

  /*
   * TABLET
   */
  const tabletClipPath = [
    'inset(20% 20% 20% 20% round 999px)',
    'inset(20% 20% 20% 20% round 999px)',
    'inset(18% 17% 18% 17% round 999px)',
    'inset(15% 14% 15% 14% round 850px)',
    'inset(12% 11% 12% 11% round 650px)',
    'inset(9% 8% 9% 8% round 500px)',
    'inset(6% 6% 6% 6% round 350px)',
    'inset(3% 4% 3% 4% round 220px)',
    'inset(1.5% 2% 1.5% 2% round 130px)',
    'inset(0.5% 0.5% 0.5% 0.5% round 20px)',
    'inset(0% 0% 0% 0% round 0px)',
  ];

  /*
   * DESKTOP
   * EXACTLY YOUR ORIGINAL VALUES
   */
  const desktopClipPath = [
    'inset(14% 37% 14% 37% round 999px)',
    'inset(14% 37% 14% 37% round 999px)',
    'inset(14% 31% 14% 31% round 999px)',
    'inset(14% 25% 14% 25% round 999px)',
    'inset(12% 20% 12% 20% round 600px)',
    'inset(10% 16% 10% 16% round 600px)',
    'inset(7% 12% 7% 12% round 400px)',
    'inset(4% 8% 4% 8% round 250px)',
    'inset(2% 4% 2% 4% round 150px)',
    'inset(0.5% 1% 0.5% 1% round 20px)',
    'inset(0% 0% 0% 0% round 0px)',
  ];

  const clipPathValues = viewport === 'mobile' ? mobileClipPath : viewport === 'tablet' ? tabletClipPath : desktopClipPath;

  const videoClipPath = useTransform(scrollYProgress, [0, 0.1, 0.22, 0.36, 0.48, 0.59, 0.69, 0.78, 0.88, 0.94, 0.96], clipPathValues);

  /*
   * =========================================================
   * VIDEO FOCUS MOVEMENT
   * =========================================================
   *
   * IMPORTANT:
   *
   * Desktop = 0 movement.
   *
   * Mobile:
   * The video starts slightly shifted DOWN.
   * As the oval/reveal moves, the video follows it.
   * Near the end, movement comes back to 0.
   *
   * This creates:
   *
   *        OVAL
   *          ↓
   *       [VIDEO]
   *          ↓
   *     video follows
   *          ↓
   *     full screen
   *          ↓
   *       normal 0
   *
   * =========================================================
   */

  /*
   * MOBILE VIDEO Y
   *
   * Change these numbers if you want to focus
   * a different vertical area of the video.
   */
  const mobileVideoY = useTransform(
    scrollYProgress,
    [0, 0.1, 0.22, 0.36, 0.48, 0.59, 0.69, 0.78, 0.88, 0.94, 0.96, 1],
    [
      150, // initial focus position
      100,
      100,
      100,
      90,
      57,
      4,
      2,
      -2,
      -3,
      0, // return to normal
      0,
    ]
  );

  /*
   * TABLET VIDEO Y
   */
  const tabletVideoY = useTransform(scrollYProgress, [0, 0.1, 0.22, 0.36, 0.48, 0.59, 0.69, 0.78, 0.88, 0.94, 0.96, 1], [220, 190, 180, 107, 100, 80, 5, 2, -2, -3, 0, 0]);

  /*
   * DESKTOP = NO MOVEMENT
   *
   * This guarantees desktop remains exactly
   * in its original position.
   */
  const desktopVideoY = useTransform(scrollYProgress, [0, 1], [0, 0]);

  /*
   * Select movement based on viewport.
   */
  const videoY = viewport === 'mobile' ? mobileVideoY : viewport === 'tablet' ? tabletVideoY : desktopVideoY;

  /*
   * Optional X movement.
   *
   * Currently 0 so the focus is purely vertical.
   *
   * If later you want the video to follow horizontally too,
   * you can change these values.
   */
  const mobileVideoX = useTransform(scrollYProgress, [0, 0.22, 0.48, 0.69, 0.88, 0.96, 1], [0, 0, 0, 0, 0, 0, 0]);

  const tabletVideoX = useTransform(scrollYProgress, [0, 0.22, 0.48, 0.69, 0.88, 0.96, 1], [0, 0, 0, 0, 0, 0, 0]);

  const desktopVideoX = useTransform(scrollYProgress, [0, 1], [0, 0]);

  const videoX = viewport === 'mobile' ? mobileVideoX : viewport === 'tablet' ? tabletVideoX : desktopVideoX;

  /*
   * =========================================================
   * VIDEO DARK OVERLAY
   * =========================================================
   */
  const videoOverlayOpacity = useTransform(scrollYProgress, [0, 0.25, 0.55, 0.96], [0.3, 0.24, 0.16, 0.08]);

  /*
   * =========================================================
   * MARQUEE VERTICAL SCROLL
   * =========================================================
   */
  const marqueeY = useTransform(scrollYProgress, [0, 0.96, 0.97, 1], ['0vh', '0vh', '-5vh', '-115vh']);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f5f5f3]"
      style={{
        minHeight: '350vh',
      }}
    >
      {/* =====================================================
          STICKY VIEWPORT
          ===================================================== */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ===================================================
            WHITE BACKGROUND
            =================================================== */}
        <div className="absolute inset-0 z-0 bg-[#f5f5f3]" />

        {/* ===================================================
            VIDEO
            =================================================== */}

        <motion.div
          className="absolute inset-0 z-10 overflow-hidden"
          style={{
            clipPath: videoClipPath,
            WebkitClipPath: videoClipPath,
          }}
        >
          {/* =================================================
              ACTUAL VIDEO

              The video itself moves WITH the clip.

              Desktop:
                x = 0
                y = 0

              Mobile/tablet:
                video follows the clip movement
                and returns to 0 at the end.
              ================================================= */}

          <motion.video
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              x: videoX,
              y: videoY,
            }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={awardVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>

          {/* =================================================
              VIDEO OVERLAY
              ================================================= */}

          <motion.div
            className="absolute inset-0 bg-black"
            style={{
              opacity: videoOverlayOpacity,
            }}
          />
        </motion.div>

        {/* ===================================================
            TOP LEFT TEXT
            =================================================== */}

        <motion.div
          className="absolute left-[3.5vw] top-[12vh] z-30 max-w-[220px] md:left-[3.3vw] md:top-[15vh]"
          style={{
            mixBlendMode: 'difference',
            color: '#ffffff',
            isolation: 'isolate',
          }}
        >
          {/* <p className="m-0 text-[14px] uppercase leading-[1.05] tracking-[-0.04em]">
            RESULTS MATTER MOST.
            <br />
            AWARDS ADD RECOGNITION
            <br />
            AND VALUE.
          </p> */}

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.4,
            }}
            className="m-0 text-[14px] uppercase leading-[1.05] tracking-[-0.04em]"
          >
            {createWordAnimation('RESULTS MATTER MOST.')}
            <br />
            {createWordAnimation('AWARDS ADD RECOGNITION')}
            <br />
            {createWordAnimation('AND VALUE.')}
          </motion.p>
        </motion.div>

        {/* ===================================================
            TOP RIGHT CTA
            =================================================== */}

        {/* <motion.a
          href="#contact"
          className="absolute right-[5vw] top-[88vh] z-30 flex w-[140px] items-center justify-between border-b pb-1 text-[12px] uppercase tracking-[-0.03em] transition-opacity duration-300 [word-spacing:3px] hover:opacity-60 md:right-[3.5vw] md:top-[88vh] lg:top-[18vh]"
          style={{
            mixBlendMode: 'difference',
            color: '#ffffff',
            isolation: 'isolate',
          }}
        >
          <span>WIN AN AWARD?</span>

          <ArrowRight size={11} strokeWidth={2} />
        </motion.a> */}

        <AnimatedButton
          variant="animated"
          href="#contact"
          colorMode="blend"
          icon="up-right"
          charShift={57}
          charStagger={0.025}
          charDuration={0.75}
          widthClassName="w-[150px] sm:w-[150px] md:w-[150px] lg:w-[150px]"
          className="absolute left-[55%] top-[17vh] z-30 flex w-[140px] items-center justify-between font-mono uppercase md:left-[79%] lg:left-[87%]"
        >
          WIN AN AWARD?
        </AnimatedButton>

        {/* ===================================================
            MARQUEE
            =================================================== */}

        <motion.div
          className="pointer-events-none absolute left-0 top-[52%] z-40 w-full -translate-y-1/2 overflow-visible"
          style={{
            y: marqueeY,
            mixBlendMode: 'difference',
            color: '#ffffff',
            isolation: 'isolate',
          }}
        >
          <div className="awards-marquee-track flex w-max">
            <div className="flex shrink-0 items-center">
              <MarqueeGroup />
            </div>

            <div className="flex shrink-0 items-center">
              <MarqueeGroup />
            </div>
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          MARQUEE CSS
          ===================================================== */}

      <style>{`
        .awards-marquee-track {
          animation: awardsMarquee 24s linear infinite;
          will-change: transform;
        }

        @keyframes awardsMarquee {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   MARQUEE GROUP
   ========================================================= */

function MarqueeGroup() {
  return (
    <div className="flex shrink-0 items-center">
      <h2 className="m-0 whitespace-nowrap text-[clamp(5rem,8vw,9rem)] font-light leading-none tracking-[-0.085em]">AWARDS</h2>

      <div className="mx-[5vw] flex h-[60px] w-[60px] shrink-0 items-center justify-center">
        <Plus size={60} strokeWidth={0.4} />
      </div>

      <h2 className="m-0 whitespace-nowrap text-[clamp(5rem,8vw,9rem)] font-light leading-none tracking-[-0.085em]">RECOGNITION</h2>

      <div className="mx-[5vw] flex h-[60px] w-[60px] shrink-0 items-center justify-center">
        <Plus size={60} strokeWidth={0.4} />
      </div>
    </div>
  );
}

export default AwardsRecognition;
