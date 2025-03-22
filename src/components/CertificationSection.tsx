
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, X, Award, Calendar } from 'lucide-react';

// Sample certification data
const sampleCertifications = [
  {
    id: '1',
    name: 'ASE Master Automobile Technician',
    issuer: 'National Institute for Automotive Service Excellence',
    issueDate: '2018-05-15',
    expirationDate: '2023-05-15',
    description: 'Certification in all eight automotive service areas'
  },
  {
    id: '2',
    name: 'BMW Factory Training Certification',
    issuer: 'BMW North America',
    issueDate: '2019-10-22',
    expirationDate: '2024-10-22',
    description: 'Advanced diagnostic and repair procedures for BMW vehicles'
  }
];

const CertificationSection = () => {
  const [certifications, setCertifications] = useState(sampleCertifications);
  const [isAdding, setIsAdding] = useState(false);
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expirationDate: '',
    description: ''
  });

  const handleAddCertification = () => {
    const certification = {
      ...newCertification,
      id: Date.now().toString()
    };
    
    setCertifications([...certifications, certification]);
    setNewCertification({
      name: '',
      issuer: '',
      issueDate: '',
      expirationDate: '',
      description: ''
    });
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
      )}
      
      {certifications.length === 0 && !isAdding ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">You haven't added any certifications yet</p>
          <Button 
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Add Your First Certification
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="p-6 flex justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">{cert.name}</h4>
                  </div>
                  <p className="text-sm mb-2">{cert.issuer}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                    </div>
                    
                    {cert.expirationDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Expires: {new Date(cert.expirationDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {cert.description && (
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteCertification(cert.id)}
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

export default CertificationSection;
