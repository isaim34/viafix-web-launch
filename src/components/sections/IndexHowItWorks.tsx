
import React from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, ThumbsUp } from 'lucide-react';

export const IndexHowItWorks = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How ViaFix Works in Austin, TX
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Getting your vehicle fixed has never been easier. Our platform connects you with ASE-certified mobile mechanics in Austin and surrounding areas in just a few simple steps.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Car className="w-8 h-8 text-primary" />,
              title: "Describe Your Vehicle Issue",
              description: "Tell us what's wrong with your vehicle and your location in Austin for personalized on-demand service."
            },
            {
              icon: <Wrench className="w-8 h-8 text-primary" />,
              title: "Choose Your ASE-Certified Mechanic",
              description: "Browse profiles, reviews, and rates to select the perfect experienced mechanic for your specific auto repair needs."
            },
            {
              icon: <ThumbsUp className="w-8 h-8 text-primary" />,
              title: "Get Your Vehicle Fixed On-Site",
              description: "Your mobile mechanic comes to your Austin location, performs the service, and you pay securely through our platform."
            }
          ].map((step, index) => (
            <motion.div 
              key={index}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
