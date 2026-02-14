import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, Mail, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/63a59453823c55a03703a64e2bd861fe4dd295a2.png';
import { BookingModal } from './BookingModal';
import { useAuth, ROLE_LABELS } from '@/app/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export function ChefHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExperiencesOpen, setIsExperiencesOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const { user, profile, role, roleLabel, signOut } = useAuth();

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

  // Avatar initials
  const initials = profile
    ? `${(profile.first_name?.[0] ?? '').toUpperCase()}${(profile.last_name?.[0] ?? '').toUpperCase()}`
    : '';

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      ref={headerRef}
      style={{ backgroundColor: headerBg }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg backdrop-blur-lg border-b border-white/10' : ''
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
                    to="/experiences/barcelona"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Barcelona</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Surface</div>
                  </Link>
                  <Link
                    to="/experiences/medellin"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Medellín</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Valley</div>
                  </Link>
                  <Link
                    to="/experiences/buenos-aires"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Buenos Aires</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Furia</div>
                  </Link>
                  <Link
                    to="/experiences/rio"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Rio de Janeiro</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Hustle</div>
                  </Link>
                  <Link
                    to="/experiences/palermo"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Palermo</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Sunhine</div>
                  </Link>
                  <Link
                    to="/experiences/malaga"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Málaga</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Onda</div>
                  </Link>
                  <Link
                    to="/experiences/istanbul"
                    className="block px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-bold text-white">Istanbul</div>
                    <div className="text-sm text-white/70 mt-0.5">Beneath the Bridge</div>
                  </Link>
                  <Link
                    to="/experiences/beirut"
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

            {/* ── Auth: Sign In or Avatar Dropdown ── */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4A574] text-sm font-semibold text-white outline-none ring-0 transition-all hover:bg-[#C19563]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Account menu"
                  >
                    {initials}
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl border border-white/10 bg-[#1a1a1a] text-white shadow-2xl"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4A574] text-xs font-semibold text-white">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        {roleLabel && (
                          <span className="inline-block mt-0.5 rounded-full bg-[#D4A574]/15 px-2 py-px text-[10px] font-medium text-[#D4A574]">
                            {roleLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="cursor-pointer text-white/80 focus:bg-white/10 focus:text-white">
                    <Link to="/account" className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-white/60 focus:bg-white/10 focus:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="rounded-full border border-white/20 px-5 py-2 text-sm text-white transition-all hover:border-[#D4A574] hover:text-[#D4A574]"
              >
                Sign In
              </Link>
            )}
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
                    to="/experiences/barcelona"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Barcelona</div>
                    <div className="text-sm text-white/70">Beneath the Surface</div>
                  </Link>
                  <Link
                    to="/experiences/medellin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Medellín</div>
                    <div className="text-sm text-white/70">Beneath the Valley</div>
                  </Link>
                  <Link
                    to="/experiences/buenos-aires"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Buenos Aires</div>
                    <div className="text-sm text-white/70">Beneath the Furia</div>
                  </Link>
                  <Link
                    to="/experiences/rio"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Rio de Janeiro</div>
                    <div className="text-sm text-white/70">Beneath the Hustle</div>
                  </Link>
                  <Link
                    to="/experiences/palermo"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Palermo</div>
                    <div className="text-sm text-white/70">Beneath the Sunhine</div>
                  </Link>
                  <Link
                    to="/experiences/malaga"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Málaga</div>
                    <div className="text-sm text-white/70">Beneath the Onda</div>
                  </Link>
                  <Link
                    to="/experiences/istanbul"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2"
                  >
                    <div className="font-bold text-white">Istanbul</div>
                    <div className="text-sm text-white/70">Beneath the Bridge</div>
                  </Link>
                  <Link
                    to="/experiences/beirut"
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

            {/* ── Mobile Auth ── */}
            {user ? (
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4A574] text-xs font-semibold text-white">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    {roleLabel && (
                      <span className="inline-block rounded-full bg-[#D4A574]/15 px-2 py-px text-[10px] font-medium text-[#D4A574]">
                        {roleLabel}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm text-white/70 transition-colors hover:text-[#D4A574]"
                >
                  My Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block text-sm text-white/50 transition-colors hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full rounded-full border border-white/20 px-6 py-2 text-sm text-white text-center transition-all hover:border-[#D4A574] hover:text-[#D4A574]"
              >
                Sign In
              </Link>
            )}
          </div>
        </motion.nav>
      </div>
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </motion.header>
  );
}