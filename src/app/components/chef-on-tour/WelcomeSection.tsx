import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';

export function WelcomeSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-white px-4 py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 sm:mb-6 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Savor the World
          </h2>
          <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed text-gray-700 font-sans px-2">
            Welcome to Chef On Tour, where culinary passion meets wanderlust. Join renowned 
            Chef Charles Webb on exclusive gastronomic journeys to the world's most fascinating 
            destinations. Each tour is meticulously crafted to immerse you in authentic flavors, 
            local traditions, and unforgettable dining experiences.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 font-sans px-2">
            From intimate cooking classes with local masters to exclusive restaurant reservations 
            and market tours, we bring you closer to the heart of each culture through its cuisine.
          </p>
        </motion.div>
      </div>
    </section>
  );
}