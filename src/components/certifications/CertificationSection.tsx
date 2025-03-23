
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CertificationForm from './CertificationForm';
import CertificationList from './CertificationList';
import CertificationEmptyState from './CertificationEmptyState';
import { sampleCertifications, emptyCertification, Certification } from './certificationData';

const CertificationSection = () => {
  const [certifications, setCertifications] = useState(sampleCertifications);
  const [isAdding, setIsAdding] = useState(false);
  const [newCertification, setNewCertification] = useState(emptyCertification);

  const handleAddCertification = () => {
    const certification = {
      ...newCertification,
      id: Date.now().toString()
    };
    
    setCertifications([...certifications, certification]);
    setNewCertification(emptyCertification);
    setIsAdding(false);
  };

  const handleDeleteCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Certifications</h3>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)} 
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Certification
          </Button>
        )}
      </div>
      
      {isAdding && (
        <CertificationForm
          newCertification={newCertification}
          setNewCertification={setNewCertification}
          handleAddCertification={handleAddCertification}
          setIsAdding={setIsAdding}
        />
      )}
      
      {certifications.length === 0 && !isAdding ? (
        <CertificationEmptyState onAddClick={() => setIsAdding(true)} />
      ) : (
        <CertificationList 
          certifications={certifications} 
          onDeleteCertification={handleDeleteCertification} 
        />
      )}
    </div>
  );
};

export default CertificationSection;
