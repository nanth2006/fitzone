import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Helper to format date as YYYY-MM-DD
const getTodayStr = () => new Date().toISOString().split('T')[0];

// GET /api/user/profile — Logged-in member's profile
router.get('/profile', protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(400).json({ message: 'Not a member account' });
    }

    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('membership')
      .populate('trainer')
      .populate('savedWorkouts');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/user/profile — Update fitness metrics & personal info
router.put('/profile', protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(400).json({ message: 'Admin profile cannot be modified here' });
    }

    const { name, phone, height, weight, targetWeight, fitnessGoal, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(height !== undefined && { height: height ? Number(height) : null }),
        ...(weight !== undefined && { weight: weight ? Number(weight) : null }),
        ...(targetWeight !== undefined && { targetWeight: targetWeight ? Number(targetWeight) : null }),
        ...(fitnessGoal && { fitnessGoal }),
        ...(avatar !== undefined && { avatar }),
      },
      { new: true }
    )
      .select('-password')
      .populate('membership')
      .populate('trainer')
      .populate('savedWorkouts');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/user/checkin — Record daily gym attendance and compute streak
router.post('/checkin', protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(400).json({ message: 'Only members can record attendance' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = getTodayStr();
    const alreadyCheckedIn = user.attendance.some((a) => a.date === today);

    if (alreadyCheckedIn) {
      return res.status(400).json({ message: "You have already checked in today! Great consistency!" });
    }

    user.attendance.push({ date: today, checkInTime: new Date() });
    await user.save();

    // Calculate streak
    const dates = user.attendance.map((a) => a.date).sort().reverse();
    let streak = 0;
    let checkDate = new Date();

    for (let i = 0; i < 365; i++) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (dates.includes(dStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // If not checked in today, check if yesterday was checked in
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({
      message: `Checked in successfully! Current streak: ${streak} day${streak > 1 ? 's' : ''} 🔥`,
      attendance: user.attendance,
      streak,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/user/saved-workouts/:id — Toggle save / bookmark workout
router.post('/saved-workouts/:id', protect, async (req, res) => {
  try {
    const workoutId = req.params.id;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isSaved = user.savedWorkouts.some((id) => id.toString() === workoutId);

    if (isSaved) {
      user.savedWorkouts = user.savedWorkouts.filter((id) => id.toString() !== workoutId);
    } else {
      user.savedWorkouts.push(workoutId);
    }

    await user.save();
    const populated = await User.findById(user._id).populate('savedWorkouts');

    res.json({
      isSaved: !isSaved,
      savedWorkouts: populated.savedWorkouts,
      message: isSaved ? 'Workout removed from favorites' : 'Workout added to favorites',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
