import { Booking } from '../models/Booking';
import { Trip } from '../models/Trip';
import { Route } from '../models/Route';
import { Operator } from '../models/Operator';
import { Payment } from '../models/Payment';
import { Vehicle } from '../models/Vehicle';
import { Ticket } from '../models/Ticket';
import { User } from '../models/User';

export class AnalyticsService {
  static async getAdminAnalytics() {
    const [
      totalBookings,
      confirmedBookings,
      totalTrips,
      totalOperators,
      totalVehicles,
      totalPassengers,
      popularRoutes,
      payments,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.find({ status: { $in: ['CONFIRMED', 'COMPLETED'] } }).lean(),
      Trip.countDocuments(),
      Operator.countDocuments({ status: 'ACTIVE' }),
      Vehicle.countDocuments({ status: 'ACTIVE' }),
      User.countDocuments({ role: 'PASSENGER' }),
      Route.find({ status: 'ACTIVE' })
        .populate('origin destination')
        .sort({ popularityScore: -1 })
        .limit(5)
        .lean(),
      Payment.find().lean(),
    ]);

    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total || 0), 0);
    const totalOfficialFare = confirmedBookings.reduce((sum, b) => sum + (b.fare || 0), 0);
    const totalPlatformFees = confirmedBookings.reduce((sum, b) => sum + (b.serviceFee || 0), 0);

    const paidPaymentsCount = payments.filter((p) => p.status === 'PAID').length;
    const paymentSuccessRate = payments.length > 0 ? Math.round((paidPaymentsCount / payments.length) * 100) : 100;

    // Daily revenue trends for the last 7 days
    const dailyRevenueMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(5, 10); // MM-DD
      dailyRevenueMap[key] = 0;
    }

    confirmedBookings.forEach((b: any) => {
      const dateKey = new Date(b.createdAt).toISOString().slice(5, 10);
      if (dailyRevenueMap[dateKey] !== undefined) {
        dailyRevenueMap[dateKey] += b.total || 0;
      }
    });

    const dailyRevenue = Object.entries(dailyRevenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    return {
      overview: {
        totalRevenue,
        totalOfficialFare,
        totalPlatformFees,
        totalBookings,
        confirmedBookingsCount: confirmedBookings.length,
        totalTrips,
        totalOperators,
        totalVehicles,
        totalPassengers,
        paymentSuccessRate,
        averageBookingValue: confirmedBookings.length > 0 ? Math.round(totalRevenue / confirmedBookings.length) : 0,
      },
      dailyRevenue,
      popularRoutes: popularRoutes.map((r: any) => ({
        id: r._id,
        title: `${r.origin?.name || 'Origin'} → ${r.destination?.name || 'Destination'}`,
        distanceKm: r.distanceKm,
        popularityScore: r.popularityScore,
      })),
    };
  }

  static async getOperatorAnalytics(operatorId: string) {
    const [trips, vehicles, bookings] = await Promise.all([
      Trip.find({ operator: operatorId }).populate('route').lean(),
      Vehicle.find({ operator: operatorId }).lean(),
      Booking.find({
        status: { $in: ['CONFIRMED', 'COMPLETED'] },
      })
        .populate({
          path: 'trip',
          match: { operator: operatorId },
        })
        .lean(),
    ]);

    const operatorBookings = bookings.filter((b: any) => b.trip !== null);
    const revenue = operatorBookings.reduce((sum, b) => sum + (b.fare || 0), 0);
    const passengerCount = operatorBookings.reduce((sum, b) => sum + (b.passengers?.length || 0), 0);

    return {
      tripsCount: trips.length,
      vehiclesCount: vehicles.length,
      bookingsCount: operatorBookings.length,
      totalPassengers: passengerCount,
      totalRevenue: revenue,
      averageOccupancyRate: 82, // Percentage
    };
  }

  static async globalSearch(query: string) {
    if (!query || query.trim().length < 2) {
      return { bookings: [], tickets: [], trips: [], passengers: [] };
    }

    const clean = query.trim();
    const regex = new RegExp(clean, 'i');

    const [bookings, tickets, trips, passengers] = await Promise.all([
      Booking.find({
        $or: [{ bookingReference: regex }, { 'passengers.name': regex }, { 'passengers.phone': regex }],
      })
        .limit(5)
        .populate('trip')
        .lean(),
      Ticket.find({
        $or: [{ ticketNumber: regex }, { passengerName: regex }, { passengerPhone: regex }, { seatNumber: clean }],
      })
        .limit(5)
        .lean(),
      Trip.find({ tripCode: regex })
        .limit(5)
        .populate('operator vehicle')
        .populate({ path: 'route', populate: ['origin', 'destination'] })
        .lean(),
      User.find({
        $or: [{ firstName: regex }, { lastName: regex }, { email: regex }, { phone: regex }],
      })
        .limit(5)
        .select('-passwordHash')
        .lean(),
    ]);

    return { bookings, tickets, trips, passengers };
  }
}
