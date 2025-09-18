import Image from "next/image";
import Marquee from "react-fast-marquee";

export default function Footer() {
  const images = [
    '/images/contact_asset.png',
    '/images/contact_asset2.png',
    '/images/contact_asset.png',
    '/images/contact_asset2.png',
    '/images/contact_asset.png',
  ];

  return (
    <footer className="w-full bg-[#1E1E1E]">
      <div className="overflow-hidden">
        <div className="flex infinite-scroll-image w-max gap-2">
          <Marquee pauseOnHover={true} speed={50}>
            {[...images, ...images].map((src, index) => (
              <Image
                key={index}
                src={src}
                width={400}
                height={200}
                alt="Contact Asset Image"
                className="shrink-0 max-h-90"
              />
            ))}
          </Marquee>
        </div>
      </div>

      <div className="w-full px-10 text-white py-12">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-8">
          {/* Section 1: Logo and Newsletter */}
          <div className="col-span-3">
            <div className="mb-6">
            <Image
              src=""
              width={150}
              height={100}
              alt="Logo_Melotiket"
              className="drop-shadow-lg"
            />
            </div>
            <p className="text-white mb-4">Subscribe to our newsletter</p>
            <div className="w-full flex">
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 w-full max-w-50 rounded-l-2xl bg-[#3A3A3A] text-white outline-none flex-grow"
              />
              <button className="bg-[#3A3A3A] text-white px-7 rounded-r-xl hover:bg-gray-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Section 2: Contact */}
          <div className="col-span-3">
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <p className="text-[#737373] mb-2">melofest@gmail.com</p>
            <p className="text-[#737373] mb-2">+1 (123) 456 7890</p>
            <p className="text-[#737373]">01 Lorem Ipsum, St. Dolor Sit Amet. Cg Loticus</p>
            {/* <div className="flex gap-4 mt-6">
                <Image src="/images/WBENC.png" alt="WBENC" width={60} height={30} />
                <Image src="/images/PPAI.png" alt="PPAI" width={60} height={30} />
                <Image src="/images/ASI.png" alt="ASI" width={60} height={30} />
                <Image src="/images/FairLabor.png" alt="Fair Labor" width={60} height={30} />
                <Image src="/images/10000SmallBusinesses.png" alt="10000 Small Businesses" width={60} height={30} />
            </div> */}
          </div>

          {/* Section 3: Pages */}
          <div className="w-full max-w-[70px]">
            <h3 className="text-lg font-semibold mb-6">Pages</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-[#737373] hover:text-white transition-colors">Home</a></li>
              <li><a href="/about-us" className="text-[#737373] hover:text-white transition-colors">About us</a></li>
              <li><a href="/portofolio" className="text-[#737373] hover:text-white transition-colors">Portofolio</a></li>
              <li><a href="/services" className="text-[#737373] hover:text-white transition-colors">Services</a></li>
              <li><a href="/news" className="text-[#737373] hover:text-white transition-colors">News</a></li>
              <li><a href="/contact-us" className="text-[#737373] hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Section 4: Social */}
          <div className="w-full max-w-[70px]">
            <h3 className="text-lg font-semibold mb-6">Social</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#737373] hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="text-[#737373] hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="text-[#737373] hover:text-white transition-colors">Pinterest</a></li>
              <li><a href="#" className="text-[#737373] hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="text-[#737373] hover:text-white transition-colors">Youtube</a></li>
              <li><a href="#" className="text-[#737373] hover:text-white transition-colors">Tik Tok</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright and Terms */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-[#BDBDBD] text-sm">
          <p>&copy; all rights reserved 2025 ® MELOTIKET®</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
