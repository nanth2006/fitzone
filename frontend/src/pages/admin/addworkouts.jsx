import React, { useEffect, useState } from 'react';
import { Dumbbell, Plus, Edit2 } from 'lucide-react';
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

function AddWorkout({ onAdded, editWorkout, onUpdated }) {
  const { token } = useAuth();
  const toast = useToast();

  const initialFormData = {
    name: '',
    link: '',
    duration: '',
    category: 'Chest',
    difficulty: 'Intermediate',
    caloriesBurned: '300',
    description: '',
    targetMuscle: '',
    equipment: '',
    steps: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Chest',
    'Back',
    'Legs',
    'Arms',
    'Shoulders',
    'HIIT',
    'Cardio',
    'Core',
    'Full Body',
  ];

  const difficulties = [
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  // ================= EDIT DATA LOAD =================
  useEffect(() => {
    if (editWorkout) {
      setFormData({
        name: editWorkout.name || '',
        link: editWorkout.link || '',
        duration: editWorkout.duration || '',
        category: editWorkout.category || 'Chest',
        difficulty: editWorkout.difficulty || 'Intermediate',
        caloriesBurned: editWorkout.caloriesBurned || '300',
        description: editWorkout.description || '',
        targetMuscle: editWorkout.targetMuscle || '',
        equipment: editWorkout.equipment || '',
        steps: Array.isArray(editWorkout.steps)
          ? editWorkout.steps.join('\n')
          : editWorkout.steps || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editWorkout]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.link ||
      !formData.duration
    ) {
      toast.error(
        'Please enter workout title, image link, and duration'
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        caloriesBurned:
          Number(formData.caloriesBurned) || 250,
      };

      // ================= UPDATE =================
      if (editWorkout) {
        await api.updateWorkout(
          editWorkout._id,
          payload,
          token
        );

        toast.success(
          'Workout routine updated successfully'
        );

        setFormData(initialFormData);

        onUpdated?.();

        return;
      }

      // ================= ADD =================
      await api.addWorkout(
        payload,
        token
      );

      toast.success(
        'Workout routine added to library'
      );

      setFormData(initialFormData);

      onAdded?.();

    } catch (err) {
      toast.error(
        err.message ||
        (
          editWorkout
            ? 'Failed to update workout'
            : 'Failed to add workout'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">

      {/* ================= TITLE ================= */}
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center">

          {editWorkout ? (
            <Edit2 className="w-5 h-5" />
          ) : (
            <Dumbbell className="w-5 h-5" />
          )}

        </div>

        <h3 className="text-lg font-bold text-white font-display">

          {editWorkout
            ? 'Edit Workout Routine'
            : 'Add Workout Routine'}

        </h3>

      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-xs"
      >

        {/* NAME */}
        <div>

          <label className="block text-slate-300 font-semibold mb-1">
            Workout Routine Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="e.g. Incline Hypertrophy Bench Press"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />

        </div>

        {/* IMAGE */}
        <div>

          <label className="block text-slate-300 font-semibold mb-1">
            Image / Demo URL
          </label>

          <input
            type="url"
            name="link"
            placeholder="https://images.unsplash.com/..."
            value={formData.link}
            onChange={handleChange}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />

        </div>

        {/* IMAGE PREVIEW */}
        {formData.link && (

          <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-700">

            <img
              src={formData.link}
              alt="Exercise preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

          </div>

        )}

        {/* CATEGORY + DIFFICULTY */}
        <div className="grid grid-cols-2 gap-3">

          <div>

            <label className="block text-slate-300 font-semibold mb-1">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            >

              {categories.map((c) => (

                <option
                  key={c}
                  value={c}
                >
                  {c}
                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="block text-slate-300 font-semibold mb-1">
              Difficulty
            </label>

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            >

              {difficulties.map((d) => (

                <option
                  key={d}
                  value={d}
                >
                  {d}
                </option>

              ))}

            </select>

          </div>

        </div>

        {/* DURATION + CALORIES */}
        <div className="grid grid-cols-2 gap-3">

          <div>

            <label className="block text-slate-300 font-semibold mb-1">
              Duration (Mins)
            </label>

            <input
              type="number"
              name="duration"
              placeholder="45"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />

          </div>

          <div>

            <label className="block text-slate-300 font-semibold mb-1">
              Est. Calories (kcal)
            </label>

            <input
              type="number"
              name="caloriesBurned"
              placeholder="350"
              value={formData.caloriesBurned}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />

          </div>

        </div>

        {/* TARGET MUSCLE + EQUIPMENT */}
        <div className="grid grid-cols-2 gap-3">

          <div>

            <label className="block text-slate-300 font-semibold mb-1">
              Target Muscle
            </label>

            <input
              type="text"
              name="targetMuscle"
              placeholder="Pectorals, Triceps"
              value={formData.targetMuscle}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />

          </div>

          <div>

            <label className="block text-slate-300 font-semibold mb-1">
              Equipment
            </label>

            <input
              type="text"
              name="equipment"
              placeholder="Barbell, Incline Bench"
              value={formData.equipment}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />

          </div>

        </div>

        {/* DESCRIPTION */}
        <div>

          <label className="block text-slate-300 font-semibold mb-1">
            Description
          </label>

          <textarea
            name="description"
            rows={3}
            placeholder="Describe this workout routine..."
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />

        </div>

        {/* STEPS */}
        <div>

          <label className="block text-slate-300 font-semibold mb-1">
            Steps / Sets (one per line)
          </label>

          <textarea
            name="steps"
            rows={4}
            placeholder={`1. Warm-up 5 mins
2. Set 1: 10 reps @ 60%
3. Set 2: 8 reps @ 75%`}
            value={formData.steps}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:scale-[1.02] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >

          {editWorkout ? (
            <Edit2 className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}

          {loading
            ? editWorkout
              ? 'Updating Workout...'
              : 'Adding Workout...'
            : editWorkout
              ? 'Update Workout Routine'
              : 'Publish Workout Routine'}

        </button>

        {/* CANCEL EDIT */}
        {editWorkout && (

          <button
            type="button"
            onClick={() => {
              setFormData(initialFormData);
              onUpdated?.();
            }}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Cancel Edit
          </button>

        )}

      </form>

    </div>
  );
}

export default AddWorkout;