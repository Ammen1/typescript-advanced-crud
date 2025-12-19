import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Attendance } from '../models/Attendance';
import { Child } from '../models/Child';
import { AttendanceStatus } from '../types';

export const markAttendance = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { childId, date, checkInTime, status, notes } = req.body;

    if (!childId || !date || !checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide child ID, date, and check-in time',
      });
    }

    // Check if child exists
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found',
      });
    }

    // Check if attendance already marked for this date
    const existingAttendance = await Attendance.findOne({
      childId,
      date: new Date(date),
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this date',
      });
    }

    const attendance = await Attendance.create({
      childId,
      date: new Date(date),
      checkInTime: new Date(checkInTime),
      status: status || AttendanceStatus.PRESENT,
      notes,
      recordedBy: authReq.user.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message,
    });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { checkOutTime, status, notes } = req.body;

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    if (checkOutTime) attendance.checkOutTime = new Date(checkOutTime);
    if (status) attendance.status = status;
    if (notes) attendance.notes = notes;

    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating attendance',
      error: error.message,
    });
  }
};

export const getAttendanceByChild = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;

    let query: any = { childId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('childId', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message,
    });
  }
};

export const getDailyAttendance = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date',
      });
    }

    const attendance = await Attendance.find({
      date: new Date(date as string),
    })
      .populate('childId', 'firstName lastName registrationNumber')
      .populate('recordedBy', 'fullName username')
      .sort({ checkInTime: 1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily attendance',
      error: error.message,
    });
  }
};

export const getAllAttendance = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const attendance = await Attendance.find()
      .populate('childId', 'firstName lastName registrationNumber')
      .populate('recordedBy', 'fullName username')
      .sort({ date: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message,
    });
  }
};

