'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Award,
  Video,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  FileCheck,
} from 'lucide-react';

export default function TeachPortalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase">
          <Users className="w-3.5 h-3.5" />
          <span>Educator Recruitment Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Teach with EduEnlighten
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Join our growing faculty of qualified educators, Cambridge subject specialists, ZIMSEC teachers, and senior
          industry technologists. Inspire students globally while teaching on your own schedule.
        </p>

        <div className="pt-2">
          <Link href="/teach/apply" className="btn-primary px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2">
            <span>Start Teacher Application</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Why Teach With Us */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Flexible Scheduling</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Deliver scheduled live classes, record on-demand module courses, or mentor project capstones on your terms.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Dedicated Digital Classrooms</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Integrated video conferencing, lesson recording, interactive quizzes, student progress analytics, and grading tools.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Transparent Compensation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Competitive per-session live class rates and attractive course revenue sharing with prompt, transparent payouts.
          </p>
        </div>
      </div>

      {/* Application Workflow */}
      <div className="rounded-3xl glass-card p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Application Process</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">How to Become an EduEnlighten Instructor</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="font-bold text-white text-sm">Submit Application</h4>
            <p className="text-xs text-slate-400">
              Provide your qualifications, curriculum expertise, teaching history, and preferred formats.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="font-bold text-white text-sm">Academic Review</h4>
            <p className="text-xs text-slate-400">
              Our academic administration reviews your academic credentials and verified subject experience.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="font-bold text-white text-sm">Demo Lesson / Interview</h4>
            <p className="text-xs text-slate-400">
              Deliver a short 15-minute demonstration lesson showing your teaching style and student engagement.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h4 className="font-bold text-white text-sm">Review & Onboarding</h4>
            <p className="text-xs text-slate-400">
              Complete academic review and access your Instructor Dashboard to publish courses and teach.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/teach/apply" className="btn-primary px-8 py-3 text-sm font-semibold">
            Apply Now to Join Edu Enlighten Academy
          </Link>
        </div>
      </div>
    </div>
  );
}
