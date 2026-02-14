import { motion } from 'motion/react';
import { useState } from 'react';
import { parseScheduleDate } from '@/utils/formatScheduleDate';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../components/hooks/useInView';
import worldMapImg from '@/assets/96aa6231ee8e507a079cbe137b19c421e3b33761.png';

interface Tour {
  id: string;
  dateRange: string;
  city: string;
  country: string;
  region: 'LATIN AMERICA' | 'EUROPE' | 'ASIA' | 'MIDDLE EAST';
  experienceTitle: string;
  gridPosition: { col: number; row: number }; // grid coordinates (120 columns x 80 rows)
  href: string;
  imageUrl: string;
  departureDates: string[]; // Three departure dates for each tour
}

// New interface for individual date entries
interface DateEntry {
  id: string; // unique id for each date entry
  tourId: string; // reference to the original tour
  date: string; // single departure date
  city: string;
  country: string;
  region: 'LATIN AMERICA' | 'EUROPE' | 'ASIA' | 'MIDDLE EAST';
  experienceTitle: string;
  href: string;
  imageUrl: string;
}

const tours: Tour[] = [
  {
    id: 'buenos-aires',
    dateRange: 'Year Round',
    city: 'Buenos Aires',
    country: 'Argentina',
    region: 'LATIN AMERICA',
    experienceTitle: 'Beneath the Fire',
    gridPosition: { col: 37, row: 62 },
    href: '/experiences/buenos-aires',
    imageUrl: 'https://images.unsplash.com/photo-1721488399116-42e4be3ee333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCdWVub3MlMjBBaXJlcyUyMEFyZ2VudGluYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjgwNjM3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    departureDates: ['2026-01-15', '2026-05-20', '2026-09-25']
  },
  {
    id: 'bangkok',
    dateRange: 'Year Round',
    city: 'Bangkok',
    country: 'Thailand',
    region: 'ASIA',
    experienceTitle: 'Beneath the Temples',
    gridPosition: { col: 96, row: 44 },
    href: '/experiences/bangkok',
    imageUrl: 'https://images.unsplash.com/photo-1677127307966-e3db82b1b935?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYW5na29rJTIwVGhhaWxhbmQlMjB0ZW1wbGV8ZW58MXx8fHwxNzY3OTkwOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    departureDates: ['2026-01-20', '2026-05-10', '2026-09-15']
  },
  {
    id: 'rio',
    dateRange: 'Year Round',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    region: 'LATIN AMERICA',
    experienceTitle: 'Beneath the Mountain',
    gridPosition: { col: 44, row: 55 },
    href: '/experiences/rio',
    imageUrl: 'https://images.unsplash.com/photo-1578567782898-b8e94ff85199?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSaW8lMjBkZSUyMEphbmVpcm8lMjBCcmF6aWx8ZW58MXx8fHwxNzY3OTY5Nzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    departureDates: ['2026-02-10', '2026-06-15', '2026-10-20']
  },
  {
    id: 'barcelona',
    dateRange: 'Year Round',
    city: 'Barcelona',
    country: 'Spain',
    region: 'EUROPE',
    experienceTitle: 'Beneath the Surface',
    gridPosition: { col: 62, row: 30 },
    href: '/experiences/barcelona',
    imageUrl: 'https://images.unsplash.com/photo-1457207714875-13ef75a801ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYXJjZWxvbmElMjBTcGFpbiUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3NjgwNjM3OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    departureDates: ['2026-02-15', '2026-06-20', '2026-10-25']
  },
  {
    id: 'medellin',
    dateRange: 'Year Round',
    city: 'Medellín',
    country: 'Colombia',
    region: 'LATIN AMERICA',
    experienceTitle: 'Beneath the Valley',
    gridPosition: { col: 33, row: 45 },
    href: '/experiences/medellin',
    imageUrl: 'https://images.unsplash.com/photo-1633627425472-d07ac65e2a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWRlbGxpbiUyMENvbG9tYmlhJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc2ODA2MzgwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    departureDates: ['2026-03-05', '2026-07-10', '2026-11-15']
  },
  {
    id: 'palermo',
    dateRange: 'Spring & Fall',
    city: 'Palermo',
    country: 'Sicily, Italy',
    region: 'EUROPE',
    experienceTitle: 'Beneath the Sun',
    gridPosition: { col: 66, row: 33 },
    href: '/experiences/palermo',
    imageUrl: 'https://images.unsplash.com/photo-1696773605964-16f6abbef9de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYWxlcm1vJTIwU2ljaWx5JTIwSXRhbHl8ZW58MXx8fHwxNzY4MDYzNzk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    departureDates: ['2026-03-18', '2026-09-22', '2026-11-10']
  },
  {
    id: 'beirut',
    dateRange: 'Spring & Fall',
    city: 'Beirut',
    country: 'Lebanon',
    region: 'MIDDLE EAST',
    experienceTitle: 'Beneath the Cedars',
    gridPosition: { col: 74, row: 31 },
    href: '/experiences/beirut',
    imageUrl: 'https://images.unsplash.com/photo-1759403605420-dca1e5c28a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCZWlydXQlMjBMZWJhbm9uJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc2ODA2Mzc5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    departureDates: ['2026-04-05', '2026-10-10', '2027-04-15']
  },
  {
    id: 'malaga',
    dateRange: 'Spring & Summer',
    city: 'Málaga',
    country: 'Andalucía, Spain',
    region: 'EUROPE',
    experienceTitle: 'Beneath the Waves',
    gridPosition: { col: 60, row: 31 },
    href: '/experiences/malaga',
    imageUrl: 'https://images.unsplash.com/photo-1707919746451-f988b2c632d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxhZ2ElMjBBbmRhbHVjaWElMjBTcGFpbnxlbnwxfHx8fDE3NjgwNjM3OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    departureDates: ['2026-04-20', '2026-07-25', '2026-08-30']
  },
  {
    id: 'istanbul',
    dateRange: 'Fall & Spring',
    city: 'Istanbul',
    country: 'Turkey',
    region: 'EUROPE',
    experienceTitle: 'Beneath the Bridge',
    gridPosition: { col: 72, row: 29 },
    href: '/experiences/istanbul',
    imageUrl: 'https://images.unsplash.com/photo-1659395065151-c181db039a1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJc3RhbmJ1bCUyMFR1cmtleSUyMEJvc3Bob3J1c3xlbnwxfHx8fDE3NjgwNjM3OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    departureDates: ['2026-05-08', '2026-09-12', '2027-03-20']
  },
  {
    id: 'mirissa',
    dateRange: 'Winter',
    city: 'Mirissa',
    country: 'Sri Lanka',
    region: 'ASIA',
    experienceTitle: 'Beneath the Palms',
    gridPosition: { col: 87, row: 48 },
    href: '/experiences/mirissa',
    imageUrl: 'https://images.unsplash.com/photo-1704797390447-862d022943f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNaXJpc3NhJTIwU3JpJTIwTGFua2ElMjwiYmVhY2h8ZW58MXx8fHwxNzNjNjQ5NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    departureDates: ['2026-12-10', '2026-12-20', '2027-01-15']
  }
];

