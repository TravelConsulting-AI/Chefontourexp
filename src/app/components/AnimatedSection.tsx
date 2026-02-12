import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  id?: string;
}

export function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  id
}: AnimatedSectionProps) {
  const [ref, isVisible] = useIntersectionObserver({ 
    threshold: 0.1, 
    freezeOnceVisible: true 
  });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      animate={isVisible ? { 
        opacity: 1, 
        y: 0, 
        x: 0 
      } : {}}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
}
