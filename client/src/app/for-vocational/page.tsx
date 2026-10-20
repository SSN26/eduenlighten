'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  Cpu,
  Zap,
  Flame,
  Award,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Users,
  ShieldCheck,
  ClipboardCheck,
  Building,
} from 'lucide-react';

export default function ForVocationalPage() {
  const tradePillars = [
    {
      title: 'Electrical & Solar Photovoltaic',
      icon: Zap,
      desc: 'Domestic & 3-phase industrial wiring, off-grid battery bank sizing, inverter setup, and safety compliance.',
    },
    {
      title: 'Automotive & Diesel Mechanics',
      icon: Wrench,
      desc: 'Engine overhaul schematics, electronic fuel injection diagnostics, hydraulic circuits, and gearbox servicing.',
    },
    {
      title: 'Welding & Structural Fabrication',
      icon: Flame,
      desc: 'Oxy-acetylene cutting, TIG/MIG welding techniques, blueprint interpretation, and industrial metallurgical safety.',
    },
    {
      title: 'Digital Systems & Cloud IT',
      icon: Cpu,
      desc: 'Full-stack software engineering, Linux server administration, database systems, and networking fundamentals.',
    },
  ];

  const sampleVocational = [
    {
      name: 'Harare Polytechnic School of Engineering',
      slug: 'harare-polytechnic',
      tagline: 'Technical Competence, Hands-on Mastery and Industrial Innovation',
      color: '#0f766e', // Deep Teal
      curriculum: 'National Certificate (NC) & National Diploma (ND)',
      students: 890,
      cohorts: 16,
    },
    {
      name: 'Msasa Vocational & Technical Training Centre',
      slug: 'msasa-vtc',
      tagline: 'Practical Skills for Self-Reliance and Enterprise Growth',
      color: '#c2410c', // Rust Amber
      curriculum: 'Vocational Trade Tests (Class 1-4) & TVET Competencies',
      students: 310,
      cohorts: 8,
    },
  ];

  const plans = [
    {
      name: 'Standard License',
      tagline: 'Designed for state polytechnics & regional technical training colleges',
      price: '$200',
      period: 'per academic term',
      studentsLimit: 'Up to 500 enrolled trade students',
      features: [
        'Multi-departmental digital TVET campus (/portal/[your-vtc])',
        'Multi-cohort management (Foundation, NC, ND, HND)',
        'Up to 40 lecturer/instructor seats with trade rubrics',
        'Live technical demonstrations with screen-sharing & schematics',
        'Industrial attachment logbook submission & supervisor sign-off',
        'Institutional trade notices and timetable broadcasts',
        'Automated term-end competency transcripts',
        'Standard technical assistance & onboarding workshop',
      ],
      popular: true,
      ctaText: 'Subscribe Standard License',
      planKey: 'standard',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-teal-950/40 via-slate-950 to-slate-950 border-b border-teal-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold mb-6">
              <Building className="w-4 h-4" />
              <span>Multi-Tenant TVET & Polytechnic Subscriptions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
              Modernize Your Vocational Institute with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Dedicated TVET Portal</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
              Equip technical colleges, polytechnics, and vocational training centers with isolated digital portals. Deliver practical trade theory, monitor workshop logbooks, verify competency rubrics, and host live instructor demonstrations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register-institution?type=vocational_institution"
                className="px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25 hover:from-teal-400 hover:to-cyan-500 transition-all flex items-center gap-2 group"
              >
                <span>Subscribe Your Vocational Institute</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#vocational-showcase"
                className="px-8 py-3.5 rounded-xl font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
              >
                <span>View Sample TVET Portals</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Faculties Grid */}
      <section className="py-20 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Built Specifically for Practical Trade Disciplines</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our platform bridges the gap between hands-on workshop execution and structured digital instruction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradePillars.map((trade) => {
              const Icon = trade.icon;
              return (
                <div key={trade.title} className="glass-card p-6 rounded-2xl border border-white/10 hover:border-teal-500/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{trade.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{trade.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Sample Vocational Portals Showcase */}
      <section id="vocational-showcase" className="py-20 bg-slate-950 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Subscribed Technical Institutes</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Explore Subscribed TVET & Polytechnic Portals</h2>
            <p className="text-slate-400 mt-2">
              See how established technical institutes run their isolated departments, practical cohorts, and safety rubrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sampleVocational.map((inst) => (
              <div
                key={inst.slug}
                className="glass-card rounded-2xl p-8 border border-white/10 hover:border-teal-500/40 transition-all relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: inst.color }}
                />
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-slate-400 italic mt-1 font-serif">{inst.tagline}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: inst.color }}
                  >
                    Active TVET Portal
                  </span>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 mb-6 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">Accredited Tracks:</span>
                    <span className="font-medium text-teal-300">{inst.curriculum}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">Trade Apprentices:</span>
                    <span className="font-medium">{inst.students} Students</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">Workshop Cohorts:</span>
                    <span className="font-medium">{inst.cohorts} Active Cohorts</span>
                  </div>
                </div>

                <Link
                  href={`/portal/${inst.slug}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold bg-white/10 hover:bg-teal-500/20 hover:text-teal-300 text-white border border-white/10 transition-all"
                >
                  <span>Launch {inst.name} Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Pricing Tiers */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Predictable Term-Based TVET Subscriptions
            </h2>
            <p className="text-slate-400 text-lg">
              Empower your vocational instructors and apprentice cohorts with clear, transparent term pricing.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card rounded-2xl p-8 flex flex-col justify-between border transition-all ${
                  plan.popular
                    ? 'border-teal-500/50 shadow-2xl shadow-teal-500/10 ring-2 ring-teal-500/30'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold mb-4">
                      Most Popular TVET Campus License
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-6">{plan.tagline}</p>

                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-white">{plan.price}</span>
                      <span className="text-slate-400 text-sm font-medium">{plan.period}</span>
                    </div>
                    <p className="text-xs text-teal-400 mt-2 font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{plan.studentsLimit}</span>
                    </p>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/register-institution?type=vocational_institution&plan=${plan.planKey}`}
                  className={`w-full py-3.5 rounded-xl font-bold text-center transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-cyan-500'
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
