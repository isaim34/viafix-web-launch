
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CompletedJobs } from '@/components/mechanic/CompletedJobs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CompletedJobsTab = () => {
  const [completedOffers, setCompletedOffers] = useState([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const getCurrentUserId = () => {
    const supabaseUserId = user?.id;
    const localStorageUserId = localStorage.getItem('userId');
    return localStorageUserId || supabaseUserId || null;
  };

  const mechanicId = getCurrentUserId();

  useEffect(() => {
    if (mechanicId) {
      fetchCompletedOffers();
    }
  }, [mechanicId]);

  const fetchCompletedOffers = async () => {
    if (!mechanicId) return;
    
    try {
      const { data, error } = await supabase
        .from('custom_offers')
        .select('*')
        .eq('mechanic_id', mechanicId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      
      // Convert custom offers to completed job format
      const convertedOffers = (data || []).map(offer => ({
        id: offer.id,
        title: 'Custom Service',
        description: offer.description,
        vehicleType: 'Custom Vehicle', // This could be enhanced with actual vehicle data
        completionDate: offer.completed_at ? new Date(offer.completed_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        imageUrls: [], // Custom offers don't have images yet, but could be added
        customerName: 'Customer', // This could be enhanced with actual customer name
        customerMaintenanceRecord: null // This could be linked to actual maintenance records
      }));
      
      setCompletedOffers(convertedOffers);
    } catch (error) {
      console.error('Error fetching completed custom offers:', error);
      toast({
        title: "Error",
        description: "Failed to load completed custom offers",
        variant: "destructive"
      });
    }
  };

  // Sample completed job data (in a real app, this would come from a database)
  const sampleCompletedJobs = [
    {
      id: '1',
      title: 'Timing Belt Replacement',
      description: 'Replaced timing belt and water pump on a Honda Accord with 120,000 miles.',
      vehicleType: '2015 Honda Accord',
      completionDate: '2023-06-15',
      imageUrls: [
        'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1000&auto=format&fit=crop'
      ],
      customerName: 'John D.',
      customerMaintenanceRecord: {
        id: 'maint-1',
        date: '2023-06-15',
        vehicle: '2015 Honda Accord',
        vin: 'JH4KA7670MC033114',
        serviceType: 'Timing Belt Replacement',
        description: 'Replaced timing belt and water pump. Also changed coolant and checked accessory belts.',
        mechanic: 'James Wilson',
        mechanicSignature: true,
        mechanicNotes: ['Customer reported occasional squeaking noise', 'Recommended coolant flush next service']
      }
    },
    {
      id: '2',
      title: 'Brake System Overhaul',
      description: 'Complete brake system replacement including rotors, calipers, and pads.',
      vehicleType: '2018 Toyota Camry',
      completionDate: '2023-07-22',
      imageUrls: [
        'https://images.unsplash.com/photo-1597987072661-38ed5f617808?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592053104090-a3be784b5329?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1000&auto=format&fit=crop'
      ],
      customerName: 'Sarah M.',
      customerMaintenanceRecord: {
        id: 'maint-2',
        date: '2023-07-22',
        vehicle: '2018 Toyota Camry',
        vin: '4T1BF1FK7CU513879',
        serviceType: 'Brake System Replacement',
        description: 'Replaced front and rear brake pads, rotors, and calipers. Flushed brake fluid and bled system.',
        mechanic: 'James Wilson',
        mechanicSignature: true,
        mechanicNotes: ['Customer reported vibration when braking', 'All brake components were significantly worn']
      }
    }
  ];

  // Combine sample jobs with completed custom offers
  const allCompletedJobs = [...sampleCompletedJobs, ...completedOffers];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Completed Jobs</h2>
      <p className="text-muted-foreground mb-8">
        Showcase your best work to attract more customers and build trust. Add photos and details of your completed repair jobs and custom services.
      </p>
      
      <CompletedJobs 
        jobs={allCompletedJobs} 
        mechanicId={mechanicId || "1"}
      />
    </Card>
  );
};

export default CompletedJobsTab;
