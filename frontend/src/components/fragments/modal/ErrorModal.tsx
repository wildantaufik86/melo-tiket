'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { IoMdAlert } from 'react-icons/io';

interface ErrorModalProps {
  isOpen: boolean;
  text: string;
}

export default function ErrorModal({ isOpen, text }: ErrorModalProps) {
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
            className="bg-white p-6 rounded-2xl shadow-xl w-11/12 max-w-md flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Lingkaran hijau */}
            <motion.div
              className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <IoMdAlert className="w-full h-full" />
            </motion.div>

            <p className="text-gray-800 font-semibold mb-6 text-center">
              {text || 'Terjadi kesalahan'}!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
