import Image from 'next/image';

export default function VenueSection() {
  return (
    <div className="relative aspect-1/1">
      <Image
        src="/images/panel-ticket-venue.jpg"
        alt="Venue"
        fill
        className="object-contain"
      />
    </div>
  );
}
