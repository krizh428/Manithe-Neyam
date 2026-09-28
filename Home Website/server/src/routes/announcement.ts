import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Announcement from '../models/Announcement';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { uploadDir } from '../middleware/upload';

const router = express.Router();

const ALL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Announcement images live in their own folder inside the folder that is served at /uploads
const announcementDir = path.join(uploadDir, 'announcements');
if (!fs.existsSync(announcementDir)) {
  fs.mkdirSync(announcementDir, { recursive: true });
}

// Files are validated in memory before anything is written to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
});

/** Identifies the real image type from the file's first bytes (the client-sent mime type / name can lie). */
const detectImageType = (buf: Buffer): 'jpg' | 'png' | 'webp' | null => {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
};

// Only ever resolves to a file directly inside the announcements folder
const fileFor = (imageUrl?: string): string | null => {
  if (!imageUrl) return null;
  const resolved = path.join(announcementDir, path.basename(imageUrl));
  return resolved.startsWith(announcementDir) ? resolved : null;
};

const imageExists = (imageUrl?: string) => {
  const file = fileFor(imageUrl);
  return !!file && fs.existsSync(file);
};

const removeImage = (imageUrl?: string) => {
  const file = fileFor(imageUrl);
  if (file && fs.existsSync(file)) fs.unlinkSync(file);
};

const adminShape = (doc: InstanceType<typeof Announcement> | null) =>
  doc && doc.imageUrl && imageExists(doc.imageUrl)
    ? { imageUrl: doc.imageUrl, isActive: doc.isActive, createdAt: doc.createdAt, updatedAt: doc.updatedAt }
    : null;

// ---------------------------------------------------------
// PUBLIC
// ---------------------------------------------------------

// The active announcement, or { announcement: null } when there is nothing to show
router.get('/', async (req: Request, res: Response) => {
  try {
    res.set('Cache-Control', 'no-cache');
    const doc = await Announcement.findOne();
    if (!doc || !doc.isActive || !imageExists(doc.imageUrl)) {
      res.json({ announcement: null });
      return;
    }
    res.json({ announcement: { imageUrl: doc.imageUrl, updatedAt: doc.updatedAt } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcement' });
  }
});

// ---------------------------------------------------------
// ADMIN
// ---------------------------------------------------------

// Current announcement (active or not)
router.get('/admin', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    res.json({ announcement: adminShape(await Announcement.findOne()) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcement' });
  }
});

// Upload a new image and publish it as the announcement (replaces the previous one)
router.post(
  '/admin',
  authenticate,
  requireRole(ALL_ROLES),
  (req: AuthRequest, res: Response, next: express.NextFunction) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        const message =
          err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'
            ? 'Image is too large (maximum 5 MB)'
            : 'Could not read the uploaded file';
        return res.status(400).json({ message });
      }
      next();
    });
  },
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'Please choose an image to upload' });
        return;
      }

      const type = detectImageType(req.file.buffer);
      if (!type) {
        res.status(400).json({ message: 'Only JPG, PNG or WEBP images are allowed' });
        return;
      }

      // Server-generated name: the original filename is never used
      const filename = `announcement-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${type}`;
      fs.writeFileSync(path.join(announcementDir, filename), req.file.buffer);

      const doc = (await Announcement.findOne()) || new Announcement();
      const previous = doc.imageUrl;
      doc.imageUrl = `/uploads/announcements/${filename}`;
      doc.isActive = req.body.isActive !== 'false';
      await doc.save();

      if (previous && previous !== doc.imageUrl) removeImage(previous);

      res.status(201).json({ message: 'Announcement updated successfully.', announcement: adminShape(doc) });
    } catch (error) {
      res.status(500).json({ message: 'Error saving the announcement' });
    }
  }
);

// Turn the announcement ON or OFF without deleting the image
router.put('/admin', authenticate, requireRole(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    if (typeof req.body.isActive !== 'boolean') {
      res.status(400).json({ message: 'isActive must be true or false' });
      return;
    }

    const doc = await Announcement.findOne();
    if (!doc || !imageExists(doc.imageUrl)) {
      res.status(404).json({ message: 'There is no announcement image yet. Upload one first.' });
      return;
    }

    doc.isActive = req.body.isActive;
    await doc.save();
    res.json({
      message: doc.isActive ? 'Announcement enabled successfully.' : 'Announcement disabled successfully.',
      announcement: adminShape(doc),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating the announcement' });
  }
});

// Remove the announcement and its image completely
router.delete('/admin', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const doc = await Announcement.findOne();
    if (doc) {
      removeImage(doc.imageUrl);
      await Announcement.deleteMany({});
    }
    res.json({ message: 'Announcement removed successfully.', announcement: null });
  } catch (error) {
    res.status(500).json({ message: 'Error removing the announcement' });
  }
});

export default router;
