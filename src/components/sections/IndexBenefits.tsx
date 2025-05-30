
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, Settings, ThumbsUp, Sparkles } from 'lucide-react';

export const IndexBenefits = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-100/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='15' cy='15' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Why Choose ViaFix in 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600"> Austin</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Our gig-based platform offers unique advantages designed to make vehicle repairs in Austin convenient, transparent, and stress-free.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Clock className="w-6 h-6 text-primary" />,
              title: "Save Time in Austin",
              description: "No more waiting at repair shops. Get on-demand service at your home or office anywhere in Austin, TX.",
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              icon: <Shield className="w-6 h-6 text-primary" />,
              title: "ASE-Certified Professionals",
              description: "All mechanics are background-checked, skills-verified, and many hold ASE certifications for quality repairs.",
              gradient: "from-indigo-500 to-blue-500"
            },
            {
              icon: <Settings className="w-6 h-6 text-primary" />,
              title: "Quality Mobile Service",
              description: "Skilled Austin mechanics with the right tools for any vehicle issue, from diagnostics to complex repairs.",
              gradient: "from-purple-500 to-indigo-500"
            },
            {
              icon: <ThumbsUp className="w-6 h-6 text-primary" />,
              title: "Austin's Trusted Repairs",
              description: "All services backed by our customer satisfaction guarantee, trusted by vehicle owners throughout Austin.",
              gradient: "from-pink-500 to-purple-500"
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
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
