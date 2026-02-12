import { motion } from 'motion/react';
import { useInView } from '../hooks/useInView';
import { Search, Calendar, Plane, Camera } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Search,
    title: 'Choose Your Destination',
    description: 'Browse our curated collection of culinary tours across the globe. Each destination offers unique flavors and cultural experiences.'
  },
  {
    id: 2,
    icon: Calendar,
    title: 'Book Your Tour',
    description: 'Select your preferred dates and secure your spot. Our intimate group sizes ensure personalized attention throughout your journey.'
  },
  {
    id: 3,
    icon: Plane,
    title: 'Prepare for Adventure',
    description: "Receive your detailed itinerary and travel guide. We'll handle all culinary reservations and special access arrangements."
  },
  {
    id: 4,
    icon: Camera,
    title: 'Experience & Savor',
    description: 'Immerse yourself in local food culture, meet artisan producers, and create unforgettable memories with Chef Webb as your guide.'
  }
];

export function HowItWorks() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl">How It Works</h2>
          <p className="text-xl text-gray-600">
            Your culinary journey in four simple steps
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[60%] top-16 hidden h-0.5 w-[80%] bg-gradient-to-r from-[#D4A574] to-transparent lg:block" />
                )}

                {/* Step Number & Icon */}
                <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
                  {/* Background Circle */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#F8F6F3]"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Step Number */}
                  <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#D4A574] text-white">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <Icon className="relative z-10 h-12 w-12 text-[#D4A574]" />
                </div>

                <h3 className="mb-4 text-2xl">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.button
            className="rounded-full bg-[#D4A574] px-12 py-4 text-white transition-all hover:bg-[#C19563]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
