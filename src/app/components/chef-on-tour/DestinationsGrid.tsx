import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MapPin } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: 'Tuscany, Italy',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=800&fit=crop',
    tours: 4,
    description: 'Wine country & truffle hunting'
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=800&fit=crop',
    tours: 3,
    description: 'Sushi masters & ramen culture'
  },
  {
    id: 3,
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=800&fit=crop',
    tours: 5,
    description: 'Bistros & patisseries'
  },
  {
    id: 4,
    name: 'Bangkok, Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=800&fit=crop',
    tours: 3,
    description: 'Street food & royal cuisine'
  },
  {
    id: 5,
    name: 'Barcelona, Spain',
    image: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=600&h=800&fit=crop',
    tours: 4,
    description: 'Tapas & Catalan specialties'
  },
  {
    id: 6,
    name: 'Marrakech, Morocco',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=800&fit=crop',
    tours: 2,
    description: 'Spice markets & tagines'
  }
];

export function DestinationsGrid() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl">Featured Destinations</h2>
          <p className="text-xl text-gray-600">
            Explore the world's most vibrant food cultures
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-[400px] cursor-pointer overflow-hidden rounded-lg"
            >
              <ImageWithFallback
                src={destination.image}
                alt={destination.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm text-gray-300">{destination.tours} tours available</span>
                </div>
                <h3 className="mb-2 text-3xl">{destination.name}</h3>
                <p className="text-sm text-gray-300">{destination.description}</p>
                
                {/* Hover Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="mt-4 hidden rounded-full bg-[#D4A574] px-6 py-2 text-sm transition-all group-hover:block"
                >
                  View Tours
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
