'use client';

import { getMyProfile } from '@/app/api/profile';
import { useAuth } from '@/context/authUserContext';
import { ToastError } from '@/lib/validations/toast/ToastNofication';
import { ITransaction } from '@/types/Transaction';
import { useEffect, useState, useMemo } from 'react';

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

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const { data } = await getMyProfile();
      if (data?.historyByEvent) {
        setHistoryEvent(data.historyByEvent);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      ToastError(message);
    }
  };

  useEffect(() => {
    if (authUser && historyEvent.length === 0) {
      fetchProfile();
    }
  }, [authUser]);

  // Derive lastHistoryEvent
  const lastHistoryEvent = useMemo(() => {
    return historyEvent[historyEvent.length - 1] ?? null;
  }, [historyEvent]);

  // Derive paidTransactions & lastTransactions
  const { paidTransactions, lastTransactions } = useMemo(() => {
    if (!lastHistoryEvent?.transactions?.length)
      return { paidTransactions: [], lastTransactions: null };

    const filtered = lastHistoryEvent.transactions
      .filter((t) => t.status === 'paid')
      .map((ts) => ({
        _id: ts._id,
        tickets: ts.tickets,
        createdAt: ts.createdAt,
      }));

    return {
      paidTransactions: filtered,
      lastTransactions: filtered[0] ?? null,
    };
  }, [lastHistoryEvent]);

  return { lastTransactions, paidTransactions, lastHistoryEvent };
}
