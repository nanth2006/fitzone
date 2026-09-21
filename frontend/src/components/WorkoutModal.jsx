import React, { useState, useEffect } from 'react';
import { X, Clock, Flame, Dumbbell, Target, Play, Pause, RotateCcw, Bookmark, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../api/api.js';

function WorkoutModal({ workout, onClose, onWorkoutSaved }) {
  const { user, token, role, updateUser } = useAuth();
  const toast = useToast();

  const [timerSeconds, setTimerSeconds] = useState(60);
  const [initialSeconds, setInitialSeconds] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.savedWorkouts && workout?._id) {
      const saved = user.savedWorkouts.some((sw) => (typeof sw === 'string' ? sw === workout._id : sw._id === workout._id));
      setIsSaved(saved);
    }
  }, [user, workout]);

  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      toast.info('Rest timer finished! Time for the next set!');
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, toast]);

  if (!workout) return null;

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(initialSeconds);
  };
  const setTimerPreset = (secs) => {
    setTimerActive(false);
    setInitialSeconds(secs);
    setTimerSeconds(secs);
  };

  const handleToggleSave = async () => {
    if (role !== 'user' || !token) {
      toast.info('Please log in as a member to save workouts');
      return;
    }

    setSaving(true);
    try {
      const res = await api.toggleSaveWorkout(workout._id, token);
      setIsSaved(res.isSaved);
      updateUser({ savedWorkouts: res.savedWorkouts });
      toast.success(res.message);
      onWorkoutSaved?.();
    } catch (err) {
      toast.error(err.message || 'Failed to update saved workouts');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200  ">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-200 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/70 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image / Video banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-t-3xl border hover:border-rose-500/50">
          <img
            src={workout.link}
            alt={workout.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Tags on image */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/90 text-white shadow-md">
                {workout.category || 'Full Body'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-2">
                {workout.name}
              </h2>
            </div>

            {role === 'user' && (
              <button
                onClick={handleToggleSave}
                disabled={saving}
                className={`p-3 rounded-full border transition shadow-lg ${
                  isSaved
                    ? 'bg-amber-500 text-white border-amber-400'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white hover:border-amber-400'
                }`}
                title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Metric Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                Duration
              </div>
              <span className="text-lg font-bold text-white font-display">{workout.duration} Mins</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Calories
              </div>
              <span className="text-lg font-bold text-white font-display">~{workout.caloriesBurned || 300} kcal</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                Level
              </div>
              <span className="text-sm font-bold text-white font-display">{workout.difficulty || 'Intermediate'}</span>
            </div>
          </div>

          {/* Description & Target Muscle */}
          {workout.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Overview</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{workout.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-1">Target Muscle Group:</span>
              <span className="text-slate-100 font-medium">{workout.targetMuscle || 'Full Body'}</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-1">Recommended Equipment:</span>
              <span className="text-slate-100 font-medium">{workout.equipment || 'Gym Equipment / Dumbbells'}</span>
            </div>
          </div>

          {/* Workout Steps */}
          {workout.steps && workout.steps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-red-500" />
                Routine Breakdown
              </h3>
              <div className="space-y-2.5">
                {workout.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-200">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Rest Timer */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-red-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Set Rest Timer</span>
              </div>
              <div className="flex gap-1.5">
                {[30, 60, 90].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTimerPreset(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      initialSeconds === s
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="font-display font-black text-4xl text-white tracking-widest">
                00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTimer}
                  className={`p-3 rounded-full font-semibold transition shadow-lg flex items-center justify-center ${
                    timerActive
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                  }`}
                >
                  {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={resetTimer}
                  className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutModal;
