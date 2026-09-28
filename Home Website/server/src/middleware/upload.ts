import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists (project-root /uploads, served at /uploads)
export const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Sanitize original filename
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, uniqueSuffix + '-' + safeName);
  }
});

// "pdf" field accepts PDFs only, "images" field accepts images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') {
    cb(null, true);
  } else if (file.fieldname === 'images' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.fieldname === 'pdf') {
    cb(new Error('Only PDF files are allowed for the document!'));
  } else {
    cb(new Error('Only image files are allowed for attachments!'));
  }
};

export const uploadPDF = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit per file
  },
  fileFilter: fileFilter
});

// One PDF + up to 10 attached images per request
export const uploadDocumentFiles = uploadPDF.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);
