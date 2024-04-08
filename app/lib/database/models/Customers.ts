import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  email: { type: String },
  image_url: { type: String },
  invoices: {
    type: [
      {
        invoice_id: { type: String },
        amount: { type: Number },
      },
    ],
  },
});

const CustomerModel =
  mongoose.models?.Customer || mongoose.model('Customer', CustomerSchema);

export { CustomerModel };
