
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, Settings, ThumbsUp, Wrench } from 'lucide-react';

export const IndexBenefits = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Technical grid background */}
      <div className="absolute inset-0 tech-grid opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-md text-sm font-medium mb-6">
              <Wrench className="w-4 h-4 mr-2" />
              Professional Service
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Why Choose ViaFix in 
              <span className="text-primary"> Austin</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Professional mobile mechanic platform designed for efficiency, transparency, and quality service delivery.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Clock className="w-6 h-6 text-primary" />,
              title: "Efficient Service",
              description: "On-demand professional service at your location throughout Austin, TX.",
            },
            {
              icon: <Shield className="w-6 h-6 text-primary" />,
              title: "Certified Professionals",
              description: "Background-checked, skills-verified mechanics with ASE certifications.",
            },
            {
              icon: <Settings className="w-6 h-6 text-primary" />,
              title: "Quality Tools & Service",
              description: "Professional equipment and expertise for comprehensive vehicle repairs.",
            },
            {
              icon: <ThumbsUp className="w-6 h-6 text-primary" />,
              title: "Guaranteed Results",
              description: "Service backed by our satisfaction guarantee and professional standards.",
            }
          ].map((benefit, index) => (
            <motion.div 
              key={index}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="professional-card p-6 rounded-lg hover:shadow-md transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">{benefit.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
