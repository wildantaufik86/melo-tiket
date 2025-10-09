import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastSuccess = (message: string): void => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 2000,
    pauseOnHover: false,
    hideProgressBar: true,
    transition: Bounce,
  });
};

export const ToastError = (message: string): void => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 5000,
    pauseOnHover: false,
    hideProgressBar: true,
    transition: Bounce,
  });
};

export const ToastInfo = (message: string): void => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 2000,
    pauseOnHover: false,
    hideProgressBar: true,
    transition: Bounce,
  });
};

export const ToastAlert = (
  message: string,
  router: AppRouterInstance
): void => {
  toast.error(message, {
    position: 'top-center',
    autoClose: false,
    closeOnClick: false,
    closeButton: true,
    draggable: false,
    progress: undefined,
    onClose: () => router.replace('/auth/login'),
  });
};
