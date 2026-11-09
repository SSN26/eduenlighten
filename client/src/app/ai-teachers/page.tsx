'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Star,
  CheckCircle2,
  Clock,
  Zap,
  Volume2,
  Search,
  Filter,
  ShieldCheck,
  ChevronRight,
  Code2,
  Cpu,
  Atom,
  Flame,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function AITeachersDirectoryPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [curriculumFilter, setCurriculumFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, [curriculumFilter]);

  const fetchTeachers = async () => {
    setLoading(true);
    let url = `/api/ai-teachers?curriculum=${curriculumFilter}`;
    const res = await apiFetch(url);
    if (res.success && res.data) {
      setTeachers(res.data);
    }
    setLoading(false);
  };

  const filteredTeachers = teachers.filter((t) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(term) ||
      t.title.toLowerCase().includes(term) ||
      t.subjects.some((s: string) => s.toLowerCase().includes(term)) ||
      t.headline.toLowerCase().includes(term)
    );
  });

  const curricula = [
    { label: 'All Curricula & Disciplines', value: 'all' },
    { label: 'Cambridge International', value: 'cambridge' },
    { label: 'ZIMSEC Pathway', value: 'zimsec' },
    { label: 'Vocational Trades & Solar', value: 'vocational' },
    { label: 'Digital Skills & Software', value: 'digital' },
    { label: 'Humanities & Logic', value: 'humanities' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060d17] via-[#0b192c] to-[#060d17] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide shadow-lg shadow-cyan-500/5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="uppercase tracking-wider">Next-Generation 24/7 AI Faculty</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 text-[10px] font-extrabold">Instant Access</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Learn with Dedicated <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">
              AI Teacher Agents
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Experience zero-wait, personalized 1-on-1 tutoring. Master Cambridge, ZIMSEC, Vocational Trades, and Full-Stack Code with specialized AI Educators equipped with official marking schemes, Socratic dialogue, and interactive practice.
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md">
              <div className="text-2xl font-black text-cyan-300">24/7/365</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Always Online</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md">
              <div className="text-2xl font-black text-teal-300">0s Latency</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Instant Responses</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md">
              <div className="text-2xl font-black text-amber-300">5 Modes</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Socratic to Exam Rigor</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md">
              <div className="text-2xl font-black text-emerald-300">Voice-Ready</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Listen &amp; Speak</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, subject, or AI Teacher (e.g. Calculus, Solar PV, Chemistry, Next.js)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Curriculum Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {curricula.map((c) => (
              <button
                key={c.value}
                onClick={() => setCurriculumFilter(c.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  curriculumFilter === c.value
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Teacher Agents Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
            <p className="text-slate-400 text-sm">Connecting to EduEnlighten AI Teacher Agents...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
            <BrainCircuit className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">No AI Teachers Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              No AI teacher agents matched your search query. Try clearing your search term or switching curriculum categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCurriculumFilter('all');
              }}
              className="px-5 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/30 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((agent) => (
              <div
                key={agent.id}
                className="group relative rounded-3xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between overflow-hidden backdrop-blur-xl"
              >
                {/* Neon Glow on Hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

                <div className="p-6 space-y-5">
                  {/* Top Bar: Live Status & Avatar */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="relative">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-lg group-hover:scale-105 transition-transform"
                      />
                      {/* Active Online Indicator */}
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-extrabold tracking-wide uppercase">
                        <Bot className="w-3 h-3 text-cyan-400" />
                        <span>AI Master Agent</span>
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>4.99</span>
                        <span className="text-slate-500">· 24/7 Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-xs font-semibold text-cyan-400/90 mt-0.5 line-clamp-1">
                      {agent.title}
                    </p>
                    <p className="text-xs text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                      {agent.bio}
                    </p>
                  </div>

                  {/* Curricula & Subject Tags */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex flex-wrap gap-1.5">
                      {agent.curricula.map((c: string) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {agent.subjects.slice(0, 3).map((s: string) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-teal-950/60 text-teal-300 text-[10px] border border-teal-500/20"
                        >
                          {s}
                        </span>
                      ))}
                      {agent.subjects.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                          +{agent.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Teaching Styles Badges */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Modes:</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 text-[10px] font-mono">Academic</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-amber-300 text-[10px] font-mono">Socratic</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-emerald-300 text-[10px] font-mono">Exam Rigor</span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tuition Fee</div>
                    <div className="text-emerald-400 font-extrabold flex items-center gap-1">
                      <span>$0 / Free</span>
                      <span className="text-[10px] text-slate-400 font-normal">(Included)</span>
                    </div>
                  </div>

                  <Link
                    href={`/ai-teachers/${agent.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                  >
                    <span>Start 1-on-1 Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feature Comparison / Pedagogical Assurance */}
        <div className="p-8 rounded-3xl bg-slate-900/70 border border-cyan-500/20 backdrop-blur-xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Curriculum Rigor</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every AI Teacher Agent is specifically tuned to Cambridge Assessment International Education and ZIMSEC official syllabus guidelines, marking guides, and past examination papers.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Socratic Dialogue</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose the Socratic mode to be guided toward the answer through analytical questioning rather than mere spoon-feeding, building deep understanding and exam retention.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Interactive Audio &amp; Voice</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrated with Web Speech synthesis so auditory learners can listen to step-by-step explanations read aloud with natural pitch and pacing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
