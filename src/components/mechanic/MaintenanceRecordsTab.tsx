
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, FileText, User, Calendar, Wrench } from 'lucide-react';
import { MaintenanceRecordForm } from './MaintenanceRecordForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MaintenanceRecord {
  id: string;
  customer_id: string;
  service_type: string;
  description: string;
  date: string;
  mechanic_signature: boolean;
  vehicle_id?: string;
}

const MaintenanceRecordsTab = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  const fetchMaintenanceRecords = async () => {
    try {
      setIsLoading(true);
      const mechanicId = localStorage.getItem('userId');
      
      if (!mechanicId) {
        console.log('No mechanic ID found');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('mechanic_id', mechanicId)
        .order('date', { ascending: false });

      if (error) throw error;

      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      toast({
        title: "Error",
        description: "Failed to load maintenance records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchMaintenanceRecords();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Maintenance Records</h2>
          <p className="text-muted-foreground">
            Track and manage service records for your customers
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Record
        </Button>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="text-center py-20">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-muted-foreground">No maintenance records yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first maintenance record to start tracking your work
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      {record.service_type}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(record.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Customer ID: {record.customer_id}
                      </span>
                    </CardDescription>
                  </div>
                  {record.mechanic_signature && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Signed Off
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-sm">Service Description</h4>
                    <p className="text-sm text-muted-foreground">{record.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Maintenance Record</DialogTitle>
          </DialogHeader>
          <MaintenanceRecordForm
            customerId="test-customer" // For test purposes
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceRecordsTab;
