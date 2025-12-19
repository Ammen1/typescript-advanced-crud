import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { UserRole } from '../types';

export const createAccount = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { username, email, password, fullName, role, phoneNumber } = req.body;

    // Validation
    if (!username || !email || !password || !fullName || !role || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role,
      phoneNumber,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: user,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const users = await User.find().select('-__v');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { username, email, fullName, role, phoneNumber, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
        fullName,
        role,
        phoneNumber,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

export const activateOrDeactivateUser = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message,
    });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const employees = await User.find({
      role: { $in: [UserRole.MANAGER, UserRole.GUARDIAN] },
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: error.message,
    });
  }
};

