import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { parseScheduleDate } from '@/utils/formatScheduleDate';
import { useInView } from '../components/hooks/useInView';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import gonzaloImage from '@/assets/728aae2db10e37ca37c9e76d10a272628c13d02a.png';
import charlesImage from '@/assets/c8308d698e3100590c205f625ef741d539cd39a4.png';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ReserveDateModal } from '../components/chef-on-tour/ReserveDateModal';
import { CustomDateModal } from '../components/chef-on-tour/CustomDateModal';
import { BookingModal } from '../components/chef-on-tour/BookingModal';
import { useTourData, resolveFixedDateId } from '../hooks/useTourData';

export function ToursPage() {
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get('date');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { tourId, title, schedules } = useTourData('barcelona');
  const fixedDateId = resolveFixedDateId(schedules, selectedDate);

  // Departure dates from DB schedules
  const departureDates = schedules.map(s => s.start_date);
  const tourName = title ?? 'Barcelona: Beneath the Surface';

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
      <HostsSection />
      <DepartureDatesSection departureDates={departureDates} />
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

// SECTION 1: FLOATING DATE BAR
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
      navigate('/experiences/barcelona');
    } else {
      // Otherwise, select the new date
      navigate(`/experiences/barcelona?date=${date}`);
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

// SECTION 2: HERO
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
          src="https://images.unsplash.com/photo-1701210797781-7acb50a9895b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBnb3RoaWMlMjBxdWFydGVyfGVufDF8fHx8MTc2Nzk0Mzg5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Barcelona beneath the surface"
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
            BARCELONA<br />
            BENEATH THE SURFACE
          </h1>
          <p className="mb-2 text-base sm:text-lg md:text-xl lg:text-2xl font-sans px-2">
            A Chef on Tour Immersion with Charles Webb & Gonzalo Gil Lavedra
          </p>
          <p className="mb-6 sm:mb-8 font-mono text-sm sm:text-base tracking-wide text-[#F4F1EA]/80">
            6 Days / 5 Nights · Barcelona + Priorat
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 sm:mt-12 lg:mt-16 border-t border-[#F4F1EA]/30 pt-6 sm:pt-8"
          >
            <p className="font-serif text-lg sm:text-xl md:text-2xl italic px-4">
              "The real story begins once the guidebook fails."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 3: INTRO & PHILOSOPHY
function IntroSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-16 md:py-32">
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
            Led by <strong>Chef Charles Webb</strong>, whose instinct for people and places opens kitchens most never see, and <strong>Gonzalo Gil Lavedra</strong>, Argentine culinary scout, poet, and cultural translator, this experience moves through Barcelona not as a checklist—but as a living system of food, art, sound, and meaning.
          </p>
          <div className="my-12 border-l-4 border-[#111111] pl-8">
            <p className="font-serif text-2xl italic leading-relaxed text-[#111111]">
              Gonzalo's philosophy shapes the spine of the trip: when we step outside what's expected of us, something essential reveals itself.
            </p>
          </div>
          <p className="font-sans text-xl leading-relaxed text-[#111111]">
            Over six days, guests move from the city's hidden dining rooms and ateliers into the vineyards of Priorat, weaving together cuisine, creativity, and quiet moments of reflection—designed not to impress, but to <em>transform</em>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 4: THE HOSTS
function HostsSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-16 md:py-32">
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

          {/* Gonzalo Gil Lavedra */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <ImageWithFallback
                src={gonzaloImage}
                alt="Gonzalo Gil Lavedra"
                className="h-full w-full object-cover grayscale"
              />
            </div>
            <div>
              <h3 className="mb-4 font-serif text-4xl">
                The Poet:<br />
                Gonzalo Gil Lavedra
              </h3>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Culinary scout and poet. He translates the soul of the city.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// SECTION 5: DEPARTURE DATES
function DepartureDatesSection({ departureDates }: { departureDates: string[] }) {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDate = searchParams.get('date');

  const handleDateClick = (date: string) => {
    // If clicking the already selected date, deselect it
    if (date === selectedDate) {
      navigate('/experiences/barcelona');
    } else {
      // Otherwise, select the new date
      navigate(`/experiences/barcelona?date=${date}`);
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
              6 Days / 5 Nights • Barcelona + Priorat • Limited to 12 Guests
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

// SECTION 7: DETAILED ITINERARY
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
    <section ref={ref} className="px-4 py-12 md:py-24">
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

          {/* Afternoon - Section 1: Content LEFT, Image RIGHT */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-1">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Barcelona: Arrival into the Living City</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Guests arrive in Barcelona and settle into their hotel—chosen for comfort, location, and the ability to slip easily between neighborhoods. There's time to decompress, wander nearby streets, and feel the rhythm of the city before being guided into it.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1703885195425-ec7ebec8746f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBnb3RoaWMlMjBxdWFydGVyJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2Nzk5MjY3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Barcelona streets"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Evening - Section 2: Image LEFT, Content RIGHT */}
          <div className="grid gap-12 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden order-2 md:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1635282540409-3171279a0e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGVsZWdhbnR8ZW58MXx8fHwxNzY3OTkwODc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Opening dinner"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Opening Dinner: Setting the Tone</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                The journey begins in a space that blends food, music, and atmosphere—a restaurant that feels less like a dining room and more like a cultural salon. Mediterranean flavors anchor the table, while subtle influences from elsewhere hint at Barcelona's openness to the world.
              </p>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Between courses, Charles and Gonzalo introduce the week not as an itinerary, but as a question: <em>How deep do you want to go?</em>
              </p>
              <p className="font-serif text-xl italic">
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
    <section ref={ref} className="bg-white px-4 py-12 md:py-24">
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

          {/* Morning - Section 3: Content LEFT, Image RIGHT */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-1">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Markets with Context</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Early entry into a market most travelers see—but few understand—guided not stall-to-stall, but ingredient-to-story. Vendors are chosen with care. Gonzalo speaks about migration, memory, and how markets reveal what a city values when no one is watching.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Later, a second, quieter market provides contrast: less spectacle, more daily life. Here, chefs shop. Conversations happen in Catalan. This is where Barcelona feeds itself.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1752605158021-6ca2665f6acc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBtYXJrZXQlMjBib3F1ZXJpYXxlbnwxfHx8fDE3Njc5OTI2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Barcelona market"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon - Section 4: Image LEFT, Content RIGHT */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden order-2 md:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1650964798914-6cc279fe2f40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBwYWVsbGElMjBjb29raW5nfGVufDF8fHx8MTc2Nzk5MjY3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Kitchen preparation"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">A Kitchen Without a Script</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Lunch unfolds in a kitchen where the menu changes with the day. There's no performance—just plates built around what arrived that morning. Charles engages the cooks in process and philosophy; Gonzalo listens for what's unsaid.
              </p>
            </div>
          </div>

          {/* Evening - Section 5: Content LEFT, Image RIGHT */}
          <div className="grid gap-12 md:grid-cols-2">
            <div className="order-1">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Wine, Ritual & the Long Table</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                The evening slows. A wine-focused gathering centers on bottles chosen for place rather than prestige. Stories emerge: of landscapes, of families, of choices made quietly over generations.
              </p>
              <p className="font-serif text-xl italic">
                This night is about listeningto the wine, to each other, to the city after dark.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1701596744958-b494dcffe375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwY2VsbGFyJTIwYmFycmVsfGVufDF8fHx8MTc2Nzk5MjY3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Wine cellar"
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
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-12 md:py-24">
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

          {/* Morning - Section 6: Image LEFT, Content RIGHT */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden order-2 md:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1616435297921-d681e3f1a5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBzdHJlZXQlMjBhcnR8ZW58MXx8fHwxNzY3OTkwODc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Barcelona street art"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Street Art as Living History</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Barcelona's street art is explored with a curator who treats walls as archives. The group moves through neighborhoods shaped by resistance, reinvention, and creative necessity. This is not about murals—it's about voice.
              </p>
            </div>
          </div>

          {/* Afternoon - Section 7: Content LEFT, Image RIGHT */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-1">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Private Atelier & Artistic Process</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Guests step inside a working atelier and private gallery. The artist speaks not about success, but about doubt, discipline, and identity. Gonzalo frames the visit as a parallel to cooking: creation as a dialogue with place.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1666990324995-1ba85ec472ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBtb2Rlcm5pc3QlMjBidWlsZGluZ3xlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Private atelier"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Evening - Section 8: Image LEFT, Content RIGHT */}
          <div className="grid gap-12 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden order-2 md:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1711927115559-c75d8e721e36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBuaWdodGNsdWJ8ZW58MXx8fHwxNzY3OTkwODc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Barcelona nightlife"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Sound, Spirit & the Night Ritual</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                As night falls, the city shifts frequency. A private sonic experience—part DJ set, part ceremony—invites guests into a deeper, more visceral Barcelona. Movement is encouraged. Stillness is respected.
              </p>
              <p className="font-serif text-xl italic">
                This is not nightlife.<br />
                It's a recalibration.
              </p>
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
          src="https://images.unsplash.com/photo-1558595827-f89bba7551e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmlvcmF0JTIwdmluZXlhcmQlMjBtaXN0fGVufDF8fHx8MTc2Nzk5MDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Journey to Priorat"
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
          The city gives way to rugged hills.<br />
          Conversation softens.<br />
          Phones stay quiet.
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
            THE MEANING LAYER &<br />DEPARTURE FROM THE CITY
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-1">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Purpose Beyond Pleasure</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Before leaving Barcelona, the group visits a social impact initiative rooted in care and dignity. This is not charity tourism. It's context—understanding how culture, food, and responsibility intersect.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                Gonzalo speaks candidly about travel's obligation to give back—not loudly, but sincerely.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1632073962549-68f13ca47885?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBtb3JuaW5nJTIwY29mZmVlJTIwY2FmZXxlbnwxfHx8fDE3Njc5OTI2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Community initiative"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1695101137604-50e4015ab36e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRhbGFuJTIwY291bnRyeXNpZGUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Journey through countryside"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
              <h5 className="mb-4 font-serif text-3xl">Journey to Priorat</h5>
              <p className="font-sans text-lg leading-relaxed text-[#111111]">
                The city gives way to rugged hills and terraced vineyards. Conversation softens. Phones stay quiet. Arrival in Priorat feels like stepping into another tempo entirely.
              </p>
            </div>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div className="order-1">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">Fire, Silence & the First Night in Wine Country</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed text-[#111111]">
                Dinner is simple, grounded, and deeply local. Wine comes from nearby slopes. Fire replaces music. Stars replace streetlights.
              </p>
              <p className="font-serif text-xl italic">
                The group sleeps well.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1558595827-f89bba7551e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmlvcmF0JTIwdmluZXlhcmQlMjBtaXN0fGVufDF8fHx8MTc2Nzk5MDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Priorat evening"
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
            To Priorat. To Stillness.
          </h3>

          {/* Morning */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden order-2 md:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1558595827-f89bba7551e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmlvcmF0JTIwdmluZXlhcmQlMjBtaXN0fGVufDF8fHx8MTc2Nzk5MDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Priorat vineyard"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Morning</h4>
              <h5 className="mb-4 font-serif text-3xl">Vineyards with Their Keepers</h5>
              <p className="font-sans text-lg leading-relaxed">
                A private visit with a family winery reveals Priorat not as a luxury product, but as a lived commitment. Guests walk the vines, feel the slate beneath their feet, and hear how time—not trendsshapes the wine.
              </p>
            </div>
          </div>

          {/* Afternoon */}
          <div className="mb-16">
            <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Afternoon</h4>
            <h5 className="mb-6 font-serif text-3xl">Lunch at the Hotel, Time at Leisure</h5>
            <p className="font-sans text-lg leading-relaxed">
              Lunch unfolds at the hotel, where cuisine reflects the surrounding land. The afternoon is intentionally unprogrammed: spa, walking paths, reading, or simply doing nothing at all.
            </p>
          </div>

          {/* Evening */}
          <div className="grid gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1554598286-ed7bfd1dedca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwY2VsbGFyJTIwcHJpb3JhdHxlbnwxfHx8fDE3Njc5OTA4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Closing dinner"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h4 className="mb-4 font-mono text-base uppercase tracking-wide">Evening</h4>
              <h5 className="mb-4 font-serif text-3xl">The Closing Table</h5>
              <p className="mb-6 font-sans text-lg leading-relaxed">
                The final dinner is intimate and reflective. Charles cooks alongside local collaborators. Gonzalo offers a short reading—part poem, part meditation on travel, choice, and presence.
              </p>
              <p className="font-serif text-xl italic">
                No speeches.<br />
                Just gratitude.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Day6() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-[#111111]/60">
            Day 6
          </h2>
          <h3 className="mb-12 font-serif text-[32px] md:text-6xl">
            DEPARTURE
          </h3>

          <div className="mb-12">
            <h4 className="mb-6 font-mono text-base uppercase tracking-wide">Morning</h4>
            <p className="font-sans text-xl leading-relaxed text-[#111111]">
              Breakfast, embraces, quiet conversations. Guests depart carrying more than recommendations or photographs.
            </p>
          </div>

          <p className="font-serif text-2xl italic leading-relaxed">
            They leave with new reference points—for food, for culture, for how deeply travel can actually go.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// FINAL SECTION: MANIFESTO
function ManifestoFooter({ selectedDate, onInquireClick }: { selectedDate: string | null, onInquireClick: () => void }) {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section ref={ref} className="bg-white px-4 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="mb-12 font-serif text-5xl md:text-6xl">
            WHY THIS JOURNEY EXISTS
          </h2>

          <p className="mb-12 font-serif text-2xl italic leading-relaxed text-[#111111]">
            This is not a "Barcelona trip."<br />
            It is a curated descent—from surface to substance.
          </p>

          <p className="mb-12 font-sans text-xl leading-relaxed text-[#111111]">
            Through food, art, wine, sound, and conversation, guests experience how Chef on Tour operates at its highest level:
          </p>

          <div className="mb-16 space-y-4">
            <p className="font-sans text-2xl text-[#111111]">relationship-driven</p>
            <p className="font-sans text-2xl text-[#111111]">culturally literate</p>
            <p className="font-sans text-2xl text-[#111111]">emotionally intelligent</p>
            <p className="font-sans text-2xl text-[#111111]">and unafraid of silence</p>
          </div>

          <p className="mb-12 font-sans text-xl leading-relaxed text-[#111111]">
            With Charles Webb opening doors and Gonzalo Gil Lavedra guiding the inner journey, this experience doesn't promise transformation.
          </p>

          <p className="mb-16 font-serif text-2xl italic leading-relaxed text-[#111111]">
            It simply creates the conditions for it.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#111111] px-12 py-4 font-sans text-lg uppercase tracking-wider text-[#F4F1EA] transition-all hover:bg-[#111111]/90"
            onClick={onInquireClick}
          >
            INQUIRE TO BOOK
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}