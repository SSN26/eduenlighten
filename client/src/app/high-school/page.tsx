import React from 'react';
import Link from 'next/link';
import { BookOpen, Compass, CheckCircle2, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export default function HighSchoolAcademyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Secondary Education</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          High School Academy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          EduEnlighten offers two distinct secondary curriculum pathways: internationally recognized Cambridge qualifications
          and Zimbabwe&apos;s national ZIMSEC curriculum.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cambridge */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-sky-500/30 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-sky-400">Global Recognition</span>
              <h2 className="text-2xl font-bold text-white mt-1">Cambridge International</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              IGCSE, AS Level, and A Level syllabus mastery for university entry locally and worldwide. Includes worked
              past papers, mark schemes, and diagnostic testing.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Cambridge Mathematics (0580 / 9709)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Physics, Chemistry, Biology & Computer Science</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Economics, Business Studies & Accounting</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link href="/high-school/cambridge" className="btn-primary w-full py-3 text-xs text-center block font-semibold">
              Explore Cambridge Pathway
            </Link>
          </div>
        </div>

        {/* ZIMSEC */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-teal-500/30 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-teal-400">National Excellence</span>
              <h2 className="text-2xl font-bold text-white mt-1">ZIMSEC Academy</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tailored specifically to Zimbabwean Ordinary Level and Advanced Level syllabi. Master Section B questions,
              worked exam solutions, and local subject contexts.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Mathematics (4004) Paper 1 & 2 Technique</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Combined Science (4003) & Agriculture</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Commerce, Accounting, Geography & History</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link href="/high-school/zimsec" className="btn-primary w-full py-3 text-xs text-center block font-semibold">
              Explore ZIMSEC Pathway
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
