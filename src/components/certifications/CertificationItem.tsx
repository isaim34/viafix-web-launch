
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award, Calendar, X } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  description: string;
}

interface CertificationItemProps {
  certification: Certification;
  onDelete: (id: string) => void;
}

const CertificationItem: React.FC<CertificationItemProps> = ({ certification, onDelete }) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 flex justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">{certification.name}</h4>
          </div>
          <p className="text-sm mb-2">{certification.issuer}</p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Issued: {new Date(certification.issueDate).toLocaleDateString()}</span>
            </div>
            
            {certification.expirationDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Expires: {new Date(certification.expirationDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {certification.description && (
            <p className="text-sm text-muted-foreground">{certification.description}</p>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(certification.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default CertificationItem;
