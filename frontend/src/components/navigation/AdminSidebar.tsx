'use client';

import Link from 'next/link';
import { useState } from 'react';
import { logout } from '@/app/actions/auth';
import { useAuth } from '@/context/authUserContext';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, LogOut, Menu} from 'lucide-react';
import { GaugeIcon, QrCodeIcon, TicketIcon, UserIcon } from '@phosphor-icons/react/dist/ssr';

export default function AdminSidebar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [productsManagementOpen, setProductManagementOpen] = useState(false);
  const [eventsManagementOpen, setEventManagementOpen] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const authUser = useAuth();
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = async () => {
    const response = await logout();

    if (response.status === 'success') {
      router.replace('/auth/login');
    }
  };

  return (
    <nav className="bg-white static z-12">
      {/* Mobile and Tablet Navbar */}
      <div className="flex lg:hidden items-center justify-between py-3 px-5 bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <button className="text-2xl text-gray-800" onClick={toggleDrawer}>
          <Menu />
        </button>

        <Link href={'/admin'} className="flex items-center space-x-2">
          <img
            src="/images/melo-logo.png"
            alt="Logo_Melotiket"
            className="w-20"
          />
        </Link>
      </div>

      {/* Sidebar / Drawer for larger screens */}
      <aside
        className={`fixed inset-y-0 left-0 w-76 bg-white py-2 px-3 transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform lg:translate-x-0 lg:static z-50 shadow-lg min-h-screen flex flex-col justify-between font-jakarta`}
      >
        <div>
          {/* Close Button for Drawer */}
          {/* <button
            className="absolute top-0 right-0 translate-x-13 w-13 rounded-r-xl flex justify-center items-center py-3 text-gray-800 bg-white shadow-lg border text-2xl lg:hidden"
            onClick={toggleDrawer}
          >
            <div>
            <X />
            </div>
          </button> */}

          {/* Sidebar Header with Logo and Title */}
          {/* <div className="flex items-center justify-between space-x-4 bg-gray-50 border rounded-lg border-black/10 mb-3">
            <Link href={'/admin'} className="">
              <div className="p-2 space-x-1 h-full rounded-lg">
                <img
                  src="/images/melo-logo.png"
                  alt="Logo_Melotiket"
                  className="w-[45px] object-cover"
                />
              </div>
            </Link>
          </div> */}

          {/* Profile Section */}
          <div className="flex items-center px-4 space-x-4 bg-gray-50 border rounded-lg border-black/10">
            <img
              src="/images/melo-logo.png"
              alt="Profile"
              className="w-12 h-12 object-cover rounded-full"
            />
            <div>
              <p className="font-semibold text-sm text-gray-800">
                {authUser.authUser?.name || 'JohnDoe'}
              </p>
              <p className="text-gray-500 text-xs">
                {authUser.authUser?.email || 'John@gmail.com'}
              </p>
            </div>
          </div>

          {/* Sidebar Navigation Links */}
          <ul className="space-y-2 mt-6">
            {(authUser?.authUser?.role === 'superadmin' ||
              authUser?.authUser?.role === 'admin') && (
              <li>
                <Link
                  href={'/admin'}
                  className={`${
                    pathname === '/admin' ? 'bg-gray-100' : 'bg-white'
                  } block text-sm font-semibold py-2 px-4 rounded text-primary
                    hover:bg-[#EFF6FF] hover:text-black/75`}
                >
                  <div className="flex items-center">
                    <GaugeIcon
                      size={24}
                      className="text-black/75 mr-2"
                      weight="light"
                    />
                    <span>Dashboard</span>
                  </div>
                </Link>
              </li>
            )}

            {(authUser?.authUser?.role === 'superadmin' ||
              authUser?.authUser?.role === 'admin') && (
              <li
                onClick={() => setEventManagementOpen(!eventsManagementOpen)}
                className="text-sm font-semibold py-2 px-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center">
                  <TicketIcon
                    size={24}
                    className="text-black/75 mr-2"
                    weight="light"
                  />
                  <span>Event Managements </span>
                </div>
                <span className="duration-200">
                  {eventsManagementOpen ? <ChevronUp /> : <ChevronDown />}
                </span>
              </li>
            )}

            <div
              className={`flex flex-col gap-2 px-4 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                eventsManagementOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              {authUser?.authUser?.role === 'superadmin' && (
                <Link
                  href={'/admin/event-management/event'}
                  className={`${
                    pathname.startsWith('/admin/event-management/event')
                      ? 'bg-gray-100'
                      : 'bg-white'
                  } block text-sm font-semibold py-2 px-4 ml-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75`}
                >
                  Event
                </Link>
              )}
              {/* all role can access */}
              <Link
                href={'/admin/event-management/ticket'}
                className={`${
                  pathname.startsWith('/admin/event-management/ticket')
                    ? 'bg-gray-100'
                    : 'bg-white'
                } block text-sm font-semibold py-2 px-4 ml-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75`}
              >
                Ticket
              </Link>

              {authUser?.authUser?.role === 'superadmin' && (
                <Link
                  href={'/admin/event-management/template'}
                  className={`${
                    pathname.startsWith('/admin/event-management/template')
                      ? 'bg-gray-100'
                      : 'bg-white'
                  } block text-sm font-semibold py-2 px-4 ml-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75`}
                >
                  Template
                </Link>
              )}
              {authUser?.authUser?.role === 'superadmin' && (
                <Link
                  href={'/admin/event-management/category'}
                  className={`${
                    pathname.startsWith('/admin/event-management/category')
                      ? 'bg-gray-100'
                      : 'bg-white'
                  } block text-sm font-semibold py-2 px-4 ml-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75`}
                >
                  Category
                </Link>
              )}
            </div>

            <li
              onClick={() => setTransactionOpen(!transactionOpen)}
              className="text-sm font-semibold py-2 px-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center">
                <TicketIcon
                  size={24}
                  className="text-black/75 mr-2"
                  weight="light"
                />
                <span>Transaction Managements </span>
              </div>
              <span className="duration-200">
                {transactionOpen ? <ChevronUp /> : <ChevronDown />}
              </span>
            </li>
            <div
              className={`flex flex-col gap-2 px-4 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                transactionOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <Link
                href={'/admin/transactions'}
                className={`${
                  pathname.startsWith('/admin/transactions')
                    ? 'bg-gray-100'
                    : 'bg-white'
                } block text-sm font-semibold py-2 px-4 ml-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75`}
              >
                Transaction
              </Link>
              {(authUser?.authUser?.role === 'superadmin' ||
                authUser?.authUser?.role === 'admin') && (
                <Link
                  href={'/admin/transactions/new'}
                  className={`${
                    pathname.startsWith('/admin/transaction/new')
                      ? 'bg-gray-100'
                      : 'bg-white'
                  } block text-sm font-semibold py-2 px-4 ml-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75`}
                >
                  Create Transaction
                </Link>
              )}
            </div>

            {(authUser?.authUser?.role === 'superadmin' ||
              authUser?.authUser?.role === 'admin') && (
              <li>
                <Link
                  href={'/admin/user-management'}
                  className={`${
                    pathname.startsWith('/admin/user-management')
                      ? 'bg-gray-100'
                      : 'bg-white'
                  } block text-sm font-semibold py-2 px-4 rounded text-primary
                    hover:bg-[#EFF6FF] hover:text-black/75`}
                >
                  <div className="flex items-center">
                    <UserIcon
                      size={24}
                      className="text-black/75 mr-2"
                      weight="light"
                    />
                    <span>User</span>
                  </div>
                </Link>
              </li>
            )}

            {authUser?.authUser?.role === 'superadmin' && (
              <>
              <li onClick={() => setQrOpen(!qrOpen)} className="text-sm font-semibold py-2 px-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75 cursor-pointer flex items-center justify-between">
                <div className="flex items-center">
                  <QrCodeIcon
                    size={24}
                    className="text-black/75 mr-2"
                    weight="light"
                  />
                  <span>QR Managements</span>
                </div>
                <span className="duration-200">
                  {qrOpen ? <ChevronUp /> : <ChevronDown />}
                </span>
              </li>
              <div className={`flex flex-col gap-2 px-4 overflow-hidden transition-[max-height] duration-300 ease-in-out ${qrOpen ? 'max-h-96' : 'max-h-0'}`}>
                <Link href={'/admin/qr-management/create'} className={`${
                    pathname.startsWith('/admin/qr-management/create')
                      ? 'bg-gray-100'
                      : 'bg-white'} block text-sm font-semibold py-2 px-4 ml-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75`}>
                  Create QR
                </Link>
                <Link
                  href={'/admin/qr-management/verify-eticket'}
                  className={`${
                    pathname.startsWith('/admin/qr-management/verify-eticket')
                      ? 'bg-gray-100'
                      : 'bg-white'
                  } block text-sm font-semibold py-2 px-4 ml-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75`}
                >
                  Verify E-Ticket
                </Link>
                <Link
                  href={'/admin/qr-management/verify-bracelet'}
                  className={`${
                    pathname.startsWith('/admin/qr-management/verify-bracelet')
                      ? 'bg-gray-100'
                      : 'bg-white'
                  } block text-sm font-semibold py-2 px-4 ml-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75`}
                >
                  Verify Bracelet
                </Link>
                <Link
                  href={''}
                  className={`${
                    pathname.startsWith('/admin/transaction/new')
                      ? 'bg-gray-100'
                      : 'bg-white'
                  } block text-sm font-semibold py-2 px-4 ml-4 rounded text-primary hover:bg-[#EFF6FF] hover:text-black/75`}
                >
                  Log Scanned
                </Link>
              </div>
              </>
            )}

            {/* <li>
              <Link
                href={'/admin/about'}
                className={`${
                  pathname.startsWith('/admin/about')
                    ? 'bg-gray-100'
                    : 'bg-white'
                } block text-sm font-semibold py-2 px-4 rounded text-primary
                    hover:bg-[#EFF6FF] hover:text-black/75`}
              >
                <div className='flex items-center'>
                  <ChalkboardTeacher size={24} className='text-black/75 mr-2' weight="light" />
                  <span>About</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                href={'/admin/contact-us'}
                className={`${
                  pathname.startsWith('/admin/contact-us')
                    ? 'bg-gray-100'
                    : 'bg-white'
                } block text-sm font-semibold py-2 px-4 rounded text-primary
                    hover:bg-[#EFF6FF] hover:text-black/75`}
              >
                <div className='flex items-center'>
                  <VideoConferenceIcon size={24} className='text-black/75 mr-2' weight="light" />
                  <span>Contact Us</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                href={'/admin/services'}
                className={`${
                  pathname.startsWith('/admin/services')
                    ? 'bg-gray-100'
                    : 'bg-white'
                } block text-sm font-semibold py-2 px-4 rounded text-primary
                    hover:bg-[#EFF6FF] hover:text-black/75`}
              >
                <div className='flex items-center'>
                  <CallBellIcon size={24} className='text-black/75 mr-2' weight="light" />
                  <span>Services</span>
                </div>
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Profile, Messages, Notifications, Logout */}
        <div className="flex flex-col items-start py-2 space-y-4 mb-10 border-t-2 border-black/10 rounded-t-lg">
          <div className="w-full flex items-center justify-between bg-gray-50 border rounded-lg border-black/10 p-2">
            {/* Logout Link */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-800 py-2 px-4 rounded transition-all hover:text-primary cursor-pointer"
            >
              <LogOut className="text-lg text-red-600" />
              <span className="text-sm font-semibold">Logout</span>
            </button>
            <div className="space-x-1 w-maxrounded-lg">
              <img
                src="/logo/snarcbitz_admin.png"
                alt="Logo_SnarcBitz"
                className="max-w-[115px] object-cover"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for Drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-40"
          onClick={toggleDrawer}
        />
      )}
    </nav>
  );
}
