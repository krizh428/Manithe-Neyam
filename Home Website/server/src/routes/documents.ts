import express, { Response, Request } from 'express';
import fs from 'fs';
import path from 'path';
import Document, { IChangeDetail, IChangeLogEntry } from '../models/Document';
import DocumentSection from '../models/DocumentSection';
import User from '../models/User';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { uploadDocumentFiles, uploadDir } from '../middleware/upload';

const router = express.Router();

const ALL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

// Resolve a stored "/uploads/xyz" url to a path inside the uploads dir (never outside it)
const uploadPathFor = (fileUrl: string): string | null => {
  const resolved = path.join(uploadDir, path.basename(fileUrl));
  return resolved.startsWith(uploadDir) ? resolved : null;
};

const removeUpload = (fileUrl?: string) => {
  if (!fileUrl) return;
  const p = uploadPathFor(fileUrl);
  if (p && fs.existsSync(p)) fs.unlinkSync(p);
};

const usernameFor = async (userId?: string): Promise<string> => {
  if (!userId) return 'admin';
  const user = await User.findById(userId).select('username');
  return user?.username || 'admin';
};

const runUpload = (req: AuthRequest, res: Response, next: express.NextFunction) => {
  uploadDocumentFiles(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

const getFiles = (req: AuthRequest) => {
  const files = (req.files || {}) as { [field: string]: Express.Multer.File[] };
  return { pdf: files.pdf?.[0], images: files.images || [] };
};

// ---------------------------------------------------------
// PUBLIC ROUTES
// ---------------------------------------------------------

// Get all published documents, sorted by displayOrder
router.get('/', async (req: Request, res: Response) => {
  try {
    // Optional ?section=<id> returns only the documents uploaded for that website section
    const filter: Record<string, unknown> = { status: 'published' };
    if (typeof req.query.section === 'string' && req.query.section) filter.section = req.query.section;
    const documents = await Document.find(filter)
      .select('-changeLog')
      .sort({ displayOrder: 1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
});

// Custom sections (must be registered before "/:id")
router.get('/sections', async (req: Request, res: Response) => {
  try {
    const sections = await DocumentSection.find().sort({ createdAt: 1 });
    res.json(sections.map((s) => ({ key: s.key, name: s.name })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sections', error });
  }
});

// Get a single published document
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, status: 'published' }).select('-changeLog');
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error });
  }
});

// View PDF (redirect to the static URL)
router.get('/:id/view', async (req: Request, res: Response) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document || !document.fileUrl) {
      res.status(404).json({ message: 'PDF not found' });
      return;
    }
    res.redirect(document.fileUrl);
  } catch (error) {
    res.status(500).json({ message: 'Error viewing PDF', error });
  }
});

// Download PDF
router.get('/:id/download', async (req: Request, res: Response) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document || !document.fileUrl) {
      res.status(404).json({ message: 'PDF not found' });
      return;
    }

    const filePath = uploadPathFor(document.fileUrl);
    if (filePath && fs.existsSync(filePath)) {
      res.download(filePath, document.fileName || 'document.pdf');
    } else {
      res.status(404).json({ message: 'File not found on server' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error downloading PDF', error });
  }
});


// ---------------------------------------------------------
// PROTECTED ROUTES (ADMIN / EDITOR)
// ---------------------------------------------------------

// Get all documents (including drafts, archived and full change history) for the admin panel
router.get('/admin/all', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const documents = await Document.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
});

// Create a custom section by typing its name
router.post('/sections', authenticate, requireRole(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    if (name.length < 2 || name.length > 60) {
      res.status(400).json({ message: 'Section name must be 2 to 60 characters' });
      return;
    }

    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (await DocumentSection.findOne({ name: new RegExp(`^${escaped}$`, 'i') })) {
      res.status(409).json({ message: 'A section with that name already exists' });
      return;
    }

    const section = await DocumentSection.create({ key: `custom-${Date.now().toString(36)}`, name });
    res.status(201).json({ key: section.key, name: section.name });
  } catch (error) {
    res.status(500).json({ message: 'Error creating section', error });
  }
});

// Delete a custom section; its documents move back to "General"
router.delete('/sections/:key', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const section = await DocumentSection.findOneAndDelete({ key: req.params.key });
    if (!section) {
      res.status(404).json({ message: 'Section not found' });
      return;
    }
    const moved = await Document.updateMany({ section: section.key }, { section: 'general' });
    res.json({ message: 'Section deleted', movedDocuments: moved.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting section', error });
  }
});

// Update multiple document orders
router.patch('/order', authenticate, requireRole(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { updates } = req.body; // Array of { id, displayOrder }

    if (!Array.isArray(updates)) {
      res.status(400).json({ message: 'Invalid payload' });
      return;
    }

    for (const update of updates) {
      await Document.findByIdAndUpdate(update.id, { displayOrder: update.displayOrder });
    }

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
});