export function DestinationsPage() {
  const [hoveredTourId, setHoveredTourId] = useState<string | null>(null);
  const [hoveredFromMap, setHoveredFromMap] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | 'LATIN AMERICA' | 'EUROPE' | 'ASIA' | 'MIDDLE EAST'>('ALL');
  const navigate = useNavigate();

  const filteredTours = selectedRegion === 'ALL'
    ? tours
    : tours.filter(tour => tour.region === selectedRegion);

  const handleTourClick = (tour: Tour, date?: string) => {
    if (date) {
      navigate(`${tour.href}?date=${date}`);
    } else {
      navigate(tour.href);
    }
  };

  const handleHoverTourFromList = (tourId: string | null) => {
    setHoveredTourId(tourId);
    setHoveredFromMap(false);
  };

  const handleHoverTourFromMap = (tourId: string | null) => {
    setHoveredTourId(tourId);
    setHoveredFromMap(true);
  };

  return (
    <div className="min-h-screen bg-[#1E2538] overflow-hidden">
      {/* Page Title Section */}
      <PageTitle />

      {/* Region Filter */}
      <RegionFilter selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />

      {/* Main Content: Two Column Layout */}
      <div className="relative flex flex-col md:flex-row h-auto md:h-[calc(100vh-280px)] min-h-[600px]">
        {/* Left Column: Tour List */}
        <TourList
          tours={filteredTours}
          hoveredTourId={hoveredTourId}
          onHoverTour={handleHoverTourFromList}
          onClickTour={handleTourClick}
          hoveredFromMap={hoveredFromMap}
        />

        {/* Right Column: Interactive Map */}
        <InteractiveMap
          tours={filteredTours}
          hoveredTourId={hoveredTourId}
          onHoverTour={handleHoverTourFromMap}
          onClickTour={handleTourClick}
        />
      </div>
    </div>
  );
}

