
import React from 'react';
import { MechanicCard } from './MechanicCard';
import { Button } from './Button';
import { ArrowRight, Star } from 'lucide-react';
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
    <section id="featured-mechanics" className="py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <motion.div 
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <h2 className="text-3xl font-bold">Austin's Top Mobile Mechanics</h2>
          </motion.div>
          <motion.p 
            className="text-gray-600 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Connect with our top-rated ASE-certified mechanics in Austin with specialized skills and exceptional service. Each professional is verified and ready to help with your vehicle needs anywhere in Austin, TX.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredMechanics.map((mechanic, index) => (
            <MechanicCard 
              key={mechanic.id} 
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
          ))}
        </div>
        
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/mechanics">
              <Button 
                variant="outline" 
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
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
