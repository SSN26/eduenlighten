import { Quiz, QuizAttempt, IQuiz } from '../../models/Quiz.js';
import { Assignment } from '../../models/Assignment.js';
import { Submission } from '../../models/Submission.js';
import { AppError } from '../../middleware/errorHandler.js';

export class AssessmentsService {
  static async getQuizzesByCourse(courseId: string) {
    return Quiz.find({ course: courseId }).select('-questions.correctAnswer');
  }

  static async getQuizForStudent(quizId: string) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    const safeQuiz = quiz.toObject();
    // Do not reveal correct answers or explanations prior to submission
    (safeQuiz as any).questions = safeQuiz.questions.map((q: any) => ({
      questionText: q.questionText,
      type: q.type,
      options: q.options,
      points: q.points,
    }));

    return safeQuiz;
  }

  static async submitQuizAttempt(
    quizId: string,
    studentId: string,
    userAnswers: { questionIndex: number; userAnswer: string | number }[],
    timeSpentSeconds?: number
  ) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    let totalScore = 0;
    let maxPossibleScore = 0;

    const evaluatedAnswers = quiz.questions.map((q, index) => {
      const userAnsObj = userAnswers.find((a) => a.questionIndex === index);
      const userAns = userAnsObj ? userAnsObj.userAnswer : undefined;
      const points = q.points || 1;
      maxPossibleScore += points;

      let isCorrect = false;
      if (userAns !== undefined && String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        isCorrect = true;
        totalScore += points;
      }

      return {
        questionIndex: index,
        userAnswer: userAns,
        isCorrect,
        pointsAwarded: isCorrect ? points : 0,
        explanation: q.explanation,
        correctAnswer: q.correctAnswer,
      };
    });

    const scorePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    const passed = scorePercentage >= (quiz.passingScorePercentage || 70);

    const attempt = new QuizAttempt({
      quiz: quizId,
      course: quiz.course,
      student: studentId,
      answers: evaluatedAnswers,
      totalScore,
      maxPossibleScore,
      scorePercentage,
      passed,
      timeSpentSeconds: timeSpentSeconds || 0,
      completedAt: new Date(),
    });

    await attempt.save();

    return {
      attemptId: attempt._id,
      scorePercentage,
      totalScore,
      maxPossibleScore,
      passed,
      passingScorePercentage: quiz.passingScorePercentage,
      details: evaluatedAnswers,
    };
  }

  static async getAssignmentsByCourse(courseId: string) {
    return Assignment.find({ course: courseId }).sort({ dueDate: 1 });
  }

  static async submitAssignment(
    assignmentId: string,
    studentId: string,
    data: { content: string; fileUrl?: string; fileName?: string }
  ) {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    let submission = await Submission.findOne({ assignment: assignmentId, student: studentId });
    if (submission) {
      submission.content = data.content;
      submission.fileUrl = data.fileUrl || submission.fileUrl;
      submission.fileName = data.fileName || submission.fileName;
      submission.status = 'submitted';
      submission.submittedAt = new Date();
      await submission.save();
      return submission;
    }

    submission = new Submission({
      assignment: assignmentId,
      course: assignment.course,
      student: studentId,
      content: data.content,
      fileUrl: data.fileUrl || '',
      fileName: data.fileName || '',
      status: 'submitted',
      submittedAt: new Date(),
    });

    await submission.save();
    return submission;
  }

  static async gradeSubmission(
    submissionId: string,
    teacherId: string,
    score: number,
    feedback: string
  ) {
    const submission = await Submission.findById(submissionId).populate('assignment');
    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.gradedBy = teacherId as any;
    submission.gradedAt = new Date();

    await submission.save();
    return submission;
  }

  static async getSubmissionsForTeacher(teacherId: string) {
    return Submission.find()
      .populate('assignment', 'title maxPoints dueDate rubricSummary')
      .populate('course', 'title level')
      .populate('student', 'name email avatar')
      .sort({ submittedAt: -1 });
  }
}
