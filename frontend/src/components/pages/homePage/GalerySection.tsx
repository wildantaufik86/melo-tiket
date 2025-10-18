import Image from 'next/image';

// dumy data
type Image = {
  id: number;
  url: string;
  alt: string;
};

// const dummyImages: Image[] = [
//   {
//     id: 1,
//     url: '/images/slide-1.jpg',
//     alt: 'Slide 1',
//   },
//   {
//     id: 2,
//     url: '/images/hero-image.webp',
//     alt: 'Slide 1',
//   },
// ];

export default function GalerySection() {
  return (
    <section className="mt-[30%] sm:mt-[15%] lg:mt-[10%]">
      <div className="relative aspect-16/9">
        <Image
          src="/images/hero-image.webp"
          alt="Hero image"
          fill
          priority={false}
          className="object-center object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
          quality={50}
          loading="lazy"
        />
      </div>
    </section>
  );
}
