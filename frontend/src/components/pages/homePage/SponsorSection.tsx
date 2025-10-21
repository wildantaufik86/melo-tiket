import SponsorCard from '@/components/fragments/card/SponsorCard';
import Label from '@/components/fragments/label/Label';
import Image from 'next/image';

type Sponsor = {
  id?: number;
  url: string;
  alt: string;
};

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
  {
    url: '/images/medpart-logo/jateng-ambyar.webp',
    alt: 'support-konser-logo',
  },
  {
    url: '/images/medpart-logo/jateng-bang.webp',
    alt: 'support-konser-logo',
  },
  {
    url: '/images/medpart-logo/konser-indonesia.webp',
    alt: 'support-konser-logo',
  },
  {
    url: '/images/medpart-logo/konser-medan.webp',
    alt: 'support-konser-logo',
  },
  {
    url: '/images/medpart-logo/local-media-indonesia.webp',
    alt: 'support-konser-logo',
  },
  {
    url: '/images/medpart-logo/musikku-indonesia.webp',
    alt: 'support-konser-logo',
  },
  {
    url: '/images/medpart-logo/warta-konser-music.webp',
    alt: 'support-konser-logo',
  },
];

export default function SponsorSection() {
  return (
    <section className="relative pd-full mt-50">
      <div className="flex flex-col">
        <div className="flex flex-col gap-8">
          <Label text="SPONSOR" />
          <div className="grid grid-cols-1 gap-4 place-items-center mt-8">
            <div className="flex justify-center items-center w-full">
              <Image
                src={'/images/sponsorship-logo/sponsorship-bca-syariah.webp'}
                alt="bca-syariah-logo"
                width={300}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="object-contain p-2 hover:scale-110 duration-500 ease-in-out"
                sizes="(max-width: 768px) 50vw, 200px"
                loading="lazy"
                priority={false}
                quality={75}
              />
            </div>
            <div className="w-full grid grid-cols-3 gap-5 place-items-center">
              <Image
                src={'/images/sponsorship-logo/sponsorship-sadz.webp'}
                alt="bca-syariah-logo"
                width={300}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="object-contain p-2 hover:scale-110 duration-500 ease-in-out"
                sizes="(max-width: 768px) 50vw, 200px"
                loading="lazy"
                priority={false}
                quality={75}
              />
              <Image
                src={'/images/sponsorship-logo/sponsorship-yup.webp'}
                alt="bca-syariah-logo"
                width={300}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="object-contain p-2 hover:scale-110 duration-500 ease-in-out"
                loading="lazy"
                priority={false}
                quality={75}
              />
              <Image
                src={'/images/sponsorship-logo/sponsorship-bge.webp'}
                alt="bca-syariah-logo"
                width={300}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="object-contain p-2 hover:scale-110 duration-500 ease-in-out"
                loading="lazy"
                priority={false}
                quality={75}
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-1 place-items-center px-10">
              <Image
                src={'/images/sponsorship-logo/sponsorship-cleo.webp'}
                alt="bca-syariah-logo"
                width={300}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="object-contain p-2 hover:scale-110 duration-500 ease-in-out"
                sizes="(max-width: 768px) 50vw, 200px"
                loading="lazy"
                priority={false}
                quality={75}
              />
              <Image
                src={'/images/sponsorship-logo/sponsorship-im3.webp'}
                alt="bca-syariah-logo"
                width={300}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="object-contain p-2 hover:scale-110 duration-500 ease-in-out"
                sizes="(max-width: 768px) 50vw, 200px"
                loading="lazy"
                priority={false}
                quality={75}
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-1 place-items-center">
              <Image
                src={'/images/sponsorship-logo/sponsorship-veory.webp'}
                alt="bca-syariah-logo"
                width={300}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="object-contain p-2 hover:scale-110 duration-500 ease-in-out"
                sizes="(max-width: 768px) 50vw, 200px"
                loading="lazy"
                priority={false}
                quality={75}
              />
              <Image
                src={'/images/sponsorship-logo/partnership-lumoa.webp'}
                alt="bca-syariah-logo"
                width={300}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="object-contain p-2 hover:scale-110 duration-500 ease-in-out"
                sizes="(max-width: 768px) 50vw, 200px"
                loading="lazy"
                priority={false}
                quality={75}
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
