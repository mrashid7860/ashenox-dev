import { Hero } from './sections/Hero';
import { HomeAbout } from './sections/HomeAbout';
import { AboutMission } from './sections/AboutMission';
import { KeyFacts } from '@/pages/Home/sections/JourneySplitFlip';
import { SelectedWork } from './sections/SelectedWork';
import { Services } from './sections/Services';
import { Process } from './sections/Process';
import { ClientStories } from '../../components/common/ClientStories';
import HomeCard from '@/pages/Home/sections/HomeCard';
import { AeroBackground } from '@/components/common/AeroBackground';

export function Home() {
  return (
    <>
      {/* ========================================
          AERO BACKGROUND AREA
          Only Hero + HomeAbout + AboutMission
      ======================================== */}
      <section className="relative">
        {/* Background */}
        <div className="pointer-events-none sticky top-0 z-0 h-screen w-full">
          <AeroBackground />
        </div>

        {/* Content */}
        <div className="relative z-10 -mt-[100vh]">
          <Hero />
          <HomeAbout />
          <AboutMission />
        </div>
      </section>

      {/* ========================================
          REST OF PAGE
      ======================================== */}
      <KeyFacts />
      <SelectedWork />
      <Services />
      <Process />
      <ClientStories />
      <HomeCard />
    </>
  );
}
