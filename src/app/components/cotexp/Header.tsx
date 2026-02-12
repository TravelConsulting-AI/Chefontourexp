import { useState, useEffect } from 'react';
import { Menu, Search, Instagram, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide header on scroll down, show on scroll up (mobile only)
      if (window.innerWidth <= 1024) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          backgroundColor: isScrolled && window.innerWidth <= 1024 ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
        }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled && window.innerWidth <= 1024 ? 'shadow-lg' : ''
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            {/* Mobile: Menu Icon + Logo */}
            <div className="flex items-center gap-4 lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white hover:text-[#D3A695] transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-white font-['Raleway'] text-sm font-semibold tracking-wider">
                MENU
              </span>
            </div>

            {/* Desktop: Contact Info Left */}
            <div className="hidden lg:flex items-center gap-8">
              <a 
                href="tel:+13128602188" 
                className="flex items-center gap-3 text-white hover:text-[#D3A695] transition-colors group"
              >
                <svg className="w-6 h-6 fill-[#D3A695]" viewBox="0 0 24 24">
                  <path d="M0,41.177c.037-.177.067-.355.112-.53A2.726,2.726,0,0,1,.8,39.386c.643-.65,1.288-1.3,1.943-1.937a1.653,1.653,0,0,1,1.907-.47,2.561,2.561,0,0,1,.757.522c.928.9,1.839,1.828,2.753,2.747a1.861,1.861,0,0,1,.667,1.608,2.069,2.069,0,0,1-.669,1.179c-.539.541-1.082,1.077-1.622,1.617-.276.276-.281.35-.119.713a13.584,13.584,0,0,0,2.569,3.619,16.587,16.587,0,0,0,3.357,2.845c.436.274.905.494,1.359.739.208.113.362.017.507-.128q.849-.855,1.7-1.706a2.005,2.005,0,0,1,1.166-.643,1.663,1.663,0,0,1,1.246.36,3.4,3.4,0,0,1,.357.316c.9.9,1.809,1.791,2.7,2.7a2.938,2.938,0,0,1,.565.786,1.464,1.464,0,0,1-.256,1.669c-.714.789-1.46,1.554-2.241,2.276a3.212,3.212,0,0,1-2.543.714,12,12,0,0,1-4.459-1.361A23.59,23.59,0,0,1,6.4,53.3,23.229,23.229,0,0,1,.7,44.913a9.724,9.724,0,0,1-.659-2.577A.465.465,0,0,0,0,42.227v-1.05" transform="translate(-0.69 -34.679)"/>
                </svg>
                <span className="font-['Raleway'] text-sm">+1 312 860 2188</span>
              </a>

              <a 
                href="mailto:charles@chefcharleswebb.com"
                className="flex items-center gap-3 text-white hover:text-[#D3A695] transition-colors"
              >
                <svg className="w-6 h-6 fill-[#D3A695]" viewBox="0 0 24 24">
                  <path d="M0,10.391Q0,6.724,0,3.057A2.982,2.982,0,0,1,2.361.077,3.288,3.288,0,0,1,3.081,0Q9.746,0,16.412,0A3,3,0,0,1,19.5,3.1q0,4.4,0,8.809a3,3,0,0,1-3.11,3.1q-5.318,0-10.637.006a.669.669,0,0,0-.394.139c-1.3,1.072-2.6,2.155-3.892,3.233a2.564,2.564,0,0,1-.356.264.723.723,0,0,1-1.075-.454A1.5,1.5,0,0,1,0,17.818Q0,14.1,0,10.391m1.5,5.993c.094-.072.155-.115.212-.162.966-.8,1.935-1.605,2.9-2.416a1.251,1.251,0,0,1,.854-.308q5.424.009,10.849,0A1.527,1.527,0,0,0,18,11.821Q18,7.509,18,3.2a1.53,1.53,0,0,0-1.693-1.7H3.186A1.527,1.527,0,0,0,1.5,3.183q0,6.455,0,12.911Z"/>
                </svg>
                <span className="font-['Raleway'] text-sm">charles@chefcharleswebb.com</span>
              </a>
            </div>

            {/* Center: Logo (Desktop) */}
            <div className="hidden lg:block">
              <img 
                src="https://cotexp.com/wp-content/uploads/2025/08/logo-updated.webp" 
                alt="Chef On Tour" 
                className="h-16 w-auto"
              />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Search Icon (Desktop) */}
              <button className="hidden lg:block text-white hover:text-[#D3A695] transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/chefcharleswebb/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#D3A695] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>

              {/* Contact Button */}
              <a 
                href="https://form.typeform.com/to/AgOrJAAK"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#272D40] text-white border border-white px-6 py-2 rounded-sm hover:bg-[#D3A695] hover:border-[#D3A695] transition-all font-['Raleway'] text-sm font-semibold tracking-wide"
              >
                CONTACT US
              </a>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#272D40] z-[70] overflow-y-auto"
            >
              <div className="p-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-6 right-6 text-white hover:text-[#D3A695]"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="mt-16 space-y-8">
                  <nav className="space-y-4">
                    <a href="#" className="block text-white hover:text-[#D3A695] text-lg font-['Raleway'] transition-colors">
                      Home
                    </a>
                    <a href="#about" className="block text-white hover:text-[#D3A695] text-lg font-['Raleway'] transition-colors">
                      About
                    </a>
                    <a href="#destinations" className="block text-white hover:text-[#D3A695] text-lg font-['Raleway'] transition-colors">
                      Travel & Tours
                    </a>
                    <a href="#team" className="block text-white hover:text-[#D3A695] text-lg font-['Raleway'] transition-colors">
                      Team
                    </a>
                    <a href="#contact" className="block text-white hover:text-[#D3A695] text-lg font-['Raleway'] transition-colors">
                      Contact
                    </a>
                  </nav>

                  <div className="pt-8 border-t border-white/20 space-y-4">
                    <a href="tel:+13128602188" className="block text-white hover:text-[#D3A695] text-sm">
                      +1 312 860 2188
                    </a>
                    <a href="mailto:charles@chefcharleswebb.com" className="block text-white hover:text-[#D3A695] text-sm break-all">
                      charles@chefcharleswebb.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
