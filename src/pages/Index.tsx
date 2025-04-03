
import React from 'react';
import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedMechanics } from '@/components/FeaturedMechanics';
import { BlogSection } from '@/components/BlogSection';
import { motion } from 'framer-motion';
import { Shield, ThumbsUp, Clock, Wrench, Settings, Car } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>ViaFix | Gig-Based Auto Repair Services in Austin, TX</title>
        <meta name="description" content="ViaFix connects ASE-certified mechanics with customers in Austin, TX. Join us for flexible gigs and reliable mobile auto repair services." />
        <meta name="keywords" content="mobile mechanics, auto repair austin, gig-based auto repair, ASE-certified mechanics, independent mechanic jobs" />
        <link rel="canonical" href="https://tryviafix.com/" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "ViaFix",
              "description": "Gig-based platform connecting mobile mechanics with customers in Austin, TX",
              "url": "https://tryviafix.com",
              "logo": "https://tryviafix.com/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Austin",
                "addressRegion": "TX",
                "postalCode": "78701",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "30.2672",
                "longitude": "-97.7431"
              },
              "openingHours": "Mo-Su 00:00-23:59",
              "telephone": "+1-512-555-1234",
              "priceRange": "$$",
              "sameAs": [
                "https://www.facebook.com/viafix",
                "https://www.instagram.com/viafix_app",
                "https://twitter.com/viafix_app"
              ],
              "potentialAction": {
                "@type": "FindAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://tryviafix.com/mechanics?zipCode={zip}"
                },
                "object": {
                  "@type": "Service",
                  "name": "Mobile Auto Repair Services"
                }
              }
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does ViaFix work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ViaFix connects you with skilled ASE-certified mechanics near you in Austin, TX. Simply describe your vehicle issue, choose a mechanic based on their ratings and specialties, and they'll come to your location to perform the repair."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are ViaFix mechanics certified?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, all mechanics on the ViaFix platform are vetted and many hold ASE certifications, ensuring they have the skills and expertise to properly repair your vehicle."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I become a mechanic on ViaFix?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Independent mechanics can join ViaFix by creating a profile, verifying their credentials, and setting up their service offerings. Start earning with flexible gig-based auto repair jobs in Austin."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
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
      
      {/* Add the Blog Section */}
      <BlogSection />
    </Layout>
  );
};

export default Index;
