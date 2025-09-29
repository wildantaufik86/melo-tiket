import Image from 'next/image';

type Sponsor = {
  url: string;
  alt: string;
};

export default function SponsorCard({ url, alt }: Sponsor) {
  return (
    <div className="flex justify-center items-center rounded-sm w-full max-w-[200px]">
      <img
        src={url}
        alt={alt}
        className="object-cover p-2 hover:scale-110 duration-500 ease-in-out"
      />
    </div>
  );
}
