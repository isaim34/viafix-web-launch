
import React from 'react';
import { MechanicCard } from './MechanicCard';
import { Button } from './Button';
import { ArrowRight, Star, Crown, User } from 'lucide-react';
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
    <section id="featured-mechanics" className="mobile-py bg-white relative overflow-hidden">
      {/* Technical grid background */}
      <div className="absolute inset-0 tech-grid opacity-20" />

      <div className="mobile-container mx-auto relative">
        <div className="mb-8 sm:mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-md text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Professional Network
            </div>
            <h2 className="mobile-text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-slate-900">
              Featured 
              <span className="text-primary"> Mechanics</span>
            </h2>
            <p className="text-slate-600 mobile-text-lg max-w-2xl mx-auto leading-relaxed">
              Connect with our featured ASE-certified mechanics in Austin. These professionals showcase 
              their specialized skills and proven service record.
            </p>
          </motion.div>
        </div>
        
        <div className="grid mobile-grid-1 gap-4 sm:gap-6 mb-8 sm:mb-10">
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
                  <div className="bg-primary text-white px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                    <span className="hidden xs:inline">FEATURED</span>
                  </div>
                </div>
              )}
              <div className={`${mechanic.featured ? 'ring-1 ring-primary/20' : ''} professional-card rounded-lg hover:shadow-md transition-all duration-300`}>
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
            className="professional-card rounded-lg p-4 sm:p-6 inline-block shadow-sm"
          >
            <Link to="/mechanics">
              <Button 
                variant="outline" 
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="border-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all touch-target text-sm sm:text-base"
              >
                Browse All Austin Mechanics
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
