export type RoleCategory = 
  | 'Frontend' 
  | 'Backend' 
  | 'Fullstack' 
  | 'Mobile' 
  | 'DevOps / Cloud' 
  | 'ML & AI' 
  | 'System Architecture';

export type ExperienceLevel = 'Junior (0-2y)' | 'Mid-level (2-5y)' | 'Senior (5-8y)' | 'Staff / Lead (8y+)';

export type AvailabilityStatus = 'ready_now' | 'available_today' | 'weekend' | 'offline';

export type InterviewTopic = 
  | 'Data Structures & Algorithms' 
  | 'System Design' 
  | 'Frontend Live Coding' 
  | 'Backend Architecture' 
  | 'Behavioral (STAR Method)' 
  | 'Concurrency & Databases';

export interface DeveloperPersona {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  bio: string;
  role: RoleCategory;
  level: ExperienceLevel;
  currentCompany?: string;
  targetCompanies: string[];
  targetTopics: InterviewTopic[];
  techStack: string[];
  timezone: string;
  availabilityStatus: AvailabilityStatus;
  rating: number; // out of 5
  completedMocks: number;
  githubUrl?: string;
  linkedinUrl?: string;
  preferredLanguage: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  note?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  interviewInvite?: {
    topic: string;
    scheduledTime: string;
    sessionId?: string;
  };
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  iconName: string;
  memberIds: string[];
  memberCount: number;
  tags: string[];
  pinnedPrompt?: string;
  createdBy: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  text: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  reactions?: Record<string, number>;
}

export interface InterviewProblem {
  id: string;
  title: string;
  topic: 'Algorithms' | 'System Design' | 'Frontend' | 'Behavioral';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  targetCompanies: string[];
  description: string;
  constraints?: string[];
  starterCode: string;
  solutionTemplate?: string;
  testCases: {
    input: string;
    expected: string;
  }[];
  hints: string[];
  evaluationCriteria: string[];
}

export interface MockInterviewSession {
  id: string;
  title: string;
  topic: InterviewTopic;
  problemId?: string;
  interviewerId: string;
  candidateId: string;
  scheduledTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  durationMinutes: number;
  currentCode?: string;
  notes?: string;
  feedback?: {
    overallScore: number; // 1-10
    problemSolving: number; // 1-5
    codeQuality: number; // 1-5
    communication: number; // 1-5
    strengths: string[];
    areasForImprovement: string[];
    summary: string;
  };
}
