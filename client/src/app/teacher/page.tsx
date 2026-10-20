'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Video,
  BookOpen,
  PlusCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Live session scheduler modal
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionCourseId, setSessionCourseId] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState('');
  const [scheduling, setScheduling] = useState(false);

  // Grading state
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('Excellent practical implementation and clean structure.');
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/auth/me'),
      apiFetch('/api/analytics/teacher'),
      apiFetch('/api/assessments/submissions/to-grade'),
    ]).then(([authRes, analyticsRes, subRes]) => {
      if (!authRes.success || !authRes.user) {
        router.push('/auth/login?redirect=/teacher');
        return;
      }
      if (authRes.user.role !== 'teacher' && authRes.user.role !== 'super_admin') {
        router.push('/student');
        return;
      }
      setUser(authRes.user);
      if (analyticsRes.success) setMetrics(analyticsRes);
      if (subRes.success && subRes.submissions) setSubmissions(subRes.submissions);
      setLoading(false);
    });
  }, []);

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduling(true);

    const startTime = new Date(sessionStartTime || Date.now() + 24 * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const res = await apiFetch('/api/live-classes', {
      method: 'POST',
      body: JSON.stringify({
        courseId: sessionCourseId || metrics?.courses?.[0]?.id,
        title: sessionTitle || 'Live Examination Revision Clinic',
        scheduledStartTime: startTime.toISOString(),
        scheduledEndTime: endTime.toISOString(),
      }),
    });

    if (res.success) {
      setSessionModalOpen(false);
      setSessionTitle('');
      // refresh analytics
      const updated = await apiFetch('/api/analytics/teacher');
      if (updated.success) setMetrics(updated);
    }
    setScheduling(false);
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission) return;
    setGrading(true);

    const res = await apiFetch(`/api/assessments/submissions/${selectedSubmission._id}/grade`, {
      method: 'POST',
      body: JSON.stringify({
        score: gradeScore,
        feedback: gradeFeedback,
      }),
    });

    if (res.success) {
      setSelectedSubmission(null);
      // refresh submissions
      const subRes = await apiFetch('/api/assessments/submissions/to-grade');
      if (subRes.success && subRes.submissions) setSubmissions(subRes.submissions);
    }
    setGrading(false);
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto py-20 text-center text-slate-400">Loading Instructor Portal...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-teal-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Instructor Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Manage your courses, schedule live classrooms, and assess student submissions.
          </p>
        </div>

        <button
          onClick={() => setSessionModalOpen(true)}
          className="btn-primary px-5 py-2.5 text-xs font-semibold shrink-0 flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          <span>Schedule Live Class</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Assigned Courses</span>
          <div className="text-2xl font-extrabold text-white">{metrics?.coursesCount || 0}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Enrolled Learners</span>
          <div className="text-2xl font-extrabold text-cyan-400">{metrics?.totalEnrolments || 0}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Pending Marking</span>
          <div className="text-2xl font-extrabold text-amber-400">{submissions.length}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Upcoming Live Sessions</span>
          <div className="text-2xl font-extrabold text-teal-400">{metrics?.upcomingSessions || 0}</div>
        </div>
      </div>

      {/* Main Grid: My Courses & Submissions to Grade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Courses */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span>My Courses & Modules</span>
          </h2>

          <div className="space-y-4">
            {metrics?.courses?.map((c: any) => (
              <div key={c.id} className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-950 border border-teal-500/30 text-teal-300">
                      {c.level}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">Status: {c.status}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{c.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span>{c.enrolledCount || 0} enrolled students</span>
                    <span>★ {c.rating} rating</span>
                  </div>
                </div>

                <Link
                  href={`/courses/${c.id}`}
                  className="btn-secondary px-4 py-2 text-xs font-semibold shrink-0"
                >
                  View Course Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Submissions to Grade */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-400" />
            <span>Assignments to Mark ({submissions.length})</span>
          </h2>

          {submissions.length > 0 ? (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div key={sub._id} className="glass-card rounded-xl p-4 space-y-3 border border-amber-500/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{sub.student?.name}</span>
                    <span className="text-[10px] text-amber-300 font-mono">
                      {sub.status === 'submitted' ? 'Needs Grading' : 'Graded'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Assignment: <strong className="text-white">{sub.assignment?.title}</strong>
                  </p>

                  <div className="p-2.5 rounded bg-white/[0.03] text-xs text-slate-300 italic">
                    &ldquo;{sub.content || 'Submission file uploaded.'}&rdquo;
                  </div>

                  <button
                    onClick={() => setSelectedSubmission(sub)}
                    className="btn-primary w-full py-1.5 text-xs font-semibold"
                  >
                    Grade & Provide Feedback
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-center text-xs text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
              <p>All student submissions have been graded!</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Live Session Modal */}
      {sessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleScheduleSession} className="glass-card rounded-2xl p-6 max-w-md w-full space-y-4 border border-teal-500/40">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Schedule Live Class Session</h3>
              <button
                type="button"
                onClick={() => setSessionModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Session Topic *</label>
              <input
                type="text"
                required
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="e.g. Cambridge IGCSE Math: Paper 2 Revision Drill"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Course *</label>
              <select
                value={sessionCourseId}
                onChange={(e) => setSessionCourseId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                {metrics?.courses?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={sessionStartTime}
                onChange={(e) => setSessionStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button type="submit" disabled={scheduling} className="btn-primary w-full py-2 text-xs font-semibold">
                {scheduling ? 'Scheduling...' : 'Confirm Live Session'}
              </button>
              <button
                type="button"
                onClick={() => setSessionModalOpen(false)}
                className="btn-secondary w-full py-2 text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grade Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full space-y-4 border border-amber-500/40">
            <h3 className="text-base font-bold text-white">
              Grade Submission: {selectedSubmission.student?.name}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Score (out of 100) *</label>
              <input
                type="number"
                min="0"
                max="100"
                value={gradeScore}
                onChange={(e) => setGradeScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Teacher Feedback & Rubric Notes *</label>
              <textarea
                rows={3}
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleGradeSubmission}
                disabled={grading}
                className="btn-primary w-full py-2 text-xs font-semibold"
              >
                {grading ? 'Submitting Grade...' : 'Publish Score & Feedback'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="btn-secondary w-full py-2 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
