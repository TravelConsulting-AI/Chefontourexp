import { motion } from 'motion/react';
import { ChevronDown, RotateCcw, Volume2, VolumeX, Play } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import Player from '@vimeo/player';
import logo from '@/assets/b4afc750547d43063f5ad1fdcf21444bb9a88b22.png';

export function VideoHero() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);
  const [userScrolledPast, setUserScrolledPast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasBeenPlayed, setHasBeenPlayed] = useState(false); // Track if user has manually played video with sound

  useEffect(() => {
    if (iframeRef.current) {
      const vimeoPlayer = new Player(iframeRef.current);
      setPlayer(vimeoPlayer);
      
      // Set initial muted state to true (muted)
      vimeoPlayer.setMuted(true);
      
      // Ensure video is ready and starts playing immediately
      vimeoPlayer.ready().then(() => {
        vimeoPlayer.play().then(() => {
          setIsLoading(false);
        }).catch(() => {
          // If autoplay fails, try again
          setTimeout(() => {
            vimeoPlayer.play().catch(() => {
              setIsLoading(false);
            });
          }, 100);
        });
      });
      
      // Listen for video play event
      vimeoPlayer.on('play', () => {
        setVideoStarted(true);
        setIsLoading(false);
      });
      
      // Also listen for timeupdate to ensure video is actually playing
      vimeoPlayer.on('timeupdate', (data) => {
        if (data.seconds > 0 && !videoStarted) {
          setVideoStarted(true);
          setIsLoading(false);
        }
      });

      // Listen for loaded event
      vimeoPlayer.on('loaded', () => {
        setIsLoading(false);
      });
    }
  }, []);

  // Handle scroll to mute video when user scrolls past hero
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      
      if (scrollPosition > heroHeight * 0.8 && !userScrolledPast) {
        // User scrolled past 80% of hero section
        setUserScrolledPast(true);
        if (player && !isMuted) {
          player.setMuted(true);
          setIsMuted(true);
        }
      } else if (scrollPosition <= heroHeight * 0.5 && userScrolledPast) {
        // User scrolled back to top half of hero
        setUserScrolledPast(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [player, isMuted, userScrolledPast]);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const handleRestart = () => {
    if (player) {
      player.setCurrentTime(0);
      player.setMuted(false);
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (player) {
      const newMutedState = !isMuted;
      
      // Only restart video on the FIRST unmute
      if (!newMutedState && !hasBeenPlayed) {
        player.setCurrentTime(0).then(() => {
          player.setMuted(false);
          player.play();
        });
        setHasBeenPlayed(true); // Mark as unmuted
      } else {
        // After first unmute, just toggle mute state
        player.setMuted(newMutedState);
      }
      
      setIsMuted(newMutedState);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          ref={iframeRef}
          src="https://player.vimeo.com/video/1153195493?h=4a423ba714&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&background=1&autopause=0&quality=auto"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh]"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          title="Chef On Tour Hero Video"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-4 text-center text-white pb-[calc(6rem+100px)] sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center -mb-[36px] sm:-mb-[20px]"
        >
          <motion.img 
            src={logo} 
            alt="Chef On Tour with Charles Webb Exp" 
            className="w-48 sm:w-64 md:w-80 mx-auto opacity-50"
            initial={{ scale: 0.25, y: 100 }}
            animate={videoStarted ? { scale: 1, y: 0 } : { scale: 0.25, y: 100 }}
            transition={{ duration: 1.5, delay: videoStarted ? 0.5 : 0, ease: "easeOut" }}
          />
        </motion.div>

        {/* Video Controls and Scroll Indicator */}
        <div className="absolute bottom-[calc(2rem+100px)] sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 sm:gap-12">
          <motion.button
            onClick={handleRestart}
            className="rounded-full bg-[#D4A574] p-3 sm:p-4 transition-all hover:bg-[#C19563] opacity-50 hover:opacity-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Restart video"
          >
            <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.button>
          
          <motion.button
            onClick={scrollToContent}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8" />
          </motion.button>
          
          <motion.button
            onClick={handleMuteToggle}
            className="rounded-full bg-[#D4A574] p-3 sm:p-4 transition-all hover:bg-[#C19563] opacity-50 hover:opacity-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={!hasBeenPlayed ? "Play video with sound" : (isMuted ? "Unmute video" : "Mute video")}
          >
            {!hasBeenPlayed ? (
              <Play className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : isMuted ? (
              <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
}