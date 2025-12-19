import mongoose, { Schema } from 'mongoose';
import { IChild, ChildStatus } from '../types';

const ChildSchema = new Schema<IChild>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE'],
      required: [true, 'Gender is required'],
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    parentId: {
      type: String,
      required: [true, 'Parent ID is required'],
      ref: 'User',
    },
    guardianId: {
      type: String,
      ref: 'User',
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required'],
      },
      relationship: {
        type: String,
        required: [true, 'Relationship is required'],
      },
      phoneNumber: {
        type: String,
        required: [true, 'Emergency contact phone is required'],
      },
    },
    medicalInfo: {
      allergies: [String],
      medications: [String],
      specialNeeds: String,
    },
    status: {
      type: String,
      enum: Object.values(ChildStatus),
      default: ChildStatus.ACTIVE,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ChildSchema.index({ parentId: 1 });
ChildSchema.index({ guardianId: 1 });
ChildSchema.index({ registrationNumber: 1 });

export const Child = mongoose.model<IChild>('Child', ChildSchema);

