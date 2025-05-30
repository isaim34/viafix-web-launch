
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

    // Save image record to database
    const { data: imageRecord, error: dbError } = await supabase
      .from('maintenance_record_images')
      .insert({
        maintenance_record_id: maintenanceRecordId,
        image_url: publicUrl,
        image_type: imageType,
        description,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error saving image record:', dbError);
      // Clean up uploaded file
      await supabase.storage.from('maintenance-images').remove([fileName]);
      return null;
    }

    return imageRecord;
  } catch (error) {
    console.error('Error in uploadMaintenanceImage:', error);
    return null;
  }
};

export const getMaintenanceImages = async (maintenanceRecordId: string): Promise<MaintenanceImage[]> => {
  try {
    const { data, error } = await supabase
      .from('maintenance_record_images')
      .select('*')
      .eq('maintenance_record_id', maintenanceRecordId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching maintenance images:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getMaintenanceImages:', error);
    return [];
  }
};

export const deleteMaintenanceImage = async (imageId: string): Promise<boolean> => {
  try {
    // Get image record first to get the file path
    const { data: imageRecord, error: fetchError } = await supabase
      .from('maintenance_record_images')
      .select('image_url')
      .eq('id', imageId)
      .single();

    if (fetchError || !imageRecord) {
      console.error('Error fetching image record:', fetchError);
      return false;
    }

    // Extract file path from URL
    const url = new URL(imageRecord.image_url);
    const filePath = url.pathname.split('/').pop();

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('maintenance-images')
      .remove([filePath || '']);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
    }

    // Delete database record
    const { error: dbError } = await supabase
      .from('maintenance_record_images')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      console.error('Error deleting image record:', dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteMaintenanceImage:', error);
    return false;
  }
};
