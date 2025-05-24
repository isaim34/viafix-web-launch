import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Clock, DollarSign, MessageCircle, User, CheckCircle, XCircle, FileText, Check } from 'lucide-react';
import { MaintenanceRecordForm } from './MaintenanceRecordForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CustomOffer {
  id: string;
  customer_id: string;
  description: string;
  budget: string;
  timeframe: string;
  preferred_date: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  created_at: string;
}

interface ExistingMaintenanceRecord {
  id: string;
  service_type: string;
  description: string;
  vehicle_info: string;
  date: string;
}

const CustomOffersTab = () => {
  const [offers, setOffers] = useState<CustomOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<CustomOffer | null>(null);
  const [existingMaintenanceRecord, setExistingMaintenanceRecord] = useState<ExistingMaintenanceRecord | null>(null);
  const [customerVehicle, setCustomerVehicle] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getCurrentUserId = () => {
    const supabaseUserId = user?.id;
    const localStorageUserId = localStorage.getItem('userId');
    return localStorageUserId || supabaseUserId || null;
  };

  const mechanicId = getCurrentUserId();

  useEffect(() => {
    if (mechanicId) {
      fetchOffers();
    }
  }, [mechanicId]);

  const fetchOffers = async () => {
    if (!mechanicId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('custom_offers')
        .select('*')
        .eq('mechanic_id', mechanicId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure status field matches our interface
      const typedOffers: CustomOffer[] = (data || []).map(offer => ({
        ...offer,
        status: offer.status as 'pending' | 'accepted' | 'declined' | 'completed'
      }));
      
      setOffers(typedOffers);
    } catch (error) {
      console.error('Error fetching custom offers:', error);
      toast({
        title: "Error",
        description: "Failed to load custom offers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOfferStatus = async (offerId: string, status: 'accepted' | 'declined' | 'completed') => {
    try {
      const updateData: any = { status };
      
      // If completing the offer, add completion timestamp
      if (status === 'completed') {
        updateData.updated_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('custom_offers')
        .update(updateData)
        .eq('id', offerId);

      if (error) throw error;

      setOffers(prev => prev.map(offer => 
        offer.id === offerId ? { ...offer, status } : offer
      ));

      const statusText = status === 'accepted' ? 'Accepted' : status === 'declined' ? 'Declined' : 'Completed';
      toast({
        title: `Offer ${statusText}`,
        description: `You have ${status} the custom service request.`,
      });
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast({
        title: "Error",
        description: "Failed to update offer status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchCustomerMaintenanceAndVehicle = async (customerId: string) => {
    try {
      // Fetch customer's most recent maintenance record
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('customer_id', customerId)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (maintenanceError && maintenanceError.code !== 'PGRST116') {
        throw maintenanceError;
      }

      // Fetch customer's vehicle information
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('owner_id', customerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (vehicleError && vehicleError.code !== 'PGRST116') {
        throw vehicleError;
      }

      return { maintenanceRecord: maintenanceData, vehicle: vehicleData };
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return { maintenanceRecord: null, vehicle: null };
    }
  };

  const handleCompleteOffer = async (offer: CustomOffer) => {
    setSelectedOffer(offer);
    
    // Check if customer has existing maintenance records and vehicle info
    const { maintenanceRecord, vehicle } = await fetchCustomerMaintenanceAndVehicle(offer.customer_id);
    
    setExistingMaintenanceRecord(maintenanceRecord);
    setCustomerVehicle(vehicle);
    setShowMaintenanceForm(true);
  };

  const handleMaintenanceRecordSuccess = () => {
    if (selectedOffer) {
      updateOfferStatus(selectedOffer.id, 'completed');
    }
    setShowMaintenanceForm(false);
    setSelectedOffer(null);
    setExistingMaintenanceRecord(null);
    setCustomerVehicle(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filterOffersByStatus = (status: string) => {
    if (status === 'all') return offers;
    return offers.filter(offer => offer.status === status);
  };

  const OfferCard = ({ offer }: { offer: CustomOffer }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Request
            </CardTitle>
            <CardDescription>
              Submitted {formatDate(offer.created_at)}
            </CardDescription>
          </div>
          <Badge variant="outline" className={getStatusColor(offer.status)}>
            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium text-sm">Service Description</p>
              <p className="text-sm text-muted-foreground">{offer.description}</p>
            </div>
          </div>
          
          {offer.budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium text-sm">Budget: </span>
                <span className="text-sm">{offer.budget}</span>
              </div>
            </div>
          )}
          
          {offer.timeframe && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium text-sm">Timeframe: </span>
                <span className="text-sm">{offer.timeframe}</span>
              </div>
            </div>
          )}
          
          {offer.preferred_date && (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium text-sm">Preferred Date: </span>
                <span className="text-sm">{offer.preferred_date}</span>
              </div>
            </div>
          )}
        </div>
        
        {offer.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => updateOfferStatus(offer.id, 'accepted')}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Accept
            </Button>
            <Button 
              variant="outline"
              onClick={() => updateOfferStatus(offer.id, 'declined')}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Decline
            </Button>
            <Button 
              variant="ghost"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Message Customer
            </Button>
          </div>
        )}

        {offer.status === 'accepted' && (
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => handleCompleteOffer(offer)}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Complete Service
            </Button>
            <Button 
              variant="ghost"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Message Customer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Custom Service Requests</h2>
          <p className="text-muted-foreground">
            Manage custom service requests from customers
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All ({offers.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({filterOffersByStatus('pending').length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({filterOffersByStatus('accepted').length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({filterOffersByStatus('completed').length})
            </TabsTrigger>
            <TabsTrigger value="declined">
              Declined ({filterOffersByStatus('declined').length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {offers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-20">
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-muted-foreground">No custom service requests yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Custom requests from customers will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div>
                {offers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <div>
              {filterOffersByStatus('pending').map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="accepted" className="mt-6">
            <div>
              {filterOffersByStatus('accepted').map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <div>
              {filterOffersByStatus('completed').map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="declined" className="mt-6">
            <div>
              {filterOffersByStatus('declined').map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showMaintenanceForm} onOpenChange={setShowMaintenanceForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {existingMaintenanceRecord 
                ? 'Add Work to Existing Maintenance Record' 
                : 'Complete Service & Create Maintenance Record'
              }
            </DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <MaintenanceRecordForm
              customerId={selectedOffer.customer_id}
              serviceName="Custom Service"
              existingMaintenanceRecord={existingMaintenanceRecord}
              customerVehicle={customerVehicle}
              customOfferId={selectedOffer.id}
              onSuccess={handleMaintenanceRecordSuccess}
              onCancel={() => {
                setShowMaintenanceForm(false);
                setSelectedOffer(null);
                setExistingMaintenanceRecord(null);
                setCustomerVehicle(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomOffersTab;
