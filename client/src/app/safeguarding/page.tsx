import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';

export default function SafeguardingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950 border border-sky-500/30 text-sky-300 text-xs font-semibold uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Child Protection & Safety</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Child Safeguarding Policy & Code of Conduct
        </h1>
        <p className="text-xs text-slate-400">
          Last updated: October 2026 • Mandatory for all teachers, staff, parents, and learners
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 sm:p-10 space-y-8 text-slate-300 text-sm leading-relaxed border border-sky-500/20">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">1. Policy Statement</h2>
          <p>
            EduEnlighten is firmly dedicated to ensuring the safety, wellbeing, and dignity of all learners, with
            special priority given to children and minors (individuals under 18 years of age). We believe every young
            person has an absolute right to learn in an environment free from abuse, exploitation, discrimination, and
            harassment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">2. Educator Vetting & Verification</h2>
          <p>
            Prior to delivering live lessons or interacting with students, every prospective instructor must complete:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-xs text-slate-300">
            <li>Identity and nationality verification with national passport or identity card.</li>
            <li>Verification of academic degrees and teaching credentials with issuing institutions.</li>
            <li>Criminal record and police clearance checks where legally required by local jurisdiction.</li>
            <li>Written agreement and signature to this Child Safeguarding Code of Conduct.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">3. Digital Classroom Communication Rules</h2>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>No Unsupervised Private Messaging:</strong> One-on-one direct communications between adult
                instructors and minors are strictly restricted to audited educational channels with recorded audit logs.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Recorded Live Classrooms:</strong> Live video lessons are recorded for quality assurance, safety,
                and revision, subject to parental consent and platform data retention standards.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Parental Portal Access:</strong> Parents and guardians maintain real-time visibility into their
                child&apos;s academic progress, attendance records, and teacher feedback.
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">4. Reporting a Safeguarding Concern</h2>
          <p>
            If any learner, parent, or educator observes conduct that breaches this code, you are encouraged to report it
            immediately through our dedicated confidential channels:
          </p>
          <div className="p-4 rounded-xl bg-sky-950/60 border border-sky-500/30 text-xs text-sky-200 space-y-1">
            <p><strong>Designated Safeguarding Officer:</strong> Dr. Sarah Moyo (Academic Dean)</p>
            <p><strong>Emergency Safeguarding Email:</strong> safeguarding@eduenlighten.ac</p>
            <p><strong>Confidential Support Ticket:</strong> Select &apos;Child Safeguarding Concern&apos; on our <Link href="/contact" className="underline font-semibold">Contact Page</Link>.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
