import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="absolute -top-5 w-full aspect-video">
      <Image
        src="/images/hero-image.webp"
        alt="melofest hero"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
        className="object-contain object-top pd-lr z-10 rounded-2xl"
        priority={true}
      />
    </section>
  );
}
