import express from 'express';
import Membership from '../models/Membership.js';
import Trainer from '../models/Trainer.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/memberships — Public: view plans
router.get('/', async (req, res) => {
  try {
    const memberships = await Membership.find().sort({ price: 1 });
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/memberships — Admin: add plan
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, price, discountPrice, duration, durationDays, billingCycle, badge, popular, features, description } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({ message: 'Name, price and duration are required' });
    }

    const membership = await Membership.create({
      name,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      duration,
      durationDays: durationDays ? Number(durationDays) : 30,
      billingCycle: billingCycle || 'monthly',
      badge: badge || '',
      popular: Boolean(popular),
      description: description || '',
      features: Array.isArray(features)
        ? features
        : (features || '')
            .split(',')
            .map((f) => f.trim())
            .filter(Boolean),
    });

    res.status(201).json(membership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/memberships/:id — Admin: edit plan
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, price, discountPrice, duration, durationDays, billingCycle, badge, popular, features, description } = req.body;

    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(price && { price: Number(price) }),
        ...(discountPrice !== undefined && { discountPrice: discountPrice ? Number(discountPrice) : null }),
        ...(duration && { duration }),
        ...(durationDays && { durationDays: Number(durationDays) }),
        ...(billingCycle && { billingCycle }),
        ...(badge !== undefined && { badge }),
        ...(popular !== undefined && { popular: Boolean(popular) }),
        ...(description !== undefined && { description }),
        ...(features && {
          features: Array.isArray(features)
            ? features
            : features.split(',').map((f) => f.trim()).filter(Boolean),
        }),
      },
      { new: true }
    );

    if (!membership) return res.status(404).json({ message: 'Membership plan not found' });
    res.json(membership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/memberships/:id — Admin: remove plan
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const membership = await Membership.findByIdAndDelete(req.params.id);
    if (!membership) return res.status(404).json({ message: 'Membership plan not found' });
    res.json({ message: 'Membership plan removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/memberships/:id/subscribe — Member subscribes to plan
router.post('/:id/subscribe', protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(400).json({ message: 'Admin account cannot subscribe to memberships' });
    }

    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ message: 'Membership plan not found' });

    // Auto-assign least-loaded trainer if user does not already have one
    const trainers = await Trainer.find();
    let assignedTrainer = req.user.trainer;

    if (!assignedTrainer && trainers.length > 0) {
      const counts = await Promise.all(
        trainers.map((t) => User.countDocuments({ trainer: t._id }))
      );
      let minIndex = 0;
      counts.forEach((c, i) => {
        if (c < counts[minIndex]) minIndex = i;
      });
      assignedTrainer = trainers[minIndex]._id;
    }

    const startDate = new Date();
    const daysToAdd = membership.durationDays || 30;
    const endDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        membership: membership._id,
        membershipStartDate: startDate,
        membershipEndDate: endDate,
        trainer: assignedTrainer,
      },
      { new: true }
    )
      .select('-password')
      .populate('membership')
      .populate('trainer')
      .populate('savedWorkouts');

    res.json({
      message: `Successfully subscribed to ${membership.name}!`,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
