'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Star,
  Users,
  CheckCircle2,
  PlayCircle,
  FileText,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Lock,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slugOrId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'outcomes' | 'instructor'>('syllabus');
  const [enrolling, setEnrolling] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('EcoCash / Mobile Money');
  const [checkoutData, setCheckoutData] = useState<any>(null);

  useEffect(() => {
    apiFetch(`/api/courses/${slugOrId}`).then((res) => {
      if (res.success && res.course) {
        setData(res);
      }
      setLoading(false);
    });
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading course syllabus and details...</p>
      </div>
    );
  }

  if (!data || !data.course) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Course Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested course does not exist or may have been updated.
        </p>
        <Link href="/courses" className="btn-primary inline-flex px-6 py-2.5 text-xs font-semibold">
          Return to Course Catalogue
        </Link>
      </div>
    );
  }

  const { course, modules } = data;

  const handleEnrolOrPurchase = async () => {
    setEnrolling(true);
    setPaymentError('');

    // Check if user is logged in
    const authRes = await apiFetch('/api/auth/me');
    if (!authRes.success || !authRes.user) {
      router.push(`/auth/login?redirect=/courses/${course.slug}`);
      return;
    }

    if (course.pricingType === 'free') {
      const enrolRes = await apiFetch(`/api/enrolments/courses/${course._id}/enrol`, {
        method: 'POST',
      });
      if (enrolRes.success) {
        router.push('/student');
      } else {
        setPaymentError(enrolRes.message || 'Enrolment failed.');
      }
      setEnrolling(false);
      return;
    }

    // Initiate payment flow
    const payRes = await apiFetch('/api/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({
        courseId: course._id,
        paymentMethod: selectedMethod,
        currency: 'USD',
      }),
    });

    if (payRes.success) {
      setCheckoutData(payRes);
      setPaymentModalOpen(true);
    } else {
      setPaymentError(payRes.message || 'Unable to initiate payment.');
    }
    setEnrolling(false);
  };

  const handleConfirmPayment = async () => {
    if (!checkoutData?.transactionReference) return;
    setEnrolling(true);
    const completeRes = await apiFetch('/api/payments/complete', {
      method: 'POST',
      body: JSON.stringify({
        transactionReference: checkoutData.transactionReference,
        providerRef: 'SIMULATED-AUTH-SUCCESS',
      }),
    });

    if (completeRes.success) {
      setPaymentSuccess(true);
      setTimeout(() => {
        router.push('/student');
      }, 1500);
    } else {
      setPaymentError(completeRes.message || 'Payment confirmation failed');
    }
    setEnrolling(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Course Banner / Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Title & Info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              {course.curriculum?.name || 'Academic'}
            </span>
            <span className="text-xs text-slate-400 capitalize">{course.level}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-teal-400 capitalize">{course.deliveryFormat.replace('_', ' ')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {course.description}
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-300 pt-3 border-t border-white/5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white">{course.rating || '4.95'}</span>
              <span className="text-slate-400">({course.reviewsCount || 42} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{course.durationHours} Total Hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-400" />
              <span>{course.enrolledStudentsCount || 0} Enrolled Learners</span>
            </div>
          </div>
        </div>

        {/* Right Column: Enrollment Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-cyan-500/30 space-y-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Course Tuition</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                {course.pricingType === 'free' ? 'Free' : `$${course.discountPriceUsd || course.priceUsd}`}
              </span>
              {course.discountPriceUsd && (
                <span className="text-base text-slate-400 line-through">
                  ${course.priceUsd}
                </span>
              )}
            </div>
            {course.priceZwl && (
              <span className="text-xs text-teal-400 block font-medium">
                Approx. ZWL {course.priceZwl.toLocaleString()} via EcoCash / Mobile Money
              </span>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleEnrolOrPurchase}
              disabled={enrolling}
              className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>{course.pricingType === 'free' ? 'Enrol for Free' : 'Purchase & Enrol'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {paymentError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/20">
                {paymentError}
              </p>
            )}

            <div className="text-[11px] text-slate-400 text-center space-y-1">
              <p>Instant access upon confirmation • 30-day satisfaction guarantee</p>
              <Link href="/scholarships" className="text-cyan-400 hover:underline block pt-1">
                Facing financial hardship? Apply for sponsored scholarship
              </Link>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Full syllabus video lessons & notes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Diagnostic quizzes & practical project</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Live Q&A classroom sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Tamper-proof verifiable completion certificate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Syllabus / Outcomes / Instructor */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-white/10 text-sm font-medium">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'syllabus'
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Modules & Syllabus ({modules?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('outcomes')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'outcomes'
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Learning Outcomes
          </button>
          <button
            onClick={() => setActiveTab('instructor')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'instructor'
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Instructor
          </button>
        </div>

        {/* Tab 1: Syllabus Breakdown */}
        {activeTab === 'syllabus' && (
          <div className="space-y-4">
            {modules && modules.length > 0 ? (
              modules.map((mod: any, mi: number) => (
                <div key={mod._id} className="glass-card rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">
                      {mod.title}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {mod.lessons?.length || 0} Lessons
                    </span>
                  </div>

                  {mod.description && (
                    <p className="text-xs text-slate-300">{mod.description}</p>
                  )}

                  {/* Lessons List */}
                  <div className="space-y-1.5 pt-2">
                    {mod.lessons?.map((lesson: any) => (
                      <div
                        key={lesson._id}
                        className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 text-slate-200">
                          {lesson.type === 'video' ? (
                            <PlayCircle className="w-4 h-4 text-cyan-400" />
                          ) : lesson.type === 'quiz' ? (
                            <HelpCircle className="w-4 h-4 text-amber-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-teal-400" />
                          )}
                          <span>{lesson.title}</span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400">
                          <span>{lesson.durationMinutes} min</span>
                          {lesson.isFreePreview ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                              Free Preview
                            </span>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Modules are currently being updated by the instructor.</p>
            )}
          </div>
        )}

        {/* Tab 2: Outcomes & Prerequisites */}
        {activeTab === 'outcomes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">What You Will Learn</h3>
              <ul className="space-y-3">
                {course.learningOutcomes?.map((outcome: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Prerequisites & Requirements</h3>
              <ul className="space-y-3">
                {course.prerequisites?.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Instructor Information */}
        {activeTab === 'instructor' && (
          <div className="glass-card rounded-2xl p-7 space-y-4 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-center font-bold text-xl text-cyan-300">
                {course.teacher?.name?.[0] || 'T'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{course.teacher?.name}</h3>
                <span className="text-xs text-cyan-400 font-medium">Verified EduEnlighten Subject Specialist</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {course.teacher?.bio || 'Experienced educator committed to high academic standards and practical mastery.'}
            </p>
          </div>
        )}
      </div>

      {/* Payment Confirmation Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full space-y-5 border border-cyan-500/40">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Complete Course Purchase</h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1 text-xs">
              <div className="text-slate-400">Course:</div>
              <div className="font-semibold text-white">{course.title}</div>
              <div className="flex justify-between pt-2 text-sm font-bold text-cyan-300">
                <span>Total Amount:</span>
                <span>${checkoutData?.amount} USD</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Select Payment Channel:</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="EcoCash / Mobile Money">EcoCash / Zimbabwean Mobile Money</option>
                <option value="Visa / Mastercard">Visa / Mastercard / Credit Card</option>
                <option value="OneMoney">OneMoney</option>
              </select>
            </div>

            {paymentSuccess ? (
              <div className="p-4 rounded-xl bg-teal-950/60 border border-teal-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                <p className="text-sm font-bold text-white">Payment Verified!</p>
                <p className="text-xs text-teal-300">Redirecting to your student portal...</p>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleConfirmPayment}
                  disabled={enrolling}
                  className="btn-primary w-full py-2.5 text-xs font-semibold"
                >
                  {enrolling ? 'Verifying Transaction...' : 'Simulate / Confirm Payment'}
                </button>
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="btn-secondary w-full py-2 text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
