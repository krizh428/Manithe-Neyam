import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// Seed Admin Route (for initial setup)
router.post('/seed', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash('admin123', 10);
    const newAdmin = new User({
      username: 'admin',
      passwordHash,
      role: 'SUPER_ADMIN'
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin seeded successfully (admin / admin123)' });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding admin', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
});

// Change the signed-in admin's login id and/or password (current password required)
router.put('/account', authenticate, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;

    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    if (!currentPassword || !(await bcrypt.compare(String(currentPassword), user.passwordHash))) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    const username = typeof newUsername === 'string' ? newUsername.trim() : '';
    if (username && username !== user.username) {
      if (username.length < 3) {
        res.status(400).json({ message: 'Login ID must be at least 3 characters' });
        return;
      }
      if (await User.findOne({ username })) {
        res.status(409).json({ message: 'That login ID is already taken' });
        return;
      }
      user.username = username;
    }

    if (newPassword) {
      if (String(newPassword).length < 6) {
        res.status(400).json({ message: 'New password must be at least 6 characters' });
        return;
      }
      user.passwordHash = await bcrypt.hash(String(newPassword), 10);
    }

    await user.save();
    res.json({ message: 'Account updated successfully', user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating account', error });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

export default router;
