import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createWordAnimation } from '@/components/animations/wordAnimation';

import pc_secure from '@/assets/img/Partner/pc_secure.webp';
import coco from '@/assets/img/Partner/coco.webp';
import fitanaz from '@/assets/img/Partner/fitanaz.webp';
import kao from '@/assets/img/Partner/kao.webp';
import korra from '@/assets/img/Partner/korra.webp';
import bytewise from '@/assets/img/Partner/bytewise.webp';
import purple_mars from '@/assets/img/Partner/purple_mars.webp';
import criss from '@/assets/img/Partner/criss-cross.png';

interface BrandItem {
  label: string;
  image: string;
  rotate: number;
}

const BRANDS: BrandItem[] = [
  {
    label: 'PC Secure',
    image: pc_secure,
    rotate: -6,
  },
  {
    label: 'COC',
    image: coco,
    rotate: 5,
  },
  {
    label: 'FitAnaz',
    image: fitanaz,
    rotate: -4,
  },
  {
    label: 'Kao',
    image: kao,
    rotate: 7,
  },
  {
    label: 'Korra',
    image: korra,
    rotate: -8,
  },
  {
    label: 'CrissCross',
    image: criss,
    rotate: 4,
  },
  {
    label: 'Bytewise',
    image: bytewise,
    rotate: -5,
  },
  {
    label: 'Purple Mars',
    image: purple_mars,
    rotate: 6,
  },
];

const PARTNER_COLUMNS = [
  ['Fiare Oy', 'Nettiauto', 'Budo Law', 'DAC Recruiting', 'Globalstar'],
  ['RevNet', 'ROI High', 'Flow Row', 'Vendep Oy', 'Billionaire Suit'],
  ['Berkley', 'Re.Events', 'Cirgo Bike', 'Julia Daviy', 'FieldBridge LLC'],
  ['Vendep Oy', 'SoundBoard AI', 'Mizuno CGI', 'Joonko', 'Many more...'],
];

const CARD_WIDTH = 180;
const GAP_ABOVE_TEXT = 110;

export function BrandsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [hovered, setHovered] = useState<number | null>(null);

  const [cardPos, setCardPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleEnter = (index: number) => {
    const wordEl = wordRefs.current[index];
    const containerEl = containerRef.current;

    if (!wordEl || !containerEl) return;

    const wordRect = wordEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    const top = wordRect.top - containerRect.top - GAP_ABOVE_TEXT;

    const left = wordRect.left - containerRect.left + wordRect.width / 2 - CARD_WIDTH / 2;

    setCardPos({
      top,
      left,
    });

    setHovered(index);
  };

  const handleLeave = () => {
    setHovered(null);
  };

  return (
    <section ref={containerRef} className="relative w-full bg-white py-32 sm:px-4 md:px-6">
      {/* =========================================
          TITLE
      ========================================= */}
      <div className="mb-16 text-center">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.4,
          }}
          className="text-[14px] uppercase leading-[1] tracking-[0.03em] md:text-[13px]"
        >
          {createWordAnimation("Brands we've.")}
          <br />
          {createWordAnimation('partnered with')}
        </motion.p>
      </div>

      {/* =========================================
          HOVER CARD
          HIDDEN ON MOBILE
      ========================================= */}
      <AnimatePresence>
        {hovered !== null && cardPos && (
          <motion.div
            key={hovered}
            initial={{
              opacity: 0,
              scale: 0.85,
              y: 12,
              rotate: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: BRANDS[hovered].rotate,
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              y: 12,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 24,
            }}
            style={{
              position: 'absolute',
              top: cardPos.top,
              left: cardPos.left,
              width: CARD_WIDTH,
              pointerEvents: 'none',
            }}
            className="z-20 hidden origin-bottom md:block"
          >
            <img src={BRANDS[hovered].image} alt={BRANDS[hovered].label} className="w-full rounded-lg shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          BRANDS
      ========================================= */}
      <p className="mx-auto pt-1 text-center text-[30px] leading-[1.15] sm:text-[50px] md:max-w-4xl md:pt-16 md:text-[60px] xl:text-[65px] 2xl:max-w-3xl 2xl:text-[60px]">
        {BRANDS.map((brand, index) => (
          <span key={brand.label}>
            <span
              ref={(el) => {
                wordRefs.current[index] = el;
              }}
              onMouseEnter={() => handleEnter(index)}
              onMouseLeave={handleLeave}
              className={`cursor-default transition-colors duration-300 ${hovered === null ? 'text-neutral-800' : hovered === index ? 'text-neutral-900' : 'text-neutral-300'} `}
            >
              {brand.label}
            </span>

            {index < BRANDS.length - 1 && <span className={`transition-colors duration-300 ${hovered === null || hovered === index ? 'text-neutral-800' : 'text-neutral-300'} `}>, </span>}
          </span>
        ))}
      </p>

      {/* =========================================
          PARTNER LIST
      ========================================= */}
      <div className="mx-auto mt-10 w-full">
        {/* =======================================
            MOBILE
            ORIGINAL 4 COLUMNS → COMBINED INTO 2

            LEFT  = COLUMN 1 + COLUMN 2
            RIGHT = COLUMN 3 + COLUMN 4

            ONE VERTICAL LINE IN CENTER
        ======================================= */}
        {/* MOBILE — 2 CENTERED COLUMNS */}
        <div className="mx-auto grid w-fit grid-cols-2 md:hidden">
          {/* LEFT */}
          <div className="flex flex-col items-start pr-6 text-left">
            {PARTNER_COLUMNS[0].map((name) => (
              <span key={`mobile-col-1-${name}`} className="text-[16px] leading-[1.6] text-neutral-400">
                {name}
              </span>
            ))}

            {PARTNER_COLUMNS[1].map((name) => (
              <span key={`mobile-col-2-${name}`} className="text-[16px] leading-[1.6] text-neutral-400">
                {name}
              </span>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-start border-l border-neutral-200 pl-6 text-left">
            {PARTNER_COLUMNS[2].map((name) => (
              <span key={`mobile-col-3-${name}`} className="text-[16px] leading-[1.6] text-neutral-400">
                {name}
              </span>
            ))}

            {PARTNER_COLUMNS[3].map((name) => (
              <span key={`mobile-col-4-${name}`} className={name === 'Many more...' ? 'text-[16px] leading-[1.6] text-neutral-300' : 'text-[16px] leading-[1.6] text-neutral-400'}>
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* =======================================
            TABLET + DESKTOP
            ORIGINAL 4 COLUMN LAYOUT
            UNCHANGED
        ======================================= */}
        <div className="mx-auto hidden w-fit md:grid md:grid-cols-4 md:divide-x md:divide-neutral-200">
          {PARTNER_COLUMNS.map((col, i) => (
            <div key={i} className="flex min-w-[110px] flex-col items-start gap-0 px-4 py-0 text-left first:pl-0 last:pr-0">
              {col.map((name) => (
                <span key={name} className={name === 'Many more...' ? 'text-[14px] text-neutral-300' : 'text-[14px] text-neutral-400'}>
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          BOTTOM TEXT
      ========================================= */}
      <p className="mt-16 w-full text-center text-[13px]">✦ PARTNERSHIPS BUILT ON TRUST, CRAFT, AND RESULTS.</p>

      {/* <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.4,
        }}
        className="mt-16 w-full text-center text-[13px]"
      >
        {createWordAnimation('✦ PARTNERSHIPS BUILT ON TRUST, CRAFT, AND RESULTS.')}
      </motion.p> */}
    </section>
  );
}
