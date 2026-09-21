import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Save } from 'lucide-react';
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const emptyForm = {
  name: '',
  link: '',
  specialization: '',
  experience: '',
  rating: '4.9',
  bio: '',
  phone: '',
  email: '',
  instagram: '',
  certifications: '',
  clientLimit: '25',
};

function AddTrainerForm({ onAdded, editTrainer, onUpdated }) {
  const { token } = useAuth();
  const toast = useToast();

  const isEditMode = Boolean(editTrainer);

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  // Prefill form when an existing trainer is passed in for editing
  useEffect(() => {
    if (editTrainer) {
      setFormData({
        name: editTrainer.name || '',
        link: editTrainer.link || '',
        specialization: editTrainer.specialization || '',
        experience: editTrainer.experience || '',
        rating: editTrainer.rating?.toString() || '4.9',
        bio: editTrainer.bio || '',
        phone: editTrainer.phone || '',
        email: editTrainer.email || '',
        instagram: editTrainer.instagram || '',
        certifications: editTrainer.certifications || '',
        clientLimit: editTrainer.clientLimit?.toString() || '25',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editTrainer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.link) {
      toast.error('Trainer name and image URL are required');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await api.updateTrainer(editTrainer._id, formData, token);
        toast.success('Trainer details updated successfully');
        onUpdated?.();
      } else {
        await api.addTrainer(formData, token);
        toast.success('Trainer added successfully to roster');
        setFormData(emptyForm);
        onAdded?.();
      }
    } catch (err) {
      toast.error(err.message || (isEditMode ? 'Failed to update trainer' : 'Failed to add trainer'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(emptyForm);
    onUpdated?.(); // parent clears editTrainer -> exits edit mode
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-500 flex items-center justify-center">
          <UserCheck className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white font-display">
          {isEditMode ? 'Edit Coach Details' : 'Add Certified Coach'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Coach Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Arunraj / Marcus Vance"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Profile Image URL</label>
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

        {formData.link && (
          <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-700">
            <img
              src={formData.link}
              alt="Coach preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Specialization</label>
            <input
              type="text"
              name="specialization"
              placeholder="e.g. Strength & Conditioning"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Experience</label>
            <input
              type="text"
              name="experience"
              placeholder="e.g. 6+ Years"
              value={formData.experience}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Initial Rating (1-5)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Athlete Capacity</label>
            <input
              type="number"
              name="clientLimit"
              value={formData.clientLimit}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Certifications (comma-separated)</label>
          <input
            type="text"
            name="certifications"
            placeholder="CSCS, NASM-CPT, USAW Level 2"
            value={formData.certifications}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Biography / Coaching Focus</label>
          <textarea
            name="bio"
            rows={2}
            placeholder="Philosophy, training methodology..."
            value={formData.bio}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:scale-[1.02] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {loading
              ? (isEditMode ? 'Saving...' : 'Adding Coach...')
              : (isEditMode ? 'Save Changes' : 'Add Trainer to Roster')}
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddTrainerForm;