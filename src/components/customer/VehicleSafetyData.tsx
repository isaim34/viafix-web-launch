
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, AlertCircle, Search, AlertTriangle, Wrench, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Recall, Complaint, Investigation } from '@/types/customer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface VehicleSafetyDataProps {
  recalls: Recall[];
  complaints: Complaint[];
  investigations: Investigation[];
  loading?: boolean;
  error?: string | null;
  onOpenExternalLink?: (type: string, id: string) => void;
}

export const VehicleSafetyData = ({
  recalls,
  complaints,
  investigations,
  loading = false,
  error = null,
  onOpenExternalLink
}: VehicleSafetyDataProps) => {
  const [activeTab, setActiveTab] = useState("recalls");
  
  const recallCount = recalls?.length || 0;
  const complaintCount = complaints?.length || 0;
  const investigationCount = investigations?.length || 0;
  
  const handleExternalLink = (type: string, id: string) => {
    if (onOpenExternalLink) {
      onOpenExternalLink(type, id);
    } else {
      let url = "";
      
      switch (type) {
        case "recall":
          url = `https://www.nhtsa.gov/recalls?nhtsaId=${id}`;
          break;
        case "complaint":
          url = `https://www.nhtsa.gov/vehicle/complaints?odi=${id}`;
          break;
        case "investigation":
          url = `https://www.nhtsa.gov/vehicle/investigations?odi=${id}`;
          break;
      }
      
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }
  };
  
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  const hasNoData = recallCount === 0 && complaintCount === 0 && investigationCount === 0;
  
  if (hasNoData) {
    return (
      <Alert>
        <Search className="h-4 w-4" />
        <AlertTitle>No Safety Data Found</AlertTitle>
        <AlertDescription>
          No recalls, complaints, or investigations were found for this vehicle.
          This could mean the vehicle has no reported issues, or the data could be unavailable.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="mt-4">
      {recallCount > 0 && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <ShieldAlert className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700">Active Recalls Found</AlertTitle>
          <AlertDescription className="text-red-600">
            {recallCount} recall{recallCount !== 1 ? 's' : ''} found for this vehicle. 
            Please contact your dealership to schedule necessary repairs.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="recalls" className="relative">
            Recalls
            {recallCount > 0 && (
              <Badge variant="destructive" className="ml-2 absolute -top-1 -right-1">
                {recallCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="complaints" className="relative">
            Complaints
            {complaintCount > 0 && (
              <Badge variant="secondary" className="ml-2 absolute -top-1 -right-1">
                {complaintCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="investigations" className="relative">
            Investigations
            {investigationCount > 0 && (
              <Badge variant="outline" className="ml-2 absolute -top-1 -right-1">
                {investigationCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recalls" className="mt-4">
          {recallCount === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <Wrench className="mx-auto h-12 w-12 mb-4 text-muted-foreground/70" />
                  <h3 className="text-lg font-medium mb-2">No Recalls Found</h3>
                  <p className="text-muted-foreground">No active recalls were found for this vehicle.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[400px]">
              <Accordion type="single" collapsible className="w-full">
                {recalls.map((recall) => (
                  <AccordionItem key={recall.id} value={recall.id}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 text-left">
                      <div>
                        <div className="font-medium">{recall.component}</div>
                        <div className="text-sm text-muted-foreground">Campaign: {recall.campNo}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <Card className="border-red-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Recall Details</CardTitle>
                          <CardDescription>
                            Reported Date: {recall.reportedDate}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm">Summary</h4>
                            <p className="mt-1">{recall.summary}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm">Consequences</h4>
                            <p className="mt-1">{recall.consequence || "Not specified"}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm">Remedy</h4>
                            <p className="mt-1">{recall.remedy}</p>
                          </div>
                          
                          {recall.notes && (
                            <div>
                              <h4 className="font-semibold text-sm">Additional Notes</h4>
                              <p className="mt-1">{recall.notes}</p>
                            </div>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => handleExternalLink("recall", recall.campNo)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on NHTSA Website
                          </Button>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          )}
        </TabsContent>
        
        <TabsContent value="complaints" className="mt-4">
          {complaintCount === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground/70" />
                  <h3 className="text-lg font-medium mb-2">No Complaints Found</h3>
                  <p className="text-muted-foreground">No complaints were found for this vehicle.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[400px]">
              <Accordion type="single" collapsible className="w-full">
                {complaints.map((complaint) => (
                  <AccordionItem key={complaint.id} value={complaint.id}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 text-left">
                      <div>
                        <div className="font-medium">{complaint.component}</div>
                        <div className="text-sm text-muted-foreground">ODI: {complaint.odiNumber}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Complaint Details</CardTitle>
                          <CardDescription>
                            Date: {complaint.dateAdded} | Failure Date: {complaint.failureDate}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div>
                            <h4 className="font-semibold text-sm">Description</h4>
                            <p className="mt-1">{complaint.summary}</p>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => handleExternalLink("complaint", complaint.odiNumber)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on NHTSA Website
                          </Button>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          )}
        </TabsContent>
        
        <TabsContent value="investigations" className="mt-4">
          {investigationCount === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <AlertTriangle className="mx-auto h-12 w-12 mb-4 text-muted-foreground/70" />
                  <h3 className="text-lg font-medium mb-2">No Investigations Found</h3>
                  <p className="text-muted-foreground">No safety investigations were found for this vehicle.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[400px]">
              <Accordion type="single" collapsible className="w-full">
                {investigations.map((investigation) => (
                  <AccordionItem key={investigation.id} value={investigation.id}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 text-left">
                      <div>
                        <div className="font-medium">{investigation.componentDescription}</div>
                        <div className="text-sm text-muted-foreground">
                          {investigation.investigationType} | Action: {investigation.actionNumber}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Investigation Details</CardTitle>
                          <CardDescription>
                            Opened: {investigation.openDate}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div>
                            <h4 className="font-semibold text-sm">Summary</h4>
                            <p className="mt-1">{investigation.summary}</p>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => handleExternalLink("investigation", investigation.actionNumber)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on NHTSA Website
                          </Button>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleSafetyData;
