import { Operator, IOperator } from '../models/Operator';
import { Trip } from '../models/Trip';
import { Booking } from '../models/Booking';
import { Vehicle } from '../models/Vehicle';
import { AuditService } from './audit.service';
import { UserRole } from '../types';

export class OperatorService {
  static async getAllOperators(activeOnly = false) {
    const filter = activeOnly ? { status: 'ACTIVE' } : {};
    return await Operator.find(filter).sort({ name: 1 }).lean();
  }

  static async getOperatorById(id: string) {
    const operator = await Operator.findById(id).lean();
    if (!operator) throw new Error('Operator not found');
    return operator;
  }

  static async createOperator(
    data: any,
    userContext?: { id: string; email: string; role: UserRole }
  ) {
    const existing = await Operator.findOne({
      $or: [{ name: data.name }, { licenseNumber: data.licenseNumber }],
    });
    if (existing) {
      throw new Error('An operator with this name or license number already exists.');
    }

    const operator = await Operator.create(data);

    if (userContext) {
      await AuditService.log({
        user: userContext.id,
        userEmail: userContext.email,
        role: userContext.role,
        action: 'ADMIN_CREATED_OPERATOR',
        resource: 'Operator',
        resourceId: operator._id.toString(),
        newValue: operator.toObject(),
      });
    }

    return operator;
  }

  static async updateOperator(
    id: string,
    updates: Partial<IOperator>,
    userContext?: { id: string; email: string; role: UserRole }
  ) {
    const old = await Operator.findById(id);
    if (!old) throw new Error('Operator not found');

    const updated = await Operator.findByIdAndUpdate(id, updates, { new: true });

    if (userContext) {
      await AuditService.log({
        user: userContext.id,
        userEmail: userContext.email,
        role: userContext.role,
        action: 'ADMIN_UPDATED_OPERATOR',
        resource: 'Operator',
        resourceId: id,
        oldValue: old.toObject(),
        newValue: updated?.toObject(),
      });
    }

    return updated;
  }

  static async getOperatorStats(operatorId: string) {
    const [tripsCount, vehiclesCount, bookings] = await Promise.all([
      Trip.countDocuments({ operator: operatorId }),
      Vehicle.countDocuments({ operator: operatorId }),
      Booking.find({
        status: { $in: ['CONFIRMED', 'COMPLETED'] },
      }).populate({
        path: 'trip',
        match: { operator: operatorId },
      }),
    ]);

    const operatorBookings = bookings.filter((b) => b.trip !== null);
    const totalRevenue = operatorBookings.reduce((sum, b) => sum + (b.fare || 0), 0);
    const totalPassengers = operatorBookings.reduce((sum, b) => sum + (b.passengers?.length || 0), 0);

    return {
      tripsCount,
      vehiclesCount,
      bookingsCount: operatorBookings.length,
      totalPassengers,
      totalRevenue,
    };
  }
}
