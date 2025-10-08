'use client';

import { getMyProfile } from '@/app/api/profile';
import { useAuth } from '@/context/authUserContext';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { ITransaction } from '@/types/Transaction';
import { useEffect, useState } from 'react';

interface IHistoryByEvent {
  _id: string;
  eventName: string;
  date: string;
  address: string;
  transactions: ITransaction[];
}

type TransactionSummary = Pick<ITransaction, '_id' | 'tickets' | 'createdAt'>;

export function useTickets() {
  const { authUser } = useAuth();
  const [historyEvent, setHistoryEvent] = useState<IHistoryByEvent[]>([]);
  const [lastTransactions, setLastTransactions] =
    useState<TransactionSummary | null>(null);
  const [paidTransactions, setPaidTransactions] = useState<
    TransactionSummary[]
  >([]);
  const lastHistoryEvent = historyEvent[historyEvent.length - 1];

  const fetchProfil = async () => {
    try {
      const response = await getMyProfile();
      if (response.data) {
        setHistoryEvent(response.data.historyByEvent);
      }
    } catch (error: any) {
      ToastError(error.message || '');
    }
  };

  useEffect(() => {
    if (lastHistoryEvent && lastHistoryEvent?.transactions?.length > 0) {
      const filtered = lastHistoryEvent.transactions
        .filter((data) => data.status === 'paid')
        .map((ts) => ({
          _id: ts._id,
          tickets: ts.tickets,
          createdAt: ts.createdAt,
        }));
      setLastTransactions(filtered[0]);
      setPaidTransactions(filtered);
    }
  }, [historyEvent]);

  useEffect(() => {
    if (authUser) {
      fetchProfil();
    }
  }, [authUser]);

  return { lastTransactions, paidTransactions, lastHistoryEvent };
}
