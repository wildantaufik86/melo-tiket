'use client'

import { useState } from 'react';
import BreadCrumb, { BreadCrumbItem } from '@/components/navigation/BreadCrumb';
import { QrCodeIcon, DownloadSimple } from '@phosphor-icons/react/dist/ssr';
import { ToastError, ToastInfo, ToastSuccess } from '@/lib/validations/toast/ToastNofication';
import { generateQrCodes } from '@/app/api/transcation';
import { toast } from 'react-hot-toast';

export default function CreateQRAdminDisplay() {
  const breadcrumbItems: BreadCrumbItem[] = [
    {
      label: 'QR Managements',
      href: '/admin/homepage',
      icon: <QrCodeIcon size={16} />,
    },
    { label: 'Create QR' },
  ];

  const [quantity, setQuantity] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (quantity <= 0) {
      ToastError('Quantity must be greater than 0');
      return;
    }
    if (quantity > 1000) {
      ToastError('Cannot generate more than 1000 at a time');
      return;
    }

    setIsLoading(true);
    ToastInfo('Generating QR codes...');

    try {
      const response = await generateQrCodes(quantity);

      const disposition = response.headers.get('content-disposition');
      let filename = `melofest-qrcodes-${Date.now()}.zip`;
      if (disposition && disposition.includes('attachment')) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.dismiss();
      ToastSuccess('QR Codes downloaded!');

    } catch (error: any) {
      toast.dismiss();
      ToastError(error.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <BreadCrumb items={breadcrumbItems} />
      <div className="w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Generate QR Codes
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Enter the number of QR codes you want to generate. They will be
            downloaded as a single ZIP file.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={isLoading}
                min="1"
                max="1000" // Samakan dengan batas di backend
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., 50"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Generating...
                </>
              ) : (
                <>
                  <DownloadSimple size={18} />
                  Generate & Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
