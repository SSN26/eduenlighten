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
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function IndependentTeachersDirectoryPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [curriculumFilter, setCurriculumFilter] = useState('all');
  const [maxRate, setMaxRate] = useState<number>(50);

  useEffect(() => {
    fetchTeachers();
  }, [curriculumFilter, maxRate]);

  const fetchTeachers = async () => {
    setLoading(true);
    let url = `/api/teachers?curriculum=${curriculumFilter}&maxRate=${maxRate}`;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
            <Users className="w-4 h-4" />
            <span>Independent Educators & Tutors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Connect Directly with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Independent Teachers</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Browse verified, safeguarding-vetted educators across Cambridge, ZIMSEC, and vocational trades. Book private 1-on-1 tuition or interactive study circles directly.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/teach/independent"
              className="px-6 py-2.5 rounded-xl font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Are you an Educator? Teach Independently</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 mb-10 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by subject (e.g. Mathematics, Physics, Solar PV, Python) or teacher name..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-white text-sm transition-all"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 text-xs">
            {/* Curriculum Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Curriculum:</span>
              </span>
              {curriculumOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCurriculumFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    curriculumFilter === opt.value
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Max Hourly Rate Filter */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-semibold">Max Rate:</span>
              <span className="text-cyan-400 font-bold">${maxRate}/hr</span>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                className="accent-cyan-500 w-28 cursor-pointer"
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
              Try adjusting your search terms or expanding the curriculum and hourly rate filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCurriculumFilter('all');
                setMaxRate(50);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <div
                key={t._id}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                          {t.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{t.headline}</p>

                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="flex items-center text-amber-400 font-bold gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{t.rating?.toFixed(1) || '5.0'}</span>
                        </span>
                        <span className="text-slate-500">({t.reviewsCount || 0} reviews)</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{t.teachingExperienceYears}y exp</span>
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
                    <span className="text-xs text-slate-400">Session Rate</span>
                    <div className="text-lg font-black text-white">
                      ${t.hourlyRateUsd}
                      <span className="text-xs font-normal text-slate-400"> / hour</span>
                    </div>
                  </div>

                  <Link
                    href={`/teachers/${t._id}`}
                    className="px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Connect & Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
