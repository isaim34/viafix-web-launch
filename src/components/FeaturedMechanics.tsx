
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
    <section id="featured-mechanics" className="py-20 bg-white relative overflow-hidden">
      {/* Technical grid background */}
      <div className="absolute inset-0 tech-grid opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium mb-6">
              <User className="w-4 h-4 mr-2" />
              Professional Network
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Featured 
              <span className="text-primary"> Mechanics</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Connect with our featured ASE-certified mechanics in Austin. These professionals showcase 
              their specialized skills and proven service record.
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
                  <div className="bg-primary text-white px-3 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    FEATURED
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
            className="professional-card rounded-lg p-6 inline-block shadow-sm"
          >
            <Link to="/mechanics">
              <Button 
                variant="outline" 
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="border-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all"
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
