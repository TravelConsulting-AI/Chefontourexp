import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import charlesImage from '@/assets/c8308d698e3100590c205f625ef741d539cd39a4.png';
import gonzaloImage from '@/assets/728aae2db10e37ca37c9e76d10a272628c13d02a.png';
import anjalinaImage from '@/assets/3d55aabb3864e1a1a9780149b007b83078a1901f.png';
import andresImage from '@/assets/f72815489061f23d5edf1fa46d3453cda9de0a7e.png';

export function TeamGridSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const team = [
    {
      name: 'Charles Webb',
      role: 'Founder & Curator',
      image: charlesImage
    },
    {
      name: 'Gonzalo Gil Lavedra',
      role: 'Global Experience Curator',
      image: gonzaloImage
    },
    {
      name: 'Anjalina Chugani',
      role: 'Global Experience Curator',
      image: anjalinaImage
    },
    {
      name: 'Andre\'s Hoyos',
      role: 'Global Experience Curator',
      image: andresImage
    }
  ];

  return (
    <section ref={ref} className="bg-white px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 className="mb-3 sm:mb-4 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-[#1a1a1a]">
            Dedicated Team
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-base sm:text-lg text-gray-700 px-4">
            Meet the passionate team behind Chef on Tour
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="relative mb-3 sm:mb-4 aspect-[3/4] overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              
              <div>
                <h3 className="mb-1 font-serif text-lg sm:text-xl lg:text-2xl text-[#1a1a1a]">
                  {member.name}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-gray-600">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Meet the Team CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <Link to="/team">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-[#1a1a1a] px-6 sm:px-8 py-2.5 sm:py-3 font-sans text-xs sm:text-sm uppercase tracking-wider text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-white"
            >
              Meet the Team
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}