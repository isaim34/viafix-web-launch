
import React from 'react';
import { Search, Wrench, Clock } from 'lucide-react';
import { AnimatedIcon } from '../AnimatedIcon';

export const FeatureIcons = () => {
  return (
    <div className="flex justify-center gap-16 mt-12 mb-12">
      <AnimatedIcon 
        icon={
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium">Find</span>
          </div>
        }
        delay={0.5}
      />
      
      <AnimatedIcon 
        icon={
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium">Fix</span>
          </div>
        }
        delay={0.7}
      />
      
      <AnimatedIcon 
        icon={
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium">Save</span>
          </div>
        }
        delay={0.9}
      />
    </div>
  );
};
