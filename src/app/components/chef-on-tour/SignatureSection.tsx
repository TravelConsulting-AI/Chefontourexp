import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';

export function SignatureSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative bg-white px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-4 sm:mb-6 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-[#1a1a1a]">
              Memorable Experiences
            </h2>
            
            <div className="space-y-4 sm:space-y-6">
              <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                Every Chef on Tour experience is built around authentic connections—with chefs, artisans, and local communities who share their passion through food.
              </p>
              
              <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                From fire-cooked asados in the Argentine Pampas to closed-door dining in Barcelona's hidden kitchens, each moment is designed to reveal the soul of a place.
              </p>
              
              <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                These are not tours. These are transformations.
              </p>
            </div>
          </motion.div>

          {/* Right - YouTube Video */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/DKJ12adGCKk?si=jGNp0Y5BY_f1nc8r"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}