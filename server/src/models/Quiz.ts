import mongoose, { Document, Schema, Model } from 'mongoose';

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface IQuizQuestion {
  questionText: string;
  type: QuestionType;
  options?: string[]; // for multiple choice
  correctAnswer: string | number; // index or text
  explanation: string;
  points: number;
}

export interface IQuiz extends Document {
  course: mongoose.Types.ObjectId;
  module: mongoose.Types.ObjectId;
  title: string;
  description: string;
  durationMinutes: number; // 0 = untimed
  passingScorePercentage: number;
  maxAttempts: number;
  randomizeQuestions: boolean;
  questions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, default: 30 },
    passingScorePercentage: { type: Number, default: 70 },
    maxAttempts: { type: Number, default: 3 },
    randomizeQuestions: { type: Boolean, default: false },
    questions: [
      {
        questionText: { type: String, required: true },
        type: {
          type: String,
          enum: ['multiple_choice', 'true_false', 'short_answer'],
          default: 'multiple_choice',
        },
        options: [{ type: String }],
        correctAnswer: { type: Schema.Types.Mixed, required: true },
        explanation: { type: String, default: '' },
        points: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export const Quiz: Model<IQuiz> =
  mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);

export interface IQuizAttempt extends Document {
  quiz: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  answers: {
    questionIndex: number;
    userAnswer: string | number;
    isCorrect: boolean;
    pointsAwarded: number;
  }[];
  totalScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  completedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    answers: [
      {
        questionIndex: { type: Number, required: true },
        userAnswer: { type: Schema.Types.Mixed },
        isCorrect: { type: Boolean, default: false },
        pointsAwarded: { type: Number, default: 0 },
      },
    ],
    totalScore: { type: Number, default: 0 },
    maxPossibleScore: { type: Number, default: 0 },
    scorePercentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    timeSpentSeconds: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const QuizAttempt: Model<IQuizAttempt> =
  mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
