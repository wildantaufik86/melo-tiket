import SponsorCard from '@/components/fragments/card/SponsorCard';
import Label from '@/components/fragments/label/Label';
import Image from 'next/image';

type Sponsor = {
  id: number;
  url: string;
  alt: string;
};

const dummyData: Sponsor[] = [
  {
    id: 1,
    url: '/images/sponsor-1.png',
    alt: 'adidas',
  },
  {
    id: 2,
    url: '/images/sponsor-2.png',
    alt: 'spotify',
  },
  {
    id: 3,
    url: '/images/sponsor-3.png',
    alt: 'netflix',
  },
];

const dummyDataMedia: Sponsor[] = [
  {
    id: 1,
    url: '/images/sponsor-1.png',
    alt: 'adidas',
  },
  {
    id: 2,
    url: '/images/sponsor-2.png',
    alt: 'spotify',
  },
  {
    id: 3,
    url: '/images/sponsor-3.png',
    alt: 'netflix',
  },
  {
    id: 4,
    url: '/images/sponsor-1.png',
    alt: 'adidas',
  },
  {
    id: 5,
    url: '/images/sponsor-2.png',
    alt: 'spotify',
  },
  {
    id: 6,
    url: '/images/sponsor-3.png',
    alt: 'netflix',
  },
  {
    id: 7,
    url: '/images/sponsor-1.png',
    alt: 'adidas',
  },
  {
    id: 8,
    url: '/images/sponsor-2.png',
    alt: 'spotify',
  },
  {
    id: 9,
    url: '/images/sponsor-3.png',
    alt: 'netflix',
  },
  {
    id: 10,
    url: '/images/sponsor-1.png',
    alt: 'adidas',
  },
  {
    id: 11,
    url: '/images/sponsor-2.png',
    alt: 'spotify',
  },
  {
    id: 12,
    url: '/images/sponsor-3.png',
    alt: 'netflix',
  },
];

export default function SponsorSection() {
  return (
    <section className="relative pd-full py-30">
      <div className="flex flex-col">
        <div className="absolute left-0 w-full md:max-w-[80%] lg:max-w-[60%] aspect-square">
          <Image
            src="/images/accesoris.png"
            alt="accessoris left"
            fill
            className="object-contain object-center"
          />
        </div>

        <div className="flex flex-col gap-8">
          <Label text="SPONSOR" />
          <div className="grid grid-cols-3 gap-4 place-items-center mt-8">
            {/* {dummyData.map((sponsort) => (
              <SponsorCard
                key={sponsort.id}
                url={sponsort.url}
                alt={sponsort.alt}
              />
            ))} */}
          </div>
        </div>
        <div className="flex flex-col gap-8 mt-12">
          <Label text="MEDIA PARTNER" />
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 place-items-center md:gap-6">
            {/* {dummyDataMedia.map((sponsort) => (
              <SponsorCard
                key={sponsort.id}
                url={sponsort.url}
                alt={sponsort.alt}
              />
            ))} */}
          </div>
        </div>
      </div>
    </section>
  );
}
