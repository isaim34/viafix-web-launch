
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import VINLookupTool from '@/components/customer/VINLookupTool';

export const VehicleSearchSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-25" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='140' height='140' viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237c3aed' fill-opacity='0.1'%3E%3Ccircle cx='25' cy='25' r='5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-purple-500/10 to-indigo-600/10 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Safety First
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Vehicle Safety 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"> Lookup</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Check your vehicle for safety recalls, complaints, and investigations with our free VIN lookup tool
            </p>
          </motion.div>
        </div>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
          >
            <VINLookupTool />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
