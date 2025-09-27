import GalerySection from '@/components/pages/homePage/GalerySection';
import HeroSection from '@/components/pages/homePage/HeroSection';
import SponsorSection from '@/components/pages/homePage/SponsorSection';
import TicketSection from '@/components/pages/homePage/TicketSection';

export default function homepage() {
  return (
    <div className="bg-[url(/images/dark-gradient.jpg)] bg-cover bg-center bg-no-repeat min-h-screen pt-32">
      <div className="relative">
        <HeroSection />
        <TicketSection />
        <GalerySection />
        <SponsorSection />
      </div>
    </div>
  );
}
