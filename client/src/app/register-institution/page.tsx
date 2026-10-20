'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  GraduationCap,
  Wrench,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Palette,
  Sparkles,
  Layers,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

function RegisterInstitutionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialType = searchParams.get('type') === 'vocational_institution' ? 'vocational_institution' : 'high_school';
  const initialPlan = 'standard';

  const [type, setType] = useState<'high_school' | 'vocational_institution'>(initialType);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [city, setCity] = useState('Harare');
  const [country, setCountry] = useState('Zimbabwe');
  const [plan, setPlan] = useState<'standard'>('standard');
  const [primaryColor, setPrimaryColor] = useState(type === 'high_school' ? '#800000' : '#0f766e');
  const [curricula, setCurricula] = useState<string[]>(
    type === 'high_school' ? ['cambridge', 'zimsec'] : ['vocational_trades', 'digital_skills']
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any>(null);

  // Auto-generate slug preview
  const slugPreview = name
    ? name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : 'your-institution';

  const colorPresets =
    type === 'high_school'
      ? [
          { name: 'Heritage Maroon', value: '#800000' },
          { name: 'Collegiate Navy', value: '#1e3a8a' },
          { name: 'Academy Forest Green', value: '#005a36' },
          { name: 'Royal Purple', value: '#581c87' },
        ]
      : [
          { name: 'Industrial Teal', value: '#0f766e' },
          { name: 'Technical Slate', value: '#1e293b' },
          { name: 'Rust Amber', value: '#c2410c' },
          { name: 'Electric Blue', value: '#0369a1' },
        ];

  const handleTypeChange = (newType: 'high_school' | 'vocational_institution') => {
    setType(newType);
    setPrimaryColor(newType === 'high_school' ? '#800000' : '#0f766e');
    setCurricula(
      newType === 'high_school' ? ['cambridge', 'zimsec'] : ['vocational_trades', 'digital_skills']
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch('/api/institutions/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          name,
          type,
          tagline,
          contactEmail,
          contactPhone,
          city,
          country,
          plan,
          primaryColor,
          secondaryColor: '#0f172a',
          accentColor: '#f59e0b',
          curriculaSupported: curricula,
        }),
      });

      if (!res.success) {
        setError(res.message || 'Failed to register institution. Please try again.');
        setLoading(false);
        return;
      }

      setSuccessResult(res.data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanPrice = () => {
    if (type === 'high_school') {
      return '$200 / term (up to 450 students)';
    } else {
      return '$200 / term (up to 500 apprentices)';
    }
  };

  if (successResult) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-3xl p-10 border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-extrabold text-white">
            🎉 {successResult.name} Portal is Live!
          </h1>

          <p className="text-slate-300 max-w-lg mx-auto">
            Your dedicated multi-tenant learning environment has been provisioned. Faculty, students, and parents can now access your branded digital campus.
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-left font-mono text-xs text-slate-300 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Portal URL:</span>
              <span className="text-cyan-400 font-bold">/portal/{successResult.slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tenant Type:</span>
              <span className="capitalize">{successResult.type.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Subscription Plan:</span>
              <span className="uppercase text-amber-400 font-bold">{successResult.subscription?.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-emerald-400 font-bold">ACTIVE & ISOLATED</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href={`/portal/${successResult.slug}`}
              className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-teal-500 transition-all flex items-center justify-center gap-2"
            >
              <span>Enter School Portal Now</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              href="/for-schools"
              className="px-6 py-3.5 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
            >
              Back to Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <Building2 className="w-4 h-4" />
          <span>Multi-Tenant Online Learning Provisioning</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Subscribe & Provision Your Institution Portal
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm">
          Set up an isolated digital school or vocational campus in under 2 minutes with customized branding, term billing, and student rosters.
        </p>
      </div>

      {/* Institution Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          type="button"
          onClick={() => handleTypeChange('high_school')}
          className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
            type === 'high_school'
              ? 'glass-card border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/40 border-white/10 hover:border-white/20'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              type === 'high_school' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-slate-400'
            }`}
          >
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">High School / Secondary College</h3>
            <p className="text-xs text-slate-400 mt-1">
              For Cambridge (IGCSE, A-Level) &amp; ZIMSEC (O &amp; A Level) secondary schools.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange('vocational_institution')}
          className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
            type === 'vocational_institution'
              ? 'glass-card border-teal-500 ring-2 ring-teal-500/20 shadow-lg shadow-teal-500/10'
              : 'bg-slate-900/40 border-white/10 hover:border-white/20'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              type === 'vocational_institution' ? 'bg-teal-500 text-white' : 'bg-white/10 text-slate-400'
            }`}
          >
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Vocational / Technical TVET</h3>
            <p className="text-xs text-slate-400 mt-1">
              For TVET colleges, trade apprenticeships, polytechnics &amp; engineering institutes.
            </p>
          </div>
        </button>

        <Link
          href="/teach/apply"
          className="p-5 rounded-2xl border text-left transition-all flex items-start gap-4 bg-slate-900/40 border-white/10 hover:border-purple-500/50 hover:bg-purple-950/20 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                Teacher Application
              </h3>
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Apply to join EduEnlighten faculty, teach 1-on-1, and appear on Start Learning.
            </p>
          </div>
        </Link>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 border border-white/10 space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {/* Section 1: Basic Identity */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Institution Identity & Profile</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Institution Official Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'high_school' ? "e.g. St. Anne's College" : 'e.g. Bulawayo Technical Institute'}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Portal URL Preview (Isolated Slug)
              </label>
              <div className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-cyan-400 font-mono text-xs flex items-center overflow-x-auto">
                <span>eduenlighten.ac/portal/{slugPreview}</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Motto or Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder={
                  type === 'high_school'
                    ? 'e.g. Inspiring Excellence in Character and Scholarship'
                    : 'e.g. Practical Engineering Competence and Innovation'
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span>Official Contact & Campus Location</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Official Contact Email *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="admissions@yourschool.ac.zw"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+263 242 000 000"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Harare"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Zimbabwe"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Branding Customization */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            <span>Campus Visual Branding & School Colors</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Official Color Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setPrimaryColor(preset.value)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                      primaryColor === preset.value
                        ? 'border-cyan-400 bg-white/10 ring-2 ring-cyan-400/20'
                        : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full shrink-0 shadow-sm border border-white/20"
                      style={{ backgroundColor: preset.value }}
                    />
                    <span className="text-xs font-medium text-slate-200">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Branding Preview Pill */}
            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {name ? name.slice(0, 2).toUpperCase() : 'ED'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{name || 'Your Institution Name'}</h4>
                  <p className="text-xs text-slate-400">{tagline || 'Custom institutional portal branding'}</p>
                </div>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white text-center"
                style={{ backgroundColor: primaryColor }}
              >
                Portal Theme
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Subscription Plan */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Standard License Subscription</span>
          </h2>

          <div className="p-5 rounded-2xl border border-cyan-400 bg-cyan-500/10 ring-2 ring-cyan-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-bold uppercase tracking-wider text-white">Standard License</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-white">
                  POPULAR
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {type === 'high_school'
                  ? 'Complete digital campus with Cambridge & ZIMSEC dual curriculum, up to 450 learners & 35 faculty seats.'
                  : 'Complete TVET polytechnic portal with practical trade rubrics, logbooks & digital certificates (up to 500 apprentices).'}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-2xl font-black text-white">
                $200
                <span className="text-xs font-normal text-slate-400"> / term</span>
              </div>
              <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">Billed per academic term</p>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs text-slate-300">
            <span>Selected Billing:</span>
            <span className="font-bold text-cyan-400">{getPlanPrice()}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            By provisioning, you agree to EduEnlighten's multi-tenant academic terms and safeguarding policy.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-teal-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Provisioning Portal...</span>
            ) : (
              <>
                <span>Complete Subscription & Launch</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function RegisterInstitutionPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading registration form...</div>}>
        <RegisterInstitutionForm />
      </Suspense>
    </div>
  );
}
