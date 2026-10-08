'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';

import { JOURNEY_HEIGHT_VH, JOURNEY_OVERLAP_VH, WIRE_ORIGIN, getConnectionPoint } from '@/utils/journey';

import { JOURNEY_POINTS } from '@/data/journey.data';

import { WireSegment } from '@/pages/Portfolio/sections/WireSegment';
import { JourneyConnectionPoint } from '@/pages/Portfolio/sections/JourneyConnectionPoint';
import { JourneyCard } from '@/pages/Portfolio/sections/JourneyCard';

/* ============================================================
   MOBILE CARD POSITIONS

   These MUST stay in sync with JourneyCard.tsx
============================================================ */

const MOBILE_CARD_TOP_OFFSET = 42;
const MOBILE_POINT_OFFSET_VH = 0;

const MOBILE_PROJECT_Y = [
  8 + MOBILE_CARD_TOP_OFFSET,
  82 + MOBILE_CARD_TOP_OFFSET,
  156 + MOBILE_CARD_TOP_OFFSET,
  230 + MOBILE_CARD_TOP_OFFSET,
  304 + MOBILE_CARD_TOP_OFFSET,
  378 + MOBILE_CARD_TOP_OFFSET,
  452 + MOBILE_CARD_TOP_OFFSET,
  526 + MOBILE_CARD_TOP_OFFSET,
];

const MOBILE_CONTACT_Y = 610 + MOBILE_CARD_TOP_OFFSET;

const MOBILE_POINT_X = [
  50, // card 1 - center
  35, // card 2 - left
  65, // card 3 - right
  42, // card 4 - slightly left
  58, // card 5 - slightly right
  30, // card 6 - left
  70, // card 7 - right
  50, // card 8 - center
];

/* ============================================================
   MOBILE CONNECTION POINT
============================================================ */

function getMobileConnectionPoint(point: (typeof JOURNEY_POINTS)[number], index: number) {
  const isContact = point.type === 'contact';

  const cardY = isContact ? MOBILE_CONTACT_Y : (MOBILE_PROJECT_Y[index] ?? MOBILE_CARD_TOP_OFFSET);

  return {
    x: isContact ? 50 : (MOBILE_POINT_X[index] ?? 50),
    y: Math.max(0, cardY - MOBILE_POINT_OFFSET_VH),
  };
}

/* ============================================================
   WIRE JOURNEY
============================================================ */

export function WireJourney() {
  const journeyRef = useRef<HTMLDivElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  /* ==========================================================
     MOBILE DETECTION
  ========================================================== */

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const update = () => {
      setIsMobile(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  /* ==========================================================
     RESPONSIVE JOURNEY HEIGHT

     Mobile      = 700vh
     Tablet/Desktop = 890vh
  ========================================================== */

  const journeyHeight = isMobile ? 700 : JOURNEY_HEIGHT_VH;

  /* ==========================================================
     SCROLL
  ========================================================== */

  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ['start center', 'end end'],
  });

  const scrollableHeight = journeyHeight - JOURNEY_OVERLAP_VH;

  /* ==========================================================
     CONNECTION POINTS
  ========================================================== */

  const connectionPoints = useMemo(() => {
    return JOURNEY_POINTS.map((point, index) => {
      if (isMobile) {
        return getMobileConnectionPoint(point, index);
      }

      return getConnectionPoint(point);
    });
  }, [isMobile]);

  /* ==========================================================
     WIRE SEGMENTS

     IMPORTANT:
     First segment always starts from
     the SAME WIRE_ORIGIN as desktop.
  ========================================================== */

  const segments = useMemo(() => {
    return JOURNEY_POINTS.map((_point, index) => {
      const start = index === 0 ? WIRE_ORIGIN : connectionPoints[index - 1];

      const end = connectionPoints[index];

      return {
        start,
        end,
      };
    });
  }, [connectionPoints]);

  /* ==========================================================
     REVEAL PROGRESS
  ========================================================== */

  const revealProgresses = useMemo(() => {
    return connectionPoints.map((connection) => {
      return Math.min(0.995, Math.max(0, connection.y / scrollableHeight));
    });
  }, [connectionPoints, scrollableHeight]);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section
      ref={journeyRef}
      className="relative z-10 w-full overflow-visible bg-transparent max-md:overflow-x-clip"
      style={{
        height: `${journeyHeight}vh`,
        marginTop: `-${JOURNEY_OVERLAP_VH}vh`,
      }}
    >
      {/* ======================================================
          WIRES
      ====================================================== */}

      <svg className="pointer-events-none absolute left-0 top-0 z-[100] h-full w-full overflow-visible" viewBox={`0 0 100 ${journeyHeight}`} preserveAspectRatio="none">
        {/* ====================================================
            WIRE SEGMENTS
        ==================================================== */}

        {segments.map((segment, index) => {
          const previousPointY = segment.start.y;
          const currentPointY = segment.end.y;

          const startProgress = Math.min(1, Math.max(0, previousPointY / scrollableHeight));

          const endProgress = Math.min(1, Math.max(0, currentPointY / scrollableHeight));

          /*
           * Start slightly before the previous
           * point so there is no visible gap.
           */
          const segmentStart = index === 0 ? 0 : Math.max(0, startProgress - 0.001);

          const segmentEnd = Math.min(1, endProgress);

          return (
            <WireSegment
              key={`segment-${index}`}
              start={segment.start}
              end={segment.end}
              progressStart={segmentStart}
              progressEnd={segmentEnd}
              segmentIndex={index}
              journeyProgress={scrollYProgress}
            />
          );
        })}

        {/* ====================================================
            CONNECTION DOTS
        ==================================================== */}

        {connectionPoints.map((connection, index) => (
          <JourneyConnectionPoint key={`point-${index}`} x={connection.x} y={connection.y} progress={revealProgresses[index]} journeyProgress={scrollYProgress} />
        ))}
      </svg>

      {/* ======================================================
          JOURNEY CARDS
      ====================================================== */}

      {JOURNEY_POINTS.map((project, index) => (
        <JourneyCard key={`journey-card-${index}`} project={project} revealProgress={revealProgresses[index]} journeyProgress={scrollYProgress} />
      ))}

      {/* ======================================================
          VIGNETTE
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-30 hidden bg-[radial-gradient(circle_at_center,transparent_35%,rgba(3,4,5,0.35)_100%)]" />
    </section>
  );
}
