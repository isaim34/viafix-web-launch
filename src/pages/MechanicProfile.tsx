
import React from 'react';
import { Layout } from '@/components/Layout';
import { useMechanicData } from '@/hooks/useMechanicData';
import { MechanicProfileLeftColumn } from '@/components/mechanic/MechanicProfileLeftColumn';
import { MechanicProfileRightColumn } from '@/components/mechanic/MechanicProfileRightColumn';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { Service } from '@/types/mechanic';
import { Loader2 } from 'lucide-react';
import ReportMechanicDialog from '@/components/mechanic/ReportMechanicDialog';

const MechanicProfile = () => {
  const { mechanic, loading } = useMechanicData();
  const { isCustomerLoggedIn } = useCustomerAuth();
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);
  const [isReporting, setIsReporting] = React.useState(false);

  const handleSelectService = (service: Service | null) => {
    setSelectedService(service);
  };

  const handleReportMechanic = () => {
    setIsReporting(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MechanicProfileLeftColumn
            mechanic={mechanic}
            isCustomerLoggedIn={isCustomerLoggedIn}
            onSelectService={handleSelectService}
            onReportMechanic={handleReportMechanic}
          />
          
          <MechanicProfileRightColumn 
            mechanic={mechanic}
            selectedService={selectedService}
            isCustomerLoggedIn={isCustomerLoggedIn}
          />
        </div>
        
        <ReportMechanicDialog
          open={isReporting}
          onOpenChange={setIsReporting}
          mechanicName={mechanic.name}
          mechanicId={mechanic.id}
        />
      </div>
    </Layout>
  );
};

export default MechanicProfile;
