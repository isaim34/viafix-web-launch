
import React from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, ThumbsUp, Sparkles } from 'lucide-react';

export const IndexHowItWorks = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/50 to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ddd6fe' fill-opacity='0.4'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              How ViaFix Works in 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600"> Austin, TX</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Getting your vehicle fixed has never been easier. Our platform connects you with ASE-certified mobile mechanics in Austin and surrounding areas in just a few simple steps.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Car className="w-8 h-8 text-primary" />,
              title: "Describe Your Vehicle Issue",
              description: "Tell us what's wrong with your vehicle and your location in Austin for personalized on-demand service.",
              gradient: "from-blue-500 to-indigo-600"
            },
            {
              icon: <Wrench className="w-8 h-8 text-primary" />,
              title: "Choose Your ASE-Certified Mechanic",
              description: "Browse profiles, reviews, and rates to select the perfect experienced mechanic for your specific auto repair needs.",
              gradient: "from-indigo-500 to-purple-600"
            },
            {
              icon: <ThumbsUp className="w-8 h-8 text-primary" />,
              title: "Get Your Vehicle Fixed On-Site",
              description: "Your mobile mechanic comes to your Austin location, performs the service, and you pay securely through our platform.",
              gradient: "from-purple-500 to-pink-600"
            }
          ].map((step, index) => (
            <motion.div 
              key={index}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
