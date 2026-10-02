import { Request, Response } from 'express';
import { BoardingService } from '../services/boarding.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export class BoardingController {
  static async verifyTicket(req: Request, res: Response) {
    try {
      const { token, tripId, verificationDevice } = req.body;
      const driverId = req.user?.userId;
      const driverEmail = req.user?.email;

      const result = await BoardingService.verifyAndBoard({
        token,
        tripId,
        driverId,
        driverEmail,
        verificationDevice: verificationDevice || 'Driver Terminal Scanner',
      });

      if (result.code === 'VALID_TICKET') {
        return sendSuccess(res, result, result.message);
      } else if (result.code === 'ALREADY_USED') {
        return sendError(res, result.message, 409, 'ALREADY_USED');
      } else {
        return sendError(res, result.message, 400, 'INVALID_TICKET');
      }
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
