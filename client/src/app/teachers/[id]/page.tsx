'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Users,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  Video,
  Award,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Globe,
  Sparkles,
  X,
  GraduationCap,
  Lock,
  LogIn,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface TeacherPageProps {
  params: Promise<{ id: string }>;
}

export default function TeacherProfilePage({ params }: TeacherPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Booking Form State
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeacher();
    // Check if user is logged in
    apiFetch('/api/auth/me').then((res) => {
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setStudentName(res.user.name || '');
        setStudentEmail(res.user.email || '');
      } else {
        setCurrentUser(null);
      }
    });
  }, [id]);

  const fetchTeacher = async () => {
    setLoading(true);
    const res = await apiFetch(`/api/teachers/${id}`);
    if (res.success && res.data) {
      setTeacher(res.data);
      if (res.data.authorizedSubjects?.length > 0) {
        setSelectedSubject(res.data.authorizedSubjects[0]);
      }
      if (res.data.availabilitySchedule?.length > 0) {
        const firstDay = res.data.availabilitySchedule[0];
        if (firstDay.slots?.length > 0) {
          setSelectedSlot(firstDay.slots[0]);
        }
      }
    }
    setLoading(false);
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      window.location.href = `/auth/login?type=tutoring&redirect=${encodeURIComponent(
        window.location.pathname
      )}&title=Private+Tutoring+Login`;
      return;
    }

    setBookingError(null);
    setBookingLoading(true);

    const res = await apiFetch(`/api/teachers/${id}/book`, {
      method: 'POST',
      body: JSON.stringify({
        studentName,
        studentEmail,
        subject: selectedSubject,
        curriculum: teacher?.curriculumSpecialties?.[0] || 'Cambridge International',
        scheduledDate: selectedDate,
        timeSlot: selectedSlot,
        learningGoals,
        priceUsd: teacher?.sessionBookingPriceUsd || teacher?.hourlyRateUsd || 20,
      }),
    });

    setBookingLoading(false);

    if (res.success && res.data) {
      setBookingSuccess(res.data);
    } else {
      setBookingError(res.message || 'Failed to book session. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading educator profile...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100 p-4">
        <div className="glass-card rounded-2xl p-8 max-w-md text-center border border-white/10 space-y-4">
          <Users className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold">Teacher Profile Not Found</h2>
          <p className="text-slate-400 text-sm">This educator profile is not active or has been updated.</p>
          <Link
            href="/independent-teachers"
            className="inline-block py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-sm transition-all"
          >
            Back to Teacher Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/independent-teachers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Teachers</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Teacher Profile & Credentials */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-cyan-500/20 shrink-0"
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Independent Faculty
                    </span>
                    {teacher.safeguardingVetted && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Safeguarding Vetted</span>
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-extrabold text-white">{teacher.name}</h1>
                  <p className="text-slate-300 text-sm">{teacher.headline}</p>

                  <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                    <div className="flex items-center text-amber-400 font-bold gap-1">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{teacher.rating?.toFixed(1) || '5.0'}</span>
                      <span className="text-slate-400 font-normal">({teacher.reviewsCount || 0} reviews)</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300">{teacher.teachingExperienceYears} Years Experience</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300">{teacher.totalStudentsTaught || 200}+ Students Taught</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio & Philosophy */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>About the Educator</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{teacher.bio}</p>
            </div>

            {/* Qualifications & Degrees */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                <span>Academic & Professional Credentials</span>
              </h2>
              <div className="space-y-3">
                {teacher.qualifications?.map((q: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{q.degree}</h4>
                      <p className="text-xs text-slate-400">
                        {q.institution} {q.yearCompleted ? `• Graduated ${q.yearCompleted}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects & Curricula Specialities */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white">Authorized Subjects & Curricula</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Curricula Supported:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {teacher.curriculumSpecialties?.map((c: string) => (
                      <span
                        key={c}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Subjects Taught:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {teacher.authorizedSubjects?.map((subj: string) => (
                      <span
                        key={subj}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-white/10 text-slate-200"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Student Reviews */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>Student & Parent Reviews</span>
              </h2>

              {teacher.reviews && teacher.reviews.length > 0 ? (
                <div className="space-y-4">
                  {teacher.reviews.map((r: any) => (
                    <div key={r.id} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-xs">{r.studentName}</span>
                        <div className="flex items-center text-amber-400 gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 italic font-serif">&ldquo;{r.comment}&rdquo;</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  New independent educator on EduEnlighten with verified credentials.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Direct 1-on-1 Booking Widget */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 sticky top-24 shadow-2xl space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  1-on-1 Private Tuition Rate
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-white">${teacher.hourlyRateUsd}</span>
                  <span className="text-slate-400 text-xs"> / 60-min session</span>
                </div>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Instant live video room generation</span>
                </p>
              </div>

              {/* Booking Success Confirmation */}
              {bookingSuccess ? (
                <div className="p-5 rounded-2xl bg-cyan-950/50 border border-cyan-400/40 text-slate-200 space-y-4 text-xs">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    <span>Session Booked Successfully!</span>
                  </div>

                  <p>
                    Your 1-on-1 live lesson with <strong className="text-white">{teacher.name}</strong> is confirmed for{' '}
                    <strong className="text-white">{bookingSuccess.scheduledDate}</strong> at{' '}
                    <strong className="text-white">{bookingSuccess.timeSlot}</strong>.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Topic Focus:</span>
                    <p className="text-white font-medium">{bookingSuccess.subject}</p>
                  </div>

                  <div className="pt-2">
                    <a
                      href={bookingSuccess.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-white flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Enter Live Jitsi Classroom Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => setBookingSuccess(null)}
                    className="w-full py-2 text-center text-slate-400 hover:text-white transition-colors"
                  >
                    Book Another Session
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!currentUser && (
                    <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-xs space-y-2.5">
                      <div className="flex items-center gap-2 text-cyan-300 font-bold">
                        <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Log in first to start learning</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Please sign in with your student account to schedule and start your 1-on-1 session with {teacher.name}.
                      </p>
                      <Link
                        href={`/auth/login?type=tutoring&redirect=${encodeURIComponent(
                          typeof window !== 'undefined' ? window.location.pathname : `/teachers/${id}`
                        )}&title=Private+Tutoring+Login`}
                        className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Log In to Start Learning</span>
                      </Link>
                    </div>
                  )}

                  <form onSubmit={handleBookSession} className="space-y-4 text-xs">
                  {bookingError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                      {bookingError}
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Tawanda Sibanda"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Select Subject *</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {teacher.authorizedSubjects?.map((subj: string) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Select Date *</label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 10)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Select Time Slot *</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {teacher.availabilitySchedule?.[0]?.slots?.map((s: string) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      <option value="16:00 - 17:00 CAT">16:00 - 17:00 CAT</option>
                      <option value="17:30 - 18:30 CAT">17:30 - 18:30 CAT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      What specific topic do you want to learn? *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={learningGoals}
                      onChange={(e) => setLearningGoals(e.target.value)}
                      placeholder="e.g. Need help with completing the square and quadratic functions for Cambridge Paper 2..."
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-teal-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {bookingLoading ? (
                      <span>Connecting with Teacher...</span>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        <span>Book 1-on-1 Lesson (${teacher.hourlyRateUsd})</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
