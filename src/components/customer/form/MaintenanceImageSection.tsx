
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/maintenance/ImageUploader';
import { ImageGallery } from '@/components/maintenance/ImageGallery';
import { useMaintenanceImages } from '@/components/maintenance/hooks/useMaintenanceImages';
import { Camera } from 'lucide-react';

interface MaintenanceImageSectionProps {
  maintenanceRecordId?: string;
  isEditMode: boolean;
}

export const MaintenanceImageSection = ({ maintenanceRecordId, isEditMode }: MaintenanceImageSectionProps) => {
  const { images, addImage, removeImage } = useMaintenanceImages(maintenanceRecordId || null);

  if (!isEditMode || !maintenanceRecordId) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Documentation Photos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ImageUploader
          maintenanceRecordId={maintenanceRecordId}
          onImageUploaded={addImage}
          currentImageCount={images.length}
        />
        
        {images.length > 0 && (
          <ImageGallery
            images={images}
            onImageDeleted={removeImage}
            allowDelete={true}
          />
        )}
      </CardContent>
    </Card>
  );
};
