import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedDestinationsSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const destinations = [
    { city: 'Buenos Aires', country: 'Argentina', dates: 'March 10-18, 2026' },
    { city: 'Medellín', country: 'Colombia', dates: 'April 14-20, 2026' },
    { city: 'Barcelona', country: 'Spain', dates: 'May 5-11, 2026' },
    { city: 'Lisbon', country: 'Portugal', dates: 'June 8-14, 2026' },
    { city: 'Marrakech', country: 'Morocco', dates: 'September 20-27, 2026' },
    { city: 'Tokyo', country: 'Japan', dates: 'October 15-23, 2026' },
    { city: 'Lima', country: 'Peru', dates: 'November 5-12, 2026' },
    { city: 'Copenhagen', country: 'Denmark', dates: 'December 1-7, 2026' },
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
              <div className="flex items-start justify-between border-b border-white/20 pb-3 sm:pb-4 transition-all hover:border-[#D4A574]">
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
                <div className="text-right ml-2">
                  <p className="font-mono text-xs sm:text-sm text-white/80">
                    {destination.dates}
                  </p>
                </div>
              </div>
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
          <Link to="/destinations">
            <button className="border-2 border-white px-6 sm:px-8 py-2.5 sm:py-3 font-sans text-xs sm:text-sm uppercase tracking-wider text-white transition-all hover:bg-white hover:text-[#2C3E50]">
              View All Destinations
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}