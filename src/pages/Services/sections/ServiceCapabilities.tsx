'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';

import { services, type Service } from '@/data/services.data';
import { createWordAnimation } from '@/components/animations/wordAnimation';

gsap.registerPlugin(ScrollTrigger);

const ease = [0.16, 1, 0.3, 1] as const;

/* ============================================================
   UTILS
============================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/* ============================================================
   SERVICE VISUAL
============================================================ */

function ServiceVisual({ service }: { service: Service }) {
  return (
    <div className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', service.theme === 'dark' ? 'bg-[#050609]' : 'bg-[#fff]')}>
      <div className={cn('absolute left-1/2 top-[18%] z-20 w-[70%] -translate-x-1/2 text-center md:top-[21%] md:w-[70%]', service.theme === 'dark' ? 'text-white/80' : 'text-black/70')}>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-[180px] text-[11px] font-medium uppercase leading-[1.15] tracking-[-0.02em] sm:text-[13px] md:max-w-[220px]"
        >
          {createWordAnimation(service.visualText) || createWordAnimation('INTEGRATED SEAMLESSLY INTO EXISTING PLATFORMS.')}
        </motion.p>
      </div>

      <div className="relative top-[10%] z-10 w-[90%] overflow-hidden rounded-[8px] md:top-[5%] md:w-[90%] lg:w-[70%]">
        <img
          src={service.image}
          alt={service.title}
          className="relative z-10 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   CAPABILITIES
============================================================ */

interface CapabilitiesProps {
  items: string[];
  variant?: 'desktop' | 'mobile';
}

function Capabilities({ items, variant = 'desktop' }: CapabilitiesProps) {
  const isMobile = variant === 'mobile';

  return (
    <div className={isMobile ? 'mt-10' : 'mt-6 sm:mt-10'}>
      <p className={isMobile ? 'mb-3 text-[13px] uppercase opacity-40' : 'mb-4 mt-16 text-[14px] uppercase tracking-[-0.01em] text-black/40 sm:text-[13px]'}>OUR CORE CAPABILITIES</p>

      <div>
        {items.map((item, index) => (
          <motion.div
            key={item}
            initial={{
              opacity: 0,
              x: isMobile ? 15 : 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: isMobile ? 0.5 : 0.4,
            }}
            transition={{
              duration: isMobile ? 0.5 : 0.55,
              delay: index * 0.04,
              ease,
            }}
            className={
              isMobile
                ? 'border-current/20 flex min-h-[38px] w-full items-center border-b text-[14px] tracking-[-0.02em]'
                : 'group flex min-h-[42px] w-full max-w-[330px] items-center border-b border-black/80 text-[15px] tracking-[-0.03em] sm:text-[16px]'
            }
          >
            {isMobile ? item : <span className="transition-transform duration-500">{item}</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SERVICE CAPABILITIES
============================================================ */

export function ServiceCapabilities() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const articles = gsap.utils.toArray<HTMLElement>('.service-article');

      articles.forEach((article, index) => {
        const visual = article.querySelector('.service-visual-pin') as HTMLElement | null;

        const rightCol = article.querySelector('.service-content-col') as HTMLElement | null;

        const plus = article.querySelector('.service-plus') as HTMLElement | null;

        if (!visual || !rightCol || !plus) return;

        const isLastService = index === articles.length - 1;

        /* ======================================================
           PLUS INITIAL STATE
        ====================================================== */

        gsap.set(plus, {
          rotation: 0,
          transformOrigin: '50% 50%',
        });

        /* ======================================================
           1. LEFT VISUAL PIN

           KEEPING YOUR ORIGINAL BEHAVIOR.
        ====================================================== */

        ScrollTrigger.create({
          trigger: article,

          start: 'top top',

          end: isLastService ? 'bottom bottom' : () => `+=${Math.max(rightCol.offsetHeight - window.innerHeight, window.innerHeight)}`,

          pin: visual,

          pinSpacing: false,

          invalidateOnRefresh: true,

          markers: false,
        });

        /* ======================================================
           2. PLUS ROTATION

           New service:

           bottom
              ↓
              ↓  0 → 360
              ↓
             top

           This trigger ONLY controls rotation.
           It does not pin anything.
        ====================================================== */

        ScrollTrigger.create({
          trigger: article,

          start: 'top bottom',

          end: 'top top',

          scrub: true,

          markers: false,

          onUpdate: (self) => {
            gsap.set(plus, {
              rotation: self.progress * 360,
            });
          },

          onLeave: () => {
            /*
             * At top, make sure the Plus is visually
             * back to its normal "+" orientation.
             */
            gsap.set(plus, {
              rotation: 0,
            });
          },

          onEnterBack: () => {
            gsap.set(plus, {
              rotation: 0,
            });
          },
        });

        /* ======================================================
           3. PLUS PIN

           Once the service reaches top:

           Plus stays at the top-right corner of
           the left panel.

           This is separate from the left visual pin.
        ====================================================== */

        ScrollTrigger.create({
          trigger: article,

          start: 'top top',

          end: isLastService ? 'bottom bottom' : () => `+=${Math.max(rightCol.offsetHeight - window.innerHeight, window.innerHeight)}`,

          pin: plus,

          pinSpacing: false,

          invalidateOnRefresh: true,

          markers: false,

          onEnter: () => {
            gsap.set(plus, {
              rotation: 0,
            });
          },

          onEnterBack: () => {
            gsap.set(plus, {
              rotation: 0,
            });
          },
        });
      });

      /* ======================================================
         WAIT FOR IMAGES
      ====================================================== */

      const imgs = Array.from(sectionRef.current?.querySelectorAll('img') ?? []);

      Promise.all(
        imgs.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }

              img.addEventListener('load', () => resolve(), { once: true });

              img.addEventListener('error', () => resolve(), { once: true });
            })
        )
      ).then(() => {
        ScrollTrigger.refresh();
      });

      /* ======================================================
         FALLBACK REFRESH
      ====================================================== */

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => clearTimeout(timer);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white text-[#111318]">
      {/* ========================================================
          DESKTOP
      ======================================================== */}

      <div className="hidden md:block">
        {services.map((service, index) => (
          <article
            key={service.id}
            className="service-article relative w-full"
            style={{
              zIndex: index + 1,
            }}
          >
            <div className="relative flex w-full">
              {/* ==================================================
                  LEFT 50% VISUAL
              ================================================== */}

              <div className="service-visual-pin relative h-screen w-1/2 overflow-hidden">
                <ServiceVisual service={service} />

                <div className="absolute bottom-8 left-6 z-40 sm:left-10">
                  <div className={cn('text-[11px] uppercase', service.theme === 'dark' ? 'text-white/40' : 'text-black/40')}>
                    {String(index + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                  </div>
                </div>
              </div>

              {/* ==================================================
                  PLUS

                  IMPORTANT:
                  - Outside .service-visual-pin
                  - Inside .service-article
                  - left-1/2 = right edge of left panel
                  - top-0 = top edge of service
              ================================================== */}

              <div className="service-plus-wrapper pointer-events-none absolute left-1/2 top-0 z-[100] h-px w-px" aria-hidden="true">
                <span className="service-plus absolute left-0 top-[-9px] flex h-[18px] w-[18px] -translate-x-1/2 items-center justify-center text-black/60">
                  <Plus size={18} strokeWidth={1.5} />
                </span>
              </div>

              {/* ==================================================
                  RIGHT CONTENT
              ================================================== */}

              <div className="service-content-col relative flex min-h-screen w-1/2 items-center border-l border-black/10 bg-white">
                <div className="w-full py-20 md:px-[8vw] lg:px-[8vw]">
                  <motion.h2
                    initial={{
                      opacity: 0,
                      y: 35,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.35,
                    }}
                    transition={{
                      duration: 0.8,
                      ease,
                    }}
                    className="max-w-[600px] text-[clamp(1.7rem,3vw,1.5rem)] font-light leading-[0.9] tracking-[-0.045em] text-black/75"
                  >
                    {service.title}
                  </motion.h2>

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.35,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 0.08,
                      ease,
                    }}
                    className="mt-4 max-w-[340px] text-[13px] leading-[1.1] tracking-[-0.01em] text-black/65 sm:text-[14px]"
                  >
                    {service.description}
                  </motion.p>

                  <Capabilities items={service.capabilities} variant="desktop" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ========================================================
          MOBILE
      ======================================================== */}

      <div className="md:hidden">
        {services.map((service) => (
          <article key={service.id} className="relative overflow-hidden bg-white text-[#111318]">
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.75,
                ease,
              }}
              className="relative h-[400px] w-full overflow-hidden"
            >
              <ServiceVisual service={service} />

              <div className="absolute bottom-7 left-6 z-40">
                <div className={cn('text-[10px] uppercase', service.theme === 'dark' ? 'text-white/40' : 'text-black/40')}>
                  {service.number} / {String(services.length).padStart(2, '0')}
                </div>
              </div>
            </motion.div>

            <div className="px-5 pb-20 pt-6">
              <motion.h2
                initial={{
                  opacity: 0,
                  y: 25,
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
                  duration: 0.7,
                  ease,
                }}
                className="text-[clamp(1.7rem,1vw,2rem)] font-light leading-[0.9] tracking-[-0.07em]"
              >
                {service.title}
              </motion.h2>

              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
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
                  duration: 0.65,
                  delay: 0.08,
                  ease,
                }}
                className="mt-4 max-w-[310px] text-[14px] leading-[1.35] opacity-65"
              >
                {service.description}
              </motion.p>

              <Capabilities items={service.capabilities} variant="mobile" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
