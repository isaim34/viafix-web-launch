
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GraduationCap, Calendar, X } from 'lucide-react';
import { Education } from '@/types/education';

interface EducationItemProps {
  education: Education;
  onDelete: (id: string) => void;
}

const EducationItem: React.FC<EducationItemProps> = ({ education, onDelete }) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 flex justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">{education.institution}</h4>
          </div>
          <p className="text-sm mb-1">{education.degree}</p>
          <p className="text-sm text-muted-foreground mb-2">{education.fieldOfStudy}</p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(education.startDate).toLocaleDateString()} - 
              {education.endDate ? new Date(education.endDate).toLocaleDateString() : 'Present'}
            </span>
          </div>
          
          {education.description && (
            <p className="text-sm text-muted-foreground">{education.description}</p>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(education.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default EducationItem;
