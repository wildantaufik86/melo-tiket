'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ITicket } from '@/types/Ticket';
import { getLocalStorage, setLocalStorage } from '@/utils/clientUtils';

export type Orders = ITicket & {
  quantity: number;
  isOpen: boolean;
};

type OrdersContextType = {
  orders: Orders[] | null;
  saveOrders: (params: Orders[]) => void;
  getOrders: () => void;
};

export const OrdersContext = createContext<OrdersContextType | undefined>(
  undefined
);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Orders[] | []>([]);

  const saveOrders = (ordersData: Orders[]) => {
    if (ordersData.length > 0) setLocalStorage('orders', ordersData);
  };

  const getOrders = () => {
    const data: Orders[] | null = getLocalStorage('orders');
    if (data && data?.length > 0) {
      setOrders(data);
    } else {
      setOrders([]);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, saveOrders, getOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
