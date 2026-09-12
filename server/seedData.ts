import { DeveloperPersona, StudyGroup, GroupMessage, DirectMessage, InterviewProblem, MockInterviewSession, ConnectionRequest } from '../src/types';

export const INITIAL_USERS: DeveloperPersona[] = [
  {
    id: 'user_alex',
    name: 'Alex Chen',
    email: 'alex.chen@techprep.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    headline: 'Senior Fullstack Engineer | Ex-Stripe | Targeting Meta E5',
    bio: '8 years building high-throughput distributed systems and React frontends. Looking for peers to run weekly 45-min System Design and LeetCode Medium/Hard mock sessions.',
    role: 'Fullstack',
    level: 'Senior (5-8y)',
    currentCompany: 'FinTech Growth Co',
    targetCompanies: ['Meta', 'Google', 'Stripe', 'Datadog'],
    targetTopics: ['System Design', 'Data Structures & Algorithms', 'Backend Architecture'],
    techStack: ['TypeScript', 'React', 'Node.js', 'Go', 'PostgreSQL', 'Redis', 'Kafka'],
    timezone: 'UTC-7 (Pacific Time)',
    availabilityStatus: 'ready_now',
    rating: 4.9,
    completedMocks: 18,
    githubUrl: 'https://github.com/alexchen-dev',
    linkedinUrl: 'https://linkedin.com/in/alexchen',
    preferredLanguage: 'TypeScript / Go',
  },
  {
    id: 'user_priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@techprep.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    headline: 'Distributed Systems & Backend Dev | Targeting Google L5 & AWS',
    bio: 'Passionate about concurrency, microservices, and database internals. Prepping for Google distributed systems interview and heavy Graph / Dynamic Programming algorithms.',
    role: 'Backend',
    level: 'Senior (5-8y)',
    currentCompany: 'CloudScale Inc',
    targetCompanies: ['Google', 'Amazon', 'Microsoft', 'Snowflake'],
    targetTopics: ['Backend Architecture', 'System Design', 'Data Structures & Algorithms'],
    techStack: ['Java', 'Go', 'Kubernetes', 'gRPC', 'Cassandra', 'AWS'],
    timezone: 'UTC-5 (Eastern Time)',
    availabilityStatus: 'ready_now',
    rating: 4.8,
    completedMocks: 14,
    githubUrl: 'https://github.com/priyasharma-code',
    linkedinUrl: 'https://linkedin.com/in/priyasharma',
    preferredLanguage: 'Java / Go',
  },
  {
    id: 'user_marcus',
    name: 'Marcus Vance',
    email: 'marcus.v@techprep.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    headline: 'Staff Frontend Architect | Targeting Vercel, Figma & Airbnb',
    bio: 'Deep dive into DOM rendering engines, Web Workers, state management tradeoffs, and modern web application performance. Looking to practice mock UI live-coding.',
    role: 'Frontend',
    level: 'Staff / Lead (8y+)',
    currentCompany: 'CreativeSaaS',
    targetCompanies: ['Vercel', 'Figma', 'Airbnb', 'Netflix'],
    targetTopics: ['Frontend Live Coding', 'System Design', 'Behavioral (STAR Method)'],
    techStack: ['TypeScript', 'React', 'Next.js', 'WebAssembly', 'TailwindCSS', 'GraphQL'],
    timezone: 'UTC-8 (Pacific Time)',
    availabilityStatus: 'available_today',
    rating: 5.0,
    completedMocks: 23,
    githubUrl: 'https://github.com/marcusvance',
    linkedinUrl: 'https://linkedin.com/in/marcusvance',
    preferredLanguage: 'TypeScript',
  },
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@techprep.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    headline: 'Machine Learning & AI Engineer | Targeting OpenAI & Anthropic',
    bio: 'Focused on LLM infrastructure, vector search pipelines, and Python algorithms. Happy to exchange ML system design rounds for algorithmic coding rounds!',
    role: 'ML & AI',
    level: 'Mid-level (2-5y)',
    currentCompany: 'AI Labs',
    targetCompanies: ['OpenAI', 'Anthropic', 'Google', 'Meta'],
    targetTopics: ['System Design', 'Data Structures & Algorithms', 'Behavioral (STAR Method)'],
    techStack: ['Python', 'PyTorch', 'FastAPI', 'Milvus', 'Ray', 'Docker'],
    timezone: 'UTC+1 (Central European Time)',
    availabilityStatus: 'available_today',
    rating: 4.7,
    completedMocks: 9,
    githubUrl: 'https://github.com/elenarostova',
    preferredLanguage: 'Python',
  },
  {
    id: 'user_david',
    name: 'David Kim',
    email: 'david.kim@techprep.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    headline: 'Fullstack Developer | Targeting Amazon SDE-II & Uber',
    bio: 'Solving 2 LeetCode problems every morning. Need a mock buddy to drill Amazon 16 Leadership Principles and live timed coding under pressure.',
    role: 'Fullstack',
    level: 'Mid-level (2-5y)',
    currentCompany: 'E-commerce Solutions',
    targetCompanies: ['Amazon', 'Uber', 'Apple', 'DoorDash'],
    targetTopics: ['Behavioral (STAR Method)', 'Data Structures & Algorithms', 'Frontend Live Coding'],
    techStack: ['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'AWS DynamoDB'],
    timezone: 'UTC-6 (Central Time)',
    availabilityStatus: 'ready_now',
    rating: 4.6,
    completedMocks: 11,
    preferredLanguage: 'Python / JavaScript',
  },
  {
    id: 'user_sophia',
    name: 'Sophia Patel',
    email: 'sophia.p@techprep.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    headline: 'Cloud Infrastructure & DevOps Engineer | Targeting Netflix & Uber',
    bio: 'Terraform, Site Reliability, and high-resiliency cloud architecture. Preparing for DevOps/SRE systems design and live incident troubleshooting interviews.',
    role: 'DevOps / Cloud',
    level: 'Senior (5-8y)',
    currentCompany: 'Fintech Corp',
    targetCompanies: ['Netflix', 'Uber', 'Coinbase', 'Datadog'],
    targetTopics: ['System Design', 'Backend Architecture', 'Behavioral (STAR Method)'],
    techStack: ['Go', 'Terraform', 'Kubernetes', 'Prometheus', 'AWS', 'Linux Internals'],
    timezone: 'UTC-5 (Eastern Time)',
    availabilityStatus: 'weekend',
    rating: 4.85,
    completedMocks: 15,
    preferredLanguage: 'Go / Python',
  }
];

