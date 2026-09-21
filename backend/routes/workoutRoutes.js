import express from 'express';
import Workout from '../models/workout.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/workouts — Public: view with filtering
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { targetMuscle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const workouts = await Workout.find(query).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/workouts/:id — Public: single workout
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/workouts — Admin: add workout
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, link, duration, category, difficulty, caloriesBurned, description, targetMuscle, equipment, steps } = req.body;

    if (!name || !link || !duration) {
      return res.status(400).json({ message: 'Name, link and duration are required' });
    }

    const parsedSteps = Array.isArray(steps)
      ? steps
      : (steps || '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);

    const workout = await Workout.create({
      name,
      link,
      duration: Number(duration),
      category: category || 'Full Body',
      difficulty: difficulty || 'Intermediate',
      caloriesBurned: caloriesBurned ? Number(caloriesBurned) : 250,
      description: description || '',
      targetMuscle: targetMuscle || 'Full Body',
      equipment: equipment || 'Bodyweight / Gym Equipment',
      steps: parsedSteps,
    });

    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/workouts/:id — Admin: update workout
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, link, duration, category, difficulty, caloriesBurned, description, targetMuscle, equipment, steps } = req.body;

    const parsedSteps = steps !== undefined
      ? (Array.isArray(steps) ? steps : steps.split('\n').map((s) => s.trim()).filter(Boolean))
      : undefined;

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(link && { link }),
        ...(duration && { duration: Number(duration) }),
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(caloriesBurned !== undefined && { caloriesBurned: Number(caloriesBurned) }),
        ...(description !== undefined && { description }),
        ...(targetMuscle !== undefined && { targetMuscle }),
        ...(equipment !== undefined && { equipment }),
        ...(parsedSteps && { steps: parsedSteps }),
      },
      { new: true }
    );

    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/workouts/:id — Admin: remove workout
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Workout removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;