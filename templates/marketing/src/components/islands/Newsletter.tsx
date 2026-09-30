import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface NewsletterProps {
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;
}

export default function Newsletter({
  title = 'Join the Frontier',
  description = 'Get the latest updates on space-age engineering and interstellar design directly in your inbox.',
  buttonText = 'Subscribe',
  placeholder = 'enter your email...',
}: NewsletterProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Spam protection

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    // If honeypot is filled, it's a bot
    if (honeypot) {
      console.log('Bot detected');
      return;
    }

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      if (email.includes('error')) {
        setStatus('error');
      } else {
        setStatus('success');
        setEmail('');
      }
    }, 1500);
  };

  return (
    <div className="group relative">
      {/* Background Glow */}
      <div className="from-primary/50 absolute -inset-0.5 rounded-2xl bg-linear-to-r to-blue-500/50 opacity-20 blur-xl transition duration-1000 group-hover:opacity-40 group-hover:duration-200" />

      <div className="bg-background border-foreground/10 relative overflow-hidden rounded-2xl border p-8 shadow-2xl md:p-12">
        {/* Decorative elements */}
        <div className="bg-primary/5 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center space-y-4 py-4 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold">Welcome Aboard!</h3>
              <p className="text-muted-foreground max-w-sm">
                You've successfully subscribed to our newsletter. Prepare for departure!
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-primary text-sm font-medium hover:underline"
              >
                Subscribe another email
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <h2
                    id="newsletter-island-title"
                    className="font-display mb-4 text-3xl font-bold"
                  >
                    {title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{description}</p>
                </div>

                <div className="relative">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Honeypot field (hidden from users) */}
                    <input
                      type="text"
                      name="b_name"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />

                    <div className="relative">
                      <label
                        htmlFor="newsletter-email-island"
                        className="sr-only"
                      >
                        {placeholder}
                      </label>
                      <input
                        required
                        id="newsletter-email-island"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={placeholder}
                        aria-label={placeholder}
                        aria-labelledby="newsletter-island-title"
                        className="bg-foreground/5 border-foreground/10 focus:ring-primary/50 placeholder:text-foreground/30 w-full rounded-xl border px-4 py-4 pr-12 transition-all focus:ring-2 focus:outline-none"
                      />
                      <Send className="text-foreground/20 absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2" />
                    </div>

                    <button
                      disabled={status === 'loading'}
                      type="submit"
                      className="group/btn bg-primary shadow-primary/20 hover:shadow-primary/40 relative w-full overflow-hidden rounded-xl py-4 font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {status === 'loading' ? (
                          <>
                            <Loader2
                              className="animate-spin"
                              size={20}
                            />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>{buttonText}</span>
                            <Send
                              size={18}
                              className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                            />
                          </>
                        )}
                      </div>
                      <div className="group-hover/btn:animate-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
                    </button>
                  </form>

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-8 left-0 flex items-center gap-1 text-xs text-red-500"
                      >
                        <AlertCircle size={12} />
                        Something went wrong. Please try again.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
