import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  MessageSquare, 
  UserCheck, 
  UserPlus, 
  Star, 
  Video, 
  Building2, 
  Clock, 
  Check, 
  X,
  Target,
  Code
} from 'lucide-react';
import { DeveloperPersona, RoleCategory, InterviewTopic, AvailabilityStatus } from '../types';

interface ScoredPeer {
  peer: DeveloperPersona;
  matchScore: number;
  sharedCompanies: string[];
  sharedTopics: string[];
  connectionStatus: 'none' | 'pending' | 'accepted' | 'declined';
  connectionId?: string;
  isIncomingRequest?: boolean;
}

interface MatchExplorerProps {
  scoredPeers: ScoredPeer[];
  activeUser: DeveloperPersona;
  onConnect: (targetUserId: string) => void;
  onRespondConnection: (connectionId: string, status: 'accepted' | 'declined') => void;
  onOpenChat: (peer: DeveloperPersona) => void;
  onStartInstantMock: (peer: DeveloperPersona) => void;
  onOpenRegisterModal: () => void;
}

export const MatchExplorer: React.FC<MatchExplorerProps> = ({
  scoredPeers,
  activeUser,
  onConnect,
  onRespondConnection,
  onOpenChat,
  onStartInstantMock,
  onOpenRegisterModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [readyOnly, setReadyOnly] = useState(false);

  // Filter peers
  const filtered = scoredPeers.filter(({ peer }) => {
    if (readyOnly && peer.availabilityStatus !== 'ready_now') return false;
    if (selectedRole !== 'All' && peer.role !== selectedRole) return false;
    if (selectedTopic !== 'All' && !peer.targetTopics.some(t => t.includes(selectedTopic))) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = peer.name.toLowerCase().includes(q);
      const matchCompany = peer.targetCompanies.some(c => c.toLowerCase().includes(q));
      const matchTech = peer.techStack.some(t => t.toLowerCase().includes(q));
      const matchHeadline = peer.headline.toLowerCase().includes(q);
      const matchRole = peer.role.toLowerCase().includes(q);
      if (!matchName && !matchCompany && !matchTech && !matchHeadline && !matchRole) return false;
    }

    return true;
  });

  // Top suggested peer for Quick Match banner
  const topMatch = scoredPeers.find(p => p.peer.availabilityStatus === 'ready_now') || scoredPeers[0];

  // Incoming requests
  const incomingRequests = scoredPeers.filter(p => p.isIncomingRequest);

  const getStatusBadge = (status: AvailabilityStatus) => {
    switch (status) {
      case 'ready_now':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
            Ready for Mock Now
          </span>
        );
      case 'available_today':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
            Available Today
          </span>
        );
      case 'weekend':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Available Weekends
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700 text-slate-400">
            Offline
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Instant Match Radar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Smart Tech Interview Matchmaker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Connect with Developers Preparing for Interviews
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Match with peers by target companies (Meta, Google, Stripe, etc.), shared topics, and schedule or launch 1-on-1 live mock interviews with voice calling.
            </p>
          </div>

          {/* Quick Match Action */}
          {topMatch && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 flex items-center space-x-3.5 shrink-0 shadow-lg">
              <div className="relative">
                <img
                  src={topMatch.peer.avatar}
                  alt={topMatch.peer.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500"
                />
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-500 text-white">
                  {topMatch.matchScore}%
                </span>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Instant Peer Suggestion</div>
                <div className="text-sm font-bold text-white">{topMatch.peer.name}</div>
                <div className="text-[11px] text-indigo-300 font-semibold truncate max-w-[140px]">
                  Targeting {topMatch.peer.targetCompanies.slice(0, 2).join(', ')}
                </div>
              </div>
              <button
                onClick={() => onStartInstantMock(topMatch.peer)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-colors"
              >
                <Video className="h-3.5 w-3.5" />
                <span>Instant Mock</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Incoming Connection Requests Banner */}
      {incomingRequests.length > 0 && (
        <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-1.5">
              <UserPlus className="h-4 w-4 text-indigo-400" />
              <span>Pending Connection Requests ({incomingRequests.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Accept to unlock direct chats & instant mock rooms</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {incomingRequests.map(({ peer, connectionId, matchScore }) => (
              <div
                key={peer.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img src={peer.avatar} alt={peer.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold text-white">{peer.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                        {matchScore}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{peer.headline}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => connectionId && onRespondConnection(connectionId, 'accepted')}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                    title="Accept Connection"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => connectionId && onRespondConnection(connectionId, 'declined')}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs transition-colors"
                    title="Decline"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company (Meta, Stripe...), tech stack (React, Go...), or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick toggle: Ready Now */}
          <button
            onClick={() => setReadyOnly(!readyOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              readyOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready to Mock Now Only</span>
          </button>
        </div>

        {/* Filters pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mr-1">
            Role:
          </span>
          {['All', 'Frontend', 'Backend', 'Fullstack', 'DevOps / Cloud', 'ML & AI'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedRole === role
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {role}
            </button>
          ))}

          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider ml-3 mr-1">
            Topic:
          </span>
          {['All', 'Algorithms', 'System Design', 'Frontend', 'Behavioral'].map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedTopic === topic
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Developers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(({ peer, matchScore, sharedCompanies, sharedTopics, connectionStatus }) => {
          return (
            <div
              key={peer.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 group"
            >
              <div>
                {/* Card Header: Avatar & Match Meter */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-700 group-hover:ring-indigo-500/60 transition-all"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight group-hover:text-indigo-300 transition-colors">
                        {peer.name}
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                        <span>{peer.role}</span>
                        <span>•</span>
                        <span>{peer.level.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-amber-400 font-medium">
                        <span className="flex items-center">
                          <Star className="h-3 w-3 fill-amber-400 mr-0.5" />
                          {peer.rating}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{peer.completedMocks} mocks taken</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="text-right">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-extrabold">
                      {matchScore}% Match
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3">
                  {getStatusBadge(peer.availabilityStatus)}
                </div>

                {/* Headline & Bio */}
                <p className="mt-2.5 text-xs text-slate-300 font-medium line-clamp-2">
                  {peer.headline}
                </p>

                {/* Shared Synergies Pill Breakdown */}
                <div className="mt-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <Target className="h-3 w-3 text-indigo-400" />
                    <span>Target Companies</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {peer.targetCompanies.map((c) => {
                      const isShared = activeUser.targetCompanies.includes(c);
                      return (
                        <span
                          key={c}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isShared
                              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                              : 'bg-slate-700/60 text-slate-300'
                          }`}
                        >
                          {c} {isShared && '★'}
                        </span>
                      );
                    })}
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1 pt-1">
                    <Code className="h-3 w-3 text-blue-400" />
                    <span>Focus Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {peer.targetTopics.map((t) => {
                      const isShared = activeUser.targetTopics.includes(t);
                      return (
                        <span
                          key={t}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            isShared
                              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                              : 'bg-slate-700/60 text-slate-300'
                          }`}
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {peer.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                  {peer.techStack.length > 4 && (
                    <span className="px-1.5 py-0.5 text-slate-500 text-[10px]">
                      +{peer.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center space-x-2">
                {connectionStatus === 'accepted' ? (
                  <>
                    <button
                      onClick={() => onOpenChat(peer)}
                      className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chat 1:1</span>
                    </button>
                    <button
                      onClick={() => onStartInstantMock(peer)}
                      className="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors"
                      title="Start Live Mock Interview Room"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Mock</span>
                    </button>
                  </>
                ) : connectionStatus === 'pending' ? (
                  <button
                    disabled
                    className="w-full py-2 px-3 bg-slate-800 text-slate-400 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-not-allowed border border-slate-700"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Connection Pending...</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onConnect(peer.id)}
                      className="flex-1 py-2 px-3 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 border border-slate-700 hover:border-indigo-500 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Connect</span>
                    </button>
                    <button
                      onClick={() => {
                        onConnect(peer.id);
                        onOpenChat(peer);
                      }}
                      className="py-2 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-colors"
                      title="Connect and Open Chat"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No developers match this filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try clearing the role or topic filter, or search for other technologies like React, Go, or Python.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRole('All');
              setSelectedTopic('All');
              setReadyOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
