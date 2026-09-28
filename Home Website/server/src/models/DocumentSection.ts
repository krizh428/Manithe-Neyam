import mongoose, { Schema, Document } from 'mongoose';

// A custom website section that documents can be filed under (the built-in sections live in the frontend).
export interface IDocumentSection extends Document {
  key: string;
  name: string;
  createdAt: Date;
}

const DocumentSectionSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
}, {
  timestamps: true
});

export default mongoose.model<IDocumentSection>('DocumentSection', DocumentSectionSchema);
