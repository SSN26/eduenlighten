'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  GraduationCap,
  BookOpen,
  ArrowLeft,
  Star,
  CheckCircle2,
  Clock,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Send,
  HelpCircle,
  Award,
  Copy,
  Check,
  Mic,
  MicOff,
  Code2,
  Cpu,
  Layers,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Sliders,
  X,
  AlertCircle,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: string;
  suggestedFollowUps?: string[];
}

export default function AITeacherClassroomPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const teacherId = resolvedParams.id;

  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [teachingMode, setTeachingMode] = useState<'academic' | 'socratic' | 'exam_rigor' | 'tldr' | 'quiz'>('academic');

  // Audio / Speech State
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Practice Question Modal State
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [practiceQuestion, setPracticeQuestion] = useState<any>(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceEvaluation, setPracticeEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [practiceLoading, setPracticeLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    fetchTeacherData();
  }, [teacherId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const fetchTeacherData = async () => {
    setLoading(true);
    const res = await apiFetch(`/api/ai-teachers/${teacherId}`);
    if (res.success && res.data) {
      setTeacher(res.data);
      // Initialize with teacher's welcome message
      setMessages([
        {
          role: 'assistant',
          content: res.data.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowUps: res.data.suggestedPrompts || [],
        },
      ]);
    }
    setLoading(false);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || sending) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: teachingMode,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputValue('');
    setSending(true);

    // Call API
    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const res = await apiFetch(`/api/ai-teachers/${teacherId}/chat`, {
      method: 'POST',
      body: JSON.stringify({
        message: textToSend.trim(),
        history: historyPayload,
        mode: teachingMode,
      }),
    });

    if (res.success && res.reply) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: res.mode,
        suggestedFollowUps: res.suggestedFollowUps || [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but my connection encountered a temporary glitch. Please resend your question or switch modes.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
    setSending(false);
  };

  // Text to Speech
  const handleSpeak = (text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown before speaking
    const cleanText = text
      .replace(/###/g, '')
      .replace(/[*_#`$]/g, '')
      .replace(/\[\w+\]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = teacher?.voiceSettings?.rate || 1.0;
    utterance.pitch = teacher?.voiceSettings?.pitch || 1.0;
    utterance.lang = teacher?.voiceSettings?.lang || 'en-GB';

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeakingIndex(index);
  };

  // Copy message
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Speech to Text (Speech Recognition)
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Practice Question Generator
  const handleOpenPracticeModal = async (topic?: string) => {
    setPracticeModalOpen(true);
    setPracticeLoading(true);
    setPracticeEvaluation(null);
    setPracticeAnswer('');

    const res = await apiFetch(`/api/ai-teachers/${teacherId}/practice-question`, {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });

    if (res.success && res.data) {
      setPracticeQuestion(res.data);
    }
    setPracticeLoading(false);
  };

  const handleEvaluateAnswer = async () => {
    if (!practiceAnswer.trim() || !practiceQuestion) return;
    setEvaluating(true);

    const res = await apiFetch(`/api/ai-teachers/${teacherId}/evaluate-answer`, {
      method: 'POST',
      body: JSON.stringify({
        question: practiceQuestion.question,
        studentAnswer: practiceAnswer,
      }),
    });

    if (res.success && res.data) {
      setPracticeEvaluation(res.data);
    }
    setEvaluating(false);
  };

  const resetClassroom = () => {
    if (teacher) {
      setMessages([
        {
          role: 'assistant',
          content: teacher.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowUps: teacher.suggestedPrompts || [],
        },
      ]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060d17] text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Launching 1-on-1 AI Tutoring Studio...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-[#060d17] text-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">AI Teacher Agent Not Found</h2>
          <p className="text-sm text-slate-400">The requested AI Educator profile could not be retrieved.</p>
          <Link
            href="/ai-teachers"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to AI Faculty Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const modeButtons = [
    { id: 'academic', label: '🎓 Academic Depth', desc: 'Step-by-step conceptual rigor' },
    { id: 'socratic', label: '🏛️ Socratic Inquiry', desc: 'Guided questions to find answers' },
    { id: 'exam_rigor', label: '📝 Exam Marking Scheme', desc: 'Cambridge / ZIMSEC criteria & traps' },
    { id: 'tldr', label: '⚡ High-Yield (TL;DR)', desc: 'Concise bullet points & formulas' },
    { id: 'quiz', label: '🎯 Quiz & Practice', desc: 'Targeted problems to test mastery' },
  ];

  return (
    <div className="min-h-screen bg-[#060d17] text-slate-100 flex flex-col">
      {/* Top Classroom Bar */}
      <div className="sticky top-0 z-40 bg-[#081322]/95 border-b border-cyan-500/20 backdrop-blur-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Back & Teacher Profile Snippet */}
          <div className="flex items-center gap-3">
            <Link
              href="/ai-teachers"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Return to Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#060d17]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{teacher.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 text-[9px] font-extrabold uppercase">
                      AI 24/7
                    </span>
                  </h1>
                </div>
                <p className="text-[11px] text-cyan-400/90 font-medium truncate max-w-xs sm:max-w-md">
                  {teacher.title}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenPracticeModal()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-all shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate Practice Exam Question</span>
            </button>

            <button
              onClick={resetClassroom}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              title="Restart Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Teaching Mode Selector Bar */}
        <div className="max-w-7xl mx-auto pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mr-1">Teaching Mode:</span>
          {modeButtons.map((m) => (
            <button
              key={m.id}
              onClick={() => setTeachingMode(m.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                teachingMode === m.id
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
              title={m.desc}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Classroom Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Teacher Dossier & Quick Tools (Desktop) */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Teacher Dossier</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{teacher.bio}</p>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Curriculum Focus</div>
              <div className="flex flex-wrap gap-1">
                {teacher.curricula.map((c: string) => (
                  <span key={c} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Subjects Covered</div>
              <div className="flex flex-wrap gap-1">
                {teacher.subjects.map((s: string) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-teal-950/60 text-teal-300 text-[10px] border border-teal-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleOpenPracticeModal()}
              className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Generate Practice Exam</span>
            </button>
          </div>

          {/* Quick Syllabus Review Topics */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Instant Topic Inquiries</div>
            <div className="flex flex-col gap-1.5">
              {teacher.quickTopics?.map((topic: string) => (
                <button
                  key={topic}
                  onClick={() => handleSendMessage(`Teach me about ${topic}. Walk me through the core concept and a worked example.`)}
                  className="text-left px-3 py-2 rounded-xl bg-slate-950/60 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-between group"
                >
                  <span>{topic}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center / Right: Chat Stream & Interactive Whiteboard */}
        <div className="lg:col-span-3 flex flex-col justify-between rounded-3xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-xl overflow-hidden min-h-[600px] shadow-2xl">
          {/* Chat Messages Log */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 max-h-[calc(100vh-260px)]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 sm:gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {m.role === 'assistant' && (
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl object-cover shrink-0 border border-cyan-400/40 shadow-md"
                  />
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 shadow-lg space-y-3 ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-tr-none font-medium text-sm'
                      : 'bg-[#0b192c]/90 border border-cyan-500/20 text-slate-100 rounded-tl-none text-sm'
                  }`}
                >
                  {/* Top Bar for Assistant Message: Mode indicator & tools */}
                  {m.role === 'assistant' && (
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{teacher.name}</span>
                        {m.mode && <span className="text-slate-500">· {m.mode} mode</span>}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Audio Speak */}
                        <button
                          onClick={() => handleSpeak(m.content, idx)}
                          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                          title="Listen to Teacher"
                        >
                          {speakingIndex === idx ? (
                            <Pause className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Copy Content */}
                        <button
                          onClick={() => handleCopy(m.content, idx)}
                          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                          title="Copy response"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Content with Formatting */}
                  <div className="whitespace-pre-wrap leading-relaxed text-sm font-sans space-y-2">
                    {m.content}
                  </div>

                  {/* Suggested Follow-Up Prompts */}
                  {m.role === 'assistant' && m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Suggested Exploration:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestedFollowUps.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendMessage(prompt)}
                            className="text-left text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`text-[10px] pt-1 text-right ${m.role === 'user' ? 'text-cyan-200/70' : 'text-slate-500'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing / Reasoning Indicator */}
            {sending && (
              <div className="flex gap-3 items-center">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-8 h-8 rounded-2xl object-cover shrink-0 border border-cyan-400/40 animate-pulse"
                />
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/20 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-400 ml-1 font-medium">{teacher.name} is formulating the explanation...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Console / Input */}
          <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-cyan-500/20 space-y-3">
            {/* Quick suggested chips */}
            {teacher.suggestedPrompts && (
              <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">Try Asking:</span>
                {teacher.suggestedPrompts.slice(0, 2).map((sp: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sp)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-slate-800 shrink-0 truncate max-w-xs transition-colors"
                  >
                    {sp}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              {/* Mic Speech Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-3 rounded-2xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-slate-900 text-slate-400 hover:text-cyan-300 border-slate-800'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Voice Input (Speech-to-Text)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={2}
                  placeholder={`Ask ${teacher.name} anything in ${teacher.subjects[0]}... (Press Enter to send, Shift+Enter for newline)`}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || sending}
                className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Question & Grading Modal */}
      {practiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Targeted Practice Problem</h3>
              </div>
              <button
                onClick={() => setPracticeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {practiceLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Synthesizing exam-standard question...</p>
              </div>
            ) : practiceQuestion ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                    <span>Topic: {practiceQuestion.topic}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      [{practiceQuestion.marks} Marks]
                    </span>
                  </div>
                  <div className="text-sm text-slate-100 font-mono whitespace-pre-wrap leading-relaxed">
                    {practiceQuestion.question}
                  </div>
                </div>

                {/* Answer Box */}
                {!practiceEvaluation && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      Write Your Working &amp; Final Answer:
                    </label>
                    <textarea
                      rows={5}
                      value={practiceAnswer}
                      onChange={(e) => setPracticeAnswer(e.target.value)}
                      placeholder="Show your mathematical working, steps, equations, and final answer with units..."
                      className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={!practiceAnswer.trim() || evaluating}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      {evaluating ? 'Grading against official rubric...' : 'Submit & Grade My Solution'}
                    </button>
                  </div>
                )}

                {/* Evaluation Results */}
                {practiceEvaluation && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          Evaluation Score
                        </span>
                        <span className="text-xl font-extrabold text-white">
                          {practiceEvaluation.score} / {practiceEvaluation.maxScore}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200">{practiceEvaluation.feedback}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="font-bold text-cyan-400 uppercase tracking-wider">Model Solution:</div>
                      <div className="font-mono text-slate-300 whitespace-pre-wrap">
                        {practiceQuestion.modelSolution}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenPracticeModal()}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                    >
                      Try Another Practice Question
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
