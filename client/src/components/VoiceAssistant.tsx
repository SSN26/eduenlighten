'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  RotateCcw,
  Sliders,
  Settings2,
  X,
  ChevronUp,
  ChevronDown,
  Check,
  Headphones,
  Sparkles,
  Info,
} from 'lucide-react';

interface VoiceOption {
  voice: SpeechSynthesisVoice;
  label: string;
}

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTextSnippet, setCurrentTextSnippet] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [soundFeedbackEnabled, setSoundFeedbackEnabled] = useState<boolean>(true);
  const [readSelectionEnabled, setReadSelectionEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Web Audio API safely for sound feedback
  const playSoundFeedback = useCallback(
    (type: 'click' | 'start' | 'stop' | 'chime') => {
      if (!soundFeedbackEnabled || typeof window === 'undefined') return;

      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;

        if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(480, now);
          osc.frequency.exponentialRampToValueAtTime(720, now + 0.05);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'start') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'stop') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(540, now);
          osc.frequency.exponentialRampToValueAtTime(270, now + 0.1);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (type === 'chime') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        }
      } catch {
        // audio context could be blocked by browser policy prior to gesture
      }
    },
    [soundFeedbackEnabled]
  );

  // Load voices from SpeechSynthesis
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setHasSpeechSupport(false);
      return;
    }

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (!available || available.length === 0) return;

      // Filter for English first or present all
      const englishVoices = available.filter((v) => v.lang.startsWith('en'));
      const listToUse = englishVoices.length > 0 ? englishVoices : available;

      const formatted = listToUse.map((v) => ({
        voice: v,
        label: `${v.name} (${v.lang})${v.default ? ' — Default' : ''}`,
      }));

      setVoices(formatted);

      // Restore saved voice preference if exists
      const savedVoice = localStorage.getItem('eduenlighten_voice_pref');
      if (savedVoice) {
        const found = formatted.findIndex((item) => item.voice.name === savedVoice);
        if (found !== -1) setSelectedVoiceIndex(found);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Load saved settings
    try {
      const savedRate = localStorage.getItem('eduenlighten_speech_rate');
      if (savedRate) setSpeechRate(parseFloat(savedRate));
      const savedSound = localStorage.getItem('eduenlighten_sound_feedback');
      if (savedSound !== null) setSoundFeedbackEnabled(savedSound === 'true');
      const savedReadSel = localStorage.getItem('eduenlighten_read_selection');
      if (savedReadSel !== null) setReadSelectionEnabled(savedReadSel === 'true');
    } catch {
      // ignore local storage errors
    }

    // Global event listeners for header button and keyboard shortcut
    const handleToggleEvent = () => {
      setIsOpen((prev) => !prev);
      playSoundFeedback('click');
    };

    const handleReadPageEvent = () => {
      setIsOpen(true);
      readCurrentPage();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + V to toggle Voice Assistant
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        playSoundFeedback('chime');
      }
      // Alt + S to Stop reading
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        stopReading();
      }
      // Escape to close panel if open
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('toggle-voice-assistant', handleToggleEvent);
    window.addEventListener('read-page-aloud', handleReadPageEvent);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('toggle-voice-assistant', handleToggleEvent);
      window.removeEventListener('read-page-aloud', handleReadPageEvent);
      window.removeEventListener('keydown', handleKeyDown);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, playSoundFeedback]);

  // Read selected text when user finishes highlighting
  useEffect(() => {
    if (!readSelectionEnabled || typeof window === 'undefined') return;

    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 2 && text.length < 500) {
        // Speak selection
        speakText(text, 'Selection');
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [readSelectionEnabled, speechRate, speechPitch, selectedVoiceIndex, voices]);

  // Core speak method
  const speakText = (text: string, sourceLabel: string = 'Content') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (!text || text.trim().length === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;

    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex].voice;
    }

    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentTextSnippet(`${sourceLabel}: "${text.slice(0, 110)}${text.length > 110 ? '...' : ''}"`);
      playSoundFeedback('start');
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTextSnippet('');
      currentUtteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTextSnippet('');
      currentUtteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  // Read entire visible page contents
  const readCurrentPage = () => {
    if (typeof window === 'undefined') return;

    const mainElement = document.querySelector('main') || document.body;
    if (!mainElement) return;

    // Collect readable blocks
    const nodes = mainElement.querySelectorAll('h1, h2, h3, h4, p, li, button:not([aria-hidden="true"])');
    const textPieces: string[] = [];

    const pageTitle = document.title || 'EduEnlighten Page';
    textPieces.push(`Now reading: ${pageTitle.split('|')[0].trim()}.`);

    nodes.forEach((node) => {
      // Skip if inside hidden containers or inside voice assistant itself
      if (node.closest('[data-voice-ignore]') || node.getAttribute('aria-hidden') === 'true') {
        return;
      }
      const txt = (node as HTMLElement).innerText?.trim();
      if (txt && txt.length > 2 && !textPieces.includes(txt)) {
        textPieces.push(txt);
      }
    });

    const fullPageContent = textPieces.slice(0, 35).join('. ');
    speakText(fullPageContent, 'Page Narrator');
  };

  const pauseReading = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlaying && !isPaused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
        playSoundFeedback('click');
      }
    }
  };

  const resumeReading = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        playSoundFeedback('click');
      }
    }
  };

  const stopReading = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTextSnippet('');
      playSoundFeedback('stop');
    }
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    try {
      localStorage.setItem('eduenlighten_speech_rate', newRate.toString());
    } catch {}
    playSoundFeedback('click');

    // If currently speaking, restart with new rate
    if (isPlaying && currentTextSnippet) {
      speakText('Speech rate set to ' + newRate + ' times.', 'Settings');
    }
  };

  const handleVoiceChange = (idx: number) => {
    setSelectedVoiceIndex(idx);
    if (voices[idx]) {
      try {
        localStorage.setItem('eduenlighten_voice_pref', voices[idx].voice.name);
      } catch {}
      speakText('Voice changed to ' + voices[idx].voice.name, 'Voice Preview');
    }
  };

  const toggleSoundFeedback = () => {
    const nextVal = !soundFeedbackEnabled;
    setSoundFeedbackEnabled(nextVal);
    try {
      localStorage.setItem('eduenlighten_sound_feedback', nextVal.toString());
    } catch {}
    if (nextVal) {
      playSoundFeedback('chime');
    }
  };

  const toggleReadSelection = () => {
    const nextVal = !readSelectionEnabled;
    setReadSelectionEnabled(nextVal);
    try {
      localStorage.setItem('eduenlighten_read_selection', nextVal.toString());
    } catch {}
    playSoundFeedback('click');
    if (nextVal) {
      speakText('Highlight any text on the screen to hear it read aloud.', 'Assistive Feature');
    }
  };

  if (!hasSpeechSupport) {
    return null;
  }

  return (
    <div data-voice-ignore="true" className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Pill when minimized */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            playSoundFeedback('click');
          }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
            isPlaying
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/50 shadow-cyan-500/20 animate-pulse'
              : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:text-white hover:border-cyan-400 hover:bg-slate-800'
          }`}
          aria-label="Open Voice and Sound Accessibility Assistant"
          title="Voice & Sound Accessibility (Alt+V)"
        >
          <div className="relative">
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-cyan-400 animate-bounce' : 'text-cyan-400'}`} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <span className="text-xs font-bold tracking-wide">
            {isPlaying ? 'Reading Aloud...' : 'Voice / Sound'}
          </span>
          {isPlaying && (
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-cyan-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
              <span className="w-1 h-4 bg-teal-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-1 h-2 bg-cyan-300 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
            </div>
          )}
        </button>
      )}

      {/* Expanded Accessibility Control Center */}
      {isOpen && (
        <div
          role="region"
          aria-label="Voice and Sound Accessibility Control Center"
          className="w-80 sm:w-96 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-2xl p-4 sm:p-5 text-slate-100 transition-all duration-300 ring-1 ring-cyan-500/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Voice &amp; Sound Assistant
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    A11y
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Accessible Audio &amp; Screen Reader</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showSettings ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Voice & Audio Settings"
                aria-label="Voice & Audio Settings"
              >
                <Settings2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  playSoundFeedback('click');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Minimize (Alt+V)"
                aria-label="Minimize"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Reading Snippet Banner */}
          {isPlaying && currentTextSnippet && (
            <div className="mt-3 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200">
              <div className="flex items-center gap-2 mb-1 text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Currently Speaking</span>
              </div>
              <p className="line-clamp-2 italic text-slate-300">{currentTextSnippet}</p>
            </div>
          )}

          {/* Primary Audio Player Controls */}
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Read Whole Page */}
              <button
                onClick={readCurrentPage}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                aria-label="Read entire page aloud"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Read Page Aloud</span>
              </button>

              {/* Stop / Pause / Resume */}
              {isPlaying ? (
                <div className="flex gap-1.5">
                  {isPaused ? (
                    <button
                      onClick={resumeReading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
                      aria-label="Resume speech"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseReading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
                      aria-label="Pause speech"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                  )}
                  <button
                    onClick={stopReading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs border border-rose-500/40"
                    aria-label="Stop reading"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => speakText('Welcome to EduEnlighten. Our accessible voice narrator is ready to read courses, high school curriculum, vocational tracks, and exam centres for you.', 'Welcome')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-xs border border-slate-700/80 transition-all"
                  aria-label="Listen to voice demo intro"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Voice Intro</span>
                </button>
              )}
            </div>

            {/* Reading Speed Pills */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Reading Speed:</span>
              <div className="flex items-center gap-1">
                {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRateChange(rate)}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                      speechRate === rate
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              {/* Highlight to Read */}
              <div className="flex items-center justify-between text-xs py-1">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-200">Highlight to Read</span>
                  <span className="text-[10px] text-slate-400">Select any text to read aloud automatically</span>
                </div>
                <button
                  onClick={toggleReadSelection}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    readSelectionEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                  aria-pressed={readSelectionEnabled}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      readSelectionEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Sound Feedback Effects */}
              <div className="flex items-center justify-between text-xs py-1">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-200">Interactive Sound Effects</span>
                  <span className="text-[10px] text-slate-400">Harmonic auditory feedback on clicks</span>
                </div>
                <button
                  onClick={toggleSoundFeedback}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    soundFeedbackEnabled ? 'bg-teal-500' : 'bg-slate-800'
                  }`}
                  aria-pressed={soundFeedbackEnabled}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      soundFeedbackEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Advanced Settings Drawer */}
            {showSettings && (
              <div className="pt-3 mt-2 border-t border-slate-800/80 space-y-3 text-xs animate-in fade-in duration-200">
                {/* Voice Selection */}
                {voices.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                      Select Narrator Voice:
                    </label>
                    <select
                      value={selectedVoiceIndex}
                      onChange={(e) => handleVoiceChange(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      {voices.map((v, i) => (
                        <option key={v.voice.name + i} value={i} className="bg-slate-900 text-white">
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Pitch Slider */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Voice Tone / Pitch</span>
                    <span>{speechPitch.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.1"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Shortcuts Info Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                Alt+V
              </kbd>
              <span>Toggle Voice</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                Alt+S
              </kbd>
              <span>Stop Audio</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
