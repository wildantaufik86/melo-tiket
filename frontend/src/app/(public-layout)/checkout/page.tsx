import CheckoutSection from '@/components/pages/checkout/CheckoutSection';
import DetailOrderSection from '../../../components/pages/checkout/DetailOrderSection';

export default function TicketPage() {
  return (
    <section className="bg-[url(/images/dark-gradient.jpg)] bg-cover bg-center bg-no-repeat min-h-screen pt-20">
      <div className="pd-full flex flex-col">
        <h3 className="text-lg font-semibold md:text-xl lg:text-3xl">
          RINCIAN PESANAN
        </h3>
        <div className="flex flex-col mt-8 md:flex-row md:gap-6">
          <DetailOrderSection />
          <CheckoutSection listOrder={[]} />
        </div>
      </div>
    </section>
  );
}
