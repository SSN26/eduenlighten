'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeartHandshake, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function ScholarshipsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Cambridge Mathematics / Tech Skills Financial Aid');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketNum, setTicketNum] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await apiFetch('/api/support/tickets', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        subject: `[Scholarship Request] ${subject}`,
        category: 'billing',
        message: `Applicant requested sponsored course access. Details: ${message}`,
      }),
    });

    if (res.success) {
      setSubmitted(true);
      setTicketNum(res.ticketNumber || 'TKT-PENDING');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Affordability & Inclusion</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Scholarships & Sponsored Learning
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          At EduEnlighten, our founding mission is to ensure that quality education and practical digital skills remain
          accessible to students regardless of their geographical location or financial circumstances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-white">Academic Merit Aid</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Full and partial tuition coverage for high-achieving high-school candidates preparing for critical Cambridge
            or ZIMSEC exam sessions.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-white">Community Hardship Relief</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Sponsored learning opportunities for students facing family economic hardship or lack of local formal schooling.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-white">Tech Workforce Diversity</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Targeted sponsorships for female software engineers and rural youth joining our Professional Digital Skills
            bootcamps.
          </p>
        </div>
      </div>

      {/* Application Form */}
      <div className="max-w-2xl mx-auto glass-card rounded-3xl p-8 sm:p-10 border border-teal-500/30 space-y-6">
        {submitted ? (
          <div className="text-center space-y-4 py-6">
            <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Scholarship Request Submitted</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Your application has been received under ticket number{' '}
              <strong className="text-cyan-300 font-mono">{ticketNum}</strong>. Our academic scholarship board will review
              your statement and contact you via email within 3 business days.
            </p>
            <Link href="/" className="btn-secondary inline-block px-6 py-2.5 text-xs font-semibold">
              Return to Homepage
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Apply for Financial Aid</h3>
              <p className="text-xs text-slate-400">
                Please describe your educational goals and current circumstances.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Subject / Course of Interest *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Statement of Need & Learning Goals *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain why you are seeking sponsored access and how this course will help you achieve your educational or career objectives..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Submitting Application...' : 'Submit Scholarship Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
