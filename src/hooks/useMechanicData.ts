
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MechanicDetail } from '@/types/mechanic';
import { mechanicsDetailedData } from '@/data/mechanicsData';

/**
 * Custom hook to fetch and prepare mechanic data based on ID
 */
export const useMechanicData = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Check if user is logged in as a mechanic
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const isLoggedInMechanic = userRole === 'mechanic';
    
    // If the user is a mechanic and trying to view a mechanic profile,
    // redirect them to their dashboard if it's their own profile (local-mechanic)
    if (isLoggedInMechanic && id === 'local-mechanic') {
      navigate('/mechanic-dashboard');
      return;
    }
  }, [id, navigate]);
  
  // Get mechanic data based on the ID
  const getMechanicData = (): MechanicDetail => {
    // If it's a default vendor or local mechanic profile with no matching entry in mechanicsDetailedData
    if ((id === 'default-vendor' || id === 'local-mechanic')) {
      const vendorName = localStorage.getItem('vendorName') || 'Isai Mercado';
      const vendorAvatar = localStorage.getItem('vendorAvatar') || 
                     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
      
      // Get mechanic profile from localStorage if available
      const storedProfile = localStorage.getItem('mechanicProfile');
      let mechanicProfile: Partial<MechanicDetail> = {};
      
      if (storedProfile) {
        try {
          mechanicProfile = JSON.parse(storedProfile);
        } catch (error) {
          console.error('Error parsing mechanic profile:', error);
        }
      }
      
      // Handle specialties based on its type
      let specialties: string[] = ['General Repairs', 'Diagnostics']; // Default specialties
      
      if (mechanicProfile.specialties) {
        // Fixed TypeScript error by properly typing the specialties value before using split
        const specialtiesValue = mechanicProfile.specialties;
        
        // Use type assertion to tell TypeScript that specialtiesValue can be a string
        if (typeof specialtiesValue === 'string') {
          // If it's a string, split it by commas
          specialties = specialtiesValue.split(',').map(s => s.trim());
        } else if (Array.isArray(specialtiesValue)) {
          // If it's already an array, use it directly
          specialties = specialtiesValue as string[];
        }
      }
      
      // Create custom mechanic data for the local/default mechanic
      return {
        id: id || 'local-mechanic',
        name: vendorName,
        avatar: vendorAvatar,
        specialties: specialties,
        rating: 5.0,
        reviewCount: 12,
        location: mechanicProfile.location || 'Worcester, MA',
        hourlyRate: mechanicProfile.hourlyRate || 75,
        yearsExperience: mechanicProfile.yearsExperience || 5,
        about: mechanicProfile.about || "Certified mechanic specializing in general vehicle maintenance and repairs. I provide honest, reliable service at competitive rates.",
        responseTime: "Under 1 hour",
        services: [
          { name: "Diagnostic Scan", price: 75 },
          { name: "Oil Change", price: 65 },
          { name: "Brake Inspection", price: 45 },
          { name: "General Tune-Up", price: 120 }
        ],
        reviews: [
          { author: "Customer", rating: 5, text: "Very professional and knowledgeable. Highly recommended!" }
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1632931612869-c1a971a02054?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        ]
      };
    }
    
    // Try to get mechanic data from mechanicsDetailedData
    if (id && mechanicsDetailedData[id]) {
      return mechanicsDetailedData[id];
    }
    
    // Default to first mechanic only if nothing else works
    return mechanicsDetailedData['1'];
  };
  
  const mechanic = getMechanicData();

  // Log the selected mechanic for debugging
  console.log('Selected mechanic profile:', {
    id: id,
    mechanicId: mechanic.id,
    mechanicName: mechanic.name
  });
  
  return { mechanic, id };
};
