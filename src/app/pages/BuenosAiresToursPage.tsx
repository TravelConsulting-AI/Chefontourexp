import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { parseScheduleDate } from '@/utils/formatScheduleDate';
import { useInView } from '../components/hooks/useInView';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import charlesImage from '@/assets/c8308d698e3100590c205f625ef741d539cd39a4.png';
import francisImage from '@/assets/5cf5acebd432e5429823fd5393f73858c2360294.png';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ReserveDateModal } from '../components/chef-on-tour/ReserveDateModal';
import { CustomDateModal } from '../components/chef-on-tour/CustomDateModal';
import { BookingModal } from '../components/chef-on-tour/BookingModal';
import { useTourData, resolveFixedDateId } from '../hooks/useTourData';

export function BuenosAiresToursPage() {
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get('date');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { tourId, title, schedules } = useTourData('buenos-aires');
  const fixedDateId = resolveFixedDateId(schedules, selectedDate);

  // Departure dates from DB schedules
  const departureDates = schedules.map(s => s.start_date);
  const tourName = title ?? 'Buenos Aires: Beneath the Furia';

  // Calculate end date (9 days / 8 nights)
  const getEndDate = (startDate: string) => {
    const date = parseScheduleDate(startDate);
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
      <HostSection />
      <DepartureDatesSection departureDates={departureDates} />
      <DetailedItinerary />
      <ManifestoFooter onInquireClick={() => setIsBookingModalOpen(true)} />

      {/* Modals */}
      {selectedDate && (
        <ReserveDateModal
          isOpen={isReserveModalOpen}
          onClose={() => setIsReserveModalOpen(false)}
          tourTitle={tourName}
          tourId={tourId}
          fixedDateId={fixedDateId}
          startDate={selectedDate}
          endDate={getEndDate(selectedDate)}
        />
      )}
      <CustomDateModal
        isOpen={isCustomDateModalOpen}
        onClose={() => setIsCustomDateModalOpen(false)}
        tourTitle={tourName}
        tourId={tourId}
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
  const navigate = useNavigate();

  const handleDateClick = (date: string) => {
    // If clicking the already selected date, deselect it
    if (date === selectedDate) {
      navigate('/experiences/buenos-aires');
    } else {
      // Otherwise, select the new date
      navigate(`/experiences/buenos-aires?date=${date}`);
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
                const dateObj = parseScheduleDate(date);
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
                    className={`relative flex-1 sm:flex-initial px-2 sm:px-4 py-2 border-2 transition-all duration-300 ${isSelected
                      ? 'border-[#C89B7B] bg-transparent text-[#C89B7B] shadow-[0_0_15px_rgba(200,155,123,0.5)]'
                      : 'border-[#F4F1EA]/30 bg-transparent text-[#F4F1EA] hover:border-[#C89B7B] hover:bg-[#C89B7B]/10'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:gap-2">
                      <div className="text-center">
                        {/* Mobile format: FEB 14 '26 */}
                        <p className={`sm:hidden font-mono text-[10px] uppercase tracking-wider ${isSelected ? 'font-bold' : ''
                          }`}>
                          {month} {day} '{year}
                        </p>
                        {/* Desktop format: Feb 14 + 2026 */}
                        <p className={`hidden sm:block font-mono text-xs uppercase tracking-wider ${isSelected ? 'font-bold' : ''
                          }`}>
                          {month} {day}
                        </p>
                        <p className={`hidden sm:block font-mono text-[10px] ${isSelected ? 'opacity-90' : 'opacity-60'
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
          src="https://images.unsplash.com/photo-1589909202802-8f4aadce1849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMG5pZ2h0fGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Buenos Aires beneath the fire"
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
            BUENOS AIRES<br />
            BENEATH THE FURIA
          </h1>
          <p className="mb-2 text-base sm:text-lg md:text-xl lg:text-2xl font-sans px-2">
            A Chef on Tour Immersion with Charles Webb
          </p>
          <p className="mb-6 sm:mb-8 font-mono text-sm sm:text-base tracking-wide text-[#F4F1EA]/80">
            9 Days / 8 Nights · Buenos Aires + The Pampas
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 sm:mt-12 lg:mt-16 border-t border-[#F4F1EA]/30 pt-6 sm:pt-8"
          >
            <p className="font-serif text-lg sm:text-xl md:text-2xl italic px-4">
              "Patience, instinct, and surrender."
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
            Buenos Aires is a city that comes alive after dark. Elegance and disorder move side by side here, shaped by immigration, ambition, and an enduring relationship with fire.
          </p>
          <p className="font-sans text-xl leading-relaxed text-[#111111]">
            This journey moves through the city not as a visitor, but as a welcomed insider—into kitchens hidden behind unmarked doors, neighborhoods defined by ritual rather than reputation, and out into the open Pampas where time, land, and flame still decide the meal.
          </p>
          <div className="my-12 border-l-4 border-[#111111] pl-8">
            <p className="font-serif text-2xl italic leading-relaxed text-[#111111]">
              Threaded throughout the experience is the elemental philosophy of Argentina's great fire cooks: patience, instinct, and surrender.
            </p>
          </div>
          <p className="font-sans text-xl leading-relaxed text-[#111111]">
            Meals unfold when they are ready. Conversations stretch. The city reveals itself slowly, through sound, heat, and shared presence.
          </p>
          <p className="mt-8 font-sans text-xl italic leading-relaxed text-[#111111]">
            (Chef Charles Webb takes it from here.)
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 3: THE HOST
function HostSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-16 md:grid-cols-2 md:gap-12 items-center">
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
                The Fire Keeper:<br />
                Chef Charles Webb
              </h3>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                He doesn't open doors; he kicks them down.<br />
                Instinct for people. Instinct for places.
              </p>
            </div>
          </motion.div>

          {/* Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-lg mb-6">
              <ImageWithFallback
                src={francisImage}
                alt="Francis Mallmann"
                className="h-full w-full object-cover grayscale"
              />
            </div>
            <div>
              <h3 className="mb-4 font-serif text-4xl">
                The Fireside Philosopher:<br />
                Francis Mallmann
              </h3>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Fire teaches honesty. Argentina teaches patience.<br />
                Let time and flame decide the outcome.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// SECTION 4: DEPARTURE DATES
function DepartureDatesSection({ departureDates }: { departureDates: string[] }) {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDate = searchParams.get('date');

  const handleDateClick = (date: string) => {
    // If clicking the already selected date, deselect it
    if (date === selectedDate) {
      navigate('/experiences/buenos-aires');
    } else {
      // Otherwise, select the new date
      navigate(`/experiences/buenos-aires?date=${date}`);
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
              const dateObj = parseScheduleDate(date);
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
                  className={`group relative bg-[#1A1A1A] cursor-pointer transition-all duration-300 text-center overflow-hidden border-2 py-4 px-2 ${isSelected
                    ? 'border-[#C89B7B] shadow-[0_0_15px_rgba(200,155,123,0.5)]'
                    : 'border-transparent hover:border-[#C89B7B]/50'
                    }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${isSelected ? 'text-[#C89B7B]' : 'text-[#F4F1EA]'
                      }`}>
                      {month}
                    </span>
                    <span className={`font-serif text-2xl ${isSelected ? 'text-[#C89B7B]' : 'text-[#F4F1EA]'
                      }`}>
                      {day}
                    </span>
                    <span className={`font-mono text-[10px] ${isSelected ? 'text-[#C89B7B]/80' : 'text-[#F4F1EA]/60'
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
              const dateObj = parseScheduleDate(date);
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
                      <p className={`font-serif text-8xl transition-colors duration-300 ${isSelected ? 'text-[#C89B7B]' : 'text-[#F4F1EA] group-hover:text-[#C89B7B]'
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
                  <div className={`h-1 transition-all duration-300 ${isSelected
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
              9 Days / 8 Nights • Buenos Aires + The Pampas • Limited to 12 Guests
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
      <Day4 />
      <TransitionSection />
      <Day5 />
      <Day6 />
      <Day7 />
      <Day8 />
      <Day9 />
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
            ARRIVAL & THE CITY OF DUALITY
          </h3>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Arrival into the Living City</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Guests arrive in Buenos Aires and settle into their hotel—chosen for comfort, character, and the ease of slipping between neighborhoods. There is time to decompress, wander nearby streets, and feel the city's rhythm before being guided into it.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1589909202802-8f4aadce1849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMG5pZ2h0fGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Buenos Aires arrival"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmdlbnRpbmElMjBiZWVmJTIwZ3JpbGx8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Argentine fire cooking"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Opening Dinner: Setting the Tone</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                The journey begins behind an unmarked door. The space feels less like a restaurant and more like a private gathering—fire visible, music low, conversation unforced. A seasonal menu unfolds instinctively, weaving immigration stories into modern Argentine flavors.
              </p>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Between courses, Charles frames the week not as an itinerary, but as a posture: let go of control. Let the city lead.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                This is not a welcome dinner.<br />
                It's an invitation.
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
            MARKETS, MEMORY &<br />THE CITY THAT FEEDS ITSELF
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Markets with Context</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Early entry into a market most travelers pass through quickly—but few understand. The visit is guided ingredient-to-story rather than stall-to-stall. Vendors are chosen with care. Migration, memory, and daily habit reveal what the city values when no one is watching.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Later, a second, quieter market provides contrast. Less spectacle. More routine. Conversations happen quickly and without explanation. This is where Buenos Aires feeds itself.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjBtYXJrZXQlMjBkZWxpfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Buenos Aires market"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwa2l0Y2hlbiUyMGlubm92YXRpb258ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Working kitchen"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">A Kitchen Without a Script</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Lunch unfolds in a working kitchen where the menu follows the day. There is no performance—just plates shaped by availability and instinct. Charles engages the cooks in process and philosophy, listening as much as speaking.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Wine, Ritual & the Long Table</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                The evening slows into a long table centered on Argentine wines chosen for landscape rather than prestige. Stories surface naturally—of land, of families, of choices made quietly over time. This night is about listening: to the wine, to each other, to the city after dark.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmdlbnRpbmElMjB3aW5lJTIwdGFzdGluZ3xlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Wine dinner"
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
            ART, SOUND &<br />THE UNDERGROUND CITY
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Street Art as Living History</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Buenos Aires' street art is explored as record rather than decoration. The group moves through neighborhoods shaped by resistance, humor, grief, and reinvention. Walls speak plainly here. This is not about murals—it's about voice.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1581888227599-779811939961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMHN0cmVldCUyMGFydHxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Street art"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1488998427799-e3362cec87c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwbWFya2V0JTIwY3JhZnRzfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Private atelier"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Private Atelier & Creative Process</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Guests step inside a working atelier and private gallery. The artist speaks not about success, but about doubt, discipline, and identity. Creation is discussed as survival before expression—a parallel that needs no explanation.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Sound, Spirit & the Night Ritual</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                As night falls, the city shifts frequency. A private sonic gathering—part listening session, part ceremony—invites guests into a deeper register of Buenos Aires. Movement is encouraged. Stillness is respected.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                This is not nightlife.<br />
                It's release.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1600298882525-4d0d6a8449ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMHN0cmVldHMlMjBjYWZlfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Night gathering"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
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
            RECOLETA |<br />REFINEMENT & RESTRAINT
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Inherited Silence</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                The pace softens as the group moves through neighborhoods shaped by formality and tradition. Morning unfolds quietly—markets where gestures are restrained, transactions are efficient, and familiarity replaces curiosity. This is Buenos Aires at its most composed, where history is carried lightly but never forgotten.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjBtYXJrZXQlMjBkZWxpfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Recoleta neighborhood"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1600298882525-4d0d6a8449ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMHN0cmVldHMlMjBjYWZlfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Private wine tasting"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Private Tastings & Reflection</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                The group steps inside a private residence for an intimate tasting. Wines are poured slowly, chosen for story rather than label. Conversation turns reflective—about lineage, about taste acquired over time, about how refinement can both preserve and restrict a culture.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Precision at the Table</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Dinner takes place in a dining room defined by control. Technique is exacting. Service is polished. Fire exists, but it is disciplined. The contrast with earlier nights is deliberate, offering a clear view of what Buenos Aires inherited—and what it chose to challenge.
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
          src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmdlbnRpbmElMjBwYW1wYXMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Journey to the Pampas"
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
          Architecture dissolves into horizon.<br />
          The rhythm of Buenos Aires fades.<br />
          Open land awaits.
        </motion.h2>
      </div>
    </section>
  );
}

function Day5() {
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
            Day 5
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            LA BOCA &<br />THE CITY LOOSENS
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Voices by the River</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Color arrives early in La Boca. Painted façades, open studios, and river air give the neighborhood a raw, expressive quality. Artists work in plain sight. Conversations spill into the street. The city's immigrant past feels present rather than preserved.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmdlbnRpbmElMjBwYW1wYXMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="La Boca neighborhood"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBmb29kJTIwa2l0Y2hlbnxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Long lunch"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">The Long Lunch</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Lunch unfolds without urgency in a kitchen where recipes are older than the room. Plates arrive generously. Sauces simmer longer than planned. Wine is poured freely. Stories overlap and evolve, uninterrupted by correctness or conclusion.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Continuity, Not Nostalgia</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Dinner settles into a riverside space worn smooth by time. Candlelight, wood, and familiar flavors create a sense of continuity—this is not performance or reenactment, but daily life carried forward.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wZmlyZSUyMG5pZ2h0JTIwc3RhcnN8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Riverside dinner"
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
    <section ref={ref} className="bg-white px-4 py-24">
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
            THE PAMPAS |<br />FIRE WITHOUT APOLOGY
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Leaving the City</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Buenos Aires releases its grip as architecture gives way to horizon. The rhythm shifts. Noise falls away. The landscape opens and the body follows.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1589909202802-8f4aadce1849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMG5pZ2h0fGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Leaving Buenos Aires"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1488998427799-e3362cec87c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwbWFya2V0JTIwY3JhZnRzfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Gaucho asado"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Gauchos & Asado</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                At a working estancia, gauchos prepare an asado over open flame. Whole cuts cook slowly, tended with patience rather than precision. Bread bakes nearby. Vegetables come straight from the garden. Mate passes hand to hand. Time becomes the central ingredient.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Silence & Stars</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                As night falls, fire replaces music. The sky fills with stars. Conversation thins naturally. The Pampas offer no distraction—only presence.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1600298882525-4d0d6a8449ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMHN0cmVldHMlMjBjYWZlfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Evening stars"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Day7() {
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
            Day 7
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            LIFE ON THE LAND &<br />RETURN
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Estancia Rhythms</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Morning begins with the land. Guests move through daily routines—animals, horses, work done without commentary. Nothing is staged. Participation is optional; observation is enough.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1600298882525-4d0d6a8449ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMHN0cmVldHMlMjBjYWZlfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Estancia morning"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBhcmdlbnRpbmF8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Return to city"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Return to the City</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                After a final countryside meal, the group returns to Buenos Aires. The city feels sharper now, more compressed. Familiar streets register differently after the openness of the Pampas.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Night Without Agenda</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                The evening is intentionally loose. Options are suggested, not prescribed. Some return to favorite corners; others rest. The city holds space either way.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBjcm93ZHxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Evening freedom"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Day8() {
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
            Day 8
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            THE COLLECTIVE PULSE &<br />THE FINAL TABLE
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Context Before Impact</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                The day begins with conversation. A local voice frames football not as entertainment, but as social fabric—loyalty, class, history, and belonging. Chants and rivalries are explained as expressions of identity.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1581888227599-779811939961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMHN0cmVldCUyMGFydHxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Football culture"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1600298882525-4d0d6a8449ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMHN0cmVldHMlMjBjYWZlfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="City gathering"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">The Build</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Anticipation grows as the city gathers itself. Streets fill. Sound increases. The match approaches not as an event, but as a shared release.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Ritual & The Closing Feast</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                The stadium roars. Drums echo. Ninety minutes compress the city's emotion into sound and motion. Later, the group reconvenes in a private home for the final table. Fire is used openly. The chef cooks in view. Stories surface without prompting. No speeches. Just gratitude.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmdlbnRpbmElMjBiZWVmJTIwZ3JpbGx8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Final feast"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Day9() {
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
            Day 9
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            DEPARTURE
          </h3>

          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Private transfer to the airport. Buenos Aires offers no ceremony—only the quiet confidence that fire, night, and patience will travel with you.
              </p>
              <p className="font-serif text-xl italic">
                They do.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1589909202802-8f4aadce1849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWVub3MlMjBhaXJlcyUyMG5pZ2h0fGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Buenos Aires farewell"
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
function ManifestoFooter({ onInquireClick }: { onInquireClick: () => void }) {
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
            This is not a "Buenos Aires trip."
          </p>

          <p className="font-sans text-xl leading-relaxed">
            It is a curated descent—from surface to substance.
          </p>

          <p className="font-sans text-xl leading-relaxed">
            Through food, fire, wine, sound, and conversation, guests experience how Chef on Tour operates at its highest level:
          </p>

          <div className="my-12 space-y-4 border-l-4 border-[#D4A574] pl-8">
            <p className="font-mono text-lg">relationship-driven</p>
            <p className="font-mono text-lg">culturally literate</p>
            <p className="font-mono text-lg">emotionally intelligent</p>
            <p className="font-mono text-lg">unafraid of silence</p>
          </div>

          <p className="font-sans text-xl leading-relaxed">
            With <strong>Charles Webb</strong> opening doors and the elemental philosophy of <strong>Francis Mallmann</strong> shaping the spirit of the journey, this experience does not promise transformation.
          </p>

          <p className="font-serif text-2xl italic leading-relaxed">
            It simply creates the conditions for it.
          </p>

          <motion.button
            onClick={onInquireClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 bg-[#111111] px-12 py-4 font-sans text-lg uppercase tracking-wider text-[#F4F1EA] transition-all hover:bg-[#111111]/90 border-2 border-[#D4A574]"
          >
            INQUIRE TO BOOK
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}