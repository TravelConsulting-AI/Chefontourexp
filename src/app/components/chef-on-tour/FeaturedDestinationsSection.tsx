import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedDestinationsSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const destinations = [
    { city: 'Buenos Aires', country: 'Argentina', slug: 'buenos-aires' },
    { city: 'Medellín', country: 'Colombia', slug: 'medellin' },
    { city: 'Barcelona', country: 'Spain', slug: 'barcelona' },
    { city: 'Rio de Janeiro', country: 'Brazil', slug: 'rio-de-janeiro' },
    { city: 'Palermo', country: 'Italy', slug: 'palermo' },
    { city: 'Málaga', country: 'Spain', slug: 'malaga' },
    { city: 'Istanbul', country: 'Turkey', slug: 'istanbul' },
    { city: 'Beirut', country: 'Lebanon', slug: 'beirut' },
  ];

  return (
    <section ref={ref} className="relative bg-[#2C3E50] px-4 py-16 sm:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 font-serif text-3xl sm:text-4xl md:text-5xl text-white">
            Featured Destinations
          </h2>
          <p className="font-sans text-lg text-white/70">
            2026 Curated Experiences
          </p>
        </motion.div>

        {/* Destinations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.city}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link
                to={`/experiences/${destination.slug}`}
                className="flex items-center justify-between border-b border-white/20 pb-3 sm:pb-4 transition-all hover:border-[#D4A574] cursor-pointer"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-[#D4A574] flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl lg:text-2xl text-white group-hover:text-[#D4A574] transition-colors">
                      {destination.city}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-white/60">
                      {destination.country}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 font-sans text-xs sm:text-sm uppercase tracking-wider text-[#D4A574] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-0 ml-2 whitespace-nowrap">
                  View Experience
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <Link to="/experiences">
            <button className="border-2 border-white px-6 sm:px-8 py-2.5 sm:py-3 font-sans text-xs sm:text-sm uppercase tracking-wider text-white transition-all hover:bg-white hover:text-[#2C3E50]">
              View All Experiences
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}