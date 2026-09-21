import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },

    // Fitness metrics
    height: { type: Number, default: null }, // cm
    weight: { type: Number, default: null }, // kg
    targetWeight: { type: Number, default: null }, // kg
    fitnessGoal: {
      type: String,
      enum: ['Build Muscle', 'Lose Fat', 'Maintain Fitness', 'Increase Endurance', 'General Health'],
      default: 'Build Muscle',
    },

    // Membership details
    membership: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', default: null },
    membershipStartDate: { type: Date, default: null },
    membershipEndDate: { type: Date, default: null },

    // Assigned trainer
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', default: null },

    // Daily Attendance Check-ins
    attendance: [
      {
        date: { type: String, required: true }, // Format: YYYY-MM-DD
        checkInTime: { type: Date, default: Date.now },
      },
    ],

    // Saved / Favorite workouts
    savedWorkouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
