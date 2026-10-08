'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

import formBackgroundVideo from '@/assets/video/form-background-video.mp4';

import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { SplitTextHover } from '@/components/animations/SplitTextHover';
import { ContactStatusPopup } from '@/components/common/ContactStatusPopup';

import { CONTACT_COPY, CONTACT_EMAILS, CONTACT_SERVICES } from '@/data/contact.data';

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/*
 * ============================================================
 * CHARACTER HEADING
 * ============================================================
 */

function CharacterHeading({ children, className = '', as = 'h2' }: { children: string; className?: string; as?: 'h1' | 'h2' }) {
  const Tag = motion[as];

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.25,
      }}
      className={className}
    >
      {createCharacterAnimation(children)}
    </Tag>
  );
}

/*
 * ============================================================
 * SELECT FIELD
 * ============================================================
 */

function ContactSelect({
  name,
  value,
  onChange,
  placeholder,
  options,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <select
      name={name}
      value={value}
      required
      onChange={(event) => onChange(event.target.value)}
      className="h-[52px] w-full appearance-none rounded border border-white/[0.18] bg-transparent px-4 text-[13px] text-white/50 outline-none focus:border-white/40 md:h-[40px] md:text-[14px]"
    >
      <option value="" disabled className="bg-[#111214]">
        {placeholder}
      </option>

      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-[#111214] text-white">
          {option.label}
        </option>
      ))}
    </select>
  );
}

/*
 * ============================================================
 * CONTACT INPUT
 * ============================================================
 */

function ContactInput({ type, name, placeholder, required = false }: { type: 'text' | 'email'; name: string; placeholder: string; required?: boolean }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className="h-[52px] w-full rounded border border-white/[0.18] bg-transparent px-4 text-[13px] text-white outline-none placeholder:text-white/50 focus:border-white/40 md:h-[40px] md:text-[14px]"
    />
  );
}

/*
 * ============================================================
 * CONTACT FORM
 * ============================================================
 */

