
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Education, NewEducation } from '@/types/education';
import { sampleEducation } from '@/data/educationData';
import EducationForm from './EducationForm';
import EducationEmptyState from './EducationEmptyState';
import EducationList from './EducationList';

const EducationSection = () => {
  const [education, setEducation] = useState<Education[]>(sampleEducation);
  const [isAdding, setIsAdding] = useState(false);
  const [newEducation, setNewEducation] = useState<NewEducation>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleAddEducation = () => {
    const educationItem: Education = {
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
        <EducationForm
          newEducation={newEducation}
          setNewEducation={setNewEducation}
          onCancel={() => setIsAdding(false)}
          onSave={handleAddEducation}
        />
      )}
      
      {education.length === 0 && !isAdding ? (
        <EducationEmptyState onAddClick={() => setIsAdding(true)} />
      ) : (
        <EducationList 
          educationList={education} 
          onDeleteEducation={handleDeleteEducation}
        />
      )}
    </div>
  );
};

export default EducationSection;
