
import React from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/ui/card';

interface MechanicReportCardProps {
  onReportMechanic: () => void;
}

export const MechanicReportCard = ({ onReportMechanic }: MechanicReportCardProps) => {
  return (
    <Card className="border-muted">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-medium">Have an issue with this mechanic?</h3>
            <p className="text-sm text-muted-foreground">
              If you've experienced unprofessional behavior or poor service, let us know.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="text-destructive border-destructive hover:bg-destructive/10 w-full sm:w-auto"
            icon={<Flag className="w-4 h-4" />}
            onClick={onReportMechanic}
          >
            Report Mechanic
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
