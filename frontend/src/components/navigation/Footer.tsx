import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaSpotify, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#151618] pd-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center">
          <div className="relative  w-12 sm:w-full sm:max-w-[50px] lg:max-w-[100px] aspect-square">
            <Image
              src="/images/melo-logo.png"
              alt="Melotiket Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
              loading="lazy"
            />
          </div>

          <p className="text-xs font-semibold text-white mt-5 sm:text-sm lg:text-lg">
            Managed By :
          </p>
          <div className="relative w-12 mt-2 sm:w-full sm:max-w-[50px] lg:max-w-[100px] aspect-square">
            <Image
              src="/images/logo-omar-jaya.png"
              alt="Omar Jaya Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
              loading="lazy"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-xs lg:text-2xl text-white font-black">
            <Link
              href="/terms"
              className="hover:text-bg-primary transition-colors"
            >
              TERM AND CONDITION
            </Link>
            <span>|</span>
            <Link
              href="/faq"
              className="hover:text-bg-primary transition-colors"
            >
              FAQ
            </Link>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Link
              href="/#"
              className="bg-white p-1 rounded-sm hover:bg-bg-primary transition-colors"
            >
              <FaTiktok
                size={16}
                color="black"
                className="lg:w-[30px] lg:h-[30px]"
              />
            </Link>
            <Link
              href="https://www.instagram.com/melofest.id?igsh=dGtrYXg1dmZpNHBu"
              className="bg-white p-1 rounded-sm hover:bg-bg-primary transition-colors"
            >
              <FaInstagram
                size={16}
                color="black"
                className="lg:w-[30px] lg:h-[30px]"
              />
            </Link>
            <Link
              href="/#"
              className="bg-white p-1 rounded-sm hover:bg-bg-primary transition-colors"
            >
              <FaFacebook
                size={16}
                color="black"
                className="lg:w-[30px] lg:h-[30px]"
              />
            </Link>
            <Link
              href="/#"
              className="bg-white p-1 rounded-sm hover:bg-bg-primary transition-colors"
            >
              <FaSpotify
                size={16}
                color="black"
                className="lg:w-[30px] lg:h-[30px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
