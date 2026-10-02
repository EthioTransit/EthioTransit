import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '../types';

export interface IAuditLog extends Document {
  user?: mongoose.Types.ObjectId;
  userEmail?: string;
  role: UserRole | 'SYSTEM';
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String },
    role: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ resource: 1 });
AuditLogSchema.index({ user: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
