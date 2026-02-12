import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Quote } from 'lucide-react';

export function TestimonialsGridSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const testimonials = [
    {
      quote: "An unforgettable journey through Barcelona's hidden culinary gems. Charles has an incredible eye for authentic experiences.",
      author: "Michael R.",
      location: "New York",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=400"
    },
    {
      quote: "The Medellín experience changed how I think about food and culture. Every moment was thoughtfully curated.",
      author: "Jennifer L.",
      location: "Los Angeles",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=400"
    },
    {
      quote: "From fire-cooked asados to intimate wine tastings, Buenos Aires exceeded every expectation. Charles is a true culinary guide.",
      author: "David K.",
      location: "Chicago",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3Njc5OTI2NzR8MA&ixlib=rb-4.1.0&q=80&w=400"
    },
    {
      quote: "This isn't just a food tour—it's a complete cultural immersion. The connections we made were as meaningful as the meals.",
      author: "Emma S.",
      location: "London",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc2Nzk5MjY3NHww&ixlib=rb-4.1.0&q=80&w=400"
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
          <h2 className="mb-3 sm:mb-4 font-serif text-3xl sm:text-4xl md:text-5xl italic text-[#1a1a1a]">
            What Our Guests Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative mb-3 sm:mb-4 aspect-[3/4] overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-[#D4A574]" />
                <p className="font-sans text-xs sm:text-sm leading-relaxed text-gray-700 italic">
                  "{testimonial.quote}"
                </p>
                <div className="pt-1 sm:pt-2">
                  <p className="font-serif text-sm sm:text-base text-[#1a1a1a]">
                    {testimonial.author}
                  </p>
                  <p className="font-sans text-xs text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}