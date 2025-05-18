
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, Settings, ThumbsUp } from 'lucide-react';

export const IndexBenefits = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose ViaFix in Austin
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our gig-based platform offers unique advantages designed to make vehicle repairs in Austin convenient, transparent, and stress-free.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Clock className="w-6 h-6 text-primary" />,
              title: "Save Time in Austin",
              description: "No more waiting at repair shops. Get on-demand service at your home or office anywhere in Austin, TX."
            },
            {
              icon: <Shield className="w-6 h-6 text-primary" />,
              title: "ASE-Certified Professionals",
              description: "All mechanics are background-checked, skills-verified, and many hold ASE certifications for quality repairs."
            },
            {
              icon: <Settings className="w-6 h-6 text-primary" />,
              title: "Quality Mobile Service",
              description: "Skilled Austin mechanics with the right tools for any vehicle issue, from diagnostics to complex repairs."
            },
            {
              icon: <ThumbsUp className="w-6 h-6 text-primary" />,
              title: "Austin's Trusted Repairs",
              description: "All services backed by our customer satisfaction guarantee, trusted by vehicle owners throughout Austin."
            }
          ].map((benefit, index) => (
            <motion.div 
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
