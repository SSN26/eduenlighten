'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'academic' | 'technical' | 'billing' | 'teacher_application' | 'safeguarding' | 'general'>('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketNum, setTicketNum] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiFetch('/api/support/tickets', {
      method: 'POST',
      body: JSON.stringify({ name, email, subject, category, message }),
    });

    if (res.success) {
      setSubmitted(true);
      setTicketNum(res.ticketNumber || 'TKT-1001');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact & Academic Support
        </h1>
        <p className="text-sm text-slate-300">
          Have questions about our Cambridge or ZIMSEC curricula, enrolment, payments, or teacher applications? Our
          support team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Contact Info Card */}
        <div className="glass-card rounded-2xl p-7 space-y-6">
          <h3 className="text-lg font-bold text-white">Get in Touch</h3>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Email Support:</strong>
                <span>support@eduenlighten.ac</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Phone / WhatsApp:</strong>
                <span>+263 (0) 77 123 4567</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Regional Operations:</strong>
                <span>Harare & Bulawayo, Zimbabwe</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
            <strong className="text-cyan-300 block">Safeguarding Urgent Contact</strong>
            <p className="text-slate-400 leading-relaxed">
              For child protection or safeguarding concerns, select the Safeguarding category or email our designated
              officer at <span className="text-white font-mono">safeguarding@eduenlighten.ac</span>.
            </p>
          </div>
        </div>

        {/* Support Ticket Submission Form */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-7 sm:p-9 border border-cyan-500/25">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Ticket Submitted Successfully</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your support ticket has been registered under ticket identifier{' '}
                <strong className="text-cyan-300 font-mono">{ticketNum}</strong>. A copy has been dispatched to{' '}
                <strong className="text-white">{email}</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary px-5 py-2 text-xs font-semibold"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-white">Submit a Support Ticket</h3>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="academic">Academic & Curriculum Inquiry</option>
                    <option value="billing">Payments & Billing</option>
                    <option value="teacher_application">Teacher Recruitment</option>
                    <option value="technical">Technical / Classroom Access</option>
                    <option value="safeguarding">Child Safeguarding Concern</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your question"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Message Details *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide as much detail as possible to help our team resolve your request..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Submitting Ticket...' : 'Send Message / Open Ticket'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
