import mongoose from 'mongoose';

export interface IForm {
  title: string;
  config: Record<string, any>;
  status: 'draft' | 'published' | 'archived';
  userId: mongoose.Types.ObjectId;
  shareCode? : string
  createdAt: Date;
  updatedAt: Date;
}

const formSchema = new mongoose.Schema<IForm>({
  title: {
    type: String,
    required: true,
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shareCode: {
    type: String,
    unique: true,
    sparse: true,
    required : false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Form = mongoose.models.Form || mongoose.model<IForm>('Form', formSchema);