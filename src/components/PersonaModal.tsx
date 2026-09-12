import React, { useState } from 'react';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { DeveloperPersona, RoleCategory, ExperienceLevel, InterviewTopic, AvailabilityStatus } from '../types';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personaData: Partial<DeveloperPersona>) => void;
  initialData?: DeveloperPersona;
}

const COMMON_COMPANIES = ['Meta', 'Google', 'Stripe', 'Amazon', 'Netflix', 'Apple', 'Microsoft', 'OpenAI', 'Uber', 'Airbnb', 'Datadog', 'Coinbase'];
const COMMON_TECH = ['TypeScript', 'React', 'Node.js', 'Python', 'Go', 'Java', 'Rust', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GraphQL'];
const TOPICS_LIST: InterviewTopic[] = [
  'Data Structures & Algorithms',
  'System Design',
  'Frontend Live Coding',
  'Backend Architecture',
  'Behavioral (STAR Method)',
  'Concurrency & Databases'
];

export const PersonaModal: React.FC<PersonaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(initialData?.name || '');
  const [headline, setHeadline] = useState(initialData?.headline || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [role, setRole] = useState<RoleCategory>(initialData?.role || 'Fullstack');
  const [level, setLevel] = useState<ExperienceLevel>(initialData?.level || 'Senior (5-8y)');
  const [currentCompany, setCurrentCompany] = useState(initialData?.currentCompany || '');
  const [targetCompanies, setTargetCompanies] = useState<string[]>(initialData?.targetCompanies || ['Meta', 'Google']);
  const [customCompanyInput, setCustomCompanyInput] = useState('');
  const [targetTopics, setTargetTopics] = useState<InterviewTopic[]>(initialData?.targetTopics || ['System Design', 'Data Structures & Algorithms']);
  const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || ['TypeScript', 'React', 'Node.js']);
  const [customTechInput, setCustomTechInput] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState(initialData?.preferredLanguage || 'TypeScript');
  const [timezone, setTimezone] = useState(initialData?.timezone || 'UTC-7 (Pacific Time)');
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>(initialData?.availabilityStatus || 'ready_now');

  const toggleCompany = (company: string) => {
    if (targetCompanies.includes(company)) {
      setTargetCompanies(targetCompanies.filter(c => c !== company));
    } else {
      setTargetCompanies([...targetCompanies, company]);
    }
  };

  const addCustomCompany = () => {
    if (customCompanyInput.trim() && !targetCompanies.includes(customCompanyInput.trim())) {
      setTargetCompanies([...targetCompanies, customCompanyInput.trim()]);
      setCustomCompanyInput('');
    }
  };

  const toggleTopic = (topic: InterviewTopic) => {
    if (targetTopics.includes(topic)) {
      setTargetTopics(targetTopics.filter(t => t !== topic));
    } else {
      setTargetTopics([...targetTopics, topic]);
    }
  };

  const toggleTech = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter(t => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  const addCustomTech = () => {
    if (customTechInput.trim() && !techStack.includes(customTechInput.trim())) {
      setTechStack([...techStack, customTechInput.trim()]);
      setCustomTechInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      headline: headline.trim() || `${level} ${role} Engineer | Prepping for ${targetCompanies.join(', ')}`,
      bio: bio.trim() || `Experienced in ${techStack.slice(0, 3).join(', ')}. Looking to practice mock interviews together.`,
      role,
      level,
      currentCompany: currentCompany.trim(),
      targetCompanies,
      targetTopics,
      techStack,
      preferredLanguage,
      timezone,
      availabilityStatus
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {initialData ? 'Edit Developer Persona' : 'Register Developer Persona'}
              </h2>
              <p className="text-xs text-slate-400">
                Set up your interview focus to match with like-minded engineers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name & Headline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Current Company / Status
              </label>
              <input
                type="text"
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="e.g. Fintech Startup or Job Hunting"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Profile Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Backend Dev | Ex-Stripe | Targeting Google L5 & Meta"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Role & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Primary Engineering Domain
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Mobile">Mobile</option>
                <option value="DevOps / Cloud">DevOps / Cloud</option>
                <option value="ML & AI">ML & AI</option>
                <option value="System Architecture">System Architecture</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Experience Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="Junior (0-2y)">Junior (0-2y)</option>
                <option value="Mid-level (2-5y)">Mid-level (2-5y)</option>
                <option value="Senior (5-8y)">Senior (5-8y)</option>
                <option value="Staff / Lead (8y+)">Staff / Lead (8y+)</option>
              </select>
            </div>
          </div>

          {/* Target Companies */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Target Companies (Click to select)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_COMPANIES.map((company) => {
                const isSelected = targetCompanies.includes(company);
                return (
                  <button
                    type="button"
                    key={company}
                    onClick={() => toggleCompany(company)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white ring-1 ring-indigo-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="inline h-3 w-3 mr-1" />}
                    {company}
                  </button>
                );
              })}
            </div>
            {/* Custom company input */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add other target company..."
                value={customCompanyInput}
                onChange={(e) => setCustomCompanyInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomCompany(); } }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs flex-1 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addCustomCompany}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium text-white flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Target Topics */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Target Interview Topics
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOPICS_LIST.map((topic) => {
                const isSelected = targetTopics.includes(topic);
                return (
                  <button
                    type="button"
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{topic}</span>
                    {isSelected ? <Check className="h-4 w-4 text-indigo-400" /> : <div className="w-4 h-4 rounded border border-slate-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Primary Tech Stack & Tools
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_TECH.map((tech) => {
                const isSelected = techStack.includes(tech);
                return (
                  <button
                    type="button"
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add other language or tool (e.g. Next.js, Kafka)..."
                value={customTechInput}
                onChange={(e) => setCustomTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTech(); } }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs flex-1 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addCustomTech}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium text-white flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Bio & Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Availability Status
              </label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="ready_now">Ready to Mock Right Now 🟢</option>
                <option value="available_today">Available Later Today 🟡</option>
                <option value="weekend">Available on Weekends 🔵</option>
                <option value="offline">Busy / Offline ⚪</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Coding Interview Language
              </label>
              <input
                type="text"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                placeholder="e.g. TypeScript, Python, or Java"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Short Bio & Mock Preferences
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What are you focusing on? e.g. 'Looking to do 45-min rounds on Distributed Systems and NeetCode 150 hard problems. Open to giving rigorous feedback!'"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all"
            >
              {initialData ? 'Update Profile' : 'Save & Join Hub'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
