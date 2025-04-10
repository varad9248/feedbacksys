export type QuestionType =
  | 'short-text'
  | 'long-text'
  | 'multiple-choice'
  | 'checkbox'
  | 'star-rating'
  | 'dropdown'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file-upload';

export interface FormElement {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  options?: string[];
  maxLength?: number;
  maxStars?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  dateFormat?: string;
  timeFormat?: string;
}

export interface FormConfig {
  title: string;
  description?: string;
  elements: FormElement[];
  theme?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily?: string;
    borderRadius?: string;
    buttonStyle?: 'solid' | 'outline' | 'ghost';
  };
  logo?: {
    url: string;
    alt: string;
  };
  status: 'draft' | 'published';
  publishedUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}