import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { NAV_CONTACT, NAV_ITEMS, SOCIAL_LINKS } from '@/data/navigation.data';
import { SplitTextHover } from '@/components/animations/SplitTextHover';
import { usePageTransition } from '@/components/common/PageLoader';

// Animation

const ease = [0.16, 1, 0.3, 1] as const;

// Types

interface MenuPanelProps {
  open: boolean;
  onClose: () => void;
}

// MENU PANEL

export function MenuPanel({ open, onClose }: MenuPanelProps) {
  const go = usePageTransition();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // NAVIGATION

  const handleNav = (path: string, label: string) => {
    onClose();
    go(path, label);
  };

  // RENDER

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ==================================================
              BACKDROP
          ================================================== */}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} onClick={onClose} className="fixed inset-0 z-[80]" />

          {/* ==================================================
              PANEL
          ================================================== */}

          <motion.div
            variants={{
              open: {
                clipPath: 'circle(150% at 100% 0%)',
                transition: {
                  duration: 1.2,
                  ease,
                },
              },
              closed: {
                clipPath: 'circle(0% at 100% 0%)',
                transition: {
                  duration: 0.4,
                  ease,
                },
              },
            }}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-0 top-0 z-[90] flex h-dvh w-full flex-col bg-black text-black shadow-[0_0_50px_rgba(0,0,0,0.1)] sm:w-[420px] md:right-3 md:top-3 md:h-[calc(100dvh-24px)] md:w-[400px] md:rounded-[7px] md:bg-white lg:right-3 lg:top-3 lg:h-[calc(100dvh-24px)] lg:w-[340px] xl:right-3 xl:top-3 xl:h-[calc(100dvh-18px)] xl:w-[340px]"
          >
            {/* ==================================================
                TOP SPACER
            ================================================== */}

            <div className="h-28 w-full shrink-0" />

            {/* ==================================================
                NAVIGATION LINKS
            ================================================== */}

            <nav className="flex flex-col px-6 md:mt-40 lg:mt-10" onMouseLeave={() => setHoveredIndex(null)}>
              {NAV_ITEMS.map((item, index) => {
                const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

                return (
                  <motion.button
                    key={item.path}
                    type="button"
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    animate={{
                      opacity: isDimmed ? 0.35 : 1,
                      y: 0,
                      filter: isDimmed ? 'grayscale(1)' : 'grayscale(0)',
                    }}
                    exit={{
                      opacity: 0,
                      y: 25,
                    }}
                    transition={{
                      opacity: { duration: index === hoveredIndex || hoveredIndex === null ? 0.5 : 0.35, ease },
                      filter: { duration: 0.35, ease },
                      y: { delay: 0.08 + index * 0.05, duration: 0.5, ease },
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onClick={() => handleNav(item.path, item.label)}
                    className="text-center text-[clamp(2.3rem,5vw,1rem)] font-light uppercase leading-[1.1] tracking-[-0.05em] text-white md:text-left md:text-[clamp(1.75rem,5vw,1rem)] md:normal-case md:leading-[1.2] md:text-black/80"
                  >
                    <SplitTextHover text={item.label} />
                  </motion.button>
                );
              })}
            </nav>

            {/* ==================================================
                THE Ashenox NAME STORY — pill button
            ================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                delay: 0.08 + NAV_ITEMS.length * 0.05,
                duration: 0.5,
                ease,
              }}
              className="mt-6 flex justify-center px-6 md:mt-6 md:justify-start"
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[13px] uppercase tracking-[0.05em] text-white/70 transition-colors hover:border-white/40 hover:text-white md:border-black/15 md:text-black/60 md:hover:border-black/30 md:hover:text-black"
              >
                <Sparkles className="h-3 w-3" />
                <SplitTextHover text="The Ashenox Name Story" />
              </button>
            </motion.div>

            {/* ==================================================
                MOBILE SEPARATOR
            ================================================== */}

            <div className="relative my-6 mt-16 flex items-center md:hidden">
              <div className="h-px flex-1 bg-white/20" />

              <span className="mx-4 text-lg font-light text-white/60">+</span>

              <div className="h-px flex-1 bg-white/20" />
            </div>

            {/* ==================================================
                BUSINESS ENQUIRY & SOCIALS
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                delay: 0.35,
                duration: 0.5,
                ease,
              }}
              className="mt-10 flex flex-col px-16 pb-8 text-center md:mt-auto md:px-6 md:pb-8 md:text-left"
            >
              {/* ==================================================
                  BUSINESS ENQUIRY
              ================================================== */}

              <p className="mb-1 text-[13px] uppercase tracking-[-0.01em] text-white/50 md:text-black/35">Business Enquiry</p>

              <div className="flex flex-col">
                <a href={`mailto:${NAV_CONTACT.email}`} className="text-md flex items-center justify-center text-white/80 transition-opacity hover:opacity-60 md:justify-start md:text-black/80">
                  <span className="text-md block w-6 shrink-0 text-white/50 md:text-black/35">E.</span>
                  <SplitTextHover text={NAV_CONTACT.email} />
                </a>

                <a
                  href={`tel:${NAV_CONTACT.phone}`}
                  className="text-md flex items-center justify-center tracking-[0.05em] text-white/80 transition-opacity hover:opacity-60 md:justify-start md:text-black/80"
                >
                  <span className="text-md block w-6 shrink-0 text-white/50 md:text-black/35">P.</span>
                  <SplitTextHover text={NAV_CONTACT.phone} />
                </a>
              </div>

              {/* ==================================================
                  SOCIAL LINKS
              ================================================== */}

              <p className="mb-1 mt-10 text-[13px] uppercase tracking-[-0.01em] text-white/50 md:text-black/35">Social</p>

              <div className="grid grid-cols-2">
                {SOCIAL_LINKS.map((social) => (
                  <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-md text-white/80 transition-opacity hover:opacity-60 md:text-black/80">
                    <SplitTextHover text={social.name} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MenuPanel;
