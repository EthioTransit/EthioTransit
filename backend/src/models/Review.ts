import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  trip: mongoose.Types.ObjectId;
  operator: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  comment: string;
  cleanlinessRating?: number;
  punctualityRating?: number;
  staffRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    operator: { type: Schema.Types.ObjectId, ref: 'Operator', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    cleanlinessRating: { type: Number, min: 1, max: 5 },
    punctualityRating: { type: Number, min: 1, max: 5 },
    staffRating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

ReviewSchema.index({ operator: 1, createdAt: -1 });
ReviewSchema.index({ trip: 1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
