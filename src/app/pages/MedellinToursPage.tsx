import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { useInView } from '../components/hooks/useInView';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import robImage from '@/assets/e202d180b56c1ce21abf8b8e98f46b8bd5d7fce4.png';
import charlesImage from '@/assets/c8308d698e3100590c205f625ef741d539cd39a4.png';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ReserveDateModal } from '../components/chef-on-tour/ReserveDateModal';
import { CustomDateModal } from '../components/chef-on-tour/CustomDateModal';
import { BookingModal } from '../components/chef-on-tour/BookingModal';

export function MedellinToursPage() {
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get('date');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Medellín departure dates
  const departureDates = ['2026-03-05', '2026-07-10', '2026-11-15'];
  const tourName = 'Medellín: Beneath the Valley';

  // Calculate end date (9 days / 8 nights)
  const getEndDate = (startDate: string) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 8);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] overflow-x-hidden">
      <FloatingDateBar 
        selectedDate={selectedDate}
        departureDates={departureDates}
        tourName={tourName}
        onReserveClick={() => setIsReserveModalOpen(true)}
        onCustomDateClick={() => setIsCustomDateModalOpen(true)}
      />
      <HeroSection />
      <IntroSection />
      <HostsSection />
      <DepartureDatesSection />
      <DetailedItinerary />
      <ManifestoFooter 
        selectedDate={selectedDate}
        onInquireClick={() => {
          if (selectedDate) {
            setIsReserveModalOpen(true);
          } else {
            setIsCustomDateModalOpen(true);
          }
        }} 
      />

      {/* Modals */}
      {selectedDate && (
        <ReserveDateModal
          isOpen={isReserveModalOpen}
          onClose={() => setIsReserveModalOpen(false)}
          tourTitle={tourName}
          startDate={selectedDate}
          endDate={getEndDate(selectedDate)}
        />
      )}
      <CustomDateModal
        isOpen={isCustomDateModalOpen}
        onClose={() => setIsCustomDateModalOpen(false)}
        tourTitle={tourName}
      />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}

