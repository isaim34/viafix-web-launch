
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NewEducation } from '@/types/education';

interface EducationFormProps {
  newEducation: NewEducation;
  setNewEducation: (education: NewEducation) => void;
  onCancel: () => void;
  onSave: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  newEducation,
  setNewEducation,
  onCancel,
  onSave
}) => {
  return (
    <Card className="p-6 border-dashed">
      <CardContent className="p-0 space-y-4">
        <div>
          <Label htmlFor="edu-institution">Institution</Label>
          <Input 
            id="edu-institution"
            value={newEducation.institution}
            onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
            placeholder="e.g. Universal Technical Institute"
          />
        </div>
        
        <div>
          <Label htmlFor="edu-degree">Degree/Program</Label>
          <Input 
            id="edu-degree"
            value={newEducation.degree}
            onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
            placeholder="e.g. Automotive Technology Program"
          />
        </div>
        
        <div>
          <Label htmlFor="edu-field">Field of Study</Label>
          <Input 
            id="edu-field"
            value={newEducation.fieldOfStudy}
            onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})}
            placeholder="e.g. Automotive Technology"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edu-start-date">Start Date</Label>
            <Input 
              id="edu-start-date"
              type="date"
              value={newEducation.startDate}
              onChange={(e) => setNewEducation({...newEducation, startDate: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="edu-end-date">End Date (leave blank if currently attending)</Label>
            <Input 
              id="edu-end-date"
              type="date"
              value={newEducation.endDate}
              onChange={(e) => setNewEducation({...newEducation, endDate: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="edu-description">Description (optional)</Label>
          <Textarea 
            id="edu-description"
            value={newEducation.description}
            onChange={(e) => setNewEducation({...newEducation, description: e.target.value})}
            placeholder="Describe what you learned or specialized in..."
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Add Education
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationForm;
