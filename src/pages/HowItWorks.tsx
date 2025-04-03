
import React from 'react';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Car, Wrench, ThumbsUp, CheckCircle, Clock, Shield } from 'lucide-react';

const HowItWorks = () => {
  return (
    <Layout>
      <Helmet>
        <title>How It Works | ViaFix</title>
        <meta name="description" content="Learn how ViaFix connects you with trusted mechanics for convenient auto repairs in Austin, TX." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">How ViaFix Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting your vehicle fixed has never been easier. Our platform connects you with ASE-certified 
            mobile mechanics in Austin and surrounding areas in just a few simple steps.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Car className="w-12 h-12 text-primary" />,
              title: "1. Describe Your Vehicle Issue",
              description: "Tell us what's wrong with your vehicle and your location in Austin for personalized on-demand service."
            },
            {
              icon: <Wrench className="w-12 h-12 text-primary" />,
              title: "2. Choose Your Mechanic",
              description: "Browse profiles, reviews, and rates to select the perfect experienced mechanic for your specific auto repair needs."
            },
            {
              icon: <ThumbsUp className="w-12 h-12 text-primary" />,
              title: "3. Get Your Vehicle Fixed",
              description: "Your mobile mechanic comes to your Austin location, performs the service, and you pay securely through our platform."
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">{step.title}</h3>
              <p className="text-gray-600 text-center">{step.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose ViaFix?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Clock className="w-8 h-8 text-primary" />,
                title: "Convenient",
                description: "No more waiting at repair shops. Get on-demand service at your home or office anywhere in Austin, TX."
              },
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Trusted Mechanics",
                description: "All mechanics are background-checked, skills-verified, and many hold ASE certifications for quality repairs."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-primary" />,
                title: "Quality Guaranteed",
                description: "All services come with our satisfaction guarantee. If you're not happy, we'll make it right."
              },
              {
                icon: <ThumbsUp className="w-8 h-8 text-primary" />,
                title: "Fair Pricing",
                description: "Compare rates from different mechanics and choose the best option for your budget."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="flex gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Ready to get your vehicle fixed?</h2>
          <p className="text-center mb-6">Join thousands of satisfied customers in Austin who trust ViaFix for their auto repair needs.</p>
          <div className="flex justify-center">
            <a href="/mechanics" className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Find a Mechanic Now
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