// SECTION 0: FLOATING DATE BAR
function FloatingDateBar({ 
  selectedDate,
  departureDates,
  tourName,
  onReserveClick,
  onCustomDateClick
}: {
  selectedDate: string | null;
  departureDates: string[];
  tourName: string;
  onReserveClick: () => void;
  onCustomDateClick: () => void;
}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleDateClick = (date: string) => {
    // If clicking the already selected date, deselect it
    if (date === selectedDate) {
      navigate('/medellin-tours');
    } else {
      // Otherwise, select the new date
      navigate(`/medellin-tours?date=${date}`);
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-[89px] sm:top-[105px] md:top-[113px] lg:top-[113px] left-0 right-0 z-40 bg-[#1A1A1A]/95 backdrop-blur-md shadow-lg"
    >
      {/* Mobile: Tour name above on smaller screens */}
      <div className="sm:hidden px-2 pt-2 pb-1">
        <p className="font-serif text-xs text-center text-[#F4F1EA] truncate">
          {tourName}
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
          {/* Desktop: Tour Name */}
          <div className="hidden sm:block flex-shrink-0">
            <p className="font-serif text-lg sm:text-xl text-[#F4F1EA]">
              {tourName}
            </p>
          </div>

          {/* Mobile + Desktop: Date Options + Reserve in one row */}
          <div className="flex items-stretch gap-1.5 sm:gap-3 w-full sm:w-auto">
            {/* Date buttons */}
            <div className="flex items-stretch gap-1.5 sm:gap-3 flex-1 sm:flex-initial">
              {departureDates.map((date) => {
                const dateObj = new Date(date);
                const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
                const year = dateObj.toLocaleDateString('en-US', { year: '2-digit' });
                const fullYear = dateObj.toLocaleDateString('en-US', { year: 'numeric' });
                const isSelected = date === selectedDate;

                return (
                  <motion.button
                    key={date}
                    onClick={() => handleDateClick(date)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex-1 sm:flex-initial px-2 sm:px-4 py-2 border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-[#C89B7B] bg-transparent text-[#C89B7B] shadow-[0_0_15px_rgba(200,155,123,0.5)]'
                        : 'border-[#F4F1EA]/30 bg-transparent text-[#F4F1EA] hover:border-[#C89B7B] hover:bg-[#C89B7B]/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:gap-2">
                      <div className="text-center">
                        {/* Mobile format: FEB 14 '26 */}
                        <p className={`sm:hidden font-mono text-[10px] uppercase tracking-wider ${
                          isSelected ? 'font-bold' : ''
                        }`}>
                          {month} {day} '{year}
                        </p>
                        {/* Desktop format: Feb 14 + 2026 */}
                        <p className={`hidden sm:block font-mono text-xs uppercase tracking-wider ${
                          isSelected ? 'font-bold' : ''
                        }`}>
                          {month} {day}
                        </p>
                        <p className={`hidden sm:block font-mono text-[10px] ${
                          isSelected ? 'opacity-90' : 'opacity-60'
                        }`}>
                          {fullYear}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="hidden sm:flex items-center justify-center"
                        >
                          <span className="text-xs">✓</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Reserve CTA */}
            <motion.button
              onClick={selectedDate ? onReserveClick : onCustomDateClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-3 sm:px-6 py-2 bg-[#C89B7B] hover:bg-[#D4A574] text-white font-sans text-[10px] sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-lg"
            >
              {selectedDate ? 'Reserve' : (
                <span className="flex flex-col items-center leading-tight">
                  <span>Custom</span>
                  <span>Dates</span>
                </span>
              )}
            </motion.button>
          </div>
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
          src="https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGNvbG9tYmlhJTIwY2l0eXxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Medellín beneath the valley"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-[#F4F1EA]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <h1 className="mb-4 sm:mb-6 font-serif text-4xl sm:text-5xl md:text-7xl lg:text-9xl leading-tight">
            MEDELLÍN<br />
            BENEATH THE VALLEY
          </h1>
          <p className="mb-2 text-base sm:text-lg md:text-xl lg:text-2xl font-sans px-2">
            A Chef on Tour Immersion with Charles Webb & Rob Pevitts
          </p>
          <p className="mb-6 sm:mb-8 font-mono text-sm sm:text-base tracking-wide text-[#F4F1EA]/80">
            6 Days / 5 Nights · Medellín + Cartagena
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 sm:mt-12 lg:mt-16 border-t border-[#F4F1EA]/30 pt-6 sm:pt-8"
          >
            <p className="font-serif text-lg sm:text-xl md:text-2xl italic px-4">
              "How close are you willing to get?"
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 2: INTRO & PHILOSOPHY
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
            This journey is designed for travelers who believe the real story of a place begins once the guidebook fails.
          </p>
          <p className="font-sans text-xl leading-relaxed text-[#111111]">
            Led by <strong>Chef Charles Webb</strong>, whose instinct for people and places opens kitchens most never see, and <strong>Rob Pevitts</strong>, a longtime cultural guide with deep roots in Medellín, this experience moves through Colombia not as a checklist—but as a living system of food, sound, art, and consequence.
          </p>
          <div className="my-12 border-l-4 border-[#111111] pl-8">
            <p className="font-serif text-2xl italic leading-relaxed text-[#111111]">
              Rob's role mirrors Gonzalo's in Barcelona—not as a narrator, but as a translator of context. He knows Medellín not as a destination, but as a place shaped by decisions, compromises, and persistence.
            </p>
          </div>
          <p className="font-sans text-xl leading-relaxed text-[#111111]">
            Over six days, guests move through the valley city and out to the coast, weaving together cuisine, creativity, and moments of reckoning—designed not to impress, but to <em>hold attention</em>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 3: THE HOSTS
function HostsSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          {/* Chef Charles Webb */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <ImageWithFallback
                src={charlesImage}
                alt="Chef Charles Webb"
                className="h-full w-full object-cover grayscale"
              />
            </div>
            <div>
              <h3 className="mb-4 font-serif text-4xl">
                The Instigator:<br />
                Chef Charles Webb
              </h3>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                He doesn't open doors; he kicks them down. Instinct for people and places.
              </p>
            </div>
          </motion.div>

          {/* Rob Pevitts */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <ImageWithFallback
                src={robImage}
                alt="Rob Pevitts"
                className="h-full w-full object-cover grayscale"
              />
            </div>
            <div>
              <h3 className="mb-4 font-serif text-4xl">
                The Cultural Translator:<br />
                Rob Pevitts
              </h3>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Cultural guide with deep roots in Medellín. He translates context, not destinations.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// SECTION 4: DEPARTURE DATES
function DepartureDatesSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDate = searchParams.get('date');

  // Medellín departure dates (same as FloatingDateBar)
  const departureDates = ['2026-03-05', '2026-07-10', '2026-11-15'];

  const handleDateClick = (date: string) => {
    // If clicking the already selected date, deselect it
    if (date === selectedDate) {
      navigate('/medellin-tours');
    } else {
      // Otherwise, select the new date
      navigate(`/medellin-tours?date=${date}`);
    }
  };

  return (
    <section ref={ref} className="bg-[#111111] px-4 py-12 md:py-24" id="departure-dates">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="text-center">
            <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-[#F4F1EA]/60">
              Upcoming Departures
            </h2>
            <p className="font-serif text-3xl text-[#F4F1EA] italic">
              Choose Your Journey
            </p>
          </div>

          {/* Mobile: Single Row Minimal Layout */}
          <div className="md:hidden grid grid-cols-3 gap-3">
            {departureDates.map((date, index) => {
              const dateObj = new Date(date);
              const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
              const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
              const year = dateObj.toLocaleDateString('en-US', { year: '2-digit' });
              const isSelected = date === selectedDate;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative bg-[#1A1A1A] cursor-pointer transition-all duration-300 text-center overflow-hidden border-2 py-4 px-2 ${
                    isSelected 
                      ? 'border-[#C89B7B] shadow-[0_0_15px_rgba(200,155,123,0.5)]' 
                      : 'border-transparent hover:border-[#C89B7B]/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${
                      isSelected ? 'text-[#C89B7B]' : 'text-[#F4F1EA]'
                    }`}>
                      {month}
                    </span>
                    <span className={`font-serif text-2xl ${
                      isSelected ? 'text-[#C89B7B]' : 'text-[#F4F1EA]'
                    }`}>
                      {day}
                    </span>
                    <span className={`font-mono text-[10px] ${
                      isSelected ? 'text-[#C89B7B]/80' : 'text-[#F4F1EA]/60'
                    }`}>
                      '{year}
                    </span>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-1"
                      >
                        <span className="text-[#C89B7B] text-xs">✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Desktop: Three Column Layout */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {departureDates.map((date, index) => {
              const dateObj = new Date(date);
              const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
              const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
              const year = dateObj.toLocaleDateString('en-US', { year: 'numeric' });
              const isSelected = date === selectedDate;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-[#1A1A1A] cursor-pointer transition-all duration-300 text-left overflow-hidden"
                >
                  {/* Selected indicator badge */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-[#C89B7B] text-white rounded-full w-8 h-8 flex items-center justify-center font-mono text-xs z-10"
                    >
                      ✓
                    </motion.div>
                  )}

                  {/* Content Container */}
                  <div className="p-8 pb-6">
                    {/* Month */}
                    <div className="mb-8">
                      <p className="font-mono text-xs uppercase tracking-widest text-[#F4F1EA]/60">
                        {month}
                      </p>
                    </div>

                    {/* Day - Large Number */}
                    <div className="mb-8">
                      <p className={`font-serif text-8xl transition-colors duration-300 ${
                        isSelected ? 'text-[#C89B7B]' : 'text-[#F4F1EA] group-hover:text-[#C89B7B]'
                      }`}>
                        {day}
                      </p>
                    </div>

                    {/* Year */}
                    <div>
                      <p className="font-mono text-sm text-[#F4F1EA]/60">
                        {year}
                      </p>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className={`h-1 transition-all duration-300 ${
                    isSelected 
                      ? 'bg-[#C89B7B] shadow-[0_0_15px_rgba(200,155,123,0.6)]' 
                      : 'bg-[#C89B7B]/50 group-hover:bg-[#C89B7B] group-hover:shadow-[0_0_15px_rgba(200,155,123,0.4)]'
                  }`} />
                </motion.button>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="text-center pt-8 border-t border-[#F4F1EA]/10">
            <p className="font-sans text-sm text-[#F4F1EA]/60 mb-4">
              6 Days / 5 Nights • Medellín + Cartagena • Limited to 12 Guests
            </p>
            <p className="font-mono text-xs text-[#C89B7B] uppercase tracking-widest">
              Price available upon inquiry
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 6: DETAILED ITINERARY
function DetailedItinerary() {
  return (
    <div className="bg-[#F4F1EA] pt-20 sm:pt-24">
      <Day1 />
      <Day2 />
      <Day3 />
      <TransitionSection />
      <Day4 />
      <Day5 />
      <Day6 />
    </div>
  );
}

function Day1() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-[#111111]/60">
            Day 1
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            ARRIVAL & THE FIRST THREAD
          </h3>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Medellín: Arrival into the Valley City</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Guests arrive in Medellín and settle into their hotel—chosen for location and ease of movement rather than spectacle. Time is left open to walk, to feel elevation and heat, to notice how neighborhoods reveal themselves without invitation.
              </p>
              <p className="font-serif text-xl italic">
                This city doesn't introduce itself all at once.<br />
                It waits.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGNvbG9tYmlhJTIwc3RyZWV0c3xlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medellín streets"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBmb29kJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Opening dinner"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Opening Dinner: Setting the Tone</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                The journey begins at a table locals return to. Not theatrical. Not quiet either. A place where contemporary Colombian cooking speaks plainly—through restraint, sourcing, and confidence.
              </p>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Between courses, Charles and Rob introduce the week not as an itinerary, but as an orientation:
              </p>
              <p className="mb-6 font-serif text-2xl italic">
                How close are you willing to get?
              </p>
              <p className="font-serif text-xl italic">
                This is not a welcome dinner.<br />
                It's a calibration.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Day2() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="bg-white px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-[#111111]/60">
            Day 2
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            THE CITY THAT COOKS FOR ITSELF
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Context Before Consumption</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                The day opens not with landmarks, but with conversation. Medellín's food culture is unpacked through people who chose to build here—chefs, operators, and collaborators who understand the city as an ecosystem, not a scene.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Rob speaks about constraint, improvisation, and why Medellín's culinary voice developed the way it did—direct, layered, and unafraid of intensity.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBmb29kJTIwa2l0Y2hlbnxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Colombian kitchen"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBmb29kJTIwcGxhdGluZ3xlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Kitchen preparation"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">A Kitchen Without Ceremony</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Lunch unfolds in a space where the menu follows the day. There's no performance—just plates shaped by availability and intent. Charles engages the kitchen on process and evolution; Rob listens for what's assumed rather than stated.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Ambition, Framed Carefully</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Dinner takes place at one of the city's most ambitious tables. The experience is presented not as a pinnacle, but as context—an expression of how far Colombian gastronomy has come, and what it carries with it.
              </p>
              <p className="mb-6 font-serif text-xl italic">
                This is not excess.<br />
                It's articulation.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                The night ends deliberately early.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwY29sb21iaWF8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Fine dining"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Day3() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-[#111111]/60">
            Day 3
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            ART, SOUND &<br />THE CITY AFTER DARK
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Creative Infrastructure</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Medellín's art and design culture is explored through spaces shaped by necessity rather than trend. This is not about aesthetics—it's about function, voice, and continuity.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Rob frames the city's creative output as a response, not a rebellion.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1561214115-f2f134cc4912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGFydCUyMGdhbGxlcnl8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medellín art"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBzdHVkaW8lMjB3b3JraW5nfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Private studio"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Private Space, Working Minds</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Guests step inside a working gallery or studio. The conversation is about discipline, longevity, and identity—how creation here is tied to survival before expression.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                The parallels to cooking are obvious. No one needs to say it.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Sound as Social Glue</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                As night falls, the city shifts. The group is invited—not directed—into a listening-first space where music leads and conversation follows. This is not nightlife.
              </p>
              <p className="mb-6 font-serif text-xl italic">
                It's alignment.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Movement is optional.<br />
                Presence is not.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHZlbnVlJTIwbmlnaHR8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Music venue"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TransitionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
    layoutEffect: false
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1609668435692-ca3a7c0e7bb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0YWdlbmElMjBjb2xvbWJpYSUyMGNvYXN0fGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Journey to Cartagena"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl font-serif text-5xl text-[#F4F1EA] md:text-7xl"
        >
          Mountains recede.<br />
          Humidity rises.<br />
          The tempo changes.
        </motion.h2>
      </div>
    </section>
  );
}

function Day4() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="bg-white px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-[#111111]/60">
            Day 4
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            DEPARTURE & CONTRAST
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Leaving the Valley</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Early morning, the group departs Medellín by private plane. Mountains recede. Humidity rises. The tempo changes.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1609668435692-ca3a7c0e7bb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0YWdlbmElMjBjb2xvbWJpYSUyMGNvYXN0fGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Flight to coast"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1612723441838-7e10eaef6165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0YWdlbmElMjBjb2xvbWJpYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Cartagena streets"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Cartagena: Heat, Stone, Memory</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Arrival into a city that wears its history openly. Guests settle into a former cloister turned refuge—cool corridors, open courtyards, time slowed by design.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                The afternoon is unstructured. Walking is enough.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">The Coast at the Table</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Dinner is shaped by fire and proximity to water. Fish, salt, restraint. Cartagena speaks differently than Medellín—and that difference matters.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Later, the city's night unfolds vertically, socially, without agenda. Guests drift as they wish.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0YWdlbmElMjBzZWFmb29kfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Coastal dinner"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Day5() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="bg-[#4A5D68] px-4 py-24 text-[#F4F1EA]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-[#F4F1EA]/60">
            Day 5
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            WATER, RETURN &<br />THE MEANING LAYER
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Water as Reset</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#F4F1EA]">
                The group departs by boat. Stone gives way to horizon. The heat softens. Shoes come off.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#F4F1EA]">
                Lunch is light. Conversation loosens. This is not escape—it's contrast.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1612723441838-7e10eaef6165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0YWdlbmElMjBjb2xvbWJpYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Coastal boat trip"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGNvbG9tYmlhJTIwY2l0eXxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Return to Medellín"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Return to Medellín</h5>
              <p className="font-sans text-lg leading-relaxed text-[#F4F1EA]">
                By mid-day, the group is airborne again. The valley receives you differently now.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Purpose Beyond Aesthetics</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#F4F1EA]">
                Time is spent with a community-led initiative rooted in dignity and long-term impact. Charles speaks directly here. Rob steps back.
              </p>
              <p className="mb-6 font-serif text-xl italic">
                No framing.<br />
                No moral overlay.<br />
                Just proximity and accountability.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#F4F1EA]">
                This moment is not discussed afterward.<br />
                It doesn't need to be.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBpbml0aWF0aXZlJTIwZm9vZHxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Community initiative"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Day6() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-[#111111]/60">
            Day 6
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            CLOSING THE CIRCLE
          </h3>

          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                The final day is unhurried. A last shared meal brings the week into focus—valley and coast, ambition and constraint, sound and silence.
              </p>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                There are no takeaways offered.
              </p>
              <p className="font-serif text-xl italic">
                Guests depart carrying something quieter:<br />
                a recalibrated sense of how culture is built, and what it costs.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBmb29kJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Final meal"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// MANIFESTO FOOTER
function ManifestoFooter({ selectedDate, onInquireClick }: { selectedDate: string | null, onInquireClick: () => void }) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="bg-[#111111] px-4 py-32 text-[#F4F1EA]">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="mb-12 font-serif text-[32px] md:text-6xl">
            WHY THIS JOURNEY EXISTS
          </h2>
          
          <p className="font-sans text-xl leading-relaxed">
            This is not a "Medellín trip."
          </p>
          
          <p className="font-sans text-xl leading-relaxed">
            It is a controlled descent—from surface to structure.
          </p>
          
          <p className="font-sans text-xl leading-relaxed">
            Through food, art, sound, and conversation, guests experience how Chef on Tour operates at its highest level:
          </p>
          
          <div className="my-12 space-y-4 border-l-4 border-[#D4A574] pl-8">
            <p className="font-mono text-lg">relationship-driven</p>
            <p className="font-mono text-lg">culturally literate</p>
            <p className="font-mono text-lg">precise, not precious</p>
            <p className="font-mono text-lg">and comfortable with friction</p>
          </div>
          
          <p className="font-sans text-xl leading-relaxed">
            With Charles Webb opening doors and Rob Pevitts grounding the context, this experience doesn't promise transformation.
          </p>
          
          <p className="font-serif text-2xl italic leading-relaxed">
            It simply creates the conditions for attention.
          </p>

          {/* Inquire Button */}
          <motion.button
            onClick={onInquireClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-3 bg-[#C89B7B] hover:bg-[#D4A574] text-white font-sans text-sm uppercase tracking-widest transition-all duration-300 shadow-lg"
          >
            Inquire About Pricing
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}