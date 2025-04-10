import mongoose from 'mongoose';

export interface IResponse {
  formId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  data: Record<string, any>;
  submittedAt: Date;
}

const responseSchema = new mongoose.Schema<IResponse>({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Response = mongoose.models.Response || mongoose.model<IResponse>('Response', responseSchema);