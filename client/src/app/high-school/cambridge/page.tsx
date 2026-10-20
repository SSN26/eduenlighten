'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, ArrowRight, AlertTriangle, ShieldCheck, Star } from 'lucide-react';

export default function CambridgePathwayPage() {
  const subjects = [
    { name: 'Mathematics', code: '0580 / 9709', level: 'IGCSE & A Level', desc: 'Core and Extended syllabus covering Number, Algebra, Geometry, Trigonometry, and Calculus.' },
    { name: 'Physics', code: '0625 / 9702', level: 'IGCSE & AS/A Level', desc: 'Mechanics, Thermal Physics, Optics, Electricity, Magnetism, and Nuclear Physics.' },
    { name: 'Computer Science', code: '0478 / 9618', level: 'IGCSE & A Level', desc: 'Theory of computation, algorithmic problem solving, Python programming, and databases.' },
    { name: 'Chemistry', code: '0620 / 9701', level: 'IGCSE & A Level', desc: 'Physical, Inorganic, and Organic Chemistry with practical paper preparation.' },
    { name: 'Biology', code: '0610 / 9700', level: 'IGCSE & A Level', desc: 'Cell biology, human physiology, genetics, biotechnology, and ecology.' },
    { name: 'Economics', code: '0455 / 9708', level: 'IGCSE & A Level', desc: 'Microeconomics, Macroeconomics, International Trade, and Development Economics.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-300 text-xs font-semibold uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Cambridge International Pathway</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Cambridge IGCSE, AS & A Level Excellence
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Rigorous, syllabus-aligned instruction prepared by certified subject specialists. Master past papers,
          deepen conceptual understanding, and achieve the top grades needed for global universities.
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-5 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <p className="font-semibold text-white">Important Examination Notice</p>
          <p className="text-slate-400">
            EduEnlighten is an independent digital school offering structured syllabus-aligned instruction and exam
            preparation. We are not an official Cambridge International examination centre. Candidates register for formal
            examinations at accredited British Council centres or independent Cambridge exam centres in their region.
          </p>
        </div>
      </div>

      {/* Subject Catalogue */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Cambridge Subjects Offered</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    Syllabus: {sub.code}
                  </span>
                  <span className="text-xs text-slate-400">{sub.level}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{sub.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{sub.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Link
                  href={`/courses?curriculum=cambridge&search=${encodeURIComponent(sub.name)}`}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <span>View Courses for {sub.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Section */}
      <div className="rounded-3xl glass-card p-8 sm:p-12 space-y-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">Our Cambridge Teaching Methodology</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base">1. Syllabus Objectives Breakdown</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every topic directly maps to the Cambridge Assessment International Education (CAIE) syllabus learning outcomes.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base">2. Past-Paper Technique</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Worked solution drills for Paper 1, Paper 2, and Extended Paper 4 with examiner report insights.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base">3. Live Revision Clinics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Weekly interactive scheduled live sessions for challenging problem solving and Q&A with master educators.
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/10 flex-wrap gap-4">
          <div className="text-sm text-slate-300">
            Ready to excel in your Cambridge examinations?
          </div>
          <Link href="/courses?curriculum=cambridge" className="btn-primary px-6 py-2.5 text-sm font-semibold">
            Browse Cambridge Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
