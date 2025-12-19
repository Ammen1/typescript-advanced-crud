import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Attendance } from '../models/Attendance';
import { Evaluation } from '../models/Evaluation';
import { Child } from '../models/Child';
import { Report } from '../models/Report';

export const generateWeeklyReport = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { childId, startDate, endDate } = req.body;

    if (!childId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide child ID, start date, and end date',
      });
    }

    // Set end date to end of day
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Get attendance data
    const attendance = await Attendance.find({
      childId,
      date: {
        $gte: new Date(startDate),
        $lte: end,
      },
    });

    const attendanceStats = {
      totalDays: attendance.length,
      presentDays: attendance.filter((a) => a.status === 'PRESENT').length,
      absentDays: attendance.filter((a) => a.status === 'ABSENT').length,
      lateArrivals: attendance.filter((a) => a.status === 'LATE').length,
    };

    // Get evaluations
    const evaluations = await Evaluation.find({
      childId,
      date: {
        $gte: new Date(startDate),
        $lte: end,
      },
    }).select('_id');

    const child = await Child.findById(childId);

    // Create report
    const report = await Report.create({
      type: 'WEEKLY',
      childId,
      generatedBy: authReq.user.userId,
      period: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      data: {
        attendance: attendanceStats,
        evaluations: evaluations.map((e) => e._id.toString()),
        activities: [],
        healthIncidents: [],
      },
    });

    res.status(201).json({
      success: true,
      message: 'Weekly report generated successfully',
      data: {
        report,
        child,
        attendance,
        evaluations: await Evaluation.find({ childId, date: { $gte: new Date(startDate), $lte: end } }),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error generating weekly report',
      error: error.message,
    });
  }
};

export const generateMonthlyReport = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start date and end date',
      });
    }

    // Set end date to end of day
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Get all children
    const children = await Child.find({ status: 'ACTIVE' });

    // Get all attendance data
    const attendance = await Attendance.find({
      date: {
        $gte: new Date(startDate),
        $lte: end,
      },
    }).populate('childId', 'firstName lastName');

    // Get all evaluations
    const evaluations = await Evaluation.find({
      date: {
        $gte: new Date(startDate),
        $lte: end,
      },
    }).populate('childId', 'firstName lastName');

    // Create overall statistics
    const report = {
      period: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      statistics: {
        totalChildren: children.length,
        totalAttendanceRecords: attendance.length,
        totalEvaluations: evaluations.length,
        attendanceByStatus: {
          present: attendance.filter((a) => a.status === 'PRESENT').length,
          absent: attendance.filter((a) => a.status === 'ABSENT').length,
          late: attendance.filter((a) => a.status === 'LATE').length,
        },
        evaluationsByCategory: {
          physical: evaluations.filter((e) => e.category === 'PHYSICAL').length,
          cognitive: evaluations.filter((e) => e.category === 'COGNITIVE').length,
          social: evaluations.filter((e) => e.category === 'SOCIAL').length,
          emotional: evaluations.filter((e) => e.category === 'EMOTIONAL').length,
          language: evaluations.filter((e) => e.category === 'LANGUAGE').length,
        },
      },
      children: children,
      attendance: attendance,
      evaluations: evaluations,
    };

    res.status(200).json({
      success: true,
      message: 'Monthly report generated successfully',
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error generating monthly report',
      error: error.message,
    });
  }
};

export const getReportsByChild = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { childId } = req.params;

    const reports = await Report.find({ childId })
      .populate('generatedBy', 'fullName username role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message,
    });
  }
};

export const getAllReports = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { type } = req.query;

    let query: any = {};
    if (type) {
      query.type = type;
    }

    const reports = await Report.find(query)
      .populate('childId', 'firstName lastName registrationNumber')
      .populate('generatedBy', 'fullName username role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message,
    });
  }
};

export const getStatistics = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const totalChildren = await Child.countDocuments({ status: 'ACTIVE' });
    const totalUsers = await (await import('../models/User')).User.countDocuments({ isActive: true });
    const totalAttendanceToday = await Attendance.countDocuments({
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const unreadReceived = await (await import('../models/Notification')).Notification.countDocuments({
      receiverId: authReq.user.userId,
      isRead: false,
    });

    // Also count sent notifications that are unread by the receiver (to match the list view)
    const unreadSent = await (await import('../models/Notification')).Notification.countDocuments({
      senderId: authReq.user.userId,
      isRead: false,
    });

    const unreadNotifications = unreadReceived + unreadSent;

    res.status(200).json({
      success: true,
      data: {
        totalChildren,
        totalUsers,
        totalAttendanceToday,
        unreadNotifications,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

