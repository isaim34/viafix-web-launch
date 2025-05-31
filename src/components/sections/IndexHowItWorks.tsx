
import React from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, ThumbsUp, Settings } from 'lucide-react';

export const IndexHowItWorks = () => {
  return (
    <section id="features" className="mobile-py professional-gradient relative overflow-hidden">
      {/* Technical background pattern */}
      <div className="absolute inset-0 tech-grid opacity-20" />

      <div className="mobile-container mx-auto relative">
        <div className="mb-12 sm:mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-md text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Process Overview
            </div>
            <h2 className="mobile-text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-slate-900">
              How ViaFix Works in 
              <span className="text-primary"> Austin, TX</span>
            </h2>
            <p className="text-slate-600 mobile-text-lg max-w-2xl mx-auto leading-relaxed">
              Streamlined professional process connecting you with ASE-certified mobile mechanics 
              throughout Austin and surrounding areas.
            </p>
          </motion.div>
        </div>
        
        <div className="grid mobile-grid-1 gap-6 sm:gap-8">
          {[
            { 
              icon: <Car className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
              title: "Submit Service Request",
              description: "Describe your vehicle issue and Austin location for professional diagnostic and repair service.",
              step: "01"
            },
            {
              icon: <Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
              title: "Select Certified Mechanic",
              description: "Review profiles, certifications, and rates to choose the right professional for your needs.",
              step: "02"
            },
            {
              icon: <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
              title: "Professional Service Delivery",
              description: "Certified mechanic arrives with proper equipment, performs service, and processes secure payment.",
              step: "03"
            }
          ].map((step, index) => (
            <motion.div 
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="professional-card mobile-p rounded-lg hover:shadow-md transition-all duration-300 h-full">
                {/* Step number */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl font-bold text-slate-200 group-hover:text-primary/20 transition-colors">
                  {step.step}
                </div>
                
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-slate-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                  {step.icon}
                </div>
                <h3 className="mobile-text-xl sm:text-xl font-bold mb-2 sm:mb-3 text-slate-900">{step.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
