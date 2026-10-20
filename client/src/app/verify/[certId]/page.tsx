'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Award, CheckCircle2, XCircle, ShieldCheck, ArrowRight, Search } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function VerifyCertificatePage() {
  const params = useParams();
  const certIdParam = params.certId as string;

  const [searchNumber, setSearchNumber] = useState(
    certIdParam !== 'check' ? certIdParam : ''
  );
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performVerification = (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setSearched(true);
    apiFetch(`/api/certificates/verify/${encodeURIComponent(num.trim())}`).then((res) => {
      setResult(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (certIdParam && certIdParam !== 'check') {
      performVerification(certIdParam);
    }
  }, [certIdParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(searchNumber);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Public Certificate Verification
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Verify credentials issued by EduEnlighten Digital School using the official certificate identifier.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="glass-card rounded-2xl p-4 flex gap-3 border border-amber-500/25">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            placeholder="Enter Certificate Number (e.g. EDU-2026-XXXXXX)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm font-mono uppercase focus:outline-none focus:border-amber-400"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5 text-xs font-semibold">
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {/* Verification Result */}
      {searched && (
        <div>
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Cryptographically verifying certificate hash...
            </div>
          ) : result && result.success && result.certificate ? (
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-teal-500/40 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-teal-400 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Officially Verified Credential</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {result.certificate.certificateNumber}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Awarded To</span>
                  <div className="text-2xl font-bold text-white mt-0.5">
                    {result.certificate.studentName}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Course Title</span>
                  <div className="text-lg font-semibold text-cyan-300 mt-0.5">
                    {result.certificate.courseTitle}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <span className="text-slate-400 block">Curriculum:</span>
                    <span className="text-white font-medium">{result.certificate.curriculumName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date of Issue:</span>
                    <span className="text-white font-medium">
                      {new Date(result.certificate.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                  <span className="text-slate-400 block">Cryptographic SHA-256 Hash:</span>
                  <span className="font-mono text-[10px] text-slate-400 break-all block">
                    {result.certificate.verificationHash}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-white/10">
                <span>Issuing Body: EduEnlighten Digital School</span>
                <span className="flex items-center gap-1 text-teal-400">
                  <ShieldCheck className="w-4 h-4" /> Tamper-Proof Verified
                </span>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 border border-rose-500/30 text-center space-y-3">
              <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Certificate Not Found</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                No active certificate matching this number was found in our database records. Please verify the
                spelling and ensure the number starts with EDU-.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
