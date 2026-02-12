import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { X } from 'lucide-react';
import { useState } from 'react';
import cathedralImg from '@/assets/e602318c608bc08bcd0d550ce3382c79e6857c92.png';
import charlesImg from '@/assets/120c8bc71f66cd44c11547a2600225103c354e99.png';
import coastalImg from '@/assets/5d71de66657165e215715f1efd26fefadd28c35e.png';

export function WhySection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section ref={ref} className="relative bg-white px-4 py-16 sm:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Images */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-2 sm:gap-4">
                {/* Left - Cathedral (thinner) */}
                <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
                  <img
                    src={cathedralImg}
                    alt="Cathedral Architecture"
                    className="absolute inset-0 h-full w-full object-cover rounded-lg"
                  />
                </div>
                
                {/* Center - Charles (wider) */}
                <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
                  <img
                    src={charlesImg}
                    alt="Chef Charles Webb"
                    className="absolute inset-0 h-full w-full object-cover rounded-lg"
                  />
                </div>
                
                {/* Right - Coastal (thinner) */}
                <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
                  <img
                    src={coastalImg}
                    alt="Coastal Destination"
                    className="absolute inset-0 h-full w-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative element */}
              <div className="absolute -right-4 top-0 h-full w-1 bg-[#D4A574] opacity-20 hidden lg:block" />
              
              <h2 className="mb-4 sm:mb-6 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-[#1a1a1a]">
                Why
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                  Because the world's greatest stories are told at the table.
                </p>
                
                <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                  Chef Charles Webb believes that authentic travel happens when you move beyond the guidebook—into kitchens, homes, and dining rooms where culture lives and breathes.
                </p>
                
                <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                  Each journey is designed to create meaningful connections through food, wine, and conversation—revealing the soul of a place one meal at a time.
                </p>
                
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 sm:mt-6 border border-[#1a1a1a] px-6 sm:px-8 py-2.5 sm:py-3 font-sans text-xs sm:text-sm uppercase tracking-wider text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-white"
                >
                  Read More
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
            >
              <X className="h-6 w-6 text-[#1a1a1a]" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left - Images */}
              <div className="relative bg-[#F4F1EA] p-6 sm:p-8 lg:p-12">
                <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-3 sm:gap-4">
                  {/* Left - Cathedral (thinner) */}
                  <div className="relative h-[250px] sm:h-[350px] lg:h-[500px]">
                    <img
                      src={cathedralImg}
                      alt="Cathedral Architecture"
                      className="absolute inset-0 h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Center - Charles (wider) */}
                  <div className="relative h-[250px] sm:h-[350px] lg:h-[500px]">
                    <img
                      src={charlesImg}
                      alt="Chef Charles Webb"
                      className="absolute inset-0 h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Right - Coastal (thinner) */}
                  <div className="relative h-[250px] sm:h-[350px] lg:h-[500px]">
                    <img
                      src={coastalImg}
                      alt="Coastal Destination"
                      className="absolute inset-0 h-full w-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                <h2 className="mb-6 sm:mb-8 font-serif text-3xl sm:text-4xl lg:text-5xl italic text-[#1a1a1a]">
                  Why ChefOnTour Exp
                </h2>
                
                <div className="space-y-5 sm:space-y-6">
                  <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                    ChefOnTour Exp is not a tour — it's a passage into the soul of global gastronomy, personally led and curated by Chef Charles Webb. Designed for the seekers, storytellers, and lovers of the extraordinary, it transcends travel to become a living narrative of taste and connection.
                  </p>
                  
                  <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                    From hidden kitchens in coastal Europe to spice markets in South America, Chef Charles invites you to explore the world through taste, touch, and storytelling. You'll cook alongside local artisans, dine under the stars, and discover how food bridges the heart of every culture.
                  </p>
                  
                  <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                    As a guest, you're not just observing — you're participating. You'll cook shoulder-to-shoulder with local artisans, share stories with winemakers at sunset, and dine under open skies where every course tells a story. Each moment is meticulously designed to awaken the senses and remind you that food is the world's most universal language.
                  </p>
                  
                  <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                    This is not a vacation. It's a cultural awakening — a journey where curiosity replaces itinerary and every encounter leaves an imprint.
                  </p>
                  
                  <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700 font-semibold text-[#D4A574]">
                    ChefOnTour Exp is your invitation to experience the art of living fully — one destination, one connection, one unforgettable bite at a time.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}