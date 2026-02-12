import { motion, AnimatePresence } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { getPublishedTours, type TourDestination } from '@/app/data/tours';

export function ExploreDestinations() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(5);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  // Get destinations dynamically from published tours
  const destinations: TourDestination[] = getPublishedTours();

  // Check if user has seen the swipe hint before
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('hasSeenDestinationsSwipeHint');
    if (!hasSeenHint) {
      setShowSwipeHint(true);
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
        localStorage.setItem('hasSeenDestinationsSwipeHint', 'true');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Responsive cards per slide calculation
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerSlide(5); // Desktop: 5 cards
      } else if (window.innerWidth >= 768) {
        setCardsPerSlide(4); // Tablet: 4 cards
      } else {
        setCardsPerSlide(1); // Mobile: 1 card
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  const totalSlides = Math.ceil(destinations.length / cardsPerSlide);
  const canGoBack = currentSlide > 0;
  const canGoForward = currentSlide < totalSlides - 1;

  // Keyboard arrow navigation (desktop only)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only enable on desktop (lg breakpoint)
      if (window.innerWidth < 1024) return;
      
      if (event.key === 'ArrowLeft' && canGoBack) {
        event.preventDefault();
        handlePrev();
      } else if (event.key === 'ArrowRight' && canGoForward) {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]); // Only depend on currentSlide to avoid stale closures

  const handleNext = () => {
    if (canGoForward) {
      setCurrentSlide(currentSlide + 1);
      setExpandedIndex(0);
      // Hide hint on interaction
      if (showSwipeHint) {
        setShowSwipeHint(false);
        localStorage.setItem('hasSeenDestinationsSwipeHint', 'true');
      }
    }
  };

  const handlePrev = () => {
    if (canGoBack) {
      setCurrentSlide(currentSlide - 1);
      setExpandedIndex(0);
      // Hide hint on interaction
      if (showSwipeHint) {
        setShowSwipeHint(false);
        localStorage.setItem('hasSeenDestinationsSwipeHint', 'true');
      }
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    
    // Hide hint on swipe
    if (showSwipeHint && (Math.abs(info.offset.x) > 20)) {
      setShowSwipeHint(false);
      localStorage.setItem('hasSeenDestinationsSwipeHint', 'true');
    }
    
    if (info.offset.x < -swipeThreshold && canGoForward) {
      handleNext();
    } else if (info.offset.x > swipeThreshold && canGoBack) {
      handlePrev();
    }
  };

  return (
    <section ref={ref} className="relative bg-[#1a1a1a] px-4 py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 md:mb-16 text-center"
        >
          <h2 className="mb-3 sm:mb-4 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-white">
            Explore Destinations
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-sm sm:text-base md:text-lg text-white/70 px-4">
            Each journey is a story waiting to be lived. Choose your next chapter.
          </p>
        </motion.div>

        {/* Desktop: Horizontal Accordion (5 cards) */}
        <div className="hidden lg:block">
          <div className="flex gap-2 h-[600px]">
            {destinations.slice(currentSlide * 5, (currentSlide + 1) * 5).map((destination, index) => {
              const isExpanded = expandedIndex === index;
              
              return (
                <motion.div
                  key={destination.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { 
                    opacity: 1, 
                    y: 0,
                    width: isExpanded ? '40%' : '15%'
                  } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    width: { duration: 0.5, ease: 'easeInOut' }
                  }}
                  onClick={() => setExpandedIndex(index)}
                  className="relative overflow-hidden rounded-lg cursor-pointer group"
                  style={{ flexShrink: 0 }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <ImageWithFallback
                      src={destination.image}
                      alt={destination.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                      isExpanded 
                        ? 'from-black/90 via-black/50 to-black/30' 
                        : 'from-black/80 via-black/40 to-transparent'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6">
                    {/* Collapsed State - Vertical Text */}
                    <AnimatePresence>
                      {!isExpanded && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2"
                          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                        >
                          <h3 className="font-serif text-2xl text-white mb-2 whitespace-nowrap">
                            {destination.name}
                          </h3>
                          <p className="font-sans text-sm text-white/70 uppercase tracking-widest whitespace-nowrap">
                            {destination.country}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expanded State */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="space-y-4"
                        >
                          <div>
                            <p className="font-sans text-xs uppercase tracking-widest text-white/60 mb-2">
                              {destination.country}
                            </p>
                            <h3 className="font-serif text-4xl xl:text-5xl text-white mb-3">
                              {destination.name}
                            </h3>
                            <p className="font-serif text-lg xl:text-xl text-white/90 italic mb-4">
                              {destination.tagline}
                            </p>
                          </div>

                          <p className="font-sans text-sm xl:text-base text-white/80 leading-relaxed max-w-md">
                            {destination.description}
                          </p>

                          <div className="flex items-center gap-2 text-white/70">
                            <Clock className="h-4 w-4" />
                            <span className="font-sans text-sm">{destination.duration}</span>
                          </div>

                          <Link to={destination.link}>
                            <motion.button
                              whileHover={{ x: 4 }}
                              className="mt-2 flex items-center gap-2 font-sans text-sm uppercase tracking-wider text-white border-b-2 border-[#D4A574] pb-1 transition-colors hover:text-[#D4A574]"
                            >
                              Explore Journey
                              <ArrowRight className="h-4 w-4" />
                            </motion.button>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 left-4 xl:left-8 -translate-y-1/2 z-20">
            <motion.button
              onClick={handlePrev}
              disabled={!canGoBack}
              whileHover={canGoBack ? { scale: 1.1, boxShadow: '0 0 20px rgba(212, 165, 116, 0.4)' } : {}}
              whileTap={canGoBack ? { scale: 0.95 } : {}}
              className={`
                w-12 h-12 xl:w-14 xl:h-14 rounded-full 
                bg-black/60 backdrop-blur-md 
                border border-white/20
                flex items-center justify-center
                transition-all duration-300
                ${canGoBack 
                  ? 'text-white/90 hover:bg-black/80 hover:border-[#D4A574]/60 cursor-pointer' 
                  : 'text-white/30 cursor-not-allowed opacity-40'
                }
              `}
              aria-label="Previous destinations"
            >
              <ChevronLeft className="h-6 w-6 xl:h-7 xl:w-7" strokeWidth={2.5} />
            </motion.button>
          </div>
          <div className="absolute top-1/2 right-4 xl:right-8 -translate-y-1/2 z-20">
            <motion.button
              onClick={handleNext}
              disabled={!canGoForward}
              whileHover={canGoForward ? { scale: 1.1, boxShadow: '0 0 20px rgba(212, 165, 116, 0.4)' } : {}}
              whileTap={canGoForward ? { scale: 0.95 } : {}}
              className={`
                w-12 h-12 xl:w-14 xl:h-14 rounded-full 
                bg-black/60 backdrop-blur-md 
                border border-white/20
                flex items-center justify-center
                transition-all duration-300
                ${canGoForward 
                  ? 'text-white/90 hover:bg-black/80 hover:border-[#D4A574]/60 cursor-pointer' 
                  : 'text-white/30 cursor-not-allowed opacity-40'
                }
              `}
              aria-label="Next destinations"
            >
              <ChevronRight className="h-6 w-6 xl:h-7 xl:w-7" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>

        {/* Tablet: Horizontal Accordion (4 cards) */}
        <div className="hidden md:block lg:hidden relative">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="flex gap-2 h-[600px] cursor-grab active:cursor-grabbing"
          >
            {destinations.slice(currentSlide * 4, (currentSlide + 1) * 4).map((destination, index) => {
              const isExpanded = expandedIndex === index;
              
              return (
                <motion.div
                  key={destination.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { 
                    opacity: 1, 
                    y: 0,
                    width: isExpanded ? '40%' : '20%'
                  } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    width: { duration: 0.5, ease: 'easeInOut' }
                  }}
                  onClick={() => setExpandedIndex(index)}
                  className="relative overflow-hidden rounded-lg cursor-pointer group"
                  style={{ flexShrink: 0 }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <ImageWithFallback
                      src={destination.image}
                      alt={destination.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                      isExpanded 
                        ? 'from-black/90 via-black/50 to-black/30' 
                        : 'from-black/80 via-black/40 to-transparent'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6">
                    {/* Collapsed State - Vertical Text */}
                    <AnimatePresence>
                      {!isExpanded && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2"
                          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                        >
                          <h3 className="font-serif text-2xl text-white mb-2 whitespace-nowrap">
                            {destination.name}
                          </h3>
                          <p className="font-sans text-sm text-white/70 uppercase tracking-widest whitespace-nowrap">
                            {destination.country}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expanded State */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="space-y-4"
                        >
                          <div>
                            <p className="font-sans text-xs uppercase tracking-widest text-white/60 mb-2">
                              {destination.country}
                            </p>
                            <h3 className="font-serif text-3xl text-white mb-3">
                              {destination.name}
                            </h3>
                            <p className="font-serif text-base text-white/90 italic mb-4">
                              {destination.tagline}
                            </p>
                          </div>

                          <p className="font-sans text-sm text-white/80 leading-relaxed max-w-md">
                            {destination.description}
                          </p>

                          <div className="flex items-center gap-2 text-white/70">
                            <Clock className="h-4 w-4" />
                            <span className="font-sans text-sm">{destination.duration}</span>
                          </div>

                          <Link to={destination.link}>
                            <motion.button
                              whileHover={{ x: 4 }}
                              className="mt-2 flex items-center gap-2 font-sans text-sm uppercase tracking-wider text-white border-b-2 border-[#D4A574] pb-1 transition-colors hover:text-[#D4A574]"
                            >
                              Explore Journey
                              <ArrowRight className="h-4 w-4" />
                            </motion.button>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Tablet Navigation Arrows - Smaller and Subtle */}
          <div className="absolute top-1/2 left-2 -translate-y-1/2 z-20">
            <motion.button
              onClick={handlePrev}
              disabled={!canGoBack}
              whileTap={canGoBack ? { scale: 0.9 } : {}}
              className={`
                w-10 h-10 rounded-full 
                bg-black/50 backdrop-blur-md 
                border border-white/15
                flex items-center justify-center
                transition-all duration-300
                ${canGoBack 
                  ? 'text-white/80 active:bg-black/70 active:border-[#D4A574]/40 cursor-pointer' 
                  : 'text-white/20 cursor-not-allowed opacity-30'
                }
              `}
              aria-label="Previous destinations"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
            </motion.button>
          </div>
          <div className="absolute top-1/2 right-2 -translate-y-1/2 z-20">
            <motion.button
              onClick={handleNext}
              disabled={!canGoForward}
              whileTap={canGoForward ? { scale: 0.9 } : {}}
              className={`
                w-10 h-10 rounded-full 
                bg-black/50 backdrop-blur-md 
                border border-white/15
                flex items-center justify-center
                transition-all duration-300
                ${canGoForward 
                  ? 'text-white/80 active:bg-black/70 active:border-[#D4A574]/40 cursor-pointer' 
                  : 'text-white/20 cursor-not-allowed opacity-30'
                }
              `}
              aria-label="Next destinations"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
            </motion.button>
          </div>

          {/* Tablet Progress Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(destinations.length / 4) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  setExpandedIndex(0);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide 
                    ? 'w-8 bg-[#D4A574]' 
                    : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile: Horizontal Swipe Carousel (1 card at a time) */}
        <div className="md:hidden relative">
          {/* "Swipe to explore" micro-text for first-time users */}
          <AnimatePresence>
            {showSwipeHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
              >
                <motion.div
                  animate={{ 
                    x: [0, 8, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                >
                  <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-white/90 whitespace-nowrap">
                    Swipe to explore
                  </span>
                  <ChevronRight className="h-3 w-3 text-white/90" strokeWidth={3} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="overflow-visible cursor-grab active:cursor-grabbing"
          >
            <div className="flex gap-4 pl-4 pr-4">
              {destinations.map((destination, index) => {
                const isCurrentCard = index === currentSlide;
                const isNextCard = index === currentSlide + 1;
                
                return (
                  <motion.div
                    key={destination.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: isCurrentCard ? 1 : (isNextCard ? 0.5 : 0.3),
                      scale: isCurrentCard ? 1 : 0.9,
                      x: `${-currentSlide * 100}%`
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: 'easeInOut'
                    }}
                    className="relative overflow-hidden rounded-lg h-[500px] flex-shrink-0"
                    style={{ 
                      width: 'calc(100% - 80px)', // Leave room for peek
                      pointerEvents: isCurrentCard ? 'auto' : 'none'
                    }}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <ImageWithFallback
                        src={destination.image}
                        alt={destination.name}
                        className="h-full w-full object-cover"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isCurrentCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-4"
                      >
                        <div>
                          <p className="font-sans text-xs uppercase tracking-widest text-white/60 mb-2">
                            {destination.country}
                          </p>
                          <h3 className="font-serif text-3xl text-white mb-2">
                            {destination.name}
                          </h3>
                          <p className="font-serif text-base text-white/90 italic mb-3">
                            {destination.tagline}
                          </p>
                        </div>

                        <p className="font-sans text-sm text-white/80 leading-relaxed">
                          {destination.description}
                        </p>

                        <div className="flex items-center gap-2 text-white/70">
                          <Clock className="h-4 w-4" />
                          <span className="font-sans text-sm">{destination.duration}</span>
                        </div>

                        <Link to={destination.link}>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="mt-2 flex items-center gap-2 font-sans text-sm uppercase tracking-wider text-white border-b-2 border-[#D4A574] pb-1 transition-colors active:text-[#D4A574]"
                          >
                            Explore Journey
                            <ArrowRight className="h-4 w-4" />
                          </motion.button>
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Mobile Progress Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {destinations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide 
                    ? 'w-8 bg-[#D4A574]' 
                    : 'w-1.5 bg-white/30 active:bg-white/50'
                }`}
                aria-label={`Go to destination ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 sm:mt-12 md:mt-16 text-center"
        >
          <Link to="/experiences">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white px-6 sm:px-8 py-2.5 sm:py-3 font-sans text-xs sm:text-sm uppercase tracking-wider text-white transition-all hover:bg-white hover:text-[#1a1a1a]"
            >
              View All Destinations
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}