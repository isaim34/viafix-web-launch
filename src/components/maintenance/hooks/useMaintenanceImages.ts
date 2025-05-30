
import { useState, useEffect } from 'react';
import { MaintenanceImage, getMaintenanceImages } from '@/services/maintenance/imageService';

export const useMaintenanceImages = (maintenanceRecordId: string | null) => {
  const [images, setImages] = useState<MaintenanceImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!maintenanceRecordId) {
      setImages([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchedImages = await getMaintenanceImages(maintenanceRecordId);
      setImages(fetchedImages);
    } catch (err) {
      console.error('Error fetching maintenance images:', err);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [maintenanceRecordId]);

  const addImage = (newImage: MaintenanceImage) => {
    setImages(prev => [...prev, newImage]);
  };

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  return {
    images,
    isLoading,
    error,
    addImage,
    removeImage,
    refetchImages: fetchImages
  };
};
