'use client';

import ErrorModal from '@/components/fragments/modal/ErrorModal';
import { createContext, useContext, useEffect, useState } from 'react';

type ModalContextType = {
  showErrorModal: (message: string) => void;
};

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>('');

  const showErrorModal = (message: string) => {
    setIsOpen(true);
    setMessage(message);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    }
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ showErrorModal }}>
      {children}
      {isOpen && <ErrorModal isOpen={isOpen} text={message} />}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModals must be used within an ModalProvider');
  }
  return context;
};
