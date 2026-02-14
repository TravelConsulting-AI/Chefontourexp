import { motion } from 'motion/react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ChefFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] px-4 py-12 sm:py-14 md:py-16 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid gap-8 sm:gap-10 md:gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <div>
            <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-serif">Chef On Tour</h3>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-400">
              Curated culinary experiences around the world, led by renowned Chef Charles Webb.
              Discover authentic flavors and create unforgettable memories.
            </p>
            {/* Social icons hidden for now */}
            {/* <div className="flex gap-3 sm:gap-4">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Youtube, href: '#' }
              ].map(({ Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  className="rounded-full bg-white/10 p-2 sm:p-2.5 transition-colors hover:bg-[#D4A574]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.a>
              ))}
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 sm:mb-6 font-semibold text-base sm:text-lg">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm sm:text-base text-gray-400 transition-colors hover:text-[#D4A574]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/experiences"
                  className="text-sm sm:text-base text-gray-400 transition-colors hover:text-[#D4A574]"
                >
                  All Experiences
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations"
                  className="text-sm sm:text-base text-gray-400 transition-colors hover:text-[#D4A574]"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-sm sm:text-base text-gray-400 transition-colors hover:text-[#D4A574]"
                >
                  Team
                </Link>
              </li>
              <li>
                <a
                  href="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-gray-400 transition-colors hover:text-[#D4A574]"
                >
                  Team Login
                </a>
              </li>
              <li>
                <a
                  href="/#contact"
                  className="text-sm sm:text-base text-gray-400 transition-colors hover:text-[#D4A574]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Curated Experiences */}
          <div>
            <h4 className="mb-4 sm:mb-6 font-semibold text-base sm:text-lg">Curated Experiences</h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { name: 'Medellín', subtitle: 'Beneath the Valley', link: '/experiences/medellin' },
                { name: 'Buenos Aires', subtitle: 'Beneath the Furia', link: '/experiences/buenos-aires' },
                { name: 'Rio de Janeiro', subtitle: 'Beneath the Hustle', link: '/experiences/rio' },
                { name: 'Palermo', subtitle: 'Beneath the Sunhine', link: '/experiences/palermo' },
                { name: 'Málaga', subtitle: 'Beneath the Onda', link: '/experiences/malaga' },
                { name: 'Istanbul', subtitle: 'Beneath the Bridge', link: '/experiences/istanbul' },
                { name: 'Beirut', subtitle: 'Beneath the Cedars', link: '/experiences/beirut' }
              ].map((destination, index) => (
                <li key={index}>
                  <a
                    href={destination.link}
                    className="block text-gray-400 transition-colors hover:text-[#D4A574] group"
                  >
                    <div className="text-sm sm:text-base font-medium group-hover:text-[#D4A574]">
                      {destination.name}
                    </div>
                    <div className="text-xs italic text-gray-500 group-hover:text-[#C89B7B]">
                      {destination.subtitle}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 sm:mb-6 font-semibold text-base sm:text-lg">Contact Info</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-[#D4A574] mt-0.5" />
                <div>
                  <a
                    href="mailto:charles@chefcharleswebb.com"
                    className="text-sm sm:text-base text-gray-400 transition-colors hover:text-[#D4A574] break-all"
                  >
                    charles@chefcharleswebb.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-[#D4A574] mt-0.5" />
                <div>
                  <a
                    href="tel:+1-312-860-2188"
                    className="text-sm sm:text-base text-gray-400 transition-colors hover:text-[#D4A574]"
                  >
                    +1 (312) 860-2188
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 sm:my-10 md:my-12 h-px bg-white/10" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 md:flex-row">
          <div className="text-center md:text-left">
            © {currentYear} Chef On Tour. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
            <a href="#" className="transition-colors hover:text-[#D4A574]">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-[#D4A574]">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-[#D4A574]">
              Cookie Policy
            </a>
            <a href="#" className="transition-colors hover:text-[#D4A574]">
              Cancellation Policy
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-xs text-gray-500">
          {/* Secure Payments and ASTA Member hidden for now */}
          {/* <div className="flex items-center gap-2">
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-white/10" />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-white/10" />
            <span>ASTA Member</span>
          </div> */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-white/10" />
            <span>Travel Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}