import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface ImageUploaderProps {
  currentImageUrl: string;
  onUploadComplete: (newUrl: string) => void;
  isAdmin: boolean;
  className?: string;
  imgClassName?: string;
  alt?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onUploadComplete,
  isAdmin,
  className = '',
  imgClassName = 'w-full h-full object-cover',
  alt = 'Uploaded image',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayUrl = previewUrl || currentImageUrl;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image exceeds 5MB limit.');
      return;
    }

    // Show instant preview
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
    setIsUploading(true);

    try {
      onUploadComplete(await api.uploadImage(file));
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error instanceof Error ? error.message : 'Error uploading image.');
    } finally {
      setPreviewUrl(null);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <img src={displayUrl} alt={alt} className={imgClassName} />
      
      {isAdmin && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-semibold">Uploading...</span>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-2 bg-white/90 text-black px-4 py-2 rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all font-semibold"
                type="button"
              >
                <Upload className="w-4 h-4" />
                Replace Image
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
