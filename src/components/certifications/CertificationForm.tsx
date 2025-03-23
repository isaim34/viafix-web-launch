
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CertificationFormProps {
  newCertification: {
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate: string;
    description: string;
  };
  setNewCertification: React.Dispatch<React.SetStateAction<{
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate: string;
    description: string;
  }>>;
  handleAddCertification: () => void;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}

const CertificationForm: React.FC<CertificationFormProps> = ({
  newCertification,
  setNewCertification,
  handleAddCertification,
  setIsAdding
}) => {
  return (
    <Card className="p-6 border-dashed">
      <CardContent className="p-0 space-y-4">
        <div>
          <Label htmlFor="cert-name">Certification Name</Label>
          <Input 
            id="cert-name"
            value={newCertification.name}
            onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
            placeholder="e.g. ASE Master Technician"
          />
        </div>
        
        <div>
          <Label htmlFor="cert-issuer">Issuing Organization</Label>
          <Input 
            id="cert-issuer"
            value={newCertification.issuer}
            onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
            placeholder="e.g. National Institute for Automotive Service Excellence"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cert-issue-date">Issue Date</Label>
            <Input 
              id="cert-issue-date"
              type="date"
              value={newCertification.issueDate}
              onChange={(e) => setNewCertification({...newCertification, issueDate: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="cert-expiration-date">Expiration Date (if applicable)</Label>
            <Input 
              id="cert-expiration-date"
              type="date"
              value={newCertification.expirationDate}
              onChange={(e) => setNewCertification({...newCertification, expirationDate: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="cert-description">Description (optional)</Label>
          <Textarea 
            id="cert-description"
            value={newCertification.description}
            onChange={(e) => setNewCertification({...newCertification, description: e.target.value})}
            placeholder="Describe what this certification covers..."
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCertification}>
            Add Certification
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationForm;