export const INITIAL_STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'group_leetcode',
    name: 'LeetCode Grind 75 & NeetCode',
    description: 'Daily algorithmic problem solving, time/space complexity optimization, and dynamic programming walkthroughs.',
    topic: 'Data Structures & Algorithms',
    iconName: 'Code',
    memberIds: ['user_alex', 'user_priya', 'user_david', 'user_elena'],
    memberCount: 142,
    tags: ['DSA', 'LeetCode', 'Algorithms', 'FAANG'],
    pinnedPrompt: 'Today’s Problem: LRU Cache (LeetCode 146) or Course Schedule II (Topological Sort). Discuss edge cases in thread!',
    createdBy: 'user_alex',
  },
  {
    id: 'group_system_design',
    name: 'System Design Masters',
    description: 'High-level and low-level architectural deep dives: Distributed Caching, Rate Limiters, Sharding, Message Brokers & CAP theorem.',
    topic: 'System Design',
    iconName: 'Network',
    memberIds: ['user_alex', 'user_priya', 'user_marcus', 'user_sophia'],
    memberCount: 98,
    tags: ['Distributed Systems', 'Architecture', 'High Scale', 'Databases'],
    pinnedPrompt: 'Whiteboard challenge: How would you design a distributed rate limiter that handles 1,000,000 requests/sec with Redis sliding window?',
    createdBy: 'user_priya',
  },
  {
    id: 'group_faang_prep',
    name: 'FAANG Behavioral & STAR Stories',
    description: 'Mastering Amazon Leadership Principles, Meta "Be Bold" stories, Google Googliness, and executive communication frameworks.',
    topic: 'Behavioral (STAR Method)',
    iconName: 'Users',
    memberIds: ['user_david', 'user_alex', 'user_marcus', 'user_sophia'],
    memberCount: 76,
    tags: ['Behavioral', 'STAR', 'Leadership', 'Negotiation'],
    pinnedPrompt: 'Practice prompt: "Tell me about a time you had an architectural disagreement with your principal engineer and how you resolved it."',
    createdBy: 'user_david',
  },
  {
    id: 'group_frontend_architects',
    name: 'Frontend & UI Architecture',
    description: 'Live coding challenges in React/TypeScript, performance profiling, virtual scrolling, state normalization, and micro-frontends.',
    topic: 'Frontend Live Coding',
    iconName: 'Layers',
    memberIds: ['user_marcus', 'user_alex', 'user_david'],
    memberCount: 65,
    tags: ['React', 'TypeScript', 'DOM', 'Performance'],
    pinnedPrompt: 'Challenge: Implement an accessible Autocomplete Combobox with keyboard navigation and debounced remote fetch in 30 minutes.',
    createdBy: 'user_marcus',
  }
];

