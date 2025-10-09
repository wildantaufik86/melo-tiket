import Label from '@/components/fragments/label/Label';
import Image from 'next/image';

const keamanancontents: { text: string }[] = [
  {
    text: '• Untuk alasan keamanan, seluruh pengunjung, artis, crew, dan staf lainnya, termasuk media akan diperiksa sebelum memasuki area Festival. Dengan memasuki area Festival, pengunjung berarti bersedia untuk diperiksa secara menyeluruh, termasuk mengosongkan kantong & tas dan memeriksa seluruh barang bawaan dan body checking. Detektor metal dan K-9 akan digunakan. Penyelenggara mempunyai hak untuk menolak dan/atau mengeluarkan pengunjung dari area Festival, apabila pengunjung tersebut melanggar peraturan Festival. Peraturan Festival dapat berubah sewaktu-waktu, dengan ataupun tanpa pemberitahuan terlebih dahulu',
  },
  {
    text: '• Untuk alasan keselamatan, pengunjung dilarang menaiki/memanjat tiang/pohon/platform di area Festival. Pengunjung yang melanggar akan dikeluarkan dari area Festival. ',
  },
  {
    text: '• Kapasitas pengunjung di area stage tertentu dibatasi sesuai dengan ketentuan protokol keselamatan yang berlaku untuk Festival. Penyelenggara dengan cara apapun berhak melarang pengunjung apabila area stage telah mencapai batas maksimal kapasitas yang ditentukan.,',
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[url(/images/dark-gradient.webp)] bg-cover bg-center bg-no-repeat min-h-screen pt-28 pd-full flex flex-col gap-4">
      <section className="flex flex-col">
        <Label text="TERMS & CONDITION" />
        <div className="relative aspect-1/1">
          <Image
            src="/images/terms-image.jpg"
            fill
            alt="terms and condition"
            className="object-contain"
          />
        </div>
      </section>

      <section className="flex flex-col">
        <Label text="KEAMANAN" />
        <div className="mt-8  bg-[url(/images/accessoris-bg.jpg)] bg-cover bg-center bg-no-repeat w-full p-4 border border-bg-primary rounded-sm flex flex-col gap-4 lg:mt-12">
          {keamanancontents.map((content, index) => (
            <p key={index} className="text-sm text-justify lg:text-base">
              {content.text}
            </p>
          ))}
        </div>
      </section>

      <section className="flex flex-col mt-8 lg:mt-16">
        <Label text="HAK PEREKAMAN" />
        <div className="mt-8 bg-[url(/images/accessoris-bg.jpg)] bg-cover bg-center bg-no-repeat w-full p-4 border border-bg-primary rounded-sm flex flex-col gap-4 lg:mt-12">
          <p className="text-sm text-justify lg:text-base">
            • Penyelenggara dan afiliasi/asosiasinya berhak untuk memfilmkan,
            merekam dan/atau memotret wajah atau gambar ataupun yang
            menyerupainya, gerakan dan/atau pernyataan para pengunjung,
            partisipan, dari Festival ini untuk televisi, gambar bergerak
            (film), webcast dan/atau penyiaran publik lainnya dalam bentuk
            apapun dan untuk kepentingan apapun untuk waktu yang tidak terbatas
            dan di Negara mana pun. Setiap pengunjung dan/atau partisipan dari
            Festival ini, dengan ini melepaskan Penyelenggara (termasuk pegawai
            dan anak perusahaannya) dan afiliasi/asosianya dari segala hak,
            klaim, kerugian, kehilangan, pertanggungjawaban, denda dan
            akibat-akibat lainnya yang muncul secara langsung maupun tidak dari
            memfilmkan, perekaman, dan/atau pemotretan dari Festival ini.
          </p>

          <p className="text-sm font-bold text-justify mt-4">
            Syarat dan ketentuan Festival di atas telah saya baca, pahami. Saya
            mengerti dan menyetujui untuk terikat secara hukum dengan syarat dan
            ketentuan yang telah ditentukan oleh Penyelenggara.
          </p>
        </div>
      </section>
    </div>
  );
}
