'use client';

import {
  createTransaction,
  ICreateTransactionPayload,
} from '@/app/api/transcation';
import AlertModal from '@/components/fragments/modal/AlertModal';
import SuccessModal from '@/components/fragments/modal/SuccessModal';
import TermsModal from '@/components/fragments/modal/TermsModal';
import { useAuth } from '@/context/authUserContext';
import { Orders, useOrder } from '@/context/ordersContext';
import {
  ToastError,
  ToastSuccess,
} from '@/lib/validations/toast/ToastNofication';
import { deleteLocalStorage } from '@/utils/clientUtils';
import { formattedPrice, generate3Digit } from '@/utils/universalUtils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

type Props = {
  listOrder: Orders[];
  payload: ICreateTransactionPayload;
  incrementQty: (params: string) => void;
  decrementQty: (params: string) => void;
};

export default function CheckoutSection({
  listOrder,
  payload,
  incrementQty,
  decrementQty,
}: Props) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [availableTickets, setAvailableTickets] = useState<Orders[] | []>([]);
  const { saveOrders } = useOrder();
  const { authUser } = useAuth();
  const router = useRouter();
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalAlert, setOpenModalAlert] = useState(false);
  const [isPdfRead, setIsPdfRead] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const totalTicket = availableTickets.reduce(
    (acc, tc) => acc + tc.quantity,
    0
  );
  const subTotal = listOrder?.reduce(
    (acc, data) => acc + data.price * data.quantity,
    0
  );
  const platformFee: number = 5000;
  const [codeUnique, setCodeUnique] = useState<number>(0);
  const total = subTotal + platformFee * totalTicket + codeUnique;

  const clearOrderData = () => {
    return deleteLocalStorage('orders');
  };

  const handleCreateTransaction = async () => {
    try {
      if (!authUser) {
        ToastError('Tolong login terlebih dahulu');
        return;
      }

      if (authUser?.idNumber === null) {
        setOpenModalAlert(true);
        return;
      }

      if (payload && payload?.tickets.length === 0) {
        ToastError('Silahkan pesan tiket terlebih dahulu');
        return;
      }

      if (payload && !payload?.paymentProof) {
        ToastError('Tolong unggah bukti pembayaran');
        return;
      }

      const response = await createTransaction(payload);
      if (response.status == 'success' && response.data) {
        ToastSuccess(response.message);
        clearOrderData();
        setOpenModalSuccess(true);
        router.push('/user/profile');
      } else {
        ToastError(response.message);
      }
    } catch (err: any) {
      ToastError(err.message);
    }
  };

  useEffect(() => {
    if (listOrder && listOrder.length > 0) {
      setAvailableTickets(listOrder);
    }
  }, [listOrder]);

  useEffect(() => {
    if (totalTicket > 0) {
      setCodeUnique(Number(generate3Digit()));
    } else {
      setCodeUnique(0);
    }
  }, [availableTickets]);

  useEffect(() => {
    // handle qty ticket change
    if (availableTickets.length > 0) {
      saveOrders(availableTickets);
    }
  }, [availableTickets]);

  return (
    <section className="flex flex-col mt-8 md:flex-1 md:mt-0 md:max-h-[200px]">
      <div className="flex-1 flex flex-col gap-2 bg-secondary p-4 rounded-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm lg:text-xl font-medium">Subtotal</p>
          <p className="text-sm lg:text-xl font-medium">
            {formattedPrice(subTotal)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm flex flex-col lg:text-xl font-medium">
            Platform Fee
            <span className="text-[10px] opacity-50 lg:text-xs font-medium">
              Non Refundable
            </span>
          </p>
          <p className="text-sm lg:text-xl font-medium">
            {platformFee === 0
              ? 'Gratis'
              : `${platformFee} x ${totalTicket} Tickets`}
          </p>
        </div>

        {/* hr */}
        <div className="w-full h-[1px] bg-white"></div>

        <div className="flex items-center justify-between">
          <p className="text-sm flex flex-col lg:text-xl font-bold">
            TOTAL :
            <span className="text-[10px] opacity-50 lg:text-xs font-medium">
              Pembayaran ini sudah termasuk pajak
            </span>
          </p>
          <p className="text-sm lg:text-xl font-bold">
            {formattedPrice(total)}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {listOrder.map((ticket) => (
          <div
            key={ticket._id}
            className="flex flex-col rounded-sm p-4 bg-secondary"
          >
            <p
              className={`font-black lg:text-xl flex justify-between items-center ${
                ticket.status === 'Available'
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed'
              } `}
            >
              {ticket.name}{' '}
              <span>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    ticket.isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </span>
            </p>
            <div
              className={`mt-4 bg-white text-black justify-between items-center py-2 px-4 rounded-sm  transition-all scale-y-100 flex`}
            >
              <p className="flex flex-col font-bold lg:text-xl">
                {ticket.category.name}{' '}
                <span className="font-light lg:text-base">
                  {formattedPrice(ticket.price)}
                </span>
              </p>
              <div className="flex items-center">
                <div
                  onClick={() => decrementQty(ticket._id!)}
                  className="font-semibold text-white bg-red-500 w-5 h-5 rounded-full flex justify-center items-center cursor-pointer"
                >
                  -
                </div>
                <span className="px-4 font-semibold lg:text-xl">
                  {ticket.quantity}
                </span>
                <div
                  onClick={() => incrementQty(ticket._id!)}
                  className="font-semibold text-white bg-red-500 w-5 h-5 rounded-full flex justify-center items-center cursor-pointer"
                >
                  +
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <h1 className="font-bold text-lg mb-2">Syarat & Ketentuan</h1>
        <p className="text-sm">
          Silahkan baca{' '}
          <span
            onClick={() => {
              setIsPdfRead(true);
              setIsTermsModalOpen(true);
            }}
            className="text-primary font-bold italic cursor-pointer"
          >
            syarat & ketentuan
          </span>{' '}
          kami terlebih dahulu sebelum melakukan pembelian
        </p>

        <div
          className={`mt-4 flex items-center gap-2 ${
            isPdfRead ? 'opacity-100' : 'opacity-30'
          }`}
        >
          <input
            type="checkbox"
            id="isConfirmed"
            disabled={!isPdfRead}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
          <label
            htmlFor="isConfirmed"
            className={`${
              isPdfRead ? 'cursor-pointer' : 'cursor-not-allowed'
            } font-semibold`}
          >
            Saya telah membaca dan menyetujui syarat & ketentuan
          </label>
        </div>
      </div>

      <div
        onClick={isConfirmed && isPdfRead ? handleCreateTransaction : undefined}
        className={`w-full py-2 mt-4 bg-secondary rounded-full flex justify-center items-center ${
          isConfirmed ? 'cursor-pointer' : 'cursor-not-allowed'
        } hover:bg-primary transition-colors`}
      >
        <span className="text-sm lg:text-xl font-bold">
          Konfirmasi Pembelian
        </span>
      </div>

      {/* success modal */}
      <SuccessModal
        isOpen={openModalSuccess}
        onClose={() => setOpenModalSuccess(false)}
      />

      <AlertModal
        isOpen={openModalAlert}
        onClose={() => setOpenModalAlert(false)}
        text="anda belum mengisi NIK, silahkan lengkapi data di profil"
      />

      {/* terms modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </section>
  );
}
