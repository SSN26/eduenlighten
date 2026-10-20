'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Star,
  Users,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialCurriculum = searchParams.get('curriculum') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [curriculum, setCurriculum] = useState(initialCurriculum);
  const [search, setSearch] = useState(initialSearch);
  const [pricingType, setPricingType] = useState('all');
  const [deliveryFormat, setDeliveryFormat] = useState('all');

  const fetchCourses = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (curriculum !== 'all') params.append('curriculum', curriculum);
    if (search.trim()) params.append('search', search.trim());
    if (pricingType !== 'all') params.append('pricingType', pricingType);
    if (deliveryFormat !== 'all') params.append('deliveryFormat', deliveryFormat);

    apiFetch(`/api/courses?${params.toString()}`).then((res) => {
      if (res.success && res.courses) {
        setCourses(res.courses);
      } else {
        setCourses([]);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCourses();
  }, [curriculum, pricingType, deliveryFormat]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Course Catalogue
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
          Browse structured courses across Cambridge International, ZIMSEC, and Professional Digital Skills. Filter by
          curriculum, price, or format.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course title, syllabus code, or subject (e.g. Mathematics, React, 0580)..."
            className="w-full pl-12 pr-28 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-sm"
          />
          <button
            type="submit"
            className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs font-semibold"
          >
            Search
          </button>
        </form>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5 text-xs">
          {/* Curriculum Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'All Curricula' },
              { id: 'cambridge', label: 'Cambridge International' },
              { id: 'zimsec', label: 'ZIMSEC Academy' },
              { id: 'digital_skills', label: 'Digital Skills' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurriculum(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  curriculum === tab.id
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pricing & Format Dropdowns */}
          <div className="flex items-center gap-3">
            <select
              value={pricingType}
              onChange={(e) => setPricingType(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Prices</option>
              <option value="free">Free Courses</option>
              <option value="paid">Paid Courses</option>
            </select>

            <select
              value={deliveryFormat}
              onChange={(e) => setDeliveryFormat(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Formats</option>
              <option value="blended">Blended Learning</option>
              <option value="self_paced">Self-Paced</option>
              <option value="scheduled_live">Live Classes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-semibold">
                    {course.curriculum?.name || 'Academic'}
                  </span>
                  <span className="text-slate-400 capitalize">{course.deliveryFormat.replace('_', ' ')}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium block mb-1">{course.level}</span>
                  <h3 className="text-lg font-bold text-white line-clamp-2 hover:text-cyan-400 transition-colors">
                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                  </h3>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {course.shortDescription}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {course.durationHours} Hours
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {course.rating || '4.9'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    {course.enrolledStudentsCount || 0}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Tuition</span>
                  <span className="text-lg font-bold text-white">
                    {course.pricingType === 'free' ? 'Free' : `$${course.discountPriceUsd || course.priceUsd}`}
                  </span>
                </div>
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1"
                >
                  <span>View Course</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl glass-card space-y-4 max-w-xl mx-auto">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">No courses match your filter criteria</h3>
          <p className="text-sm text-slate-400">
            Try adjusting your search terms or selecting &ldquo;All Curricula&rdquo; to explore all offered subjects.
          </p>
          <button
            onClick={() => {
              setCurriculum('all');
              setSearch('');
              setPricingType('all');
              setDeliveryFormat('all');
            }}
            className="btn-secondary px-5 py-2 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading Course Catalogue...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
