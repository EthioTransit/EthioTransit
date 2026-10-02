import { Ticket } from '../models/Ticket';
import { Trip } from '../models/Trip';
import { Booking } from '../models/Booking';
import { TicketStatus, BookingStatus, UserRole } from '../types';
import { AuditService } from './audit.service';

export interface BoardingVerificationResult {
  code: 'VALID_TICKET' | 'INVALID_TICKET' | 'ALREADY_USED';
  message: string;
  ticket?: any;
  passenger?: {
    name: string;
    phone: string;
    seatNumber: string;
    route: string;
  };
}

export class BoardingService {
  static async verifyAndBoard(params: {
    token: string; // qrVerificationToken OR ticketNumber
    tripId?: string;
    driverId?: string;
    driverEmail?: string;
    verificationDevice?: string;
  }): Promise<BoardingVerificationResult> {
    const cleanToken = params.token.trim();

    // Find ticket by QR token or ticket number
    const ticket = await Ticket.findOne({
      $or: [
        { qrVerificationToken: cleanToken },
        { ticketNumber: cleanToken.toUpperCase() },
      ],
    }).populate('booking trip');

    if (!ticket) {
      return {
        code: 'INVALID_TICKET',
        message: 'Ticket not found. Invalid verification code.',
      };
    }

    // Verify trip match if driver is verifying for a specific trip
    if (params.tripId && ticket.trip?._id?.toString() !== params.tripId) {
      return {
        code: 'INVALID_TICKET',
        message: 'This ticket is issued for a different trip/route.',
        ticket,
      };
    }

    // Check if cancelled
    if (ticket.status === TicketStatus.CANCELLED) {
      return {
        code: 'INVALID_TICKET',
        message: 'This ticket was cancelled or refunded.',
        ticket,
      };
    }

    // Check if already used
    if (ticket.status === TicketStatus.USED) {
      return {
        code: 'ALREADY_USED',
        message: `Ticket already used for boarding at ${ticket.boardingTime?.toLocaleTimeString() || 'earlier today'}.`,
        ticket,
        passenger: {
          name: ticket.passengerName,
          phone: ticket.passengerPhone,
          seatNumber: ticket.seatNumber,
          route: ticket.routeTitle,
        },
      };
    }

    // Verify booking is confirmed
    const booking: any = ticket.booking;
    if (booking && booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.COMPLETED) {
      return {
        code: 'INVALID_TICKET',
        message: 'Ticket payment has not been confirmed.',
        ticket,
      };
    }

    // Successful Boarding: mark as USED
    const now = new Date();
    ticket.status = TicketStatus.USED;
    ticket.boardingTime = now;
    if (params.driverId) {
      ticket.verifiedBy = params.driverId as any;
    }
    ticket.verificationDevice = params.verificationDevice || 'Driver Handheld Terminal';
    await ticket.save();

    await AuditService.log({
      user: params.driverId,
      userEmail: params.driverEmail,
      role: UserRole.DRIVER,
      action: 'DRIVER_VERIFIED_TICKET',
      resource: 'Ticket',
      resourceId: ticket._id.toString(),
      newValue: {
        ticketNumber: ticket.ticketNumber,
        seatNumber: ticket.seatNumber,
        boardingTime: now,
        device: ticket.verificationDevice,
      },
    });

    return {
      code: 'VALID_TICKET',
      message: 'Boarding verified successfully. Passenger permitted to board.',
      ticket,
      passenger: {
        name: ticket.passengerName,
        phone: ticket.passengerPhone,
        seatNumber: ticket.seatNumber,
        route: ticket.routeTitle,
      },
    };
  }
}
