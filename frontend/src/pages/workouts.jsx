import React, { useEffect, useState } from 'react';
import {
  Dumbbell,
  Search,
  Clock,
  Flame,
  Target,
  Filter,
  Bookmark,
  Plus,
  Trash2,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import WorkoutModal from '../components/WorkoutModal.jsx';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function Workouts() {
  const { user, token, role, updateUser } = useAuth();
  const toast = useToast();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeModalWorkout, setActiveModalWorkout] = useState(null);

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'HIIT', 'Cardio', 'Core', 'Full Body'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchWorkouts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getWorkouts({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        search: searchTerm,
      });
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load workouts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [selectedCategory, selectedDifficulty]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWorkouts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this workout?')) return;

    try {
      await api.deleteWorkout(id, token);
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
      toast.success('Workout removed successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete workout');
    }
  };

  const handleToggleSave = async (workoutId, e) => {
    e.stopPropagation();
    if (role !== 'user' || !token) {
      toast.info('Please log in as a member to bookmark workouts');
      return;
    }

    try {
      const res = await api.toggleSaveWorkout(workoutId, token);
      updateUser({ savedWorkouts: res.savedWorkouts });
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message || 'Failed to bookmark workout');
    }
  };

  const isWorkoutSaved = (workoutId) => {
    if (!user?.savedWorkouts) return false;
    return user.savedWorkouts.some((sw) => (typeof sw === 'string' ? sw === workoutId : sw._id === workoutId));
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider mb-3">
              <Dumbbell className="w-3.5 h-3.5" /> Exercise Library
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display">
              Workout <span className="text-gradient-fire">Routines</span>
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl font-medium">
              Target specific muscle groups, optimize sets and reps, and execute with coach-verified form.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exercise, muscle, target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-full pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition shadow-inner font-medium"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'btn-gradient-fire text-white shadow-lg'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
              Difficulty:
            </span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-slate-700 text-white border border-slate-600 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Workouts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12 hover:shadow hover:shadow-md hover:shadow-glow-red">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card rounded-3xl h-80 animate-pulse bg-slate-900/50" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center glass-card rounded-3xl border border-rose-500/30 text-rose-300">
            <p className="text-base font-semibold">{error}</p>
            <button
              onClick={fetchWorkouts}
              className="mt-4 px-6 py-2 rounded-full bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
            >
              Try Again
            </button>
          </div>
        ) : workouts.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-3xl border border-slate-800 space-y-4">
            <Dumbbell className="w-12 h-12 text-slate-600 mx-auto stroke-[1.5]" />
            <h3 className="text-lg font-bold text-white font-display">No workout routines found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
              We couldn't find any exercises matching your filter criteria. Try adjusting your search term or category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSearchTerm('');
              }}
              className="px-6 py-3 rounded-full btn-gradient-fire text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => {
              const saved = isWorkoutSaved(workout._id);
              return (
                <div
                  key={workout._id}
                  onClick={() => setActiveModalWorkout(workout)}
                  className="gradient-card-border rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail banner */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                      <img
                        src={workout.link}
                        alt={workout.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1021] via-[#0b1021]/30 to-transparent" />

                      {/* Category Badge */}
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider btn-gradient-fire text-white shadow-md">
                        {workout.category || 'Full Body'}
                      </span>

                      {/* Difficulty Badge */}
                      <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/85 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                        {workout.difficulty || 'Intermediate'}
                      </span>

                      {/* Favorite button */}
                      {role === 'user' && (
                        <button
                          onClick={(e) => handleToggleSave(workout._id, e)}
                          className={`absolute bottom-3.5 right-3.5 p-2 rounded-full backdrop-blur-md border transition ${
                            saved
                              ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/40'
                              : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:text-white'
                          }`}
                          title={saved ? 'Remove bookmark' : 'Bookmark workout'}
                        >
                          <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6 space-y-2">
                      <h3 className="text-lg font-bold text-white font-display group-hover:text-red-400 transition line-clamp-1">
                        {workout.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">
                        {workout.description || 'Comprehensive training session focusing on form, power, and hypertrophy.'}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0">
                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-800 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-red-500" />
                        {workout.duration} mins
                      </span>

                      <span className="flex items-center gap-1.5 font-bold text-amber-400">
                        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ~{workout.caloriesBurned || 280} kcal
                      </span>

                      {role === 'admin' && (
                        <button
                          onClick={(e) => handleDelete(workout._id, e)}
                          className="text-rose-400 hover:text-rose-300 p-1 transition"
                          title="Remove workout"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Routine Detail Modal */}
      {activeModalWorkout && (
        <WorkoutModal
          workout={activeModalWorkout}
          onClose={() => setActiveModalWorkout(null)}
          onWorkoutSaved={() => {}}
        />
      )}

      <Footer />
    </div>
  );
}

export default Workouts;