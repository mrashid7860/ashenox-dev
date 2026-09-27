'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { SplitTextHover } from '@/components/animations/SplitTextHover';
import { AnimatedButton } from '@/components/animations/AnimatedButton';

// Animation

const ease = [0.16, 1, 0.3, 1] as const;

// Types

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

const SERVICE_OPTIONS = ['Web Design', 'Web Development', 'Branding', 'Product Design', 'Other'];

const BUDGET_OPTIONS = ['< $5k', '$5k – $15k', '$15k – $30k', '$30k+'];

const CONTACT_EMAIL = 'info@ashenox.com';

// Shared input styling — explicit white bg matching the panel, soft gray placeholder

const inputClasses = 'w-full rounded-[8px] border border-black/10 bg-white px-4 py-2.5 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-black/30';

// CONTACT FORM PANEL

export function ContactFormPanel({ open, onClose }: ContactFormPanelProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // wire this up to your submission endpoint
    console.log('Contact form submit', form);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ==================================================
              BACKDROP
              z-[105] — above the header (z-[100]) so the header
              is dimmed along with the rest of the page
          ================================================== */}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} onClick={onClose} className="fixed inset-0 z-[105]" />

          {/* ==================================================
              PANEL — same corner clip-path reveal as MenuPanel
              z-[110] — above both the header and the backdrop
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
            className="fixed right-0 top-0 z-[110] flex h-dvh w-full flex-col overflow-y-auto bg-white text-black shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:w-[420px] md:right-3 md:top-3 md:h-[calc(100dvh-24px)] md:w-[400px] md:rounded-[7px] md:bg-white lg:right-3 lg:top-3 lg:h-[calc(100dvh-24px)] lg:w-[340px] xl:right-2 xl:top-3 xl:h-[calc(100dvh-18px)] xl:w-[400px] 2xl:h-[calc(100dvh-24px)]"
          >
            <div className="relative flex h-full flex-col px-6 py-6 sm:px-8 sm:py-7 md:px-7 md:py-6">
              {/* ==================================================
                  CLOSE — X sits inside a circular button
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

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5, ease }} className="pr-8">
                <h2 className="text-[22px] font-light leading-tight tracking-[-0.02em] sm:text-[28px]">Let&apos;s build something great.</h2>

                <p className="mt-1 w-60 text-[13px] leading-[1] text-black/50">Tell us about your project, we usually reply within one business day.</p>
              </motion.div>

              {/* ==================================================
                  FORM
              ================================================== */}

              <motion.form
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.5, ease }}
                onSubmit={handleSubmit}
                className="mt-5 flex flex-1 flex-col gap-3"
              >
                <input type="text" placeholder="Full Name" value={form.name} onChange={update('name')} required className={inputClasses} />

                <input type="email" placeholder="Email address" value={form.email} onChange={update('email')} required className={inputClasses} />

                <input type="text" placeholder="Company / Website name" value={form.company} onChange={update('company')} className={inputClasses} />

                {/* SERVICE DROPDOWN */}

                <div className="relative">
                  <select value={form.service} onChange={update('service')} required className={`${inputClasses} appearance-none ${form.service ? '' : 'text-gray-400'}`}>
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

                <textarea
                  placeholder="Share a little about your goals, timeline, and requirements..."
                  value={form.message}
                  onChange={update('message')}
                  rows={3}
                  className={`${inputClasses} flex-1 resize-none`}
                />

                {/* BUDGET DROPDOWN */}

                <div className="relative">
                  <select value={form.budget} onChange={update('budget')} className={`${inputClasses} appearance-none ${form.budget ? '' : 'text-gray-400'}`}>
                    <option value="" disabled className="text-gray-400">
                      Select your estimated budget
                    </option>

                    {BUDGET_OPTIONS.map((budget) => (
                      <option key={budget} value={budget} className="text-black">
                        {budget}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                </div>

                {/* SUBMIT */}

                {/* <button
                  type="submit"
                  className="mt-10 flex w-full items-center justify-center gap-2 rounded-[8px] border border-black/15 bg-black/[0.03] py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/[0.06]"
                >
                  <span>Send Inquiry</span>

                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button> */}

                <AnimatedButton
                  variant="animated"
                  textColor="#4A4A4A"
                  hoverTextColor="#000"
                  borderColor="#4A4A4A"
                  hoverBorderColor="#000"
                  iconColor="#4A4A4A"
                  icon="up-right"
                  hoverIconColor="#000"
                  charShift={120}
                  charStagger={0.045}
                  charDuration={0.95}
                  widthClassName="w-[210px]"
                  className="mx-auto mb-10 mt-6 flex items-center gap-2 text-[14px] uppercase tracking-[0.08em]"
                >
                  Send Inquiry
                </AnimatedButton>
              </motion.form>

              {/* ==================================================
                  EMAIL FALLBACK
              ================================================== */}

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5, ease }} className="mt-4 text-center text-sm text-black/45">
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
}

export default ContactFormPanel;
