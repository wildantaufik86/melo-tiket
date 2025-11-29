export function getStatusClass(status: any): string {
  switch (status) {
    case 'completed':
    return 'capitalize font-bold text-white bg-green-500 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'paid':
    return 'max-w-fit capitalize font-bold text-white bg-green-500 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'pending':
    return 'max-w-fit capitalize font-bold text-white bg-yellow-500 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'reject':
    return 'max-w-fit capitalize font-bold text-white bg-red-500 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'refund':
    return 'max-w-fit capitalize font-bold text-white bg-gray-600 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'superadmin':
    return 'max-w-fit capitalize font-bold text-white bg-rose-800 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'admin':
    return 'max-w-fit capitalize font-bold text-white bg-amber-600 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'operator':
    return 'max-w-fit capitalize font-bold text-white bg-blue-600 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'operator_gelang':
    return 'max-w-fit capitalize font-bold text-white bg-cyan-800 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'operator_voucher':
    return 'max-w-fit capitalize font-bold text-white bg-cyan-400 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'user':
    return 'max-w-fit capitalize font-bold text-white bg-gray-500 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    case 'expired':
    return 'max-w-fit capitalize font-bold text-white bg-red-700 rounded-md px-2 md:px-3 md:py-1 shadow-lg';
    default:
      return '';
  }
}
