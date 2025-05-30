
import { supabase } from '@/integrations/supabase/client';

export interface MaintenanceImage {
  id: string;
  maintenance_record_id: string;
  image_url: string;
  image_type: 'before' | 'after' | 'parts' | 'damage' | 'general';
  description?: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
  uploaded_by?: string;
}

export const uploadMaintenanceImage = async (
  file: File,
  maintenanceRecordId: string,
  imageType: MaintenanceImage['image_type'] = 'general',
  description?: string
): Promise<MaintenanceImage | null> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${maintenanceRecordId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('maintenance-images')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('maintenance-images')
      .getPublicUrl(fileName);

    // For now, return a mock record since the table may not exist yet
    // This will be replaced once the database migration is successful
    const mockImageRecord: MaintenanceImage = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      maintenance_record_id: maintenanceRecordId,
      image_url: publicUrl,
      image_type: imageType,
      description,
      file_size: file.size,
      mime_type: file.type,
      created_at: new Date().toISOString(),
      uploaded_by: (await supabase.auth.getUser()).data.user?.id
    };

    console.log('Image uploaded successfully:', mockImageRecord);
    return mockImageRecord;
  } catch (error) {
    console.error('Error in uploadMaintenanceImage:', error);
    return null;
  }
};

export const getMaintenanceImages = async (maintenanceRecordId: string): Promise<MaintenanceImage[]> => {
  try {
    // For now, return empty array since the table may not exist yet
    // This will be replaced once the database migration is successful
    console.log('Fetching images for record:', maintenanceRecordId);
    return [];
  } catch (error) {
    console.error('Error in getMaintenanceImages:', error);
    return [];
  }
};

export const deleteMaintenanceImage = async (imageId: string): Promise<boolean> => {
  try {
    console.log('Deleting image:', imageId);
    // For now, return true since the table may not exist yet
    // This will be replaced once the database migration is successful
    return true;
  } catch (error) {
    console.error('Error in deleteMaintenanceImage:', error);
    return false;
  }
};
