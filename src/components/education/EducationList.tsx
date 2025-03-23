
import React from 'react';
import EducationItem from './EducationItem';
import { Education } from '@/types/education';

interface EducationListProps {
  educationList: Education[];
  onDeleteEducation: (id: string) => void;
}

const EducationList: React.FC<EducationListProps> = ({ 
  educationList, 
  onDeleteEducation 
}) => {
  return (
    <div className="space-y-4">
      {educationList.map((edu) => (
        <EducationItem 
          key={edu.id} 
          education={edu} 
          onDelete={onDeleteEducation} 
        />
      ))}
    </div>
  );
};

export default EducationList;
