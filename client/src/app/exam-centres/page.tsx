'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  GraduationCap,
  Award,
  Filter,
  ExternalLink,
} from 'lucide-react';

interface ExamCentre {
  id: string;
  name: string;
  centreNumber: string;
  board: 'Cambridge International' | 'ZIMSEC' | 'Both' | 'HEXCO / Technical';
  city: string;
  address: string;
  levels: string[];
  candidateType: 'Open for Private Candidates' | 'Internal & External Candidates' | 'Technical Apprentices';
  sessions: string;
  phone: string;
  email: string;
}

const EXAM_CENTRES: ExamCentre[] = [
  {
    id: 'ec-1',
    name: 'Harare British Council Testing & Assessment Hall',
    centreNumber: 'ZW001 / CAM-HAR',
    board: 'Cambridge International',
    city: 'Harare',
    address: 'Corner 3rd St & Jason Moyo Ave, Harare CBD',
    levels: ['IGCSE (O-Level)', 'AS & A-Level', 'Checkpoint'],
    candidateType: 'Open for Private Candidates',
    sessions: 'May/June & Oct/Nov Series',
    phone: '+263 242 701 415',
    email: 'exams.harare@britishcouncil.org',
  },
  {
    id: 'ec-2',
    name: 'Redwood College Regional Examination Centre',
    centreNumber: 'ZW142 / ZIM-04',
    board: 'Both',
    city: 'Harare',
    address: 'Borrowdale Road & Groombridge Way, Harare',
    levels: ['Cambridge IGCSE & A-Level', 'ZIMSEC O & A-Level', 'STEM Lab Practicals'],
    candidateType: 'Internal & External Candidates',
    sessions: 'June & November Sitting',
    phone: '+263 242 882 104',
    email: 'centre-officer@redwood.edu',
  },
  {
    id: 'ec-3',
    name: 'Bulawayo Central Examination Complex',
    centreNumber: 'ZW088 / BYO-REG',
    board: 'Cambridge International',
    city: 'Bulawayo',
    address: 'Fife Street & 8th Avenue, Bulawayo CBD',
    levels: ['IGCSE (O-Level)', 'GCE A-Level'],
    candidateType: 'Open for Private Candidates',
    sessions: 'May/June & Oct/Nov Series',
    phone: '+263 292 654 321',
    email: 'byo.testing@exams-zim.org',
  },
  {
    id: 'ec-4',
    name: 'Excel High School Accredited Assessment Centre',
    centreNumber: 'ZW210 / ZIM-12',
    board: 'ZIMSEC',
    city: 'Harare',
    address: 'Milton Park Educational Belt, Harare',
    levels: ['ZIMSEC O-Level', 'ZIMSEC A-Level', 'Commercials & Arts'],
    candidateType: 'Internal & External Candidates',
    sessions: 'June & November Sitting',
    phone: '+263 242 795 620',
    email: 'exams@excelhigh.edu',
  },
  {
    id: 'ec-5',
    name: 'Mutare Polytechnic & Technical Exam Centre',
    centreNumber: 'ZW-MUT-09',
    board: 'HEXCO / Technical',
    city: 'Mutare',
    address: 'Corner Aerodrome Road & Park Road, Mutare',
    levels: ['National Certificate (NC)', 'National Diploma (ND)', 'HEXCO Trade Tests'],
    candidateType: 'Technical Apprentices',
    sessions: 'April, August & November Series',
    phone: '+263 20 631 411',
    email: 'testing@mutarepoly.ac.zw',
  },
  {
    id: 'ec-6',
    name: 'Gweru Midlands Regional Assessment Hall',
    centreNumber: 'ZW304 / MID-02',
    board: 'Both',
    city: 'Gweru',
    address: 'Main Street & 6th Street, Gweru',
    levels: ['Cambridge IGCSE & A-Level', 'ZIMSEC O & A-Level'],
    candidateType: 'Open for Private Candidates',
    sessions: 'June & November Series',
    phone: '+263 54 223 908',
    email: 'midlands.exams@centre-portal.org',
  },
  {
    id: 'ec-7',
    name: 'Chitungwiza Metropolitan Examination Venue',
    centreNumber: 'ZW415 / CTG-01',
    board: 'ZIMSEC',
    city: 'Chitungwiza',
    address: 'Town Centre Complex, Seke, Chitungwiza',
    levels: ['ZIMSEC O-Level', 'ZIMSEC A-Level'],
    candidateType: 'Open for Private Candidates',
    sessions: 'June & November Sitting',
    phone: '+263 270 312 88',
    email: 'chitungwiza.exams@zimsec-reg.org',
  },
  {
    id: 'ec-8',
    name: 'Masvingo Great Zimbabwe Testing Centre',
    centreNumber: 'ZW512 / MSV-07',
    board: 'Cambridge International',
    city: 'Masvingo',
    address: 'Hughes Street & Robert Mugabe Way, Masvingo',
    levels: ['IGCSE (O-Level)', 'AS & A-Level'],
    candidateType: 'Open for Private Candidates',
    sessions: 'May/June & Oct/Nov Series',
    phone: '+263 39 264 501',
    email: 'masvingo.testing@exams-zim.org',
  },
];

