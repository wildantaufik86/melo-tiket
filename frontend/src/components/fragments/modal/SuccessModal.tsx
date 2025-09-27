'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  // Auto close setelah 2 detik (opsional)
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl w-1/2 flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Lingkaran hijau */}
            <motion.div
              className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {/* Animasi ceklist */}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <motion.path d="M14 27l7 7 17-17" />
              </motion.svg>
            </motion.div>

            <p className="text-gray-800 font-semibold">Berhasil!</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
