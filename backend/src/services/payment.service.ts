import { Payment, IPayment } from '../models/Payment';
import { Booking } from '../models/Booking';
import { Seat } from '../models/Seat';
import { PaymentStatus, BookingStatus, SeatStatus, NotificationType, UserRole } from '../types';
import { TicketService } from './ticket.service';
import { NotificationService } from './notification.service';
import { AuditService } from './audit.service';
import { BRAND_CONFIG } from '../config/brand';

export interface PaymentProviderResult {
  transactionReference: string;
  providerReference?: string;
  status: PaymentStatus;
  rawResponse?: any;
}

export interface IPaymentProvider {
  createPayment(amount: number, currency: string, metadata: any): Promise<{ checkoutUrl?: string; reference: string }>;
  verifyPayment(transactionReference: string, simulateResult?: string): Promise<PaymentProviderResult>;
}

export class MockPaymentProvider implements IPaymentProvider {
  async createPayment(amount: number, currency: string, metadata: any) {
    const reference = `TX-MOCK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      reference,
      checkoutUrl: `/checkout/mock-gateway?ref=${reference}&amount=${amount}`,
    };
  }

  async verifyPayment(transactionReference: string, simulateResult: string = 'SUCCESS'): Promise<PaymentProviderResult> {
    if (simulateResult === 'FAILED') {
      return {
        transactionReference,
        status: PaymentStatus.FAILED,
        providerReference: `MOCK-FAIL-${Date.now()}`,
      };
    }
    return {
      transactionReference,
      status: PaymentStatus.PAID,
      providerReference: `MOCK-AUTH-${Date.now()}`,
    };
  }
}

export class PaymentService {
  private static provider: IPaymentProvider = new MockPaymentProvider();

  static async initiatePayment(params: {
    bookingId: string;
    userId: string;
    providerName?: 'mock' | 'telebirr' | 'chapa' | 'cbe_birr';
    paymentMethod?: string;
  }) {
    const booking = await Booking.findById(params.bookingId).populate('trip');
    if (!booking) throw new Error('Booking not found');

    if (booking.status === BookingStatus.CONFIRMED) {
      throw new Error('This booking is already paid and confirmed.');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error('Cannot pay for a cancelled booking.');
    }

    if (new Date() > new Date(booking.expiresAt)) {
      throw new Error('Booking reservation has expired. Please select your seats again.');
    }

    const { reference } = await this.provider.createPayment(booking.total, BRAND_CONFIG.currency, {
      bookingId: booking._id,
      user: params.userId,
    });

    const payment = await Payment.create({
      booking: booking._id,
      user: params.userId,
      provider: params.providerName || 'mock',
      transactionReference: reference,
      amount: booking.total,
      currency: BRAND_CONFIG.currency,
      status: PaymentStatus.PENDING,
      paymentMethod: params.paymentMethod || 'Mock Payment Gateway',
    });

    booking.payment = payment._id;
    await booking.save();

    return {
      paymentId: payment._id,
      transactionReference: reference,
      amount: booking.total,
      currency: BRAND_CONFIG.currency,
      officialFare: booking.fare,
      serviceFee: booking.serviceFee,
      provider: payment.provider,
    };
  }

  /**
   * Verified server-side. Updates status, marks seats BOOKED, and issues tickets.
   */
  static async verifyPayment(params: {
    transactionReference: string;
    simulateResult?: 'SUCCESS' | 'FAILED';
  }) {
    const payment = await Payment.findOne({ transactionReference: params.transactionReference }).populate('booking');
    if (!payment) throw new Error('Payment transaction not found');

    if (payment.status === PaymentStatus.PAID) {
      const tickets = await TicketService.getTicketsByBooking(payment.booking._id.toString());
      return {
        payment,
        status: PaymentStatus.PAID,
        message: 'Payment already verified.',
        tickets,
      };
    }

    const providerResult = await this.provider.verifyPayment(
      params.transactionReference,
      params.simulateResult || 'SUCCESS'
    );

    payment.providerReference = providerResult.providerReference;

    if (providerResult.status === PaymentStatus.PAID) {
      payment.status = PaymentStatus.PAID;
      payment.paidAt = new Date();
      await payment.save();

      // Confirm Booking
      const booking = await Booking.findById(payment.booking);
      if (!booking) {
        throw new Error('Associated booking not found for this payment transaction.');
      }

      booking.status = BookingStatus.CONFIRMED;
      await booking.save();

        // Mark Seats as permanently BOOKED
        await Seat.updateMany(
          { trip: booking.trip, seatNumber: { $in: booking.seats } },
          {
            $set: { status: SeatStatus.BOOKED },
            $unset: { lockExpiresAt: '', guestLockId: '' },
          }
        );

        // Generate Digital Tickets with secure QR tokens
        const tickets = await TicketService.generateTicketsForBooking(booking._id.toString());

        // Send In-App Notification
        await NotificationService.create({
          userId: booking.user.toString(),
          title: 'Booking Confirmed & Digital Tickets Issued',
          message: `Your journey on reference ${booking.bookingReference} is confirmed. ${tickets.length} digital ticket(s) are ready for boarding.`,
          type: NotificationType.PAYMENT_SUCCESS,
          metadata: { bookingId: booking._id, reference: booking.bookingReference },
        });

        await AuditService.log({
          user: booking.user.toString(),
          role: UserRole.PASSENGER,
          action: 'PAYMENT_COMPLETED',
          resource: 'Payment',
          resourceId: payment._id.toString(),
          newValue: { amount: payment.amount, reference: payment.transactionReference },
        });

        return {
          payment,
          status: PaymentStatus.PAID,
          message: 'Payment verified successfully! Tickets generated.',
          tickets,
          bookingReference: booking.bookingReference,
        };
    } else {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Payment authorization failed or declined by provider.';
      await payment.save();

      return {
        payment,
        status: PaymentStatus.FAILED,
        message: 'Payment verification failed.',
      };
    }
  }

  static async getPayments(options: { limit?: number; page?: number } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find()
        .populate('user', 'firstName lastName email phone')
        .populate('booking')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(),
    ]);

    return { payments, total, page, totalPages: Math.ceil(total / limit) };
  }
}
