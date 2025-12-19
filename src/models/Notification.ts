import mongoose, { Schema } from 'mongoose';
import { INotification } from '../types';

const NotificationSchema = new Schema<INotification>(
  {
    senderId: {
      type: String,
      required: [true, 'Sender ID is required'],
      ref: 'User',
    },
    receiverId: {
      type: String,
      required: [true, 'Receiver ID is required'],
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
NotificationSchema.index({ receiverId: 1, isRead: 1 });
NotificationSchema.index({ senderId: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

