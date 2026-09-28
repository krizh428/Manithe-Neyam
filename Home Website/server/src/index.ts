import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import mediaRoutes from './routes/media';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:6001'], // Frontend URLs
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';
import announcementRoutes from './routes/announcement';

app.use('/api/media', mediaRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/home-website';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
