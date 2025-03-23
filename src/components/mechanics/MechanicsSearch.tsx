
import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface MechanicsSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MechanicsSearch = ({ searchTerm, setSearchTerm }: MechanicsSearchProps) => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  return (
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
              <p className="text-sm text-gray-500">Filter functionality coming soon</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MechanicsSearch;
