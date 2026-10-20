'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [curriculumPreference, setCurriculumPreference] = useState<'both' | 'cambridge' | 'zimsec' | 'digital_skills'>('both');
  const [currentLevel, setCurrentLevel] = useState('IGCSE / O-Level');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        curriculumPreference,
        currentLevel,
        phone,
      }),
    });

    if (res.success && res.user) {
      window.location.href = role === 'parent' ? '/parent' : '/student';
    } else {
      setError(res.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-7 glass-card rounded-3xl p-8 sm:p-10 border border-cyan-500/25">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Edu<span className="text-cyan-400">Enlighten</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-white">Create Learner Account</h2>
          <p className="text-xs text-slate-400">
            Join thousands of learners mastering Cambridge, ZIMSEC, and Tech skills.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tawanda Sibanda"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Account Type *</label>
              <select
                value={role}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'teacher') {
                    router.push('/teach/independent');
                  } else {
                    setRole(val as any);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="student">Student / Learner</option>
                <option value="parent">Parent / Guardian</option>
                <option value="teacher">Teacher / Tutor (Appear on Start Learning)</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-slate-300 flex items-center justify-between gap-2">
            <span>Are you an educator looking to teach?</span>
            <Link href="/teach/independent" className="text-cyan-400 font-semibold hover:underline inline-flex items-center gap-1">
              <span>Register as Teacher &rarr;</span>
            </Link>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Curriculum Focus *</label>
              <select
                value={curriculumPreference}
                onChange={(e) => setCurriculumPreference(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="both">Both High School & Tech Skills</option>
                <option value="cambridge">Cambridge International</option>
                <option value="zimsec">ZIMSEC National Curriculum</option>
                <option value="digital_skills">Digital Skills Academy</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Current Level</label>
              <input
                type="text"
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                placeholder="e.g. Form 4, Lower 6, Self-Learner"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password (min. 6 characters) *</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed pt-1">
            By signing up, you agree to EduEnlighten&apos;s{' '}
            <Link href="/terms" className="text-cyan-400 hover:underline">
              Terms
            </Link>
            ,{' '}
            <Link href="/privacy" className="text-cyan-400 hover:underline">
              Privacy Policy
            </Link>
            , and{' '}
            <Link href="/safeguarding" className="text-cyan-400 hover:underline">
              Child Safeguarding Code
            </Link>
            .
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/auth/login" className="text-cyan-400 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
