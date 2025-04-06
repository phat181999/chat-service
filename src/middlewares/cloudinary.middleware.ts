import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { storage } from '../common/interceptors/cloudinary-storage';

const upload = multer({ storage });

@Injectable()
export class CloudinaryUploadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log('CloudinaryUploadMiddleware called',req.is('multipart/form-data') ,req.body.files);
    if (!req.is('multipart/form-data') || !req.body.files) {
      console.log('No files to upload or not multipart/form-data');
      return next(); 
    }

    upload.array('files')(req, res, (err: any) => {
      console.log('No files to upload or not multipart/form-data');

      if (err) {
        return res.status(400).json({ message: 'File upload failed', error: err });
      }

      if (req.files) {
        const fileDetails = (req.files as Express.Multer.File[]).map(file => {
          // Extract the file extension to determine the file type
          const fileExtension = file.mimetype.split('/').pop()?.toLowerCase();
          const allowedExtensions = ['jpg', 'png', 'jpeg', 'webp', 'mp4'];

          // Check if the file extension is allowed
          const isValidFileType = fileExtension && allowedExtensions.some(ext => fileExtension.endsWith(ext));

          // Determine file type: image or video based on file extension
          const fileType = isValidFileType ? (fileExtension === 'mp4' ? 'video' : 'image') : 'unknown';

          // Return the file type and file URL
          return {
            type: fileType,
            url: file.path,  // Cloudinary URL or the path for the uploaded file
          };
        });

        // Attach file details to the request body
        req.body.fileDetails = fileDetails;
      }

      next();
    });
  }
}
