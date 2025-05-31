
import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import VINLookupTool from '@/components/customer/VINLookupTool';

export const VehicleSearchSection = () => {
  return (
    <section className="mobile-py professional-gradient relative overflow-hidden">
      {/* Technical pattern */}
      <div className="absolute inset-0 tech-grid opacity-25" />

      <div className="mobile-container mx-auto relative">
        <div className="mb-6 sm:mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-md text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Vehicle Safety Verification
            </div>
            <h2 className="mobile-text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-slate-900">
              Vehicle Safety 
              <span className="text-primary"> Lookup</span>
            </h2>
            <p className="text-slate-600 mobile-text-lg max-w-2xl mx-auto leading-relaxed">
              Professional vehicle safety verification using NHTSA database. Check for recalls, 
              complaints, and safety investigations with our VIN lookup tool.
            </p>
          </motion.div>
        </div>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="professional-card rounded-lg mobile-p shadow-sm"
          >
            <VINLookupTool />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
