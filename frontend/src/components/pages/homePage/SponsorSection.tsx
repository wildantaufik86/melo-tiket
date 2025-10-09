import SponsorCard from '@/components/fragments/card/SponsorCard';
import Label from '@/components/fragments/label/Label';
import Image from 'next/image';

type Sponsor = {
  id?: number;
  url: string;
  alt: string;
};

// const sponsorData: Sponsor[] = [
//   {
//     url: '/images/bca-syariah.webp',
//     alt: 'bca-syariah-logo',
//   },
// ];

const medpartData: Sponsor[] = [
  {
    url: '/images/medpart-logo/aac-logo.webp',
    alt: 'aac-logo',
  },
  {
    url: '/images/medpart-logo/agenda-event.webp',
    alt: 'agenda-event-logo',
  },
  {
    url: '/images/medpart-logo/awak-logo.webp',
    alt: 'awak-logo',
  },
  {
    url: '/images/medpart-logo/dgigs-project.webp',
    alt: 'dgigs-project-logo',
  },
  {
    url: '/images/medpart-logo/event-daily.webp',
    alt: 'event-daily-logo',
  },
  {
    url: '/images/medpart-logo/gac-music.webp',
    alt: 'gac-msuic-logo',
  },
  {
    url: '/images/medpart-logo/hobby-konser.webp',
    alt: 'hobby-konser-logo',
  },
  {
    url: '/images/medpart-logo/infomusikita-logo.webp',
    alt: 'infomusikita-logo',
  },
  {
    url: '/images/medpart-logo/konser-daily.webp',
    alt: 'konser-daily-logo',
  },
  {
    url: '/images/medpart-logo/konser-terus.webp',
    alt: 'konser-terus-logo',
  },
  // {
  //   url: '/images/medpart-logo/logo-event-aceh.webp',
  //   alt: 'logo-event-aceh',
  // },
  {
    url: '/images/medpart-logo/logo-gac-music.webp',
    alt: 'logo-gac-music',
  },
  {
    url: '/images/medpart-logo/nanggroe-media.webp',
    alt: 'nanggroe-media-logo',
  },
  {
    url: '/images/medpart-logo/news-rb.webp',
    alt: 'news-rb-logo',
  },
  {
    url: '/images/medpart-logo/persiraja-logo.webp',
    alt: 'persiraja-logo',
  },
  {
    url: '/images/medpart-logo/story-ngonser.webp',
    alt: 'story-ngonser-logo',
  },
  {
    url: '/images/medpart-logo/support-konser.webp',
    alt: 'support-konser-logo',
  },
];

export default function SponsorSection() {
  return (
    <section className="relative pd-full py-30">
      <div className="flex flex-col">
        {/* <div className="absolute left-0 w-full md:max-w-[80%] lg:max-w-[60%] aspect-square">
          <Image
            src="/images/accesoris.png"
            alt="accessoris left"
            fill
            className="object-contain object-center"
          />
        </div> */}

        <div className="flex flex-col gap-8">
          <Label text="SPONSOR" />
          <div className="grid grid-cols-1 gap-4 place-items-center mt-8">
            <div className="flex justify-center items-center w-full max-w-[200px] lg:max-w-[300px]">
              <Image
                src={"/images/bca-syariah.png"}
                alt="bca-syariah-logo"
                width={300}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="object-contain p-2 hover:scale-110 duration-500 ease-in-out"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 mt-16">
          <Label text="MEDIA PARTNER" />
          <div className="mt-8 grid grid-cols-4 md:grid-cols-6 gap-4 place-items-center md:gap-8">
            {medpartData.map((logo, index) => (
              <SponsorCard key={index} url={logo.url} alt={logo.alt} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
