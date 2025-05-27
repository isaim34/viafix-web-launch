
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (gig) {
      setFormData({
        name: gig.name,
        description: gig.description || '',
        price: gig.price,
        duration: gig.duration,
        image: gig.image_url
      });
      setPreviewImage(gig.image_url || null);
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

  const handleImageChange = (file: File | string) => {
    setFormData(prev => ({ ...prev, image: file }));
    
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(file);
    }
  };

  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
    setPreviewImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      
      handleImageChange(file);
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
          <div className="space-y-2">
            <Label htmlFor="name">Service Title <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Engine Diagnostic Service"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your service in detail..."
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) <span className="text-destructive">*</span></Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration <span className="text-destructive">*</span></Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g. 1 hour, 30 minutes"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Image <span className="text-muted-foreground">(optional)</span></Label>
            
            {previewImage ? (
              <div className="relative border rounded-md overflow-hidden aspect-video">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleClearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <div className="flex flex-col items-center justify-center gap-1 text-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-medium">
                    Click to upload image
                  </div>
                  <div className="text-xs text-muted-foreground">
                    JPG, PNG or GIF (max. 5MB)
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            )}
          </div>
          
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
