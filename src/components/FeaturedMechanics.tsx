
import React from 'react';
import { MechanicCard } from './MechanicCard';
import { Button } from './Button';
import { ArrowRight, Star, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeaturedMechanics } from '@/hooks/useFeaturedMechanics';

export const FeaturedMechanics = () => {
  const { featuredMechanics, loading, error } = useFeaturedMechanics(3);
  
  // Don't render the section if no mechanics are available or loading
  if (loading || featuredMechanics.length === 0) {
    return null;
  }

  return (
    <section id="featured-mechanics" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Crown className="w-4 h-4 mr-2 text-yellow-500" />
              Premium Service
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Featured 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600"> Mechanics</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Connect with our featured ASE-certified mechanics in Austin. These professionals have chosen to showcase their specialized skills and exceptional service. Each is verified and ready to help with your vehicle needs anywhere in Austin, TX.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredMechanics.map((mechanic, index) => (
            <motion.div 
              key={mechanic.id} 
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              {mechanic.featured && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                    <Crown className="w-3 h-3" />
                    FEATURED
                  </div>
                </div>
              )}
              <div className={`${mechanic.featured ? 'ring-2 ring-yellow-400/50 ring-offset-2' : ''} rounded-lg bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <MechanicCard 
                  id={mechanic.id}
                  name={mechanic.name || 'Unknown Mechanic'}
                  avatar={mechanic.avatar || ''}
                  specialties={Array.isArray(mechanic.specialties) ? mechanic.specialties : 
                              typeof mechanic.specialties === 'string' ? [mechanic.specialties] : 
                              ['General Repairs']}
                  rating={mechanic.rating || 0}
                  reviewCount={mechanic.reviewCount || 0}
                  location={mechanic.location || 'Austin, TX'}
                  hourlyRate={mechanic.hourlyRate || 0}
                  delay={0.1 * index}
                />
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 inline-block shadow-lg border border-white/20"
          >
            <Link to="/mechanics">
              <Button 
                variant="outline" 
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all"
              >
                Browse All Austin Mobile Mechanics
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
