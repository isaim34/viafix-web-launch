
import React from 'react';
import { MechanicCard } from './MechanicCard';
import { Button } from './Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mechanicsDetailedData } from '@/data/mechanicsData';

// Sample mechanic data with gallery images from mechanicdDetailedData
const mechanics = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Engine Repair', 'Diagnostics'],
    rating: 4.8,
    reviewCount: 127,
    location: 'Los Angeles, CA',
    hourlyRate: 85,
    galleryImages: mechanicsDetailedData['1'].galleryImages
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Electrical Systems', 'AC Repair'],
    rating: 4.7,
    reviewCount: 94,
    location: 'Chicago, IL',
    hourlyRate: 75,
    galleryImages: mechanicsDetailedData['2'].galleryImages
  },
  {
    id: '3',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Transmission', 'Brake Systems'],
    rating: 4.9,
    reviewCount: 156,
    location: 'Austin, TX',
    hourlyRate: 90
  }
];

export const FeaturedMechanics = () => {
  return (
    <section id="featured-mechanics" className="py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Mechanics
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Connect with our top-rated mechanics with specialized skills and exceptional service. Each professional is verified and ready to help with your vehicle needs.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {mechanics.map((mechanic, index) => (
            <MechanicCard 
              key={mechanic.id} 
              {...mechanic} 
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
                View All Mechanics
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
