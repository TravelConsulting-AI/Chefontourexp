import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Products() {
  const products = [
    {
      title: "Raw Cotton",
      description: "Premium quality raw cotton, carefully selected and graded for textile manufacturing.",
      image: "https://images.unsplash.com/photo-1761069183877-fe29a212e5eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBmaWVsZCUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc2NjAxMDM2OHww&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["High fiber strength", "Consistent quality", "Multiple grades available"]
    },
    {
      title: "Cotton Yarn",
      description: "Superior cotton yarn in various counts and specifications for diverse applications.",
      image: "https://images.unsplash.com/photo-1758269445774-61a540a290a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwaW5kdXN0cnklMjBtb2Rlcm58ZW58MXx8fHwxNzY2MDEwMzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Various counts", "Color-fast", "Eco-friendly processing"]
    },
    {
      title: "Cotton Fabric",
      description: "High-quality cotton fabrics suitable for garments, home textiles, and industrial use.",
      image: "https://images.unsplash.com/photo-1760818072388-4604d5cb39ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjB0ZXh0aWxlJTIwZmFjdG9yeXxlbnwxfHx8fDE3NjU5OTc3MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Multiple weaves", "Durable finish", "Custom specifications"]
    },
    {
      title: "Organic Cotton",
      description: "Certified organic cotton products for environmentally conscious manufacturers.",
      image: "https://images.unsplash.com/photo-1566596825056-e80d32d481d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBwcm9kdWN0aW9uJTIwd2FyZWhvdXNlfGVufDF8fHx8MTc2NjAxMDM2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["GOTS certified", "Sustainable farming", "Chemical-free"]
    },
  ];

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-gray-900">
            Our Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of cotton products to meet diverse industry needs, 
            all maintaining the highest quality standards.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
