'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ContactStatusPopupProps {
  status: 'success' | 'error';
  message?: string;
  onClose: () => void;
}

export function ContactStatusPopup({ status, message, onClose }: ContactStatusPopupProps) {
  const isSuccess = status === 'success';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-[420px] rounded-2xl bg-[#f5f5f3] p-7 text-center text-[#111] shadow-2xl md:p-9"
      >
        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/60 transition-colors hover:bg-black hover:text-white"
        >
          <X size={15} strokeWidth={1.5} />
        </button>

        {/* ICON */}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.1,
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${isSuccess ? 'bg-black text-white' : 'bg-red-100 text-red-600'}`}
        >
          {isSuccess ? <span className="text-[20px]">✓</span> : <X size={20} strokeWidth={1.5} />}
        </motion.div>

        {/* TITLE */}

        <h3 className="mt-7 text-[28px] font-normal leading-[0.95] tracking-[-0.055em]">{isSuccess ? 'Inquiry sent.' : 'Something went wrong.'}</h3>

        {/* DESCRIPTION */}

        <p className="mx-auto mt-4 max-w-[330px] text-[14px] leading-[1.4] tracking-[-0.02em] text-black/55">
          {isSuccess
            ? "Thanks for reaching out to Ashenox. We've received your inquiry and will get back to you as soon as possible."
            : message || 'We could not send your inquiry. Please check your details and try again.'}
        </p>

        {/* BUTTON */}

        <button
          type="button"
          onClick={onClose}
          className="mt-7 flex h-[42px] w-full items-center justify-center rounded bg-black text-[12px] uppercase tracking-[-0.01em] text-white transition-opacity hover:opacity-80"
        >
          {isSuccess ? 'Done' : 'Try Again'}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default ContactStatusPopup;
