import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaSpotify, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className=" bg-[url(/images/footer-bg.jpg)] bg-cover bg-top bg-no-repeat pd-full flex min-h-[200px]">
      <div className="flex-1 flex flex-col items-center">
        <div className="relative  w-12 sm:w-full sm:max-w-[50px] lg:max-w-[100px] aspect-square">
          <Image
            src="/images/melo-logo.png"
            alt="Melotiket Logo"
            fill
            priority
            className="object-contain"
          />
        </div>

        <p className="text-xs font-semibold mt-4 sm:text-sm lg:text-lg">
          Managed By :
        </p>
        <div className="relative w-12 sm:w-full sm:max-w-[50px] lg:max-w-[100px] aspect-square">
          <Image
            src="/images/logo-omar-jaya.png"
            alt="Omar Jaya Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-xs lg:text-sm">
          <Link
            href="/terms"
            className=" font-semibold hover:text-primary transition-colors"
          >
            TERM AND CONDITION
          </Link>
          <span>|</span>
          <Link
            href="/faq"
            className=" font-semibold hover:text-primary transition-colors"
          >
            FAQ
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/tiktok"
            className="bg-white p-1 rounded-sm hover:bg-primary transition-colors"
          >
            <FaTiktok size={16} color="black" />
          </Link>
          <Link
            href="/instagram"
            className="bg-white p-1 rounded-sm hover:bg-primary transition-colors"
          >
            <FaInstagram size={16} color="black" />
          </Link>
          <Link
            href="/facebook"
            className="bg-white p-1 rounded-sm hover:bg-primary transition-colors"
          >
            <FaFacebook size={16} color="black" />
          </Link>
          <Link
            href="/spotify"
            className="bg-white p-1 rounded-sm hover:bg-primary transition-colors"
          >
            <FaSpotify size={16} color="black" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
