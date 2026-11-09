'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Star,
  ShieldCheck,
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Sparkles,
  Bot,
  Zap,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function IndependentTeachersDirectoryPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [curriculumFilter, setCurriculumFilter] = useState('all');
  const [teacherType, setTeacherType] = useState<'all' | 'ai' | 'human'>('all');
  const [maxRate, setMaxRate] = useState<number>(50);

  useEffect(() => {
    fetchTeachers();
  }, [curriculumFilter, maxRate, teacherType]);

  const fetchTeachers = async () => {
    setLoading(true);
    let url = `/api/teachers?curriculum=${curriculumFilter}&maxRate=${maxRate}&type=${teacherType}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    const res = await apiFetch(url);
    if (res.success && res.data) {
      setTeachers(res.data);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeachers();
  };

  const curriculumOptions = [
    { label: 'All Curricula', value: 'all' },
    { label: 'Cambridge International', value: 'cambridge' },
    { label: 'ZIMSEC Curriculum', value: 'zimsec' },
    { label: 'Vocational Trades', value: 'vocational' },
    { label: 'Digital Skills & Coding', value: 'digital' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
            <Users className="w-4 h-4" />
            <span>Independent Educators &amp; AI Tutors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Connect Directly with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Independent Teachers &amp; AI Agents</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Browse verified, safeguarding-vetted human educators alongside 24/7 intelligent AI Teacher Agents across Cambridge, ZIMSEC, vocational trades, and software engineering.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/ai-teachers"
              className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>Explore 24/7 AI Faculty Studio</span>
            </Link>
            <Link
              href="/teach/independent"
              className="px-6 py-2.5 rounded-xl font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs flex items-center gap-2 transition-all"
            >
              <span>Teach Independently (Apply)</span>
            </Link>
          </div>
        </div>

        {/* 24/7 AI Teacher Agents Highlight Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-teal-950/60 border border-cyan-500/30 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Need Instant Help Right Now?</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold uppercase">
                  Zero Wait Time
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Our AI Teacher Agents are online 24/7 with interactive Socratic dialogue, Cambridge &amp; ZIMSEC marking schemes, and dynamic practice exams.
              </p>
            </div>
          </div>
          <Link
            href="/ai-teachers"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-2 transition-all"
          >
            <span>Launch AI Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Search, Faculty Type, and Filter Controls */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
          {/* Top Row: Search & Faculty Type Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1 w-full relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search teachers by name, subject (e.g. Mathematics, Solar, Chemistry, React)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </form>

            {/* AI vs Human Toggle Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setTeacherType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  teacherType === 'all' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Educators
              </button>
              <button
                type="button"
                onClick={() => setTeacherType('ai')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  teacherType === 'ai' ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-sm' : 'text-cyan-400 hover:text-cyan-300'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>🤖 AI Teacher Agents</span>
              </button>
              <button
                type="button"
                onClick={() => setTeacherType('human')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  teacherType === 'human' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Human Tutors
              </button>
            </div>
          </div>

          {/* Curriculum Pills & Price Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                Curriculum:
              </span>
              {curriculumOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCurriculumFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    curriculumFilter === opt.value
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">Max Rate:</span>
              <span className="text-cyan-400 font-bold text-xs">${maxRate}/hr</span>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                className="accent-cyan-500 w-24 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Finding verified educators...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/10 max-w-lg mx-auto">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Teachers Found Matching Criteria</h3>
            <p className="text-xs text-slate-400 mb-6">
              Try adjusting your search terms or expanding the curriculum and faculty filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCurriculumFilter('all');
                setTeacherType('all');
                setMaxRate(50);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <div
                key={t._id}
                className={`glass-card rounded-3xl p-6 border transition-all flex flex-col justify-between group ${
                  t.isAIAgent
                    ? 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 via-slate-900/80 to-slate-900/90 hover:border-cyan-400 shadow-lg shadow-cyan-500/5'
                    : 'border-white/10 hover:border-cyan-500/30'
                }`}
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className={`w-16 h-16 rounded-2xl object-cover shrink-0 ring-2 ${
                          t.isAIAgent ? 'ring-cyan-400' : 'ring-cyan-500/30'
                        }`}
                      />
                      {t.isAIAgent ? (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
                        </span>
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                          {t.name}
                        </h3>
                      </div>

                      {t.isAIAgent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-extrabold uppercase mb-1">
                          <Bot className="w-3 h-3" />
                          <span>24/7 AI Master</span>
                        </span>
                      )}

                      <p className="text-xs text-slate-400 line-clamp-1">{t.headline}</p>

                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="flex items-center text-amber-400 font-bold gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{t.rating?.toFixed(1) || '5.0'}</span>
                        </span>
                        <span className="text-slate-500">({t.reviewsCount || 0} reviews)</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">
                          {t.isAIAgent ? '24/7 Instant' : `${t.teachingExperienceYears}y exp`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">{t.bio}</p>

                  {/* Subject Badges */}
                  <div className="space-y-1.5 mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Subject Specialties:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {t.authorizedSubjects?.slice(0, 3).map((subj: string) => (
                        <span
                          key={subj}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-white/5 text-slate-300"
                        >
                          {subj}
                        </span>
                      ))}
                      {t.authorizedSubjects?.length > 3 && (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-500">
                          +{t.authorizedSubjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer with Rate & Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">{t.isAIAgent ? 'Tuition' : 'Session Rate'}</span>
                    <div className="text-lg font-black text-white">
                      {t.isAIAgent ? (
                        <span className="text-emerald-400 text-base font-extrabold">Free / 24/7</span>
                      ) : (
                        <>
                          ${t.hourlyRateUsd}
                          <span className="text-xs font-normal text-slate-400"> / hour</span>
                        </>
                      )}
                    </div>
                  </div>

                  {t.isAIAgent ? (
                    <Link
                      href={`/ai-teachers/${t.aiPersonaId || t._id}`}
                      className="px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                    >
                      <span>Start 1-on-1 Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/teachers/${t._id}`}
                      className="px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                    >
                      <span>Connect &amp; Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
