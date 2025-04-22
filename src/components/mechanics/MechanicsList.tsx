
import React, { useEffect, useState } from 'react';
import { MechanicCard } from '@/components/MechanicCard';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { mechanicsData } from '@/data/mechanicsPageData';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface Mechanic {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  hourlyRate: number;
  galleryImages?: string[];
  zipCode?: string;
}

interface MechanicsListProps {
  mechanics: Mechanic[];
  zipCode: string;
  locationName?: string;
  isLoading?: boolean;
  setZipCode: (zipCode: string) => void;
}

const MechanicsList = ({ mechanics, zipCode, locationName, setZipCode }: MechanicsListProps) => {
  const locationDisplay = locationName || zipCode;
  const { currentUserId, currentUserRole, currentUserName } = useCustomerAuth();
  const [localProfile, setLocalProfile] = useState<any>(null);
  
  // Enhanced logging for debugging
  useEffect(() => {
    console.log('MechanicsList - Current user info:', {
      role: currentUserRole,
      name: currentUserName,
      id: currentUserId
    });
    console.log('MechanicsList - Mechanics provided:', mechanics.length, mechanics.map(m => m.id));
    console.log('MechanicsList - Current zip code:', zipCode);
    
    // Check if the local mechanic profile exists in localStorage
    const storedProfile = localStorage.getItem('mechanicProfile');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        console.log('MechanicsList - Local mechanic profile found:', profile);
        console.log('MechanicsList - Local mechanic profile zip code:', profile.zipCode);
        setLocalProfile(profile);
      } catch (error) {
        console.error('Error parsing mechanic profile:', error);
      }
    } else {
      console.log('MechanicsList - No local mechanic profile found in localStorage');
    }
    
    // Save customer name to help with vendor display for mechanics list
    if (currentUserRole === 'customer' && currentUserName) {
      // This lets us remember the customer's name on the vendor card
      localStorage.setItem('lastCustomerName', currentUserName);
    }
  }, [currentUserRole, mechanics, zipCode, currentUserName, currentUserId]);
  
  // Auto-populate zip code from profile for mechanics
  useEffect(() => {
    // Check if component is mounting and if the zip code should be auto-populated
    const shouldAutoPopulate = () => {
      // Don't auto-populate if zip code is already set
      if (zipCode) return false;
      
      // Don't auto-populate if user manually cleared zip code
      if (sessionStorage.getItem('zipCodeManuallyCleared') === 'true') {
        console.log('Zip code was manually cleared, not auto-populating');
        return false;
      }
      
      return true;
    };
    
    // Only auto-populate zip code for mechanics
    if (shouldAutoPopulate() && currentUserRole === 'mechanic') {
      const storedProfileData = localStorage.getItem('mechanicProfile');
      if (storedProfileData) {
        try {
          const parsedData = JSON.parse(storedProfileData);
          if (parsedData.zipCode) {
            console.log('Found profile zip code:', parsedData.zipCode);
            setZipCode(parsedData.zipCode);
          }
        } catch (error) {
          console.error('Error parsing profile data from localStorage:', error);
        }
      }
    }
  }, [zipCode, setZipCode, currentUserRole]);

  // Ensure mechanics are visible across zip codes when customer is searching
  useEffect(() => {
    if (currentUserRole === 'customer' && mechanics.length === 0 && zipCode) {
      console.log('Customer searching with zip code but no results, suggesting to clear zip code');
      
      if (!sessionStorage.getItem('zipCodeSuggestionShown')) {
        toast({
          title: "No mechanics found in this area",
          description: "Try clearing the zip code to see all available mechanics.",
          duration: 5000
        });
        sessionStorage.setItem('zipCodeSuggestionShown', 'true');
      }
    }
  }, [mechanics.length, zipCode, currentUserRole]);
  
  // Check if user is a customer searching for mechanics
  const isCustomerSearching = currentUserRole === 'customer';
  
  // Ensure we have mechanics to display
  let displayMechanics = mechanics.length > 0 
    ? mechanics 
    : (zipCode ? mechanicsData.filter(m => m.zipCode?.startsWith(zipCode.substring(0, 3))) : mechanicsData);
  
  // If customer is logged in, check if we need to add the vendor mechanic
  if (isCustomerSearching) {
    // Check if vendor mechanic is already included
    const hasVendorMechanic = displayMechanics.some(m => m.id === 'local-mechanic');
    
    if (!hasVendorMechanic) {
      console.log('Adding vendor mechanic for customer view');
      
      // Get stored vendor name and avatar if available
      const vendorName = localStorage.getItem('vendorName') || 'Isai Mercado';
      const vendorAvatar = localStorage.getItem('vendorAvatar') || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
      
      // Add a default vendor mechanic for customer view
      const defaultVendorMechanic = {
        id: 'local-mechanic',
        name: vendorName,
        avatar: vendorAvatar,
        specialties: ['General Repairs', 'Diagnostics', 'Oil Changes'],
        rating: 5.0,
        reviewCount: 12,
        location: locationName || 'Worcester, MA',
        hourlyRate: 75,
        zipCode: zipCode || '01605'
      };
      
      // Add to beginning of list for better visibility
      displayMechanics = [defaultVendorMechanic, ...displayMechanics];
    }
  }

  // Determine if user is a logged in mechanic
  const userRole = localStorage.getItem('userRole');
  const isLoggedInMechanic = userRole === 'mechanic';
  
  return (
    <div className="w-full">
      <p className="text-gray-500 mb-6">
        {zipCode ? 
          `Showing ${displayMechanics.length} mechanics near ${locationDisplay}` : 
          `Showing ${displayMechanics.length} mechanics`
        }
        {isCustomerSearching && displayMechanics.some(m => m.id === 'local-mechanic') && (
          <span className="ml-2 text-primary">(Including your preferred vendor)</span>
        )}
      </p>
      
      {displayMechanics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMechanics.map((mechanic, index) => {
            // Check if this is the logged-in mechanic's profile
            const isCurrentMechanic = mechanic.id === 'local-mechanic';
            
            // For the local mechanic card, we'll wrap it in a Link to the dashboard
            if (isCurrentMechanic && isLoggedInMechanic) {
              return (
                <Link to="/mechanic-dashboard" key={mechanic.id} className="block h-full">
                  <MechanicCard 
                    {...mechanic} 
                    delay={index * 0.1}
                  />
                </Link>
              );
            }
            
            // For all other mechanics, use the normal MechanicCard with its built-in link
            return (
              <MechanicCard 
                key={mechanic.id} 
                {...mechanic} 
                delay={index * 0.1}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No mechanics found</h3>
          <p className="text-gray-500 mb-6">
            {zipCode 
              ? `No mechanics found in the ${locationDisplay} area. Please try a different zip code or clear the zip code to see all mechanics.`
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MechanicsList;
