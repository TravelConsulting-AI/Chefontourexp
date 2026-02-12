import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';

export function TestimonialsHeroSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative bg-[#1a1a1a] px-4 py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 sm:mb-8 font-serif text-3xl sm:text-4xl md:text-5xl italic text-white">
            Testimonials
          </h2>
          
          <blockquote className="space-y-4 sm:space-y-6">
            <p className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed text-white/90 italic px-4">
              "Chef Charles Webb doesn't just show you a city—he opens doors to experiences that transform how you understand food, culture, and connection. This was more than a culinary tour; it was a masterclass in living fully."
            </p>
            
            <footer className="pt-4 sm:pt-6">
              <p className="font-sans text-sm sm:text-base text-white/70">
                — Sarah M., Barcelona Experience
              </p>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}