export function ContactForm() {
  const [service, setService] = useState('');
  const [budget, setBudget] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState('');

  /*
   * ============================================================
   * FORM SUBMIT
   * ============================================================
   */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setValidationError('');
    setSubmitStatus('idle');

    const form = event.currentTarget;
    const formData = new FormData(form);

    // ============================================================
    // CLEAN VALUES
    // ============================================================

    const data = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      company: String(formData.get('company') || '').trim(),
      service: service.trim(),
      budget: budget.trim(),
      message: String(formData.get('message') || '').trim(),
    };

    // ============================================================
    // REQUIRED FIELDS
    // ============================================================

    if (!data.name || !data.email || !data.company || !data.service || !data.budget) {
      setValidationError('Please fill in all required fields.');
      setSubmitStatus('error');
      return;
    }

    // ============================================================
    // NAME VALIDATION
    // ============================================================

    if (data.name.length < 2) {
      setValidationError('Name must be at least 2 characters.');
      setSubmitStatus('error');
      return;
    }

    // ============================================================
    // COMPANY VALIDATION
    // ============================================================

    if (data.company.length < 2) {
      setValidationError('Company name must be at least 2 characters.');
      setSubmitStatus('error');
      return;
    }

    // ============================================================
    // EMAIL VALIDATION
    // ============================================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      setValidationError('Email address is not correct.');
      setSubmitStatus('error');
      return;
    }

    // ============================================================
    // SUBMIT
    // ============================================================

    setIsSubmitting(true);

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
        throw new Error(result.message || 'Failed to send your inquiry. Please try again.');
      }

      // ============================================================
      // SUCCESS
      // ============================================================

      form.reset();

      setService('');
      setBudget('');
      setSubmitStatus('success');
    } catch (error) {
      console.error('Contact form error:', error);

      setValidationError(error instanceof Error ? error.message : 'Failed to send your inquiry. Please try again.');

      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="relative overflow-hidden px-4 py-20 text-white md:px-10 md:py-28">
      <div className="relative z-10 mx-auto max-w-[1050px]">
        {/* ==================================================
            EYEBROW
        ================================================== */}

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="text-center text-[12px] font-medium uppercase leading-[1.15] tracking-[-0.02em] text-white/80 md:text-[13px]"
        >
          {createCharacterAnimation(CONTACT_COPY.formEyebrow[0])}

          <br />

          {createCharacterAnimation(CONTACT_COPY.formEyebrow[1])}
        </motion.p>

        {/* ==================================================
            TITLE
        ================================================== */}

        <CharacterHeading className="mt-5 text-center text-[clamp(2.5rem,4vw,4rem)] font-normal leading-[0.86] tracking-[-0.05em] text-white/90 md:text-[clamp(3.3rem,4.5vw,6rem)]">
          {CONTACT_COPY.formTitle}
        </CharacterHeading>

        {/* ==================================================
            SUBTITLE
        ================================================== */}

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            delay: 0.08,
          }}
          className="mx-auto mt-5 max-w-[330px] text-center text-[14px] leading-[1.1] tracking-[-0.04em] text-white/65 md:text-[15px]"
        >
          {CONTACT_COPY.formDescription[0]}

          <br />

          {CONTACT_COPY.formDescription[1]}
        </motion.p>

        {/* ==================================================
            FORM
        ================================================== */}

        <motion.form
          noValidate
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 1,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto mt-16 w-full max-w-[820px] md:mt-20"
          onSubmit={handleSubmit}
        >
          {/* ==================================================
              ROW 1
          ================================================== */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ContactInput type="text" name="name" placeholder="Full Name" required />

            <ContactInput type="email" name="email" placeholder="Email address" required />
          </div>

          {/* ==================================================
              ROW 2
          ================================================== */}

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <ContactInput type="text" name="company" placeholder="Company / Website name" required />

            <ContactSelect name="service" value={service} onChange={setService} placeholder="Select a service" options={CONTACT_SERVICES} />
          </div>

          {/* ==================================================
              MESSAGE
              OPTIONAL
          ================================================== */}

          <textarea
            name="message"
            placeholder="Share a little about your goals, timeline, and requirements..."
            rows={4}
            className="mt-5 min-h-[120px] w-full resize-none rounded border border-white/[0.18] bg-transparent px-4 py-1 text-[13px] text-white outline-none placeholder:text-white/50 focus:border-white/40 md:min-h-[80px] md:text-[14px]"
          />

          {/* ==================================================
              BUDGET + SEND
          ================================================== */}

          <div className="mt-4 grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_180px] md:gap-20">
            {/* BUDGET */}

            <input
              type="text"
              name="budget"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="Estimated budget e.g. ₹50,000 - ₹1,00,000"
              required
              className="h-[52px] w-full rounded border border-white/[0.18] bg-transparent px-4 text-[13px] text-white outline-none placeholder:text-white/50 focus:border-white/40 md:h-[40px] md:text-[14px]"
            />

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex h-[38px] w-full items-center justify-between rounded border border-black/60 bg-white px-4 text-left text-[12px] uppercase tracking-[-0.01em] text-black/80 transition-all duration-300 hover:border-white/40 hover:bg-transparent hover:text-white/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Send Inquiry'}</span>

              {isSubmitting ? (
                <Loader2 size={14} strokeWidth={1.5} className="shrink-0 animate-spin" />
              ) : (
                <ArrowRight size={14} strokeWidth={1.4} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>
          </div>
        </motion.form>

        {/* ==================================================
            EMAIL
        ================================================== */}

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="mt-16 text-center text-[14px] text-white/55 md:mt-16"
        >
          Prefer email?{' '}
          <a href={`mailto:${CONTACT_EMAILS.general}`} className="tracking-[-0.07em] text-white/75">
            <SplitTextHover text={CONTACT_EMAILS.general} />
          </a>
        </motion.p>
      </div>

      {/* ==================================================
          STATUS POPUP
      ================================================== */}

      {submitStatus !== 'idle' && (
        <ContactStatusPopup
          status={submitStatus}
          message={validationError}
          onClose={() => {
            setSubmitStatus('idle');
            setValidationError('');
          }}
        />
      )}
    </section>
  );
}
