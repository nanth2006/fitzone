import React, { useState, useEffect } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

function AddMembershipForm({ onAdded, editMembership, onUpdated }) {
  const { token } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    duration: '1 Month',
    durationDays: '30',
    billingCycle: 'monthly',
    badge: '',
    popular: false,
    features: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  // Fill form when editing
  useEffect(() => {
    if (editMembership) {
      setFormData({
        name: editMembership.name || '',
        price: editMembership.price || '',
        discountPrice: editMembership.discountPrice || '',
        duration: editMembership.duration || '1 Month',
        durationDays: editMembership.durationDays || '30',
        billingCycle: editMembership.billingCycle || 'monthly',
        badge: editMembership.badge || '',
        popular: editMembership.popular || false,
        features: Array.isArray(editMembership.features)
          ? editMembership.features.join(', ')
          : editMembership.features || '',
        description: editMembership.description || '',
      });
    }
  }, [editMembership]);

  const handleChange = (e) => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      discountPrice: '',
      duration: '1 Month',
      durationDays: '30',
      billingCycle: 'monthly',
      badge: '',
      popular: false,
      features: '',
      description: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.duration) {
      toast.error('Please specify the plan name, price, and duration');
      return;
    }

    setLoading(true);

    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : null,
        durationDays: Number(formData.durationDays) || 30,
      };

      // EDIT
      if (editMembership) {
        await api.updateMembership(
          editMembership._id,
          data,
          token
        );

        toast.success('Membership updated successfully');

        onUpdated?.();
      }

      // ADD
      else {
        await api.addMembership(data, token);

        toast.success('Membership tier created successfully');

        onAdded?.();
      }

      resetForm();

    } catch (err) {
      toast.error(
        err.message || 'Failed to save membership'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">

      {/* Heading */}
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
          <CreditCard className="w-5 h-5" />
        </div>

        <h3 className="text-lg font-bold text-white font-display">
          {editMembership
            ? 'Edit Membership Plan'
            : 'Create Membership Plan'}
        </h3>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-xs"
      >

        {/* Plan Title */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Plan Title
          </label>

          <input
            type="text"
            name="name"
            placeholder="e.g. Pro Athlete Pass"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Price (₹)
            </label>

            <input
              type="number"
              name="price"
              placeholder="2499"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Original Price (₹)
            </label>

            <input
              type="number"
              name="discountPrice"
              placeholder="3499"
              value={formData.discountPrice}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />
          </div>

        </div>

        {/* Duration */}
        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Duration Label
            </label>

            <input
              type="text"
              name="duration"
              placeholder="e.g. 3 Months"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Duration (Days)
            </label>

            <input
              type="number"
              name="durationDays"
              placeholder="90"
              value={formData.durationDays}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
            />
          </div>

        </div>

        {/* Badge */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Badge / Tag (Optional)
          </label>

          <input
            type="text"
            name="badge"
            placeholder="e.g. Most Popular, Best Value"
            value={formData.badge}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />
        </div>

        {/* Popular */}
        <div className="flex items-center gap-2 py-1">

          <input
            type="checkbox"
            id="popularCheck"
            name="popular"
            checked={formData.popular}
            onChange={handleChange}
            className="w-4 h-4 rounded text-red-600 bg-slate-900 border-slate-700 focus:ring-red-500"
          />

          <label
            htmlFor="popularCheck"
            className="text-slate-300 font-medium cursor-pointer"
          >
            Mark as Featured / Most Popular Tier
          </label>

        </div>

        {/* Features */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Features (comma-separated)
          </label>

          <input
            type="text"
            name="features"
            placeholder="Locker access, 1-on-1 Trainer, Sauna access"
            value={formData.features}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Description
          </label>

          <textarea
            name="description"
            rows={2}
            placeholder="Short overview of tier benefits..."
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:scale-[1.02] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >

          <Plus className="w-4 h-4" />

          {loading
            ? editMembership
              ? 'Updating Plan...'
              : 'Creating Plan...'
            : editMembership
              ? 'Update Membership Plan'
              : 'Add Membership Plan'}

        </button>

      </form>
    </div>
  );
}

export default AddMembershipForm;