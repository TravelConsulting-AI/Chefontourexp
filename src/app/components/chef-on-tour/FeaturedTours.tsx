import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Calendar, Users, Clock } from 'lucide-react';

const tours = [
  {
    id: 1,
    title: 'Tuscan Wine & Culinary Adventure',
    location: 'Tuscany, Italy',
    image: 'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=800&h=600&fit=crop',
    duration: '7 Days',
    groupSize: '12 guests',
    date: 'May 15-22, 2024',
    price: '$4,500',
    highlights: [
      'Private vineyard tours & tastings',
      'Truffle hunting experience',
      'Cooking class with Nonna',
      'Farm-to-table dining'
    ]
  },
  {
    id: 2,
    title: 'Tokyo Culinary Immersion',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop',
    duration: '6 Days',
    groupSize: '10 guests',
    date: 'September 8-14, 2024',
    price: '$5,200',
    highlights: [
      'Tsukiji fish market tour',
      'Sushi-making masterclass',
      'Michelin-starred dining',
      'Traditional tea ceremony'
    ]
  },
  {
    id: 3,
    title: 'Parisian Gastronomic Journey',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
    duration: '5 Days',
    groupSize: '8 guests',
    date: 'October 3-8, 2024',
    price: '$6,800',
    highlights: [
      'Behind-the-scenes bistro tours',
      'Pastry workshop at renowned école',
      'Private champagne tasting',
      'Exclusive restaurant access'
    ]
  }
];

export function FeaturedTours() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="bg-[#F8F6F3] px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl">Upcoming Tours</h2>
          <p className="text-xl text-gray-600">
            Limited spots available for 2024
          </p>
        </motion.div>

        <div className="space-y-8">
          {tours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="grid md:grid-cols-5">
                {/* Image */}
                <div className="relative h-64 md:col-span-2 md:h-auto">
                  <ImageWithFallback
                    src={tour.image}
                    alt={tour.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-[#D4A574] px-4 py-2">
                    <span className="font-semibold text-white">{tour.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:col-span-3">
                  <div className="mb-2 text-sm text-[#D4A574]">{tour.location}</div>
                  <h3 className="mb-4 text-3xl">{tour.title}</h3>

                  {/* Tour Details */}
                  <div className="mb-6 flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{tour.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{tour.groupSize}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <h4 className="mb-3 font-semibold">Tour Highlights</h4>
                    <ul className="space-y-2">
                      {tour.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4A574]" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-wrap gap-4">
                    <motion.button
                      className="rounded-full bg-[#D4A574] px-8 py-3 text-white transition-all hover:bg-[#C19563]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reserve Your Spot
                    </motion.button>
                    <motion.button
                      className="rounded-full border-2 border-gray-300 bg-transparent px-8 py-3 text-gray-700 transition-all hover:border-gray-400"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Learn More
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.button
            className="rounded-full border-2 border-[#D4A574] bg-transparent px-12 py-4 text-[#D4A574] transition-all hover:bg-[#D4A574] hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Tours
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
