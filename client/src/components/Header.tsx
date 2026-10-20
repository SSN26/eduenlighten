'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  ChevronDown,
  Search,
  Menu,
  X,
  UserCheck,
  BookOpen,
  Wrench,
  Users,
  Building2,
  Code2,
  MapPin,
  Volume2,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [teachDropdownOpen, setTeachDropdownOpen] = useState(false);
  const [mobileLearnOpen, setMobileLearnOpen] = useState(false);
  const [mobileTeachOpen, setMobileTeachOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const learnRef = useRef<HTMLDivElement>(null);
  const teachRef = useRef<HTMLDivElement>(null);
  const learnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const teachTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleVoice = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-voice-assistant'));
    }
  };

  useEffect(() => {
    setLearnDropdownOpen(false);
    setTeachDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (learnRef.current && !learnRef.current.contains(e.target as Node)) {
        setLearnDropdownOpen(false);
      }
      if (teachRef.current && !teachRef.current.contains(e.target as Node)) {
        setTeachDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLearnEnter = () => {
    if (learnTimerRef.current) clearTimeout(learnTimerRef.current);
    setLearnDropdownOpen(true);
    setTeachDropdownOpen(false);
  };

  const handleLearnLeave = () => {
    learnTimerRef.current = setTimeout(() => {
      setLearnDropdownOpen(false);
    }, 180);
  };

  const handleTeachEnter = () => {
    if (teachTimerRef.current) clearTimeout(teachTimerRef.current);
    setTeachDropdownOpen(true);
    setLearnDropdownOpen(false);
  };

  const handleTeachLeave = () => {
    teachTimerRef.current = setTimeout(() => {
      setTeachDropdownOpen(false);
    }, 180);
  };

  const toggleLearn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (learnTimerRef.current) clearTimeout(learnTimerRef.current);
    setTeachDropdownOpen(false);
    setLearnDropdownOpen((prev) => !prev);
  };

  const toggleTeach = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (teachTimerRef.current) clearTimeout(teachTimerRef.current);
    setLearnDropdownOpen(false);
    setTeachDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    apiFetch('/api/auth/me').then((res) => {
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    });
  }, [pathname]);

  const handleLogout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    if (user.role === 'super_admin' || user.role === 'academic_admin') return '/admin';
    if (user.role === 'teacher') return '/teacher';
    return '/student';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#061522] border-b border-cyan-900/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00b4d8] to-[#0077b6] flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                <span>Edu</span>
                <span className="text-[#00c5d4]">Enlighten</span>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase -mt-1 hidden sm:block">
                Empowering Minds. Unlocking Potential.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors py-1 relative ${
                pathname === '/' ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Home</span>
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c5d4] rounded-full" />
              )}
            </Link>

            {/* Learn Dropdown */}
            <div
              ref={learnRef}
              className="relative"
              onMouseEnter={handleLearnEnter}
              onMouseLeave={handleLearnLeave}
            >
              <button
                type="button"
                onClick={toggleLearn}
                className={`flex items-center gap-1.5 transition-colors py-2 px-1 rounded-lg ${
                  pathname.startsWith('/high-school') || pathname.startsWith('/courses') || pathname.startsWith('/for-vocational') || pathname.includes('type=high_school') || pathname.includes('type=vocational') || pathname.includes('type=tutoring') || learnDropdownOpen
                    ? 'text-[#00c5d4] font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-expanded={learnDropdownOpen}
                aria-haspopup="true"
              >
                <span>Learn</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 pointer-events-none ${learnDropdownOpen ? 'rotate-180 text-cyan-400' : 'opacity-70 group-hover:opacity-100'}`} />
              </button>

              {learnDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                  <div className="rounded-2xl bg-[#0b2135]/95 backdrop-blur-xl border border-cyan-500/25 p-3 shadow-2xl space-y-1 text-xs">
                    <div className="px-2 pb-1.5 flex items-center justify-between text-[10px] font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-700/50 mb-1">
                      <span>Learning Portals</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono">Sign In</span>
                    </div>

                    <Link
                      href="/auth/login?type=high_school&title=High+School+Login"
                      onClick={() => setLearnDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-cyan-500/15 text-slate-200 hover:text-cyan-200 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#00c5d4]/15 flex items-center justify-center shrink-0 group-hover/item:bg-[#00c5d4]/25 transition-colors">
                        <GraduationCap className="w-4 h-4 text-[#00c5d4]" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover/item:text-cyan-300 transition-colors">High School Login</div>
                        <div className="text-[10px] text-slate-400">Cambridge &amp; ZIMSEC Forms 1–6</div>
                      </div>
                    </Link>

                    <Link
                      href="/auth/login?type=vocational&title=Vocational+Training+Login"
                      onClick={() => setLearnDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-teal-500/15 text-slate-200 hover:text-teal-200 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0 group-hover/item:bg-teal-500/25 transition-colors">
                        <Wrench className="w-4 h-4 text-teal-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover/item:text-teal-300 transition-colors">Vocational Training Login</div>
                        <div className="text-[10px] text-slate-400">TVET &amp; Polytechnic Apprentices</div>
                      </div>
                    </Link>

                    <Link
                      href="/auth/login?type=tutoring&title=Private+Tutoring+Login"
                      onClick={() => setLearnDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-purple-500/15 text-slate-200 hover:text-purple-200 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0 group-hover/item:bg-purple-500/25 transition-colors">
                        <Users className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover/item:text-purple-300 transition-colors">Private Tutoring Login</div>
                        <div className="text-[10px] text-slate-400">1-on-1 Students &amp; Educators</div>
                      </div>
                    </Link>

                    <div className="pt-1.5 mt-1 border-t border-slate-700/50 space-y-1">
                      <Link
                        href="/start-learning"
                        onClick={() => setLearnDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors font-semibold"
                      >
                        <Search className="w-4 h-4" />
                        <span>Find Subjects &amp; Teachers</span>
                      </Link>
                      <Link
                        href="/exam-centres"
                        onClick={() => setLearnDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-colors font-semibold"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Find Exam Centre</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Teach Dropdown */}
            <div
              ref={teachRef}
              className="relative"
              onMouseEnter={handleTeachEnter}
              onMouseLeave={handleTeachLeave}
            >
              <button
                type="button"
                onClick={toggleTeach}
                className={`flex items-center gap-1.5 transition-colors py-2 px-1 rounded-lg ${
                  pathname.startsWith('/teach') || pathname.startsWith('/independent-teachers') || teachDropdownOpen
                    ? 'text-[#00c5d4] font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-expanded={teachDropdownOpen}
                aria-haspopup="true"
              >
                <span>Join</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 pointer-events-none ${teachDropdownOpen ? 'rotate-180 text-cyan-400' : 'opacity-70 group-hover:opacity-100'}`} />
              </button>

              {teachDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                  <div className="rounded-2xl bg-[#0b2135]/95 backdrop-blur-xl border border-cyan-500/25 p-3 shadow-2xl space-y-1 text-xs">
                    <div className="px-2 pb-1.5 flex items-center justify-between text-[10px] font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-700/50 mb-1">
                      <span>Edu Enlighten Academy</span>
                    </div>

                    <Link
                      href="/teach/apply"
                      onClick={() => setTeachDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-cyan-500/15 text-slate-200 hover:text-cyan-200 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0 group-hover/item:bg-teal-500/25 transition-colors">
                        <Building2 className="w-4 h-4 text-teal-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover/item:text-teal-300 transition-colors">Apply to Join Academy</div>
                        <div className="text-[10px] text-slate-400">Edu Enlighten Academy</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/for-schools"
              className={`transition-colors ${
                pathname === '/for-schools' || pathname === '/for-vocational'
                  ? 'text-[#00c5d4] font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Schools &amp; Institutions
            </Link>

            <Link
              href="/about"
              className={`transition-colors ${
                pathname === '/about' ? 'text-[#00c5d4] font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              About Us
            </Link>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Button */}
            <Link
              href="/start-learning"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Voice & Sound Accessibility Assistant */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 text-xs font-semibold transition-all shadow-sm group"
              aria-label="Toggle Voice & Sound Accessibility Assistant"
              title="Voice & Sound Accessibility (Alt+V)"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Voice / Sound</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={getDashboardLink()}
                  className="px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Portal ({user.role})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white rounded-full bg-slate-900/80 border border-slate-700 hover:border-slate-500 transition-all shadow-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#00c5d4] hover:bg-[#00e1f2] rounded-full transition-all shadow-md shadow-cyan-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleVoice}
              className="p-2 text-cyan-400 hover:text-white"
              aria-label="Voice & Sound Assistant"
              title="Voice & Sound Assistant (Alt+V)"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <Link
              href="/start-learning"
              className="p-2 text-slate-300 hover:text-white"
              aria-label="Search Courses"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#061522] px-4 pt-4 pb-6 space-y-3 text-sm">
          {/* Mobile Voice & Sound Accessibility Button */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleToggleVoice();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Voice &amp; Sound Assistant</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200">
              Listen Aloud
            </span>
          </button>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-white hover:bg-white/5"
          >
            Home
          </Link>

          {/* Mobile Learn Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileLearnOpen(!mobileLearnOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-white/5"
            >
              <span>Learn</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileLearnOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
            </button>
            {mobileLearnOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-900/60 rounded-xl mt-1 border-l-2 border-cyan-400">
                <Link
                  href="/auth/login?type=high_school&title=High+School+Login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-white/5"
                >
                  • High School Login
                </Link>
                <Link
                  href="/auth/login?type=vocational&title=Vocational+Training+Login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:text-teal-300 hover:bg-white/5"
                >
                  • Vocational Training Login
                </Link>
                <Link
                  href="/auth/login?type=tutoring&title=Private+Tutoring+Login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:text-purple-300 hover:bg-white/5"
                >
                  • Private Tutoring Login
                </Link>
                <Link
                  href="/start-learning"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-md text-xs font-semibold text-cyan-400 hover:bg-white/5"
                >
                  🔍 Find Subjects &amp; Teachers
                </Link>
                <Link
                  href="/exam-centres"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-md text-xs font-semibold text-teal-400 hover:bg-white/5"
                >
                  📍 Find Exam Centre
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Teach Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileTeachOpen(!mobileTeachOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-white/5"
            >
              <span>Join</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileTeachOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
            </button>
            {mobileTeachOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-900/60 rounded-xl mt-1 border-l-2 border-cyan-400">
                <Link
                  href="/teach/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:text-teal-300 hover:bg-white/5"
                >
                  • Apply to Join Academy
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/for-schools"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-300 hover:bg-white/5"
          >
            Schools &amp; Institutions
          </Link>
          <Link
            href="/for-vocational"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-300 hover:bg-white/5"
          >
            Vocational Training (TVET)
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-300 hover:bg-white/5"
          >
            About Us
          </Link>

          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Portal Logins
            </div>
            <Link
              href="/auth/login?type=high_school&title=High+School+Login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-white/5"
            >
              • High School Login
            </Link>
            <Link
              href="/auth/login?type=vocational&title=Vocational+Training+Login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:text-teal-300 hover:bg-white/5"
            >
              • Vocational Training Login
            </Link>
            <Link
              href="/auth/login?type=tutoring&title=Private+Tutoring+Login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:text-purple-300 hover:bg-white/5"
            >
              • Private Tutoring Login
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800 flex gap-2">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center text-xs font-semibold rounded-full bg-slate-900 border border-slate-700 text-white"
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center text-xs font-bold rounded-full bg-[#00c5d4] text-slate-950"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
