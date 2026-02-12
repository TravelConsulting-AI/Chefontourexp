import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function AboutChef() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} id="about" className="bg-[#F8F6F3] px-4 py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 sm:gap-10 md:gap-12 md:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden rounded-lg"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=1000&fit=crop"
              alt="Chef Charles Webb"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="mb-4 sm:mb-6 font-serif text-3xl sm:text-4xl md:text-5xl">Meet Chef Charles Webb</h2>
            <p className="mb-3 sm:mb-4 text-base sm:text-lg leading-relaxed text-gray-700 font-sans">
              With over 25 years of culinary expertise spanning Michelin-starred restaurants 
              and world-renowned establishments, Chef Charles Webb has dedicated his career 
              to exploring and celebrating the intersection of food and culture.
            </p>
            <p className="mb-3 sm:mb-4 text-base sm:text-lg leading-relaxed text-gray-700 font-sans">
              His passion for authentic cuisine and deep respect for culinary traditions have 
              taken him across six continents, where he's forged lasting relationships with 
              local chefs, artisans, and food producers.
            </p>
            <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed text-gray-700 font-sans">
              Now, Chef Webb invites you to join him on these transformative journeys, sharing 
              his insider access and culinary knowledge to create experiences that go far beyond 
              traditional tourism.
            </p>
            <motion.button
              className="rounded-full border-2 border-[#D4A574] bg-transparent px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-[#D4A574] transition-all hover:bg-[#D4A574] hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Read Full Bio
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}