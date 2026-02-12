import { motion } from 'motion/react';
import { useInView } from '../components/hooks/useInView';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState } from 'react';
import { CustomDateModal } from '../components/chef-on-tour/CustomDateModal';

export function PalermoToursPage() {
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F1EA] overflow-x-hidden">
      <FloatingCustomDateBar 
        tourTitle="Palermo: Beneath the Sunhine"
        onCustomDateClick={() => setIsCustomDateModalOpen(true)}
      />
      <HeroSection />
      <IntroSection />
      <PhilosophySection />
      <InvitationSection onInquireClick={() => setIsCustomDateModalOpen(true)} />

      {/* Custom Date Modal */}
      <CustomDateModal
        isOpen={isCustomDateModalOpen}
        onClose={() => setIsCustomDateModalOpen(false)}
        tourTitle="Palermo: Beneath the Sunhine"
      />
    </div>
  );
}

// SECTION 0: FLOATING CUSTOM DATE BAR
function FloatingCustomDateBar({ 
  tourTitle,
  onCustomDateClick
}: {
  tourTitle: string;
  onCustomDateClick: () => void;
}) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-[89px] sm:top-[105px] md:top-[113px] lg:top-[113px] left-0 right-0 z-40 bg-[#1A1A1A]/95 backdrop-blur-md shadow-lg"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
          {/* Tour Title */}
          <div className="flex-shrink-0 text-center sm:text-left">
            <p className="font-serif text-sm sm:text-lg md:text-xl text-[#F4F1EA]">
              {tourTitle}
            </p>
          </div>

          {/* Custom Dates CTA */}
          <motion.button
            onClick={onCustomDateClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#C89B7B] hover:bg-[#D4A574] text-white font-sans text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-lg"
          >
            Select Dates
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// SECTION 1: HERO
function HeroSection() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section 
      ref={ref} 
      className="relative h-screen w-full overflow-hidden bg-[#1A1A1A] pt-0 md:pt-[200px] lg:pt-[200px]"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 md:top-[200px] lg:top-[200px]">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1696773605964-16f6abbef9de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
          alt="Palermo beneath the sun"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-[#F4F1EA]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <h1 className="mb-4 sm:mb-6 font-serif text-4xl sm:text-5xl md:text-7xl lg:text-9xl leading-tight">
            PALERMO<br />
            BENEATH THE SUNHINE
          </h1>
          <p className="mb-2 text-base sm:text-lg md:text-xl lg:text-2xl font-sans px-2">
            A Chef on Tour Curated Experience with Charles Webb
          </p>
          <p className="mb-6 sm:mb-8 font-mono text-sm sm:text-base tracking-wide text-[#F4F1EA]/80">
            Ancient Markets & Mediterranean Soul · Sicily, Italy
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 sm:mt-12 lg:mt-16 border-t border-[#F4F1EA]/30 pt-6 sm:pt-8"
          >
            <p className="font-serif text-lg sm:text-xl md:text-2xl italic px-4">
              "Where civilizations converge under golden light."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 2: INTRO
function IntroSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <p className="font-sans text-xl leading-relaxed text-[#111111]">
            Palermo doesn't reveal itself in monuments. It reveals itself in morning markets where Arabic spice traders' descendants sell alongside Sicilian grandmothers. In churches layered with Norman arches and Byzantine mosaics. In street food that carries the DNA of three continents.
          </p>
          <p className="font-sans text-xl leading-relaxed text-[#111111]">
            This is the crossroads of the Mediterranean—a city built and rebuilt by Greeks, Romans, Arabs, Normans, and Spaniards. Each left their mark. Each left their flavors. The result is a cuisine and culture that exists nowhere else on earth.
          </p>
          <div className="my-12 border-l-4 border-[#111111] pl-8">
            <p className="font-serif text-2xl italic leading-relaxed text-[#111111]">
              To understand Sicily, you must taste it. To taste Sicily, you must walk Palermo with someone who knows where history hides.
            </p>
          </div>
          <p className="font-sans text-xl leading-relaxed text-[#111111]">
            Charles Webb has spent years cultivating relationships in this city—with fishmongers at Vucciria, pasta makers in Ballarò, and family-run trattorias that don't advertise. He knows which alleys tell which stories. Which tables are reserved for locals. Which conversations unlock doors.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 3: PHILOSOPHY
function PhilosophySection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-white px-4 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div>
            <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-[#111111]/60">
              Why This Journey Exists
            </h2>
            <p className="font-sans text-xl leading-relaxed text-[#111111]">
              This is not a "Palermo trip."
            </p>
            <p className="font-sans text-xl leading-relaxed text-[#111111] mt-4">
              It is a curated immersion—from tourist sight to lived experience.
            </p>
          </div>

          <div className="space-y-6 border-l-4 border-[#C89B7B] pl-8">
            <p className="font-sans text-xl leading-relaxed text-[#111111]">
              Through food, architecture, sound, ritual, and conversation, guests experience how Chef on Tour operates at its highest level:
            </p>
            <div className="space-y-3">
              <p className="font-serif text-2xl italic">relationship-driven</p>
              <p className="font-serif text-2xl italic">culturally literate</p>
              <p className="font-serif text-2xl italic">emotionally intelligent</p>
              <p className="font-serif text-2xl italic">and unafraid of silence</p>
            </div>
          </div>

          <p className="font-sans text-xl leading-relaxed text-[#111111]">
            With Charles Webb opening doors and local cultural guides providing historical depth, this experience doesn't promise transformation.
          </p>
          
          <p className="font-sans text-2xl leading-relaxed text-[#111111] font-medium">
            It simply creates the conditions for it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 4: INVITATION
function InvitationSection({ onInquireClick }: { onInquireClick: () => void }) {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#1A1A1A] px-4 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div>
            <h2 className="mb-6 font-mono text-sm uppercase tracking-widest text-[#F4F1EA]/60">
              Select Departures
            </h2>
            <h3 className="mb-8 font-serif text-4xl md:text-6xl text-[#F4F1EA] leading-tight">
              Let's Break Bread<br />in Palermo
            </h3>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            <p className="font-sans text-xl leading-relaxed text-[#F4F1EA]">
              Charles maintains select dates throughout the year for curated Palermo experiences.
            </p>
            <p className="font-sans text-xl leading-relaxed text-[#F4F1EA]">
              If you have availability and this city calls to you, let's talk. Share your dates. Share your interests. And Charles will craft an experience that honors both the place and your palate.
            </p>
          </div>

          <div className="pt-8 border-t border-[#F4F1EA]/20">
            <p className="mb-8 font-serif text-2xl text-[#C89B7B] italic">
              "I have these dates—Charles, what can you do for me in Palermo?"
            </p>
            <motion.button
              onClick={onInquireClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-[#C89B7B] hover:bg-[#D4A574] text-white font-sans text-sm uppercase tracking-widest transition-all duration-300 shadow-lg"
            >
              Join Us
            </motion.button>
          </div>

          <div className="pt-12 space-y-3">
            <p className="font-mono text-xs text-[#F4F1EA]/40 uppercase tracking-widest">
              Typically 6-7 Days · Limited to 8-12 Guests
            </p>
            <p className="font-mono text-xs text-[#C89B7B] uppercase tracking-widest">
              Pricing & Availability Upon Inquiry
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}