import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    link: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    category: {
      type: String,
      enum: ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Cardio', 'HIIT', 'Core', 'Full Body'],
      default: 'Full Body',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    caloriesBurned: { type: Number, default: 250 },
    description: { type: String, default: '' },
    targetMuscle: { type: String, default: 'Full Body' },
    equipment: { type: String, default: 'Bodyweight / Dumbbells' },
    steps: [{ type: String }],
  },
  { timestamps: true }
);

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;