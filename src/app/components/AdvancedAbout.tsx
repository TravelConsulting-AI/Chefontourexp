import { memo } from "react";
import { Award, Globe, Users } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedSection } from "./AnimatedSection";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const stats = [
  { icon: Globe, value: 50, label: "Countries Served", suffix: "+" },
  { icon: Award, value: 25, label: "Years Experience", suffix: "+" },
  { icon: Users, value: 500, label: "Happy Clients", suffix: "+" },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5, freezeOnceVisible: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const springCount = useSpring(count, { damping: 50, stiffness: 100 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      onAnimationComplete={() => {
        if (isVisible) {
          springCount.set(value);
        }
      }}
    >
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.div>
  );
}

export const AdvancedAbout = memo(function AdvancedAbout() {
  return (
    <section id="about" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image with Parallax Effect */}
          <AnimatedSection direction="left">
            <motion.div
              className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1761069183877-fe29a212e5eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBmaWVsZCUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc2NjAxMDM2OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Cotton field"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection direction="right">
            <div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl mb-6 text-gray-900">
                  About COTEXP
                </h2>
              </motion.div>

              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                With over 25 years of excellence in the cotton export industry, COTEXP has 
                established itself as a global leader in premium cotton products. We specialize 
                in sourcing, processing, and exporting the finest quality cotton to markets 
                worldwide.
              </motion.p>

              <motion.p
                className="text-gray-600 mb-8"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Our commitment to quality, sustainability, and customer satisfaction has earned 
                us the trust of clients across 50+ countries. From raw cotton to finished textiles, 
                we deliver excellence at every stage of the supply chain.
              </motion.p>

              {/* Animated Stats */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon size={24} />
                    </motion.div>
                    <div className="text-2xl text-gray-900 mb-1">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});
