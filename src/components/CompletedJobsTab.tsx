
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CompletedJobs } from '@/components/mechanic/CompletedJobs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CompletedJob {
  id: string;
  title: string;
  description: string;
  vehicleType: string;
  completionDate: string;
  imageUrls: string[];
  customerName: string;
  customerMaintenanceRecord?: any;
}

const CompletedJobsTab = () => {
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const mechanicId = user?.id;

  useEffect(() => {
    if (mechanicId) {
      fetchCompletedJobs();
    }
  }, [mechanicId]);

  const fetchCompletedJobs = async () => {
    if (!mechanicId) return;
    
    setIsLoading(true);
    try {
      // Fetch completed service bookings
      const { data: completedBookings, error: bookingsError } = await supabase
        .from('service_bookings')
        .select(`
          id,
          service_name,
          completed_at,
          completion_notes,
          vehicle_info,
          customer_id,
          profiles!inner(first_name, last_name)
        `)
        .eq('mechanic_id', mechanicId)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch completed custom offers
      const { data: completedOffers, error: offersError } = await supabase
        .from('custom_offers')
        .select(`
          id,
          description,
          completed_at,
          completion_notes,
          customer_id
        `)
        .eq('mechanic_id', mechanicId)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (offersError) throw offersError;

      // Convert bookings to completed jobs format
      const bookingJobs: CompletedJob[] = (completedBookings || []).map(booking => ({
        id: booking.id,
        title: booking.service_name,
        description: booking.completion_notes || `Completed ${booking.service_name} service`,
        vehicleType: booking.vehicle_info || 'Customer Vehicle',
        completionDate: new Date(booking.completed_at).toISOString().split('T')[0],
        imageUrls: [], // Could be enhanced with actual job photos
        customerName: `${booking.profiles?.first_name || 'Customer'} ${booking.profiles?.last_name || ''}`.trim(),
        customerMaintenanceRecord: null
      }));

      // Convert offers to completed jobs format
      const offerJobs: CompletedJob[] = (completedOffers || []).map(offer => ({
        id: offer.id,
        title: 'Custom Service',
        description: offer.description,
        vehicleType: 'Custom Vehicle',
        completionDate: new Date(offer.completed_at).toISOString().split('T')[0],
        imageUrls: [],
        customerName: 'Customer', // Could be enhanced with actual customer name
        customerMaintenanceRecord: null
      }));

      // Combine and sort all completed jobs
      const allJobs = [...bookingJobs, ...offerJobs].sort((a, b) => 
        new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()
      );
      
      setCompletedJobs(allJobs);
    } catch (error) {
      console.error('Error fetching completed jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load completed jobs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading completed jobs...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Completed Jobs</h2>
      <p className="text-muted-foreground mb-8">
        Showcase your best work to attract more customers and build trust. View your completed repair jobs and custom services.
      </p>
      
      <CompletedJobs 
        jobs={completedJobs} 
        mechanicId={mechanicId || ""}
      />
    </Card>
  );
};

export default CompletedJobsTab;
