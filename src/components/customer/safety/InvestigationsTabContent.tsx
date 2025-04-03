
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle } from 'lucide-react';
import { Investigation } from '@/types/customer';
import EmptyTabContent from './EmptyTabContent';
import SafetyItemCard from './SafetyItemCard';

interface InvestigationsTabContentProps {
  investigations: Investigation[];
  onExternalLink: (type: string, id: string) => void;
}

const InvestigationsTabContent = ({ investigations, onExternalLink }: InvestigationsTabContentProps) => {
  if (investigations.length === 0) {
    return (
      <EmptyTabContent 
        icon={AlertTriangle} 
        title="No Investigations Found"
        description="No safety investigations were found for this vehicle."
      />
    );
  }

  return (
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
              <SafetyItemCard
                title="Investigation Details"
                description=""
                date={`Opened: ${investigation.openDate}`}
                content={[
                  { label: "Summary", value: investigation.summary }
                ]}
                itemId={investigation.actionNumber}
                itemType="investigation"
                onExternalLink={onExternalLink}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};

export default InvestigationsTabContent;
