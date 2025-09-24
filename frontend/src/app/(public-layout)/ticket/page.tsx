import HeroSection from '@/components/pages/homePage/HeroSection';
import AboutSection from '@/components/pages/ticket/AboutSection';
import HeaderSection from '@/components/pages/ticket/HeaderSection';
import ListTicketSection from '@/components/pages/ticket/ListTicketSection';

export default function TicketPage() {
  // default detail event page, remove if not used again
  return (
    <section className="bg-[url(/images/dark-gradient.jpg)] bg-cover bg-center bg-no-repeat min-h-screen pt-32">
      <div className="relative flex flex-col">
        <HeroSection />
        <HeaderSection />
      </div>
      <div className="flex flex-col mt-8 pd-full md:flex-row md:gap-6 lg:gap-12">
        <AboutSection />
        {/* <ListTicketSection /> */}
      </div>
    </section>
  );
}
