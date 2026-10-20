'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Upload, Info } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function TeacherApplyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Zimbabwe');
  const [city, setCity] = useState('Harare');
  const [bio, setBio] = useState('');
  const [qualificationsSummary, setQualificationsSummary] = useState('');
  const [teachingExperienceYears, setTeachingExperienceYears] = useState(3);
  const [curriculaExpertise, setCurriculaExpertise] = useState<string[]>(['Cambridge International']);
  const [subjectsToTeach, setSubjectsToTeach] = useState('Mathematics, Physics');
  const [preferredFormat, setPreferredFormat] = useState<'live_classes' | 'recorded_courses' | 'blended'>('blended');
  const [timeZone, setTimeZone] = useState('Africa/Harare');
  const [cvUrl, setCvUrl] = useState('');
  const [sampleLessonUrl, setSampleLessonUrl] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    apiFetch('/api/auth/me').then((res) => {
      if (res.success && res.user) {
        setUser(res.user);
        setFullName(res.user.name || '');
        setEmail(res.user.email || '');
        setPhone(res.user.phone || '');
        setCountry(res.user.country || 'Zimbabwe');

        // Check if user already submitted an application
        apiFetch('/api/teacher-applications/my').then((appRes) => {
          if (appRes.success && appRes.application) {
            setSubmittedApp(appRes.application);
          }
        });
      }
      setLoadingUser(false);
    });
  }, []);

  const handleCurriculumToggle = (curr: string) => {
    if (curriculaExpertise.includes(curr)) {
      setCurriculaExpertise(curriculaExpertise.filter((c) => c !== curr));
    } else {
      setCurriculaExpertise([...curriculaExpertise, curr]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!termsAgreed) {
      setErrorMessage('You must review and agree to the Teacher Agreement declaration.');
      return;
    }

    if (curriculaExpertise.length === 0) {
      setErrorMessage('Please select at least one curriculum expertise.');
      return;
    }

    setSubmitting(true);

    const subjectsArray = subjectsToTeach
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await apiFetch('/api/teacher-applications/apply', {
      method: 'POST',
      body: JSON.stringify({
        fullName,
        email,
        phone,
        country,
        city,
        bio,
        qualificationsSummary,
        teachingExperienceYears: Number(teachingExperienceYears),
        curriculaExpertise,
        subjectsToTeach: subjectsArray,
        preferredFormat,
        timeZone,
        cvUrl,
        sampleLessonUrl,
        safeguardingAgreed: true,
        termsAgreed,
      }),
    });

    if (res.success && res.application) {
      setSubmittedApp(res.application);
    } else {
      setErrorMessage(res.message || 'Failed to submit application. Please check your inputs.');
    }
    setSubmitting(false);
  };

  if (loadingUser) {
    return <div className="max-w-xl mx-auto py-20 text-center text-slate-400">Loading applicant status...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
          <Info className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">Account Required to Apply</h2>
        <p className="text-sm text-slate-300">
          Please log in or create a free account so we can link your application and keep you updated throughout the
          review process.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/login?redirect=/teach/apply" className="btn-secondary px-6 py-2.5 text-xs font-semibold">
            Log in to Existing Account
          </Link>
          <Link href="/auth/register?redirect=/teach/apply" className="btn-primary px-6 py-2.5 text-xs font-semibold">
            Create Free Account
          </Link>
        </div>
      </div>
    );
  }

  if (submittedApp) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
        <div className="glass-card rounded-2xl p-8 border border-teal-500/30 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto font-bold">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-950 border border-teal-500/40 text-teal-300 uppercase">
              Status: {submittedApp.status.replace('_', ' ')}
            </span>
            <h2 className="text-2xl font-bold text-white">Application Received</h2>
            <p className="text-sm text-slate-300">
              Thank you, <strong className="text-white">{submittedApp.fullName}</strong>. Your teacher application has
              been submitted and is queued for academic review.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Application ID:</span>
              <span className="font-mono text-cyan-300">{submittedApp._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Curricula:</span>
              <span className="text-white">{submittedApp.curriculaExpertise?.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Subjects:</span>
              <span className="text-white">{submittedApp.subjectsToTeach?.join(', ')}</span>
            </div>
            {submittedApp.statusNotes && (
              <div className="pt-2 border-t border-white/5 text-slate-300">
                <strong className="text-white">Admin Note:</strong> {submittedApp.statusNotes}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Our academic dean reviews applications weekly. You will receive an email notification when your interview is scheduled.
          </p>

          <Link href="/" className="btn-secondary inline-block px-6 py-2.5 text-xs font-semibold">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Teacher & Instructor Application
        </h1>
        <p className="text-sm text-slate-300">
          Complete the form below to apply to teach with EduEnlighten. All submissions are reviewed by our academic board.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-7 sm:p-9 space-y-6 border border-cyan-500/20">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Personal Details */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">1. Personal & Contact Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Phone Number (with country code) *</label>
              <input
                type="text"
                required
                placeholder="+263 77..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">City & Country *</label>
              <input
                type="text"
                required
                placeholder="Harare, Zimbabwe"
                value={`${city}, ${country}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setCity(parts[0]?.trim() || '');
                  if (parts[1]) setCountry(parts[1]?.trim());
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Qualifications & Experience */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">2. Academic & Teaching Background</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Highest Academic Qualifications *</label>
              <input
                type="text"
                required
                placeholder="e.g. BSc Mathematics (University of Zimbabwe), Post-Grad Dip in Education"
                value={qualificationsSummary}
                onChange={(e) => setQualificationsSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Years of Teaching / Industry Experience *</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  required
                  value={teachingExperienceYears}
                  onChange={(e) => setTeachingExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Preferred Delivery Format *</label>
                <select
                  value={preferredFormat}
                  onChange={(e) => setPreferredFormat(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="blended">Blended (Live Classes + Recorded Modules)</option>
                  <option value="live_classes">Scheduled Live Classes Only</option>
                  <option value="recorded_courses">Pre-Recorded Courses Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Curricula Expertise (Select all that apply) *</label>
              <div className="flex items-center gap-3 flex-wrap pt-1">
                {['Cambridge International', 'ZIMSEC Curriculum', 'Professional Digital Skills'].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={curriculaExpertise.includes(c)}
                      onChange={() => handleCurriculumToggle(c)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Subjects You Want to Teach (comma-separated) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mathematics, Physics, Frontend React, Computer Science"
                value={subjectsToTeach}
                onChange={(e) => setSubjectsToTeach(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Professional Biography (min. 20 words) *</label>
              <textarea
                required
                rows={4}
                placeholder="Tell our academic board about your teaching philosophy, past student pass rates, or industry achievements..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Supporting Materials & URLs */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">3. Supporting Materials (Optional)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">CV / Résumé Link (Google Drive / Dropbox)</label>
              <input
                type="url"
                placeholder="https://..."
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Sample Lesson / Demo Video Link (YouTube / Loom)</label>
              <input
                type="url"
                placeholder="https://..."
                value={sampleLessonUrl}
                onChange={(e) => setSampleLessonUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Declaration */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-1 rounded border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="text-xs text-slate-300 leading-relaxed">
              I certify that all qualifications and information submitted above are true and complete.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <span>{submitting ? 'Submitting Application...' : 'Submit Teacher Application'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
