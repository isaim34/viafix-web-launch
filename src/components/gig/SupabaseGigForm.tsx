
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TitleAndDescriptionFields from './TitleAndDescriptionFields';
import PriceAndDurationFields from './PriceAndDurationFields';
import ImageUploader from './ImageUploader';
import { SupabaseGig, GigFormValues } from '@/hooks/useSupabaseGigManagement';

interface SupabaseGigFormProps {
  gig?: SupabaseGig | null;
  onSubmit: (gigData: GigFormValues & { id?: string }) => Promise<void>;
  onCancel: () => void;
}

const SupabaseGigForm: React.FC<SupabaseGigFormProps> = ({ gig, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<GigFormValues>({
    name: '',
    description: '',
    price: 0,
    duration: '1 hour',
    image: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (gig) {
      setFormData({
        name: gig.name,
        description: gig.description || '',
        price: gig.price,
        duration: gig.duration,
        image: gig.image_url
      });
    }
  }, [gig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || formData.price <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = gig ? { ...formData, id: gig.id } : formData;
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting gig:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{gig ? 'Edit Service' : 'Create New Service'}</CardTitle>
        <CardDescription>
          {gig ? 'Update your service details' : 'Add a new service to your offerings'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TitleAndDescriptionFields
            title={formData.name}
            description={formData.description}
            onTitleChange={(name) => setFormData(prev => ({ ...prev, name }))}
            onDescriptionChange={(description) => setFormData(prev => ({ ...prev, description }))}
          />
          
          <PriceAndDurationFields
            price={formData.price}
            duration={formData.duration}
            onPriceChange={(price) => setFormData(prev => ({ ...prev, price }))}
            onDurationChange={(duration) => setFormData(prev => ({ ...prev, duration }))}
          />
          
          <ImageUploader
            currentImage={typeof formData.image === 'string' ? formData.image : undefined}
            onImageChange={(image) => setFormData(prev => ({ ...prev, image }))}
          />
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.name.trim() || formData.price <= 0}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : (gig ? 'Update Service' : 'Create Service')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupabaseGigForm;