export const INITIAL_GROUP_MESSAGES: GroupMessage[] = [
  {
    id: 'gmsg_1',
    groupId: 'group_leetcode',
    senderId: 'user_alex',
    senderName: 'Alex Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Senior Fullstack',
    text: 'Hey everyone! Just finished a mock on LRU Cache. A key tip: use a doubly-linked list combined with a hashmap so node removals and inserts are strictly O(1).',
    timestamp: '10:15 AM',
    codeSnippet: {
      language: 'typescript',
      code: `class LRUCache {\n  private map = new Map<number, ListNode>();\n  private head = new ListNode(0, 0);\n  private tail = new ListNode(0, 0);\n  // O(1) get and put operations\n}`
    },
    reactions: { '🔥': 6, '👍': 4 }
  },
  {
    id: 'gmsg_2',
    groupId: 'group_leetcode',
    senderId: 'user_priya',
    senderName: 'Priya Sharma',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Backend Engineer',
    text: 'Totally agree Alex! Also, watch out for thread-safety in Java/Go if the interviewer asks how to adapt it for a multithreaded environment. Use ReadWriteLocks or ConcurrentHashMap with segmented synchronization.',
    timestamp: '10:22 AM',
    reactions: { '💡': 8 }
  },
  {
    id: 'gmsg_3',
    groupId: 'group_system_design',
    senderId: 'user_priya',
    senderName: 'Priya Sharma',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Backend Engineer',
    text: 'Sharing my architecture diagram for the Rate Limiter session! When using Redis sliding window logs, memory can grow high. Token Bucket with Redis Lua scripts is often much more memory-efficient.',
    timestamp: 'Yesterday at 4:30 PM',
    reactions: { '🚀': 12, '❤️': 5 }
  },
  {
    id: 'gmsg_4',
    groupId: 'group_system_design',
    senderId: 'user_sophia',
    senderName: 'Sophia Patel',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    senderRole: 'DevOps / Cloud',
    text: 'Good point Priya. At edge CDN level (Cloudflare / Envoy proxy), you can also do local token bucket caching and sync deltas asynchronously to avoid hitting central Redis on every single micro-request.',
    timestamp: 'Yesterday at 5:10 PM',
    reactions: { '💯': 7 }
  },
  {
    id: 'gmsg_5',
    groupId: 'group_faang_prep',
    senderId: 'user_david',
    senderName: 'David Kim',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Mid-level Fullstack',
    text: 'Anyone free for a 30-minute behavioral mock tonight? Practicing my "Customer Obsession" and "Ownership" stories for Amazon.',
    timestamp: '11:05 AM',
    reactions: { '🙋‍♂️': 3 }
  }
];

export const INITIAL_DIRECT_MESSAGES: DirectMessage[] = [
  {
    id: 'dm_1',
    senderId: 'user_priya',
    receiverId: 'user_alex',
    text: 'Hey Alex! Saw your profile targeting Meta and Stripe. I am prepping for Google L5. Would you be down for a 45-minute mock interview this afternoon?',
    timestamp: '09:30 AM',
  },
  {
    id: 'dm_2',
    senderId: 'user_alex',
    receiverId: 'user_priya',
    text: 'Hi Priya! Absolutely. How about we do System Design for 45 mins? I can interview you on a Distributed Rate Limiter, and you can grill me on an LRU Cache or Message Queue.',
    timestamp: '09:42 AM',
  },
  {
    id: 'dm_3',
    senderId: 'user_priya',
    receiverId: 'user_alex',
    text: 'Deal! I scheduled a room for us. We can use the collaborative code editor and voice room to keep it timed and realistic.',
    timestamp: '09:45 AM',
    interviewInvite: {
      topic: 'System Design & Distributed Rate Limiter',
      scheduledTime: 'Today at 3:00 PM',
      sessionId: 'session_mock_1'
    }
  },
  {
    id: 'dm_4',
    senderId: 'user_marcus',
    receiverId: 'user_alex',
    text: 'Hey Alex, let me know when you want to run through frontend architecture questions. I have a great scenario on building an offline-first collaborative Kanban board.',
    timestamp: 'Yesterday',
  }
];

