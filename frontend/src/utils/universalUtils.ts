// @/lib/universalUtils.ts
// These functions are pure and don't depend on server-specific (next/headers)
// or client-specific (localStorage, document) APIs.

import type { Schema } from 'joi'; // Type import for Joi Schema

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

  const [day, month, year] = dob.split('/');

  // Buat Date object (tambah "20" untuk tahun 2 digit)
  const date = new Date(`20${year}-${month}-${day}`);

  return {
    day,
    month: date.toLocaleString(locale, { month: 'long' }),
    year: `20${year}`,
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
