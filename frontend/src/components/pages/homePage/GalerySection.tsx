'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

// dumy data
type Image = {
  id: number;
  url: string;
  alt: string;
};

const dummyImages: Image[] = [
  {
    id: 1,
    url: '/images/slide-1.jpg',
    alt: 'Slide 1',
  },
  {
    id: 2,
    url: '/images/hero-image.jpg',
    alt: 'Slide 1',
  },
];

export default function GalerySection() {
  return (
    <section className="w-full mt-[70%] sm:mt-[40%] lg:mt-0">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="aspect-video"
      >
        {dummyImages.map((image) => (
          <SwiperSlide key={image.id} className="relative lg:mt-40">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-center object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
