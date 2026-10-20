'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is EduEnlighten an official Cambridge or ZIMSEC examination centre?',
      a: 'No. EduEnlighten is an independent digital school offering structured syllabus-aligned instruction, mock examinations, and past-paper revision. We do not register students directly for official exam board papers; students sit their formal Cambridge or ZIMSEC exams at accredited regional exam centres or registered schools in their area.',
    },
    {
      q: 'How do live online classes work?',
      a: 'Live classes are conducted via our integrated video classroom player (powered by Jitsi/custom video). Students view the upcoming schedule on their Student Portal, join with a single click, ask questions directly, and access recorded replays afterward for revision.',
    },
    {
      q: 'Can parents monitor their child’s progress?',
      a: 'Yes. EduEnlighten provides linked Guardian Accounts where parents can monitor assignment submissions, grade results, attendance in live sessions, and course completion percentages without accessing private student chat.',
    },
    {
      q: 'What payment methods are supported for Zimbabwean and international learners?',
      a: 'We support EcoCash, OneMoney, local Zimbabwean mobile money channels, and international credit/debit cards (Visa/Mastercard). Courses can be paid in USD or equivalent local ZWL pricing.',
    },
    {
      q: 'How do I apply to teach with EduEnlighten?',
      a: 'Qualified secondary teachers and experienced industry technologists can apply via our "Teach with Us" portal. You will submit your academic credentials, teaching experience, and preferred subjects. Successful applicants undergo identity verification and child safeguarding checks before teaching.',
    },
    {
      q: 'Are platform certificates accredited by universities?',
      a: 'EduEnlighten certificates verify that you have successfully completed our comprehensive curriculum modules, continuous quizzes, and practical capstone projects. They demonstrate mastery and employability for employers, but are not formal accredited university degrees.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Answers to Common Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Learn how online learning, Cambridge & ZIMSEC revision, payments, and certificates work at EduEnlighten.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between text-white font-semibold text-sm hover:text-cyan-400 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-cyan-400 transition-transform ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openIndex === idx && (
              <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6 text-center space-y-3 border border-cyan-500/20 max-w-xl mx-auto">
        <h3 className="text-base font-bold text-white">Have a question not listed here?</h3>
        <p className="text-xs text-slate-400">Our academic support team is ready to answer your specific inquiries.</p>
        <Link href="/contact" className="btn-primary inline-flex px-6 py-2.5 text-xs font-semibold">
          Contact Academic Support
        </Link>
      </div>
    </div>
  );
}
