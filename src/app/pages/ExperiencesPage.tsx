import { motion } from 'motion/react';
import { useInView } from '../components/hooks/useInView';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] overflow-x-hidden">
      <HeroSection />
      <PhilosophySection />
      <ExperiencesGrid />
      <CallToAction />
    </div>
  );
}

// HERO SECTION
function HeroSection() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section 
      ref={ref} 
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1662981187531-849408cc8365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYXJjZWxvbmElMjBza3lsaW5lJTIwc3Vuc2V0fGVufDF8fHx8MTc2ODA3MTY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Chef on Tour Experiences"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-[#F4F1EA]">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, delay: 0.3 }}
          className="max-w-5xl"
        >
          <motion.h1 
            className="mb-6 font-serif text-5xl sm:text-6xl md:text-8xl lg:text-[120px] leading-[0.95] tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            CULINARY<br />
            IMMERSIONS
          </motion.h1>
          
          <motion.p 
            className="mb-8 text-xl sm:text-2xl md:text-3xl font-sans font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
          >
            Where the Guidebook Ends, the Journey Begins
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-12 border-t border-[#F4F1EA]/30 pt-8"
          >
            <p className="font-serif text-lg sm:text-xl md:text-2xl italic max-w-3xl mx-auto">
              Guided culinary journeys through the world's most fascinating cities, led by Chef Charles Webb and local cultural guides
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#F4F1EA]/60"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

// PHILOSOPHY SECTION
function PhilosophySection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8 text-center"
        >
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl italic text-[#1a1a1a] mb-8">
            Beyond Tourism
          </h2>
          
          <p className="font-sans text-xl sm:text-2xl leading-relaxed text-[#111111]">
            These are not tours. They are immersions into the soul of a city—its kitchens, markets, ateliers, and underground culture.
          </p>
          
          <div className="my-16 border-l-4 border-[#1a1a1a] pl-8 text-left max-w-3xl mx-auto">
            <p className="font-serif text-2xl sm:text-3xl italic leading-relaxed text-[#1a1a1a]">
              We believe the real story of a place begins once the guidebook fails.
            </p>
          </div>
          
          <p className="font-sans text-xl sm:text-2xl leading-relaxed text-[#111111]">
            Each experience is led by Chef Charles Webb alongside trusted local cultural guides who open doors most travelers never see.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// EXPERIENCES GRID
function ExperiencesGrid() {
  const experiences = [
    {
      title: 'Barcelona',
      subtitle: 'Beneath the Surface',
      description: '6 Days immersed in Catalan cuisine, art, and wine culture',
      image: 'https://images.unsplash.com/photo-1662981187531-849408cc8365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYXJjZWxvbmElMjBza3lsaW5lJTIwc3Vuc2V0fGVufDF8fHx8MTc2ODA3MTY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/tours'
    },
    {
      title: 'Medellín',
      subtitle: 'Beneath the Valley',
      description: '5 Days exploring Colombia\'s transformation through food and culture',
      image: 'https://images.unsplash.com/photo-1650201777831-8c5c23a2b41e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWRlbGxpbiUyMENvbG9tYmlhJTIwdmFsbGV5fGVufDF8fHx8MTc2ODA3MTY4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/medellin-tours'
    },
    {
      title: 'Buenos Aires',
      subtitle: 'Beneath the Fire',
      description: '7 Days navigating Argentine cuisine, tango, and culinary heritage',
      image: 'https://images.unsplash.com/flagged/photo-1576542062543-b11118d96d53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCdWVub3MlMjBBaXJlcyUyMHRhbmdvfGVufDF8fHx8MTc2ODA3MTY4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/buenos-aires-tours'
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Beneath the Mountain',
      description: '6 Days discovering Brazilian flavors between mountain and sea',
      image: 'https://images.unsplash.com/photo-1515700281303-5a0a73d9c584?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSaW8lMjBkZSUyMEphbmVpcm8lMjBtb3VudGFpbnN8ZW58MXx8fHwxNzY4MDcxNjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/rio-tours'
    },
    {
      title: 'Palermo',
      subtitle: 'Beneath the Sun',
      description: '5 Days tracing Sicily\'s ancient culinary crossroads',
      image: 'https://images.unsplash.com/photo-1602277644657-3122e6f8f001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYWxlcm1vJTIwU2ljaWx5JTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2ODA0MzQ1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/palermo-tours'
    },
    {
      title: 'Málaga',
      subtitle: 'Beneath the Waves',
      description: '5 Days exploring Andalusian coast and culinary traditions',
      image: 'https://images.unsplash.com/photo-1730241710115-cce7b963951c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxhZ2ElMjBTcGFpbiUyMGNvYXN0fGVufDF8fHx8MTc2ODA3MTY4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/malaga-tours'
    },
    {
      title: 'Istanbul',
      subtitle: 'Beneath the Bridge',
      description: '6 Days at the crossroads of East and West',
      image: 'https://images.unsplash.com/photo-1634397013564-fb14aa46dc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJc3RhbmJ1bCUyMG1vc3F1ZSUyMHN1bnNldHxlbnwxfHx8fDE3NjgwNzE2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/istanbul-tours'
    },
    {
      title: 'Beirut',
      subtitle: 'Beneath the Cedars',
      description: '5 Days experiencing Lebanon\'s resilient culinary spirit',
      image: 'https://images.unsplash.com/photo-1759403605420-dca1e5c28a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCZWlydXQlMjBMZWJhbm9uJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc2ODA2Mzc5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/beirut-tours'
    }
  ];

  return (
    <section className="bg-[#1a1a1a] px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:gap-12">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ experience, index }: { experience: any; index: number }) {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <Link to={experience.link}>
        <div className={`grid gap-8 lg:grid-cols-2 lg:gap-12 group ${isEven ? '' : 'lg:grid-flow-dense'}`}>
          {/* Image */}
          <div className={`relative aspect-[16/10] overflow-hidden ${isEven ? '' : 'lg:col-start-2'}`}>
            <ImageWithFallback
              src={experience.image}
              alt={experience.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className={`flex flex-col justify-center ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
            <motion.div
              initial={{ opacity: 0, x: isEven ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="mb-2 font-serif text-5xl sm:text-6xl md:text-7xl text-[#F4F1EA] group-hover:text-[#D4A574] transition-colors duration-300">
                {experience.title}
              </h3>
              <p className="mb-6 font-serif text-2xl sm:text-3xl italic text-[#F4F1EA]/70">
                {experience.subtitle}
              </p>
              <p className="mb-8 font-sans text-lg sm:text-xl text-[#F4F1EA]/80 leading-relaxed">
                {experience.description}
              </p>
              
              <div className="flex items-center gap-3 text-[#D4A574] group-hover:gap-5 transition-all duration-300">
                <span className="font-sans text-sm uppercase tracking-wider">Explore Journey</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// CALL TO ACTION
function CallToAction() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-4xl text-center"
      >
        <h2 className="mb-8 font-serif text-4xl sm:text-5xl md:text-6xl italic text-[#1a1a1a]">
          Ready to Go Beneath the Surface?
        </h2>
        <p className="mb-12 font-sans text-xl sm:text-2xl text-[#111111] leading-relaxed">
          Each experience is intimate, transformative, and designed for travelers who seek meaning over spectacle.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border-2 border-[#1a1a1a] bg-[#1a1a1a] px-12 py-4 font-sans text-base uppercase tracking-wider text-[#F4F1EA] transition-all hover:bg-transparent hover:text-[#1a1a1a]"
        >
          Book Your Journey
        </motion.button>
      </motion.div>
    </section>
  );
}
