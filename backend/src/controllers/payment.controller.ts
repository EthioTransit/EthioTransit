import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export class PaymentController {
  static async createPayment(req: Request, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Authentication required', 401);

      const { bookingId, provider, paymentMethod } = req.body;
      const paymentIntent = await PaymentService.initiatePayment({
        bookingId,
        userId: req.user.userId,
        providerName: provider,
        paymentMethod,
      });

      return sendSuccess(res, paymentIntent, 'Payment session initiated', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async verifyPayment(req: Request, res: Response) {
    try {
      const { transactionReference, simulateResult } = req.body;
      const result = await PaymentService.verifyPayment({
        transactionReference,
        simulateResult,
      });

      if (result.status === 'PAID') {
        return sendSuccess(res, result, result.message);
      } else {
        return sendError(res, result.message, 400, 'PAYMENT_FAILED');
      }
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getAllPayments(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const result = await PaymentService.getPayments({ limit, page });
      return sendSuccess(res, result);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }
}