// Create a new document (optional PDF + attached images) and record it in the change history
router.post('/', authenticate, requireRole(ALL_ROLES), runUpload, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, displayOrder, status, changeNote, section } = req.body;
    const { pdf, images } = getFiles(req);

    if (!title || !String(title).trim()) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const attachments: IChangeLogEntry['attachments'] = [];
    const newDoc = new Document({
      title: String(title).trim(),
      description,
      displayOrder: Number(displayOrder) || 0,
      status: status || 'published',
      section: section || 'general',
      uploadedBy: req.user?.userId,
      images: images.map((f) => ({ url: `/uploads/${f.filename}`, name: f.originalname, size: f.size })),
    });

    if (pdf) {
      newDoc.fileUrl = `/uploads/${pdf.filename}`;
      newDoc.fileName = pdf.originalname;
      newDoc.fileSize = pdf.size;
      newDoc.mimeType = pdf.mimetype;
      attachments.push({ type: 'pdf', name: pdf.originalname, url: newDoc.fileUrl });
    }
    images.forEach((f) => attachments.push({ type: 'image', name: f.originalname, url: `/uploads/${f.filename}` }));

    newDoc.changeLog.push({
      at: new Date(),
      by: await usernameFor(req.user?.userId),
      action: 'created',
      note: changeNote || '',
      changes: [
        { field: 'Title', to: newDoc.title },
        ...(description ? [{ field: 'Description', to: String(description) }] : []),
        { field: 'Status', to: newDoc.status },
        { field: 'Section', to: newDoc.section },
      ],
      attachments,
    });

    await newDoc.save();
    res.status(201).json({ message: 'Document created successfully', document: newDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error creating document', error });
  }
});

// Update a document: text fields, replace the PDF, add/remove attached images, all in one request.
// Every update is described in the document's change history.
router.put('/:id', authenticate, requireRole(ALL_ROLES), runUpload, async (req: AuthRequest, res: Response) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    const { title, description, displayOrder, status, changeNote, section } = req.body;
    const { pdf, images } = getFiles(req);
    const changes: IChangeDetail[] = [];
    const attachments: IChangeLogEntry['attachments'] = [];

    const setField = (label: string, key: 'title' | 'description' | 'status' | 'section', value: any) => {
      if (value === undefined) return;
      const before = (document[key] as string) || '';
      if (String(value) !== before) {
        changes.push({ field: label, from: before, to: String(value) });
        (document as any)[key] = value;
      }
    };
    setField('Title', 'title', title !== undefined ? String(title).trim() : undefined);
    setField('Description', 'description', description);
    setField('Status', 'status', status);
    setField('Section', 'section', section);

    if (displayOrder !== undefined && Number(displayOrder) !== document.displayOrder) {
      changes.push({ field: 'Display order', from: String(document.displayOrder), to: String(Number(displayOrder)) });
      document.displayOrder = Number(displayOrder);
    }

    if (pdf) {
      changes.push({ field: 'PDF file', from: document.fileName || '(none)', to: pdf.originalname });
      removeUpload(document.fileUrl);
      document.fileUrl = `/uploads/${pdf.filename}`;
      document.fileName = pdf.originalname;
      document.fileSize = pdf.size;
      document.mimeType = pdf.mimetype;
      attachments.push({ type: 'pdf', name: pdf.originalname, url: document.fileUrl });
    }

    let toRemove: string[] = [];
    try {
      toRemove = JSON.parse(req.body.removeImages || '[]');
    } catch {
      toRemove = [];
    }
    if (Array.isArray(toRemove) && toRemove.length) {
      const removed = document.images.filter((img) => toRemove.includes(img.url));
      removed.forEach((img) => {
        changes.push({ field: 'Image removed', from: img.name || img.url });
        attachments.push({ type: 'image', name: img.name || img.url });
        removeUpload(img.url);
      });
      document.images = document.images.filter((img) => !toRemove.includes(img.url)) as any;
    }

    images.forEach((f) => {
      const url = `/uploads/${f.filename}`;
      document.images.push({ url, name: f.originalname, size: f.size });
      changes.push({ field: 'Image added', to: f.originalname });
      attachments.push({ type: 'image', name: f.originalname, url });
    });

    if (changes.length || (changeNote && String(changeNote).trim())) {
      document.changeLog.push({
        at: new Date(),
        by: await usernameFor(req.user?.userId),
        action: 'updated',
        note: changeNote || '',
        changes,
        attachments,
      });
    }

    await document.save();
    res.json({ message: 'Document updated successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error });
  }
});

// Replace PDF for an existing document (kept for backwards compatibility; PUT /:id does the same)
router.post('/:id/replace', authenticate, requireRole(ALL_ROLES), runUpload, async (req: AuthRequest, res: Response) => {
  try {
    const { pdf } = getFiles(req);
    if (!pdf) {
      res.status(400).json({ message: 'No PDF file provided' });
      return;
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    const previousName = document.fileName || '(none)';
    removeUpload(document.fileUrl);

    document.fileUrl = `/uploads/${pdf.filename}`;
    document.fileName = pdf.originalname;
    document.fileSize = pdf.size;
    document.mimeType = pdf.mimetype;
    document.uploadedBy = req.user?.userId as any;
    document.changeLog.push({
      at: new Date(),
      by: await usernameFor(req.user?.userId),
      action: 'updated',
      note: '',
      changes: [{ field: 'PDF file', from: previousName, to: pdf.originalname }],
      attachments: [{ type: 'pdf', name: pdf.originalname, url: document.fileUrl }],
    });

    await document.save();
    res.json({ message: 'PDF replaced successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Error replacing PDF', error });
  }
});

// Delete a document and its files
router.delete('/:id', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    removeUpload(document.fileUrl);
    document.images.forEach((img) => removeUpload(img.url));

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
});

export default router;
