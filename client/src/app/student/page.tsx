'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Clock,
  Award,
  Video,
  CheckCircle2,
  PlayCircle,
  FileText,
  Calendar,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [enrolments, setEnrolments] = useState<any[]>([]);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active quiz simulation state
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
  const [quizResult, setQuizResult] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/auth/me'),
      apiFetch('/api/enrolments/my'),
      apiFetch('/api/live-classes'),
      apiFetch('/api/certificates/my'),
    ]).then(([authRes, enrolRes, liveRes, certRes]) => {
      if (!authRes.success || !authRes.user) {
        router.push('/auth/login?redirect=/student');
        return;
      }
      setUser(authRes.user);
      if (enrolRes.success && enrolRes.enrolments) setEnrolments(enrolRes.enrolments);
      if (liveRes.success && liveRes.sessions) setLiveSessions(liveRes.sessions);
      if (certRes.success && certRes.certificates) setCertificates(certRes.certificates);
      setLoading(false);
    });
  }, []);

  const handleLessonComplete = async (courseId: string, lessonId: string) => {
    const res = await apiFetch(`/api/enrolments/courses/${courseId}/lessons/${lessonId}/complete`, {
      method: 'POST',
    });
    if (res.success) {
      // Refresh enrolments and certificates
      const [newEnrol, newCerts] = await Promise.all([
        apiFetch('/api/enrolments/my'),
        apiFetch('/api/certificates/my'),
      ]);
      if (newEnrol.success) setEnrolments(newEnrol.enrolments);
      if (newCerts.success) setCertificates(newCerts.certificates);
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    setActiveQuizId(quizId);
    setQuizResult(null);
    const res = await apiFetch(`/api/assessments/quizzes/${quizId}`);
    if (res.success && res.quiz) {
      setQuizData(res.quiz);
    }
  };

  const handleQuizSubmit = async () => {
    if (!activeQuizId || !quizData) return;
    const formattedAnswers = Object.entries(quizAnswers).map(([idx, ans]) => ({
      questionIndex: parseInt(idx, 10),
      userAnswer: ans,
    }));

    const res = await apiFetch(`/api/assessments/quizzes/${activeQuizId}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ answers: formattedAnswers, timeSpentSeconds: 120 }),
    });

    if (res.success) {
      setQuizResult(res);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Loading your learning portal...</p>
      </div>
    );
  }

  const activeCourses = enrolments.filter((e) => e.status === 'active');
  const completedCourses = enrolments.filter((e) => e.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Learning Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track your course progress, attend scheduled live classes, and complete syllabus assessments.
          </p>
        </div>

        <Link href="/courses" className="btn-primary px-5 py-2.5 text-xs font-semibold shrink-0">
          Enrol in Another Subject
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Enrolled Courses</span>
          <div className="text-2xl font-extrabold text-white">{enrolments.length}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active In Progress</span>
          <div className="text-2xl font-extrabold text-cyan-400">{activeCourses.length}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Courses Completed</span>
          <div className="text-2xl font-extrabold text-teal-400">{completedCourses.length}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Certificates Earned</span>
          <div className="text-2xl font-extrabold text-amber-400">{certificates.length}</div>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & Upcoming Live Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>My Enrolled Subjects</span>
            </h2>
            <span className="text-xs text-slate-400">{enrolments.length} enrolled</span>
          </div>

          {enrolments.length > 0 ? (
            <div className="space-y-4">
              {enrolments.map((enrol) => {
                const c = enrol.course;
                if (!c) return null;
                const isCompleted = enrol.progressPercentage >= 100 || enrol.status === 'completed';

                return (
                  <div key={enrol._id} className="glass-card rounded-2xl p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                            {c.curriculum?.name || 'Curriculum'}
                          </span>
                          <span className="text-xs text-slate-400">{c.level}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          <Link href={`/courses/${c.slug}`} className="hover:text-cyan-400 transition-colors">
                            {c.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Instructor: {c.teacher?.name || 'EduEnlighten Specialist'}
                        </p>
                      </div>

                      {isCompleted && (
                        <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Course Completion</span>
                        <span className="font-semibold text-white">{enrol.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500 rounded-full"
                          style={{ width: `${enrol.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Learning Actions */}
                    <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                      <Link
                        href={`/courses/${c.slug}`}
                        className="btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <PlayCircle className="w-4 h-4 text-cyan-400" />
                        <span>Continue Studying</span>
                      </Link>

                      {/* Simulation Button to complete next lesson */}
                      {!isCompleted ? (
                        <button
                          onClick={() => handleLessonComplete(c._id, 'simulated-lesson-id')}
                          className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                        >
                          <span>+ Mark Lesson Complete</span>
                        </button>
                      ) : (
                        <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>Certificate Issued</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl glass-card space-y-4">
              <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Enrolled Courses Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore our Cambridge, ZIMSEC, and Professional Web Development courses to begin your studies.
              </p>
              <Link href="/courses" className="btn-primary inline-block px-5 py-2 text-xs font-semibold">
                Explore Course Catalogue
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Live Classes & Certificates */}
        <div className="space-y-8">
          {/* Live Classes Card */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-cyan-500/25">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <span>Upcoming Live Classes</span>
            </h3>

            {liveSessions.length > 0 ? (
              <div className="space-y-3">
                {liveSessions.map((session) => (
                  <div key={session._id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{session.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{new Date(session.scheduledStartTime).toLocaleString()}</span>
                    </div>
                    <a
                      href={session.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full py-1.5 text-xs text-center block font-semibold mt-1"
                    >
                      Join Live Class (Jitsi)
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No live classes scheduled for today.</p>
            )}
          </div>

          {/* Earned Certificates Card */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-amber-500/25">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Earned Certificates ({certificates.length})</span>
            </h3>

            {certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert._id} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{cert.courseTitle}</span>
                      <span className="text-[10px] font-mono text-amber-300">{cert.certificateNumber}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Issued on {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                    <Link
                      href={`/verify/${cert.certificateNumber}`}
                      className="text-xs text-cyan-400 hover:underline block font-semibold"
                    >
                      View Public Verification Link →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Complete 100% of any eligible course lessons and assignments to earn a verifiable certificate.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
