// import GalerySection from '@/components/pages/homePage/GalerySection';
// import HeroSection from '@/components/pages/homePage/HeroSection';
import SponsorSection from '@/components/pages/homePage/SponsorSection';
import { fetchEventById } from '../api/event';
import dynamic from 'next/dynamic';

const GalerySection = dynamic(() => import('@/components/pages/homePage/GalerySection'))
const HeroSection = dynamic(() => import('@/components/pages/homePage/HeroSection'))
const TicketSection = dynamic(() => import('@/components/pages/homePage/TicketSection'))

async function getEventData() {
  try {
    const response = await fetchEventById('6899f694bbde0daae146f849');
    if (response.status === 'success' && response.data) {
      return {
        ...response.data.event,
        tickets: response.data.tickets,
      };
    }
  } catch (error) {
    console.error('Failed to fetch event data:', error);
  }
  return null;
}

export default async function homepage() {
  const eventData = await getEventData();
  return (
    <div className="bg-[url(/images/dark-gradient.webp)] bg-cover bg-center bg-no-repeat min-h-screen pt-32">
      <div className="relative">
        <HeroSection />
        <TicketSection event={eventData}/>
        <GalerySection />
        <SponsorSection />
      </div>
    </div>
  );
}
