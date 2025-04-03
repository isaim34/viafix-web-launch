
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle } from 'lucide-react';
import { Complaint } from '@/types/customer';
import EmptyTabContent from './EmptyTabContent';
import SafetyItemCard from './SafetyItemCard';

interface ComplaintsTabContentProps {
  complaints: Complaint[];
  onExternalLink: (type: string, id: string) => void;
}

const ComplaintsTabContent = ({ complaints, onExternalLink }: ComplaintsTabContentProps) => {
  if (complaints.length === 0) {
    return (
      <EmptyTabContent 
        icon={AlertCircle} 
        title="No Complaints Found"
        description="No complaints were found for this vehicle."
      />
    );
  }

  return (
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
              <SafetyItemCard
                title="Complaint Details"
                description=""
                date={`Date: ${complaint.dateAdded} | Failure Date: ${complaint.failureDate}`}
                content={[
                  { label: "Description", value: complaint.summary }
                ]}
                itemId={complaint.odiNumber}
                itemType="complaint"
                onExternalLink={onExternalLink}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};

export default ComplaintsTabContent;
