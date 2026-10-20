'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Calendar,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Lock,
  Search,
  LogIn,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const QUICK_SUBJECT_SUGGESTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Accounting',
  'Business Studies',
  'Solar PV & Electrical',
  'Welding & Metal Fabrication',
  'Automotive Mechanics',
  'Computer Science & Python',
  'English Language & Literature',
  'Shona Language',
];

const AVATAR_OPTIONS = [
  {
    id: 'avatar-1',
    label: 'Professional 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-2',
    label: 'Professional 2',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3',
    label: 'Professional 3',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-4',
    label: 'Professional 4',
    url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&auto=format&fit=crop&q=80',
  },
];

export default function TeachIndependentlyPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].url);
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [yearCompleted, setYearCompleted] = useState('2018');
  const [experienceYears, setExperienceYears] = useState('5');
  const [hourlyRate, setHourlyRate] = useState('25');
  const [curriculumSpecialties, setCurriculumSpecialties] = useState<string[]>(['Cambridge International']);
  const [subjects, setSubjects] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredTeacher, setRegisteredTeacher] = useState<any>(null);

  const curriculaList = [
    'Cambridge International',
    'ZIMSEC Curriculum',
    'Vocational Trades',
    'Professional Digital Skills',
  ];

  const handleCurriculumToggle = (curr: string) => {
    if (curriculumSpecialties.includes(curr)) {
      setCurriculumSpecialties(curriculumSpecialties.filter((c) => c !== curr));
    } else {
      setCurriculumSpecialties([...curriculumSpecialties, curr]);
    }
  };

  const handleAddQuickSubject = (subjectName: string) => {
    const existing = subjects
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!existing.includes(subjectName)) {
      existing.push(subjectName);
      setSubjects(existing.join(', '));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const subjectsArray = subjects
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (subjectsArray.length === 0) {
      setError('Please provide at least one subject you can teach.');
      setLoading(false);
      return;
    }

    const res = await apiFetch('/api/teachers/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password: password || 'TeacherPass123!',
        avatar: selectedAvatar,
        headline,
        bio,
        qualifications: [
          {
            degree: degree || 'Bachelor of Education / Science',
            institution: institution || 'Accredited University',
            yearCompleted: Number(yearCompleted) || 2018,
          },
        ],
        teachingExperienceYears: Number(experienceYears) || 3,
        curriculumSpecialties,
        authorizedSubjects: subjectsArray,
        hourlyRateUsd: Number(hourlyRate) || 25,
        sessionBookingPriceUsd: Number(hourlyRate) || 25,
        languages: ['English'],
      }),
    });

    setLoading(false);

    if (res.success && res.data) {
      setRegisteredTeacher(res.data);
    } else {
      setError(res.message || 'Failed to create teacher profile.');
    }
  };

  if (registeredTeacher) {
    const firstSubj = registeredTeacher.authorizedSubjects?.[0] || '';

    return (
      <div className="min-h-screen bg-[#061522] text-slate-100 py-16 px-4">
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-8 sm:p-10 border border-cyan-500/30 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Registration Complete &bull; Profile Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome to the Faculty, {registeredTeacher.name}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Your teacher profile is now active and published. When students click{' '}
              <strong className="text-cyan-300 font-bold">Start Learning</strong> and search for{' '}
              <span className="text-white font-semibold">
                {registeredTeacher.authorizedSubjects?.slice(0, 3).join(', ')}
              </span>
              , they will find your profile and can choose to learn with you!
            </p>
          </div>

          {/* Teacher Profile Card Preview */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-left text-xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={registeredTeacher.avatar}
                alt={registeredTeacher.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/30 shrink-0"
              />
              <div className="overflow-hidden">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span>{registeredTeacher.name}</span>
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-slate-400 truncate text-[11px]">{registeredTeacher.headline}</div>
                <div className="text-cyan-300 font-bold mt-0.5">
                  ${registeredTeacher.hourlyRateUsd} / hr &bull; {registeredTeacher.teachingExperienceYears} yrs experience
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold self-center mr-1">Subjects:</span>
              {registeredTeacher.authorizedSubjects?.map((s: string) => (
                <span key={s} className="px-2.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-[11px] font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href={`/start-learning?subject=${encodeURIComponent(firstSubj)}`}
              className="btn-primary px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <Search className="w-4 h-4" />
              <span>View Yourself on Start Learning</span>
            </Link>

            <Link
              href="/auth/login?type=tutoring"
              className="px-6 py-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Teacher Portal</span>
            </Link>

            <Link
              href={`/teachers/${registeredTeacher._id}`}
              className="px-6 py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061522] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Educator &amp; Tutor Registration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Register to Teach &amp; Appear on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c5d4] to-teal-400">
              Start Learning
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Create your teacher profile, choose Cambridge, ZIMSEC, or vocational disciplines, set your hourly rate,
            and appear directly when students search for subjects to learn.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-9 border border-cyan-500/20 shadow-2xl space-y-6 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Section 1: Personal & Account Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
              1. Personal &amp; Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Tendai Chiware"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email / Username *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@eduenlighten.ac"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Account Password * (used to sign in to your teacher portal)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password (min. 6 characters)"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            {/* Profile Avatar Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Choose Profile Picture *</label>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.url)}
                    className={`relative rounded-2xl overflow-hidden p-1 border transition-all ${
                      selectedAvatar === av.url
                        ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={av.url} alt={av.label} className="w-full h-16 sm:h-20 object-cover rounded-xl" />
                    {selectedAvatar === av.url && (
                      <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Teaching Headline & Bio */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
              2. Specialty &amp; Teaching Bio
            </h3>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Professional Headline *
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Cambridge IGCSE &amp; A-Level Pure Mathematics &amp; Physics Specialist"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Professional Bio &amp; Teaching Philosophy *
              </label>
              <textarea
                required
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your teaching approach, past student exam achievements, and how you help learners overcome difficult concepts..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          {/* Section 3: Qualifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
              3. Academic Qualifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Highest Degree / Diploma *</label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. BSc Mathematics (Hons)"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">University / Polytechnic *</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. University of Zimbabwe"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Years of Experience *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Curricula & Subjects */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
              4. Curricula &amp; Subjects to Teach
            </h3>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">Curriculum Specialties *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {curriculaList.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCurriculumToggle(c)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      curriculumSpecialties.includes(c)
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">
                Authorized Subjects (comma-separated) *
              </label>
              <input
                type="text"
                required
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="e.g. Mathematics, Physics, Chemistry, Solar PV, Accounting"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
              />

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-slate-400">Quick-add popular subjects:</span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUBJECT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddQuickSubject(s)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-200 text-[11px] transition-all"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Hourly Rate */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
              5. 1-on-1 Lesson Rate
            </h3>

            <div className="relative max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
              <input
                type="number"
                required
                min="5"
                max="100"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">/ hour</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Learners pay this rate per private session. You receive earnings after lessons are delivered.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Includes verified background check badge and direct Start Learning placement.</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full sm:w-auto px-8 py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
            >
              {loading ? (
                <span>Registering &amp; Publishing...</span>
              ) : (
                <>
                  <span>Register &amp; Appear on Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
