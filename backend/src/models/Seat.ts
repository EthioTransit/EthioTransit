import mongoose, { Document, Schema } from 'mongoose';
import { SeatStatus } from '../types';

export interface ISeat extends Document {
  trip: mongoose.Types.ObjectId;
  seatNumber: string;
  row: number;
  column: number;
  seatType: 'WINDOW' | 'AISLE' | 'MIDDLE';
  status: SeatStatus;
  lockedBy?: mongoose.Types.ObjectId;
  guestLockId?: string;
  lockedAt?: Date;
  lockExpiresAt?: Date;
  booking?: mongoose.Types.ObjectId;
  priceModifier: number;
  createdAt: Date;
  updatedAt: Date;
}

const SeatSchema = new Schema<ISeat>(
  {
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    seatNumber: { type: String, required: true, trim: true },
    row: { type: Number, required: true },
    column: { type: Number, required: true },
    seatType: { type: String, enum: ['WINDOW', 'AISLE', 'MIDDLE'], default: 'WINDOW' },
    status: {
      type: String,
      enum: Object.values(SeatStatus),
      default: SeatStatus.AVAILABLE,
      required: true,
    },
    lockedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    guestLockId: { type: String },
    lockedAt: { type: Date },
    lockExpiresAt: { type: Date },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    priceModifier: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SeatSchema.index({ trip: 1, seatNumber: 1 }, { unique: true });
SeatSchema.index({ trip: 1, status: 1 });
SeatSchema.index({ lockExpiresAt: 1 });

export const Seat = mongoose.model<ISeat>('Seat', SeatSchema);
