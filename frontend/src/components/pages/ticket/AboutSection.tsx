import Label from '@/components/fragments/label/Label';
import { IEvent } from '@/types/Event';

type textList = {
  text: string;
};

const listText: textList[] = [
  {
    text: '1. Tiket hanya dapat dibeli melalui melophilefestival.com',
  },
  {
    text: '2. Pembelian tiket selain melalui melophilefestival.com TIDAK MENJADI TANGGUNGJAWAB PROMOTOR & segala resiko yang timbul menjadi tanggung jawab pembeli tiket.',
  },
  {
    text: '3. Harga belum termasuk pajak dan biaya layanan',
  },
  {
    text: '4. Tiket yang sudah dibeli TIDAK DAPAT DIKEMBALIKAN dengan alasan apapun, termasuk dikarenakan perubahan jadwal dan/atau susunan acara dan/atau diakibatkan oleh batal tampilnya artis pengisi acara. Kecuali dikarenakan kesalahan/inisiatif dari PROMOTOR/EO.',
  },
  {
    text: '5. Tiket tidak bisa di-refund apabila terjadi kondisi kahar seperti: gempa bumi, banjir, tsunami, serta meninggal Pemuka Agama/Ulama Terkhususnya di Aceh yang menyebabkan batalnya acara.',
  },
  {
    text: '6. Pada saat proses pembelian tiket, pastikan mengisi SESUAI dengan identitas diri pembeli.',
  },
  {
    text: '7. Setelah pembelian tiket bakal mendapakatkan voucher e-tiket yang bakal ditukarkan pada periode waktu penukaran gelang atau hari-h.',
  },
  {
    text: '8. QR code pada e-tiket hanya bisa di scan sebanyak satu kali.',
  },
  {
    text: '9. Menunjukkan QR code yang tertera pada e-tiket dan identitas diri yang sesuai dengan data pada e-tiket.',
  },
  {
    text: '10. Promotor TIDAK AKAN membantu proses penukaran e-tiket menjadi gelang jika terdapat ketidaksesuaian data pada e-tiket dan identitas diri.',
  },
  {
    text: '11. Penukaran gelang yang diwakilkan atau oleh sebab pindah tangan kepemilikan WAJIB membawa surat kuasa dalam bentuk fisik dan bermaterai, yang ditandatangani pemberi dan penerima surat kuasa, serta melampirkan fotokopi KTP pemberi dan penerima surat kuasa.',
  },
  {
    text: '12. Anak dibawah usia 12 tahun WAJIB didampingi orang tua/wali dan keamanannya menjadi tanggung jawab orang tua/wali.',
  },
  {
    text: '13. Ibu hamil harap dalam pendampingan dan mengambil posisi yang dianggap paling aman, mengingat tata cahaya panggung dan suara dapat mengganggu kenyamanan bagi kehamilan, dan promotor tidak bertanggung jawab atas resiko apapun dalam hal ini.',
  },
  {
    text: '14. Gelang yang hilang/rusak tidak dapat digunakan dan menjadi tanggung jawab pemilik.',
  },
  {
    text: '15. Dengan bertransaksi dianggap telah membaca dan menyetujui syarat dan ketentuan ini.',
  },
];

type EventDetailProps = {
  eventDetail?: IEvent;
};

export default function AboutSection({ eventDetail }: EventDetailProps) {
  return (
    <section className="w-full flex flex-col gap-8 md:w-[60%]">
      <div className="flex flex-col gap-4">
        <div className="flex justify-start">
          <Label text="TENTANG MELOFEST" />
        </div>
        <div className="bg-secondary rounded-md p-4 text-justify flex flex-col gap-4 text-xs">
          <p>{eventDetail?.description || ''}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-start">
          <Label text="TENTANG TIKET" />
        </div>
        <div className="bg-secondary rounded-md p-4 text-xs">
          <ul className="flex flex-col gap-4">
            {listText.map((item, index) => (
              <li key={index}>{item.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
