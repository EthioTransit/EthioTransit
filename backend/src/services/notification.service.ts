import { Notification } from '../models/Notification';
import { NotificationType } from '../types';

export class NotificationService {
  static async create(params: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    channel?: 'IN_APP' | 'SMS' | 'EMAIL';
    metadata?: any;
  }) {
    try {
      return await Notification.create({
        user: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
        channel: params.channel || 'IN_APP',
        metadata: params.metadata,
      });
    } catch (err) {
      console.error('[NotificationService] Failed to create notification:', err);
      return null;
    }
  }

  static async getUserNotifications(userId: string) {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(30).lean();
  }

  static async markAsRead(notificationId: string, userId: string) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
  }

  static async markAllAsRead(userId: string) {
    return await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
  }
}
