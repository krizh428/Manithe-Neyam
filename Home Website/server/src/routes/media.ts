import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadMedia } from '../controllers/mediaController';
import { authenticate, requireRole } from '../middleware/auth';
import { uploadDir } from '../middleware/upload';

const router = express.Router();

// Set up multer for local storage (same folder that is served at /uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'));
    }
  }
});

// POST /api/media/upload (admin only)
router.post(
  '/upload',
  authenticate,
  requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
        return;
      }
      next();
    });
  },
  uploadMedia
);

export default router;
