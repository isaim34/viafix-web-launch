
import React from 'react';
import CertificationItem from './CertificationItem';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  description: string;
}

interface CertificationListProps {
  certifications: Certification[];
  onDeleteCertification: (id: string) => void;
}

const CertificationList: React.FC<CertificationListProps> = ({ 
  certifications, 
  onDeleteCertification 
}) => {
  return (
    <div className="space-y-4">
      {certifications.map((cert) => (
        <CertificationItem 
          key={cert.id} 
          certification={cert} 
          onDelete={onDeleteCertification} 
        />
      ))}
    </div>
  );
};

export default CertificationList;
