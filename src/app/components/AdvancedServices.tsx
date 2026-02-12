import { memo } from "react";
import { Check, Shield, Truck, Award, Globe } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedSection } from "./AnimatedSection";

const services = [
  {
    icon: Globe,
    title: "Global Sourcing",
    description: "We source the finest cotton from premium growing regions across the globe, ensuring consistent quality and supply.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Rigorous quality control at every stage, with international certifications and compliance standards.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Truck,
    title: "Logistics & Export",
    description: "Seamless logistics management and timely delivery to any destination worldwide with full documentation support.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Shield,
    title: "Sustainability",
    description: "Committed to sustainable and ethical practices, supporting farmers and protecting the environment.",
    color: "from-orange-500 to-orange-600",
  },
];

const reasons = [
  "ISO 9001:2015 Certified",
  "State-of-the-art facilities",
  "Competitive pricing",
  "Experienced team",
  "Custom solutions",
  "24/7 customer support",
];

export const AdvancedServices = memo(function AdvancedServices() {
  return (
    <section id="services" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Grid */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-gray-900">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive cotton export solutions tailored to your business needs
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <AnimatedSection
              key={index}
              delay={index * 0.1}
              direction="up"
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm h-full relative overflow-hidden group"
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <motion.div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${service.color} text-white flex items-center justify-center mb-4 relative z-10`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <service.icon size={28} />
                </motion.div>

                <h3 className="text-xl mb-3 text-gray-900 relative z-10">
                  {service.title}
                </h3>
                <p className="text-gray-600 relative z-10">
                  {service.description}
                </p>

                {/* Decorative corner */}
                <motion.div
                  className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${service.color} rounded-full blur-2xl opacity-0 group-hover:opacity-20`}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Why Choose Us */}
        <AnimatedSection>
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background patterns */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
                y: [0, -30, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -30, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl mb-4">
                  Why Choose COTEXP?
                </h2>
                <p className="text-blue-100 mb-6">
                  We combine decades of industry expertise with modern technology and 
                  sustainable practices to deliver unmatched value to our clients.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                {reasons.map((reason, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      <Check className="flex-shrink-0 mt-0.5" size={20} />
                    </motion.div>
                    <span>{reason}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
});
