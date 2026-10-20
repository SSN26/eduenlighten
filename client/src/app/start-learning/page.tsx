'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Users,
  Star,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  LogIn,
  CheckCircle2,
  Sparkles,
  Lock,
  GraduationCap,
  Wrench,
  Clock,
  Filter,
  X,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const POPULAR_SUBJECTS = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Accounting',
  'Business Studies',
  'Solar PV & Electrical',
  'Welding & Metal Fabrication',
  'Automotive Mechanics',
  'English Language & Literature',
  'Shona Language',
  'Computer Science & Python',
];

function StartLearningContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';

  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSubject);
  const [selectedCurriculum, setSelectedCurriculum] = useState('all');
  const [activeSubjectPill, setActiveSubjectPill] = useState(initialSubject || 'All Subjects');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal state when unauthenticated user selects a teacher
  const [authModalTeacher, setAuthModalTeacher] = useState<any>(null);

  useEffect(() => {
    // Check if user is already logged in
    apiFetch('/api/auth/me').then((res) => {
      if (res.success && res.user) {
        setCurrentUser(res.user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [searchTerm, selectedCurriculum]);

  const fetchTeachers = async () => {
    setLoading(true);
    let url = `/api/teachers?curriculum=${selectedCurriculum}`;
    if (searchTerm && searchTerm !== 'All Subjects') {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    const res = await apiFetch(url);
    if (res.success && res.data) {
      setTeachers(res.data);
    }
    setLoading(false);
  };

  const handleSubjectPillClick = (subject: string) => {
    setActiveSubjectPill(subject);
    if (subject === 'All Subjects') {
      setSearchTerm('');
    } else {
      setSearchTerm(subject);
    }
  };

  const handleSelectTeacher = (teacher: any) => {
    if (currentUser) {
      // User is logged in: proceed straight to learning & booking session
      router.push(`/teachers/${teacher._id}`);
    } else {
      // User is NOT logged in: require login first to start learning
      setAuthModalTeacher(teacher);
    }
  };

  const handleProceedToLogin = (teacher: any) => {
    const redirectUrl = `/teachers/${teacher._id}`;
    router.push(
      `/auth/login?type=tutoring&redirect=${encodeURIComponent(redirectUrl)}&title=Private+Tutoring+Login`
    );
  };

  return (
    <div className="min-h-screen bg-[#061522] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header / Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Find a Teacher &amp; Start Learning</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Search for a Subject &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c5d4] to-teal-400">
              Choose Your Teacher
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Search any subject across Cambridge, ZIMSEC, or vocational technical trades. Select your preferred
            educator to connect, schedule live 1-on-1 classes, and start learning.
          </p>
        </div>

        {/* Search Bar & Quick Filters */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/20 shadow-2xl space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchTeachers();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveSubjectPill('');
                }}
                placeholder="Search by subject (e.g. Mathematics, Physics, Chemistry, Solar PV, Accounting, Welding)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveSubjectPill('All Subjects');
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={selectedCurriculum}
              onChange={(e) => setSelectedCurriculum(e.target.value)}
              className="px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Pathways (Cambridge, ZIMSEC, TVET)</option>
              <option value="cambridge">Cambridge International</option>
              <option value="zimsec">ZIMSEC Curriculum</option>
              <option value="vocational">Vocational Trades &amp; TVET</option>
            </select>

            <button
              type="submit"
              className="btn-primary px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Search className="w-4 h-4" />
              <span>Search Teachers</span>
            </button>
          </form>

          {/* Quick Subject Filter Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>Popular Subjects:</span>
              <span>Click to filter</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SUBJECTS.map((subj) => {
                const isActive = activeSubjectPill === subj;
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => handleSubjectPillClick(subj)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25 scale-105'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Educator Registration Banner */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-cyan-950/40 via-[#0a2339]/60 to-teal-950/40 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Are you a teacher or private tutor?</h4>
              <p className="text-xs text-slate-300">
                Register your subjects and hourly rates to appear here on Start Learning and start teaching 1-on-1.
              </p>
            </div>
          </div>
          <Link
            href="/teach/independent"
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 shadow-md shadow-cyan-500/20"
          >
            <span>Register as a Teacher</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-2">
          <div>
            Showing <span className="font-bold text-white">{teachers.length}</span> verified educators
            {searchTerm ? (
              <span>
                {' '}
                for &ldquo;<strong className="text-cyan-400">{searchTerm}</strong>&rdquo;
              </span>
            ) : (
              <span> across all disciplines</span>
            )}
          </div>
          {currentUser && (
            <div className="text-teal-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Signed in as {currentUser.name}</span>
            </div>
          )}
        </div>

        {/* Teachers Results Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <p>Searching for expert teachers...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-white/10 max-w-lg mx-auto space-y-4">
            <Users className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Educators Found for this Subject</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We couldn&apos;t find teachers matching &ldquo;{searchTerm}&rdquo;. Try another subject keyword,
              explore all available educators, or register as a teacher to offer lessons.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveSubjectPill('All Subjects');
                  setSelectedCurriculum('all');
                }}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                Reset Search &amp; View All Teachers
              </button>
              <Link
                href="/teach/independent"
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center gap-1.5"
              >
                <span>Register to Teach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <div
                key={t._id}
                className="glass-card rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between group shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="space-y-4">
                  {/* Teacher Header */}
                  <div className="flex items-start gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/30 group-hover:ring-cyan-400 shrink-0 transition-all"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                          {t.name}
                        </h3>
                        {t.safeguardingVetted && (
                          <span title="Safeguarding & Identity Vetted">
                            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{t.headline}</p>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center text-amber-400 font-bold gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{t.rating?.toFixed(1) || '5.0'}</span>
                        </span>
                        <span className="text-slate-500">({t.reviewsCount || 0} reviews)</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{t.teachingExperienceYears}y exp</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{t.bio}</p>

                  {/* Authorized Subjects Tags */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Subjects Taught:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {t.authorizedSubjects?.map((subj: string) => {
                        const isMatch =
                          searchTerm &&
                          subj.toLowerCase().includes(searchTerm.toLowerCase().trim());
                        return (
                          <span
                            key={subj}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                              isMatch
                                ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 font-bold'
                                : 'bg-slate-900 border border-slate-700/60 text-slate-300'
                            }`}
                          >
                            {subj}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer with Rate & Select Button */}
                <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                      Session Rate
                    </span>
                    <div className="text-lg font-black text-white">
                      ${t.hourlyRateUsd}
                      <span className="text-xs font-normal text-slate-400"> / hour</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectTeacher(t)}
                    className="px-4 py-2.5 rounded-xl font-bold bg-[#00c5d4] hover:bg-[#00e1f2] text-slate-950 text-xs shadow-md shadow-cyan-500/25 transition-all flex items-center gap-1.5 group-hover:scale-105"
                  >
                    <span>Choose Teacher</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          LOGIN-FIRST AUTHENTICATION GATE MODAL
          ("and when they select they have to login first to start learning")
      ========================================================================= */}
      {authModalTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-md w-full glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setAuthModalTeacher(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lock / Security Icon */}
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Log In to Start Learning
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                You selected{' '}
                <strong className="text-cyan-300 font-bold">{authModalTeacher.name}</strong>. To begin
                your 1-on-1 learning session, access the live classroom, and schedule hours, please sign in
                first.
              </p>
            </div>

            {/* Selected Teacher Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 flex items-center gap-3">
              <img
                src={authModalTeacher.avatar}
                alt={authModalTeacher.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="text-left overflow-hidden">
                <div className="font-bold text-white text-sm truncate">{authModalTeacher.name}</div>
                <div className="text-[11px] text-cyan-300 truncate">
                  ${authModalTeacher.hourlyRateUsd} / hr • {authModalTeacher.teachingExperienceYears} yrs experience
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleProceedToLogin(authModalTeacher)}
                className="btn-primary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In to Start Learning</span>
              </button>

              <Link
                href={`/auth/register?redirect=${encodeURIComponent(
                  `/teachers/${authModalTeacher._id}`
                )}`}
                className="w-full py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 block text-center transition-colors"
              >
                New Student? Create Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StartLearningPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#061522] flex items-center justify-center text-slate-400 text-xs">
          Loading learning portal...
        </div>
      }
    >
      <StartLearningContent />
    </Suspense>
  );
}
