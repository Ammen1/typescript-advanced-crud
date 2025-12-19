import mongoose, { Schema } from 'mongoose';
import { IAttendance, AttendanceStatus } from '../types';

const AttendanceSchema = new Schema<IAttendance>(
  {
    childId: {
      type: String,
      required: [true, 'Child ID is required'],
      ref: 'Child',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    checkInTime: {
      type: Date,
      required: [true, 'Check-in time is required'],
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.PRESENT,
    },
    notes: {
      type: String,
      trim: true,
    },
    recordedBy: {
      type: String,
      required: [true, 'Recorded by is required'],
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
AttendanceSchema.index({ childId: 1, date: 1 });
AttendanceSchema.index({ date: 1 });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);

