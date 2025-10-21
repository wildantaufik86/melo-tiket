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

  const { filteredPhaseTransaction } = useMemo(() => {
    if (paidTransactions && paidTransactions.length > 0) {
      const filteredPhaseOne = paidTransactions.filter((data) => {
        if (data.createdAt) {
          const itemDate = new Date(data.createdAt);
          const phaseOneStart = new Date('2025-09-28');
          const phaseOneEnd = new Date(' 2025-10-12');

          // ambil tanggal lokal (tanpa jam)
          const itemLocal = new Date(
            itemDate.getFullYear(),
            itemDate.getMonth(),
            itemDate.getDate()
          );
          const startLocal = new Date(
            phaseOneStart.getFullYear(),
            phaseOneStart.getMonth(),
            phaseOneStart.getDate()
          );
          const endLocal = new Date(
            phaseOneEnd.getFullYear(),
            phaseOneEnd.getMonth(),
            phaseOneEnd.getDate()
          );

          return itemLocal >= startLocal && itemLocal <= endLocal;
        }
      });

      const filteredPhaseTwo = paidTransactions.filter((data) => {
        if (data.createdAt) {
          const itemDate = new Date(data.createdAt);
          const phaseTwoStart = new Date('2025-10-21');
          const phaseTwoEnd = new Date('2025-10-31');

          // ambil tanggal lokal (tanpa jam)
          const itemLocal = new Date(
            itemDate.getFullYear(),
            itemDate.getMonth(),
            itemDate.getDate()
          );
          const startLocal = new Date(
            phaseTwoStart.getFullYear(),
            phaseTwoStart.getMonth(),
            phaseTwoStart.getDate()
          );
          const endLocal = new Date(
            phaseTwoEnd.getFullYear(),
            phaseTwoEnd.getMonth(),
            phaseTwoEnd.getDate()
          );

          return itemLocal >= startLocal && itemLocal <= endLocal;
        }
      });

      return {
        filteredPhaseTransaction: {
          phaseOne: filteredPhaseOne,
          phaseTwo: filteredPhaseTwo,
        },
      };
    }

    return {
      filteredPhaseTransaction: null,
    };
  }, [paidTransactions]);

  return {
    lastTransactions,
    paidTransactions,
    lastHistoryEvent,
    filteredPhaseTransaction,
  };
}
