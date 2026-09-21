import express from 'express';
import User from '../models/User.js';
import Trainer from '../models/Trainer.js';
import Membership from '../models/Membership.js';
import Workout from '../models/workout.js';
import generateToken from '../utils/generateToken.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = generateToken({ email, role: 'admin' });
    return res.json({ token, admin: { email, role: 'admin', name: 'Gym Director' } });
  }

  return res.status(401).json({ message: 'Invalid admin credentials' });
});

// GET /api/admin/stats — Complete Dashboard Analytics
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [totalUsers, activeUsersWithPlan, trainers, workouts, memberships] = await Promise.all([
      User.countDocuments(),
      User.find({ membership: { $ne: null } }).populate('membership'),
      Trainer.find(),
      Workout.countDocuments(),
      Membership.countDocuments(),
    ]);

    // Calculate total revenue from active memberships
    const totalRevenue = activeUsersWithPlan.reduce((sum, u) => {
      return sum + (u.membership?.price || 0);
    }, 0);

    // Count today's check-ins
    const todayCheckinsCount = await User.countDocuments({
      'attendance.date': today,
    });

    // Trainer workload distribution
    const trainerLoads = await Promise.all(
      trainers.map(async (t) => {
        const count = await User.countDocuments({ trainer: t._id });
        return {
          _id: t._id,
          name: t.name,
          specialization: t.specialization,
          link: t.link,
          rating: t.rating,
          assignedCount: count,
          capacity: t.clientLimit || 25,
        };
      })
    );

    // Recent 5 registered users
    const recentMembers = await User.find()
      .select('-password')
      .populate('membership')
      .populate('trainer')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      activeSubscriptions: activeUsersWithPlan.length,
      totalRevenue,
      totalTrainers: trainers.length,
      totalWorkouts: workouts,
      totalPlans: memberships,
      todayCheckins: todayCheckinsCount,
      trainerLoads,
      recentMembers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users — All users with search/filter
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('membership')
      .populate('trainer')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/assign-trainer
router.put('/users/:id/assign-trainer', protect, adminOnly, async (req, res) => {
  try {
    const { trainerId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { trainer: trainerId || null },
      { new: true }
    )
      .select('-password')
      .populate('membership')
      .populate('trainer');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
