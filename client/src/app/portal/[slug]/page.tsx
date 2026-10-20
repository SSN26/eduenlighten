'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Wrench,
  Building2,
  Users,
  BookOpen,
  Calendar,
  Layers,
  Award,
  Bell,
  Video,
  Plus,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface PortalPageProps {
  params: Promise<{ slug: string }>;
}

export default function TenantPortalPage({ params }: PortalPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classes' | 'syllabus' | 'announcements' | 'admin'>('classes');

  // Admin Modal states
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('');
  const [newClassTeacher, setNewClassTeacher] = useState('');
  const [newClassSubjects, setNewClassSubjects] = useState('');

  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');

  // Sample live virtual room launcher state
  const [launchedRoom, setLaunchedRoom] = useState<string | null>(null);

  useEffect(() => {
    fetchTenantData();
  }, [slug]);

  const fetchTenantData = async () => {
    setLoading(true);
    const res = await apiFetch(`/api/institutions/${slug}`);
    if (res.success && res.data) {
      setInstitution(res.data);
    }
    setLoading(false);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName || !newClassGrade) return;

    const subjectsArray = newClassSubjects.split(',').map((s) => s.trim()).filter(Boolean);

    const res = await apiFetch(`/api/institutions/${slug}/classes`, {
      method: 'POST',
      body: JSON.stringify({
        name: newClassName,
        gradeLevel: newClassGrade,
        classTeacher: newClassTeacher || 'Assigned Staff',
        studentCount: 25,
        subjects: subjectsArray.length > 0 ? subjectsArray : ['General Subject Stream'],
      }),
    });

    if (res.success) {
      setShowAddClassModal(false);
      setNewClassName('');
      setNewClassGrade('');
      setNewClassTeacher('');
      setNewClassSubjects('');
      fetchTenantData();
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementTitle || !newAnnouncementContent) return;

    const res = await apiFetch(`/api/institutions/${slug}/announcements`, {
      method: 'POST',
      body: JSON.stringify({
        title: newAnnouncementTitle,
        content: newAnnouncementContent,
      }),
    });

    if (res.success) {
      setShowAddAnnouncementModal(false);
      setNewAnnouncementTitle('');
      setNewAnnouncementContent('');
      fetchTenantData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading isolated tenant portal for /{slug}...</p>
        </div>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100 p-4">
        <div className="glass-card rounded-2xl p-8 max-w-md text-center border border-white/10 space-y-4">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold">Institution Portal Not Found</h2>
          <p className="text-slate-400 text-sm">
            No active tenant exists for <span className="text-cyan-400 font-mono">/portal/{slug}</span>.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/for-schools"
              className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-sm transition-all"
            >
              Browse Subscribed Schools
            </Link>
            <Link
              href="/register-institution"
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all"
            >
              Register Your Institution
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const primaryColor = institution.branding?.primaryColor || '#1e3a8a';
  const isVocational = institution.type === 'vocational_institution';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Dynamic Multi-Tenant Header Banner */}
      <div
        className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 shadow-2xl transition-colors"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}dd 0%, #060d17 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Custom School Crest / Emblem */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl ring-2 ring-white/30 text-2xl font-black shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {institution.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-sm uppercase tracking-wider">
                  {isVocational ? 'TVET Technical Polytechnic' : 'Secondary High School'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Tenant Space</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {institution.name}
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm italic font-serif opacity-90 mt-0.5">
                {institution.tagline || 'Empowering learners through syllabus mastery and practical training.'}
              </p>
            </div>
          </div>

          {/* Subscription & Seat Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 text-left text-xs space-y-1 w-full sm:w-auto">
              <div className="flex justify-between gap-4 text-slate-300">
                <span>License Plan:</span>
                <span className="font-bold text-amber-300 uppercase">
                  {institution.subscription?.plan || 'STANDARD'}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-slate-300">
                <span>Seat Capacity:</span>
                <span className="font-bold text-cyan-300">
                  {institution.enrolledStudentsCount || 120} / {institution.subscription?.maxStudents || 450} Seats
                </span>
              </div>
              <div className="flex justify-between gap-4 text-slate-300">
                <span>Status:</span>
                <span className="font-bold text-emerald-400">Term License Active</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('admin')}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Faculty Admin Studio</span>
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tenant Switcher Ribbon (Allows user to test all sample school/vocational portals easily) */}
      <div className="bg-slate-900 border-b border-white/5 py-2.5 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-semibold text-slate-300">Switch Tenant Portal:</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/portal/redwood-college"
              className={`px-3 py-1 rounded-lg transition-all ${
                slug === 'redwood-college' || slug === 'st-georges-college' ? 'bg-cyan-500 text-white font-bold' : 'hover:text-white'
              }`}
            >
              Redwood College
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/portal/excel-high-school"
              className={`px-3 py-1 rounded-lg transition-all ${
                slug === 'excel-high-school' || slug === 'prince-edward-school' ? 'bg-cyan-500 text-white font-bold' : 'hover:text-white'
              }`}
            >
              Excel High School
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/portal/harare-polytechnic"
              className={`px-3 py-1 rounded-lg transition-all ${
                slug === 'harare-polytechnic' ? 'bg-cyan-500 text-white font-bold' : 'hover:text-white'
              }`}
            >
              Harare Polytechnic
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/portal/msasa-vtc"
              className={`px-3 py-1 rounded-lg transition-all ${
                slug === 'msasa-vtc' ? 'bg-cyan-500 text-white font-bold' : 'hover:text-white'
              }`}
            >
              Msasa VTC
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'classes'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isVocational ? 'Trade Cohorts & Workshops' : 'Classes & Forms'}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/30">
              {institution.classes?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'syllabus'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Syllabus & Learning Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'announcements'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Noticeboard</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/30">
              {institution.announcements?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'admin'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Institution Administration</span>
          </button>
        </div>

        {/* Live Virtual Classroom Modal Launcher */}
        {launchedRoom && (
          <div className="my-6 p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Live Virtual Classroom Launched: {launchedRoom}</h3>
                <p className="text-xs text-slate-300">
                  High-definition Jitsi session active for {institution.name} learners and teachers.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://meet.jit.si/${encodeURIComponent(launchedRoom)}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-white text-xs flex items-center gap-2 shadow-lg"
              >
                <span>Enter Live Video Room</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setLaunchedRoom(null)}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Classes & Forms */}
        {activeTab === 'classes' && (
          <div className="py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isVocational ? 'Active Technical Workshop Cohorts' : 'Academic Forms & Class Streams'}
                </h2>
                <p className="text-slate-400 text-sm">
                  Isolated to {institution.name}. Students and teachers only access their registered subjects.
                </p>
              </div>
              <button
                onClick={() => setShowAddClassModal(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{isVocational ? 'Add Trade Cohort' : 'Add Class Stream'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {institution.classes?.map((cls: any) => (
                <div
                  key={cls.id}
                  className="glass-card rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/10 text-cyan-300">
                        {cls.gradeLevel}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{cls.studentCount} Students</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{cls.name}</h3>
                    <p className="text-xs text-slate-400 mb-4">Instructor: {cls.classTeacher}</p>

                    <div className="space-y-1 mb-6">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Registered Subjects:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cls.subjects?.map((subj: string) => (
                          <span
                            key={subj}
                            className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-white/5 text-slate-300"
                          >
                            {subj}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() =>
                        setLaunchedRoom(
                          `eduenlighten-${institution.slug}-${cls.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
                        )
                      }
                      className="flex-1 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Launch Class Live Room</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Syllabus & Learning Hub */}
        {activeTab === 'syllabus' && (
          <div className="py-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Curriculum & Syllabus Modules</h2>
              <p className="text-slate-400 text-sm">
                Syllabus-aligned preparation materials enabled for {institution.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Core Topic Modules & Lecture Archives</h3>
                    <p className="text-xs text-slate-400">Past paper revision and step-by-step problem sets.</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900 flex justify-between items-center">
                    <span>Module 1: Foundations & Diagnostic Assessment</span>
                    <span className="text-emerald-400 font-bold">Available</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 flex justify-between items-center">
                    <span>Module 2: Mid-Term Comprehensive Drills</span>
                    <span className="text-emerald-400 font-bold">Available</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 flex justify-between items-center">
                    <span>Module 3: Exam Paper Walkthroughs (Section A & B)</span>
                    <span className="text-emerald-400 font-bold">Available</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Safety & Examination Compliance</h3>
                    <p className="text-xs text-slate-400">Independent curriculum notice & guidelines.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All study materials provide strict syllabus alignment. EduEnlighten ensures student homework tracking and attendance records are encrypted and preserved for institutional auditing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Announcements */}
        {activeTab === 'announcements' && (
          <div className="py-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">{institution.name} Noticeboard</h2>
                <p className="text-slate-400 text-sm">Official announcements broadcast to enrolled students and staff.</p>
              </div>
              <button
                onClick={() => setShowAddAnnouncementModal(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Post Announcement</span>
              </button>
            </div>

            <div className="space-y-4">
              {institution.announcements?.map((a: any) => (
                <div key={a.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-base">{a.title}</h3>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{a.date}</span>
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Administration */}
        {activeTab === 'admin' && (
          <div className="py-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Institution Administration Studio</h2>
              <p className="text-slate-400 text-sm">
                Manage your school/institute's subscription, faculty roster, and student seat utilization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-400 uppercase font-bold">Term Renewal</span>
                <p className="text-xl font-bold text-white mt-1">
                  {new Date(institution.subscription?.renewalDate || Date.now()).toLocaleDateString()}
                </p>
                <p className="text-xs text-emerald-400 mt-2 font-semibold">Active & In Good Standing</p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-400 uppercase font-bold">Seat Utilization</span>
                <p className="text-xl font-bold text-white mt-1">
                  {institution.enrolledStudentsCount} / {institution.subscription?.maxStudents}
                </p>
                <p className="text-xs text-cyan-400 mt-2 font-semibold">
                  {Math.round(((institution.enrolledStudentsCount || 0) / (institution.subscription?.maxStudents || 1)) * 100)}% capacity
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-400 uppercase font-bold">Assigned Faculty</span>
                <p className="text-xl font-bold text-white mt-1">
                  {institution.assignedTeachersCount} Teachers
                </p>
                <p className="text-xs text-slate-400 mt-2">Max allowed: {institution.subscription?.maxTeachers}</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-base">Administrative Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowAddClassModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Class / Form</span>
                </button>
                <button
                  onClick={() => setShowAddAnnouncementModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  <span>Broadcast Notice</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 max-w-lg w-full border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">
                {isVocational ? 'Add New Trade Cohort' : 'Add New Class Stream'}
              </h3>
              <button onClick={() => setShowAddClassModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Class / Cohort Name *</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder={isVocational ? 'e.g. Electrical Solar Installation ND 2' : 'e.g. Form 4 Cambridge Science B'}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Grade Level / Qualification *</label>
                <input
                  type="text"
                  required
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value)}
                  placeholder={isVocational ? 'e.g. National Certificate' : 'e.g. Form 4'}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Teacher / Instructor</label>
                <input
                  type="text"
                  value={newClassTeacher}
                  onChange={(e) => setNewClassTeacher(e.target.value)}
                  placeholder="e.g. Dr. Chiware / Eng. Sithole"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subjects (Comma separated)</label>
                <input
                  type="text"
                  value={newClassSubjects}
                  onChange={(e) => setNewClassSubjects(e.target.value)}
                  placeholder="e.g. Mathematics, Physics, Chemistry"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Announcement Modal */}
      {showAddAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 max-w-lg w-full border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">Broadcast Announcement</h3>
              <button onClick={() => setShowAddAnnouncementModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={newAnnouncementTitle}
                  onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                  placeholder="e.g. Term 3 Mock Examination Timetable"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Content *</label>
                <textarea
                  required
                  rows={4}
                  value={newAnnouncementContent}
                  onChange={(e) => setNewAnnouncementContent(e.target.value)}
                  placeholder="Enter notice details for students and faculty..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAnnouncementModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
