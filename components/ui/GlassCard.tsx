import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

export function GlassCard({ children, hover = false, glow = false, className = '', ...rest }: GlassCardProps) {
  return (
    <motion.div
      className={`glass rounded-2xl ${hover ? 'transition-all duration-300 hover:shadow-glow hover:-translate-y-1' : ''} ${glow ? 'shadow-glow' : 'shadow-glass'} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
