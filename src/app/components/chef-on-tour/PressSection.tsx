import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';

export function PressSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const pressLogos = [
    { name: 'Semana', alt: 'Semana Magazine' },
    { name: 'FELIA', alt: 'Felia Publication' },
    { name: 'EL MUNDO', alt: 'El Mundo' },
    { name: 'Quien', alt: 'Quien Magazine' },
  ];

  return (
    <section ref={ref} className="bg-white px-4 py-10 sm:py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8"
        >
          <p className="font-sans text-xs sm:text-sm uppercase tracking-widest text-gray-500">
            As Featured In
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center">
          {pressLogos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#1a1a1a] opacity-60 hover:opacity-100 transition-opacity">
                {logo.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}