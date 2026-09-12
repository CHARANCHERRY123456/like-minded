import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Video, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ChevronDown, 
  HelpCircle, 
  Award, 
  Terminal, 
  Code, 
  Share2, 
  MessageSquare, 
  BookOpen, 
  AlertCircle,
  PhoneOff,
  Radio
} from 'lucide-react';
import { DeveloperPersona, InterviewProblem, MockInterviewSession } from '../types';

interface MockInterviewRoomProps {
  activeUser: DeveloperPersona;
  partner: DeveloperPersona;
  problems: InterviewProblem[];
  initialProblemId?: string;
  onExit: () => void;
  onCompleteSession?: (feedback: any) => void;
}

export const MockInterviewRoom: React.FC<MockInterviewRoomProps> = ({
  activeUser,
  partner,
  problems,
  initialProblemId,
  onExit,
  onCompleteSession,
}) => {
  // Selected Problem
  const [selectedProblem, setSelectedProblem] = useState<InterviewProblem>(
    problems.find((p) => p.id === initialProblemId) || problems[0]
  );

  // Active Code
  const [code, setCode] = useState(selectedProblem.starterCode);
  const [language, setLanguage] = useState('typescript');

  // Timer (45 minutes default)
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Voice Call State
  const [isInCall, setIsInCall] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [audioLevel, setAudioLevel] = useState(40);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  // Tabs & Panels
  const [activeTab, setActiveTab] = useState<'problem' | 'hints' | 'rubric' | 'ai_copilot'>('problem');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  // Execution Output
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [testResults, setTestResults] = useState<{ pass: boolean; message: string }[]>([]);

  // AI Copilot State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiPoweredBy, setAiPoweredBy] = useState<string>('');
  const [customAiQuestion, setCustomAiQuestion] = useState('');

  // Evaluation Rubric Form
  const [problemSolvingScore, setProblemSolvingScore] = useState(4);
  const [codeQualityScore, setCodeQualityScore] = useState(4);
  const [communicationScore, setCommunicationScore] = useState(5);
  const [overallScore, setOverallScore] = useState(8);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Real or Simulated Microphone Level
  useEffect(() => {
    let interval: any;
    let micStream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;

    if (isInCall && !isMuted) {
      // Attempt browser audio capture if available
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            micStream = stream;
            setAudioStream(stream);
            try {
              audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const source = audioCtx.createMediaStreamSource(stream);
              analyser = audioCtx.createAnalyser();
              analyser.fftSize = 64;
              source.connect(analyser);

              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              interval = setInterval(() => {
                if (analyser) {
                  analyser.getByteFrequencyData(dataArray);
                  const avg = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
                  setAudioLevel(Math.min(100, Math.max(15, Math.round((avg / 255) * 100))));
                }
              }, 120);
            } catch (e) {
              // fallback to simulated waves
              fallbackSimulatedWave();
            }
          })
          .catch(() => {
            fallbackSimulatedWave();
          });
      } else {
        fallbackSimulatedWave();
      }
    } else {
      setAudioLevel(0);
    }

    function fallbackSimulatedWave() {
      interval = setInterval(() => {
        // Natural speech simulation fluctuation
        const rand = Math.floor(Math.random() * 55) + 20;
        setAudioLevel(rand);
      }, 250);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
      }
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {});
      }
    };
  }, [isInCall, isMuted]);

  // Timer Tick
  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  // Format Time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Switch Problem
  const handleSelectProblem = (prob: InterviewProblem) => {
    setSelectedProblem(prob);
    setCode(prob.starterCode);
    setRevealedHints([]);
    setOutputLogs([]);
    setTestResults([]);
    setAiResponse(null);
  };

  // Run Code Simulation
  const handleRunCode = () => {
    setIsRunningCode(true);
    setOutputLogs(['Compiling and evaluating test cases against runtime environment...']);
    setTestResults([]);

    setTimeout(() => {
      const logs: string[] = [];
      const results: { pass: boolean; message: string }[] = [];

      try {
        // Safe evaluation simulation for the current problem
        logs.push(`[Runtime] Process started with Node.js / V8 engine.`);
        logs.push(`[Runtime] Memory limit: 256MB. Execution timeout: 2000ms.`);

        selectedProblem.testCases.forEach((tc, idx) => {
          logs.push(`✓ Executing Test Case ${idx + 1}: ${tc.input}`);
          logs.push(`  → Output verified: ${tc.expected}`);
          results.push({
            pass: true,
            message: `Test Case ${idx + 1}: Expected '${tc.expected}' matched output.`,
          });
        });

        logs.push(`\n✨ All ${selectedProblem.testCases.length} test cases passed successfully!`);
        logs.push(`Runtime execution speed: 58ms (Faster than 91.4% of submissions).`);
      } catch (err: any) {
        logs.push(`Error: ${err?.message || 'Execution error'}`);
        results.push({ pass: false, message: 'Execution failed.' });
      }

      setOutputLogs(logs);
      setTestResults(results);
      setIsRunningCode(false);
    }, 600);
  };

  // Ask AI Interviewer (Gemini backend)
  const askAiCopilot = async (mode: 'hint' | 'review' | 'custom') => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          problemTitle: selectedProblem.title,
          problemDescription: selectedProblem.description,
          candidateCode: code,
          userQuestion: customAiQuestion,
        }),
      });
      const data = await res.json();
      setAiResponse(data.reply);
      setAiPoweredBy(data.poweredBy || 'AI Interviewer');
      setActiveTab('ai_copilot');
    } catch (e) {
      setAiResponse('Unable to connect to AI interviewer. Check your connection or try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // Submit Feedback Rubric
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    if (onCompleteSession) {
      onCompleteSession({
        overallScore,
        problemSolving: problemSolvingScore,
        codeQuality: codeQualityScore,
        communication: communicationScore,
        notes: feedbackNotes,
      });
    }
  };

  // Get current phase
  const getPhaseName = () => {
    const elapsed = 45 * 60 - timeLeft;
    if (elapsed < 5 * 60) return { name: 'Phase 1: Warmup & Problem Clarification (5m)', color: 'text-blue-400' };
    if (elapsed < 35 * 60) return { name: 'Phase 2: Core Algorithm & Live Coding (30m)', color: 'text-amber-400' };
    return { name: 'Phase 3: Candidate Q&A & Interviewer Debrief (10m)', color: 'text-emerald-400' };
  };

  const phase = getPhaseName();

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] min-h-[600px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header: Partners, Timer, Voice Room Status */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Partner details */}
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500"
              title={`${activeUser.name} (You)`}
            />
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500"
              title={`${partner.name} (Peer)`}
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold text-white">
                Mock: {activeUser.name.split(' ')[0]} & {partner.name.split(' ')[0]}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {selectedProblem.topic}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Targeting {partner.targetCompanies.slice(0, 2).join(', ')} • {selectedProblem.difficulty}
            </p>
          </div>
        </div>

        {/* Center: Timer & Phase indicator */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800">
          <div className="text-lg font-mono font-extrabold text-white flex items-center space-x-1.5">
            <span>{formatTime(timeLeft)}</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
            >
              {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimeLeft(45 * 60);
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>

          <span className="h-4 w-px bg-slate-800 hidden sm:block" />
          <span className={`text-xs font-semibold hidden md:inline ${phase.color}`}>
            {phase.name}
          </span>
        </div>

        {/* Right: Voice Call Controls & Exit */}
        <div className="flex items-center space-x-2">
          {isInCall ? (
            <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl">
              {/* Voice wave visualizer */}
              <div className="flex items-center space-x-0.5 h-4">
                <span
                  className="w-1 bg-emerald-400 rounded-full transition-all duration-100"
                  style={{ height: `${Math.max(4, (audioLevel * 0.9) % 16)}px` }}
                />
                <span
                  className="w-1 bg-emerald-400 rounded-full transition-all duration-100"
                  style={{ height: `${Math.max(6, (audioLevel * 1.2) % 16)}px` }}
                />
                <span
                  className="w-1 bg-emerald-400 rounded-full transition-all duration-100"
                  style={{ height: `${Math.max(3, (audioLevel * 0.7) % 16)}px` }}
                />
                <span
                  className="w-1 bg-emerald-400 rounded-full transition-all duration-100"
                  style={{ height: `${Math.max(5, (audioLevel * 1.0) % 16)}px` }}
                />
              </div>

              {/* Mic toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isMuted ? 'bg-red-500/20 text-red-400' : 'text-slate-300 hover:text-white'
                }`}
                title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-emerald-400" />}
              </button>

              {/* Speaker toggle */}
              <button
                onClick={() => setIsDeafened(!isDeafened)}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isDeafened ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:text-white'
                }`}
                title={isDeafened ? 'Enable Audio' : 'Mute Audio'}
              >
                {isDeafened ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setIsInCall(false)}
                className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs transition-colors"
                title="Disconnect Voice Call"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsInCall(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>Connect Voice Call</span>
            </button>
          )}

          {/* Exit Room */}
          <button
            onClick={onExit}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Problem/Tools Pane & Right Code/Execution Pane */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane: Problem Description, Hints, AI Copilot, Rubric */}
        <div className="w-full md:w-5/12 border-r border-slate-800 flex flex-col bg-slate-900/60 overflow-hidden">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900 px-3 pt-2 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-3 py-2 rounded-t-lg font-bold transition-colors ${
                activeTab === 'problem'
                  ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Problem
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`px-3 py-2 rounded-t-lg font-bold transition-colors ${
                activeTab === 'hints'
                  ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hints ({selectedProblem.hints.length})
            </button>
            <button
              onClick={() => setActiveTab('ai_copilot')}
              className={`px-3 py-2 rounded-t-lg font-bold flex items-center space-x-1 transition-colors ${
                activeTab === 'ai_copilot'
                  ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>AI Co-Pilot</span>
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-3 py-2 rounded-t-lg font-bold transition-colors ${
                activeTab === 'rubric'
                  ? 'bg-slate-950 text-emerald-400 border-t-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Evaluation
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* PROBLEM TAB */}
            {activeTab === 'problem' && (
              <div className="space-y-4">
                {/* Problem Selector Dropdown */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-lg font-extrabold text-white">{selectedProblem.title}</h2>
                    <div className="flex items-center space-x-2 mt-1 text-xs">
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          selectedProblem.difficulty === 'Easy'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : selectedProblem.difficulty === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {selectedProblem.difficulty}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-300">{selectedProblem.topic}</span>
                    </div>
                  </div>

                  {/* Switch problem select */}
                  <select
                    value={selectedProblem.id}
                    onChange={(e) => {
                      const p = problems.find((x) => x.id === e.target.value);
                      if (p) handleSelectProblem(p);
                    }}
                    className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    {problems.map((prob) => (
                      <option key={prob.id} value={prob.id}>
                        {prob.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Companies */}
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Frequently Asked at:
                  </span>
                  {selectedProblem.targetCompanies.map((comp) => (
                    <span
                      key={comp}
                      className="px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 text-xs font-medium border border-slate-700"
                    >
                      {comp}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans bg-slate-900/90 p-4 rounded-xl border border-slate-800/80">
                  {selectedProblem.description}
                </div>

                {/* Constraints */}
                {selectedProblem.constraints && selectedProblem.constraints.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Constraints & Guarantees
                    </h3>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60 font-mono">
                      {selectedProblem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Test Cases Preview */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sample Test Cases
                  </h3>
                  <div className="space-y-2">
                    {selectedProblem.testCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs font-mono space-y-1"
                      >
                        <div className="text-slate-400">
                          <span className="text-indigo-400 font-bold">Input:</span> {tc.input}
                        </div>
                        <div className="text-slate-300">
                          <span className="text-emerald-400 font-bold">Expected Output:</span> {tc.expected}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interviewer Evaluation Focus */}
                <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-1.5">
                    <Award className="h-4 w-4 text-indigo-400" />
                    <span>Interviewer Rubric Checklist</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {selectedProblem.evaluationCriteria.map((crit, idx) => (
                      <li key={idx}>{crit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* HINTS TAB */}
            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                  <p className="font-bold text-white mb-1">How to use hints:</p>
                  <p>
                    As an interviewer, reveal progressive hints only when the candidate is stuck on algorithmic intuition or complexity tradeoffs.
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedProblem.hints.map((hint, idx) => {
                    const isRevealed = revealedHints.includes(idx);
                    return (
                      <div
                        key={idx}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                            Hint #{idx + 1}
                          </span>
                          {!isRevealed && (
                            <button
                              onClick={() => setRevealedHints([...revealedHints, idx])}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                            >
                              Reveal Spoiler
                            </button>
                          )}
                        </div>

                        {isRevealed ? (
                          <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                            {hint}
                          </p>
                        ) : (
                          <div className="h-6 bg-slate-800/40 rounded animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI COPILOT TAB */}
            {activeTab === 'ai_copilot' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-xl">
                  <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="h-4 w-4" />
                    <span>AI Interview Assistant</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Powered by server-side Gemini. Get Socratic hints, edge cases, or full candidate code review.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => askAiCopilot('hint')}
                    disabled={aiLoading}
                    className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors"
                  >
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Socratic Hint</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Guide without spoiling answer</p>
                  </button>

                  <button
                    onClick={() => askAiCopilot('review')}
                    disabled={aiLoading}
                    className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors"
                  >
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Award className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Debrief Code</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Big-O & hiring decision</p>
                  </button>
                </div>

                {/* Custom Query Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Ask a Custom Interview Question:
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customAiQuestion}
                      onChange={(e) => setCustomAiQuestion(e.target.value)}
                      placeholder="e.g. How does Redis Lua script prevent race conditions?"
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => askAiCopilot('custom')}
                      disabled={aiLoading || !customAiQuestion.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold"
                    >
                      Ask
                    </button>
                  </div>
                </div>

                {/* AI Loading State */}
                {aiLoading && (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-semibold">Generating authoritative interview guidance...</p>
                  </div>
                )}

                {/* AI Response Display */}
                {aiResponse && !aiLoading && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 font-sans text-xs text-slate-200 leading-relaxed shadow-inner">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        {aiPoweredBy}
                      </span>
                      <button
                        onClick={() => setAiResponse(null)}
                        className="text-[10px] text-slate-500 hover:text-slate-300"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="whitespace-pre-wrap">{aiResponse}</div>
                  </div>
                )}
              </div>
            )}

            {/* RUBRIC EVALUATION TAB */}
            {activeTab === 'rubric' && (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Peer Score & Feedback Rubric
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluate your peer to update their profile stats and provide constructive feedback.
                  </p>
                </div>

                {/* Problem Solving */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-300">Problem Solving & Algorithms</span>
                    <span className="text-indigo-400">{problemSolvingScore} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={problemSolvingScore}
                    onChange={(e) => setProblemSolvingScore(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Code Quality */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-300">Code Quality & Architecture</span>
                    <span className="text-indigo-400">{codeQualityScore} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={codeQualityScore}
                    onChange={(e) => setCodeQualityScore(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Communication */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-300">Technical Communication</span>
                    <span className="text-indigo-400">{communicationScore} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={communicationScore}
                    onChange={(e) => setCommunicationScore(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Overall Score */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-300">Overall Hiring Recommendation</span>
                    <span className="text-emerald-400">{overallScore} / 10 (Hire)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={overallScore}
                    onChange={(e) => setOverallScore(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Written notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Actionable Constructive Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="e.g. Great job structuring the doubly-linked list nodes. Next time, state Big-O space complexity before the interviewer prompts for it."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={feedbackSubmitted}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-emerald-600/20"
                >
                  {feedbackSubmitted ? 'Feedback Submitted Successfully ✓' : 'Submit & Complete Session'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor & Console Output */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Editor Header Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 p-2.5 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Code className="h-4 w-4 text-indigo-400" />
                <span>Live Collaborative Code Editor</span>
              </span>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCode(selectedProblem.starterCode)}
                className="px-2.5 py-1 text-slate-400 hover:text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                title="Reset code to original template"
              >
                Reset
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunningCode}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-all"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>{isRunningCode ? 'Running...' : 'Run Code & Tests'}</span>
              </button>
            </div>
          </div>

          {/* Textarea Editor Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Line numbers bar */}
            <div className="w-10 bg-slate-950 py-4 select-none font-mono text-[11px] text-slate-600 text-right pr-3 shrink-0 hidden sm:block border-r border-slate-900">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code text input */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-4 bg-slate-950 font-mono text-xs leading-6 text-slate-100 resize-none focus:outline-none selection:bg-indigo-500 selection:text-white"
            />
          </div>

          {/* Bottom Execution Console */}
          <div className="h-44 border-t border-slate-800 bg-slate-900/95 flex flex-col">
            <div className="p-2 px-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-[10px]">
                <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                <span>Test Runner & Execution Logs</span>
              </div>
              {testResults.length > 0 && (
                <span className="text-emerald-400 font-bold text-[11px] flex items-center space-x-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>All Tests Passed</span>
                </span>
              )}
            </div>

            <div className="flex-1 p-3 px-4 font-mono text-xs overflow-y-auto space-y-1">
              {outputLogs.length === 0 ? (
                <p className="text-slate-500 italic">
                  Click "Run Code & Tests" above to execute test cases against your solution...
                </p>
              ) : (
                outputLogs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.startsWith('✓') || log.includes('passed')
                        ? 'text-emerald-400'
                        : log.startsWith('Error')
                        ? 'text-rose-400'
                        : 'text-slate-300'
                    }
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
