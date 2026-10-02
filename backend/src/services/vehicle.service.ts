import { Vehicle, IVehicle } from '../models/Vehicle';
import { AuditService } from './audit.service';
import { UserRole } from '../types';

export class VehicleService {
  static async getVehicles(options: { operatorId?: string; activeOnly?: boolean } = {}) {
    const filter: any = {};
    if (options.operatorId) {
      filter.operator = options.operatorId;
    }
    if (options.activeOnly) {
      filter.status = 'ACTIVE';
    }

    return await Vehicle.find(filter).populate('operator', 'name legalName').sort({ createdAt: -1 }).lean();
  }

  static async getVehicleById(id: string) {
    const vehicle = await Vehicle.findById(id).populate('operator').lean();
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }

  static async createVehicle(
    data: any,
    userContext?: { id: string; email: string; role: UserRole }
  ) {
    const existing = await Vehicle.findOne({ plateNumber: data.plateNumber.toUpperCase() });
    if (existing) {
      throw new Error(`A vehicle with plate number ${data.plateNumber} already exists.`);
    }

    const vehicle = await Vehicle.create({
      ...data,
      plateNumber: data.plateNumber.toUpperCase(),
    });

    if (userContext) {
      await AuditService.log({
        user: userContext.id,
        userEmail: userContext.email,
        role: userContext.role,
        action: 'CREATED_VEHICLE',
        resource: 'Vehicle',
        resourceId: vehicle._id.toString(),
        newValue: vehicle.toObject(),
      });
    }

    return await Vehicle.findById(vehicle._id).populate('operator').lean();
  }

  static async updateVehicle(
    id: string,
    updates: Partial<IVehicle>,
    userContext?: { id: string; email: string; role: UserRole }
  ) {
    const old = await Vehicle.findById(id);
    if (!old) throw new Error('Vehicle not found');

    const updated = await Vehicle.findByIdAndUpdate(id, updates, { new: true }).populate('operator').lean();

    if (userContext) {
      await AuditService.log({
        user: userContext.id,
        userEmail: userContext.email,
        role: userContext.role,
        action: 'UPDATED_VEHICLE',
        resource: 'Vehicle',
        resourceId: id,
        oldValue: old.toObject(),
        newValue: updated,
      });
    }

    return updated;
  }
}
