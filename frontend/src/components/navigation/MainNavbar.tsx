'use client';

import { useAuth } from '@/context/authUserContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';

export default function MainNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { authUser, logoutUser, loading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const closeSidebar = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!target.closest('nav') && !target.closest('aside')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', closeSidebar);

    return () => {
      document.removeEventListener('click', closeSidebar);
    };
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 py-4 pd-lr flex justify-between bg-bg-secondary text-white items-center z-50">
      <div className="">
        <Link href="/">
          <Image
            src="/images/melo-logo.png"
            alt="melofest logo"
            width={50}
            height={50}
            className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
            priority
          />
        </Link>
      </div>

      {/* desktop navbar */}
      <div className=" justify-center items-center gap-6 hidden md:flex">
        <Link
          href="/about"
          className="text-lg font-medium hover:text-hover transition-colors"
        >
          About
        </Link>
        <Link
          href="/venue"
          className="text-lg font-medium hover:text-hover transition-colors"
        >
          Venue
        </Link>
        <Link
          href="/ticket"
          className="text-lg font-medium hover:text-hover transition-colors"
        >
          Ticket
        </Link>
        {/* <Link
          href="/line-up"
          className="text-lg font-medium hover:text-hover transition-colors"
        >
          Line-Up
        </Link> */}
        {/* <Link
          href="/contact"
          className="text-lg font-medium hover:text-hover transition-colors"
        >
          Contact
        </Link> */}
      </div>

      {/* button navigation */}

      {loading ? (
        <div className=""></div>
      ) : (
        <>
          {!authUser && (
            <div className="flex items-center gap-4">
              <Link
                href="/auth/register"
                className="py-2 px-4 text-xs lg:text-sm font-medium border border-bg-primary flex justify-center items-center rounded-sm hover:bg-hover transition-colors"
              >
                Daftar
              </Link>
              <Link
                href="/auth/login"
                className="py-2 px-4 text-xs lg:text-sm font-medium bg-bg-primary flex justify-center items-center rounded-sm hover:bg-hover transition-colors"
              >
                Masuk
              </Link>

              <div
                onClick={toggleSidebar}
                className="flex justify-center items-center cursor-pointer md:hidden"
              >
                <FiMenu size={24} />
              </div>
            </div>
          )}

          {authUser && (
            <div className="flex items-center gap-4">
              <button
                onClick={logoutUser}
                type="button"
                className="py-2 px-4 text-xs lg:text-sm font-medium border border-bg-primary flex justify-center items-center rounded-sm hover:bg-hover transition-colors"
              >
                LOG OUT
              </button>
              <Link
                href="/user/profile"
                className="py-2 px-4 text-xs lg:text-sm font-medium bg-bg-primary flex justify-center items-center rounded-sm hover:bg-hover transition-colors"
              >
                PROFILE
              </Link>

              <div
                onClick={toggleSidebar}
                className="flex justify-center items-center cursor-pointer md:hidden"
              >
                <FiMenu size={24} />
              </div>
            </div>
          )}
        </>
      )}

      {/* sidebar on mobile */}
      <aside
        className={`absolute top-full  w-[200px] h-screen bg-bg-secondary p-4 flex flex-col gap-4 ${
          isSidebarOpen ? 'right-0' : '-right-full'
        } transition-all lg:hidden`}
      >
        <Link
          href="/about"
          className="text-sm font-medium hover:bg-bg-primary transition-colors p-2 rounded-sm"
        >
          About
        </Link>
        <Link
          href="/venue"
          className="text-sm font-medium hover:bg-bg-primary transition-colors p-2 rounded-sm"
        >
          Venue
        </Link>
        <Link
          href="/ticket"
          className="text-sm font-medium hover:bg-bg-primary transition-colors p-2 rounded-sm"
        >
          Ticket
        </Link>
        {/* <Link
          href="/line-up"
          className="text-sm font-medium hover:bg-bg-primary transition-colors p-2 rounded-sm"
        >
          Line-Up
        </Link> */}
        {/* <Link
          href="/contact"
          className="text-sm font-medium hover:bg-bg-primary transition-colors p-2 rounded-sm"
        >
          Contact
        </Link> */}
      </aside>
    </nav>
  );
}
