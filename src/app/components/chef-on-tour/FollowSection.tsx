import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { Instagram, ExternalLink } from 'lucide-react';

export function FollowSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative bg-[#F4F1EA] px-4 py-16 sm:py-24 overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #1a1a1a 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="mb-3 sm:mb-4 font-serif text-3xl sm:text-4xl md:text-5xl italic text-[#1a1a1a]">
            Follow the Journey
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#1a1a1a]/60 max-w-lg mx-auto">
            Behind-the-scenes stories, culinary discoveries, and moments from around the world.
          </p>
        </motion.div>

        {/* Instagram Card */}
        <motion.a
          href="https://instagram.com/chefcharleswebb"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="group block mx-auto max-w-2xl"
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-[2px]">
            <div className="rounded-2xl bg-white px-6 sm:px-10 py-8 sm:py-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* IG Icon */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Instagram className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center sm:text-left flex-1">
                <p className="font-sans text-xs sm:text-sm uppercase tracking-widest text-[#1a1a1a]/40 mb-1">
                  Instagram
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1a1a1a] mb-2">
                  @chefcharleswebb
                </h3>
                <p className="font-sans text-sm text-[#1a1a1a]/60 mb-4 max-w-sm">
                  Follow Chef Charles Webb for daily stories from kitchens, markets, and streets around the globe.
                </p>
                <span className="inline-flex items-center gap-2 font-sans text-xs sm:text-sm uppercase tracking-wider text-[#D4A574] group-hover:text-[#c08a5e] transition-colors">
                  Follow on Instagram
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </div>
        </motion.a>

        {/* Decorative quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 sm:mt-14 text-center"
        >
          <blockquote className="font-serif text-lg sm:text-xl italic text-[#1a1a1a]/50 max-w-xl mx-auto">
            "Every dish tells a story. Every city has a soul. Come find both."
          </blockquote>
          <p className="font-sans text-xs text-[#1a1a1a]/30 mt-3 uppercase tracking-wider">
            — Chef Charles Webb
          </p>
        </motion.div>
      </div>
    </section>
  );
}