'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, CheckCircle2, ArrowRight, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

export default function ZimsecPathwayPage() {
  const subjects = [
    { name: 'Mathematics', code: '4004', level: 'Ordinary Level', desc: 'Paper 1 non-calculator skills and Paper 2 transformation geometry, vectors, matrices, and algebra.' },
    { name: 'Combined Science', code: '4003', level: 'Ordinary Level', desc: 'Comprehensive Biology, Chemistry, and Physics modules tailored to the revised ZIMSEC curriculum.' },
    { name: 'Commerce', code: '4049', level: 'Ordinary Level', desc: 'Trade, banking, insurance, transportation, consumer protection, and business communication.' },
    { name: 'Accounting', code: '4045', level: 'Ordinary & A Level', desc: 'Bookkeeping, trial balance, ledgers, partnership accounts, and financial statement adjustments.' },
    { name: 'Geography', code: '4022', level: 'Ordinary & A Level', desc: 'Physical geography, weather, climatology, settlement, agriculture, and map work.' },
    { name: 'Agriculture', code: '5036', level: 'Ordinary Level', desc: 'Soil science, crop production, animal husbandry, agricultural economics, and farm machinery.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase">
          <Compass className="w-3.5 h-3.5" />
          <span>ZIMSEC National Curriculum Pathway</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          ZIMSEC Ordinary & Advanced Level Revision
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Structured, affordable, topic-by-topic online instruction for Zimbabwean students preparing for June and
          November national examinations.
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-5 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <p className="font-semibold text-white">Important Examination Notice</p>
          <p className="text-slate-400">
            EduEnlighten is an independent learning platform providing curriculum-aligned revision and exam techniques.
            We are not an official ZIMSEC examination centre. Students sit their final national examinations at their
            registered school or approved district examination centre.
          </p>
        </div>
      </div>

      {/* Subject Catalogue */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">ZIMSEC Subjects Offered</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Syllabus: {sub.code}
                  </span>
                  <span className="text-xs text-slate-400">{sub.level}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{sub.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{sub.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Link
                  href={`/courses?curriculum=zimsec&search=${encodeURIComponent(sub.name)}`}
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                >
                  <span>View Courses for {sub.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Localized Affordability */}
      <div className="rounded-3xl glass-card p-8 sm:p-12 space-y-6 border border-teal-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Affordable Local Pricing in USD and ZWL</h3>
            <p className="text-xs text-slate-400">Pay easily using EcoCash, mobile money, or debit cards.</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          We understand the financial realities facing Zimbabwean families. EduEnlighten courses are priced to ensure
          every candidate can access high-quality teaching from top Zimbabwean teachers without excessive tuition costs.
        </p>

        <div className="pt-4 flex items-center gap-4 flex-wrap">
          <Link href="/courses?curriculum=zimsec" className="btn-primary px-6 py-2.5 text-sm font-semibold">
            Browse ZIMSEC Courses
          </Link>
          <Link href="/scholarships" className="btn-secondary px-6 py-2.5 text-sm font-semibold">
            Request Financial Aid
          </Link>
        </div>
      </div>
    </div>
  );
}
