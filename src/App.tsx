import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MatchExplorer } from './components/MatchExplorer';
import { DirectChatView } from './components/DirectChatView';
import { StudyGroupsView } from './components/StudyGroupsView';
import { MockInterviewRoom } from './components/MockInterviewRoom';
import { PersonaModal } from './components/PersonaModal';
import { 
  DeveloperPersona, 
  StudyGroup, 
  DirectMessage, 
  GroupMessage, 
  InterviewProblem, 
  MockInterviewSession, 
  AvailabilityStatus 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'matches' | 'chat' | 'groups' | 'mock_room'>('matches');
  const [users, setUsers] = useState<DeveloperPersona[]>([]);
  const [activeUser, setActiveUser] = useState<DeveloperPersona | null>(null);
  const [scoredPeers, setScoredPeers] = useState<any[]>([]);
  const [selectedPeer, setSelectedPeer] = useState<DeveloperPersona | null>(null);

  // Groups
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);

  // 1:1 Messages
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);

  // Problems & Interviews
  const [problems, setProblems] = useState<InterviewProblem[]>([]);
  const [mockSessions, setMockSessions] = useState<MockInterviewSession[]>([]);
  const [activeMockProblemId, setActiveMockProblemId] = useState<string | undefined>(undefined);

  // Modals & Status
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial app data
  const loadState = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/init-state');
      if (!res.ok) throw new Error('Failed to load init state');
      const data = await res.json();

      setUsers(data.users);
      setActiveUser(data.activeUser);
      setStudyGroups(data.studyGroups);
      if (data.studyGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(data.studyGroups[0]);
      }
      setProblems(data.problems);
      setMockSessions(data.mockSessions);

      // Load matches
      const matchRes = await fetch('/api/matches');
      if (matchRes.ok) {
        const matchesData = await matchRes.json();
        setScoredPeers(matchesData);
        if (matchesData.length > 0 && !selectedPeer) {
          setSelectedPeer(matchesData[0].peer);
        }
      }
    } catch (err) {
      console.error('Error fetching state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  // Fetch 1:1 messages when selectedPeer changes
  useEffect(() => {
    if (selectedPeer && activeUser) {
      fetch(`/api/messages/${selectedPeer.id}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((msgs) => setDirectMessages(msgs))
        .catch(() => {});
    }
  }, [selectedPeer?.id, activeUser?.id]);

  // Fetch group messages when selectedGroup changes
  useEffect(() => {
    if (selectedGroup) {
      fetch(`/api/groups/${selectedGroup.id}/messages`)
        .then((r) => (r.ok ? r.json() : []))
        .then((msgs) => setGroupMessages(msgs))
        .catch(() => {});
    }
  }, [selectedGroup?.id]);

  // Handler: Switch Active User Persona
  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/users/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveUser(data.activeUser);
        showToast(`Switched active persona to ${data.activeUser.name}`);
        // Reload match list for newly active user
        const matchRes = await fetch('/api/matches');
        if (matchRes.ok) {
          const matches = await matchRes.json();
          setScoredPeers(matches);
          const firstOther = matches.find((m: any) => m.peer.id !== data.activeUser.id);
          if (firstOther) setSelectedPeer(firstOther.peer);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Update Availability Status
  const handleStatusChange = async (status: AvailabilityStatus) => {
    if (!activeUser) return;
    try {
      const res = await fetch(`/api/users/${activeUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availabilityStatus: status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveUser(updated);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        showToast(`Availability updated to ${status.replace('_', ' ')}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Register New Persona
  const handleSavePersona = async (personaData: Partial<DeveloperPersona>) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personaData),
      });
      if (res.ok) {
        const newUser = await res.json();
        setUsers((prev) => [newUser, ...prev]);
        setActiveUser(newUser);
        showToast(`Welcome, ${newUser.name}! Persona registered successfully.`);
        // Reload matches for this new user
        const matchRes = await fetch('/api/matches');
        if (matchRes.ok) {
          const matches = await matchRes.json();
          setScoredPeers(matches);
          if (matches.length > 0) setSelectedPeer(matches[0].peer);
        }
        setActiveTab('matches');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Send Connection Request
  const handleConnect = async (targetUserId: string) => {
    try {
      const res = await fetch('/api/connections/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: targetUserId }),
      });
      if (res.ok) {
        showToast('Connection request sent!');
        // Update local state
        setScoredPeers((prev) =>
          prev.map((item) =>
            item.peer.id === targetUserId
              ? { ...item, connectionStatus: 'pending' }
              : item
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Respond to Connection (Accept / Decline)
  const handleRespondConnection = async (connectionId: string, status: 'accepted' | 'declined') => {
    try {
      const res = await fetch('/api/connections/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId, status }),
      });
      if (res.ok) {
        showToast(`Connection request ${status}`);
        // Refresh match list
        const matchRes = await fetch('/api/matches');
        if (matchRes.ok) {
          setScoredPeers(await matchRes.json());
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Send 1:1 Direct Message
  const handleSendDirectMessage = async (payload: {
    receiverId: string;
    text?: string;
    codeSnippet?: { language: string; code: string };
    interviewInvite?: { topic: string; scheduledTime: string; sessionId?: string };
  }) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setDirectMessages((prev) => [...prev, newMsg]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Send Group Message
  const handleSendGroupMessage = async (
    groupId: string,
    text: string,
    codeSnippet?: { language: string; code: string }
  ) => {
    try {
      const res = await fetch(`/api/groups/${groupId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, codeSnippet }),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setGroupMessages((prev) => [...prev, newMsg]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Create Study Circle
  const handleCreateGroup = async (name: string, description: string, topic: string, tags: string[]) => {
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, topic, tags }),
      });
      if (res.ok) {
        const newGroup = await res.json();
        setStudyGroups((prev) => [newGroup, ...prev]);
        setSelectedGroup(newGroup);
        showToast(`Created study circle #${newGroup.name}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Join Study Circle
  const handleJoinGroup = async (groupId: string) => {
    try {
      const res = await fetch(`/api/groups/${groupId}/join`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setStudyGroups((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        setSelectedGroup(updated);
        showToast(`Joined #${updated.name}!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Launch Live Mock Room
  const handleLaunchMockRoom = (peer: DeveloperPersona, problemId?: string) => {
    setSelectedPeer(peer);
    if (problemId) setActiveMockProblemId(problemId);
    setActiveTab('mock_room');
  };

  // Handler: Complete Mock Session & Rubric Feedback
  const handleCompleteMockSession = (feedback: any) => {
    showToast('Mock session feedback recorded! Rating and completed mocks updated.');
    // Optimistically update partner completed count
    if (selectedPeer) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedPeer.id ? { ...u, completedMocks: u.completedMocks + 1 } : u
        )
      );
    }
  };

  // Handler: Reset Seed Data
  const handleResetData = async () => {
    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      if (res.ok) {
        showToast('App reset to fresh pre-seeded interview data.');
        loadState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !activeUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-white tracking-wide">Loading PeerPrep Hub...</p>
        <p className="text-xs text-slate-500 mt-1">Connecting developer personas & study circles</p>
      </div>
    );
  }

  // Active peer fallback
  const currentPeer = selectedPeer || users.find((u) => u.id !== activeUser.id) || users[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center space-x-2 animate-bounce border border-indigo-400/40">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        users={users}
        activeUser={activeUser}
        onSwitchUser={handleSwitchUser}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onResetData={handleResetData}
        onStatusChange={handleStatusChange}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'matches' && (
          <MatchExplorer
            scoredPeers={scoredPeers}
            activeUser={activeUser}
            onConnect={handleConnect}
            onRespondConnection={handleRespondConnection}
            onOpenChat={(peer) => {
              setSelectedPeer(peer);
              setActiveTab('chat');
            }}
            onStartInstantMock={(peer) => handleLaunchMockRoom(peer)}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          />
        )}

        {activeTab === 'chat' && (
          <DirectChatView
            activeUser={activeUser}
            peers={users.filter((u) => u.id !== activeUser.id)}
            selectedPeer={currentPeer}
            onSelectPeer={(peer) => setSelectedPeer(peer)}
            messages={directMessages}
            onSendMessage={handleSendDirectMessage}
            onLaunchMockRoom={(peer, probId) => handleLaunchMockRoom(peer, probId)}
            problems={problems}
          />
        )}

        {activeTab === 'groups' && selectedGroup && (
          <StudyGroupsView
            groups={studyGroups}
            selectedGroup={selectedGroup}
            onSelectGroup={(group) => setSelectedGroup(group)}
            messages={groupMessages}
            onSendMessage={handleSendGroupMessage}
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
            activeUser={activeUser}
            allUsers={users}
            onDirectChatWithMember={(member) => {
              setSelectedPeer(member);
              setActiveTab('chat');
            }}
            onLaunchMockRoom={(member) => handleLaunchMockRoom(member)}
          />
        )}

        {activeTab === 'mock_room' && (
          <MockInterviewRoom
            activeUser={activeUser}
            partner={currentPeer}
            problems={problems}
            initialProblemId={activeMockProblemId}
            onExit={() => setActiveTab('matches')}
            onCompleteSession={handleCompleteMockSession}
          />
        )}
      </main>

      {/* Persona Registration & Edit Modal */}
      <PersonaModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSave={handleSavePersona}
      />
    </div>
  );
}
