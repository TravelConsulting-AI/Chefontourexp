import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    location: 'San Francisco, CA',
    tour: 'Tuscan Wine & Culinary Adventure',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    rating: 5,
    text: "This was truly the trip of a lifetime. Chef Webb's connections opened doors we never could have accessed on our own. From the private vineyard tours to the intimate cooking class with a local grandmother, every moment was magical. The food was extraordinary, but it was the stories and relationships that made this experience unforgettable."
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'New York, NY',
    tour: 'Tokyo Culinary Immersion',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    rating: 5,
    text: "As a foodie who's traveled extensively, I can say this was the most authentic culinary experience I've ever had. Chef Webb's expertise and passion for Japanese cuisine shone through every day. The sushi masterclass alone was worth the trip, but the hidden izakayas and family-run restaurants we visited were the real treasures."
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    location: 'Austin, TX',
    tour: 'Parisian Gastronomic Journey',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    rating: 5,
    text: "Absolutely phenomenal! The attention to detail, from the perfectly curated restaurants to the hands-on pastry workshop, exceeded all expectations. Chef Webb is not only incredibly knowledgeable but also a wonderful storyteller who brought Parisian food culture to life. I've already booked my next tour!"
  },
  {
    id: 4,
    name: 'James Wilson',
    location: 'London, UK',
    tour: 'Bangkok Street Food & Royal Cuisine',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    rating: 5,
    text: "An incredible journey through Thailand's diverse culinary landscape. The contrast between the bustling street food markets and the refined royal Thai cuisine was fascinating. Chef Webb's insights and connections made this so much more than a typical food tour - it was a true cultural immersion."
  }
];

export function Testimonials() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section ref={ref} className="bg-[#F8F6F3] px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl">What Our Travelers Say</h2>
          <p className="text-xl text-gray-600">
            Real experiences from our culinary adventurers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Main Testimonial Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-12 shadow-xl">
            {/* Quote Icon */}
            <Quote className="absolute right-8 top-8 h-20 w-20 text-[#D4A574] opacity-10" />

            {/* Content */}
            <div className="relative">
              {/* Rating */}
              <div className="mb-6 flex justify-center gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#D4A574] text-[#D4A574]" />
                ))}
              </div>

              {/* Testimonial Text */}
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center text-lg leading-relaxed text-gray-700"
              >
                "{current.text}"
              </motion.p>

              {/* Author Info */}
              <motion.div
                key={`author-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="mb-4 h-16 w-16 overflow-hidden rounded-full">
                  <ImageWithFallback
                    src={current.image}
                    alt={current.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="font-semibold">{current.name}</div>
                <div className="text-sm text-gray-600">{current.location}</div>
                <div className="mt-2 text-sm italic text-[#D4A574]">
                  {current.tour}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-between">
            <motion.button
              onClick={prevTestimonial}
              className="-ml-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-[#D4A574] hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            <motion.button
              onClick={nextTestimonial}
              className="-mr-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-[#D4A574] hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Pagination Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-[#D4A574]'
                    : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="mb-2 text-4xl text-[#D4A574]">98%</div>
            <div className="text-sm text-gray-600">5-Star Reviews</div>
          </div>
          <div>
            <div className="mb-2 text-4xl text-[#D4A574]">95%</div>
            <div className="text-sm text-gray-600">Repeat Travelers</div>
          </div>
          <div>
            <div className="mb-2 text-4xl text-[#D4A574]">2000+</div>
            <div className="text-sm text-gray-600">Happy Guests</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
