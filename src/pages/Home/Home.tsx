import { Hero } from './sections/Hero';
import { HomeAbout } from './sections/HomeAbout';
import { AboutMission } from './sections/AboutMission';
import { KeyFacts } from '@/pages/Home/sections/JourneySplitFlip';
import { SelectedWork } from './sections/SelectedWork';
import { Services } from './sections/Services';
import { Process } from './sections/Process';
import { ClientStories } from '../../components/common/ClientStories';
import HomeCard from '@/pages/Home/sections/HomeCard';
export function Home() {
  return (
    <>
      <Hero />
      <HomeAbout />
      <AboutMission />
      <KeyFacts />
      <SelectedWork />
      <Services />
      <Process />
      <ClientStories />
      <HomeCard />
    </>
  );
}
