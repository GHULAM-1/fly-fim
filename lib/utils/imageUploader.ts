// Image upload utility with 5MB limit and validation

export interface ImageUploadResult {
  success: boolean;
  file?: File;
  error?: string;
}

export const validateImageFile = (file: File): ImageUploadResult => {
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      success: false,
      error: 'File size must be less than 5MB'
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Only JPEG, PNG, and WebP images are allowed'
    };
  }

  return {
    success: true,
    file
  };
};

export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokeImagePreview = (previewUrl: string): void => {
  URL.revokeObjectURL(previewUrl);
};

export const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(resizedFile);
        } else {
          resolve(file); // Return original if resize fails
        }
      }, file.type, quality);
    };

    img.src = URL.createObjectURL(file);
  });
};