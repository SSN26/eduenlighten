'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Wrench,
  Users,
  LogIn,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

type PortalType = 'high_school' | 'vocational' | 'tutoring';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const typeParam = searchParams.get('type') as PortalType | null;

  const initialPortal: PortalType =
    typeParam === 'vocational' || typeParam === 'tutoring' ? typeParam : 'high_school';
  const [activePortal, setActivePortal] = useState<PortalType>(initialPortal);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync tab with URL query parameter
  useEffect(() => {
    if (typeParam === 'vocational') {
      setActivePortal('vocational');
    } else if (typeParam === 'tutoring') {
      setActivePortal('tutoring');
    } else if (typeParam === 'high_school') {
      setActivePortal('high_school');
    }
  }, [typeParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), username: email.trim(), password }),
    });

    if (res.success && res.user) {
      if (redirect) {
        window.location.href = redirect;
      } else if (res.user.role === 'super_admin' || res.user.role === 'academic_admin') {
        window.location.href = '/admin';
      } else if (res.user.role === 'teacher') {
        window.location.href = '/teacher';
      } else {
        window.location.href = '/student';
      }
    } else {
      setError(res.message || 'Invalid username or password');
      setLoading(false);
    }
  };

  const portalConfig = {
    high_school: {
      badge: 'High School Portal',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      title: 'High School Login',
      buttonText: 'Sign In to High School',
      subtitle: 'Cambridge (IGCSE & A Level) and ZIMSEC (O & A Level) digital classrooms & learning',
      notice: 'Sign in with your school credentials',
      emailPlaceholder: 'Enter your username',
      icon: GraduationCap,
      color: '#00c5d4',
    },
    vocational: {
      badge: 'Vocational Training & TVET',
      badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
      title: 'Vocational Training Login',
      buttonText: 'Sign In to Vocational Tutoring',
      subtitle: 'Polytechnics, Trade Apprentices, and Practical Skills Training',
      notice: 'Sign in to access vocational training',
      emailPlaceholder: 'Enter your username',
      icon: Wrench,
      color: '#14b8a6',
    },
    tutoring: {
      badge: 'Private Tutoring & 1-on-1',
      badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      title: 'Private Tutoring Login',
      buttonText: 'Sign In to Private Tutoring',
      subtitle: 'Connect 1-on-1 with vetted teachers, live sessions & personalized learning',
      notice: 'Sign in to learn and teach',
      emailPlaceholder: 'Enter your username',
      icon: Users,
      color: '#a855f7',
    },
  };

  const currentConfig = portalConfig[activePortal];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/10 via-teal-600/10 to-purple-600/10 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-xl w-full space-y-6 relative z-10">
        {/* Brand Emblem */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00b4d8] to-[#0077b6] flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold tracking-tight text-white block">
                Edu<span className="text-[#00c5d4]">Enlighten</span>
              </span>
            </div>
          </Link>
        </div>

        {/* 3-Tab Segmented Selector (High School, Vocational, Tutoring) */}
        <div className="bg-[#0b1f30] p-1.5 rounded-2xl border border-slate-700/60 shadow-xl grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setActivePortal('high_school')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              activePortal === 'high_school'
                ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span className="truncate">High School</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortal('vocational')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              activePortal === 'vocational'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span className="truncate">Vocational Training</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortal('tutoring')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              activePortal === 'tutoring'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">Private Tutoring</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-9 border border-cyan-500/25 shadow-2xl space-y-6">
          {/* Card Header */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md mb-1">
              <CurrentIcon className="w-3.5 h-3.5" />
              <span>{currentConfig.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentConfig.title}
            </h1>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              {currentConfig.subtitle}
            </p>
          </div>

          {/* Context Notice */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-300 text-[11px] flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{currentConfig.notice}</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Username</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentConfig.emailPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-200">Password</label>
                <Link href="/contact" className="text-cyan-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2 mt-2 shadow-lg shadow-cyan-500/20"
            >
              <span>{loading ? 'Authenticating...' : currentConfig.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 text-xs">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
