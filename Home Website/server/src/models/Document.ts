import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentImage {
  url: string;
  name: string;
  size: number;
}

export interface IChangeDetail {
  field: string;
  from?: string;
  to?: string;
}

export interface IChangeLogEntry {
  at: Date;
  by: string;
  action: 'created' | 'updated';
  note?: string;
  changes: IChangeDetail[];
  attachments: { type: 'pdf' | 'image'; name: string; url?: string }[];
}

export interface IDocument extends Document {
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  section: string;
  images: IDocumentImage[];
  changeLog: IChangeLogEntry[];
  displayOrder: number;
  status: 'published' | 'draft' | 'archived';
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  mimeType: { type: String },
  section: { type: String, default: 'general' },
  images: [{
    _id: false,
    url: { type: String, required: true },
    name: { type: String, default: '' },
    size: { type: Number, default: 0 }
  }],
  changeLog: [{
    _id: false,
    at: { type: Date, default: Date.now },
    by: { type: String, default: 'admin' },
    action: { type: String, enum: ['created', 'updated'], default: 'updated' },
    note: { type: String },
    changes: [{ _id: false, field: String, from: String, to: String }],
    attachments: [{ _id: false, type: { type: String, enum: ['pdf', 'image'] }, name: String, url: String }]
  }],
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
