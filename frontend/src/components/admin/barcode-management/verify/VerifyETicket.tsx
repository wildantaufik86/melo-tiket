'use client';

import { useState, useEffect } from 'react';
import BreadCrumb, { BreadCrumbItem } from '@/components/navigation/BreadCrumb';
import { ArrowsClockwiseIcon, CameraIcon, CheckCircleIcon, QrCodeIcon, XCircleIcon, ArrowUUpLeftIcon, TicketIcon } from '@phosphor-icons/react/dist/ssr';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { verifyETicket, revertETicketScan } from '@/app/api/transcation';
import { IVerifyETicketResponse } from '@/app/api/transcation';

export default function VerifyETicket() {
  const breadcrumbItems: BreadCrumbItem[] = [
    {
      label: 'QR Managements',
      href: '/admin/homepage',
      icon: <QrCodeIcon size={16} />,
    },
    { label: 'Verify E-Ticket' },
  ];

  const [isScannerRunning, setIsScannerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{
    message: string;
    type: 'success' | 'error';
    data?: IVerifyETicketResponse | null;
  } | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const [reverseTicketId, setReverseTicketId] = useState('');
  const [isReversing, setIsReversing] = useState(false);
  const [reverseResult, setReverseResult] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const startScanner = () => {
    setScanResult(null);
    setScannedData(null);
    setIsScannerRunning(true);
  };

const handleVerify = async () => {
    if (!scannedData) return;

    setIsLoading(true);
    const response = await verifyETicket(scannedData);

    setScanResult({
      message: response.message,
      type: response.status,
      data: response.data,
    });

    if (response.status === 'error') {
      setReverseTicketId(scannedData);
    }

    setIsLoading(false);
    setScannedData(null);
  };
  const handleRevert = async () => {
    if (!reverseTicketId) {
      setReverseResult({
        message: 'Ticket ID tidak boleh kosong.',
        type: 'error',
      });
      return;
    }

    setIsReversing(true);
    setReverseResult(null);

    const response = await revertETicketScan(reverseTicketId);

    setReverseResult({
      message: response.message,
      type: response.status,
    });

    setIsReversing(false);
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
      setScannedData(decodedText);
    };

    const onScanFailure = (error: string) => {};

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      if (scanner && typeof scanner.clear === 'function') {
        scanner.clear().catch((err) => {
          console.error('Gagal membersihkan scanner:', err);
        });
      }
    };
  }, [isScannerRunning, isLoading]);

  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

