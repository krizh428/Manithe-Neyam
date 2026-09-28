import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'manithaneyam',
          resource_type: 'auto',
        });
        
        // Remove local temp file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        res.status(200).json({
          success: true,
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      } catch (cloudErr) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error('Cloudinary error:', cloudErr);
        res.status(500).json({ success: false, message: 'Error uploading to Cloudinary' });
      }
    } else {
      // Local fallback
      const filename = req.file.filename;
      // Relative URL so it works behind the Vite proxy and in production alike
      const imageUrl = `/uploads/${filename}`;
      
      res.status(200).json({
        success: true,
        imageUrl,
        publicId: filename,
      });
    }
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
