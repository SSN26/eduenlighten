import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Target,
  Eye,
  ArrowRight,
  Globe2,
  School,
  Sparkles,
  Briefcase,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

export default function AboutPage() {
  const principles = [
    {
      number: '1',
      title: 'Affordability and accessibility',
      icon: Globe2,
      description:
        'We believe quality education should be within reach of every learner. We strive to reduce the financial, geographical and technological barriers that prevent young people from accessing learning opportunities.',
    },
    {
      number: '2',
      title: 'School empowerment',
      icon: School,
      description:
        'We support high schools and vocational institutions with digital tools that enhance teaching, expand learning opportunities and help educators deliver education more effectively.',
    },
    {
      number: '3',
      title: 'Inclusive and lifelong learning',
      icon: Sparkles,
      description:
        'We promote equal learning opportunities for young people from diverse backgrounds, including those who face barriers to conventional education, and encourage continuous personal and professional development.',
    },
    {
      number: '4',
      title: 'Practical skills and employability',
      icon: Briefcase,
      description:
        'We value both academic achievement and hands-on vocational training, helping learners develop relevant skills for employment, entrepreneurship and participation in the digital economy.',
    },
    {
      number: '5',
      title: 'Innovation and continuous improvement',
      icon: Lightbulb,
      description:
        'We use technology and innovative teaching approaches to improve learning experiences, respond to the changing needs of schools and prepare young people for the future.',
    },
    {
      number: '6',
      title: 'Quality, integrity and accountability',
      icon: ShieldCheck,
      description:
        'We are committed to reliable learning resources, responsible use of technology, protection of learner information and measurable educational outcomes for the institutions and communities we serve.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>About EduEnlighten</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Empowering Minds. Unlocking Potential.
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          EduEnlighten is a digital school built to make quality education and practical, hireable skills accessible to
          learners regardless of geography or financial background.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-8 space-y-3 border border-cyan-500/25">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To make quality education affordable and accessible by empowering high schools and vocational training institutions with digital classrooms and integrated online learning solutions, while equipping young people with the academic knowledge and practical skills they need to succeed in education, employment and entrepreneurship.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-3 border border-teal-500/25">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Our Vision</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To build an inclusive digital learning ecosystem where every young person, regardless of their background or location, has the opportunity to access quality formal education and vocational training, develop relevant skills and reach their full potential.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Core Principles</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            The foundational commitments guiding our technology, educators, and institutional partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-300">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="space-y-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-xs">
                      {item.number}
                    </span>
                    <Icon className="w-4 h-4 text-cyan-400/80" />
                  </div>
                  <h4 className="font-bold text-white text-sm leading-snug">
                    {item.number}. {item.title}
                  </h4>
                  <p className="text-slate-400 leading-relaxed text-xs">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 text-center">
          <Link href="/start-learning" className="btn-primary px-8 py-3 text-xs font-semibold inline-flex items-center gap-2">
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
