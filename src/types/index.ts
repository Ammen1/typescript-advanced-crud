import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  GUARDIAN = 'GUARDIAN',
  FAMILY = 'FAMILY'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE'
}

export enum ChildStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED'
}

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phoneNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IChild extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE';
  registrationNumber: string;
  parentId: string; // Reference to Family user
  guardianId?: string; // Reference to Guardian user
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medicalInfo?: {
    allergies: string[];
    medications: string[];
    specialNeeds: string;
  };
  status: ChildStatus;
  enrollmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendance extends Document {
  _id: string;
  childId: string;
  date: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  status: AttendanceStatus;
  notes?: string;
  recordedBy: string; // Manager or Guardian ID
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends Document {
  _id: string;
  senderId: string;
  receiverId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvaluation extends Document {
  _id: string;
  childId: string;
  evaluatorId: string;
  date: Date;
  category: string; // Physical, Cognitive, Social, Emotional, etc.
  observation: string;
  recommendation: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReport extends Document {
  _id: string;
  type: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  childId?: string;
  generatedBy: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  data: {
    attendance: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateArrivals: number;
    };
    evaluations: string[]; // Evaluation IDs
    activities: string[];
    healthIncidents: string[];
  };
  createdAt: Date;
}

export interface IJWTPayload {
  userId: string;
  username: string;
  role: UserRole;
}

