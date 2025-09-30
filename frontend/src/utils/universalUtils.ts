// @/lib/universalUtils.ts
// These functions are pure and don't depend on server-specific (next/headers)
// or client-specific (localStorage, document) APIs.
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro'; // ✅ pakai versi pro

import type { Schema } from 'joi'; // Type import for Joi Schema
import { getSessionStorage, setSessionStorage } from './clientUtils';
import { RefObject } from 'react';

/**
 * Formats a date into a localized string (id-ID).
 * @param date The date string or Date object.
 * @returns Formatted date string.
 */

export const formattedDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Formats a date and time to WIB (Western Indonesia Time).
 * @param date The date string or Date object.
 * @returns Formatted date and time string with WIB.
 */
export const formatTanggalWIB = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const optionsTanggal: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const optionsWaktu: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta', // Explicitly set timezone for WIB
  };

  const tanggal = new Intl.DateTimeFormat('id-ID', optionsTanggal).format(
    dateObj
  );
  const waktu = new Intl.DateTimeFormat('id-ID', optionsWaktu).format(dateObj);

  return `${tanggal}, ${waktu} WIB`;
};

export const parseDateOfBirth = (
  dob: string | undefined,
  locale: string = 'en-US'
) => {
  if (!dob) {
    return { day: '', month: '', year: '' };
  }

  const [year, month, day] = dob.split('-');

  // Buat Date object (tambah "20" untuk tahun 2 digit)
  const date = new Date(`${year}-${month}-${day}`);

  return {
    day,
    month: date.toLocaleString(locale, { month: 'long' }),
    year: `${year}`,
  };
};

/**
 * Formats a price into Indonesian Rupiah currency.
 * @param price The price as a string or number.
 * @returns Formatted price string (e.g., "Rp 100.000").
 */
export const formattedPrice = (price: string | number): string => {
  const validPrice = Number(price);

  if (isNaN(validPrice)) {
    return 'Rp 0';
  }

  return validPrice.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // No decimal places for whole rupiah
    maximumFractionDigits: 0, // No decimal places for whole rupiah
  });
};

/**
 * Validates input against a Joi schema.
 * @param schema The Joi schema to validate against.
 * @param input The input data to validate.
 * @returns An object containing validation error (if any) and the validated value.
 */
export const validateInput = (schema: Schema, input: unknown) => {
  const { error, value } = schema.validate(input, { abortEarly: false }); // Get all errors
  return { error, value };
};

/**
 * Helper function to get appropriate Tailwind CSS styling based on order status.
 * @param status The order status string.
 * @returns Tailwind CSS classes.
 */
export const getStatusStyle = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Groups orders by month and year and sorts them chronologically (newest month first)
 * and orders within each month (newest order first).
 * @param orders An array of order objects, each with a `createdAt` property.
 * @returns An object where keys are "Month Year" strings and values are arrays of sorted orders.
 */
