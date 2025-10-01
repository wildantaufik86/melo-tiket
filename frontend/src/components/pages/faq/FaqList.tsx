import FaqAccordion from '@/components/fragments/accordion/FaqAccordion';

export default function FaqList() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[700px] mx-auto mt-20">
      <FaqAccordion
        title="Apa itu Melofest"
        content="Melofest adalah Melophile Festival yang bertemakan seseorang yang sangat menyukai dan mencintai musik serta ingin merasakan euphoria dalam menyaksikan konser musik"
      />
      <FaqAccordion title="Penukaran Tiket dimana min?" content="" />
    </div>
  );
}
