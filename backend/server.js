import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { seedInitialData } from './utils/seedData.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import userRoutes from './routes/userRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';

const startServer = async () => {
  await connectDB();
  await seedInitialData();

  const app = express();
  app.use(cors({
    origin:"https://fitzone-nu-two.vercel.app/"
    }));
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/trainers', trainerRoutes);
  app.use('/api/memberships', membershipRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/workouts', workoutRoutes);

  app.get('/', (req, res) => res.json({ message: 'FitZone Gym API running smoothly' }));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => 
  
  console.log(`Server running on port ${PORT}`));
  res.send("server running")
};

startServer();