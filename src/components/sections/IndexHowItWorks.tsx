
import React from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, ThumbsUp, Settings } from 'lucide-react';

export const IndexHowItWorks = () => {
  return (
    <section id="features" className="py-20 professional-gradient relative overflow-hidden">
      {/* Technical background pattern */}
      <div className="absolute inset-0 tech-grid opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium mb-6">
              <Settings className="w-4 h-4 mr-2" />
              Process Overview
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              How ViaFix Works in 
              <span className="text-primary"> Austin, TX</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Streamlined professional process connecting you with ASE-certified mobile mechanics 
              throughout Austin and surrounding areas.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Car className="w-8 h-8 text-primary" />,
              title: "Submit Service Request",
              description: "Describe your vehicle issue and Austin location for professional diagnostic and repair service.",
              step: "01"
            },
            {
              icon: <Wrench className="w-8 h-8 text-primary" />,
              title: "Select Certified Mechanic",
              description: "Review profiles, certifications, and rates to choose the right professional for your needs.",
              step: "02"
            },
            {
              icon: <ThumbsUp className="w-8 h-8 text-primary" />,
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
              <div className="professional-card p-8 rounded-lg hover:shadow-md transition-all duration-300 h-full">
                {/* Step number */}
                <div className="absolute top-4 right-4 text-2xl font-bold text-slate-200 group-hover:text-primary/20 transition-colors">
                  {step.step}
                </div>
                
                <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
