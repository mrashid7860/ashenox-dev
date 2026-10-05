'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import footerVideo from '@/assets/video/form-background-video.mp4';

import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { SplitTextHover } from '@/components/animations/SplitTextHover';
import { ContactFormPanel } from '@/components/navigation/ContactFormPanel';
import { usePageTransition } from '@/components/common/PageLoader';

const ease = [0.16, 1, 0.3, 1] as const;

// ============================================================
// LIVE TIME
// ============================================================

function useCurrentTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();

      const formatted = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      setTime(`IST → ${formatted}`);
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}

// ============================================================
// FOOTER LINK
// ============================================================

function FooterLink({ children, href, onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) {
  const content = (
    <span className="group relative inline-flex w-full items-center justify-between">
      <span>{children}</span>

      <span className="ml-3 text-[11px] transition-transform duration-500 ease-out group-hover:translate-x-1">→</span>

      <span className="absolute -bottom-[6px] left-0 h-px w-full origin-left scale-x-100 bg-white/60 transition-transform duration-500 ease-out group-hover:scale-x-75" />
    </span>
  );

  if (href) {
    return (
      <a href={href} className="block w-full text-[11px] uppercase text-white/80 [word-spacing:4px] sm:text-[11px] md:text-[12px]">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="block w-full text-left text-[10px] uppercase tracking-[0.04em] text-white/80 sm:text-[11px] md:text-[11px]">
      {content}
    </button>
  );
}

// ============================================================
// FOOTER
// ============================================================

export function Footer() {
  const currentTime = useCurrentTime();

  const [contactOpen, setContactOpen] = useState(false);

  // ============================================================
  // CONTACT
  // ============================================================

  const handleDiscussProject = () => {
    setContactOpen(true);
  };

  const closeContact = () => {
    setContactOpen(false);
  };

  // ============================================================
  // PORTFOLIO
  // ============================================================

  const go = usePageTransition();

  return (
    <>
      <footer id="contact" className="relative min-h-[420px] overflow-hidden bg-[#050609] text-[#eeeeee] lg:min-h-screen">
        {/* ======================================================
            VIDEO BACKGROUND
        ====================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <video src={footerVideo} autoPlay muted loop playsInline preload="auto" controls={false} className="h-full w-full select-none object-cover" />

          <div className="absolute inset-0 bg-[#050609]/70" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.45)_100%)]" />
        </div>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <div className="relative z-10 mx-auto mt-5 flex w-full max-w-[1920px] flex-col px-4 pb-0 pt-5 sm:mt-20 sm:min-h-0 sm:px-5 sm:pt-5 md:mt-20 md:min-h-0 md:px-7 lg:min-h-screen lg:px-[25px]">
          {/* ====================================================
              TOP BAR
          ==================================================== */}

          <div className="flex items-start justify-between">
            <p className="text-[13px] font-light uppercase leading-none tracking-[-0.01em] text-white/85 sm:text-[14px] md:text-[14px] lg:text-[14px]">LET&apos;S BUILD WORK THAT INSPIRES.</p>

            <p className="text-[8px] font-light leading-none text-white/45 sm:text-[9px] md:text-[13px] lg:text-[13px]">{currentTime}</p>
          </div>

          {/* ====================================================
              HERO / CTA
          ==================================================== */}

          <div className="mt-[20px] sm:mt-[30px] md:mt-[15px] lg:mt-[10px]">
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-0 md:grid-cols-[minmax(0,1fr)_400px] md:gap-10 lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-20">
              {/* ==================================================
                  TITLE
              ================================================== */}

              <div>
                <motion.h2
                  initial={{
                    opacity: 0,
                    y: 45,
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
                    duration: 1,
                    ease,
                  }}
                  className="max-w-[760px] text-[clamp(2.6rem,9vw,3.5rem)] font-light leading-[0.88] tracking-[-0.065em] text-[#eeeeee] sm:text-[clamp(3rem,7vw,4rem)] md:text-[clamp(3rem,6vw,4.8rem)] lg:text-[clamp(3rem,4.8vw,7rem)]"
                >
                  Ready to build
                  <br />
                  something bold?
                </motion.h2>
              </div>

              {/* ==================================================
                  CTA
              ================================================== */}

              <div className="w-[190px] pt-0 sm:ml-auto sm:w-[180px] sm:pt-0 md:ml-0 md:w-full md:pt-[60px] lg:w-full lg:pt-[125px]">
                <div className="flex flex-col items-end gap-7 md:grid md:grid-cols-2 md:gap-x-[40px] lg:grid lg:grid-cols-2 lg:gap-x-[28px]">
                  {/* DISCUSS PROJECT */}

                  <AnimatedButton
                    variant="animated"
                    onClick={handleDiscussProject}
                    borderColor="rgba(255, 255, 255, 0.8)"
                    icon="right"
                    charShift={37}
                    charStagger={0.025}
                    charDuration={0.75}
                    widthClassName="w-[180px] sm:w-[180px] md:w-[180px] lg:w-[180px] font-mono"
                  >
                    DISCUSS YOUR PROJECT
                  </AnimatedButton>

                  {/* VIEW PROJECTS */}

                  <AnimatedButton
                    variant="animated"
                    onClick={() => go('/portfolio', 'WORK')}
                    borderColor="rgba(255, 255, 255, 0.8)"
                    icon="right"
                    charShift={58}
                    charStagger={0.025}
                    charDuration={0.75}
                    widthClassName="w-[180px] sm:w-[180px] md:w-[180px] lg:w-[180px] font-mono"
                  >
                    VIEW OUR PROJECT
                  </AnimatedButton>
                </div>
              </div>
            </div>

            {/* ==================================================
                INFORMATION
            ================================================== */}

            <div className="mt-[25px] grid grid-cols-1 gap-5 sm:mt-[70px] sm:grid-cols-[minmax(0,1fr)_400px] sm:gap-10 md:mt-[70px] md:grid-cols-[minmax(0,1fr)_400px] md:gap-10 lg:mt-[65px] lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-20">
              {/* ==================================================
                  LEFT AREA
              ================================================== */}

              <div className="flex flex-col gap-8 sm:gap-[30px] md:gap-[40px] lg:gap-[55px]">
                {/* COPYRIGHT */}

                <p className="order-2 hidden text-[12px] uppercase tracking-[-0.01em] text-white/35 sm:block sm:text-[10px] md:order-1 md:text-[14px] lg:text-[14px]">©ASHENOX® 2026</p>

                {/* SOUND */}

                <div className="order-3 hidden items-center gap-2 text-[12px] uppercase tracking-[0.02em] text-white/70 sm:block sm:text-[9px] md:order-2 md:flex lg:text-[9px]">
                  <span>TOUCH THE WORK. FEEL IT.</span>
                </div>
              </div>

              {/* ==================================================
                  RIGHT INFORMATION
              ================================================== */}

              <div className="order-1 grid grid-cols-2 gap-x-8 md:order-2 md:gap-x-[40px] lg:gap-x-[40px] xl:gap-x-[30px] 2xl:gap-x-[30px]">
                {/* ==================================================
                    BUSINESS ENQUIRY
                ================================================== */}

                <div>
                  <p className="text-[13px] uppercase tracking-[-0.01em] text-white/40 sm:text-[10px] md:text-[13px] lg:text-[14px]">BUSINESS ENQUIRY</p>

                  <div className="mt-3 space-y-1 text-[12px] leading-[1.45] tracking-[-0.02em] text-white/75 sm:text-[11px] md:mt-4 md:text-[13px] lg:text-[14px]">
                    <p>
                      <span className="mr-2 text-white/35">E.</span>

                      <a href="mailto:info@ashenox.com" className="transition-colors hover:text-white">
                        <SplitTextHover text="info@ashenox.com" />
                      </a>
                    </p>

                    <p>
                      <span className="mr-2 text-white/35">P.</span>

                      <a href="tel:+917205044122" className="tracking-[0.015em] transition-colors hover:text-white">
                        <SplitTextHover text="+91 7205044122" />
                      </a>
                    </p>
                  </div>
                </div>

                {/* ==================================================
                    SOCIAL
                ================================================== */}

                <div>
                  <p className="text-[13px] uppercase tracking-[-0.02em] text-white/40 sm:text-[10px] md:text-[13px] lg:text-[14px]">SOCIAL</p>

                  <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-1 text-[12px] leading-[1.45] tracking-[-0.02em] text-white/75 sm:text-[11px] md:mt-4 md:gap-x-8 md:text-[13px] lg:gap-x-1 lg:text-[14px]">
                    <a href="https://www.linkedin.com/company/ashenox" className="transition-colors hover:text-white" target="_blank" rel="noreferrer">
                      <SplitTextHover text="Linkedin" />
                    </a>

                    <a href="https://www.instagram.com/ashenox.creative/" className="text-right transition-colors hover:text-white" target="_blank" rel="noreferrer">
                      <SplitTextHover text="Instagram" />
                    </a>

                    <a href="https://www.behance.net/ashishbehera10" className="transition-colors hover:text-white" target="_blank" rel="noreferrer">
                      <SplitTextHover text="Behance" />
                    </a>

                    <a href="https://www.youtube.com/@Ashenox07" className="text-right transition-colors hover:text-white" target="_blank" rel="noreferrer">
                      <SplitTextHover text="YouTube" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              ASHENOX SCANLINE LOGO
          ============================================================ */}

          <div className="relative mt-[5px] h-[88px] w-full overflow-hidden sm:mt-[30px] sm:h-[105px] md:mt-[35px] md:h-[180px] lg:mt-auto lg:h-[400px] xl:h-[320px]">
            <div className="absolute bottom-0 left-0 flex w-full select-none items-end justify-center overflow-visible">
              {'ASHENOX'.split('').map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  className="inline-block shrink-0 text-[25.5vw] font-black font-semibold leading-[0.7] tracking-[-0.1em] text-transparent sm:text-[26vw] sm:tracking-[-0.1em] md:text-[26vw] md:tracking-[-0.1em] lg:text-[25vw] lg:tracking-[-0.08em] xl:text-[26vw]"
                  style={{
                    WebkitTextStroke: '0px transparent',

                    backgroundImage: `
                      repeating-linear-gradient(
                        to bottom,
                        rgba(255,255,255,0.24) 0px,
                        rgba(255,255,255,0.24) 1px,
                        transparent 1px,
                        transparent 6px
                      )
                    `,

                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================
          CONTACT FORM
      ============================================================ */}

      <ContactFormPanel open={contactOpen} onClose={closeContact} />
    </>
  );
}
