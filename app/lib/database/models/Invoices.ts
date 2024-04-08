import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  customer: {
    type: {
      customer_id: { type: String },
      name: { type: String },
      email: { type: String },
      image_url: { type: String },
    },
  },
  _id: { type: String },
  amount: { type: Number },
  status: { type: String },
  date: { type: Date },
});

const InvoiceModel =
  mongoose.models?.Invoice || mongoose.model('Invoice', InvoiceSchema);

export { InvoiceModel };
