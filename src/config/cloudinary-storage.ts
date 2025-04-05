// src/config/cloudinary-storage.ts
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video');
    return {
      folder: 'nestjs-uploads',
      resource_type: isVideo ? 'video' : 'image', // 👈 key line
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4'],
    };
  },
});
