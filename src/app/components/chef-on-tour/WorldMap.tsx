import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { useState } from 'react';

const mapMarkers = [
  { id: 1, name: 'Paris', left: '49%', top: '23%', tours: 5 },
  { id: 2, name: 'Barcelona', left: '48.5%', top: '29%', tours: 4 },
  { id: 3, name: 'Tuscany', left: '51%', top: '28%', tours: 4 },
  { id: 4, name: 'Marrakech', left: '47.5%', top: '36%', tours: 2 },
  { id: 5, name: 'Tokyo', left: '82%', top: '32%', tours: 3 },
  { id: 6, name: 'Bangkok', left: '74%', top: '42%', tours: 3 },
  { id: 7, name: 'Peru', left: '24%', top: '58%', tours: 2 },
  { id: 8, name: 'Argentina', left: '28%', top: '72%', tours: 2 }
];

export function WorldMap() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);

  return (
    <section ref={ref} className="bg-[#1a1a1a] px-4 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl">Explore Our Destinations</h2>
          <p className="text-xl text-gray-400">
            Select a location to discover available tours
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mx-auto max-w-5xl"
        >
          {/* World Map SVG - Simplified representation */}
          <div className="relative aspect-[2/1] w-full rounded-lg bg-[#2a2a2a] p-8">
            <svg
              viewBox="0 0 1000 500"
              className="h-full w-full opacity-30"
              fill="none"
              stroke="#D4A574"
              strokeWidth="0.5"
            >
              {/* Simplified world map paths */}
              <path d="M 50 250 Q 200 200 350 250 T 650 250 Q 800 280 950 250" />
              <path d="M 100 180 Q 250 150 400 180 T 700 180" />
              <path d="M 150 320 Q 300 350 450 320 T 750 320" />
              <ellipse cx="500" cy="250" rx="400" ry="180" />
            </svg>

            {/* Interactive Markers */}
            {mapMarkers.map((marker, index) => (
              <motion.div
                key={marker.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="absolute"
                style={{ left: marker.left, top: marker.top }}
                onMouseEnter={() => setHoveredMarker(marker.id)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                {/* Marker Pin */}
                <motion.div
                  className="relative cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                >
                  {/* Pulsing circle */}
                  <motion.div
                    className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#D4A574]"
                    animate={{
                      scale: hoveredMarker === marker.id ? [1, 1.5, 1] : 1,
                      opacity: hoveredMarker === marker.id ? [0.8, 0.3, 0.8] : 0.5
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Center dot */}
                  <div className="h-3 w-3 -translate-x-1.5 -translate-y-1.5 rounded-full bg-[#D4A574] ring-2 ring-white" />

                  {/* Tooltip */}
                  {hoveredMarker === marker.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-16 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm text-gray-900 shadow-lg"
                    >
                      <div className="font-semibold">{marker.name}</div>
                      <div className="text-xs text-gray-600">
                        {marker.tours} tours available
                      </div>
                      {/* Arrow */}
                      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white" />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {[
            { number: '27', label: 'Countries' },
            { number: '150+', label: 'Tours' },
            { number: '2000+', label: 'Happy Travelers' },
            { number: '15', label: 'Years Experience' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl text-[#D4A574]">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
