import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Auto-play video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play failed, video will need user interaction
      });
    }

    // Show scroll indicator after a delay
    const timer = setTimeout(() => setShowControls(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const reloadVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="https://cotexp.com/wp-content/uploads/2025/11/Cotexperiencefinal1.mp4"
        loop
        muted={isMuted}
        playsInline
        autoPlay
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <img 
            src="https://cotexp.com/wp-content/uploads/2025/08/logo-updated.webp" 
            alt="Chef On Tour Logo" 
            className="w-32 h-32 lg:w-48 lg:h-48"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="font-['Bon_Vivant',_'Cormorant'] text-3xl lg:text-6xl font-normal text-center tracking-wider"
        >
          CHEF ON TOUR EXPERIENCES
        </motion.h1>
      </div>

      {/* Video Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 right-8 z-20 flex flex-col gap-4">
        {/* Play/Pause */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={togglePlay}
          className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </motion.button>

        {/* Reload */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          onClick={reloadVideo}
          className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Reload video"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        {/* Mute/Unmute */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          onClick={toggleMute}
          className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showControls ? 1 : 0, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        onClick={scrollToNext}
      >
        <span className="text-white text-sm lg:text-base font-['Raleway'] tracking-wide hidden lg:block">
          Scroll Down To Get The Full Experience
        </span>
        <span className="text-white text-sm font-['Raleway'] tracking-wide lg:hidden">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-8 h-8 text-white" />
          <ChevronDown className="w-8 h-8 text-white -mt-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
