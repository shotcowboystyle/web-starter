import { Check, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  message: string;
}

type Errors = Record<string, string | undefined>;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<FormData>({
    email: '',
    message: '',
    name: '',
  });

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setStatus('submitting');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus('success');
    setFormData({ email: '', message: '', name: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Message Sent!</h3>
            <p className="text-muted-foreground">We'll get back to you as soon as possible.</p>
            <button
              onClick={() => setStatus('idle')}
              className="text-primary mt-6 text-sm hover:underline dark:text-white"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            <div>
              <label
                htmlFor="name"
                className="text-muted-foreground mb-2 block text-sm font-medium"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`placeholder:text-muted-foreground text-foreground w-full rounded-xl border bg-white px-4 py-3 transition-all outline-none dark:bg-white/10 dark:text-white dark:placeholder:text-white/20 ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'focus:border-primary focus:ring-primary border-black/10 focus:ring-1 dark:border-white/10'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 flex items-center gap-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-muted-foreground mb-2 block text-sm font-medium"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`placeholder:text-muted-foreground w-full rounded-xl border bg-white px-4 py-3 transition-all outline-none dark:bg-white/5 dark:placeholder:text-white/20 ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'focus:border-primary focus:ring-primary border-black/10 focus:ring-1 dark:border-white/10'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="mt-1 flex items-center gap-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-muted-foreground mb-2 block text-sm font-medium"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className={`placeholder:text-muted-foreground text-foreground w-full resize-none rounded-xl border bg-white px-4 py-3 transition-all outline-none dark:bg-white/10 dark:text-white dark:placeholder:text-white/20 ${
                  errors.message
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'focus:border-primary focus:ring-primary border-black/10 focus:ring-1 dark:border-white/10'
                }`}
                placeholder="How can we help you?"
              />
              {errors.message && <p className="mt-1 flex items-center gap-1 text-xs text-red-500">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
