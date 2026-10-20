'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  BookOpen,
  DollarSign,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function AdminPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'overview' | 'scholarships'>('applications');

  // Application action state
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Scholarship grant form state
  const [scholarshipStudentId, setScholarshipStudentId] = useState('');
  const [scholarshipCourseId, setScholarshipCourseId] = useState('');
  const [scholarshipReason, setScholarshipReason] = useState('Merit and hardship sponsorship');
  const [granting, setGranting] = useState(false);

  const fetchAdminData = () => {
    Promise.all([
      apiFetch('/api/auth/me'),
      apiFetch('/api/analytics/admin'),
      apiFetch('/api/teacher-applications'),
    ]).then(([authRes, analyticsRes, appRes]) => {
      if (!authRes.success || !authRes.user) {
        router.push('/auth/login?redirect=/admin');
        return;
      }
      if (authRes.user.role !== 'super_admin' && authRes.user.role !== 'academic_admin') {
        router.push('/student');
        return;
      }
      setUser(authRes.user);
      if (analyticsRes.success) setMetrics(analyticsRes);
      if (appRes.success && appRes.applications) setApplications(appRes.applications);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (status: string) => {
    if (!selectedApp) return;
    setUpdating(true);
    setActionSuccess('');

    const res = await apiFetch(`/api/teacher-applications/${selectedApp._id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        adminNotes: adminNotes || `Application status transitioned to ${status} by ${user?.name}`,
        interviewDate: interviewDate || undefined,
      }),
    });

    if (res.success) {
      setActionSuccess(`Application status successfully updated to ${status}.`);
      setSelectedApp(null);
      setAdminNotes('');
      setInterviewDate('');
      fetchAdminData();
    }
    setUpdating(false);
  };

  const handleGrantScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    setGranting(true);

    const res = await apiFetch('/api/payments/scholarship', {
      method: 'POST',
      body: JSON.stringify({
        studentId: scholarshipStudentId,
        courseId: scholarshipCourseId,
        reason: scholarshipReason,
      }),
    });

    if (res.success) {
      setActionSuccess('Scholarship granted and student enrolled successfully!');
      setScholarshipStudentId('');
      setScholarshipCourseId('');
      fetchAdminData();
    }
    setGranting(false);
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto py-20 text-center text-slate-400">Loading Platform Administration...</div>;
  }

  const overview = metrics?.overview;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Administration & Academic Dean</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            EduEnlighten Administrative Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            System analytics, educator recruitment vetting, academic courses, and revenue oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-mono">
            Role: {user?.role}
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-teal-950/60 border border-teal-500/40 text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="glass-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 block">Total Users</span>
          <div className="text-xl font-bold text-white">{overview?.totalUsers || 0}</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 block">Active Students</span>
          <div className="text-xl font-bold text-cyan-400">{overview?.totalStudents || 0}</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 block">Approved Teachers</span>
          <div className="text-xl font-bold text-teal-400">{overview?.totalTeachers || 0}</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 block">Pending Apps</span>
          <div className="text-xl font-bold text-amber-400">{overview?.pendingApplications || 0}</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 block">Live Courses</span>
          <div className="text-xl font-bold text-white">{overview?.totalCourses || 0}</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 block">Revenue (USD)</span>
          <div className="text-xl font-bold text-teal-400">${overview?.totalRevenueUsd || 0}</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 block">Revenue (ZWL)</span>
          <div className="text-xl font-bold text-sky-400">{overview?.totalRevenueZwl?.toLocaleString() || 0}</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-white/10 text-sm font-medium">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'applications'
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Teacher Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Curricula Distribution
          </button>
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'scholarships'
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Grant Scholarship
          </button>
        </div>

        {/* Tab 1: Teacher Applications Review Workflow */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Applications awaiting review or interview scheduling</span>
              <span>Showing {applications.length} applicants</span>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app._id} className="glass-card rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white">{app.fullName}</h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                              app.status === 'approved'
                                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                : app.status === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {app.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-4 flex-wrap">
                          <span>Email: {app.email}</span>
                          <span>Phone: {app.phone}</span>
                          <span>Experience: {app.teachingExperienceYears} years</span>
                          <span>Location: {app.city}, {app.country}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="btn-primary px-4 py-2 text-xs font-semibold shrink-0"
                        >
                          Review & Action
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                      <div>
                        <strong className="text-slate-300">Qualifications:</strong>{' '}
                        <span className="text-slate-400">{app.qualificationsSummary}</span>
                      </div>
                      <div>
                        <strong className="text-slate-300">Curricula Expertise:</strong>{' '}
                        <span className="text-cyan-300">{app.curriculaExpertise?.join(', ')}</span>
                      </div>
                      <div>
                        <strong className="text-slate-300">Subjects to Teach:</strong>{' '}
                        <span className="text-teal-300">{app.subjectsToTeach?.join(', ')}</span>
                      </div>
                      <div>
                        <strong className="text-slate-300">Bio:</strong>{' '}
                        <span className="text-slate-400 italic">&ldquo;{app.bio}&rdquo;</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl glass-card space-y-2 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                <p>No teacher applications currently pending.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Curricula Breakdown */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 space-y-2">
              <span className="text-xs font-semibold text-sky-400 uppercase">Cambridge International</span>
              <div className="text-3xl font-extrabold text-white">
                {metrics?.curriculaBreakdown?.cambridge || 0}
              </div>
              <p className="text-xs text-slate-400">Published Cambridge IGCSE and A Level courses.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-2">
              <span className="text-xs font-semibold text-teal-400 uppercase">ZIMSEC Academy</span>
              <div className="text-3xl font-extrabold text-white">
                {metrics?.curriculaBreakdown?.zimsec || 0}
              </div>
              <p className="text-xs text-slate-400">Published ZIMSEC Ordinary & Advanced Level revision courses.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-2">
              <span className="text-xs font-semibold text-purple-400 uppercase">Digital Skills Academy</span>
              <div className="text-3xl font-extrabold text-white">
                {metrics?.curriculaBreakdown?.digitalSkills || 0}
              </div>
              <p className="text-xs text-slate-400">Published Professional Frontend, Backend, & PM bootcamps.</p>
            </div>
          </div>
        )}

        {/* Tab 3: Grant Scholarship */}
        {activeTab === 'scholarships' && (
          <div className="max-w-xl glass-card rounded-2xl p-7 space-y-5 border border-cyan-500/20">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Grant Sponsored Access / Scholarship</h3>
              <p className="text-xs text-slate-400">
                Instantly enrol an eligible student facing financial hardship into any course with zero fees.
              </p>
            </div>

            <form onSubmit={handleGrantScholarship} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Student User ID *</label>
                <input
                  type="text"
                  required
                  placeholder="Paste student ObjectId (e.g. from Users list)"
                  value={scholarshipStudentId}
                  onChange={(e) => setScholarshipStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Course ID *</label>
                <input
                  type="text"
                  required
                  placeholder="Paste course ObjectId"
                  value={scholarshipCourseId}
                  onChange={(e) => setScholarshipCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Scholarship Approval Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={scholarshipReason}
                  onChange={(e) => setScholarshipReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={granting}
                className="btn-primary w-full py-2.5 text-xs font-semibold"
              >
                {granting ? 'Granting Access...' : 'Approve & Activate Scholarship'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Review Teacher Application Action Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 sm:p-7 max-w-lg w-full space-y-5 border border-cyan-500/40">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Review Applicant: {selectedApp.fullName}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs">
              <p><strong className="text-slate-300">Qualifications:</strong> {selectedApp.qualificationsSummary}</p>
              <p><strong className="text-slate-300">Expertise:</strong> {selectedApp.curriculaExpertise?.join(', ')}</p>
              <p><strong className="text-slate-300">Subjects:</strong> {selectedApp.subjectsToTeach?.join(', ')}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Academic Review Notes</label>
              <textarea
                rows={3}
                placeholder="Record interview observations, credential verification, and feedback..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Interview Date (if scheduling)</label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Workflow Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleUpdateStatus('under_review')}
                disabled={updating}
                className="btn-secondary py-2"
              >
                Set Under Review
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('interview_scheduled')}
                disabled={updating}
                className="p-2 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-sky-200 border border-sky-500/30"
              >
                Schedule Demo Lesson
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('approved')}
                disabled={updating}
                className="p-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold"
              >
                ✓ Approve & Promote
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('rejected')}
                disabled={updating}
                className="p-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/30"
              >
                ✕ Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
