export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  GUARDIAN = 'GUARDIAN',
  FAMILY = 'FAMILY',
}

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface Child {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  registrationNumber: string;
  parentId: string | User;
  guardianId?: string | User;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    specialNeeds?: string;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED';
  createdAt?: string;
  updatedAt?: string;
}

export interface Attendance {
  _id: string;
  childId: string | Child;
  child?: Child; // Deprecated but keeping for now
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  notes?: string;
  recordedBy: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  _id: string;
  senderId: string | User;
  sender?: User; // Deprecated
  receiverId: string | User;
  receiver?: User; // Deprecated
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Evaluation {
  _id: string;
  childId: string | Child;
  child?: Child; // Deprecated
  evaluatorId: string | User;
  evaluator?: User; // Deprecated
  category: 'PHYSICAL' | 'COGNITIVE' | 'SOCIAL' | 'EMOTIONAL' | 'LANGUAGE' | 'OTHER';
  observation: string;
  recommendation?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Report {
  _id: string;
  type: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  childId?: string | Child;
  child?: Child; // Deprecated
  period: {
    startDate: string;
    endDate: string;
  };
  generatedBy?: string | User;
  data: {
    attendance: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateArrivals: number;
    };
    evaluations: Evaluation[];
    activities: any[];
    healthIncidents: any[];
  };
  // Deprecated fields kept for backward compatibility if needed, though likely unused now
  attendanceSummary?: any;
  evaluationSummary?: any;
  statistics?: any;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

export interface Statistics {
  totalChildren: number;
  totalUsers: number;
  totalAttendanceToday: number;
  unreadNotifications: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