export const INITIAL_CONNECTIONS: ConnectionRequest[] = [
  {
    id: 'conn_1',
    fromUserId: 'user_priya',
    toUserId: 'user_alex',
    status: 'accepted',
    createdAt: '2026-09-10T10:00:00Z',
    note: 'Let’s connect for System Design and Go mock interviews!'
  },
  {
    id: 'conn_2',
    fromUserId: 'user_marcus',
    toUserId: 'user_alex',
    status: 'accepted',
    createdAt: '2026-09-11T14:30:00Z',
    note: 'Fellow fullstack/frontend dev preparing for senior roles.'
  },
  {
    id: 'conn_3',
    fromUserId: 'user_david',
    toUserId: 'user_alex',
    status: 'pending',
    createdAt: '2026-09-12T08:00:00Z',
    note: 'Hi Alex! Would love to connect and swap mock interview feedback.'
  },
  {
    id: 'conn_4',
    fromUserId: 'user_elena',
    toUserId: 'user_alex',
    status: 'pending',
    createdAt: '2026-09-12T08:15:00Z',
    note: 'Prepping for ML/System Design interviews. Looking forward to connecting!'
  }
];

export const INITIAL_PROBLEMS: InterviewProblem[] = [
  {
    id: 'prob_lru',
    title: 'Design In-Memory LRU Cache',
    topic: 'Algorithms',
    difficulty: 'Medium',
    targetCompanies: ['Meta', 'Google', 'Amazon', 'Microsoft', 'Apple'],
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
• LRUCache(int capacity): Initialize the LRU cache with positive size capacity.
• get(key): Return the value of the key if the key exists, otherwise return -1.
• put(key, value): Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

The functions get and put must each run in O(1) average time complexity.`,
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.'
    ],
    starterCode: `class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key)!;
    // Refresh access order
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first element in Map iteration)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

