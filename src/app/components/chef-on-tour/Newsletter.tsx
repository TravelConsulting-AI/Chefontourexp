import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { Mail, Send } from 'lucide-react';
import { useState } from 'react';

export function Newsletter() {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#1a1a1a] px-4 py-16 sm:py-20 md:py-24 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="rounded-full bg-[#D4A574] p-3 sm:p-4">
              <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>

          <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl font-serif">Join Our Culinary Community</h2>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-gray-400 px-4">
            Subscribe to receive exclusive recipes, travel tips, and early access to new tour announcements
          </p>

          {/* Newsletter Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-2xl"
          >
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-full border-2 border-white/20 bg-white/10 px-5 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-[#D4A574] focus:outline-none"
                />
              </div>
              <motion.button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-full bg-[#D4A574] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base transition-all hover:bg-[#C19563]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <span>Subscribed! ✓</span>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* Privacy Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500"
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 text-left sm:grid-cols-3"
          >
            {[
              {
                title: 'Exclusive Recipes',
                description: 'Chef Webb\'s signature dishes from around the world'
              },
              {
                title: 'Travel Insights',
                description: 'Insider tips for authentic culinary experiences'
              },
              {
                title: 'Early Access',
                description: 'Be first to know about new tour dates and destinations'
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <h3 className="mb-1 sm:mb-2 text-base sm:text-lg text-[#D4A574]">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}