export default function ExamCentresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const cities = useMemo(() => {
    const list = Array.from(new Set(EXAM_CENTRES.map((c) => c.city)));
    return ['All', ...list.sort()];
  }, []);

  const filteredCentres = useMemo(() => {
    return EXAM_CENTRES.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.centreNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.levels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBoard =
        selectedBoard === 'All' ||
        c.board === selectedBoard ||
        (selectedBoard === 'Cambridge International' && c.board === 'Both') ||
        (selectedBoard === 'ZIMSEC' && c.board === 'Both');

      const matchesCity = selectedCity === 'All' || c.city === selectedCity;

      return matchesSearch && matchesBoard && matchesCity;
    });
  }, [searchQuery, selectedBoard, selectedCity]);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-28 pb-16 border-b border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6">
            <Award className="w-4 h-4" />
            Accredited Testing &amp; Certificate Sitting Directory
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Find an <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Accredited Exam Centre</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300">
            Locate approved Cambridge International, ZIMSEC, and HEXCO technical examination centres for formal certificate sittings and practical exams.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by centre name, city, syllabus, or centre code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full sm:w-48 px-3.5 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  {cities.map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-white">
                      {city === 'All' ? 'All Cities' : city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Board Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 mr-2">Exam Board:</span>
              {['All', 'Cambridge International', 'ZIMSEC', 'HEXCO / Technical'].map((board) => (
                <button
                  key={board}
                  onClick={() => setSelectedBoard(board)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedBoard === board
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {board === 'All' ? 'All Boards' : board}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">
              Showing {filteredCentres.length} {filteredCentres.length === 1 ? 'Exam Centre' : 'Exam Centres'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified regional venues accepting private candidates and partner institutions
            </p>
          </div>
        </div>

        {filteredCentres.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No examination centres match your query</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Try adjusting your search keywords, clearing the city filter, or selecting "All Boards".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBoard('All');
                setSelectedCity('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCentres.map((centre) => (
              <div
                key={centre.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 transition-all shadow-lg hover:shadow-cyan-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            centre.board === 'Cambridge International'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : centre.board === 'ZIMSEC'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : centre.board === 'Both'
                              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {centre.board}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                          {centre.centreNumber}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug">{centre.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 text-xs text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{centre.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{centre.sessions}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-emerald-300 font-medium">{centre.candidateType}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Offered Syllabus Levels
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {centre.levels.map((lvl) => (
                        <span
                          key={lvl}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-200 text-xs"
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex flex-col gap-1 w-full sm:w-auto text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      {centre.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-teal-400" />
                      {centre.email}
                    </span>
                  </div>

                  <Link
                    href={`/contact?subject=Exam+Centre+Inquiry+-+${encodeURIComponent(centre.name)}`}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/20 text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Inquire / Register</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informational Guidance Box */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Private Candidate Guidelines &amp; Deadlines</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Candidates studying online through EduEnlighten write their official examinations at physical accredited test centres. Registration for the May/June examination series typically concludes by February, while registration for October/November sessions closes in July. Please contact your nearest centre early to ensure timely entry submission and identity verification.
              </p>
              <div className="pt-2">
                <Link
                  href="/start-learning"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Explore revision courses &amp; past papers on EduEnlighten</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
