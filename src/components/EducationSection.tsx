
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, X, GraduationCap, Calendar } from 'lucide-react';

// Sample education data
const sampleEducation = [
  {
    id: '1',
    institution: 'Universal Technical Institute',
    degree: 'Automotive Technology Program',
    fieldOfStudy: 'Automotive Technology',
    startDate: '2012-09-01',
    endDate: '2014-05-15',
    description: 'Comprehensive automotive training program covering all vehicle systems and repair procedures.'
  },
  {
    id: '2',
    institution: 'Ford ASSET Program',
    degree: 'Ford Automotive Student Service Educational Training',
    fieldOfStudy: 'Ford-specific technologies',
    startDate: '2014-08-15',
    endDate: '2015-12-20',
    description: 'Specialized training in Ford vehicle systems, diagnostics, and repair procedures.'
  }
];

const EducationSection = () => {
  const [education, setEducation] = useState(sampleEducation);
  const [isAdding, setIsAdding] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleAddEducation = () => {
    const educationItem = {
      ...newEducation,
      id: Date.now().toString()
    };
    
    setEducation([...education, educationItem]);
    setNewEducation({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setIsAdding(false);
  };

  const handleDeleteEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Education & Training</h3>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)} 
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Education
          </Button>
        )}
      </div>
      
      {isAdding && (
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
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEducation}>
                Add Education
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {education.length === 0 && !isAdding ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">You haven't added any education or training yet</p>
          <Button 
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Add Your First Education Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <Card key={edu.id} className="overflow-hidden">
              <div className="p-6 flex justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">{edu.institution}</h4>
                  </div>
                  <p className="text-sm mb-1">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground mb-2">{edu.fieldOfStudy}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(edu.startDate).toLocaleDateString()} - 
                      {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                    </span>
                  </div>
                  
                  {edu.description && (
                    <p className="text-sm text-muted-foreground">{edu.description}</p>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationSection;
