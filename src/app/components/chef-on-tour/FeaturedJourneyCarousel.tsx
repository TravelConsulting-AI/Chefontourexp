import { motion, AnimatePresence } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';

interface FeaturedJourneyCarouselProps<T> {
  items: T[];
  title?: string;
  subtitle?: string;
  desktopCards?: number; // Default: 5
  tabletCards?: number; // Default: 3
  mobileCards?: number; // Default: 1
  cardHeight?: string; // Default: '600px'
  showSwipeHint?: boolean; // Default: true
  swipeHintText?: string; // Default: 'Swipe to explore'
  renderCard: (item: T, index: number, isExpanded: boolean, setExpanded: () => void) => ReactNode;
  className?: string;
}

export function FeaturedJourneyCarousel<T>({
  items,
  title,
  subtitle,
  desktopCards = 5,
  tabletCards = 3,
  mobileCards = 1,
  cardHeight = '600px',
  showSwipeHint = true,
  swipeHintText = 'Swipe to explore',
  renderCard,
  className = ''
}: FeaturedJourneyCarouselProps<T>) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(desktopCards);
  const [showHint, setShowHint] = useState(false);

  // Check if user has seen the swipe hint before
  useEffect(() => {
    if (!showSwipeHint) return;
    
    const hasSeenHint = localStorage.getItem('hasSeenCarouselSwipeHint');
    if (!hasSeenHint) {
      setShowHint(true);
      const timer = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem('hasSeenCarouselSwipeHint', 'true');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);

  // Responsive cards per slide calculation
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerSlide(desktopCards);
      } else if (window.innerWidth >= 768) {
        setCardsPerSlide(tabletCards);
      } else {
        setCardsPerSlide(mobileCards);
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, [desktopCards, tabletCards, mobileCards]);

  const totalSlides = Math.ceil(items.length / cardsPerSlide);
  const canGoBack = currentSlide > 0;
  const canGoForward = currentSlide < totalSlides - 1;

  // Keyboard arrow navigation (desktop only)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [currentSlide]);

  const handleNext = () => {
    if (canGoForward) {
      setCurrentSlide(currentSlide + 1);
      setExpandedIndex(0);
      hideHint();
    }
  };

  const handlePrev = () => {
    if (canGoBack) {
      setCurrentSlide(currentSlide - 1);
      setExpandedIndex(0);
      hideHint();
    }
  };

  const hideHint = () => {
    if (showHint) {
      setShowHint(false);
      localStorage.setItem('hasSeenCarouselSwipeHint', 'true');
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    
    if (showHint && Math.abs(info.offset.x) > 20) {
      hideHint();
    }
    
    if (info.offset.x < -swipeThreshold && canGoForward) {
      handleNext();
    } else if (info.offset.x > swipeThreshold && canGoBack) {
      handlePrev();
    }
  };

  const visibleItems = items.slice(
    currentSlide * cardsPerSlide,
    (currentSlide + 1) * cardsPerSlide
  );

  return (
    <section ref={ref} className={`relative ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 md:mb-16 text-center"
        >
          {title && (
            <h2 className="mb-3 sm:mb-4 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mx-auto max-w-2xl font-sans text-sm sm:text-base md:text-lg text-white/70 px-4">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      {/* Desktop View */}
      <div className="hidden lg:block relative">
        <div className="flex gap-2" style={{ height: cardHeight }}>
          {visibleItems.map((item, index) => (
            <div key={index} className="flex-1">
              {renderCard(item, index, expandedIndex === index, () => setExpandedIndex(index))}
            </div>
          ))}
        </div>

        {/* Desktop Navigation Arrows */}
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
            aria-label="Previous items"
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
            aria-label="Next items"
          >
            <ChevronRight className="h-6 w-6 xl:h-7 xl:w-7" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* Tablet View */}
      <div className="hidden md:block lg:hidden relative">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="flex gap-2 cursor-grab active:cursor-grabbing"
          style={{ height: cardHeight }}
        >
          {visibleItems.map((item, index) => (
            <div key={index} className="flex-1">
              {renderCard(item, index, expandedIndex === index, () => setExpandedIndex(index))}
            </div>
          ))}
        </motion.div>

        {/* Tablet Navigation Arrows */}
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
            aria-label="Previous items"
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
            aria-label="Next items"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Tablet Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, idx) => (
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

      {/* Mobile View */}
      <div className="md:hidden relative">
        {/* Swipe Hint */}
        <AnimatePresence>
          {showHint && (
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
                  {swipeHintText}
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
            {items.map((item, index) => {
              const isCurrentCard = index === currentSlide;
              const isNextCard = index === currentSlide + 1;
              
              return (
                <motion.div
                  key={index}
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
                  className="flex-shrink-0"
                  style={{ 
                    width: 'calc(100% - 80px)',
                    height: cardHeight,
                    pointerEvents: isCurrentCard ? 'auto' : 'none'
                  }}
                >
                  {renderCard(item, index, isCurrentCard, () => {})}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide 
                  ? 'w-8 bg-[#D4A574]' 
                  : 'w-1.5 bg-white/30 active:bg-white/50'
              }`}
              aria-label={`Go to item ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
