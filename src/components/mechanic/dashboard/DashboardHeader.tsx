
import React from 'react';
import { motion } from 'framer-motion';

export const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 md:mb-8"
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Mechanic Dashboard</h1>
      <p className="text-muted-foreground">
        Manage your profile, gigs, and track your business
      </p>
    </motion.div>
  );
};
