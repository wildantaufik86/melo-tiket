// @/lib/universalUtils.ts
// These functions are pure and don't depend on server-specific (next/headers)
// or client-specific (localStorage, document) APIs.

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    // Return placeholder image sebagai fallback
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkUtVGlja2V0PC90ZXh0Pjwvc3ZnPg==';
  }
};

export const handleFallbackDownload = async (
  ticketRef: RefObject<HTMLDivElement | null>
): Promise<void> => {
  if (!ticketRef.current) return;

  let blobUrls: string[] = []; // Untuk cleanup nanti

  try {
    // Clone element dan bersihkan style yang bermasalah
    const clone = ticketRef.current.cloneNode(true) as HTMLElement;

    // Preload semua images dengan authentication SEBELUM membuat DOM
    const images = clone.querySelectorAll('img');
    const imagePreloadPromises: Promise<void>[] = [];

    images.forEach((img) => {
      if (
        img.src &&
        (img.src.includes('localhost:5000') || img.src.includes('uploads'))
      ) {
        const promise = preloadImageWithAuth(img.src)
          .then((blobUrl) => {
            blobUrls.push(blobUrl); // Store untuk cleanup
            img.src = blobUrl; // Replace dengan authenticated blob URL
            img.crossOrigin = 'anonymous'; // Set crossOrigin
          })
          .catch((error) => {
            console.error('Failed to preload image:', error);
            // Set placeholder jika gagal load
            img.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkUtVGlja2V0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
          });
        imagePreloadPromises.push(promise);
      }
    });

    // Wait untuk semua images selesai diload
    await Promise.allSettled(imagePreloadPromises);

    // Tambahkan delay kecil untuk memastikan images fully loaded
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Buat container sementara dengan ukuran yang lebih optimal
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '800px';
    tempContainer.style.padding = '40px';
    tempContainer.style.backgroundColor = '#f8fafc';
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    // Style clone sebagai card
    clone.style.width = '100%';
    clone.style.maxWidth = '720px';
    clone.style.backgroundColor = '#ffffff';
    clone.style.color = '#000000';
    clone.style.fontSize = '14px';
    clone.style.lineHeight = '1.5';
    clone.style.borderRadius = '16px';
    clone.style.boxShadow =
      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
    clone.style.border = '1px solid #e2e8f0';
    clone.style.padding = '32px';
    clone.style.margin = '0 auto';
    clone.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    // Bersihkan semua style yang menggunakan lab()
    const allElements = clone.querySelectorAll('*');
    allElements.forEach((element) => {
      const htmlElement = element as HTMLElement;

      // Reset ke warna standar
      if (
        htmlElement.style.backgroundColor &&
        htmlElement.style.backgroundColor.includes('lab(')
      ) {
        htmlElement.style.backgroundColor = '#ffffff';
      }
      if (htmlElement.style.color && htmlElement.style.color.includes('lab(')) {
        htmlElement.style.color = '#000000';
      }

      // Hapus class yang mungkin menggunakan warna lab
      htmlElement.classList.remove(
        'bg-secondary',
        'text-primary',
        'bg-black/30',
        'fixed',
        'inset-0'
      );

      // Header styling (card title)
      if (htmlElement.tagName === 'H4') {
        htmlElement.style.color = '#1e293b';
        htmlElement.style.fontSize = '20px';
        htmlElement.style.fontWeight = '700';
        htmlElement.style.marginBottom = '20px';
        htmlElement.style.marginTop = '0';
        htmlElement.style.paddingBottom = '12px';
        htmlElement.style.borderBottom = '2px solid #e2e8f0';
        htmlElement.style.position = 'relative';
      }

      // Paragraph styling
      if (htmlElement.tagName === 'P') {
        htmlElement.style.color = '#475569';
        htmlElement.style.lineHeight = '1.6';
        htmlElement.style.margin = '0';
      }

      // Label styling (font semibold)
      if (htmlElement.classList.contains('font-semibold')) {
        htmlElement.style.color = '#374151';
        htmlElement.style.fontSize = '13px';
        htmlElement.style.fontWeight = '600';
        htmlElement.style.marginBottom = '6px';
        htmlElement.style.textTransform = 'uppercase';
        htmlElement.style.letterSpacing = '0.05em';
      }

      // Input field styling
      if (htmlElement.classList.contains('bg-slate-100')) {
        htmlElement.style.backgroundColor = '#f8fafc';
        htmlElement.style.border = '1px solid #e2e8f0';
        htmlElement.style.borderRadius = '8px';
        htmlElement.style.padding = '12px';
        htmlElement.style.fontSize = '14px';
        htmlElement.style.color = '#1e293b';
        htmlElement.style.transition = 'all 0.2s ease';
      }

      // Grid styling
      if (
        htmlElement.classList.contains('grid') ||
        htmlElement.classList.contains('grid-cols-2')
      ) {
        htmlElement.style.display = 'grid';
        htmlElement.style.gridTemplateColumns = '1fr 1fr';
        htmlElement.style.gap = '20px';
        htmlElement.style.marginBottom = '24px';
      }

      // Gap styling untuk flex
      if (htmlElement.classList.contains('gap-4')) {
        htmlElement.style.gap = '16px';
      }

      if (htmlElement.classList.contains('gap-2')) {
        htmlElement.style.gap = '8px';
      }

      // Margin top styling
      if (htmlElement.classList.contains('mt-4')) {
        htmlElement.style.marginTop = '24px';
      }

      // Flex column styling
      if (htmlElement.classList.contains('flex-col')) {
        htmlElement.style.display = 'flex';
        htmlElement.style.flexDirection = 'column';
      }

      // Button styling (jika ada)
      if (htmlElement.tagName === 'BUTTON') {
        htmlElement.style.display = 'none';
      }

      // E-Ticket section styling
      if (
        htmlElement.querySelector('img') &&
        htmlElement.classList.contains('relative')
      ) {
        htmlElement.style.width = '100%';
        htmlElement.style.minHeight = '300px';
        htmlElement.style.display = 'flex';
        htmlElement.style.alignItems = 'center';
        htmlElement.style.justifyContent = 'center';
        htmlElement.style.backgroundColor = '#f1f5f9';
        htmlElement.style.border = '2px dashed #cbd5e1';
        htmlElement.style.borderRadius = '12px';
        htmlElement.style.marginTop = '16px';
        htmlElement.style.position = 'relative';
        htmlElement.style.overflow = 'hidden';

        // Style untuk gambar di dalam
        const img = htmlElement.querySelector('img') as HTMLImageElement;
        if (img) {
          img.style.width = 'auto';
          img.style.height = 'auto';
          img.style.maxWidth = '100%';
          img.style.maxHeight = '280px';
          img.style.objectFit = 'contain';
          img.style.borderRadius = '8px';
          img.crossOrigin = 'anonymous'; // Pastikan crossOrigin set
        }
      }

      // Divider antara sections
      if (
        htmlElement.classList.contains('flex') &&
        htmlElement.classList.contains('flex-col') &&
        htmlElement.querySelector('h4')
      ) {
        htmlElement.style.position = 'relative';
        htmlElement.style.paddingTop = '24px';

        if (htmlElement.previousElementSibling) {
          htmlElement.style.borderTop = '1px solid #e2e8f0';
          htmlElement.style.marginTop = '24px';
        }
      }
    });

    // Tambahkan header card di bagian atas
    const cardHeader = document.createElement('div');
    cardHeader.style.textAlign = 'center';
    cardHeader.style.marginBottom = '32px';
    cardHeader.style.paddingBottom = '20px';
    cardHeader.style.borderBottom = '2px solid #e2e8f0';
    cardHeader.innerHTML = `
      <h2 style="
        color: #1e293b; 
        font-size: 24px; 
        font-weight: 800; 
        margin: 0 0 8px 0;
        font-family: system-ui, -apple-system, sans-serif;
      ">E-TICKET</h2>
      <p style="
        color: #64748b; 
        font-size: 14px; 
        margin: 0;
        font-family: system-ui, -apple-system, sans-serif;
      ">Tiket Digital - ${new Date().toLocaleDateString('id-ID')}</p>
    `;
    clone.insertBefore(cardHeader, clone.firstChild);

    // Tambahkan footer card di bagian bawah
    const cardFooter = document.createElement('div');
    cardFooter.style.textAlign = 'center';
    cardFooter.style.marginTop = '32px';
    cardFooter.style.paddingTop = '20px';
    cardFooter.style.borderTop = '1px solid #e2e8f0';
    cardFooter.style.color = '#9ca3af';
    cardFooter.style.fontSize = '12px';
    cardFooter.innerHTML = `
      <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif;">
        Dokumen ini dibuat secara otomatis pada ${new Date().toLocaleString(
          'id-ID'
        )}
      </p>
    `;
    clone.appendChild(cardFooter);

    // Generate canvas dengan kualitas tinggi dan options untuk handle auth images
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: false, // Disable CORS karena kita sudah handle auth
      allowTaint: true, // Allow tainted canvas dari blob URLs
      backgroundColor: '#f8fafc',
      width: 800,
      height: clone.scrollHeight + 80,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      logging: false, // Disable logging untuk produksi
      onclone: (clonedDoc) => {
        // Last check untuk memastikan images ready
        const clonedImages = clonedDoc.querySelectorAll('img');
        clonedImages.forEach((img) => {
          img.crossOrigin = 'anonymous';
          // Ensure images are loaded
          if (!img.complete || img.naturalHeight === 0) {
            img.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkUtVGlja2V0PC90ZXh0Pjwvc3ZnPg==';
          }
        });
      },
    });

    // Bersihkan DOM
    document.body.removeChild(tempContainer);

    // Cleanup blob URLs
    blobUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    const imgData = canvas.toDataURL('image/png', 0.95);

    // Buat PDF dengan orientasi portrait
    const pdf = new jsPDF('portrait', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Hitung dimensi dengan margin yang lebih kecil untuk card
    const margin = 30;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    // Hitung rasio untuk fit ke halaman
    const widthRatio = availableWidth / canvas.width;
    const heightRatio = availableHeight / canvas.height;
    const ratio = Math.min(widthRatio, heightRatio, 0.9);

    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;

    // Center image
    const x = (pageWidth - imgWidth) / 2;
    const y = margin;

    // Handle multi-page jika diperlukan
    if (imgHeight > availableHeight) {
      let currentY = 0;
      let pageCount = 0;

      while (currentY < canvas.height) {
        if (pageCount > 0) {
          pdf.addPage();
        }

        const remainingHeight = canvas.height - currentY;
        const pageCanvasHeight = Math.min(
          remainingHeight,
          Math.floor(canvas.height * (availableHeight / imgHeight))
        );

        // Buat canvas untuk halaman ini
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d')!;
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageCanvasHeight;

        // Gambar bagian canvas yang sesuai
        pageCtx.drawImage(
          canvas,
          0,
          currentY,
          canvas.width,
          pageCanvasHeight,
          0,
          0,
          canvas.width,
          pageCanvasHeight
        );

        const pageImgData = pageCanvas.toDataURL('image/png', 0.95);
        const pageImgHeight = pageCanvasHeight * ratio;

        pdf.addImage(pageImgData, 'PNG', x, y, imgWidth, pageImgHeight);

        currentY += pageCanvasHeight;
        pageCount++;
      }
    } else {
      // Single page
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    }

    pdf.save('e-ticket-card.pdf');
    console.log('PDF card berhasil diunduh!');
  } catch (error) {
    console.error('Card download failed:', error);

    // Cleanup blob URLs jika ada error
    blobUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (cleanupError) {
        console.error('Error cleaning up blob URL:', cleanupError);
      }
    });

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    alert(
      `Gagal mengunduh PDF: ${errorMessage}. Pastikan Anda sudah login dan coba lagi.`
    );
  }
};
