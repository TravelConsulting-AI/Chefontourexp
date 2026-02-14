import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronUp, ChevronDown, Check, AlertCircle, Loader2 } from 'lucide-react';
import { insertLead } from '@/lib/insertLead';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [calendlyEventUrl, setCalendlyEventUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = questions[currentStep];
  const currentValue = formData[currentQuestion.field];

  // Check if this is the final step (step 9, index 8)
  const isFinalStep = currentStep === questions.length - 1;

  // Build Calendly URL with prefilled parameters
  const calendlyUrl = `https://calendly.com/chefontour?hide_landing_page_details=1&hide_gdpr_banner=1&name=${encodeURIComponent(`${formData.firstName} ${formData.lastName}`)}&email=${encodeURIComponent(formData.email)}`;

  useEffect(() => {
    if (isOpen || showCalendlyModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, showCalendlyModal]);

  const handleSubmitLead = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const { error } = await insertLead({
      source: 'home',
      departureType: 'none',
      tourId: null,
      fixedDateId: null,
      customDepartureDate: null,
      customDepartureDateEnd: null,
      calendlyLink: calendlyEventUrl,
      experienceType: formData.experienceType,
      groupSize: formData.groupSize,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      scheduleCall: formData.scheduleCall === 'Yes, schedule a call',
      comments: formData.comments,
      // Pass the selected destination so insertLead can resolve tour_id
      destinationLabel: formData.destination,
    });

    setIsSubmitting(false);

    if (error) {
      console.error('Lead submission error:', error);
      setSubmitStatus('error');
    } else {
      setSubmitStatus('success');
    }
  }, [formData, calendlyEventUrl]);

  const handleNext = useCallback(() => {
    if (currentStep < questions.length - 1) {
      setDirection(1);
      setIsDropdownOpen(false);
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - submit to Supabase
      handleSubmitLead();
    }
  }, [currentStep, handleSubmitLead]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setIsDropdownOpen(false);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || showCalendlyModal) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && currentValue && !isDropdownOpen) {
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentValue) handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentValue, handleNext, handlePrevious, onClose, showCalendlyModal, isDropdownOpen]);

  // Load Calendly script when showCalendlyModal becomes true
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

  // Listen for Calendly event when meeting is scheduled
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        // Capture event URI for lead record
        const uri = e.data.payload?.event?.uri ?? e.data.payload?.invitee?.uri ?? null;
        if (uri) setCalendlyEventUrl(uri);
        // Close Calendly modal and advance
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

  // Auto-focus text input fields when step changes
  useEffect(() => {
    if (isOpen && currentQuestion.type !== 'dropdown') {
      const timer = setTimeout(() => {
        if (isFinalStep && textareaRef.current) {
          textareaRef.current.focus();
        } else if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen, currentQuestion.type, isFinalStep]);

  const handleSelectOption = (option: string) => {
    setFormData({
      ...formData,
      [currentQuestion.field]: option
    });
    setIsDropdownOpen(false);

    // Check if this is step 8 (index 7) and user selected "Yes, schedule a call"
    const isStep8 = currentStep === 7;
    const wantsToSchedule = option === "Yes, schedule a call";

    // If it's step 8 and user wants to schedule, show Calendly modal
    if (isStep8 && wantsToSchedule) {
      setTimeout(() => {
        setShowCalendlyModal(true);
      }, 300);
      return;
    }

    // For all other cases, auto-advance after short delay
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

  if (!isOpen) return null;

  const isTextInput = currentQuestion.type !== 'dropdown';

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3a4157] p-4 sm:p-6 overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 sm:right-6 top-4 sm:top-6 text-[#D4A574] hover:text-white transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          {/* Main Content */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative">
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
                  className="px-2 sm:px-4"
                >
                  {/* Question Number */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3"
                  >
                    <span className="text-[#D4A574]/60 text-base sm:text-lg">{currentQuestion.id}</span>
                    <span className="text-[#D4A574]/60 text-base sm:text-lg">→</span>
                  </motion.div>

                  {/* Question */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#D4A574] font-light leading-tight"
                  >
                    {currentQuestion.question}
                  </motion.h2>

                  {/* Input Container */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    {isTextInput ? (
                      // Text Input with Phone Country Selector
                      <div>
                        {currentQuestion.type === 'phone' ? (
                          <div className="flex items-center gap-2 sm:gap-3">
                            {/* Country Selector */}
                            <div className="flex items-center gap-1 sm:gap-2 text-[#D4A574]/60">
                              <span className="text-xl sm:text-2xl">🇺🇸</span>
                              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                            {/* Phone Input */}
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
                          // Textarea for final step (comments)
                          <textarea
                            placeholder={currentQuestion.type !== 'dropdown' ? currentQuestion.placeholder : ''}
                            value={currentValue}
                            onChange={handleTextareaChange}
                            rows={3}
                            className="w-full bg-transparent text-[#D4A574]/60 text-base sm:text-lg px-3 sm:px-4 py-2 sm:py-3 border border-[#D4A574]/30 rounded-lg hover:border-[#D4A574]/60 focus:border-[#D4A574] focus:text-[#D4A574] transition-colors outline-none placeholder:text-[#D4A574]/30 resize-none"
                            ref={textareaRef}
                          />
                        ) : (
                          // Regular Text/Email Input
                          <input
                            type={currentQuestion.type === 'email' ? 'email' : 'text'}
                            placeholder={currentQuestion.type !== 'dropdown' ? currentQuestion.placeholder : ''}
                            value={currentValue}
                            onChange={handleInputChange}
                            className="w-full bg-transparent text-[#D4A574]/60 text-base sm:text-lg px-0 py-2 sm:py-3 border-b border-[#D4A574]/30 hover:border-[#D4A574]/60 focus:border-[#D4A574] focus:text-[#D4A574] transition-colors outline-none placeholder:text-[#D4A574]/30"
                            ref={inputRef}
                          />
                        )}

                        {/* OK Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3"
                        >
                          <motion.button
                            onClick={handleNext}
                            disabled={(!isFinalStep && !currentValue) || isSubmitting}
                            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all ${((!isFinalStep && !currentValue) || isSubmitting)
                              ? 'bg-[#D4A574]/20 text-[#D4A574]/40 cursor-not-allowed'
                              : 'bg-[#D4A574] text-[#3a4157] hover:bg-[#C19563]'
                              }`}
                            whileHover={((!isFinalStep && !currentValue) || isSubmitting) ? {} : { scale: 1.02 }}
                            whileTap={((!isFinalStep && !currentValue) || isSubmitting) ? {} : { scale: 0.98 }}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Submitting…
                              </span>
                            ) : isFinalStep ? 'Submit Request' : 'OK'}
                          </motion.button>
                          {!isFinalStep && (
                            <span className="text-[#D4A574]/40 text-xs sm:text-sm hidden sm:inline">
                              press <span className="font-semibold">Enter ↵</span>
                            </span>
                          )}
                        </motion.div>

                        {/* Final Step — Submit Status */}
                        {isFinalStep && submitStatus === 'success' && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 sm:mt-12 space-y-2"
                          >
                            <div className="flex items-center gap-2 text-emerald-400">
                              <Check className="h-5 w-5" />
                              <p className="text-base sm:text-lg font-medium">Request Submitted!</p>
                            </div>
                            <p className="text-[#D4A574]/70 text-sm sm:text-base">
                              We'll be in touch soon.
                            </p>
                          </motion.div>
                        )}
                        {isFinalStep && submitStatus === 'error' && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 sm:mt-12 space-y-2"
                          >
                            <div className="flex items-center gap-2 text-red-400">
                              <AlertCircle className="h-5 w-5" />
                              <p className="text-base sm:text-lg font-medium">Something went wrong</p>
                            </div>
                            <p className="text-[#D4A574]/70 text-sm sm:text-base">
                              Please try again or reach out directly.
                            </p>
                          </motion.div>
                        )}
                        {isFinalStep && submitStatus === 'idle' && !isSubmitting && (
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
                      // Dropdown
                      <>
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full text-left px-0 py-2 sm:py-3 border-b border-[#D4A574]/30 flex items-center justify-between group hover:border-[#D4A574]/60 transition-colors"
                        >
                          <span className={`text-base sm:text-lg ${currentValue ? 'text-[#D4A574]' : 'text-[#D4A574]/40'}`}>
                            {currentValue || 'Type or select an option'}
                          </span>
                          <ChevronUp
                            className={`h-4 w-4 sm:h-5 sm:w-5 text-[#D4A574]/60 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                              }`}
                          />
                        </button>

                        {/* Options */}
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
          </div>

          {/* Navigation Controls - Bottom Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 flex items-center gap-2 sm:gap-3"
          >
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`p-2 sm:p-3 rounded-lg transition-all ${currentStep === 0
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
              className={`p-2 sm:p-3 rounded-lg transition-all ${!currentValue
                ? 'bg-[#D4A574]/20 text-[#D4A574]/40 cursor-not-allowed'
                : 'bg-[#D4A574]/30 text-[#D4A574] hover:bg-[#D4A574]/40'
                }`}
              aria-label="Next question"
            >
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </motion.div>

          {/* Progress Indicator - Bottom Left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 text-[#D4A574]/60 text-xs sm:text-sm"
          >
            {currentStep + 1} / {questions.length}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Calendly Modal Popup */}
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
              {/* Close Button */}
              <button
                onClick={() => setShowCalendlyModal(false)}
                className="absolute right-4 top-4 z-10 text-gray-600 hover:text-gray-900 transition-colors bg-white/90 rounded-full p-2"
                aria-label="Close Calendly"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Calendly Embed */}
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
