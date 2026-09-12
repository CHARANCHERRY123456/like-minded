import React from 'react';
import { 
  Users, 
  MessageSquare, 
  Layers, 
  Video, 
  RotateCcw, 
  Sparkles, 
  UserPlus, 
  Check, 
  ChevronDown,
  Code2
} from 'lucide-react';
import { DeveloperPersona, AvailabilityStatus } from '../types';

interface NavbarProps {
  activeTab: 'matches' | 'chat' | 'groups' | 'mock_room';
  setActiveTab: (tab: 'matches' | 'chat' | 'groups' | 'mock_room') => void;
  users: DeveloperPersona[];
  activeUser: DeveloperPersona;
  onSwitchUser: (userId: string) => void;
  onOpenRegisterModal: () => void;
  onResetData: () => void;
  onStatusChange: (status: AvailabilityStatus) => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  users,
  activeUser,
  onSwitchUser,
  onOpenRegisterModal,
  onResetData,
  onStatusChange,
  unreadCount = 0,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case 'ready_now': return 'bg-emerald-500';
      case 'available_today': return 'bg-amber-500';
      case 'weekend': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = (status: AvailabilityStatus) => {
    switch (status) {
      case 'ready_now': return 'Ready to Mock Now';
      case 'available_today': return 'Available Today';
      case 'weekend': return 'Available Weekends';
      default: return 'Offline';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('matches')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  PeerPrep
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Tech Match & Mock
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Developer Interview Matcher & Real-Time Practice Hub
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'matches'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Find Peers</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'chat'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>1:1 Chat</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-500 text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('groups')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'groups'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Study Circles</span>
              <span className="sm:hidden">Groups</span>
            </button>

            <button
              onClick={() => setActiveTab('mock_room')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'mock_room'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
              }`}
            >
              <Video className="h-4 w-4 text-emerald-400" />
              <span className="font-bold">Mock Room</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>
          </nav>

          {/* Right Action: Persona Switcher & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Reset Seed Data */}
            <button
              onClick={onResetData}
              title="Reset to Initial Seed Data"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Persona Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2.5 p-1.5 sm:px-3 sm:py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all"
              >
                <div className="relative">
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-600"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${getStatusColor(
                      activeUser.availabilityStatus
                    )}`}
                  />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                    <span>{activeUser.name}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {activeUser.role} • {activeUser.targetCompanies[0]}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-3 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Current Persona
                    </p>
                    <p className="text-sm font-bold text-white mt-0.5">{activeUser.name}</p>
                    <p className="text-xs text-indigo-400 font-medium">{activeUser.headline}</p>

                    {/* Status Picker */}
                    <div className="mt-3">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        My Availability Status
                      </label>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {(['ready_now', 'available_today', 'weekend', 'offline'] as AvailabilityStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              onStatusChange(status);
                              setShowUserMenu(false);
                            }}
                            className={`flex items-center space-x-1.5 px-2 py-1 rounded text-xs transition-colors ${
                              activeUser.availabilityStatus === status
                                ? 'bg-indigo-600/30 text-indigo-300 font-medium'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                            <span className="truncate">{getStatusLabel(status).replace('Available ', '')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Switch to Another Persona */}
                  <div className="px-3 py-2 max-h-56 overflow-y-auto">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Switch Active Persona (Instant Test)
                    </p>
                    <div className="space-y-1">
                      {users.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            onSwitchUser(user.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors ${
                            user.id === activeUser.id
                              ? 'bg-indigo-600/20 text-indigo-300'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                              <p className="text-[10px] text-slate-400">{user.role} • {user.targetCompanies.slice(0, 2).join(', ')}</p>
                            </div>
                          </div>
                          {user.id === activeUser.id && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Register New Persona */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenRegisterModal();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Register Custom Persona</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
