import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Board', boardSchema);
