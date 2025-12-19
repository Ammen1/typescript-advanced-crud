import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Child } from '../models/Child';
import { User } from '../models/User';

export const registerChild = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      registrationNumber,
      parentId,
      guardianId,
      emergencyContact,
      medicalInfo,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !dateOfBirth || !gender || !registrationNumber || !parentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!emergencyContact?.name || !emergencyContact?.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete emergency contact information',
      });
    }

    // Check if parent exists
    const parent = await User.findById(parentId);
    if (!parent || (parent.role !== 'FAMILY' && parent.role !== 'ADMIN')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parent ID',
      });
    }

    // Check if guardian exists (if provided)
    if (guardianId) {
      const guardian = await User.findById(guardianId);
      if (!guardian || guardian.role !== 'GUARDIAN') {
        return res.status(400).json({
          success: false,
          message: 'Invalid guardian ID',
        });
      }
    }

    const child = await Child.create({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      registrationNumber,
      parentId,
      guardianId,
      emergencyContact,
      medicalInfo,
      status: 'ACTIVE',
    });

    res.status(201).json({
      success: true,
      message: 'Child registered successfully',
      data: child,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Registration number already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error registering child',
      error: error.message,
    });
  }
};

export const getAllChildren = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    let query: any = {};

    // Filter by current user's role and permissions
    if (authReq.user.role === 'FAMILY') {
      query.parentId = authReq.user.userId;
    } else if (authReq.user.role === 'GUARDIAN') {
      query.guardianId = authReq.user.userId;
    }

    const children = await Child.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: children.length,
      data: children,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching children',
      error: error.message,
    });
  }
};

export const getChildById = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const child = await Child.findById(req.params.id);

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found',
      });
    }

    // Check permissions
    if (authReq.user.role === 'FAMILY' && child.parentId !== authReq.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      data: child,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching child',
      error: error.message,
    });
  }
};

export const getChildByRegistrationNumber = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { registrationNumber } = req.params;

    if (!registrationNumber) {
      return res.status(400).json({
        success: false,
        message: 'Registration number is required',
      });
    }

    const child = await Child.findOne({ registrationNumber });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found',
      });
    }

    // Check permissions
    if (authReq.user.role === 'FAMILY' && child.parentId !== authReq.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      data: child,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching child',
      error: error.message,
    });
  }
};

export const updateChild = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      guardianId,
      emergencyContact,
      medicalInfo,
      status,
    } = req.body;

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (guardianId) updateData.guardianId = guardianId;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (medicalInfo) updateData.medicalInfo = medicalInfo;
    if (status) updateData.status = status;

    const child = await Child.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Child updated successfully',
      data: child,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating child',
      error: error.message,
    });
  }
};

export const deleteChild = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const child = await Child.findByIdAndUpdate(
      req.params.id,
      { status: 'INACTIVE' },
      { new: true }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Child deactivated successfully',
      data: child,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating child',
      error: error.message,
    });
  }
};

export const getMyChildren = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    let query: any = {};

    if (authReq.user.role === 'FAMILY') {
      query.parentId = authReq.user.userId;
    } else if (authReq.user.role === 'GUARDIAN') {
      query.guardianId = authReq.user.userId;
    }

    const children = await Child.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: children.length,
      data: children,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching children',
      error: error.message,
    });
  }
};

