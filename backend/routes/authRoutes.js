import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// Register a new gym member
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, fitnessGoal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered. Please login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      fitnessGoal: fitnessGoal || 'Build Muscle',
    });

    const token = generateToken({ id: user._id, role: 'user' });
    res.status(201).json({
      token,
      role: 'user',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        fitnessGoal: user.fitnessGoal,
        role: 'user',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Member / Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const adminEmail = (process.env.ADMIN_EMAIL || 'nanthakumar2006geetha02@gmail.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // 1. Check if email matches configured Admin Email
    if (cleanEmail === adminEmail) {
      // Check if password matches ADMIN_PASSWORD
      if (password === adminPassword) {
        const token = generateToken({ email: adminEmail, role: 'admin' });
        return res.json({
          token,
          role: 'admin',
          user: {
            id: 'admin',
            _id: 'admin',
            name: 'Director Nanthakumar',
            email: adminEmail,
            role: 'admin',
          },
        });
      }

      // Or check if admin registered a DB password as well
      const adminUser = await User.findOne({ email: cleanEmail });
      if (adminUser) {
        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (isMatch) {
          const token = generateToken({ id: adminUser._id, email: adminEmail, role: 'admin' });
          return res.json({
            token,
            role: 'admin',
            user: {
              id: adminUser._id,
              _id: adminUser._id,
              name: adminUser.name || 'Director Nanthakumar',
              email: adminUser.email,
              role: 'admin',
            },
          });
        }
      }

      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // 2. Regular User Login
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user._id, role: 'user' });
    res.json({
      token,
      role: 'user',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        fitnessGoal: user.fitnessGoal,
        role: 'user',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
