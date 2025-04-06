import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const fileTypeMappings = {
  video: {
    resource_type: 'video',
    allowed_formats: ['mp4'],
  },
  image: {
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
  audio: {
    resource_type: 'raw',
    allowed_formats: ['mp3'],
  },
  document: {
    resource_type: 'raw',
    allowed_formats: ['pdf', 'docx'],
  },

  default: {
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
};

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const fileType = file.mimetype.split('/')[0];

    const fileMapping = fileTypeMappings[fileType] || fileTypeMappings.default;

    return {
      folder: 'chat-app',
      resource_type: fileMapping.resource_type,
      allowed_formats: fileMapping.allowed_formats,
    };
  },
});
