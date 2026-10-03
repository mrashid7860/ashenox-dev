'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X, Loader2, ArrowRight } from 'lucide-react';

import { SplitTextHover } from '@/components/animations/SplitTextHover';
import { ContactStatusPopup } from '@/components/common/ContactStatusPopup';

// ============================================================
// ANIMATION
// ============================================================

const ease = [0.16, 1, 0.3, 1] as const;

// ============================================================
// TYPES
// ============================================================

interface ContactFormPanelProps {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  budget: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  company: '',
  service: '',
  message: '',
  budget: '',
};

// ============================================================
// OPTIONS
// ============================================================

const SERVICE_OPTIONS = ['Web Design', 'Web Development', 'Branding', 'Product Design', 'Other'];

const CONTACT_EMAIL = 'info@ashenox.com';

// ============================================================
// SHARED INPUT STYLING
// ============================================================

const inputClasses = 'w-full rounded-[8px] border border-black/10 bg-white px-4 py-2.5 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-black/30';

// ============================================================
// CONTACT FORM PANEL
// ============================================================

export function ContactFormPanel({ open, onClose }: ContactFormPanelProps) {
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // ============================================================
  // PORTAL MOUNT
  // ============================================================

  useEffect(() => {
    setMounted(true);
  }, []);

  // ============================================================
  // UPDATE FIELD
  // ============================================================

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    // ----------------------------------------------------------
    // Browser validation
    // ----------------------------------------------------------

    const formElement = e.currentTarget;

    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }

    // ----------------------------------------------------------
    // Clean values
    // ----------------------------------------------------------

    const data = {
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      service: form.service.trim(),
      message: form.message.trim(),
      budget: form.budget.trim(),
    };

    // ----------------------------------------------------------
    // Required fields
    // Company, service and budget are required.
    // Message is optional.
    // ----------------------------------------------------------

    if (!data.name || !data.email || !data.company || !data.service || !data.budget) {
      setSubmitStatus('error');
      return;
    }

    // ----------------------------------------------------------
    // Name validation
    // ----------------------------------------------------------

    if (data.name.length < 2) {
      setSubmitStatus('error');
      return;
    }

    // ----------------------------------------------------------
    // Company validation
    // ----------------------------------------------------------

    if (data.company.length < 2) {
      setSubmitStatus('error');
      return;
    }

    // ----------------------------------------------------------
    // Email validation
    // ----------------------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      setSubmitStatus('error');
      return;
    }

    // ----------------------------------------------------------
    // Submit
    // ----------------------------------------------------------

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send inquiry.');
      }

      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      setForm(INITIAL_FORM);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Contact form error:', error);

      // --------------------------------------------------------
      // ERROR
      // --------------------------------------------------------

      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // CONTACT PANEL
  // ============================================================

  const panel = (
    <AnimatePresence>
      {open && (
        <>
          {/* ==================================================
              BACKDROP
          ================================================== */}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} onClick={onClose} className="fixed inset-0 z-[99998]" />

          {/* ==================================================
              PANEL
          ================================================== */}

          <motion.div
            variants={{
              open: {
                clipPath: 'circle(150% at 100% 0%)',
                transition: {
                  duration: 1.2,
                  ease,
                },
              },

              closed: {
                clipPath: 'circle(0% at 100% 0%)',
                transition: {
                  duration: 0.4,
                  ease,
                },
              },
            }}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-0 top-0 z-[99999] flex h-dvh w-full flex-col overflow-y-auto bg-white text-black shadow-[0_10px_40px_rgba(0,0,0,0.12)] sm:w-[420px] md:right-3 md:top-3 md:h-[calc(100dvh-24px)] md:w-[400px] md:rounded-[7px] md:bg-white lg:right-3 lg:top-3 lg:h-[calc(100dvh-24px)] lg:w-[340px] xl:right-2 xl:top-3 xl:h-[calc(100dvh-18px)] xl:w-[400px] 2xl:h-[calc(100dvh-24px)]"
          >
            <div className="relative flex h-full flex-col px-6 py-6 sm:px-8 sm:py-7 md:px-7 md:py-6">
              {/* ==================================================
                  CLOSE
              ================================================== */}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close contact form"
                className="absolute right-5 top-5 flex h-5 w-5 items-center justify-center rounded-full border border-black/10 bg-black/[0.01] text-black/60 transition-colors hover:border-black/20 hover:bg-black/[0.06] hover:text-black md:right-3 md:top-3"
              >
                <X className="h-2.5 w-2.5" />
              </button>

              {/* ==================================================
                  HEADER
              ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.35,
                  duration: 0.5,
                  ease,
                }}
                className="pr-8"
              >
                <h2 className="text-[22px] font-light leading-tight tracking-[-0.02em] sm:text-[28px]">Let&apos;s build something great.</h2>

                <p className="mt-1 w-60 text-[13px] leading-[1] text-black/50">Tell us about your project, we usually reply within one business day.</p>
              </motion.div>

              {/* ==================================================
                  FORM
              ================================================== */}

              <motion.form
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.42,
                  duration: 0.5,
                  ease,
                }}
                onSubmit={handleSubmit}
                className="mt-5 flex flex-1 flex-col gap-3"
              >
                {/* NAME */}

                <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={update('name')} required disabled={isSubmitting} minLength={2} className={inputClasses} />

                {/* EMAIL */}

                <input type="email" name="email" placeholder="Email address" value={form.email} onChange={update('email')} required disabled={isSubmitting} className={inputClasses} />

                {/* COMPANY */}

                <input
                  type="text"
                  name="company"
                  placeholder="Company / Website name"
                  value={form.company}
                  onChange={update('company')}
                  required
                  disabled={isSubmitting}
                  minLength={2}
                  className={inputClasses}
                />

                {/* SERVICE */}

                <div className="relative">
                  <select
                    name="service"
                    value={form.service}
                    onChange={update('service')}
                    required
                    disabled={isSubmitting}
                    className={`${inputClasses} appearance-none ${form.service ? '' : 'text-gray-400'}`}
                  >
                    <option value="" disabled className="text-gray-400">
                      Select a service
                    </option>

                    {SERVICE_OPTIONS.map((service) => (
                      <option key={service} value={service} className="text-black">
                        {service}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                </div>

                {/* MESSAGE */}

                <textarea
                  name="message"
                  placeholder="Share a little about your goals, timeline, and requirements..."
                  value={form.message}
                  onChange={update('message')}
                  disabled={isSubmitting}
                  rows={3}
                  className={`${inputClasses} flex-1 resize-none`}
                />

                {/* BUDGET */}

                <input type="text" name="budget" placeholder="Estimated budget" value={form.budget} onChange={update('budget')} required disabled={isSubmitting} className={inputClasses} />

                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-10 flex w-full items-center justify-center gap-2 rounded-[8px] border border-black/15 bg-black/[0.03] py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Inquiry
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.form>

              {/* ==================================================
                  EMAIL FALLBACK
              ================================================== */}

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.6,
                  duration: 0.5,
                  ease,
                }}
                className="mt-4 text-center text-sm text-black/45"
              >
                Prefer email?{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline underline-offset-2">
                  <SplitTextHover text={CONTACT_EMAIL} />
                </a>
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ============================================================
  // RENDER THROUGH BODY
  // ============================================================

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* CONTACT PANEL PORTAL */}

      {createPortal(panel, document.body)}

      {/* ========================================================
          STATUS POPUP
          Separate portal so it is NOT trapped by the panel's
          clip-path / stacking context.
      ======================================================== */}

      {submitStatus !== 'idle' && createPortal(<ContactStatusPopup status={submitStatus} onClose={() => setSubmitStatus('idle')} />, document.body)}
    </>
  );
}

export default ContactFormPanel;
