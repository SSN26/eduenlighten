'use client';

import React from 'react';
import Link from 'next/link';
import { Code2, Server, Layout, Megaphone, CheckCircle2, ArrowRight, Award, FolderGit2 } from 'lucide-react';

export default function DigitalSkillsPage() {
  const tracks = [
    {
      title: 'Frontend Software Development',
      icon: Layout,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      desc: 'Master modern client-side engineering: HTML5, responsive CSS, Tailwind CSS, TypeScript, React 19, and Next.js App Router.',
      topics: ['Responsive Web Design', 'Modern JavaScript (ES2022+)', 'TypeScript Foundations', 'React Architecture', 'Next.js App Router & Deployment'],
      project: 'Build and deploy a responsive SaaS marketing landing page and interactive portal.',
    },
    {
      title: 'Backend Software Development',
      icon: Server,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20',
      desc: 'Design secure, production-grade REST APIs, MongoDB data models, authentication with JWT, and cloud deployment.',
      topics: ['Node.js & Express.js', 'MongoDB & Mongoose Modeling', 'JWT & Secure Cookie Sessions', 'Role-Based Access Control', 'API Security & Testing'],
      project: 'Build and document a full-fledged authentication and booking REST API with automated tests.',
    },
    {
      title: 'Product Management',
      icon: FolderGit2,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      desc: 'Learn product discovery, user journeys, PRDs, backlog grooming, Agile Scrum, prioritisation, and stakeholder management.',
      topics: ['Customer Discovery & User Personas', 'Writing PRDs & User Stories', 'Prioritisation Frameworks (RICE)', 'Agile & Sprint Execution', 'Product Metrics & OKRs'],
      project: 'Develop a comprehensive Product Requirements Document (PRD) and sprint backlog for an EdTech feature.',
    },
    {
      title: 'Digital Marketing & Growth',
      icon: Megaphone,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      desc: 'Drive scalable customer acquisition through SEO, content marketing, paid social ads, conversion funnels, and analytics.',
      topics: ['Search Engine Optimisation (SEO)', 'Social Media Strategy', 'Paid Advertising & Campaign Planning', 'Email Funnels & Automation', 'Marketing Analytics & ROI'],
      project: 'Design and simulate an end-to-end multi-channel marketing campaign with ROI projections.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase">
          <Code2 className="w-3.5 h-3.5" />
          <span>Professional Digital Skills Academy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Practical, Project-Based Skills for Modern Careers
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Learn directly from senior software architects and industry practitioners. Build an impressive portfolio of
          real-world projects that hiring managers respect.
        </p>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tracks.map((track, i) => {
          const Icon = track.icon;
          return (
            <div key={i} className="glass-card rounded-2xl p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${track.bgColor} ${track.color} flex items-center justify-center font-bold`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{track.title}</h3>
                    <span className="text-xs text-slate-400">Professional Practitioner Track</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{track.desc}</p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Key Topics Covered:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {track.topics.map((topic, ti) => (
                      <span
                        key={ti}
                        className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-slate-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Project Highlight */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Capstone Project:</span>
                  </div>
                  <p className="text-xs text-slate-300">{track.project}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Link
                  href={`/courses?curriculum=digital_skills&search=${encodeURIComponent(track.title.split(' ')[0])}`}
                  className="btn-primary w-full py-2.5 text-xs text-center block font-semibold"
                >
                  Explore {track.title} Courses
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certification Section */}
      <div className="rounded-3xl glass-card p-8 sm:p-12 border border-purple-500/20 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Verifiable Certificates of Completion</h3>
            <p className="text-xs text-slate-400">Tamper-evident verification backed by SHA-256 hashes.</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Students who complete all lessons, quizzes, and the final practical portfolio project earn a verifiable
          EduEnlighten Certificate of Completion. Anyone can verify your certificate through our public verification
          portal using your unique identifier.
        </p>

        <div className="flex items-center gap-4 flex-wrap pt-2">
          <Link href="/courses?curriculum=digital_skills" className="btn-primary px-6 py-2.5 text-sm font-semibold">
            Browse Digital Skills Bootcamps
          </Link>
          <Link href="/verify/check" className="btn-secondary px-6 py-2.5 text-sm font-semibold">
            Verify a Certificate
          </Link>
        </div>
      </div>
    </div>
  );
}
