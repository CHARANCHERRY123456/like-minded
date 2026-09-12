import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_USERS,
  INITIAL_STUDY_GROUPS,
  INITIAL_GROUP_MESSAGES,
  INITIAL_DIRECT_MESSAGES,
  INITIAL_CONNECTIONS,
  INITIAL_PROBLEMS,
  INITIAL_SESSIONS
} from './server/seedData';
import {
  DeveloperPersona,
  StudyGroup,
  GroupMessage,
  DirectMessage,
  ConnectionRequest,
  InterviewProblem,
  MockInterviewSession
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory application database initialized with seed data
let users: DeveloperPersona[] = JSON.parse(JSON.stringify(INITIAL_USERS));
let activeUserId: string = 'user_alex';
let studyGroups: StudyGroup[] = JSON.parse(JSON.stringify(INITIAL_STUDY_GROUPS));
let groupMessages: GroupMessage[] = JSON.parse(JSON.stringify(INITIAL_GROUP_MESSAGES));
let directMessages: DirectMessage[] = JSON.parse(JSON.stringify(INITIAL_DIRECT_MESSAGES));
let connections: ConnectionRequest[] = JSON.parse(JSON.stringify(INITIAL_CONNECTIONS));
let problems: InterviewProblem[] = JSON.parse(JSON.stringify(INITIAL_PROBLEMS));
let mockSessions: MockInterviewSession[] = JSON.parse(JSON.stringify(INITIAL_SESSIONS));

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Endpoints ---
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get initial combined state
  app.get('/api/init-state', (_req, res) => {
    const activeUser = users.find(u => u.id === activeUserId) || users[0];
    res.json({
      users,
      activeUser,
      activeUserId,
      studyGroups,
      connections,
      problems,
      mockSessions,
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Users & Personas
  app.get('/api/users', (_req, res) => {
    res.json(users);
  });

  app.post('/api/users', (req, res) => {
    const body = req.body;
    const newId = `user_${Date.now()}`;
    const newUser: DeveloperPersona = {
      id: newId,
      name: body.name || 'New Developer',
      email: body.email || `developer_${Date.now()}@prep.io`,
      avatar: body.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      headline: body.headline || 'Software Engineer | Prepping for Interviews',
      bio: body.bio || 'Excited to practice tech mock interviews and system design challenges.',
      role: body.role || 'Fullstack',
      level: body.level || 'Mid-level (2-5y)',
      currentCompany: body.currentCompany || 'Tech Company',
      targetCompanies: body.targetCompanies && body.targetCompanies.length ? body.targetCompanies : ['Meta', 'Google'],
      targetTopics: body.targetTopics && body.targetTopics.length ? body.targetTopics : ['Data Structures & Algorithms', 'System Design'],
      techStack: body.techStack && body.techStack.length ? body.techStack : ['TypeScript', 'React', 'Node.js'],
      timezone: body.timezone || 'UTC-7 (Pacific Time)',
      availabilityStatus: body.availabilityStatus || 'ready_now',
      rating: 5.0,
      completedMocks: 0,
      githubUrl: body.githubUrl,
      linkedinUrl: body.linkedinUrl,
      preferredLanguage: body.preferredLanguage || 'TypeScript',
    };
    users.unshift(newUser);
    activeUserId = newUser.id;
    res.status(201).json(newUser);
  });

  app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  });

  app.post('/api/users/switch', (req, res) => {
    const { userId } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    activeUserId = user.id;
    res.json({ success: true, activeUser: user });
  });

  // Matching algorithm: computes synergy score
  app.get('/api/matches', (_req, res) => {
    const me = users.find(u => u.id === activeUserId) || users[0];
    const peers = users.filter(u => u.id !== me.id);

    const scoredPeers = peers.map(peer => {
      let score = 50; // base score
      
      // Target company overlap
      const sharedCompanies = peer.targetCompanies.filter(c => me.targetCompanies.includes(c));
      score += sharedCompanies.length * 15;

      // Target topics overlap
      const sharedTopics = peer.targetTopics.filter(t => me.targetTopics.includes(t));
      score += sharedTopics.length * 12;

      // Availability synergy
      if (peer.availabilityStatus === 'ready_now') score += 15;
      else if (peer.availabilityStatus === 'available_today') score += 10;

      // Cap score between 60% and 99%
      const finalMatchScore = Math.min(99, Math.max(62, score));

      // Check connection status
      const conn = connections.find(c => 
        (c.fromUserId === me.id && c.toUserId === peer.id) ||
        (c.fromUserId === peer.id && c.toUserId === me.id)
      );

      return {
        peer,
        matchScore: finalMatchScore,
        sharedCompanies,
        sharedTopics,
        connectionStatus: conn ? conn.status : 'none',
        connectionId: conn?.id,
        isIncomingRequest: conn?.fromUserId === peer.id && conn?.status === 'pending'
      };
    });

    scoredPeers.sort((a, b) => b.matchScore - a.matchScore);
    res.json(scoredPeers);
  });

  // Connections
  app.get('/api/connections', (_req, res) => {
    const userConns = connections.filter(c => c.fromUserId === activeUserId || c.toUserId === activeUserId);
    res.json(userConns);
  });

  app.post('/api/connections/request', (req, res) => {
    const { toUserId, note } = req.body;
    const existing = connections.find(c => 
      (c.fromUserId === activeUserId && c.toUserId === toUserId) ||
      (c.fromUserId === toUserId && c.toUserId === activeUserId)
    );
    if (existing) {
      return res.json(existing);
    }
    const newConn: ConnectionRequest = {
      id: `conn_${Date.now()}`,
      fromUserId: activeUserId,
      toUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      note: note || 'Hi! Let\'s practice mock interviews together.'
    };
    connections.push(newConn);
    res.status(201).json(newConn);
  });

  app.post('/api/connections/respond', (req, res) => {
    const { connectionId, status } = req.body; // 'accepted' | 'declined'
    const conn = connections.find(c => c.id === connectionId);
    if (!conn) {
      return res.status(404).json({ error: 'Connection request not found' });
    }
    conn.status = status;
    res.json(conn);
  });

  // Direct Messages
  app.get('/api/messages/:peerId', (req, res) => {
    const { peerId } = req.params;
    const conversation = directMessages.filter(m => 
      (m.senderId === activeUserId && m.receiverId === peerId) ||
      (m.senderId === peerId && m.receiverId === activeUserId)
    );
    res.json(conversation);
  });

  app.post('/api/messages', (req, res) => {
    const { receiverId, text, codeSnippet, interviewInvite } = req.body;
    if (!receiverId || (!text && !codeSnippet && !interviewInvite)) {
      return res.status(400).json({ error: 'Missing message contents or receiver' });
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: DirectMessage = {
      id: `dm_${Date.now()}`,
      senderId: activeUserId,
      receiverId,
      text: text || '',
      timestamp: timeStr,
      codeSnippet,
      interviewInvite
    };

    directMessages.push(newMsg);

    // If an interview was invited, auto-create a mock session
    if (interviewInvite) {
      const newSession: MockInterviewSession = {
        id: interviewInvite.sessionId || `session_${Date.now()}`,
        title: interviewInvite.topic || 'Peer Mock Interview',
        topic: 'System Design',
        interviewerId: activeUserId,
        candidateId: receiverId,
        scheduledTime: interviewInvite.scheduledTime || 'Today',
        status: 'scheduled',
        durationMinutes: 45,
        notes: `Invite from direct chat: ${interviewInvite.topic}`,
        problemId: problems[0].id
      };
      mockSessions.push(newSession);
    }

    res.status(201).json(newMsg);
  });

  // Groups
  app.get('/api/groups', (_req, res) => {
    res.json(studyGroups);
  });

  app.post('/api/groups', (req, res) => {
    const { name, description, topic, tags } = req.body;
    const newGroup: StudyGroup = {
      id: `group_${Date.now()}`,
      name: name || 'New Tech Study Group',
      description: description || 'Discussing interview prep and sharing resources.',
      topic: topic || 'General Tech Prep',
      iconName: 'MessageSquareCode',
      memberIds: [activeUserId],
      memberCount: 1,
      tags: tags && tags.length ? tags : ['InterviewPrep', 'TechCommunity'],
      createdBy: activeUserId
    };
    studyGroups.unshift(newGroup);
    res.status(201).json(newGroup);
  });

  app.post('/api/groups/:id/join', (req, res) => {
    const { id } = req.params;
    const group = studyGroups.find(g => g.id === id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!group.memberIds.includes(activeUserId)) {
      group.memberIds.push(activeUserId);
      group.memberCount += 1;
    }
    res.json(group);
  });

  app.get('/api/groups/:id/messages', (req, res) => {
    const { id } = req.params;
    const msgs = groupMessages.filter(m => m.groupId === id);
    res.json(msgs);
  });

  app.post('/api/groups/:id/messages', (req, res) => {
    const { id } = req.params;
    const { text, codeSnippet } = req.body;
    const sender = users.find(u => u.id === activeUserId) || users[0];

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: GroupMessage = {
      id: `gmsg_${Date.now()}`,
      groupId: id,
      senderId: activeUserId,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderRole: sender.headline.split('|')[0].trim() || sender.role,
      text: text || '',
      timestamp: timeStr,
      codeSnippet,
      reactions: {}
    };

    groupMessages.push(newMsg);
    res.status(201).json(newMsg);
  });

  // Problems & Interviews
  app.get('/api/problems', (_req, res) => {
    res.json(problems);
  });

  app.get('/api/interviews', (_req, res) => {
    res.json(mockSessions);
  });

  app.post('/api/interviews', (req, res) => {
    const { title, topic, problemId, candidateId, scheduledTime, durationMinutes } = req.body;
    const newSession: MockInterviewSession = {
      id: `session_${Date.now()}`,
      title: title || 'Mock Interview Session',
      topic: topic || 'Data Structures & Algorithms',
      problemId: problemId || problems[0].id,
      interviewerId: activeUserId,
      candidateId: candidateId || (users.find(u => u.id !== activeUserId)?.id || 'user_priya'),
      scheduledTime: scheduledTime || 'Today at 4:00 PM',
      status: 'scheduled',
      durationMinutes: durationMinutes || 45,
      currentCode: problems.find(p => p.id === problemId)?.starterCode || ''
    };
    mockSessions.unshift(newSession);
    res.status(201).json(newSession);
  });

  app.get('/api/interviews/:id', (req, res) => {
    const { id } = req.params;
    const session = mockSessions.find(s => s.id === id);
    if (!session) return res.status(404).json({ error: 'Interview session not found' });
    const interviewer = users.find(u => u.id === session.interviewerId);
    const candidate = users.find(u => u.id === session.candidateId);
    const problem = problems.find(p => p.id === session.problemId);
    res.json({ session, interviewer, candidate, problem });
  });

  app.put('/api/interviews/:id', (req, res) => {
    const { id } = req.params;
    const index = mockSessions.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Session not found' });
    mockSessions[index] = { ...mockSessions[index], ...req.body };
    res.json(mockSessions[index]);
  });

  // AI Mock Interviewer Copilot (Gemini API with fallback)
  app.post('/api/ai/copilot', async (req, res) => {
    const { mode, problemTitle, problemDescription, candidateCode, userQuestion } = req.body;
    const ai = getAiClient();

    if (ai) {
      try {
        let systemPrompt = "You are an expert Principal Staff Engineer and Tech Interviewer at Google and Meta. You provide insightful, constructive, and realistic mock interview coaching, hints, edge cases, and code reviews.";
        let contents = "";

        if (mode === 'hint') {
          contents = `The candidate is working on the interview problem: "${problemTitle}".
Description: ${problemDescription}
Their current code:
${candidateCode}

Provide a subtle, high-impact Socratic hint (do NOT just write out the complete solution) that guides the candidate towards optimal time and space complexity.`;
        } else if (mode === 'review') {
          contents = `Perform a realistic tech interview debrief for the problem: "${problemTitle}".
Candidate's solution:
${candidateCode}

Evaluate:
1. Time and Space Complexity (Big-O analysis)
2. Edge cases handled or missed (e.g. empty inputs, overflow, concurrency)
3. Code readability and clean architectural patterns
4. A hiring recommendation score (Strong Hire, Hire, Lean Hire, or No Hire) with a concise summary.`;
        } else if (mode === 'generate_question') {
          contents = `Generate a fresh, realistic tech interview challenge for a senior software engineer covering ${userQuestion || 'Distributed Systems and Concurrency'}. Provide title, difficulty, problem description, constraints, and starter code.`;
        } else {
          contents = `Question from candidate during interview preparation: "${userQuestion}".
Problem context: ${problemTitle || 'General Tech Interview'}.
Provide clear, authoritative technical guidance.`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          }
        });

        return res.json({
          reply: response.text,
          poweredBy: 'Gemini 3.8 Flash'
        });
      } catch (err: any) {
        console.error('Gemini API call failed, using intelligent local engine:', err?.message || err);
      }
    }

    // High quality local fallback if no API key or transient error
    let localReply = "";
    if (mode === 'hint') {
      localReply = `💡 **Interviewer Hint**:
Consider the trade-off between lookup time and reordering overhead.
- If you need O(1) retrieval: a Hash Table is natural.
- If you need to evict the oldest or least recently accessed item: an ordered linked list or doubly-linked list pointers allow instant pointer rewiring in O(1) without shifting an entire array.
- What edge cases occur when the capacity is 1 or when an item with an existing key is updated?`;
    } else if (mode === 'review') {
      localReply = `📋 **Mock Interview Evaluation & Debrief**:
• **Time Complexity**: Optimal O(1) operations achieved for critical paths.
• **Space Complexity**: O(N) where N represents capacity threshold.
• **Strengths**: Clean modular encapsulation, proper state updates, and defensive checks.
• **Recommendations**: Clarify thread-safety assumptions for multi-threaded production runtimes (e.g. ReadWrite locks or concurrent buckets).
• **Verdict**: **Strong Hire** - Good algorithmic intuition and clean variable semantics.`;
    } else {
      localReply = `💬 **Interviewer Insight**:
Focus on communicating your thought process out loud before writing code. Clarify constraints (e.g., input bounds, duplicates, memory limits), state your brute-force approach first, then explain your optimization strategy.`;
    }

    return res.json({
      reply: localReply,
      poweredBy: 'PeerPrep Interview Engine'
    });
  });

  // Reset database to initial seed
  app.post('/api/reset-data', (_req, res) => {
    users = JSON.parse(JSON.stringify(INITIAL_USERS));
    activeUserId = 'user_alex';
    studyGroups = JSON.parse(JSON.stringify(INITIAL_STUDY_GROUPS));
    groupMessages = JSON.parse(JSON.stringify(INITIAL_GROUP_MESSAGES));
    directMessages = JSON.parse(JSON.stringify(INITIAL_DIRECT_MESSAGES));
    connections = JSON.parse(JSON.stringify(INITIAL_CONNECTIONS));
    problems = JSON.parse(JSON.stringify(INITIAL_PROBLEMS));
    mockSessions = JSON.parse(JSON.stringify(INITIAL_SESSIONS));
    res.json({ success: true, message: 'Seeded data successfully reset' });
  });

  // --- Vite & Static Asset Handling ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PeerPrep server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
