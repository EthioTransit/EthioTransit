import mongoose, { Document, Schema } from 'mongoose';

export interface IPickupPoint extends Document {
  city: mongoose.Types.ObjectId;
  name: string;
  amharicName?: string;
  landmark: string;
  address: string;
  contactNumber?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PickupPointSchema = new Schema<IPickupPoint>(
  {
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    name: { type: String, required: true, trim: true },
    amharicName: { type: String, trim: true },
    landmark: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PickupPointSchema.index({ city: 1, isActive: 1 });

export const PickupPoint = mongoose.model<IPickupPoint>('PickupPoint', PickupPointSchema);