return (
    <section>
      <BreadCrumb items={breadcrumbItems} />
      <div className="w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
        <div className="max-w-lg mx-auto flex flex-col items-center">

          {/* --- 4. Modifikasi Logika Render --- */}

          {/* 1. Tombol Mulai Scan (State Awal) */}
          {!isScannerRunning && !scanResult && !scannedData && (
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Verify E-Ticket QR
              </h2>
              <p className="text-gray-600 text-center">
                Tekan tombol di bawah untuk memulai kamera dan memindai QR code
                pada E-Ticket.
              </p>
              <button
                onClick={startScanner}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <CameraIcon size={24} />
                Mulai Scan
              </button>
            </div>
          )}

          {/* 2. Viewfinder Kamera (State Scanning) */}
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

          {/* 3. TAMPILAN PREVIEW BARU (State Preview) */}
          {!isScannerRunning && scannedData && !scanResult && (
            <div className="flex flex-col items-center gap-4 text-center w-full">
              <TicketIcon size={80} className="text-gray-400" weight="duotone" />
              <h2 className="text-xl font-semibold text-gray-800">
                Tiket Terbaca
              </h2>
              <p className="text-gray-600">
                Data QR berikut terdeteksi. Tekan verifikasi untuk melanjutkan.
              </p>

              <div className="w-full bg-gray-100 p-4 rounded-md border border-gray-300">
                <span className="text-sm font-medium text-gray-500 block">Ticket ID:</span>
                <code className="text-lg font-bold text-gray-900 break-all">{scannedData}</code>
              </div>

              <button
                onClick={handleVerify}
                disabled={isLoading}
                className="mt-4 w-full inline-flex justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
              >
                {isLoading ? <Spinner /> : <CheckCircleIcon size={24} />}
                Verifikasi Sekarang
              </button>

              <button
                onClick={startScanner} // Tombol ini berfungsi sebagai "Scan Ulang"
                disabled={isLoading}
                className="w-full text-center text-sm text-gray-500 hover:text-red-600"
              >
                Scan Ulang (Batal)
              </button>
            </div>
          )}

          {/* 4. Tampilan Hasil (State Hasil) */}
          {/* Tampil jika scanResult ada, dan scannedData sudah dibersihkan */}
          {!isScannerRunning && scanResult && !scannedData && (
            <div className="flex flex-col items-center gap-4 text-center w-full">
              {scanResult.type === 'success' ? (
                <CheckCircleIcon size={80} className="text-green-500" weight="duotone" />
              ) : (
                <XCircleIcon size={80} className="text-red-500" weight="duotone" />
              )}
              <h2
                className={`text-2xl font-bold ${
                  scanResult.type === 'success'
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}
              >
                {scanResult.type === 'success'
                  ? 'Tiket Terverifikasi'
                  : 'Akses Ditolak'}
              </h2>
              <p className="text-lg text-gray-600">{scanResult.message}</p>

              {/* Tampilkan Info User jika sukses */}
              {scanResult.type === 'success' && scanResult.data?.user && (
                <div className="mt-4 pt-4 border-t border-gray-200 w-full text-left bg-gray-50 p-4 rounded-md">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">
                    Data Pemegang Tiket:
                  </h4>
                  <div className="space-y-1">
                    <p className="text-gray-700 flex justify-between">
                      <span className="font-medium text-gray-500">Nama:</span>
                      <span className="font-bold text-gray-900">
                        {scanResult.data.user.fullname}
                      </span>
                    </p>
                    <p className="text-gray-700 flex justify-between">
                      <span className="font-medium text-gray-500">ID (KTP):</span>
                      <span className="font-bold text-gray-900">
                        {scanResult.data.user.idNumber}
                      </span>
                    </p>
                    <p className="text-gray-700 flex justify-between">
                      <span className="font-medium text-gray-500">Gender:</span>
                      <span className="font-bold text-gray-900 capitalize">
                        {scanResult.data.user.gender === 'female'
                          ? 'Perempuan'
                          : 'Laki-laki'}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={startScanner}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowsClockwiseIcon size={20} />
                Scan Lagi
              </button>
            </div>
          )}

          {/* 5. Bagian Reversal (Selalu tampil di bawah kecuali saat scanning) */}
          {!isScannerRunning && (
            <>
              <hr className="my-8 border-gray-300 w-full" />
              <div className="w-full flex flex-col items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Batalkan Scan (Superadmin)
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  Jika terjadi kesalahan scan, masukkan ID Tiket di bawah untuk
                  mengembalikan statusnya.
                </p>
                <div className="w-full space-y-2">
                  <label
                    htmlFor="ticketId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ticket ID
                  </label>
                  <input
                    type="text"
                    id="ticketId"
                    value={reverseTicketId}
                    onChange={(e) => {
                      setReverseTicketId(e.target.value);
                      setReverseResult(null);
                    }}
                    disabled={isReversing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Masukkan ID Tiket (dari QR)..."
                  />
                </div>
                <button
                  onClick={handleRevert}
                  disabled={isReversing || !reverseTicketId}
                  className="mt-2 w-full inline-flex justify-center items-center gap-2 px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
                >
                  {isReversing ? <Spinner /> : <ArrowUUpLeftIcon size={20} />}
                  Batalkan Scan
                </button>

                {!isReversing && reverseResult && (
                  <div
                    className={`mt-4 text-center p-3 rounded-md w-full ${
                      reverseResult.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <p className="font-medium">{reverseResult.message}</p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
}
