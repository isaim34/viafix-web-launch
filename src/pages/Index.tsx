
import React from 'react';
import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedMechanics } from '@/components/FeaturedMechanics';
import { motion } from 'framer-motion';
import { Shield, ThumbsUp, Clock, Wrench, Settings, Car } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      
      {/* How it works */}
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
              How It Works
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Getting your vehicle fixed has never been easier. Our platform connects you with skilled mechanics in just a few simple steps.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Car className="w-8 h-8 text-primary" />,
                title: "Describe Your Issue",
                description: "Tell us what's wrong with your vehicle and where you're located for personalized service."
              },
              {
                icon: <Wrench className="w-8 h-8 text-primary" />,
                title: "Choose Your Mechanic",
                description: "Browse profiles, reviews, and rates to select the perfect mechanic for your needs."
              },
              {
                icon: <ThumbsUp className="w-8 h-8 text-primary" />,
                title: "Get It Fixed",
                description: "Your mechanic comes to you, performs the service, and you pay securely through our platform."
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
      
      <FeaturedMechanics />
      
      {/* Benefits */}
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
              Why Choose MobiMech
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our platform offers unique advantages designed to make vehicle repairs convenient, transparent, and stress-free.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6 text-primary" />,
                title: "Save Time",
                description: "No more waiting at repair shops. Get service at your home or office."
              },
              {
                icon: <Shield className="w-6 h-6 text-primary" />,
                title: "Vetted Professionals",
                description: "All mechanics are background-checked and skills-verified."
              },
              {
                icon: <Settings className="w-6 h-6 text-primary" />,
                title: "Quality Service",
                description: "Skilled mechanics with the right tools for any vehicle issue."
              },
              {
                icon: <ThumbsUp className="w-6 h-6 text-primary" />,
                title: "Satisfaction Guaranteed",
                description: "Services backed by our customer satisfaction guarantee."
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
    </Layout>
  );
};

export default Index;
