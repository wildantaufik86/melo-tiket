import Image from 'next/image';

type Sponsor = {
  url: string;
  alt: string;
};

export default function SponsorCard({ url, alt }: Sponsor) {
  return (
    <div className="relative aspect-2/1 bg-white rounded-sm w-full max-w-[250px]">
    <Image src={url} fill alt={alt} className="object-contain p-2 hover:scale-110 duration-500 ease-in-out" />
    </div>
  );
}
