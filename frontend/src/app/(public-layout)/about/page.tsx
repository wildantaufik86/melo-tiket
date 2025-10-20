import Label from '@/components/fragments/label/Label';

const aboutMelofestContents: { text: string }[] = [
  {
    text: '• Melofest atau Melophile Festival merupakan sebuah acara yang unik yang menonjolkan konsep yang menciptakan pengalaman yang berbeda bagi para penonton. Festival ini juga menonjolkan kecintaan seseorang terhadap musik serta ingin mendapatkan euphoria dalam menyaksikan konser musik. ',
  },
  {
    text: '• Selain itu, Melophile Festival memiliki unsur kejutan yang tak terduga dengan adanya aktifitas social berupa Donor Darah, dan Santunan Disabilita. Melalui konsep-konsep inovatif ini, Melophile Festival di Lhokseumawe berharap dapat memberikan pengalaman yang tidak hanya menghibur namun juga memberikan perhatian terhadap kepedulian terhadap aksi social.',
  },
  {
    text: '• Harapannya menjadi pionir Festival Musik dengan pengalaman terbaik di Kota Lhokseumawe, menciptakan momen tak terlupakan bagi setiap penonton. Kami berkomitmen untuk menghadirkan inovasi dan keunikan dalam penyelenggaraan festival, menjadikan Melophile Festival sebagai destinasi utama bagi pecinta seni, musik, budaya, kuliner dan menjadi destinasi yang dinantikan setiap tahunnya juga sumber inspirasi bagi festival-festival lain di seluruh Indonesia khususnya Aceh.',
  },
];

const ticketTerms: { text: string }[] = [
  {
    text: 'Tiket hanya dapat dibeli melalui melophilefestival.com',
  },
  {
    text: 'Pembelian tiket selain melalui melophilefestival.com TIDAK MENJADI TANGGUNGJAWAB PROMOTOR & segala resiko yang timbul menjadi tanggung jawab pembeli tiket.',
  },
  {
    text: 'Harga belum termasuk pajak dan biaya layanan.',
  },
  {
    text: 'Tiket yang sudah dibeli TIDAK DAPAT DIKEMBALIKAN dengan alasan apapun, termasuk dikarenakan perubahan jadwal dan/atau susunan acara dan/atau diakibatkan oleh batal tampilnya artis pengisi acara. Kecuali dikarenakan kesalahan/inisiatif dari PROMOTOR/EO.',
  },
  {
    text: 'Tiket tidak bisa di-refund apabila terjadi kondisi kahar seperti: gempa bumi, banjir, tsunami, serta meninggal Pemuka Agama/Ulama Terkhususnya di Aceh yang menyebabkan batalnya acara.',
  },
  {
    text: 'Pada saat proses pembelian tiket, pastikan mengisi SESUAI dengan identitas diri pembeli.',
  },
  {
    text: 'Setelah pembelian tiket bakal mendapakatkan voucher e-tiket yang bakal ditukarkan pada periode waktu penukaran gelang atau hari-h.',
  },
  {
    text: 'QR code pada e-tiket hanya bisa di scan sebanyak satu kali.',
  },
  {
    text: 'Menunjukkan QR code yang tertera pada e-tiket dan identitas diri yang sesuai dengan data pada e-tiket.',
  },
  {
    text: 'Promotor TIDAK AKAN membantu proses penukaran e-tiket menjadi gelang jika terdapat ketidaksesuaian data pada e-tiket dan identitas diri.',
  },
  {
    text: 'Penukaran gelang yang diwakilkan atau oleh sebab pindah tangan kepemilikan WAJIB membawa surat kuasa dalam bentuk fisik dan bermaterai, yang ditandatangani pemberi dan penerima surat kuasa, serta melampirkan fotokopi KTP pemberi dan penerima surat kuasa.',
  },
  {
    text: 'Anak dibawah usia 12 tahun WAJIB didampingi orang tua/wali dan keamanannya menjadi tanggung jawab orang tua/wali.',
  },
  {
    text: 'Ibu hamil harap dalam pendampingan dan mengambil posisi yang dianggap paling aman, mengingat tata cahaya panggung dan suara dapat mengganggu kenyamanan bagi kehamilan, dan promotor tidak bertanggung jawab atas resiko apapun dalam hal ini.',
  },
  {
    text: 'Gelang yang hilang/rusak tidak dapat digunakan dan menjadi tanggung jawab pemilik.',
  },
  {
    text: 'Dengan bertransaksi dianggap telah membaca dan menyetujui syarat dan ketentuan ini.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-dark-gradient min-h-screen pt-28 pd-full flex flex-col gap-4">
      <section className="flex flex-col mt-8 lg:mt-16">
        <Label text="About Melofest" />
        <div className="mt-8 bg-[url(/images/accessoris-bg.jpg)] bg-cover bg-center bg-no-repeat w-full p-4 border border-bg-primary rounded-sm flex flex-col gap-4 lg:mt-12">
          {aboutMelofestContents.map((content, index) => (
            <p key={index} className="text-sm text-justify lg:text-base">
              {content.text}
            </p>
          ))}
        </div>
      </section>

      <section className="flex flex-col mt-8 lg:mt-16">
        <Label text="About TIcket" />
        <div className="mt-8 bg-[url(/images/accessoris-bg.jpg)] bg-cover bg-center bg-no-repeat w-full p-4 border border-bg-primary rounded-sm flex flex-col gap-4 lg:mt-12">
          {ticketTerms.map((content, index) => (
            <p key={index} className="text-sm text-justify lg:text-base">
              {`${index + 1} ${content.text}`}
            </p>
          ))}
        </div>
      </section>

      {/* <section className="flex flex-col mt-8 lg:mt-16">
        <Label text="Melofest History" />
        <div className="mt-8 bg-[url(/images/accessoris-bg.jpg)] bg-cover bg-center bg-no-repeat w-full p-4 border border-bg-primary rounded-sm flex flex-col gap-4 lg:mt-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 p-4">
            <div className="w-full h-[200px] bg-white"></div>
            <div className="w-full h-[200px] bg-white"></div>
            <div className="w-full h-[200px] bg-white"></div>
            <div className="w-full h-[200px] bg-white"></div>
            <div className="w-full h-[200px] bg-white"></div>
            <div className="w-full h-[200px] bg-white"></div>
            <div className="w-full h-[200px] bg-white"></div>
            <div className="w-full h-[200px] bg-white"></div>
            <div className="w-full h-[200px] bg-white"></div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
