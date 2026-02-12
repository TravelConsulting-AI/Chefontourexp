import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function WhatIDoSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const experiences = [
    {
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZ3xlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Private Culinary Experiences',
      description: 'Exclusive access to renowned kitchens and intimate cooking sessions'
    },
    {
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXQlMjBmb29kfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Market Tours',
      description: 'Guided exploration of local markets with expert insights'
    },
    {
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwdGFzdGluZ3xlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Wine & Spirits',
      description: 'Curated tastings with sommeliers and distillers'
    },
    {
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGluaW5nfGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Restaurant Reservations',
      description: 'Access to the world\'s most sought-after tables'
    },
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGV4cGVyaWVuY2V8ZW58MXx8fHwxNzY3OTkyNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Cultural Immersion',
      description: 'Deep dives into local traditions and heritage'
    }
  ];

  return (
    <section ref={ref} className="relative bg-[#F4F1EA] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 className="mb-4 sm:mb-6 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-[#1a1a1a]">
            What I do
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-base sm:text-lg text-gray-700 px-4">
            Each journey is thoughtfully crafted to immerse you in the authentic flavors and culture of our destinations.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24
              }
            }}
            className="pb-12"
          >
            {experiences.map((experience, index) => (
              <SwiperSlide key={index}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                    <ImageWithFallback
                      src={experience.image}
                      alt={experience.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="mb-2 font-serif text-xl text-[#1a1a1a] group-hover:text-[#D4A574] transition-colors">
                    {experience.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-600">
                    {experience.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}