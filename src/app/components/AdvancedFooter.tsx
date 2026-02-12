import { memo } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

const quickLinks = [
  { name: "Home", href: "home" },
  { name: "About Us", href: "about" },
  { name: "Products", href: "products" },
  { name: "Services", href: "services" },
  { name: "Contact", href: "contact" },
];

const products = [
  "Raw Cotton",
  "Cotton Yarn",
  "Cotton Fabric",
  "Organic Cotton",
  "Cotton Waste",
];

const socialLinks = [
  { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
  { icon: Twitter, href: "#", color: "hover:bg-sky-500" },
  { icon: Linkedin, href: "#", color: "hover:bg-blue-700" },
  { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
];

export const AdvancedFooter = memo(function AdvancedFooter() {
  const currentYear = new Date().getFullYear();
  const scrollToSection = useSmoothScroll();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-white/20 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, (Math.random() - 0.5) * 200],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h3
              className="text-2xl text-white mb-4"
              whileHover={{ scale: 1.05 }}
            >
              COTEXP
            </motion.h3>
            <p className="text-sm mb-4">
              Your trusted partner in premium cotton export solutions, delivering 
              quality and reliability worldwide since 1998.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 rounded-full bg-gray-800 ${social.color} flex items-center justify-center transition-all`}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                >
                  <motion.button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm hover:text-blue-400 transition-colors text-left"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-white mb-4">Products</h4>
            <ul className="space-y-2">
              {products.map((product, index) => (
                <motion.li
                  key={index}
                  className="text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ x: 5, color: "#60a5fa" }}
                >
                  {product}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-white mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <motion.li
                className="flex items-start gap-2 text-sm"
                whileHover={{ x: 5 }}
              >
                <MapPin size={18} className="flex-shrink-0 mt-0.5 text-blue-400" />
                <span>123 Cotton Street<br />Export City, TX 75001, USA</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-2 text-sm"
                whileHover={{ x: 5 }}
              >
                <Phone size={18} className="flex-shrink-0 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-2 text-sm"
                whileHover={{ x: 5 }}
              >
                <Mail size={18} className="flex-shrink-0 text-blue-400" />
                <span>info@cotexp.com</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-800 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p>© {currentYear} COTEXP. All rights reserved.</p>
            <div className="flex gap-6">
              <motion.a
                href="#"
                className="hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Terms of Service
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        whileHover={{ scale: 1.1, backgroundColor: "#2563eb" }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  );
});