export const groupOrdersByMonth = (
  orders: { createdAt: string }[]
): { [key: string]: { createdAt: string }[] } => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return {};
  }

  const grouped: { [key: string]: { createdAt: string }[] } = {};

  orders.forEach((order) => {
    if (!order.createdAt) {
      console.warn('Order missing createdAt:', order);
      return;
    }

    const date = new Date(order.createdAt);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date for order:', order);
      return;
    }

    const monthYear = `${date.toLocaleString('id-ID', {
      month: 'long',
      year: 'numeric',
    })}`;

    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }

    grouped[monthYear].push(order);
  });

  const sortedMonthYears = Object.keys(grouped).sort(
    (monthYearA, monthYearB) => {
      const dateA = new Date(monthYearA + ' 1');
      const dateB = new Date(monthYearB + ' 1');
      return dateB.getTime() - dateA.getTime();
    }
  );

  const sortedGroupedOrders: { [key: string]: { createdAt: string }[] } = {};
  sortedMonthYears.forEach((monthYear) => {
    const sortedOrdersInMonth = grouped[monthYear].sort((orderA, orderB) => {
      const dateA = new Date(orderA.createdAt);
      const dateB = new Date(orderB.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    sortedGroupedOrders[monthYear] = sortedOrdersInMonth;
  });

  return sortedGroupedOrders;
};

export function generate3Digit(): string {
  const codeUnique = getSessionStorage('code-unique'); // konsisten penamaan key

  if (!codeUnique) {
    // Random 0..999 lalu pad depan dengan 0 sampai panjang 3
    const num = Math.floor(Math.random() * 1000); // 0..999
    const code = String(num).padStart(3, '0');

    setSessionStorage('code-unique', code); // simpan dalam bentuk string
    return code;
  }

  // kalau sudah ada di sessionStorage → kembalikan existing value
  return String(codeUnique);
}

// Helper function untuk preload image dengan authentication
const preloadImageWithAuth = async (src: string): Promise<string> => {
  try {
    const response = await fetch(src, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error preloading image:', error);
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkUtVGlja2V0PC90ZXh0Pjwvc3ZnPg==';
  }
};

// Helper function untuk cek unsupported CSS color
const isUnsupportedColor = (color: string) => {
  return (
    color?.includes('lab(') ||
    color?.includes('oklch(') ||
    color?.includes('lch(') ||
    color?.includes('color(')
  );
};

// Helper function untuk normalisasi warna
const normalizeColor = (color: string, fallback: string): string => {
  if (!color) return fallback;
  return isUnsupportedColor(color) ? fallback : color;
};

// Helper: Fetch gambar menjadi Base64 dengan authentication
const fetchImageAsBase64 = async (src: string): Promise<string> => {
  try {
    const response = await fetch(src, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.status}`);

    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error preloading image:', error);
    // fallback SVG
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkUtVGlja2V0PC90ZXh0Pjwvc3ZnPg==';
  }
};

// Helper: Kompres image
const compressImage = (canvas: HTMLCanvasElement, quality: number): string => {
  return canvas.toDataURL('image/jpeg', quality);
};

// Helper: Estimasi ukuran PDF
const estimatePDFSize = (base64String: string): number => {
  const base64Length = base64String.length;
  return (base64Length * 3) / 4 + 50000; // overhead PDF
};

// Main function: Download tiket PDF
export const handleFallbackDownload = async (
  ticketRef: RefObject<HTMLDivElement | null>,
  ticketsUrl: string[],
  BASE_URL: string
): Promise<void> => {
  if (!ticketRef.current) return;

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  try {
    const pdf = new jsPDF('portrait', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // 1️⃣ Preload semua image jadi Base64
    const base64Images = await Promise.all(
      ticketsUrl.map((url) => fetchImageAsBase64(BASE_URL + url))
    );

    for (let i = 0; i < ticketsUrl.length; i++) {
      // 2️⃣ Clone node tiket
      const clone = ticketRef.current.cloneNode(true) as HTMLElement;

      // Temp container untuk render
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.backgroundColor = '#ffffff';
      document.body.appendChild(tempContainer);
      tempContainer.appendChild(clone);

      // 3️⃣ Ganti semua <img> dengan Base64 dan tunggu load
      const imgElements = clone.querySelectorAll('img');
      await Promise.all(
        Array.from(imgElements).map(
          (imgEl, idx) =>
            new Promise<void>((resolve, reject) => {
              imgEl.src = base64Images[i]; // Asumsi 1 image per tiket
              if (imgEl.complete) return resolve();
              imgEl.onload = () => resolve();
              imgEl.onerror = () => reject(`Failed to load image ${i}`);
            })
        )
      );

      // 4️⃣ Render ke canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      document.body.removeChild(tempContainer);

      // 5️⃣ Kompres image jika terlalu besar
      let quality = 0.9;
      let imgData = compressImage(canvas, quality);
      let estimatedSize = estimatePDFSize(imgData);

      while (estimatedSize > MAX_FILE_SIZE && quality > 0.1) {
        quality -= 0.1;
        imgData = compressImage(canvas, quality);
        estimatedSize = estimatePDFSize(imgData);
      }

      // 6️⃣ Fit image ke halaman PDF
      const margin = 30;
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;
      const widthRatio = availableWidth / canvas.width;
      const heightRatio = availableHeight / canvas.height;
      const ratio = Math.min(widthRatio, heightRatio, 0.9);

      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;
      const x = (pageWidth - imgWidth) / 2;
      const y = margin;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
    }

    pdf.save('e-ticket.pdf');
  } catch (error) {
    console.error('Download failed:', error);
    alert('Gagal mengunduh PDF, coba lagi.');
  }
};
