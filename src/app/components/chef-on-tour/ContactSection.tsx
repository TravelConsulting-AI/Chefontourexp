import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from '../hooks/useInView';
import { Mail, Phone, ChevronUp, ChevronDown, X } from 'lucide-react';

interface FormData {
  destination: string;
  experienceType: string;
  groupSize: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  scheduleCall: string;
  comments: string;
}

type Question = {
  id: number;
  question: string;
  field: keyof FormData;
} & (
  | { type: 'dropdown'; options: string[] }
  | { type: 'text' | 'email' | 'phone'; placeholder: string }
);

const questions: Question[] = [
  {
    id: 1,
    question: "What's your preferred destination?",
    type: 'dropdown',
    options: [
      "Medellín, Colombia",
      "Rio de Janeiro, Brazil",
      "Barcelona, Spain",
      "Palermo, Italy",
      "Buenos Aires, Argentina",
      "Málaga, Spain",
      "Istanbul, Turkey",
      "Beirut, Lebanon",
      "Other"
    ],
    field: 'destination'
  },
  {
    id: 2,
    question: "Who are you creating this experience with?",
    type: 'dropdown',
    options: [
      "A Group of Friends",
      "Team / Incentive Experience",
      "Family Trip",
      "Solo Traveler",
      "Couples Getaway"
    ],
    field: 'experienceType'
  },
  {
    id: 3,
    question: "What's your group size?",
    type: 'dropdown',
    options: [
      "1 to 2",
      "2 to 4",
      "4 to 6",
      "6+"
    ],
    field: 'groupSize'
  },
  {
    id: 4,
    question: "What's your first name?",
    type: 'text',
    placeholder: 'Type your answer here...',
    field: 'firstName'
  },
  {
    id: 5,
    question: "What's your last name?",
    type: 'text',
    placeholder: 'Type your answer here...',
    field: 'lastName'
  },
  {
    id: 6,
    question: "What's your email address?",
    type: 'email',
    placeholder: 'name@example.com',
    field: 'email'
  },
  {
    id: 7,
    question: "What's the best number to reach you?",
    type: 'phone',
    placeholder: '(201) 555-0123',
    field: 'phone'
  },
  {
    id: 8,
    question: "Schedule a call with our team?",
    type: 'dropdown',
    options: [
      "Yes, schedule a call",
      "No, I'll do it later"
    ],
    field: 'scheduleCall'
  },
  {
    id: 9,
    question: "Any additional comments?",
    type: 'text',
    placeholder: 'Type your answer here...',
    field: 'comments'
  }
];

function EmbeddedBookingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    experienceType: '',
    groupSize: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    scheduleCall: '',
    comments: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = questions[currentStep];
  const currentValue = formData[currentQuestion.field];
  const isFinalStep = currentStep === questions.length - 1;
  const isTextInput = currentQuestion && currentQuestion.type !== 'dropdown';
  
  const calendlyUrl = `https://calendly.com/chefontour?hide_landing_page_details=1&hide_gdpr_banner=1&name=${encodeURIComponent(`${formData.firstName} ${formData.lastName}`)}&email=${encodeURIComponent(formData.email)}`;

  useEffect(() => {
    if (showCalendlyModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCalendlyModal]);

  const handleNext = useCallback(() => {
    if (currentStep < questions.length - 1) {
      setDirection(1);
      setIsDropdownOpen(false);
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Booking form completed', formData);
      setIsComplete(true);
    }
  }, [currentStep, formData]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setIsDropdownOpen(false);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCalendlyModal || isComplete) return;
      
      if (e.key === 'Enter' && currentValue && !isDropdownOpen) {
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowDown' && currentValue) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentValue, handleNext, handlePrevious, showCalendlyModal, isDropdownOpen, isComplete]);
  
  useEffect(() => {
    if (showCalendlyModal) {
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
      }
    }
  }, [showCalendlyModal]);

  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        console.log('Calendly meeting scheduled!', e.data);
        setTimeout(() => {
          setShowCalendlyModal(false);
          handleNext();
        }, 1000);
      }
    };

    if (showCalendlyModal) {
      window.addEventListener('message', handleCalendlyEvent);
      return () => {
        window.removeEventListener('message', handleCalendlyEvent);
      };
    }
  }, [showCalendlyModal, handleNext]);

  useEffect(() => {
    if (!isComplete && currentQuestion && currentQuestion.type !== 'dropdown') {
      const timer = setTimeout(() => {
        if (isFinalStep && textareaRef.current) {
          textareaRef.current.focus();
        } else if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, currentQuestion, isFinalStep, isComplete]);

  const handleSelectOption = (option: string) => {
    setFormData({
      ...formData,
      [currentQuestion.field]: option
    });
    setIsDropdownOpen(false);
    
    const isStep8 = currentStep === 7;
    const wantsToSchedule = option === "Yes, schedule a call";
    
    if (isStep8 && wantsToSchedule) {
      setTimeout(() => {
        setShowCalendlyModal(true);
      }, 300);
      return;
    }
    
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [currentQuestion.field]: e.target.value
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [currentQuestion.field]: e.target.value
    });
  };

  const handleReset = () => {
    setCurrentStep(0);
    setDirection(0);
    setFormData({
      destination: '',
      experienceType: '',
      groupSize: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      scheduleCall: '',
      comments: ''
    });
    setIsComplete(false);
    setIsDropdownOpen(false);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  if (isComplete) {
    return (
      <div className="bg-[#3a4157] rounded-2xl p-8 sm:p-12 md:p-16 min-h-[600px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto rounded-full bg-[#D4A574] flex items-center justify-center"
          >
            <span className="text-4xl">✓</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#D4A574] font-light">
            Thank You!
          </h2>
          <p className="text-[#D4A574]/90 text-lg sm:text-xl max-w-md mx-auto">
            Looking forward to creating magic together!
          </p>
          <p className="text-[#D4A574]/70 text-base">
            We'll be in touch soon
          </p>
          <motion.button
            onClick={handleReset}
            className="mt-8 px-8 py-3 rounded-lg text-sm font-medium bg-[#D4A574] text-[#3a4157] hover:bg-[#C19563] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit Another Request
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#3a4157] rounded-2xl p-6 sm:p-10 md:p-12 lg:p-16 min-h-[600px] relative">
        <div className="mb-8 sm:mb-12 flex items-center justify-center gap-2">
          <span className="text-[#D4A574]/60 text-sm">
            {currentStep + 1} / {questions.length}
          </span>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
              >
                <span className="text-[#D4A574]/60 text-base sm:text-lg">{currentQuestion.id}</span>
                <span className="text-[#D4A574]/60 text-base sm:text-lg">→</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#D4A574] font-light leading-tight"
              >
                {currentQuestion.question}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                {isTextInput ? (
                  <div>
                    {currentQuestion.type === 'phone' ? (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 sm:gap-2 text-[#D4A574]/60">
                          <span className="text-xl sm:text-2xl">🇺🇸</span>
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <input
                          type="tel"
                          placeholder={currentQuestion.placeholder}
                          value={currentValue}
                          onChange={handleInputChange}
                          className="flex-1 bg-transparent text-[#D4A574]/60 text-base sm:text-lg px-0 py-2 sm:py-3 border-b border-[#D4A574]/30 hover:border-[#D4A574]/60 focus:border-[#D4A574] focus:text-[#D4A574] transition-colors outline-none placeholder:text-[#D4A574]/30"
                          ref={inputRef}
                        />
                      </div>
                    ) : isFinalStep ? (
                      <textarea
                        placeholder={currentQuestion.placeholder}
                        value={currentValue}
                        onChange={handleTextareaChange}
                        rows={3}
                        className="w-full bg-transparent text-[#D4A574]/60 text-base sm:text-lg px-3 sm:px-4 py-2 sm:py-3 border border-[#D4A574]/30 rounded-lg hover:border-[#D4A574]/60 focus:border-[#D4A574] focus:text-[#D4A574] transition-colors outline-none placeholder:text-[#D4A574]/30 resize-none"
                        ref={textareaRef}
                      />
                    ) : (
                      <input
                        type={currentQuestion.type === 'email' ? 'email' : 'text'}
                        placeholder={currentQuestion.placeholder}
                        value={currentValue}
                        onChange={handleInputChange}
                        className="w-full bg-transparent text-[#D4A574]/60 text-base sm:text-lg px-0 py-2 sm:py-3 border-b border-[#D4A574]/30 hover:border-[#D4A574]/60 focus:border-[#D4A574] focus:text-[#D4A574] transition-colors outline-none placeholder:text-[#D4A574]/30"
                        ref={inputRef}
                      />
                    )}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3"
                    >
                      <motion.button
                        onClick={handleNext}
                        disabled={!isFinalStep && !currentValue}
                        className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all ${
                          (!isFinalStep && !currentValue)
                            ? 'bg-[#D4A574]/20 text-[#D4A574]/40 cursor-not-allowed'
                            : 'bg-[#D4A574] text-[#3a4157] hover:bg-[#C19563]'
                        }`}
                        whileHover={(!isFinalStep && !currentValue) ? {} : { scale: 1.02 }}
                        whileTap={(!isFinalStep && !currentValue) ? {} : { scale: 0.98 }}
                      >
                        {isFinalStep ? 'Submit Request' : 'OK'}
                      </motion.button>
                      {!isFinalStep && (
                        <span className="text-[#D4A574]/40 text-xs sm:text-sm hidden sm:inline">
                          press <span className="font-semibold">Enter ↵</span>
                        </span>
                      )}
                    </motion.div>

                    {isFinalStep && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 sm:mt-12 space-y-2"
                      >
                        <p className="text-[#D4A574]/90 text-base sm:text-lg">
                          Looking forward to creating magic together!
                        </p>
                        <p className="text-[#D4A574]/70 text-sm sm:text-base">
                          We'll be in touch soon
                        </p>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full text-left px-0 py-2 sm:py-3 border-b border-[#D4A574]/30 flex items-center justify-between group hover:border-[#D4A574]/60 transition-colors"
                    >
                      <span className={`text-base sm:text-lg ${currentValue ? 'text-[#D4A574]' : 'text-[#D4A574]/40'}`}>
                        {currentValue || 'Type or select an option'}
                      </span>
                      <ChevronUp
                        className={`h-4 w-4 sm:h-5 sm:w-5 text-[#D4A574]/60 transition-transform ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && currentQuestion.type === 'dropdown' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 overflow-hidden"
                        >
                          {currentQuestion.options.map((option, index) => (
                            <motion.button
                              key={option}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleSelectOption(option)}
                              className="w-full text-left px-4 sm:px-5 py-3 sm:py-4 border border-[#D4A574]/30 rounded-lg text-sm sm:text-base text-[#D4A574]/80 hover:bg-[#D4A574]/10 hover:border-[#D4A574]/60 hover:text-[#D4A574] transition-all duration-200"
                            >
                              {option}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 flex items-center gap-2 sm:gap-3"
        >
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`p-2 sm:p-3 rounded-lg transition-all ${
              currentStep === 0
                ? 'bg-[#D4A574]/20 text-[#D4A574]/40 cursor-not-allowed'
                : 'bg-[#D4A574]/30 text-[#D4A574] hover:bg-[#D4A574]/40'
            }`}
            aria-label="Previous question"
          >
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={!currentValue}
            className={`p-2 sm:p-3 rounded-lg transition-all ${
              !currentValue
                ? 'bg-[#D4A574]/20 text-[#D4A574]/40 cursor-not-allowed'
                : 'bg-[#D4A574]/30 text-[#D4A574] hover:bg-[#D4A574]/40'
            }`}
            aria-label="Next question"
          >
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showCalendlyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 overflow-y-auto"
            onClick={() => setShowCalendlyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCalendlyModal(false)}
                className="absolute right-4 top-4 z-10 text-gray-600 hover:text-gray-900 transition-colors bg-white/90 rounded-full p-2"
                aria-label="Close Calendly"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="w-full">
                <div
                  className="calendly-inline-widget"
                  data-url={calendlyUrl}
                  style={{ minWidth: '320px', height: '700px', maxHeight: '90vh' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ContactSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-white px-4 py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl font-serif">Get in Touch</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
            Ready to start planning your culinary adventure? Complete the form below.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-serif">Let's Plan Your Journey</h3>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-gray-700">
              Whether you're ready to book or just exploring options, our team is here to help 
              craft the perfect culinary adventure tailored to your interests.
            </p>

            <div className="space-y-5 sm:space-y-6">
              {/* Email */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="rounded-full bg-[#F8F6F3] p-2.5 sm:p-3 flex-shrink-0">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-[#D4A574]" />
                </div>
                <div>
                  <div className="mb-1 font-semibold text-sm sm:text-base">Email Us</div>
                  <a 
                    href="mailto:charles@chefcharleswebb.com" 
                    className="text-sm sm:text-base text-gray-600 transition-colors hover:text-[#D4A574]"
                  >
                    charles@chefcharleswebb.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="rounded-full bg-[#F8F6F3] p-2.5 sm:p-3 flex-shrink-0">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-[#D4A574]" />
                </div>
                <div>
                  <div className="mb-1 font-semibold text-sm sm:text-base">Call Us</div>
                  <a 
                    href="tel:+1-312-860-2188" 
                    className="text-sm sm:text-base text-gray-600 transition-colors hover:text-[#D4A574]"
                  >
                    +1 (312) 860-2188
                  </a>
                  <div className="text-xs sm:text-sm text-gray-500">Mon-Fri, 9am-6pm EST</div>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="mt-6 sm:mt-8 rounded-lg bg-[#F8F6F3] p-4 sm:p-6">
              <h4 className="mb-2 font-semibold text-sm sm:text-base">Quick Response Guaranteed</h4>
              <p className="text-sm sm:text-base text-gray-700">
                We typically respond to all inquiries within 24 hours. For urgent requests, 
                please call us directly.
              </p>
            </div>
          </motion.div>

          {/* Embedded Booking Form - TODO: Will be created next */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <EmbeddedBookingForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}