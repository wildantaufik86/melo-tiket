import HeroSection from '@/components/pages/homePage/HeroSection';
import TicketSection from '@/components/pages/homePage/TicketSection';

export default function homepage() {
  return (
    <main className="pt-32">
      <div className="relative bg-[url(/images/dark-gradient.jpg)] bg-cover bg-center bg-no-repeat aspect-square">
        <HeroSection />
        <TicketSection />
      </div>
    </main>
  );
}
