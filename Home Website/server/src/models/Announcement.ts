import mongoose, { Schema, Document } from 'mongoose';

// The homepage announcement popup. Only one announcement exists at a time (the latest upload replaces it).
export interface IAnnouncement extends Document {
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema({
  // Path of the image inside /uploads/announcements (never the image data itself)
  imageUrl: { type: String },
  isActive: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
