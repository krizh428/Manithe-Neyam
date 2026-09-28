import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'], default: 'ADMIN' }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
