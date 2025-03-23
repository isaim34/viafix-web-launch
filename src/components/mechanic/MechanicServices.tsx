
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Service } from '@/types/mechanic';
import { CheckCircle } from 'lucide-react';

interface MechanicServicesProps {
  services: Service[];
  delay?: number;
  onSelectService?: (service: Service) => void;
}

export const MechanicServices = ({ 
  services, 
  delay = 0.2, 
  onSelectService 
}: MechanicServicesProps) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleServiceClick = (service: Service) => {
    const serviceId = `${service.name}-${service.price}`;
    
    if (selectedServiceId === serviceId) {
      setSelectedServiceId(null);
      if (onSelectService) onSelectService(null);
    } else {
      setSelectedServiceId(serviceId);
      if (onSelectService) onSelectService(service);
    }
  };

  const isServiceSelected = (service: Service) => {
    return selectedServiceId === `${service.name}-${service.price}`;
  };

  return (
    <motion.div 
      className="glass-card p-4 sm:p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <h2 className="text-xl font-bold mb-4">Services & Pricing</h2>
      <div className="space-y-3 sm:space-y-4">
        {services.map((service, index) => (
          <div 
            key={index} 
            className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              isServiceSelected(service) 
                ? 'bg-primary/10 border border-primary' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => handleServiceClick(service)}
          >
            <div className="flex items-center">
              {isServiceSelected(service) && (
                <CheckCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
              )}
              <span className={`font-medium ${isServiceSelected(service) ? 'text-primary' : ''}`}>
                {service.name}
              </span>
            </div>
            <span className={`font-bold ${isServiceSelected(service) ? 'text-primary' : 'text-primary/80'}`}>
              ${service.price}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-gray-500">
        <p>* Base prices listed. Final cost may vary based on vehicle make, model, and condition.</p>
      </div>
    </motion.div>
  );
};
