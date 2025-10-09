import Label from '@/components/fragments/label/Label';
import Image from 'next/image';

export default function LineUpPage() {
  return (
    <div className="bg-[url(/images/dark-gradient.webp)] bg-cover bg-center bg-no-repeat min-h-screen pt-28 pd-full flex flex-col gap-4">
      <section className="flex flex-col mt-8 lg:mt-16">
        <Label text="LINE UP" />
        <div className="relative aspect-square">
          <Image
            src="/images/line-up-image.webp"
            alt="line up image"
            fill
            className="object-contain"
          />
        </div>
      </section>
    </div>
  );
}
