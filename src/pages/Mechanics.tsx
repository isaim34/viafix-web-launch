
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { MechanicCard } from '@/components/MechanicCard';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown } from 'lucide-react';

// Sample mechanic data - expanded list
const mechanicsData = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Engine Repair', 'Diagnostics'],
    rating: 4.8,
    reviewCount: 127,
    location: 'Los Angeles, CA',
    hourlyRate: 85
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Electrical Systems', 'AC Repair'],
    rating: 4.7,
    reviewCount: 94,
    location: 'Chicago, IL',
    hourlyRate: 75
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
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Oil Changes', 'Tune-ups', 'Filters'],
    rating: 4.6,
    reviewCount: 78,
    location: 'Miami, FL',
    hourlyRate: 65
  },
  {
    id: '5',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Suspension', 'Steering', 'Alignment'],
    rating: 4.8,
    reviewCount: 112,
    location: 'Seattle, WA',
    hourlyRate: 80
  },
  {
    id: '6',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Diesel Engines', 'Performance Tuning'],
    rating: 4.9,
    reviewCount: 203,
    location: 'Dallas, TX',
    hourlyRate: 95
  }
];

const Mechanics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter mechanics based on search term
  const filteredMechanics = mechanicsData.filter(mechanic => 
    mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mechanic.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
    mechanic.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Find Your Mechanic</h1>
          <p className="text-gray-600 max-w-2xl">
            Browse our network of skilled mechanics ready to help with your vehicle. Filter by specialty, location, or rating to find the perfect match.
          </p>
        </motion.div>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, or location..."
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {filterOpen && (
              <motion.div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4">
                  <h4 className="font-medium mb-3">Specialties</h4>
                  {/* Filter options would go here */}
                  <p className="text-sm text-gray-500">Filter functionality coming soon</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Results Count */}
        <p className="text-gray-500 mb-6">Showing {filteredMechanics.length} mechanics</p>
        
        {/* Mechanics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMechanics.map((mechanic, index) => (
            <MechanicCard 
              key={mechanic.id} 
              {...mechanic} 
              delay={0.05 * index}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Mechanics;