// Page Title Component
function PageTitle() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section ref={ref} className="px-4 pt-32 pb-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h1 className="mb-4 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F4F1EA] italic">
          Cities to Explore in 2025-26
        </h1>
        <p className="font-sans text-base sm:text-lg text-[#F4F1EA]/70 max-w-2xl mx-auto">
          Upcoming Chef on Tour culinary experiences around the world
        </p>
      </motion.div>
    </section>
  );
}

// Region Filter Component
function RegionFilter({
  selectedRegion,
  onSelectRegion
}: {
  selectedRegion: 'ALL' | 'LATIN AMERICA' | 'EUROPE' | 'ASIA' | 'MIDDLE EAST';
  onSelectRegion: (region: 'ALL' | 'LATIN AMERICA' | 'EUROPE' | 'ASIA' | 'MIDDLE EAST') => void;
}) {
  const regions: ('ALL' | 'LATIN AMERICA' | 'EUROPE' | 'ASIA' | 'MIDDLE EAST')[] = ['ALL', 'LATIN AMERICA', 'EUROPE', 'ASIA', 'MIDDLE EAST'];

  return (
    <div className="pb-8 px-4">
      {/* Desktop: Centered buttons */}
      <div className="hidden md:flex justify-center gap-4">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => onSelectRegion(region)}
            className={`
              px-6 py-2 font-sans text-xs uppercase tracking-widest transition-all duration-300
              ${selectedRegion === region
                ? 'bg-[#C89B7B] text-white'
                : 'bg-transparent border border-[#F4F1EA]/30 text-[#F4F1EA]/70 hover:border-[#C89B7B] hover:text-[#C89B7B]'
              }
            `}
          >
            {region === 'ALL' ? 'World' : region}
          </button>
        ))}
      </div>

      {/* Mobile: Horizontal scrollable */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => onSelectRegion(region)}
              className={`
                px-6 py-2 font-sans text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                ${selectedRegion === region
                  ? 'bg-[#C89B7B] text-white'
                  : 'bg-transparent border border-[#F4F1EA]/30 text-[#F4F1EA]/70 hover:border-[#C89B7B] hover:text-[#C89B7B]'
                }
              `}
            >
              {region === 'ALL' ? 'World' : region}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tour List Component
