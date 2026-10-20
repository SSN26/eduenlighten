'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  BookOpen,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  Lock,
  Smartphone,
  Globe2,
  ChevronRight,
  Play,
  Award,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#061522] text-slate-100 font-sans selection:bg-[#00c5d4] selection:text-slate-950">
      {/* =========================================================================
          HERO SECTION (Matches Mockup)
      ========================================================================= */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-16 bg-gradient-to-b from-[#061522] via-[#081e30] to-[#0a263d]">
        {/* Subtle radial ambient background glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Hero Text & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge: DIGITAL SCHOOL & PROFESSIONAL ACADEMY */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d344d]/80 border border-cyan-500/30 text-[#00c5d4] text-[11px] font-bold tracking-wider uppercase shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-[#00c5d4]" />
                <span>Digital School &amp; Professional Academy</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.12] tracking-tight">
                Empowering Minds.<br />
                <span className="text-[#00c5d4]">Unlocking Potential.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                EduEnlighten makes structured high-school education and practical digital skills accessible to learners
                everywhere through expert educators, Cambridge &amp; ZIMSEC syllabi, and flexible online classrooms.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/start-learning"
                  className="px-6 py-3 rounded-full font-bold text-slate-950 bg-[#00c5d4] hover:bg-[#00e1f2] transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 text-sm group"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/teach"
                  className="px-6 py-3 rounded-full font-semibold text-slate-200 hover:text-white bg-[#0b263b] hover:bg-[#0f344f] border border-cyan-500/30 transition-all text-sm flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Teach with EduEnlighten</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Image (Original Girl with Headphones Writing & Laptop) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <img
                  src="/images/original_hero_student.png"
                  alt="EduEnlighten High School Student learning online with headphones and laptop"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* 4-Item Bar under Hero (Exact requested edits) */}
          <div className="mt-12 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1. Cambridge */}
            <Link
              href="/high-school/cambridge"
              className="p-3.5 sm:p-4 rounded-2xl bg-[#092236]/90 border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-[#00c5d4] shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm sm:text-base leading-snug">Cambridge</div>
                <div className="text-[11px] text-slate-400">IGCSE &amp; A Level</div>
              </div>
            </Link>

            {/* 2. ZIMSEC (Per instruction: "on ZIMSEC, write as O & A level.") */}
            <Link
              href="/high-school/zimsec"
              className="p-3.5 sm:p-4 rounded-2xl bg-[#092236]/90 border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-[#00c5d4] shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm sm:text-base leading-snug">ZIMSEC</div>
                <div className="text-[11px] text-slate-400">O &amp; A Level</div>
              </div>
            </Link>

            {/* 3. Vocational Training (Per instructions: "edit Tech skills to Vocational Training", "edit Full stack & PM to practical skills") */}
            <Link
              href="/for-vocational"
              className="p-3.5 sm:p-4 rounded-2xl bg-[#092236]/90 border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-[#00c5d4] shrink-0 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm sm:text-base leading-snug">Vocational Training</div>
                <div className="text-[11px] text-slate-400 lowercase">practical skills</div>
              </div>
            </Link>

            {/* 4. Safe Learning */}
            <Link
              href="/safeguarding"
              className="p-3.5 sm:p-4 rounded-2xl bg-[#092236]/90 border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-[#00c5d4] shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm sm:text-base leading-snug">Safe Learning</div>
                <div className="text-[11px] text-slate-400">Vetted Educators</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "YOUR LEARNING PATHWAY" -> "Learn Your Way"
          (Clean white/light gray background matching the screenshot)
      ========================================================================= */}
      <section className="py-20 bg-[#f8fafc] text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-600 mb-1">
                Your Learning Pathway
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Learn Your Way
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Whether you&apos;re in high school, learning a trade, or looking for a tutor, EduEnlighten has a pathway for you.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/register-institution"
                className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 3 Pathway Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: High School Education */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden relative group">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">High School Education</h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  Cambridge &amp; ZIMSEC curricula<br />
                  <span className="text-slate-500">(Form 1 – 6, Lower 6 &amp; Upper 6)</span>
                </p>
              </div>

              <div className="flex items-end justify-between mt-4">
                <Link
                  href="/register-institution?type=high_school"
                  className="px-5 py-2.5 rounded-full font-bold text-xs bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* Original student photo */}
                <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden shadow-inner border border-slate-100 ml-2">
                  <img
                    src="/images/original_highschool_student.png"
                    alt="High School Student"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Vocational Training */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden relative group">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <Wrench className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">Vocational Training</h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  Practical skills for real jobs<br />
                  <span className="text-slate-500">(Trades, Technical &amp; IT)</span>
                </p>
              </div>

              <div className="flex items-end justify-between mt-4">
                <Link
                  href="/register-institution?type=vocational_institution"
                  className="px-5 py-2.5 rounded-full font-bold text-xs bg-[#0d9488] hover:bg-[#0f766e] text-white flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/20"
                >
                  <span>Register TVET</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* Original vocational trainee photo */}
                <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden shadow-inner border border-slate-100 ml-2">
                  <img
                    src="/images/original_vocational_trainee.png"
                    alt="Vocational Trainee"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Find Teacher */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden relative group">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">Find Teacher</h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  Search subjects and choose verified teachers who teach them for 1-on-1 learning
                </p>
              </div>

              <div className="flex items-end justify-between mt-4">
                <Link
                  href="/start-learning"
                  className="px-5 py-2.5 rounded-full font-bold text-xs bg-[#7c3aed] hover:bg-[#6d28d9] text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/20"
                >
                  <span>Find Teacher</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* Original female educator photo */}
                <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden shadow-inner border border-slate-100 ml-2">
                  <img
                    src="/images/original_female_teacher.png"
                    alt="Independent Teacher"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ORIGINAL DEVICES MOCKUP (Laptop + Mobile Phone Showcase)
      ========================================================================= */}
      <section className="py-16 bg-white text-slate-900 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="relative max-w-2xl w-full">
              <img
                src="/images/original_devices_mockup.png"
                alt="EduEnlighten Digital Platform Dashboard on Laptop and Mobile"
                className="w-full h-auto object-contain rounded-2xl drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: "WHY CHOOSE EDUENLIGHTEN" -> "A Safer, Smarter, More Inclusive Learning Experience"
      ========================================================================= */}
      <section className="relative overflow-hidden py-16 bg-[#061d2d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading & 4 Pillars */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
                  Why Choose EduEnlighten
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-xl">
                  A Safer, Smarter, More Inclusive Learning Experience
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* 1. Verified Educators */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-[#00c5d4]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">Verified Educators</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All teachers are vetted and background-checked.
                  </p>
                </div>

                {/* 2. Data Privacy */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-[#00c5d4]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">Data Privacy</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Each school&apos;s data is securely isolated and protected.
                  </p>
                </div>

                {/* 3. Accessible for All */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-[#00c5d4]">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">Accessible for All</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mobile-friendly and designed for learners with diverse needs.
                  </p>
                </div>

                {/* 4. Flexible Access */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-[#00c5d4]">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">Flexible Access</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Learn anytime, anywhere
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Original Learner with Headphones & "Different backgrounds. Same opportunity." */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/images/original_why_choose_learner.png"
                  alt="Different backgrounds. Same opportunity."
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notice: "What Our Users Say" section was intentionally removed per user request: "remove what our users say" */}
    </div>
  );
}
