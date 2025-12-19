import mongoose, { Schema } from 'mongoose';
import { IEvaluation } from '../types';

const EvaluationSchema = new Schema<IEvaluation>(
  {
    childId: {
      type: String,
      required: [true, 'Child ID is required'],
      ref: 'Child',
    },
    evaluatorId: {
      type: String,
      required: [true, 'Evaluator ID is required'],
      ref: 'User',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['PHYSICAL', 'COGNITIVE', 'SOCIAL', 'EMOTIONAL', 'LANGUAGE', 'OTHER'],
    },
    observation: {
      type: String,
      required: [true, 'Observation is required'],
      trim: true,
    },
    recommendation: {
      type: String,
      trim: true,
    },
    attachments: [String],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
EvaluationSchema.index({ childId: 1, date: -1 });
EvaluationSchema.index({ evaluatorId: 1 });

export const Evaluation = mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);

