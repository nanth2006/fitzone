import Workout from '../models/workout.js';
import Trainer from '../models/Trainer.js';
import Membership from '../models/Membership.js';

export const seedInitialData = async () => {
  try {
    const workoutCount = await Workout.countDocuments();
    if (workoutCount < 3) {
      console.log('Populating comprehensive workout programs...');
      await Workout.insertMany([
        {
          name: 'Hypertrophy Upper Body Blast',
          link: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
          duration: 45,
          category: 'Chest',
          difficulty: 'Intermediate',
          caloriesBurned: 420,
          description: 'High-intensity compound chest, shoulder, and tricep super-sets for maximum muscle growth and definition.',
          targetMuscle: 'Chest, Deltoids, Triceps',
          equipment: 'Barbell, Dumbbells, Bench',
          steps: [
            'Dynamic warm-up & shoulder mobility (5 mins)',
            'Incline Barbell Bench Press: 4 sets x 8-10 reps',
            'Flat Dumbbell Flyes superset with Push-ups: 3 sets x 12 reps',
            'Overhead Dumbbell Shoulder Press: 4 sets x 10 reps',
            'Cable Rope Tricep Pushdowns: 3 sets x 15 reps',
          ],
        },
        {
          name: 'Deadlift & Posterior Chain Power',
          link: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
          duration: 50,
          category: 'Back',
          difficulty: 'Advanced',
          caloriesBurned: 520,
          description: 'Heavy back builder focusing on deadlifts, lat pulldowns, and bent-over rows to develop thick, wide back muscles.',
          targetMuscle: 'Lats, Rhomboids, Lower Back, Hamstrings',
          equipment: 'Barbell, Cable Machine, Pull-up Bar',
          steps: [
            'Foam rolling and hamstring stretches (5 mins)',
            'Conventional Deadlifts: 5 sets x 5 reps (progressive overload)',
            'Wide-Grip Lat Pulldowns: 4 sets x 10-12 reps',
            'Bent-Over Barbell Rows: 4 sets x 8-10 reps',
            'Single-Arm Dumbbell Rows: 3 sets x 12 reps each side',
          ],
        },
        {
          name: 'Quad & Glute Demolisher',
          link: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
          duration: 55,
          category: 'Legs',
          difficulty: 'Advanced',
          caloriesBurned: 580,
          description: 'Comprehensive lower body workout building massive leg drive, explosive power, and sculpted quadriceps.',
          targetMuscle: 'Quadriceps, Glutes, Hamstrings, Calves',
          equipment: 'Squat Rack, Leg Press, Dumbbells',
          steps: [
            'Bodyweight squats and hip flexor openers (5 mins)',
            'Barbell Back Squats: 5 sets x 6-8 reps',
            'Leg Press with wide-to-narrow foot placement: 4 sets x 12 reps',
            'Walking Dumbbell Lunges: 3 sets x 20 total strides',
            'Romanian Deadlifts: 4 sets x 10 reps',
            'Standing Calf Raises: 4 sets x 20 reps',
          ],
        },
        {
          name: 'HIIT Full Body Fat Shredder',
          link: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
          duration: 30,
          category: 'HIIT',
          difficulty: 'Beginner',
          caloriesBurned: 380,
          description: 'Fast-paced calorie burning circuit engineered to boost metabolism, enhance VO2 max, and melt body fat.',
          targetMuscle: 'Full Body & Cardiovascular System',
          equipment: 'Kettlebells, Jump Rope, Mat',
          steps: [
            'Jumping jacks & high knees (3 mins)',
            '45 sec Kettlebell Swings / 15 sec Rest x 4 rounds',
            '45 sec Burpees / 15 sec Rest x 4 rounds',
            '45 sec Mountain Climbers / 15 sec Rest x 4 rounds',
            '2 mins speed jump rope finisher',
          ],
        },
        {
          name: 'Core Fortress & Abs Sculpt',
          link: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
          duration: 25,
          category: 'Core',
          difficulty: 'Beginner',
          caloriesBurned: 220,
          description: 'Targeted abdominal circuit emphasizing deep transverse abdominis activation and spinal stability.',
          targetMuscle: 'Rectus Abdominis, Obliques, Lower Back',
          equipment: 'Mat, Medicine Ball',
          steps: [
            'Cat-cow & bird-dog activations (3 mins)',
            'Hanging Leg Raises: 4 sets x 12-15 reps',
            'Russian Twists with Medicine Ball: 3 sets x 20 reps',
            'Plank Hold with Shoulder Taps: 3 sets x 60 seconds',
            'Bicycle Crunches: 3 sets x 20 reps',
          ],
        },
      ]);
    }

    const trainerCount = await Trainer.countDocuments();
    if (trainerCount < 3) {
      console.log('Populating master trainers roster...');
      await Trainer.insertMany([
        {
          name: 'Marcus "The Titan" Vance',
          link: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80',
          specialization: 'Bodybuilding & Heavy Hypertrophy',
          experience: '8+ Years',
          rating: 4.9,
          bio: 'Former national bodybuilding competitor specializing in aesthetic physique transformations, progressive overload, and competition prep.',
          email: 'marcus.vance@fitzone.com',
          phone: '+1 (555) 234-5678',
          instagram: '@marcus_titan_fit',
          certifications: ['CSCS Certified Strength Coach', 'ISSA Master Trainer'],
          clientLimit: 20,
        },
        {
          name: 'Elena Rostova',
          link: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80',
          specialization: 'HIIT, Fat Loss & Functional Mobility',
          experience: '6+ Years',
          rating: 5.0,
          bio: 'Athletic conditioning expert dedicated to helping clients drop body fat while boosting joint longevity, stamina, and explosive power.',
          email: 'elena.rostova@fitzone.com',
          phone: '+1 (555) 345-6789',
          instagram: '@elena_conditioning',
          certifications: ['NASM-CPT', 'EXOS Performance Specialist'],
          clientLimit: 25,
        },
        {
          name: 'Devon Reed',
          link: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
          specialization: 'Olympic Weightlifting & Powerlifting',
          experience: '7+ Years',
          rating: 4.8,
          bio: 'Form and technique obsessive focused on clean squats, bench presses, snatches, and building unbreakable functional strength.',
          email: 'devon.reed@fitzone.com',
          phone: '+1 (555) 456-7890',
          instagram: '@devon_liftpower',
          certifications: ['USAW Level 2 Coach', 'CrossFit Level 3 Trainer'],
          clientLimit: 20,
        },
        {
          name: 'Aria Chen',
          link: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
          specialization: 'Corrective Exercise & Nutrition Strategy',
          experience: '5+ Years',
          rating: 4.9,
          bio: 'Holistic wellness and biomechanics specialist combining personalized macro diet plans with posture correction and muscle toning.',
          email: 'aria.chen@fitzone.com',
          phone: '+1 (555) 567-8901',
          instagram: '@aria_fitmind',
          certifications: ['Precision Nutrition Level 2', 'ACE-CPT'],
          clientLimit: 25,
        },
      ]);
    }

    const membershipCount = await Membership.countDocuments();
    if (membershipCount < 3) {
      console.log('Populating tiered membership plans...');
      await Membership.insertMany([
        {
          name: 'Starter Flex',
          price: 999,
          discountPrice: 1299,
          duration: '1 Month',
          durationDays: 30,
          billingCycle: 'monthly',
          badge: 'Starter',
          popular: false,
          description: 'Perfect for beginners starting their fitness journey with full gym access and fundamental support.',
          features: [
            'Unlimited gym floor access',
            'Locker room & shower amenities',
            'Free fitness assessment & BMI check',
            'Assigned personal trainer orientation',
            'FitZone mobile member portal',
          ],
        },
        {
          name: 'Pro Athlete',
          price: 2499,
          discountPrice: 3499,
          duration: '3 Months',
          durationDays: 90,
          billingCycle: 'quarterly',
          badge: 'Most Popular',
          popular: true,
          description: 'Our most popular tier. Designed for serious trainees seeking steady progress, tailored workouts, and trainer guidance.',
          features: [
            'All Starter Flex benefits',
            'Dedicated 1-on-1 Trainer Allocation',
            'Custom Monthly Workout & Diet Regimen',
            'Access to Sauna & Steam Recovery Suite',
            'Free entry to all weekend Group Classes',
            'Priority support & monthly body composition scans',
          ],
        },
        {
          name: 'Elite Legend',
          price: 7999,
          discountPrice: 11999,
          duration: '1 Year',
          durationDays: 365,
          billingCycle: 'yearly',
          badge: 'Best Value',
          popular: false,
          description: 'The ultimate all-inclusive fitness lifestyle membership with VIP perks, priority trainer booking, and guest passes.',
          features: [
            'All Pro Athlete benefits for a full year',
            'VIP Trainer direct messaging & weekly check-ins',
            'Unlimited Protein Shake Bar discounts (20% off)',
            '2 Complimentary Monthly Guest Passes',
            'Exclusive FitZone Merch Kit (Shirt + Shaker)',
            'Free locker reservation for the entire year',
          ],
        },
      ]);
    }
  } catch (err) {
    console.error('Error during data seeding:', err.message);
  }
};
