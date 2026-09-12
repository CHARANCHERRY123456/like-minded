import React, { useState } from 'react';
import { 
  Users, 
  Send, 
  Code, 
  Sparkles, 
  Plus, 
  Hash, 
  Layers, 
  Pin, 
  Video, 
  Smile, 
  Check, 
  Copy,
  X,
  MessageSquare
} from 'lucide-react';
import { DeveloperPersona, StudyGroup, GroupMessage } from '../types';

interface StudyGroupsViewProps {
  groups: StudyGroup[];
  selectedGroup: StudyGroup;
  onSelectGroup: (group: StudyGroup) => void;
  messages: GroupMessage[];
  onSendMessage: (groupId: string, text: string, codeSnippet?: { language: string; code: string }) => void;
  onCreateGroup: (name: string, description: string, topic: string, tags: string[]) => void;
  onJoinGroup: (groupId: string) => void;
  activeUser: DeveloperPersona;
  allUsers: DeveloperPersona[];
  onDirectChatWithMember: (member: DeveloperPersona) => void;
  onLaunchMockRoom: (peer: DeveloperPersona) => void;
}

export const StudyGroupsView: React.FC<StudyGroupsViewProps> = ({
  groups,
  selectedGroup,
  onSelectGroup,
  messages,
  onSendMessage,
  onCreateGroup,
  onJoinGroup,
  activeUser,
  allUsers,
  onDirectChatWithMember,
  onLaunchMockRoom,
}) => {
  const [inputText, setInputText] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [codeInput, setCodeInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupTopic, setNewGroupTopic] = useState('Data Structures & Algorithms');
  const [newGroupTags, setNewGroupTags] = useState('LeetCode, Algorithms, Interviews');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reactionsMap, setReactionsMap] = useState<Record<string, Record<string, number>>>({});

  const isMember = selectedGroup.memberIds.includes(activeUser.id);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(selectedGroup.id, inputText.trim());
    setInputText('');
  };

  const handleSendCode = () => {
    if (!codeInput.trim()) return;
    onSendMessage(selectedGroup.id, `Shared a snippet in #${selectedGroup.name}:`, {
      language: codeLanguage,
      code: codeInput.trim(),
    });
    setCodeInput('');
    setShowCodeModal(false);
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const tags = newGroupTags.split(',').map((t) => t.trim()).filter(Boolean);
    onCreateGroup(newGroupName.trim(), newGroupDesc.trim(), newGroupTopic, tags);
    setNewGroupName('');
    setNewGroupDesc('');
    setShowCreateModal(false);
  };

  const handleReaction = (msgId: string, emoji: string) => {
    setReactionsMap((prev) => {
      const msgReactions = { ...(prev[msgId] || {}) };
      msgReactions[emoji] = (msgReactions[emoji] || 0) + 1;
      return { ...prev, [msgId]: msgReactions };
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Group members from allUsers
  const groupMembers = allUsers.filter((u) => selectedGroup.memberIds.includes(u.id));

  return (
    <div className="h-[calc(100vh-140px)] min-h-[550px] bg-slate-900 border border-slate-800 rounded-2xl flex overflow-hidden shadow-2xl">
      {/* Left Pane: Channels list */}
      <div className="w-72 border-r border-slate-800 flex flex-col bg-slate-900/90 shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Study Circles
            </h2>
            <p className="text-xs text-slate-400">Tech Prep Communities</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            title="Create Study Circle"
            className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {groups.map((group) => {
            const isSelected = group.id === selectedGroup.id;
            return (
              <button
                key={group.id}
                onClick={() => onSelectGroup(group)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'hover:bg-slate-800/70 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
                    <Hash className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{group.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{group.topic}</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-1.5 py-0.5 rounded-full shrink-0">
                  {group.memberCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center: Group Chat Stream */}
      <div className="flex-1 flex flex-col bg-slate-950/70 min-w-0">
        {/* Channel Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">{selectedGroup.name}</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedGroup.topic}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-lg mt-0.5">
                {selectedGroup.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isMember ? (
              <button
                onClick={() => onJoinGroup(selectedGroup.id)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Join Circle
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                Member ✓
              </span>
            )}
          </div>
        </div>

        {/* Pinned prompt banner */}
        {selectedGroup.pinnedPrompt && (
          <div className="px-4 py-2.5 bg-indigo-950/40 border-b border-indigo-500/30 flex items-start space-x-2 text-xs text-indigo-200">
            <Pin className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-indigo-300 mr-1.5">Daily Circle Prompt:</span>
              <span>{selectedGroup.pinnedPrompt}</span>
            </div>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isMe = msg.senderId === activeUser.id;
            const extraReactions = reactionsMap[msg.id] || {};
            const allReactions = { ...(msg.reactions || {}), ...extraReactions };

            return (
              <div key={msg.id} className="flex items-start space-x-3 group">
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">{msg.senderName}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-indigo-300 font-medium border border-slate-700">
                      {msg.senderRole}
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>

                  <div className="mt-1 text-sm text-slate-200 leading-relaxed bg-slate-900/90 border border-slate-800/80 rounded-2xl rounded-tl-none p-3.5 shadow-sm inline-block max-w-2xl">
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Attached Code Block */}
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

                    {/* Reactions */}
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      {Object.entries(allReactions).map(([emoji, count]) => {
                        const countNum = Number(count);
                        if (countNum <= 0) return null;
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(msg.id, emoji)}
                            className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 flex items-center space-x-1 transition-colors"
                          >
                            <span>{emoji}</span>
                            <span className="text-[10px] font-bold text-slate-400">{countNum}</span>
                          </button>
                        );
                      })}

                      {/* Quick add reactions */}
                      {['🔥', '💡', '🚀', '💯'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className="px-1.5 py-0.5 rounded hover:bg-slate-800 text-xs opacity-40 hover:opacity-100 transition-opacity"
                          title={`React with ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowCodeModal(true)}
            title="Share Code in Group"
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
          >
            <Code className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message #${selectedGroup.name}...`}
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

      {/* Right Drawer: Active Members in Channel */}
      <div className="w-64 border-l border-slate-800 bg-slate-900/90 hidden lg:flex flex-col p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
          <Users className="h-4 w-4 text-indigo-400" />
          <span>Circle Members ({groupMembers.length})</span>
        </h4>

        <div className="flex-1 overflow-y-auto space-y-2">
          {groupMembers.map((member) => {
            const isMe = member.id === activeUser.id;
            return (
              <div
                key={member.id}
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {member.name} {isMe && '(You)'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                  </div>
                </div>

                {!isMe && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onDirectChatWithMember(member)}
                      title="Direct Chat"
                      className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onLaunchMockRoom(member)}
                      title="Start Mock Room"
                      className="p-1.5 text-slate-400 hover:text-emerald-300 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Video className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Group Tags */}
        <div className="pt-3 border-t border-slate-800">
          <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Tags</div>
          <div className="flex flex-wrap gap-1">
            {selectedGroup.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-indigo-300 border border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Code Snippet Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code className="h-4 w-4 text-indigo-400" />
                <span>Share Code to #{selectedGroup.name}</span>
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
                <option value="sql">SQL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Code Snippet
              </label>
              <textarea
                rows={8}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="// Enter algorithmic solution or architecture code..."
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
                Share Snippet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form onSubmit={handleCreateGroupSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="h-4 w-4 text-indigo-400" />
                <span>Create Tech Study Circle</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Circle Name
              </label>
              <input
                type="text"
                required
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. Distributed Systems Deep Dive"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Topic Domain
              </label>
              <select
                value={newGroupTopic}
                onChange={(e) => setNewGroupTopic(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="System Design">System Design</option>
                <option value="Frontend Live Coding">Frontend Live Coding</option>
                <option value="Backend Architecture">Backend Architecture</option>
                <option value="Behavioral (STAR Method)">Behavioral (STAR Method)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                placeholder="What will developers prepare together in this circle?"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={newGroupTags}
                onChange={(e) => setNewGroupTags(e.target.value)}
                placeholder="e.g. Redis, Kafka, Distributed"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                Create Circle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