function TourList({
  tours,
  hoveredTourId,
  onHoverTour,
  onClickTour,
  hoveredFromMap
}: {
  tours: Tour[];
  hoveredTourId: string | null;
  onHoverTour: (id: string | null) => void;
  onClickTour: (tour: Tour, date?: string) => void;
  hoveredFromMap: boolean;
}) {
  // Flatten tours into individual date entries
  const dateEntries: DateEntry[] = tours.flatMap(tour =>
    tour.departureDates.map((date, index) => ({
      id: `${tour.id}-${index}`,
      tourId: tour.id,
      date: date,
      city: tour.city,
      country: tour.country,
      region: tour.region,
      experienceTitle: tour.experienceTitle,
      href: tour.href,
      imageUrl: tour.imageUrl
    }))
  );

  // Sort chronologically
  const sortedDateEntries = [...dateEntries].sort((a, b) =>
    parseScheduleDate(a.date).getTime() - parseScheduleDate(b.date).getTime()
  );

  // Filter when hovering from map
  const displayEntries = (hoveredTourId && hoveredFromMap)
    ? sortedDateEntries.filter(entry => entry.tourId === hoveredTourId)
    : sortedDateEntries;

  return (
    <div className="w-full md:w-[420px] lg:w-[480px] border-r border-[#F4F1EA]/10 overflow-y-auto bg-[#1A1F2E]/50 backdrop-blur-sm">
      <div className="p-4 sm:p-6">
        {displayEntries.map((entry) => {
          const dateObj = parseScheduleDate(entry.date);
          const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
          const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' }).padStart(2, '0');
          const year = dateObj.toLocaleDateString('en-US', { year: 'numeric' });

          return (
            <div
              key={entry.id}
              onMouseEnter={() => onHoverTour(entry.tourId)}
              onMouseLeave={() => onHoverTour(null)}
              onClick={() => {
                const tour = tours.find(t => t.id === entry.tourId);
                if (tour) onClickTour(tour, entry.date);
              }}
              className={`
                group relative mb-4 cursor-pointer rounded-sm transition-all duration-300 flex gap-3
                ${hoveredTourId === entry.tourId
                  ? 'bg-[#C89B7B]/20'
                  : 'hover:bg-[#F4F1EA]/5'
                }
              `}
            >
              {/* Left: Single Departure Date */}
              <div className="flex flex-col gap-1.5 py-3 pl-3 pr-2">
                <div
                  className="flex flex-col items-center justify-center bg-[#F4F1EA]/5 border border-[#C89B7B]/20 rounded px-3 py-2 min-w-[70px]"
                >
                  <span className="font-mono text-xs text-[#C89B7B] font-semibold leading-tight tracking-wider">{month} {day}</span>
                  <span className="font-mono text-xs text-[#F4F1EA]/70 leading-tight">{year}</span>
                </div>
              </div>

              {/* Right: Tour Info */}
              <div className="flex-1 py-3 pr-3 border-l-2 border-[#C89B7B]/30">
                <div className="pl-3">
                  {/* Experience Title */}
                  <p className="mb-1 font-mono text-[10px] tracking-wide text-[#C89B7B] uppercase">
                    {entry.experienceTitle}
                  </p>

                  {/* City + Country + View Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg sm:text-xl text-[#F4F1EA] mb-0.5 leading-tight">
                        {entry.city}, {entry.country}
                      </h3>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const tour = tours.find(t => t.id === entry.tourId);
                        if (tour) onClickTour(tour, entry.date);
                      }}
                      className={`
                        px-3 py-1 font-sans text-[10px] uppercase tracking-widest transition-all duration-300
                        border rounded-sm whitespace-nowrap mt-1
                        ${hoveredTourId === entry.tourId
                          ? 'border-[#C89B7B] text-[#C89B7B] bg-[#C89B7B]/10'
                          : 'border-[#F4F1EA]/30 text-[#F4F1EA]/70 hover:border-[#C89B7B] hover:text-[#C89B7B]'
                        }
                      `}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtle bottom border */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-[#F4F1EA]/5" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Interactive Map Component
function InteractiveMap({
  tours,
  hoveredTourId,
  onHoverTour,
  onClickTour
}: {
  tours: Tour[];
  hoveredTourId: string | null;
  onHoverTour: (id: string | null) => void;
  onClickTour: (tour: Tour, date?: string) => void;
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [showGrid, setShowGrid] = useState(false); // Toggle for grid visibility - hidden by default

  // Group tours by location to avoid overlapping markers
  const locationGroups = tours.reduce((acc, tour) => {
    const key = `${tour.gridPosition.col}-${tour.gridPosition.row}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(tour);
    return acc;
  }, {} as Record<string, Tour[]>);

  // Grid dimensions
  const GRID_COLS = 120;
  const GRID_ROWS = 80;

  // Determine region for zoom based on tours
  const getRegionZoom = () => {
    if (tours.length === 0) return { scale: 1, x: 0, y: 0 };

    const regions = [...new Set(tours.map(t => t.region))];

    // If multiple regions or ALL, show world view
    if (regions.length > 1) return { scale: 1, x: 0, y: 0 };

    const region = regions[0];

    // Latin America zoom frame calculated from bounds:
    // Left: col 10, Right: col 70, Top: row 35, Bottom: row 75
    // Frame size: 60 cols x 40 rows
    // Frame center: col 40, row 55
    // Grid center: col 60, row 40
    // Scale: 2.0 (to fit frame to viewport)
    // X offset: ((60 - 40) / 120) * 100 = 16.67%
    // Y offset: ((40 - 55) / 80) * 100 = -18.75%

    // Asia zoom frame calculated from bounds:
    // Left: col 60, Right: col 120, Top: row 25, Bottom: row 65
    // Frame size: 60 cols x 40 rows
    // Frame center: col 90, row 45
    // Grid center: col 60, row 40
    // Scale: 2.0 (to fit frame to viewport)
    // X offset: ((60 - 90) / 120) * 100 = -25%
    // Y offset: ((40 - 45) / 80) * 100 = -6.25%

    // Region-specific zoom configurations (scale and translate)
    const zoomConfigs: Record<string, { scale: number; x: number; y: number }> = {
      'LATIN AMERICA': { scale: 2.0, x: 16.67, y: -18.75 },
      'EUROPE': { scale: 2.5, x: -35, y: 15 },
      'ASIA': { scale: 2.0, x: -25, y: -6.25 },
      'MIDDLE EAST': { scale: 3.0, x: -50, y: 8 }
    };

    return zoomConfigs[region] || { scale: 1, x: 0, y: 0 };
  };

  const zoomConfig = getRegionZoom();

  return (
    <div
      ref={ref}
      className="hidden md:block flex-1 relative bg-[#1E2538] overflow-hidden min-h-[500px] md:min-h-0"
    >
      {/* Zoomable Map Container */}
      <motion.div
        className="absolute inset-0 origin-center"
        animate={{
          scale: zoomConfig.scale,
          x: `${zoomConfig.x}%`,
          y: `${zoomConfig.y}%`
        }}
        transition={{
          duration: 1.2,
          ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for smooth zoom
        }}
      >
        {/* World Map Background Image */}
        <div className="absolute inset-0">
          <img
            src={worldMapImg}
            alt="World Map"
            className="h-full w-full object-cover opacity-60"
          />
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-[#1E2538]/40" />
        </div>

        {/* Grid Overlay System (120x80) */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <svg className="w-full h-full" preserveAspectRatio="none">
              {/* Vertical grid lines */}
              {Array.from({ length: GRID_COLS + 1 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={`${(i / GRID_COLS) * 100}%`}
                  y1="0%"
                  x2={`${(i / GRID_COLS) * 100}%`}
                  y2="100%"
                  stroke="#F4F1EA"
                  strokeWidth={i % 10 === 0 ? "1" : "0.3"}
                  opacity={i % 10 === 0 ? "0.25" : "0.1"}
                />
              ))}
              {/* Horizontal grid lines */}
              {Array.from({ length: GRID_ROWS + 1 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0%"
                  y1={`${(i / GRID_ROWS) * 100}%`}
                  x2="100%"
                  y2={`${(i / GRID_ROWS) * 100}%`}
                  stroke="#F4F1EA"
                  strokeWidth={i % 10 === 0 ? "1" : "0.3"}
                  opacity={i % 10 === 0 ? "0.25" : "0.1"}
                />
              ))}
              {/* Grid labels (Column numbers at top - every 10th) */}
              {Array.from({ length: GRID_COLS }).map((_, i) => {
                if ((i + 1) % 10 !== 0) return null;
                return (
                  <text
                    key={`col-${i}`}
                    x={`${((i + 0.5) / GRID_COLS) * 100}%`}
                    y="2.5%"
                    fill="#F4F1EA"
                    fontSize="11"
                    opacity="0.5"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontWeight="500"
                  >
                    {i + 1}
                  </text>
                );
              })}
              {/* Grid labels (Row numbers at left - every 10th) */}
              {Array.from({ length: GRID_ROWS }).map((_, i) => {
                if ((i + 1) % 10 !== 0) return null;
                return (
                  <text
                    key={`row-${i}`}
                    x="1.5%"
                    y={`${((i + 0.5) / GRID_ROWS) * 100}%`}
                    fill="#F4F1EA"
                    fontSize="11"
                    opacity="0.5"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontWeight="500"
                    dominantBaseline="middle"
                  >
                    {i + 1}
                  </text>
                );
              })}
            </svg>
          </div>
        )}

        {/* Location Markers */}
        {Object.entries(locationGroups).map(([key, groupTours]) => {
          const tour = groupTours[0]; // Use first tour for position
          const isHovered = groupTours.some(t => t.id === hoveredTourId);

          // Smart popup positioning based on marker location
          const getPopupPosition = () => {
            const col = tour.gridPosition.col;
            const row = tour.gridPosition.row;

            // Determine horizontal position
            let horizontalClass = 'left-1/2 -translate-x-1/2'; // default: centered
            let arrowHorizontalClass = 'left-1/2 -translate-x-1/2'; // default: centered arrow

            // Special case: Medellín always shows popup to the right
            if (tour.id === 'medellin') {
              horizontalClass = 'left-0';
              arrowHorizontalClass = 'left-4';
            } else if (col < 30) {
              // Left side of map - show popup to the right
              horizontalClass = 'left-0';
              arrowHorizontalClass = 'left-4';
            } else if (col > 90) {
              // Right side of map - show popup to the left
              horizontalClass = 'right-0';
              arrowHorizontalClass = 'right-4';
            }

            // Determine vertical position
            let verticalClass = 'top-8'; // default: below marker
            let arrowClass = 'rotate-45 -top-2 border-l border-t'; // default: arrow pointing up

            if (row < 40) {
              // Top half of map - show popup below
              verticalClass = 'top-8';
              arrowClass = 'rotate-45 -top-2 border-l border-t';
            } else {
              // Bottom half of map - show popup above
              verticalClass = 'bottom-8';
              arrowClass = 'rotate-[225deg] -bottom-2 border-r border-b';
            }

            return { horizontalClass, verticalClass, arrowHorizontalClass, arrowClass };
          };

          const popupPos = getPopupPosition();

          return (
            <motion.div
              key={key}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? {
                scale: 1 / zoomConfig.scale, // Counter-scale to keep dot same size
                opacity: 1
              } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${(tour.gridPosition.col / 120) * 100}%`,
                top: `${(tour.gridPosition.row / 80) * 100}%`,
                zIndex: isHovered ? 100 : 20, // Hovered marker appears above all others
              }}
              onMouseEnter={() => onHoverTour(tour.id)}
              onMouseLeave={() => onHoverTour(null)}
              onClick={() => onClickTour(tour)}
            >
              {/* Outer Pulse Ring (on hover) */}
              {isHovered && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-full border-2 border-[#C89B7B]"
                />
              )}

              {/* Main Marker Dot */}
              <div
                className={`
                  w-3 h-3 rounded-full transition-all duration-300 relative
                  ${isHovered
                    ? 'bg-[#C89B7B] scale-150 shadow-[0_0_20px_rgba(200,155,123,0.6)]'
                    : 'bg-[#F4F1EA] group-hover:bg-[#C89B7B] group-hover:scale-125'
                  }
                `}
              >
                {/* Inner Glow */}
                <div className={`
                  absolute inset-0 rounded-full 
                  ${isHovered ? 'animate-pulse' : ''}
                `}
                  style={{
                    boxShadow: isHovered ? '0 0 15px rgba(200,155,123,0.8)' : 'none'
                  }}
                />
              </div>

              {/* Enhanced Popup Card with Image (appears on hover) */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute ${popupPos.verticalClass} ${popupPos.horizontalClass} transform w-72 pointer-events-auto z-50`}
                  style={{
                    // Counter-scale the popup so it appears normal size
                    scale: zoomConfig.scale
                  }}
                >
                  {/* Invisible bridge to prevent hover gap */}
                  <div className={`absolute ${popupPos.verticalClass.includes('top')
                    ? 'bottom-full left-1/2 -translate-x-1/2 w-24 h-8'
                    : 'top-full left-1/2 -translate-x-1/2 w-24 h-8'
                    }`} />

                  <div className="bg-[#1A1F2E]/98 backdrop-blur-md border border-[#C89B7B]/50 rounded-lg overflow-hidden shadow-2xl">
                    {/* Destination Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={tour.imageUrl}
                        alt={tour.city}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2E] via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Experience Title */}
                      <p className="font-mono text-xs text-[#C89B7B] uppercase tracking-widest mb-2">
                        {tour.experienceTitle}
                      </p>

                      {/* City & Country */}
                      <h3 className="font-serif text-2xl text-[#F4F1EA] mb-1">
                        {tour.city}
                      </h3>
                      <p className="font-sans text-sm text-[#F4F1EA]/60 mb-1">
                        {tour.country}
                      </p>

                      {/* Date Range */}
                      <p className="font-mono text-xs text-[#F4F1EA]/50 uppercase mb-4">
                        {tour.dateRange}
                      </p>

                      {/* Departure Dates - Three blocks in columns */}
                      <div className="mb-4 grid grid-cols-3 gap-2">
                        {tour.departureDates.map((date, index) => {
                          const dateObj = parseScheduleDate(date);
                          const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                          const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
                          const year = dateObj.toLocaleDateString('en-US', { year: '2-digit' });

                          return (
                            <div
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                onClickTour(tour, date);
                              }}
                              className="flex flex-col items-center justify-center bg-[#F4F1EA]/5 border border-[#C89B7B]/20 rounded px-2 py-1.5 hover:bg-[#C89B7B]/10 hover:border-[#C89B7B]/40 transition-all duration-200 cursor-pointer"
                            >
                              <span className="font-mono text-xs text-[#C89B7B] uppercase">{month}</span>
                              <span className="font-mono text-lg font-bold text-[#F4F1EA]">{day}</span>
                              <span className="font-mono text-[10px] text-[#F4F1EA]/50">'{year}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClickTour(tour, tour.departureDates[0]);
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-2.5 px-4 bg-[#C89B7B] hover:bg-[#D4A574] text-white font-sans text-sm uppercase tracking-widest transition-all duration-300 rounded"
                      >
                        View Tour
                      </motion.button>

                      {groupTours.length > 1 && (
                        <p className="font-mono text-xs text-[#C89B7B] text-center mt-3">
                          {groupTours.length} experiences available
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className={`absolute ${popupPos.arrowClass} ${popupPos.arrowHorizontalClass} transform w-4 h-4 bg-[#1A1F2E] border-[#C89B7B]/50`} />
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Chef on Tour Logo/Watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-8"
        >
          <svg width="120" height="40" viewBox="0 0 120 40" className="opacity-20">
            <text
              x="0"
              y="30"
              fill="#F4F1EA"
              fontSize="12"
              fontFamily="serif"
              fontStyle="italic"
            >
              Chef on Tour
            </text>
          </svg>
        </motion.div>
      </motion.div>

      {/* Grid Toggle Button (outside zoom container, stays fixed) */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        className="absolute top-4 right-4 z-20 px-4 py-2 bg-[#1A1F2E]/80 border border-[#F4F1EA]/20 rounded text-[#F4F1EA]/70 text-xs uppercase tracking-wider hover:bg-[#C89B7B]/20 hover:border-[#C89B7B] transition-all"
      >
        {showGrid ? 'Hide Grid' : 'Show Grid'}
      </button>
    </div>
  );
}