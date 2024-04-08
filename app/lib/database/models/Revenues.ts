import mongoose from 'mongoose';

const RevenueSchema = new mongoose.Schema({
  month: { type: String },
  revenue: { type: Number },
});

const RevenueModel =
  mongoose.models?.Revenue || mongoose.model('Revenue', RevenueSchema);

export { RevenueModel };
