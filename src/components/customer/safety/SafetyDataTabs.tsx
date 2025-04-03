
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, AlertCircle, AlertTriangle } from 'lucide-react';
import { Recall, Complaint, Investigation } from '@/types/customer';
import RecallsTabContent from './RecallsTabContent';
import ComplaintsTabContent from './ComplaintsTabContent';
import InvestigationsTabContent from './InvestigationsTabContent';
import SafetyDataAlert from './SafetyDataAlert';

interface SafetyDataTabsProps {
  recalls: Recall[];
  complaints: Complaint[];
  investigations: Investigation[];
  onExternalLink?: (type: string, id: string) => void;
}

const SafetyDataTabs = ({
  recalls,
  complaints,
  investigations,
  onExternalLink = () => {},
}: SafetyDataTabsProps) => {
  const [activeTab, setActiveTab] = useState("recalls");
  
  const recallCount = recalls.length;
  const complaintCount = complaints.length;
  const investigationCount = investigations.length;
  
  return (
    <div className="mt-4">
      <SafetyDataAlert recallCount={recallCount} />
      
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
          <RecallsTabContent recalls={recalls} onExternalLink={onExternalLink} />
        </TabsContent>
        
        <TabsContent value="complaints" className="mt-4">
          <ComplaintsTabContent complaints={complaints} onExternalLink={onExternalLink} />
        </TabsContent>
        
        <TabsContent value="investigations" className="mt-4">
          <InvestigationsTabContent investigations={investigations} onExternalLink={onExternalLink} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SafetyDataTabs;
