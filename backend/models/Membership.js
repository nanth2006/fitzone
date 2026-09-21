import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null },
    duration: { type: String, required: true }, // e.g. "1 Month", "3 Months", "1 Year"
    durationDays: { type: Number, default: 30 },
    billingCycle: { type: String, enum: ['monthly', 'quarterly', 'yearly', 'custom'], default: 'monthly' },
    badge: { type: String, default: '' }, // e.g. "Most Popular", "Best Value"
    popular: { type: Boolean, default: false },
    features: [{ type: String }],
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Membership', membershipSchema);