// Test runner execution:
const lru = new LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
console.log("get(1):", lru.get(1)); // returns 1
lru.put(3, 3); // evicts key 2
console.log("get(2):", lru.get(2)); // returns -1 (not found)
lru.put(4, 4); // evicts key 1
console.log("get(1):", lru.get(1)); // returns -1 (not found)
console.log("get(3):", lru.get(3)); // returns 3
console.log("get(4):", lru.get(4)); // returns 4`,
    testCases: [
      { input: 'capacity = 2, put(1,1), put(2,2), get(1), put(3,3), get(2)', expected: 'get(1) -> 1, get(2) -> -1' },
      { input: 'capacity = 1, put(5,10), put(6,20), get(5)', expected: 'get(5) -> -1 (evicted by 6)' }
    ],
    hints: [
      'What data structure provides O(1) lookup? (Hash Table)',
      'What data structure provides O(1) removal and insertion at head/tail? (Doubly Linked List)',
      'In JavaScript/TypeScript, how can Map insertion order be leveraged?'
    ],
    evaluationCriteria: [
      'Understands O(1) requirement for both get and put',
      'Articulates trade-offs between custom Doubly-Linked-List vs language Map',
      'Handles boundary conditions when capacity is 0 or 1'
    ]
  },
  {
    id: 'prob_rate_limiter',
    title: 'Design a Distributed Rate Limiter',
    topic: 'System Design',
    difficulty: 'Hard',
    targetCompanies: ['Stripe', 'Meta', 'Netflix', 'Uber', 'Cloudflare'],
    description: `Design an API rate limiter service for a global platform handling 50,000,000 active users.

Requirements:
1. Prevent abuse, DDoS, and starvation by limiting requests per IP / User ID (e.g., 100 req/min).
2. Low latency impact: Rate limiter check must return in < 2ms.
3. Accuracy vs latency tradeoff in distributed deployment across multiple regions.
4. Provide meaningful HTTP headers (X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After).`,
    constraints: [
      '50M daily active users, ~100k peak QPS',
      'Minimal latency overhead (<2ms p99)',
      'Fault tolerance: If rate limiter fails, decide Fail-Open vs Fail-Closed'
    ],
    starterCode: `// Distributed Rate Limiter: Redis Sliding Window Lua Script
// KEYS[1]: User or IP rate limit key (e.g. "rate:user:12345")
// ARGV[1]: Current timestamp in milliseconds
// ARGV[2]: Window size in milliseconds (e.g. 60000 for 1 min)
// ARGV[3]: Maximum allowed requests in window (e.g. 100)

const rateLimiterScript = \`
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local clearBefore = now - window

-- 1. Remove old timestamps outside the current window
redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)

-- 2. Count requests in current window
local currentRequests = redis.call('ZCARD', key)

-- 3. Check if threshold exceeded
if currentRequests < limit then
  -- Add current request timestamp
  redis.call('ZADD', key, now, now)
  redis.call('EXPIRE', key, math.ceil(window / 1000))
  return { 1, limit - currentRequests - 1 } -- Allowed
else
  return { 0, 0 } -- Denied / 429 Too Many Requests
end
\`;

console.log("Sliding Window Rate Limiter loaded.");`,
    testCases: [
      { input: '100 requests in 30 seconds (Limit: 100/min)', expected: 'All 100 allowed (200 OK)' },
      { input: '101st request within 45 seconds', expected: 'Rejected (429 Too Many Requests, Retry-After: 15s)' }
    ],
    hints: [
      'Compare Token Bucket, Leaking Bucket, Fixed Window Counter, and Sliding Window Log.',
      'How do you avoid race conditions when multiple concurrent requests hit the limiter? (Redis atomic Lua scripts or Redis cell)',
      'What happens if the Redis cluster has high replication lag between US-East and EU-West?'
    ],
    evaluationCriteria: [
      'Discusses algorithm selection (Token Bucket vs Sliding Window)',
      'Addresses Redis clustering, latency, and single-point-of-failure',
      'Defines HTTP headers and client response codes (429)'
    ]
  },
  {
    id: 'prob_autocomplete',
    title: 'Custom React Autocomplete with Debounce & Cache',
    topic: 'Frontend',
    difficulty: 'Medium',
    targetCompanies: ['Google', 'Meta', 'Airbnb', 'Vercel'],
    description: `Build a performant Autocomplete search input component in React & TypeScript.

Requirements:
1. Debounce user keystrokes (e.g. 300ms) before invoking the search API.
2. In-memory LRU cache to prevent re-fetching previously searched queries.
3. Keyboard accessibility: Support ArrowUp, ArrowDown, Enter, and Escape.
4. Race condition prevention: Ensure stale or delayed network responses do not overwrite newer searches.`,
    constraints: [
      'Accessible with ARIA combobox attributes',
      'Zero duplicate fetches for identical queries',
      'Handle edge cases like empty string, special characters, and network errors'
    ],
    starterCode: `import React, { useState, useEffect, useRef } from 'react';

export function AutocompleteSearch({ onSelect }: { onSelect: (item: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<Map<string, string[]>>(new Map());
  const activeRequestRef = useRef<number>(0);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (cacheRef.current.has(query)) {
      setResults(cacheRef.current.get(query)!);
      return;
    }

    const requestId = ++activeRequestRef.current;
    setLoading(true);

    const timer = setTimeout(async () => {
      // Simulated API query
      const mockDatabase = ['React', 'Redux', 'Rust', 'Ruby', 'Redis', 'Remix', 'React Native'];
      const filtered = mockDatabase.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
      );

      // Verify this is still the most recent request (race condition check)
      if (requestId === activeRequestRef.current) {
        cacheRef.current.set(query, filtered);
        setResults(filtered);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tech stack..."
        className="w-full px-4 py-2 border rounded-lg bg-slate-800 text-white"
      />
      {/* Render dropdown results */}
    </div>
  );
}`,
    testCases: [
      { input: 'Type "Rea" rapidly', expected: 'Only 1 API call made after 300ms idle' },
      { input: 'Type "React", backspace to "Rea", re-type "React"', expected: 'Served from in-memory cache instantly' }
    ],
    hints: [
      'How do you abort or disregard inflight fetch calls? (AbortController or requestId ref)',
      'Why is activeIndex reset needed when query changes?',
      'How to manage WAI-ARIA role="combobox", aria-expanded, aria-activedescendant?'
    ],
    evaluationCriteria: [
      'Correct debounce implementation with cleanup',
      'Race-condition mitigation with AbortController or sequence id',
      'Clean keyboard event handling and accessibility'
    ]
  },
  {
    id: 'prob_behavioral_conflict',
    title: 'STAR Behavioral: Resolving a Critical Technical Disagreement',
    topic: 'Behavioral',
    difficulty: 'Medium',
    targetCompanies: ['Amazon', 'Meta', 'Google', 'Apple', 'Stripe'],
    description: `Structure a compelling behavioral answer using the STAR method (Situation, Task, Action, Result) for the following prompt:

"Tell me about a time when you strongly disagreed with an engineering decision or architecture proposed by a teammate or Tech Lead. How did you navigate the conversation, and what was the outcome?"

Evaluation focus:
• Did you focus on objective data, benchmarks, or prototypes rather than personal opinions?
• How did you balance conviction with empathy and team velocity ("Disagree and Commit")?
• What was the quantifiable business or system impact?`,
    constraints: [
      'Target answer length: 3 to 4 minutes when spoken out loud',
      'Clear structured breakdown: 15% Situation, 15% Task, 50% Action, 20% Result'
    ],
    starterCode: `// STAR Response Outline Framework:
const starStory = {
  situation: "At my previous company, our team was deciding whether to migrate our core monolithic checkout service to 12 microservices vs an optimized modular monolith.",
  task: "As the senior engineer, my goal was to prevent premature distributed complexity while addressing our 400ms database latency during Black Friday surges.",
  action: [
    "1. Rather than arguing in Slack, I created a 1-day proof-of-concept benchmarking the network serialization overhead.",
    "2. Proposed an ADR (Architecture Decision Record) documenting the operational overhead and distributed tracing costs.",
    "3. Facilitated a 30-minute design review with clear tradeoffs and rollback milestones."
  ],
  result: "We retained a modular monolith with Redis read-replicas, reducing p99 latency by 65% and saving 4 months of DevOps re-architecture."
};

console.log("Ready for mock practice!");`,
    testCases: [
      { input: 'Clear quantifiable metric in Result', expected: 'Included: 65% latency reduction & 4 months saved' },
      { input: 'Demonstrates executive presence and collaboration', expected: 'Used data & prototypes instead of emotional debate' }
    ],
    hints: [
      'Avoid blaming the other person; frame it as solving an objective engineering problem.',
      'Show that you listen actively and can disagree and commit if the decision goes the other way.',
      'Always state concrete numbers in your result (e.g. latency, reliability, team velocity, revenue).'
    ],
    evaluationCriteria: [
      'Clear STAR structure with no rambling',
      'Action demonstrates ownership, data-driven reasoning, and diplomacy',
      'Result includes quantifiable metrics and retrospection'
    ]
  }
];

export const INITIAL_SESSIONS: MockInterviewSession[] = [
  {
    id: 'session_mock_1',
    title: 'System Design: Distributed Rate Limiter',
    topic: 'System Design',
    problemId: 'prob_rate_limiter',
    interviewerId: 'user_alex',
    candidateId: 'user_priya',
    scheduledTime: 'Today at 3:00 PM',
    status: 'scheduled',
    durationMinutes: 45,
    notes: 'Alex is interviewing Priya on global rate limiter algorithms and multi-region Redis sync.',
  },
  {
    id: 'session_mock_2',
    title: 'DSA: In-Memory LRU Cache',
    topic: 'Data Structures & Algorithms',
    problemId: 'prob_lru',
    interviewerId: 'user_priya',
    candidateId: 'user_alex',
    scheduledTime: 'Tomorrow at 11:00 AM',
    status: 'scheduled',
    durationMinutes: 45,
    notes: 'Priya interviewing Alex on O(1) cache eviction and thread-safe extensions.',
  }
];
