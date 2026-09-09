import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    position: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Card', cardSchema);
