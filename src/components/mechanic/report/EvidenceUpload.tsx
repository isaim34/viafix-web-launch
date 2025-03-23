
import React from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EvidenceUploadProps {
  files: FileList | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
  files,
  onFileChange,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="evidence-upload" className="text-sm font-medium block">
        Upload evidence (optional)
      </label>
      <div className="border border-input rounded-md p-4">
        <Input
          id="evidence-upload"
          type="file"
          multiple
          onChange={onFileChange}
          className="hidden"
        />
        <label 
          htmlFor="evidence-upload" 
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
          <span className="text-xs sm:text-sm text-center text-muted-foreground">
            Click to upload images or documents
          </span>
          <span className="text-xs text-center text-muted-foreground">
            Supported formats: JPG, PNG, PDF (max 5MB each)
          </span>
        </label>
        {files && files.length > 0 && (
          <div className="mt-3 p-2 bg-muted/30 rounded-md">
            <p className="text-sm font-medium">Selected files:</p>
            <ul className="text-xs sm:text-sm text-muted-foreground max-h-20 overflow-y-auto">
              {Array.from(files).map((file, index) => (
                <li key={index} className="truncate">{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
