import Label from '@/components/fragments/label/Label';
import FaqList from '@/components/pages/faq/FaqList';

export default function FaqPage() {
  return (
    <section className="bg-[url(/images/dark-gradient.jpg)] bg-cover bg-center bg-no-repeat min-h-screen pt-28 pd-full">
      <div className="flex flex-col">
        <Label text="FAQ" />
        <FaqList />
      </div>
    </section>
  );
}
