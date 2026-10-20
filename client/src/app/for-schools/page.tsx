'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function ForSchoolsPage() {
  const plans = [
    {
      name: 'Standard License',
      tagline: 'Complete digital classroom license for schools & vocational institutions',
      price: '$200',
      period: 'per academic term',
      features: [
        'Dedicated digital classroom',
        'Full curriculum access (Cambridge & ZIMSEC) and vocational skills training',
        'Unlimited classes',
        'Teacher accounts with subject assignment',
        'Interactive live virtual classrooms',
        'Custom school notices & announcements feed',
      ],
      popular: true,
      ctaText: 'Subscribe Standard License',
      planKey: 'standard',
    },
  ];

  const sampleSchools = [
    {
      name: 'Redwood College',
      slug: 'redwood-college',
      curriculum: 'Cambridge International (IGCSE & A-Level)',
      color: '#800000',
      tagline: 'Academic and Character Excellence in Secondary Education',
      students: 640,
      classes: 18,
    },
    {
      name: 'Excel High School',
      slug: 'excel-high-school',
      curriculum: 'Cambridge & ZIMSEC Dual Academic Pathway',
      color: '#005a36',
      tagline: 'Blended Secondary Academic Leadership & Modern Classrooms',
      students: 420,
      classes: 14,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-navy-950 via-slate-950 to-slate-950 border-b border-cyan-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
              Empower Your School with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Digital Classroom</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
              Equip school with its own dedicated, branded online learning portal. Manage classes and host secure live virtual classes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register-institution?type=high_school"
                className="px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-teal-500 transition-all flex items-center gap-2 group"
              >
                <span>Subscribe Your School Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#live-demonstration"
                className="px-8 py-3.5 rounded-xl font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
              >
                <span>View Sample Online Learning Portals</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live Sample Portals Demonstration */}
      <section id="live-demonstration" className="py-20 bg-slate-950 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Live Subscribed Schools</span>
              </div>
              <h2 className="text-3xl font-bold text-white">View Subscribed Schools</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sampleSchools.map((school) => (
              <div
                key={school.slug}
                className="glass-card rounded-2xl p-8 border border-white/10 hover:border-cyan-500/40 transition-all relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: school.color }}
                />
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {school.name}
                    </h3>
                    <p className="text-xs text-slate-400 italic mt-1 font-serif">{school.tagline}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: school.color }}
                  >
                    Active Tenant
                  </span>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 mb-6 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">Curriculum:</span>
                    <span className="font-medium text-cyan-300">{school.curriculum}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">Active Students:</span>
                    <span className="font-medium">{school.students} Learners</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">Class Streams:</span>
                    <span className="font-medium">{school.classes} Active Forms</span>
                  </div>
                </div>

                <Link
                  href={`/portal/${school.slug}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold bg-white/10 hover:bg-cyan-500/20 hover:text-cyan-300 text-white border border-white/10 transition-all"
                >
                  <span>Launch {school.name} Online Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Subscription Tiers */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Simple, Predictable Term-Based Subscriptions
            </h2>
            <p className="text-slate-400 text-lg">
              Billed per academic term (3 terms per year). No hidden fees, instant activation, and transparent seat limits tailored to school capacity.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card rounded-2xl p-8 flex flex-col justify-between border transition-all ${
                  plan.popular
                    ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/10 ring-2 ring-cyan-500/30'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-4">
                      Most Popular School License
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-6">{plan.tagline}</p>

                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-white">{plan.price}</span>
                      <span className="text-slate-400 text-sm font-medium">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/register-institution?type=high_school&plan=${plan.planKey}`}
                  className={`w-full py-3.5 rounded-xl font-bold text-center transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-500'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
