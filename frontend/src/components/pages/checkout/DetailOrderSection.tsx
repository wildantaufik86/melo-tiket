import { formattedPrice } from '@/utils/universalUtils';
import Image from 'next/image';
import { BsPaperclip } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';

const dummyTicket = [
  {
    id: 1,
    name: 'Festival A',
    price: 150000,
    quantity: 2,
  },
  {
    id: 2,
    name: 'Festival B',
    price: 200000,
    quantity: 1,
  },
  {
    id: 3,
    name: 'VIP',
    price: 200000,
    quantity: 1,
  },
];

type OrderProps = {
  orders: [] | any;
};

export default function DetailOrderSection({ orders }: OrderProps) {
  const userData = {
    email: 'Mellowfestsite@gmail.com',
    fullName: 'Melophile Festival',
    birthDate: {
      day: 15,
      month: 'Agustus',
      year: 1998,
    },
    gender: 'male',
  };

  return (
    <section className="flex flex-col md:w-[60%]">
      {/* detail order */}
      <div className="flex-1 flex flex-col bg-secondary p-4 rounded-sm">
        {/* header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative w-full aspect-3/1 md:aspect-3/2 md:w-1/2">
            <Image
              src="/images/hero-image.jpg"
              alt="event image"
              fill
              className="object-contain object-top md:object-center"
            />
          </div>
          <div className="w-full flex flex-col gap-4 md:flex-1 ">
            <h4 className="text-sm font-semibold md:text-lg lg:text-2xl">
              MELOPHILE FESTIVAL
            </h4>
            <div className="flex items-center justify-between md:flex-col md:items-start">
              <p className="text-[10px] lg:text-sm">
                Tanggal : 29 NOVEMBER 2025
              </p>
              <p className="text-[10px] lg:text-sm">
                Tempat : Lhokseumawe, Aceh
              </p>
            </div>
          </div>
        </div>

        {/* hr */}
        <div className="w-full bg-white h-[2px] mt-4 opacity-80"></div>

        {/* list order ticket */}
        <div className="flex flex-col gap-4 mt-4 max-h-[200px] overflow-auto">
          {orders.length > 0 &&
            orders.map((ticket, index) => (
              <div key={index} className="flex flex-col">
                <h4 className="text-lg font-semibold">{ticket.name}</h4>
                <div className="grid grid-cols-2 text-[10px] opacity-80">
                  <p>Harga Ticket </p>
                  <p className="text-left">: {formattedPrice(ticket.price)}</p>
                  <p className="">Jumlah </p>
                  <p>: {ticket.quantity} pcs</p>
                  <p className="">Total </p>
                  <p>: {formattedPrice(ticket.price * ticket.quantity)} </p>
                </div>
              </div>
            ))}
        </div>

        {/* hr */}
        <div className="w-full bg-white h-[2px] mt-4 opacity-80"></div>

        {/* bank information */}
        <div className="flex gap-2 mt-4">
          <div className="relative w-[40%]">
            <Image
              src="/images/bsi-logo.png"
              alt="bank-logo"
              fill
              className="object-contain object-left"
            />
          </div>
          <div className="flex-1 grid grid-cols-[1fr_auto]">
            <p className="text-[10px] md:text-sm lg:text-base">Nama Rekening</p>
            <p className="text-[10px] md:text-sm lg:text-base">
              : M. MAULANA RIDWAN
            </p>
            <p className="text-[10px] md:text-sm lg:text-base">
              Nomor Rekening
            </p>
            <p className="text-[10px] md:text-sm lg:text-base">: 1707071717</p>
          </div>
        </div>
      </div>

      {/* detail pembeli */}
      <div className="flex-1 flex flex-col bg-secondary p-4 rounded-sm mt-8">
        <div className="flex flex-col">
          <p className="font-semibold mb-2">Email</p>
          <div className="bg-white p-2 rounded-t-sm">
            <p className="text-sm font-semibold text-black">{userData.email}</p>
          </div>
          <p className="text-[9px] p-1 text-black font-light bg-[#FBD300]">
            Email ini akan digunakan untuk mengirimkan faktur dan e-tiket
          </p>

          <p className="font-semibold mb-2 mt-4">Nama Lengkap</p>
          <div className="bg-white p-2 rounded-sm">
            <p className="text-sm font-semibold text-black">
              {userData.fullName}
            </p>
          </div>

          <p className="font-semibold mb-2 mt-4">Tanggal Lahir</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-2 rounded-sm">
              <p className="flex justify-between items-center text-sm text-black">
                {userData.birthDate.day}{' '}
                <span>
                  <FaChevronDown />
                </span>
              </p>
            </div>
            <div className="bg-white p-2 rounded-sm">
              <p className="flex justify-between items-center text-sm text-black">
                {userData.birthDate.month}{' '}
                <span>
                  <FaChevronDown />
                </span>
              </p>
            </div>
            <div className="bg-white p-2 rounded-sm">
              <p className="flex justify-between items-center text-sm text-black">
                {userData.birthDate.year}{' '}
                <span>
                  <FaChevronDown />
                </span>
              </p>
            </div>
          </div>

          <p className="font-semibold mb-2 mt-4">Jenis Kelamin</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-white p-2 rounded-sm">
              <div className="text-sm text-black flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full border ${
                    userData.gender === 'male' ? 'bg-blue-700' : ''
                  }`}
                ></div>
                Laki-Laki
              </div>
            </div>
            <div className="flex-1 bg-white p-2 rounded-sm">
              <div className="text-sm text-black flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full border ${
                    userData.gender === 'female' ? 'bg-blue-700' : ''
                  }`}
                ></div>
                Perempuan
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* upload file  */}
      <div className="flex-1 flex justify-between bg-secondary p-4 rounded-sm mt-8">
        <p>Bukti Transfer</p>
        <div className="flex items-center gap-2">
          <BsPaperclip />
          <label htmlFor="file">Attach File</label>
          <input type="file" id="file" className="hidden" />
        </div>
      </div>
      <p className="text-xs px-4 mt-2">
        Pastikan untuk mencantumkan bukti transfer*
      </p>
    </section>
  );
}
