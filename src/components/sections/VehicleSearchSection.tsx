
import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import VINLookupTool from '@/components/customer/VINLookupTool';

export const VehicleSearchSection = () => {
  return (
    <section className="py-20 professional-gradient relative overflow-hidden">
      {/* Technical pattern */}
      <div className="absolute inset-0 tech-grid opacity-25" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Vehicle Safety Verification
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Vehicle Safety 
              <span className="text-primary"> Lookup</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
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
            className="professional-card rounded-lg p-8 shadow-sm"
          >
            <VINLookupTool />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
