
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedIconProps {
  icon: React.ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedIcon = ({ icon, delay = 0, className }: AnimatedIconProps) => {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay,
      }}
    >
      {icon}
    </motion.div>
  );
};
