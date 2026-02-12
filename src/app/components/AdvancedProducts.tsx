import { memo, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedSection } from "./AnimatedSection";
import { Badge } from "./ui/badge";

const products = [
  {
    title: "Raw Cotton",
    description: "Premium quality raw cotton, carefully selected and graded for textile manufacturing.",
    image: "https://images.unsplash.com/photo-1761069183877-fe29a212e5eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBmaWVsZCUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc2NjAxMDM2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["High fiber strength", "Consistent quality", "Multiple grades available"],
    category: "raw"
  },
  {
    title: "Cotton Yarn",
    description: "Superior cotton yarn in various counts and specifications for diverse applications.",
    image: "https://images.unsplash.com/photo-1758269445774-61a540a290a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwaW5kdXN0cnklMjBtb2Rlcm58ZW58MXx8fHwxNzY2MDEwMzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["Various counts", "Color-fast", "Eco-friendly processing"],
    category: "processed"
  },
  {
    title: "Cotton Fabric",
    description: "High-quality cotton fabrics suitable for garments, home textiles, and industrial use.",
    image: "https://images.unsplash.com/photo-1760818072388-4604d5cb39ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjB0ZXh0aWxlJTIwZmFjdG9yeXxlbnwxfHx8fDE3NjU5OTc3MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["Multiple weaves", "Durable finish", "Custom specifications"],
    category: "processed"
  },
  {
    title: "Organic Cotton",
    description: "Certified organic cotton products for environmentally conscious manufacturers.",
    image: "https://images.unsplash.com/photo-1566596825056-e80d32d481d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBwcm9kdWN0aW9uJTIwd2FyZWhvdXNlfGVufDF8fHx8MTc2NjAxMDM2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["GOTS certified", "Sustainable farming", "Chemical-free"],
    category: "organic"
  },
];

const categories = [
  { id: "all", label: "All Products" },
  { id: "raw", label: "Raw Cotton" },
  { id: "processed", label: "Processed" },
  { id: "organic", label: "Organic" },
];

export const AdvancedProducts = memo(function AdvancedProducts() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(product => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="products" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-gray-900">
            Our Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            We offer a comprehensive range of cotton products to meet diverse industry needs, 
            all maintaining the highest quality standards.
          </p>

          {/* Category Filter with Animation */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <motion.div key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 transition-all ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-50"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        {/* Products Grid with AnimatePresence */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.title}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <motion.div
                      animate={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full"
                    >
                      <ImageWithFallback
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Overlay on hover */}
                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <motion.div
                          className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.div
                            className="text-white text-sm font-semibold px-4 py-2 rounded-full bg-blue-600"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                          >
                            View Details
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center text-sm text-gray-600"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"
                            whileHover={{ scale: 1.5 }}
                          />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Show message when no products match */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500">No products found in this category.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
});
