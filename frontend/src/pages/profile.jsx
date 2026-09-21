import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Flame,
  CreditCard,
  UserCheck,
  Calendar,
  Activity,
  Award,
  Edit3,
  Bookmark,
  LogOut,
  Dumbbell,
  CheckCircle2,
  Clock,
  ChevronRight,
  Heart,
  Target,
  Sparkles,
  Phone,
  Mail,
  X,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import WorkoutModal from '../components/WorkoutModal.jsx';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function Profile() {
  const { user, token, role, logout, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeWorkoutModal, setActiveWorkoutModal] = useState(null);

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    height: '',
    weight: '',
    targetWeight: '',
    fitnessGoal: 'Build Muscle',
  });

  const loadProfile = async () => {
    if (role !== 'user' || !token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const data = await api.getProfile(token);
      setProfile(data);
      updateUser(data);
      setEditForm({
        name: data.name || '',
        phone: data.phone || '',
        height: data.height || '',
        weight: data.weight || '',
        targetWeight: data.targetWeight || '',
        fitnessGoal: data.fitnessGoal || 'Build Muscle',
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token, role]);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await api.checkIn(token);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#ef4444', '#f59e0b', '#10b981'],
        });
      } catch (e) {}

      toast.success(res.message);
      await loadProfile();
    } catch (err) {
      toast.error(err.message || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateProfile(editForm, token);
      setProfile(updated);
      updateUser(updated);
      toast.success('Profile updated successfully!');
      setEditModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const calculateBMI = () => {
    if (!profile?.height || !profile?.weight) return null;
    const hInM = profile.height / 100;
    const bmi = (profile.weight / (hInM * hInM)).toFixed(1);
    let category = 'Normal';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi <= 29.9) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';
    return { bmi, category };
  };

  const bmiData = calculateBMI();
const getStreak = () => {
  if (!profile?.attendance?.length) return 0;

  const attendedDates = new Set(profile.attendance.map((a) => a.date));
  let streak = 0;
  let date = new Date();

  // If today isn't marked yet, start counting from yesterday
  if (!attendedDates.has(date.toISOString().split('T')[0])) {
    date.setDate(date.getDate() - 1);
  }

  while (attendedDates.has(date.toISOString().split('T')[0])) {
    streak++;
    date.setDate(date.getDate() - 1);
  }

  return streak;
};

  const streak = getStreak();
  const todayStr = new Date().toISOString().split('T')[0];
  const checkedInToday = profile?.attendance?.some((a) => a.date === todayStr);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Activity className="w-8 h-8 animate-spin text-red-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Loading fitness dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass-card p-8 rounded-3xl text-center space-y-4 max-w-md">
            <p className="text-rose-400 font-semibold">{error || 'Profile not found'}</p>
            <button onClick={loadProfile} className="px-6 py-2.5 rounded-full btn-gradient-fire text-white text-xs font-bold">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Radiant Header Card */}
        <div className="gradient-card-border rounded-[2.5rem] p-7 sm:p-9 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-red-600/25 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-3xl blur-md opacity-80 animate-pulse-slow" />
              <div className="relative w-20 h-20 rounded-2xl bg-slate-950 border border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                {profile.name ? profile.name[0].toUpperCase() : <UserIcon className="w-8 h-8" />}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
                  {profile.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest btn-gradient-fire text-white shadow-sm">
                  Athlete
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{profile.email}</p>
              {profile.phone && <p className="text-xs text-slate-500">Contact: {profile.phone}</p>}
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Edit3 className="w-4 h-4 text-red-400" />
              Edit Biometrics
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-rose-950/40 text-rose-400 border border-slate-800 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Daily Attendance Streak & Quick Check-in */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 gradient-card-border rounded-[2.5rem] p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Flame className="w-7 h-7 text-amber-400 fill-amber-400 animate-bounce" style={{ animationDuration: '2s' }} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gradient-fire">
                  Gym Attendance Streak
                </span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl sm:text-6xl font-black text-white font-display">
                  {streak} {streak === 1 ? 'Day' : 'Days'}
                </span>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  {profile.attendance?.length || 0} Total Workouts
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md font-medium">
                Consistency compounds into unbreakable power. Log your attendance whenever you train at FitZone.
              </p>
            </div>

            <div>
              <button
                onClick={handleCheckIn}
                disabled={checkedInToday || checkingIn}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                  checkedInToday
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'btn-gradient-fire hover:scale-105 text-white shadow-xl shadow-red-600/40'
                }`}
              >
                {checkingIn ? (
                  <span>Checking in...</span>
                ) : checkedInToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Logged In Today!
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-amber-200" />
                    Check In Today 🔥
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Fitness Goal Card */}
          <div className="md:col-span-4 glass-card rounded-[2.5rem] p-7 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Current Objective</span>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-white font-display">
                  {profile.fitnessGoal || 'Build Muscle'}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 font-medium">
              Personalized programs tuned for muscle fiber hypertrophy and fat oxidation.
            </div>
          </div>
        </div>

        {/* Biometrics Score Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Height</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
              {profile.height ? `${profile.height} cm` : '—'}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Current Weight</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
              {profile.weight ? `${profile.weight} kg` : '—'}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Target Weight</span>
            <div className="text-2xl sm:text-3xl font-black text-gradient-fire font-display mt-1">
              {profile.targetWeight ? `${profile.targetWeight} kg` : '—'}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Body Mass Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-white font-display">
                {bmiData ? bmiData.bmi : '—'}
              </span>
              {bmiData && (
                <span className="text-[10px] font-black uppercase text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  {bmiData.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Membership & Trainer Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Membership Card */}
          <div className="gradient-card-border rounded-[2.5rem] p-7 sm:p-9 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center shadow-md">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Active Tier</span>
                    <h3 className="text-2xl font-black text-white font-display">
                      {profile.membership ? profile.membership.name : 'No Active Plan'}
                    </h3>
                  </div>
                </div>

                {profile.membership && (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Active
                  </span>
                )}
              </div>

              {profile.membership ? (
                <div className="space-y-3 pt-5 border-t border-slate-800 text-xs font-medium">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Subscription Rate:</span>
                    <span className="font-bold text-white">₹{profile.membership.price} / {profile.membership.duration}</span>
                  </div>
                  {profile.membershipStartDate && (
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Activated Date:</span>
                      <span>{new Date(profile.membershipStartDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {profile.membershipEndDate && (
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Valid Through:</span>
                      <span className="text-amber-400 font-bold">
                        {new Date(profile.membershipEndDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 pt-2 font-medium">
                  You do not have an active membership yet. Select a plan to unlock trainer allocation and full facility access.
                </p>
              )}
            </div>

            <Link
              to="/membership"
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 text-xs font-black uppercase tracking-wider text-center transition block shadow-md"
            >
              {profile.membership ? 'Upgrade / Switch Plan' : 'Browse Membership Plans'}
            </Link>
          </div>

          {/* Assigned Trainer Card */}
          <div className="gradient-card-border rounded-[2.5rem] p-7 sm:p-9 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center shadow-md">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Personal Coach</span>
                  <h3 className="text-2xl font-black text-white font-display">
                    {profile.trainer ? profile.trainer.name : 'Unassigned'}
                  </h3>
                </div>
              </div>

              {profile.trainer ? (
                <div className="flex items-center gap-5 pt-5 border-t border-slate-800">
                  <img
                    src={profile.trainer.link}
                    alt={profile.trainer.name}
                    className="w-18 h-18 rounded-2xl object-cover border border-slate-700 shadow-md"
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-gradient-fire block">
                      {profile.trainer.specialization || 'Strength Coach'}
                    </span>
                    <p className="text-xs text-slate-400 line-clamp-2 font-medium">
                      {profile.trainer.bio || 'Your designated fitness coach at FitZone.'}
                    </p>
                    {profile.trainer.phone && (
                      <span className="text-[11px] text-slate-500 block font-semibold">
                        Direct Line: {profile.trainer.phone}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 pt-2 font-medium">
                  Once you subscribe to a membership, our system automatically assigns a dedicated trainer to mentor your progress.
                </p>
              )}
            </div>

            <Link
              to="/trainer"
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 text-xs font-black uppercase tracking-wider text-center transition block shadow-md"
            >
              View Coach Roster
            </Link>
          </div>
        </div>

        {/* Favorite Workouts */}
        <div className="glass-card rounded-[2.5rem] p-7 sm:p-9 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400" />
              <h3 className="text-2xl font-black text-white font-display">Saved Workout Routines</h3>
            </div>
            <Link to="/workout" className="text-xs font-black uppercase tracking-wider text-red-400 hover:text-red-300 transition">
              Explore More Routines →
            </Link>
          </div>

          {profile.savedWorkouts && profile.savedWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.savedWorkouts.map((workout) => (
                <div
                  key={workout._id}
                  onClick={() => setActiveWorkoutModal(workout)}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 hover:border-red-500/50 transition cursor-pointer flex items-center gap-4 group shadow-md"
                >
                  <img
                    src={workout.link}
                    alt={workout.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">
                      {workout.category}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate font-display group-hover:text-red-400 transition">
                      {workout.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{workout.duration} mins</span>
                      <span>•</span>
                      <span>~{workout.caloriesBurned || 250} kcal</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs font-medium">
              No saved routines yet. Browse the workout library and click the bookmark icon on any routine.
            </div>
          )}
        </div>
      </main>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-[2.5rem] max-w-md w-full p-7 sm:p-9 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white font-display">Edit Fitness Profile</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:border-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={editForm.height}
                    onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={editForm.weight}
                    onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target (kg)</label>
                  <input
                    type="number"
                    value={editForm.targetWeight}
                    onChange={(e) => setEditForm({ ...editForm, targetWeight: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:border-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Primary Fitness Goal</label>
                <select
                  value={editForm.fitnessGoal}
                  onChange={(e) => setEditForm({ ...editForm, fitnessGoal: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:border-red-500 outline-none"
                >
                  <option value="Build Muscle">Build Muscle</option>
                  <option value="Lose Fat">Lose Fat</option>
                  <option value="Maintain Fitness">Maintain Fitness</option>
                  <option value="Increase Endurance">Increase Endurance</option>
                  <option value="General Health">General Health</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-full btn-gradient-fire text-white font-black text-xs uppercase tracking-widest transition shadow-xl cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Routine details modal */}
      {activeWorkoutModal && (
        <WorkoutModal
          workout={activeWorkoutModal}
          onClose={() => setActiveWorkoutModal(null)}
          onWorkoutSaved={loadProfile}
        />
      )}

      <Footer />
    </div>
  );
}

export default Profile;
