import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Code, 
  Calendar, 
  Video, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  ChevronRight,
  X,
  BookOpen
} from 'lucide-react';
import { DeveloperPersona, DirectMessage, InterviewProblem, InterviewTopic } from '../types';

interface DirectChatViewProps {
  activeUser: DeveloperPersona;
  peers: DeveloperPersona[];
  selectedPeer: DeveloperPersona;
  onSelectPeer: (peer: DeveloperPersona) => void;
  messages: DirectMessage[];
  onSendMessage: (payload: {
    receiverId: string;
    text?: string;
    codeSnippet?: { language: string; code: string };
    interviewInvite?: { topic: string; scheduledTime: string; sessionId?: string };
  }) => void;
  onLaunchMockRoom: (peer: DeveloperPersona, problemId?: string) => void;
  problems: InterviewProblem[];
}

export const DirectChatView: React.FC<DirectChatViewProps> = ({
  activeUser,
  peers,
  selectedPeer,
  onSelectPeer,
  messages,
  onSendMessage,
  onLaunchMockRoom,
  problems,
}) => {
  const [inputText, setInputText] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [codeInput, setCodeInput] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTopic, setScheduleTopic] = useState<InterviewTopic>('System Design');
  const [scheduleTime, setScheduleTime] = useState('Today at 4:30 PM');
  const [selectedProblemId, setSelectedProblemId] = useState(problems[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage({
      receiverId: selectedPeer.id,
      text: inputText.trim(),
    });
    setInputText('');
  };

  const handleSendCode = () => {
    if (!codeInput.trim()) return;
    onSendMessage({
      receiverId: selectedPeer.id,
      text: `Shared a ${codeLanguage} snippet:`,
      codeSnippet: {
        language: codeLanguage,
        code: codeInput.trim(),
      },
    });
    setCodeInput('');
    setShowCodeModal(false);
  };

  const handleScheduleMock = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage({
      receiverId: selectedPeer.id,
      text: `📅 Scheduled a mock interview session for ${scheduleTime}!`,
      interviewInvite: {
        topic: scheduleTopic,
        scheduledTime: scheduleTime,
        sessionId: `session_${Date.now()}`,
      },
    });
    setShowScheduleModal(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const QUICK_PROMPTS = [
    'Hey! Want to do a 45-min System Design mock today?',
    'Ready to practice an algorithmic live coding round?',
    'Can we swap feedback on Amazon STAR behavioral stories?',
    'I have an interview with Meta coming up, want to practice?',
  ];

  return (
    <div className="h-[calc(100vh-140px)] min-h-[550px] bg-slate-900 border border-slate-800 rounded-2xl flex overflow-hidden shadow-2xl">
      {/* Left Pane: Peers list */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/90 shrink-0">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Connected Peers ({peers.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a developer to start chat or mock interview
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
          {peers.map((peer) => {
            const isSelected = peer.id === selectedPeer.id;
            return (
              <button
                key={peer.id}
                onClick={() => onSelectPeer(peer)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm'
                    : 'hover:bg-slate-800/70 text-slate-300'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                      peer.availabilityStatus === 'ready_now'
                        ? 'bg-emerald-500'
                        : peer.availabilityStatus === 'available_today'
                        ? 'bg-amber-500'
                        : 'bg-slate-500'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white truncate">{peer.name}</span>
                    <span className="text-[10px] text-slate-400">{peer.role}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    Target: {peer.targetCompanies.slice(0, 2).join(', ')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Active Conversation */}
      <div className="flex-1 flex flex-col bg-slate-950/70">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={selectedPeer.avatar}
              alt={selectedPeer.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500/40"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">{selectedPeer.name}</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                  {selectedPeer.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Targeting {selectedPeer.targetCompanies.join(', ')} • {selectedPeer.timezone}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Schedule Mock</span>
            </button>
            <button
              onClick={() => onLaunchMockRoom(selectedPeer)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Launch Mock Room</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Sparkles className="h-10 w-10 mx-auto text-indigo-400/80 mb-2" />
              <p className="text-sm font-semibold text-white">Start your interview prep discussion</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Discuss target companies, schedule a live mock session, or share code snippets to review together.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === activeUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-xl rounded-2xl p-4 space-y-2 ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/80'
                    }`}
                  >
                    {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                    {/* Code Snippet Card */}
                    {msg.codeSnippet && (
                      <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 mt-2 overflow-hidden font-mono text-xs">
                        <div className="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-slate-800">
                          <span className="uppercase text-[10px] font-bold text-indigo-400">
                            {msg.codeSnippet.language} Snippet
                          </span>
                          <button
                            onClick={() => copyToClipboard(msg.codeSnippet!.code, msg.id)}
                            className="flex items-center space-x-1 text-slate-400 hover:text-white text-[11px]"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="overflow-x-auto text-slate-200">
                          <code>{msg.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Mock Interview Invite Card */}
                    {msg.interviewInvite && (
                      <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-3.5 mt-2 space-y-2.5 text-slate-200 shadow-md">
                        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          <Video className="h-4 w-4" />
                          <span>Mock Interview Invitation</span>
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-white">
                            {msg.interviewInvite.topic}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{msg.interviewInvite.scheduledTime} (45 mins)</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onLaunchMockRoom(selectedPeer)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>Enter Mock Room Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider whitespace-nowrap">
            Quick Prompts:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage({ receiverId: selectedPeer.id, text: prompt })}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs whitespace-nowrap transition-colors border border-slate-700/60 shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSendText} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowCodeModal(true)}
            title="Attach Code Snippet"
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            title="Schedule Mock Interview"
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
          >
            <Calendar className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${selectedPeer.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Code Snippet Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code className="h-4 w-4 text-indigo-400" />
                <span>Share Code Snippet in Chat</span>
              </h3>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Language
              </label>
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="java">Java</option>
                <option value="rust">Rust</option>
                <option value="sql">SQL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Code
              </label>
              <textarea
                rows={8}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="// Paste code here..."
                className="w-full p-3 bg-slate-950 font-mono text-xs border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCode}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                Send Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Mock Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form onSubmit={handleScheduleMock} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span>Schedule Mock Session with {selectedPeer.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Interview Topic
              </label>
              <select
                value={scheduleTopic}
                onChange={(e) => setScheduleTopic(e.target.value as InterviewTopic)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="System Design">System Design</option>
                <option value="Frontend Live Coding">Frontend Live Coding</option>
                <option value="Behavioral (STAR Method)">Behavioral (STAR Method)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Curated Problem to Practice
              </label>
              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              >
                {problems.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.difficulty} • {p.topic})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Proposed Date & Time
              </label>
              <input
                type="text"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                placeholder="e.g. Today at 4:00 PM (45m)"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
