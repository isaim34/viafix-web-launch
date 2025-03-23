
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Smartphone, Shield, Clock, Lock, FileText } from 'lucide-react';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface BookingCardProps {
  mechanicId: string;
  mechanicName: string;
  hourlyRate: number;
  responseTime: string;
  isCustomerLoggedIn: boolean;
  redirectTo: string;
  redirectAction: string | null;
  onBookService: () => void;
  onContact: () => void;
  onCustomOffer?: () => void;
}

export const BookingCard = ({ 
  mechanicId,
  mechanicName,
  hourlyRate,
  responseTime,
  isCustomerLoggedIn,
  redirectTo,
  redirectAction,
  onBookService,
  onContact,
  onCustomOffer
}: BookingCardProps) => {
  const firstName = mechanicName.split(' ')[0];
  
  // Helper function to render the authentication status indicator
  const renderAuthStatusIndicator = () => {
    if (isCustomerLoggedIn) {
      return null; // No indicator needed if logged in
    }
    
    return (
      <div className="flex items-center mb-4 p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
        <Lock className="w-5 h-5 mr-2" />
        <div>
          <p className="font-medium">Sign in required</p>
          <p className="text-sm">You need to sign in as a customer to book services or contact mechanics.</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="glass-card p-6 sticky top-24"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold mb-4">Book {firstName}</h2>
      
      {renderAuthStatusIndicator()}
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-700">Hourly Rate</span>
          <span className="text-xl font-bold">${hourlyRate}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>Responds in {responseTime}</span>
        </div>
      </div>
      
      <Button 
        className={`w-full mb-3 ${!isCustomerLoggedIn ? 'opacity-90' : ''}`} 
        onClick={onBookService}
      >
        {isCustomerLoggedIn ? 'Book Service' : 'Sign In to Book'}
      </Button>
      
      {isCustomerLoggedIn && onCustomOffer && (
        <Button 
          variant="outline" 
          className="w-full mb-3" 
          icon={<FileText className="w-4 h-4" />} 
          onClick={onCustomOffer}
        >
          Request Custom Offer
        </Button>
      )}
      
      <Button 
        variant="outline" 
        className="w-full mb-6" 
        icon={<MessageCircle className="w-4 h-4" />} 
        onClick={onContact}
      >
        {isCustomerLoggedIn ? 'Chat Now' : 'Sign In to Chat'}
      </Button>
      
      <div className="text-sm text-gray-500 flex items-start mb-4">
        <Smartphone className="w-4 h-4 mr-2 mt-0.5" />
        <div>
          You won't be charged yet. After booking, you'll discuss details and confirm the service with {firstName}.
        </div>
      </div>
      
      <div className="text-sm text-gray-500 flex items-start">
        <Shield className="w-4 h-4 mr-2 mt-0.5" />
        <div>
          All payments are secure and covered by our satisfaction guarantee.
        </div>
      </div>
    </motion.div>
  );
};
