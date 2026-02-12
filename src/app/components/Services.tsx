import { Check, Shield, Truck, Award, Globe } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Globe,
      title: "Global Sourcing",
      description: "We source the finest cotton from premium growing regions across the globe, ensuring consistent quality and supply.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Rigorous quality control at every stage, with international certifications and compliance standards.",
    },
    {
      icon: Truck,
      title: "Logistics & Export",
      description: "Seamless logistics management and timely delivery to any destination worldwide with full documentation support.",
    },
    {
      icon: Shield,
      title: "Sustainability",
      description: "Committed to sustainable and ethical practices, supporting farmers and protecting the environment.",
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

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Grid */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-gray-900">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive cotton export solutions tailored to your business needs
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <service.icon size={28} />
              </div>
              <h3 className="text-xl mb-3 text-gray-900">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl mb-4">
                Why Choose COTEXP?
              </h2>
              <p className="text-blue-100 mb-6">
                We combine decades of industry expertise with modern technology and 
                sustainable practices to deliver unmatched value to our clients.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="flex-shrink-0 mt-0.5" size={20} />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
