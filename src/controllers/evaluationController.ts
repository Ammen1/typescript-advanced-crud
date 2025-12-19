import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Evaluation } from '../models/Evaluation';
import { Child } from '../models/Child';

export const createEvaluation = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { childId, category, observation, recommendation, attachments } = req.body;

    if (!childId || !category || !observation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide child ID, category, and observation',
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

    const evaluation = await Evaluation.create({
      childId,
      evaluatorId: authReq.user.userId,
      date: new Date(),
      category,
      observation,
      recommendation,
      attachments,
    });

    res.status(201).json({
      success: true,
      message: 'Evaluation created successfully',
      data: evaluation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating evaluation',
      error: error.message,
    });
  }
};

export const getEvaluationsByChild = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { childId } = req.params;
    const { category } = req.query;

    let query: any = { childId };

    if (category) {
      query.category = category;
    }

    const evaluations = await Evaluation.find(query)
      .populate('evaluatorId', 'fullName username role')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching evaluations',
      error: error.message,
    });
  }
};

export const getAllEvaluations = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { category, startDate, endDate } = req.query;

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const evaluations = await Evaluation.find(query)
      .populate('childId', 'firstName lastName registrationNumber')
      .populate('evaluatorId', 'fullName username role')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching evaluations',
      error: error.message,
    });
  }
};

export const getEvaluationById = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate('childId', 'firstName lastName registrationNumber dateOfBirth')
      .populate('evaluatorId', 'fullName username role email');

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: evaluation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching evaluation',
      error: error.message,
    });
  }
};

export const updateEvaluation = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const { observation, recommendation, attachments, category } = req.body;

    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluation not found',
      });
    }

    // Check if user created this evaluation
    if (evaluation.evaluatorId.toString() !== authReq.user.userId && authReq.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    if (observation) evaluation.observation = observation;
    if (recommendation) evaluation.recommendation = recommendation;
    if (attachments) evaluation.attachments = attachments;
    if (category) evaluation.category = category;

    await evaluation.save();

    res.status(200).json({
      success: true,
      message: 'Evaluation updated successfully',
      data: evaluation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating evaluation',
      error: error.message,
    });
  }
};

export const deleteEvaluation = async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluation not found',
      });
    }

    // Check if user created this evaluation or is admin
    if (evaluation.evaluatorId.toString() !== authReq.user.userId && authReq.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await Evaluation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Evaluation deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting evaluation',
      error: error.message,
    });
  }
};

