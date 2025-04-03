
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Wrench } from 'lucide-react';
import { Recall } from '@/types/customer';
import EmptyTabContent from './EmptyTabContent';
import SafetyItemCard from './SafetyItemCard';

interface RecallsTabContentProps {
  recalls: Recall[];
  onExternalLink: (type: string, id: string) => void;
}

const RecallsTabContent = ({ recalls, onExternalLink }: RecallsTabContentProps) => {
  if (recalls.length === 0) {
    return (
      <EmptyTabContent 
        icon={Wrench} 
        title="No Recalls Found"
        description="No active recalls were found for this vehicle."
      />
    );
  }

  return (
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
              <SafetyItemCard
                title="Recall Details"
                description={`Campaign: ${recall.campNo}`}
                date={`Reported Date: ${recall.reportedDate}`}
                content={[
                  { label: "Summary", value: recall.summary },
                  { label: "Consequences", value: recall.consequence },
                  { label: "Remedy", value: recall.remedy },
                  { label: "Additional Notes", value: recall.notes }
                ]}
                itemId={recall.campNo}
                itemType="recall"
                onExternalLink={onExternalLink}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};

export default RecallsTabContent;
