import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Notification } from '../models/Notification';
import { User } from '../models/User';

export const sendNotification = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { receiverId, title, message } = req.body;

    if (!receiverId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver ID, title, and message',
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found',
      });
    }

    const notification = await Notification.create({
      senderId: authReq.user.userId,
      receiverId,
      title,
      message,
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error sending notification',
      error: error.message,
    });
  }
};

export const getMyNotifications = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { isRead } = req.query;

    let query: any = { receiverId: authReq.user.userId };

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('senderId', 'fullName username role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message,
    });
  }
};

export const getSentNotifications = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const notifications = await Notification.find({ senderId: authReq.user.userId })
      .populate('receiverId', 'fullName username role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sent notifications',
      error: error.message,
    });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Check if user owns this notification
      if (notification.receiverId.toString() !== authReq.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error marking notification',
      error: error.message,
    });
  }
};

export const getUnreadNotificationCount = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const count = await Notification.countDocuments({
      receiverId: authReq.user.userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notification count',
      error: error.message,
    });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Check if user owns this notification
    if (
      notification.senderId.toString() !== authReq.user.userId &&
      notification.receiverId.toString() !== authReq.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message,
    });
  }
};

