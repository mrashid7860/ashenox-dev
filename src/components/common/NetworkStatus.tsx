import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Wifi, WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function NetworkStatus() {
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBackOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!showBackOnline) return;

    const timeout = window.setTimeout(() => {
      setShowBackOnline(false);
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [showBackOnline]);

  const visible = !isOnline || showBackOnline;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key={isOnline ? 'online' : 'offline'}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          role="status"
          aria-live="polite"
          className={`fixed inset-x-0 top-0 z-[2147483647] flex justify-center px-3 pt-3 sm:pt-4 ${isOnline ? 'pointer-events-none' : 'pointer-events-none'}`}
        >
          <div
            className={`flex max-w-[calc(100vw-24px)] items-center gap-2.5 rounded-full border px-4 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:px-5 ${
              isOnline ? 'border-emerald-200/80 bg-emerald-50/95 text-emerald-800' : 'border-neutral-200 bg-neutral-100/95 text-neutral-800'
            }`}
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isOnline ? 'bg-emerald-100' : 'bg-neutral-200'}`}>
              {isOnline ? <Wifi className="h-4 w-4" strokeWidth={1.8} /> : <WifiOff className="h-4 w-4" strokeWidth={1.8} />}
            </span>

            <span className="text-[13px] font-medium leading-tight sm:text-sm">{isOnline ? "You're back online!" : 'Connection lost. Please check your internet.'}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
