import { Driver, IDriver } from '../models/Driver';
import { Trip } from '../models/Trip';
import { Ticket } from '../models/Ticket';
import { Booking } from '../models/Booking';
import { AuditService } from './audit.service';
import { UserRole } from '../types';

export class DriverService {
  static async getDrivers(options: { operatorId?: string } = {}) {
    const filter: any = {};
    if (options.operatorId) {
      filter.operator = options.operatorId;
    }
    return await Driver.find(filter).populate('operator', 'name').populate('user', 'email').sort({ name: 1 }).lean();
  }

  static async getDriverById(id: string) {
    const driver = await Driver.findById(id).populate('operator').populate('assignedTrips').lean();
    if (!driver) throw new Error('Driver not found');
    return driver;
  }

  static async getDriverByUserId(userId: string) {
    return await Driver.findOne({ user: userId }).populate('operator').lean();
  }

  static async createDriver(
    data: any,
    userContext?: { id: string; email: string; role: UserRole }
  ) {
    const existing = await Driver.findOne({
      $or: [{ phone: data.phone }, { licenseNumber: data.licenseNumber }],
    });
    if (existing) {
      throw new Error('A driver with this phone number or license number already exists.');
    }

    const driver = await Driver.create(data);

    if (userContext) {
      await AuditService.log({
        user: userContext.id,
        userEmail: userContext.email,
        role: userContext.role,
        action: 'CREATED_DRIVER',
        resource: 'Driver',
        resourceId: driver._id.toString(),
        newValue: driver.toObject(),
      });
    }

    return driver;
  }

  static async updateDriver(
    id: string,
    updates: Partial<IDriver>,
    userContext?: { id: string; email: string; role: UserRole }
  ) {
    const old = await Driver.findById(id);
    if (!old) throw new Error('Driver not found');

    const updated = await Driver.findByIdAndUpdate(id, updates, { new: true });

    if (userContext) {
      await AuditService.log({
        user: userContext.id,
        userEmail: userContext.email,
        role: userContext.role,
        action: 'UPDATED_DRIVER',
        resource: 'Driver',
        resourceId: id,
        oldValue: old.toObject(),
        newValue: updated?.toObject(),
      });
    }

    return updated;
  }

  static async getDriverDashboard(driverId: string) {
    const driver = await Driver.findById(driverId);
    if (!driver) throw new Error('Driver not found');

    const todayDate = new Date().toISOString().split('T')[0];

    const todayTrips = await Trip.find({
      $or: [{ driver: driverId }, { _id: { $in: driver.assignedTrips } }],
      departureDate: todayDate,
    })
      .populate('route')
      .populate('vehicle')
      .populate('operator')
      .lean();

    const upcomingTrips = await Trip.find({
      $or: [{ driver: driverId }, { _id: { $in: driver.assignedTrips } }],
      departureDate: { $gt: todayDate },
    })
      .populate('route')
      .populate('vehicle')
      .populate('operator')
      .sort({ departureDate: 1 })
      .limit(5)
      .lean();

    return {
      driver,
      todayTrips,
      upcomingTrips,
    };
  }

  static async getPassengerManifest(tripId: string) {
    const trip = await Trip.findById(tripId)
      .populate({
        path: 'route',
        populate: ['origin', 'destination'],
      })
      .populate('vehicle')
      .populate('operator')
      .lean();

    if (!trip) throw new Error('Trip not found');

    const tickets = await Ticket.find({
      trip: tripId,
      status: { $ne: 'CANCELLED' },
    })
      .sort({ seatNumber: 1 })
      .lean();

    return {
      trip,
      totalTickets: tickets.length,
      boardedCount: tickets.filter((t) => t.status === 'USED').length,
      pendingCount: tickets.filter((t) => t.status === 'ISSUED').length,
      manifest: tickets,
    };
  }
}
