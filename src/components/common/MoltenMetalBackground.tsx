'use client';

import MoltenMetal from '@/components/common/MoltenMetal';

export function MoltenMetalBackground() {
  return (
    <div className="absolute inset-0 h-screen w-full overflow-hidden">
      <MoltenMetal
        color1="#896ABD"
        color2="#A855F7"
        color3="#FFFFFF"
        speed={0.35}
        scale={4}
        detail={3}
        glow={1.6}
        coreSize={0.1}
        swirl={1}
        fold={-0.2}
        blackPoint={0.05}
        brightness={1.3}
        colorMode="molten"
        grain
        grainIntensity={0.05}
        mouseInteraction
        mouseStrength={0.3}
        opacity={1}
      />
    </div>
  );
}
