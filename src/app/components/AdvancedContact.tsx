import { useState, memo, useCallback } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { AnimatedSection } from "./AnimatedSection";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@cotexp.com", "sales@cotexp.com"],
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: MapPin,
    title: "Address",
    details: ["123 Cotton Street", "Export City, TX 75001, USA"],
    color: "from-green-500 to-green-600",
  },
];

export const AdvancedContact = memo(function AdvancedContact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });

    // Reset submitted state after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  return (
    <section id="contact" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-gray-900">
            Get In Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question or ready to start your order? Contact us today and 
            our team will be happy to assist you.
          </p>
        </AnimatedSection>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <AnimatedSection key={index} delay={index * 0.1} direction="up">
              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <Card className="relative overflow-hidden group">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${info.color} text-white flex items-center justify-center mx-auto mb-4`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <info.icon size={24} />
                    </motion.div>
                    <h3 className="text-lg mb-2 text-gray-900">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <motion.p
                        key={idx}
                        className="text-gray-600 text-sm"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                      >
                        {detail}
                      </motion.p>
                    ))}

                    {/* Hover effect */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <AnimatedSection>
            <Card className="relative overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <motion.div
                      animate={{
                        scale: focusedField === 'name' ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <label htmlFor="name" className="block text-sm mb-2 text-gray-700">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="John Doe"
                        disabled={isSubmitting}
                      />
                    </motion.div>

                    <motion.div
                      animate={{
                        scale: focusedField === 'email' ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="john@example.com"
                        disabled={isSubmitting}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    animate={{
                      scale: focusedField === 'phone' ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="phone" className="block text-sm mb-2 text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="+1 (555) 123-4567"
                      disabled={isSubmitting}
                    />
                  </motion.div>

                  <motion.div
                    animate={{
                      scale: focusedField === 'message' ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="message" className="block text-sm mb-2 text-gray-700">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={6}
                      placeholder="Tell us about your requirements..."
                      disabled={isSubmitting}
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full relative overflow-hidden group"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      <AnimatePresence mode="wait">
                        {isSubmitting ? (
                          <motion.span
                            key="submitting"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-2"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Sending...
                          </motion.span>
                        ) : submitted ? (
                          <motion.span
                            key="submitted"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                          >
                            ✓ Message Sent!
                          </motion.span>
                        ) : (
                          <motion.span
                            key="send"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-2 justify-center"
                          >
                            Send Message
                            <Send size={18} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </form>
              </CardContent>

              {/* Success animation overlay */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    className="absolute inset-0 bg-green-500 flex items-center justify-center pointer-events-none"
                    initial={{ scale: 0, borderRadius: "50%" }}
                    animate={{ scale: 2, borderRadius: "0%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-white text-6xl"
                    >
                      ✓
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});
