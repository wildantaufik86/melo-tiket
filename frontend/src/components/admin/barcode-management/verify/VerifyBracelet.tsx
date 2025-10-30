'use client';

import { useState, useEffect } from 'react';
import BreadCrumb, { BreadCrumbItem } from '@/components/navigation/BreadCrumb';
import {
  ArrowsClockwiseIcon,
  CameraIcon,
  CheckCircleIcon,
  QrCodeIcon,
  XCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { verifyWristbandQr } from '@/app/api/transcation';

export default function VerifyBracelet() {
  const breadcrumbItems: BreadCrumbItem[] = [
    {
      label: 'QR Managements',
      href: '/admin/homepage',
      icon: <QrCodeIcon size={16} />,
    },
    { label: 'Verify Bracelet' },
  ];

  const [isScannerRunning, setIsScannerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [scanResult, setScanResult] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const startScanner = () => {
    setScanResult(null);
    setIsScannerRunning(true);
  };

  const handleVerify = async (decodedText: string) => {
    setIsLoading(true);
    const response = await verifyWristbandQr(decodedText);

    setScanResult({
      message: response.message,
      type: response.status,
    });

    setIsLoading(false);
  };

  useEffect(() => {
    if (!isScannerRunning) {
      return;
    }

    const scanner = new Html5QrcodeScanner(
      'qr-reader-container',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      false
    );

    const onScanSuccess = (decodedText: string, decodedResult: any) => {
      if (isLoading) return;

      scanner.clear();
      setIsScannerRunning(false);
      handleVerify(decodedText);
    };

    const onScanFailure = (error: string) => {
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      if (scanner) {
        scanner.clear().catch((err) => {
          console.error('Gagal membersihkan scanner:', err);
        });
      }
    };
  }, [isScannerRunning, isLoading]);

  return (
    <section>
      <BreadCrumb items={breadcrumbItems} />
      <div className="w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
        <div className="max-w-lg mx-auto flex flex-col items-center">

          {/* 1. Tombol Mulai Scan */}
          {!isScannerRunning && !scanResult && (
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Verify Bracelet QR
              </h2>
              <p className="text-gray-600 text-center">
                Tekan tombol di bawah untuk memulai kamera dan memindai QR code
                pada gelang.
              </p>
              <button
                onClick={startScanner}
                disabled={isLoading}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <CameraIcon size={24} />
                Mulai Scan
              </button>
            </div>
          )}

          {/* 2. Viewfinder Kamera */}
          {isScannerRunning && (
            <div className="w-full">
              <div id="qr-reader-container" className="w-full" />
              <button
                onClick={() => setIsScannerRunning(false)}
                className="mt-4 w-full text-center text-sm text-gray-500 hover:text-red-600"
              >
                Batal
              </button>
            </div>
          )}

          {/* 3. Tampilan Loading */}
          {isLoading && (
            <div className="flex flex-col items-center gap-3 p-4">
              <svg
                className="animate-spin h-10 w-10 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-lg font-medium text-gray-700">
                Memverifikasi...
              </p>
            </div>
          )}

          {/* 4. Tampilan Hasil */}
          {!isLoading && scanResult && (
            <div className="flex flex-col items-center gap-4 text-center">
              {scanResult.type === 'success' ? (
                <CheckCircleIcon
                  size={80}
                  className="text-green-500"
                  weight="duotone"
                />
              ) : (
                <XCircleIcon
                  size={80}
                  className="text-red-500"
                  weight="duotone"
                />
              )}
              <h2
                className={`text-2xl font-bold ${
                  scanResult.type === 'success'
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}
              >
                {scanResult.type === 'success' ? 'Gelang Terverifikasi' : 'Akses Ditolak'}
              </h2>
              <p className="text-lg text-gray-600">{scanResult.message}</p>

              <button
                onClick={startScanner}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowsClockwiseIcon size={20} />
                Scan Lagi
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
