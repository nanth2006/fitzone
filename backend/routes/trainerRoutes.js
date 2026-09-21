import express from 'express';
import Trainer from '../models/Trainer.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/trainers — Public: see all trainers with member load
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ rating: -1, createdAt: -1 });

    const trainersWithCounts = await Promise.all(
      trainers.map(async (t) => {
        const count = await User.countDocuments({ trainer: t._id });
        return {
          ...t.toObject(),
          assignedCount: count,
        };
      })
    );

    res.json(trainersWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trainers/:id — Public: get single trainer
router.get('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    const count = await User.countDocuments({ trainer: trainer._id });
    res.json({ ...trainer.toObject(), assignedCount: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/trainers — Admin: add trainer
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, link, specialization, experience, rating, bio, email, phone, instagram, certifications, clientLimit } = req.body;

    if (!name || !link) {
      return res.status(400).json({ message: 'Name and image link are required' });
    }

    const certList = Array.isArray(certifications)
      ? certifications
      : (certifications || '')
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);

    const trainer = await Trainer.create({
      name,
      link,
      specialization: specialization || 'General Fitness Trainer',
      experience: experience || '3+ Years',
      rating: rating ? Number(rating) : 4.9,
      bio: bio || '',
      email: email || '',
      phone: phone || '',
      instagram: instagram || '',
      certifications: certList,
      clientLimit: clientLimit ? Number(clientLimit) : 25,
    });

    res.status(201).json(trainer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/trainers/:id — Admin: edit trainer
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, link, specialization, experience, rating, bio, email, phone, instagram, certifications, clientLimit } = req.body;

    const certList = certifications !== undefined
      ? (Array.isArray(certifications) ? certifications : certifications.split(',').map((c) => c.trim()).filter(Boolean))
      : undefined;

    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(link && { link }),
        ...(specialization && { specialization }),
        ...(experience && { experience }),
        ...(rating && { rating: Number(rating) }),
        ...(bio !== undefined && { bio }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(instagram !== undefined && { instagram }),
        ...(certList && { certifications: certList }),
        ...(clientLimit && { clientLimit: Number(clientLimit) }),
      },
      { new: true }
    );

    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/trainers/:id — Admin: remove trainer
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    // Unassign trainer from users who had this trainer
    await User.updateMany({ trainer: req.params.id }, { trainer: null });

    res.json({ message: 'Trainer removed and assigned members updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
