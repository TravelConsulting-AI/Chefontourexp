import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/63a59453823c55a03703a64e2bd861fe4dd295a2.png';
import { BookingModal } from './BookingModal';

export function ChefHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExperiencesOpen, setIsExperiencesOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll({
    layoutEffect: false
  });
  
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(26, 26, 26, 0.4)', 'rgba(26, 26, 26, 0.95)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Team', href: '/team' }
  ];

  return (
    <motion.header
      ref={headerRef}
      style={{ backgroundColor: headerBg }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg backdrop-blur-lg border-b border-white/10' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-3 sm:py-4 md:py-4">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="block">
              <img 
                src={logo} 
                alt="Chef On Tour - Experiences with Charles Webb" 
                className="h-[65px] sm:h-[73px] md:h-[81px] w-auto"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative text-white transition-colors hover:text-[#D4A574]"
                >
                  {link.name}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#D4A574]"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative text-white transition-colors hover:text-[#D4A574]"
                >
                  {link.name}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#D4A574]"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </a>
              )
            ))}
            
            {/* Experiences Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsExperiencesOpen(true)}
              onMouseLeave={() => setIsExperiencesOpen(false)}
            >
              <button className="relative flex items-center gap-1 text-white transition-colors hover:text-[#D4A574]">
                Experiences
                <ChevronDown className={`h-4 w-4 transition-transform ${isExperiencesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isExperiencesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 top-full w-64 rounded-lg bg-[#1a1a1a]/95 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden"
                >
                  <Link
                    to="/experiences"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white flex items-center gap-2">
                      View All Experiences
                      <span className="text-[#D4A574]">→</span>
                    </div>
                  </Link>
                  <Link
                    to="/tours"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Barcelona</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Surface</div>
                  </Link>
                  <Link
                    to="/medellin-tours"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Medellín</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Valley</div>
                  </Link>
                  <Link
                    to="/buenos-aires-tours"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Buenos Aires</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Furia</div>
                  </Link>
                  <Link
                    to="/rio-tours"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Rio de Janeiro</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Hustle</div>
                  </Link>
                  <Link
                    to="/palermo-tours"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Palermo</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Sunhine</div>
                  </Link>
                  <Link
                    to="/malaga-tours"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Málaga</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Onda</div>
                  </Link>
                  <Link
                    to="/istanbul-tours"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Istanbul</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Bridge</div>
                  </Link>
                  <Link
                    to="/beirut-tours"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="font-bold text-white">Beirut</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Cedars</div>
                  </Link>
                </motion.div>
              )}
            </div>
            
            {/* Phone and Email Buttons */}
            <motion.a
              href="tel:+1-312-860-2188"
              className="text-white hover:text-[#D4A574] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Phone"
            >
              <Phone className="h-5 w-5" />
            </motion.a>
            
            <motion.a
              href="mailto:charles@chefcharleswebb.com"
              className="text-white hover:text-[#D4A574] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </motion.a>
            
            <motion.button
              className="rounded-full bg-[#D4A574] px-6 py-2 text-white transition-all hover:bg-[#C19563]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsBookingModalOpen(true)}
            >
              Let's Talk!
            </motion.button>
          </nav>

          {/* Mobile Contact Icons and Menu */}
          <div className="flex items-center gap-3 lg:hidden -ml-5">
            <a 
              href="mailto:charles@chefcharleswebb.com" 
              className="text-white hover:text-[#D4A574] transition-colors"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
            <a 
              href="tel:+1-312-860-2188" 
              className="text-white hover:text-[#D4A574] transition-colors"
              aria-label="Phone"
            >
              <Phone className="h-6 w-6" />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden lg:hidden bg-[rgba(0,0,0,0.85)] backdrop-blur-xl"
        >
          <div className="space-y-4 pb-6 pt-4 px-2">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white transition-colors hover:text-[#D4A574]"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white transition-colors hover:text-[#D4A574]"
                >
                  {link.name}
                </a>
              )
            ))}
            
            {/* Experiences Mobile */}
            <div>
              <button
                onClick={() => setIsExperiencesOpen(!isExperiencesOpen)}
                className="flex items-center gap-1 text-white transition-colors hover:text-[#D4A574]"
              >
                Experiences
                <ChevronDown className={`h-4 w-4 transition-transform ${isExperiencesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isExperiencesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="ml-4 mt-2"
                >
                  <Link
                    to="/experiences"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 border-b border-white/10 pb-3 mb-2"
                  >
                    <div className="font-bold text-white flex items-center gap-2">
                      View All Experiences
                      <span className="text-[#D4A574]">→</span>
                    </div>
                  </Link>
                  <Link
                    to="/tours"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Barcelona</div>
                    <div className="text-sm text-white/70">Beneath the Surface</div>
                  </Link>
                  <Link
                    to="/medellin-tours"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Medellín</div>
                    <div className="text-sm text-white/70">Beneath the Valley</div>
                  </Link>
                  <Link
                    to="/buenos-aires-tours"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Buenos Aires</div>
                    <div className="text-sm text-white/70">Beneath the Furia</div>
                  </Link>
                  <Link
                    to="/rio-tours"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Rio de Janeiro</div>
                    <div className="text-sm text-white/70">Beneath the Hustle</div>
                  </Link>
                  <Link
                    to="/palermo-tours"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Palermo</div>
                    <div className="text-sm text-white/70">Beneath the Sunhine</div>
                  </Link>
                  <Link
                    to="/malaga-tours"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Málaga</div>
                    <div className="text-sm text-white/70">Beneath the Onda</div>
                  </Link>
                  <Link
                    to="/istanbul-tours"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Istanbul</div>
                    <div className="text-sm text-white/70">Beneath the Bridge</div>
                  </Link>
                  <Link
                    to="/beirut-tours"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Beirut</div>
                    <div className="text-sm text-white/70">Beneath the Cedars</div>
                  </Link>
                </motion.div>
              )}
            </div>
            
            <button className="w-full rounded-full bg-[#D4A574] px-6 py-2 text-white transition-all hover:bg-[#C19563]" onClick={() => setIsBookingModalOpen(true)}>
              Let's Talk!
            </button>
          </div>
        </motion.nav>
      </div>
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </motion.header>
  );
}