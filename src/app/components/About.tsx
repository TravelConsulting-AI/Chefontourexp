import { Award, Globe, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  const stats = [
    { icon: Globe, value: "50+", label: "Countries Served" },
    { icon: Award, value: "25+", label: "Years Experience" },
    { icon: Users, value: "500+", label: "Happy Clients" },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1761069183877-fe29a212e5eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBmaWVsZCUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc2NjAxMDM2OHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Cotton field"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl mb-6 text-gray-900">
              About COTEXP
            </h2>
            <p className="text-gray-600 mb-6">
              With over 25 years of excellence in the cotton export industry, COTEXP has 
              established itself as a global leader in premium cotton products. We specialize 
              in sourcing, processing, and exporting the finest quality cotton to markets 
              worldwide.
            </p>
            <p className="text-gray-600 mb-8">
              Our commitment to quality, sustainability, and customer satisfaction has earned 
              us the trust of clients across 50+ countries. From raw cotton to finished textiles, 
              we deliver excellence at every stage of the supply chain.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
                    <stat.icon size={24} />
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
