import crypto from 'crypto';
import { Payment, IPayment, PaymentStatus } from '../../models/Payment.js';
import { Course } from '../../models/Course.js';
import { User } from '../../models/User.js';
import { EnrolmentService } from '../enrolments/enrolments.service.js';
import { AppError } from '../../middleware/errorHandler.js';
import { ENV } from '../../config/env.js';

export class PaymentsService {
  static async initiatePayment(data: {
    studentId: string;
    courseId: string;
    paymentMethod: string;
    currency?: 'USD' | 'ZWL';
  }) {
    const [student, course] = await Promise.all([
      User.findById(data.studentId),
      Course.findById(data.courseId),
    ]);

    if (!student) throw new AppError('Student not found', 404);
    if (!course) throw new AppError('Course not found', 404);

    const currency = data.currency || 'USD';
    const amount =
      currency === 'USD'
        ? course.discountPriceUsd || course.priceUsd
        : course.priceZwl || (course.discountPriceUsd || course.priceUsd) * 25; // estimated rate for ZWL

    const txRef = `EDU-TX-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const receiptNumber = `REC-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const payment = new Payment({
      user: student._id,
      course: course._id,
      transactionReference: txRef,
      amount,
      currency,
      provider: ENV.PAYMENT_PROVIDER as any,
      status: 'pending',
      paymentMethod: data.paymentMethod || 'EcoCash / Mobile Money',
      receiptNumber,
      payerEmail: student.email,
      payerPhone: student.phone || '',
    });

    await payment.save();

    // Prepare checkout response based on provider abstraction
    return {
      paymentId: payment._id,
      transactionReference: txRef,
      receiptNumber,
      amount,
      currency,
      courseTitle: course.title,
      paymentMethod: data.paymentMethod,
      provider: ENV.PAYMENT_PROVIDER,
      instructions:
        'To complete payment, confirm payment via your selected payment channel or simulate completion below for testing.',
    };
  }

  static async completePayment(transactionReference: string, providerRef?: string) {
    const payment = await Payment.findOne({ transactionReference });
    if (!payment) {
      throw new AppError('Transaction not found', 404);
    }

    if (payment.status === 'paid') {
      return { payment, alreadyPaid: true };
    }

    payment.status = 'paid';
    payment.paidAt = new Date();
    payment.providerReference = providerRef || `PRV-${Date.now()}`;
    await payment.save();

    // Automatically activate enrolment for student
    await EnrolmentService.enrolInCourse(
      payment.user.toString(),
      payment.course.toString(),
      payment._id.toString()
    );

    return { payment, alreadyPaid: false };
  }

  static async grantScholarship(data: {
    studentId: string;
    courseId: string;
    reason: string;
    grantedBy: string;
  }) {
    const [student, course] = await Promise.all([
      User.findById(data.studentId),
      Course.findById(data.courseId),
    ]);

    if (!student || !course) throw new AppError('Student or Course not found', 404);

    const txRef = `EDU-SCHOLAR-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const receiptNumber = `SCH-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const payment = new Payment({
      user: student._id,
      course: course._id,
      transactionReference: txRef,
      amount: 0,
      currency: 'USD',
      provider: 'scholarship',
      status: 'paid',
      paymentMethod: 'EduEnlighten Scholarship / Sponsored Access',
      receiptNumber,
      payerEmail: student.email,
      isScholarship: true,
      scholarshipReason: data.reason,
      paidAt: new Date(),
    });

    await payment.save();

    await EnrolmentService.enrolInCourse(student._id.toString(), course._id.toString(), payment._id.toString());
    return payment;
  }

  static async getMyPayments(studentId: string) {
    return Payment.find({ user: studentId }).populate('course', 'title level').sort({ createdAt: -1 });
  }

  static async listAllPayments(limit = 50) {
    return Payment.find()
      .populate('user', 'name email')
      .populate('course', 'title level')
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}
