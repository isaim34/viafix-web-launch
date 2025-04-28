import React from 'react';
import { Card } from '@/components/ui/card';
import { CompletedJobs } from '@/components/mechanic/CompletedJobs';
import { useAuth } from '@/hooks/useAuth';
import { MaintenanceRecord } from '@/types/customer';

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

const CompletedJobsTab = () => {
  // Use the auth context with the correct property
  const auth = useAuth();
  
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Completed Jobs</h2>
      <p className="text-muted-foreground mb-8">
        Showcase your best work to attract more customers and build trust. Add photos and details of your completed repair jobs.
      </p>
      
      <CompletedJobs 
        jobs={sampleCompletedJobs} 
        mechanicId="1" // In a real app, this would be the actual mechanic ID
      />
    </Card>
  );
};

export default CompletedJobsTab;
