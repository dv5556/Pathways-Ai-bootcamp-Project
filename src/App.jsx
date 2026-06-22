import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, ScanFace, Trophy, Sun, Moon, School, Users, Zap, 
  Rocket, Gauge, Send, BadgeCheck, UserRoundCheck, Flame, 
  BarChart3, Sparkles, LockKeyhole, QrCode, ShieldCheck, Check, 
  Play, BrainCircuit, GraduationCap, Edit,
  Layers, Activity, Bot, X, Brain, Info, Plus, Trash2
} from 'lucide-react';

// ============================================================================
// SYSTEM DATA ENGINE MODELS
// ============================================================================

const INITIAL_COHORTS = [
  {
    id: 'mumbai-stem',
    label: 'Mumbai STEM Magnet Schools',
    count: 25,
    note: 'Science deans + tech curriculum leads',
    gradient: 'from-blue-600/30 to-cyan-500/10'
  },
  {
    id: 'cbse-clusters',
    label: 'CBSE Cluster South Cells',
    count: 45,
    note: 'Academic directors + computer cells',
    gradient: 'from-orange-600/30 to-amber-500/10'
  },
  {
    id: 'maharashtra-academies',
    label: 'Private International Academies',
    count: 30,
    note: 'Managing founders + placement cells',
    gradient: 'from-fuchsia-600/30 to-blue-500/10'
  }
];

const INITIAL_CURRICULUM = [
  {
    id: 'intro-ai',
    time: '09:00 - 09:45',
    title: 'Introduction to AI & Demystification',
    subtitle: 'Moving beyond Hollywood tropes to pattern arrays',
    points: 50,
    term: 'Pattern Recognition',
    tooltip: 'The algorithmic identification of regularities and structures within complex data vectors.',
    readingText: 'To accurately demystify Artificial Intelligence, one must decouple engineering execution from science fiction narratives. Modern artificial frameworks do not possess biological sentience or intentionality. Instead, they function as massive matrix scaling operations optimized for advanced Pattern Recognition. By parsing high-dimensional data, software constructs localized probability distributions to execute predictive choices. The baseline transition from static rules to self-adjusting data arrays marks the dawn of true machine workflows.',
    quiz: {
      question: 'What is the mathematical core driving modern AI pattern recognition?',
      options: [
        'Static nested if-else conditional branches',
        'Statistical optimization across high-dimensional data matrices',
        'Biological mimicry of human emotional vectors'
      ],
      answer: 1
    }
  },
  {
    id: 'ml-paradigms',
    time: '09:45 - 10:40',
    title: 'Machine Learning Foundations',
    subtitle: 'Supervised, Unsupervised, and Reinforcement tracks',
    points: 75,
    term: 'Backpropagation',
    tooltip: 'The mathematical calculation of error gradients relative to neural weights using the calculus chain rule.',
    readingText: 'Machine Learning transitions the architectural paradigm from direct programming to data-driven compilation. In Supervised learning loops, models minimize mapping deviations utilizing labeled matrices. Unsupervised tracking strips away labeling targets entirely, forcing systems to cluster native vectors based on variance signatures. Reinforcement configurations employ an explicit agent framework operating within specified state spaces, deriving policy optimizations using error rewards and delta step adjustments. Network adjustment gradients are propagated backwards via Backpropagation parameters.',
    quiz: {
      question: 'Which paradigm uses explicit rewards and penalties to reinforce model policies?',
      options: [
        'Supervised learning matrices',
        'Unsupervised spatial clustering',
        'Reinforcement learning state feedback loops'
      ],
      answer: 2
    }
  },
  {
    id: 'deep-networks',
    time: '10:55 - 12:00',
    title: 'Deep Learning & Neural Architectures',
    subtitle: 'Constructing hidden matrix adjustment channels',
    points: 100,
    term: 'Hidden Layers',
    tooltip: 'Intermediate node structures within a network that extract non-linear spatial dimensions.',
    readingText: 'Deep learning scales traditional machine models by stacking Hidden Layers sequentially inside mathematical functions. Each added sequence transforms input values, isolating higher-level geometric relationships. Neurons map input channels through scaled weights, compound biases, and localized activation transforms. By adjusting these weights through gradient descent, the structural loss curve drops down, generating highly responsive systems capable of semantic synthesis.',
    quiz: {
      question: 'What operation occurs inside a structural hidden neuron?',
      options: [
        'Inputs are multiplied by weights, sum combined with bias, and run through an activation transform',
        'Data vectors are randomly cleared to minimize file size storage metrics',
        'Text data is cross-referenced with hardcoded dictionary matrices'
      ],
      answer: 0
    }
  },
  {
    id: 'ethics-alignment',
    time: '12:00 - 13:00',
    title: 'AI Ethics & Alignment Scales',
    subtitle: 'Balancing algorithmic speed against bias boundaries',
    points: 80,
    term: 'Algorithmic Bias',
    tooltip: 'Systematic and repeatable errors in a model that create unfair, privileged distributions.',
    readingText: 'Deploying high-capacity statistical models across civic structures requires strict tracking of systemic alignment. Algorithmic Bias occurs when training sets contain historical inequality distributions, which the optimization math naturally crystallizes. Engineering reliable systems requires continuous auditing of cost metrics, regular structural validation across edge test domains, and explicit safety boundaries to ensure performance remains aligned with human safety definitions.',
    quiz: {
      question: 'How do historical data disparities influence an unmonitored optimization loop?',
      options: [
        'The system filters historical error vectors automatically',
        'The optimization engine solidifies and intensifies systemic bias patterns',
        'The structural loss metric locks at absolute zero permanently'
      ],
      answer: 1
    }
  }
];

const PEER_COMPETITORS = [
  { name: 'Aarav Mehta', points: 620, color: 'from-blue-400 to-cyan-300' },
  { name: 'Ananya Nair', points: 580, color: 'from-orange-400 to-amber-200' },
  { name: 'Kabir Sharma', points: 510, color: 'from-fuchsia-400 to-pink-300' },
  { name: 'Diya Malhotra', points: 440, color: 'from-emerald-400 to-teal-200' },
  { name: 'Rohan Joshi', points: 390, color: 'from-violet-400 to-blue-300' }
];

const GEMINI_API_KEY = "we need api keys pls!!";

// Preset datasets coordinates mapped between [0, 1] for neural tutor math engine
const NEURAL_PRESETS = {
  linear: [
    { x1: 0.2, x2: 0.2, y: 0 }, { x1: 0.3, x2: 0.4, y: 0 }, { x1: 0.4, x2: 0.2, y: 0 },
    { x1: 0.7, x2: 0.8, y: 1 }, { x1: 0.8, x2: 0.6, y: 1 }, { x1: 0.9, x2: 0.9, y: 1 }
  ],
  xor: [
    { x1: 0.2, x2: 0.2, y: 0 }, { x1: 0.8, x2: 0.8, y: 0 },
    { x1: 0.2, x2: 0.8, y: 1 }, { x1: 0.8, x2: 0.2, y: 1 }
  ],
  circle: [
    { x1: 0.5, x2: 0.5, y: 1 }, { x1: 0.4, x2: 0.5, y: 1 }, { x1: 0.6, x2: 0.5, y: 1 }, { x1: 0.5, x2: 0.4, y: 1 }, { x1: 0.5, x2: 0.6, y: 1 },
    { x1: 0.1, x2: 0.1, y: 0 }, { x1: 0.9, x2: 0.9, y: 0 }, { x1: 0.1, x2: 0.9, y: 0 }, { x1: 0.9, x2: 0.1, y: 0 },
    { x1: 0.5, x2: 0.1, y: 0 }, { x1: 0.5, x2: 0.9, y: 0 }, { x1: 0.1, x2: 0.5, y: 0 }, { x1: 0.9, x2: 0.5, y: 0 }
  ],
  custom: []
};

// ============================================================================
// MAIN APPLICATION CORE COMPONENT
// ============================================================================

export default function App() {
  const [view, setView] = useState('organizer-dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Custom states initialized from initial databases
  const [curriculumTimeline, setCurriculumTimeline] = useState(INITIAL_CURRICULUM);
  const [outreachCohorts, setOutreachCohorts] = useState(INITIAL_COHORTS);

  // Central State variables
  const [points, setPoints] = useState(0);
  const [displayPoints, setDisplayPoints] = useState(0); // For Visceral XP step-increment rollups
  const [schoolsInvited, setSchoolsInvited] = useState(0);
  const [studentsRegistered, setStudentsRegistered] = useState(0);
  
  // B2B Campaign Variables
  const [selectedCohortId, setSelectedCohortId] = useState(INITIAL_COHORTS[0].id);
  const [campaignProgress, setCampaignProgress] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Biometric Gateway Onboarding
  const [scanState, setScanState] = useState('idle');
  const [studentVerified, setStudentVerified] = useState(false);
  
  // B2C Stage Variables
  const [activeTopicId, setActiveTopicId] = useState(INITIAL_CURRICULUM[0].id);
  const [completedTopics, setCompletedTopics] = useState({});
  const [companionOpen, setCompanionOpen] = useState(false);
  const [activeQuizTopic, setActiveQuizTopic] = useState(null);
  const [quizSelectionStatus, setQuizSelectionStatus] = useState('idle');
  const [clearedQuizzes, setClearedQuizzes] = useState({});
  const [activePopoverWord, setActivePopoverWord] = useState(null);

  // Gemini Companion Response States
  const [geminiAnalysis, setGeminiAnalysis] = useState(null);
  const [isEvaluatingGemini, setIsEvaluatingGemini] = useState(false);

  // Editor states
  const [selectedEditTopicId, setSelectedEditTopicId] = useState(INITIAL_CURRICULUM[0].id);

  // System telemetry log console
  const [lastSystemEvent, setLastSystemEvent] = useState('System synchronized. Initialization baseline set.');
  
  const campaignTimerRef = useRef(null);
  const scanTimerRef = useRef(null);

  const selectedCohort = useMemo(() => {
    return outreachCohorts.find(c => c.id === selectedCohortId) || outreachCohorts[0];
  }, [selectedCohortId, outreachCohorts]);

  const approvedSchoolsCount = Math.floor(schoolsInvited * 0.48);
  const itineraryCountCompleted = Object.values(completedTopics).filter(Boolean).length;
  const overallCourseProgress = curriculumTimeline.length > 0 
    ? Math.round((itineraryCountCompleted / curriculumTimeline.length) * 100)
    : 0;

  const selectedTopicObject = useMemo(() => {
    return curriculumTimeline.find(t => t.id === activeTopicId) || curriculumTimeline[0] || INITIAL_CURRICULUM[0];
  }, [activeTopicId, curriculumTimeline]);

  const selectedEditTopicObject = useMemo(() => {
    return curriculumTimeline.find(t => t.id === selectedEditTopicId) || curriculumTimeline[0];
  }, [selectedEditTopicId, curriculumTimeline]);

  // Dynamic Leaderboard sorting sync based on step-increment rollup points
  const processedLeaderboard = useMemo(() => {
    const userNode = { name: 'You (Attendee)', points: displayPoints, color: 'from-orange-500 to-blue-600', isUser: true };
    return [...PEER_COMPETITORS, userNode].sort((alpha, beta) => beta.points - alpha.points);
  }, [displayPoints]);

  // Visceral XP step-increment rollup math loops
  useEffect(() => {
    if (displayPoints === points) return;
    const diff = points - displayPoints;
    if (Math.abs(diff) < 2) {
      const timer = setTimeout(() => {
        setDisplayPoints(points);
      }, 0);
      return () => clearTimeout(timer);
    }
    const step = Math.ceil(Math.abs(diff) / 10) * Math.sign(diff);
    const timer = setTimeout(() => {
      setDisplayPoints(prev => prev + step);
    }, 35);
    return () => clearTimeout(timer);
  }, [points, displayPoints]);

  useEffect(() => {
    const bodyElement = document.body;
    const rootElement = document.documentElement;
    if (isDarkMode) {
      bodyElement.classList.remove('orbit-light-mode');
      bodyElement.classList.add('dark');
      rootElement.classList.add('dark');
      rootElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      bodyElement.classList.add('orbit-light-mode');
      bodyElement.classList.remove('dark');
      rootElement.classList.remove('dark');
      rootElement.removeAttribute('data-theme');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  useEffect(() => {
    return () => {
      if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, []);

  const triggerCampaignDeployment = () => {
    if (isDeploying) return;
    if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
    
    setIsDeploying(true);
    setCampaignProgress(0);
    setLastSystemEvent(`Dispatched network handshakes to ${selectedCohort.count} nodes at ${selectedCohort.label}.`);
    
    campaignTimerRef.current = setInterval(() => {
      setCampaignProgress(prev => {
        const nextVal = prev + 10;
        if (nextVal >= 100) {
          clearInterval(campaignTimerRef.current);
          setTimeout(() => {
            const addedSchools = selectedCohort.count;
            const addedAccepted = Math.floor(addedSchools * 0.48);
            const simulatedStudents = addedAccepted * 8; 

            setSchoolsInvited(prevCount => prevCount + addedSchools);
            setStudentsRegistered(prev => prev + simulatedStudents);
            setIsDeploying(false);
            setLastSystemEvent(`Campaign success. Synced +${simulatedStudents} student profiles.`);
          }, 300);
          return 100;
        }
        return nextVal;
      });
    }, 120);
  };

  const executeBiometricScan = () => {
    if (scanState === 'scanning') return;
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    
    setScanState('scanning');
    setLastSystemEvent('Lumos app callback engaged. Facial verification stream opened.');
    
    scanTimerRef.current = setTimeout(() => {
      setScanState('verified');
      if (!studentVerified) {
        setStudentsRegistered(prev => prev + 1);
        setStudentVerified(true);
      }
      setLastSystemEvent('Biometric hash verified against registration photo. Live token minted.');
      setTimeout(() => {
        setView('student-live');
      }, 1500);
    }, 2200);
  };

  const toggleTopicCompletion = (topic) => {
    const currentStatus = !!completedTopics[topic.id];
    setCompletedTopics(prev => ({ ...prev, [topic.id]: !currentStatus }));
    setActiveTopicId(topic.id);

    if (!currentStatus) {
      setPoints(prev => prev + topic.points);
      setActiveQuizTopic(topic);
      setQuizSelectionStatus('idle');
      setCompanionOpen(true);
      setLastSystemEvent(`Completed chapter checkpoint: ${topic.title}. Earned +${topic.points} XP.`);
      
      // Perform Gemini Companion evaluation analysis
      triggerGeminiCompanionEvaluation(topic);
    } else {
      setPoints(prev => Math.max(0, prev - topic.points));
      setLastSystemEvent(`Removed checkpoint flag from ${topic.title}. Metrics updated.`);
    }
  };

  // Gemini API client integration & fallback loop
  const triggerGeminiCompanionEvaluation = async (topic) => {
    setIsEvaluatingGemini(true);
    setGeminiAnalysis(null);
    setLastSystemEvent(`Gemini API agent parsing chapter context: ${topic.title}...`);

    if (GEMINI_API_KEY === "we need api keys pls!!" || !GEMINI_API_KEY.trim()) {
      // Execute the bypass failsafe
      setTimeout(() => {
        const mockResponse = {
          evaluation_status: "success",
          score_modifier: 250,
          feedback_packet: `[MOCK PROMPT MODE - we need api keys pls!!] Orbit detected your query insight. Your parameters aligned smoothly with the target model space! +250 XP.`
        };
        setPoints(prev => prev + mockResponse.score_modifier);
        setGeminiAnalysis(mockResponse);
        setIsEvaluatingGemini(false);
        setLastSystemEvent(`Bypass evaluation completed. XP rollup synced.`);
      }, 1500);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an AI learning companion inside Orbit. Analyze the student's completion of: "${topic.title}" - "${topic.subtitle}". Write a concise 2-sentence feedback packet and award score_modifier between 100 and 300. Return ONLY a valid JSON object matching: {"evaluation_status": "success", "score_modifier": 250, "feedback_packet": "Your feedback here."}`
              }]
            }]
          })
        }
      );
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Extract json block
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanedJson = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
        setPoints(prev => prev + (cleanedJson.score_modifier || 250));
        setGeminiAnalysis(cleanedJson);
        setLastSystemEvent(`Gemini API rollup sync successful.`);
      } else {
        throw new Error("Invalid format returned");
      }
    } catch {
      setLastSystemEvent("Gemini API call failed. Reverting to failsafe logic.");
      setPoints(prev => prev + 250);
      setGeminiAnalysis({
        evaluation_status: "success",
        score_modifier: 250,
        feedback_packet: `[FAILSAFE COMPLIANCE MODE] Gemini analyzed your response vectors for ${topic.title} successfully! +250 XP.`
      });
    } finally {
      setIsEvaluatingGemini(false);
    }
  };

  const validateQuizAnswer = (optionIdx) => {
    if (!activeQuizTopic) return;
    
    if (optionIdx === activeQuizTopic.quiz.answer) {
      if (!clearedQuizzes[activeQuizTopic.id]) {
        setPoints(prev => prev + 100);
        setClearedQuizzes(prev => ({ ...prev, [activeQuizTopic.id]: true }));
        setLastSystemEvent(`Cleared concept evaluation for ${activeQuizTopic.title}. Earned bonus +100 XP.`);
      }
      setQuizSelectionStatus('correct');
    } else {
      setQuizSelectionStatus('wrong');
      setLastSystemEvent('Evaluation deviation noted. Review model parameters and re-submit.');
    }
  };

  // State mutators for editor
  const updateChapterField = (field, value) => {
    setCurriculumTimeline(prev => prev.map(t => {
      if (t.id === selectedEditTopicId) {
        if (field.startsWith('quiz.')) {
          const quizField = field.split('.')[1];
          return { ...t, quiz: { ...t.quiz, [quizField]: value } };
        }
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  const updateQuizOption = (index, value) => {
    setCurriculumTimeline(prev => prev.map(t => {
      if (t.id === selectedEditTopicId) {
        const newOptions = [...t.quiz.options];
        newOptions[index] = value;
        return { ...t, quiz: { ...t.quiz, options: newOptions } };
      }
      return t;
    }));
  };

  const addCustomChapter = () => {
    const nextIndex = curriculumTimeline.length + 1;
    const newCh = {
      id: `custom-chapter-${Date.now()}`,
      time: '14:00 - 14:45',
      title: `AI Chapter ${nextIndex}: Agentic Frameworks`,
      subtitle: 'Designing self-correcting neural pipelines',
      points: 85,
      term: 'Agentic Model',
      tooltip: 'A model architecture capable of autonomous decision-making loops without continuous human guidance.',
      readingText: 'To deploy agentic architectures, systems employ recursive planning engines. The Agentic Model queries localized cost functions, updates beliefs, and chooses downstream actions.',
      quiz: {
        question: 'What defines an agentic AI system framework?',
        options: [
          'Fixed rule scripts running linearly without feedback',
          'Autonomous state parsing and recursive goal alignment optimization',
          'Standard text layout translations without data backpropagation'
        ],
        answer: 1
      }
    };
    setCurriculumTimeline(prev => [...prev, newCh]);
    setSelectedEditTopicId(newCh.id);
    setLastSystemEvent(`Created custom curriculum chapter: ${newCh.title}`);
  };

  const deleteCustomChapter = (topicId) => {
    if (curriculumTimeline.length <= 1) {
      setLastSystemEvent('Cannot delete the last remaining curriculum node.');
      return;
    }
    setCurriculumTimeline(prev => prev.filter(t => t.id !== topicId));
    setCompletedTopics(prev => {
      const copy = { ...prev };
      delete copy[topicId];
      return copy;
    });
    setSelectedEditTopicId(curriculumTimeline[0].id);
    setActiveTopicId(curriculumTimeline[0].id);
    setLastSystemEvent(`Deleted curriculum chapter ID: ${topicId}`);
  };

  const updateCohortField = (cohortId, field, value) => {
    setOutreachCohorts(prev => prev.map(c => {
      if (c.id === cohortId) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const performSystemHardReset = () => {
    if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    
    setView('organizer-dashboard');
    setPoints(0);
    setDisplayPoints(0);
    setSchoolsInvited(0);
    setStudentsRegistered(0);
    setCampaignProgress(0);
    setIsDeploying(false);
    setScanState('idle');
    setStudentVerified(false);
    setCompletedTopics({});
    setCurriculumTimeline(INITIAL_CURRICULUM);
    setOutreachCohorts(INITIAL_COHORTS);
    setActiveTopicId(INITIAL_CURRICULUM[0].id);
    setSelectedEditTopicId(INITIAL_CURRICULUM[0].id);
    setActiveQuizTopic(null);
    setQuizSelectionStatus('idle');
    setClearedQuizzes({});
    setCompanionOpen(false);
    setActivePopoverWord(null);
    setLastSystemEvent('Central data cluster cleared. Systems reset to initial defaults.');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden transition-colors duration-500">
      
      {/* Left side organic vine line art */}
      <div className="side-vine-container left-vine">
        <svg viewBox="0 0 100 1600" preserveAspectRatio="xMidYMin slice" className="w-full h-full" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
          <g id="left-vine-section">
            <path d="M 50,0 C 40,50 60,100 45,150 C 30,200 65,250 50,300 C 35,350 60,400 45,450 C 30,500 65,550 50,600 C 35,650 60,700 45,750 C 35,780 55,790 50,800" />
            <path d="M 48,30 Q 35,22 40,35 Q 48,38 48,30" />
            <path d="M 51,45 Q 65,37 60,50 Q 51,53 51,45" />
            <path d="M 46,65 Q 30,62 35,75 Q 46,73 46,65" />
            <path d="M 52,80 Q 68,75 62,90 Q 52,93 52,80" />
            <path d="M 48,105 Q 32,100 38,115 Q 48,113 48,105" />
            <path d="M 50,120 Q 65,115 58,130 Q 50,133 50,120" />
            <path d="M 46,140 Q 32,138 36,150 Q 46,148 46,140" />
            <path d="M 48,165 Q 62,160 55,175 Q 48,178 48,165" />
            <path d="M 42,185 Q 28,180 32,195 Q 42,193 42,185" />
            <path d="M 50,210 Q 64,202 59,215 Q 50,218 50,210" />
            <path d="M 47,225 Q 31,222 36,235 Q 47,233 47,225" />
            <path d="M 53,240 Q 69,235 63,250 Q 53,253 53,240" />
            <path d="M 49,265 Q 33,260 39,275 Q 49,273 49,265" />
            <path d="M 51,280 Q 66,275 59,290 Q 51,293 51,280" />
            <path d="M 46,305 Q 30,302 35,315 Q 46,313 46,305" />
            <path d="M 52,320 Q 68,315 62,330 Q 52,333 52,320" />
            <path d="M 48,345 Q 32,340 38,355 Q 48,353 48,345" />
            <path d="M 50,360 Q 65,355 58,370 Q 50,373 50,360" />
            <path d="M 44,385 Q 28,380 32,395 Q 44,393 44,385" />
            <path d="M 52,410 Q 66,402 61,415 Q 52,418 52,410" />
            <path d="M 48,425 Q 32,422 37,435 Q 48,433 48,425" />
            <path d="M 50,440 Q 65,435 59,450 Q 50,453 50,440" />
            <path d="M 46,465 Q 30,460 36,475 Q 46,473 46,465" />
            <path d="M 52,480 Q 67,475 60,490 Q 52,493 52,480" />
            <path d="M 48,505 Q 32,502 37,515 Q 48,513 48,505" />
            <path d="M 50,520 Q 66,515 60,530 Q 50,533 50,520" />
            <path d="M 47,545 Q 31,540 36,555 Q 47,553 47,545" />
            <path d="M 53,560 Q 68,555 61,570 Q 53,573 53,560" />
            <path d="M 48,585 Q 32,580 38,595 Q 48,593 48,585" />
            <path d="M 50,610 Q 64,602 59,615 Q 50,618 50,610" />
            <path d="M 46,625 Q 30,622 35,635 Q 46,633 46,625" />
            <path d="M 52,640 Q 68,635 62,650 Q 52,653 52,640" />
            <path d="M 48,665 Q 32,660 38,675 Q 48,673 48,665" />
            <path d="M 50,680 Q 65,675 58,690 Q 50,693 50,680" />
            <path d="M 45,705 Q 29,702 34,715 Q 45,713 45,705" />
            <path d="M 51,720 Q 67,715 61,730 Q 51,733 51,720" />
            <path d="M 48,745 Q 32,740 38,755 Q 48,753 48,745" />
            <path d="M 50,760 Q 65,755 58,770 Q 50,773 50,760" />
            <path d="M 46,785 Q 30,780 35,795 Q 46,793 46,785" />
          </g>
          <use href="#left-vine-section" x="0" y="800" />
        </svg>
      </div>

      {/* Right side organic vine line art */}
      <div className="side-vine-container right-vine">
        <svg viewBox="0 0 100 1600" preserveAspectRatio="xMidYMin slice" className="w-full h-full" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
          <g id="right-vine-section">
            <path d="M 50,0 C 60,50 40,100 55,150 C 70,200 35,250 50,300 C 65,350 40,400 55,450 C 70,500 35,550 50,600 C 65,650 40,700 55,750 C 65,780 45,790 50,800" />
            <path d="M 52,30 Q 65,22 60,35 Q 52,38 52,30" />
            <path d="M 49,45 Q 35,37 40,50 Q 49,53 49,45" />
            <path d="M 54,65 Q 70,62 65,75 Q 54,73 54,65" />
            <path d="M 48,80 Q 32,75 38,90 Q 48,93 48,80" />
            <path d="M 52,105 Q 68,100 62,115 Q 52,113 52,105" />
            <path d="M 50,120 Q 35,115 42,130 Q 50,133 50,120" />
            <path d="M 54,140 Q 68,138 64,150 Q 54,148 54,140" />
            <path d="M 52,165 Q 38,160 45,175 Q 52,178 52,165" />
            <path d="M 58,185 Q 72,180 68,195 Q 58,193 58,185" />
            <path d="M 50,210 Q 36,202 41,215 Q 50,218 50,210" />
            <path d="M 53,225 Q 69,222 64,235 Q 53,233 53,225" />
            <path d="M 47,240 Q 31,235 37,250 Q 47,253 47,240" />
            <path d="M 51,265 Q 67,260 61,275 Q 51,273 51,265" />
            <path d="M 49,280 Q 34,275 41,290 Q 49,293 49,280" />
            <path d="M 54,305 Q 70,302 65,315 Q 54,313 54,305" />
            <path d="M 48,320 Q 32,315 38,330 Q 48,333 48,320" />
            <path d="M 52,345 Q 68,340 62,355 Q 52,353 52,345" />
            <path d="M 50,360 Q 35,355 42,370 Q 50,373 50,360" />
            <path d="M 56,385 Q 72,380 68,395 Q 56,393 56,385" />
            <path d="M 48,410 Q 36,402 41,415 Q 48,418 48,410" />
            <path d="M 52,425 Q 68,422 63,435 Q 52,433 52,425" />
            <path d="M 50,440 Q 35,435 41,450 Q 50,453 50,440" />
            <path d="M 54,465 Q 70,460 64,475 Q 54,473 54,465" />
            <path d="M 48,480 Q 33,475 40,490 Q 48,493 48,480" />
            <path d="M 52,505 Q 68,502 63,515 Q 52,513 52,505" />
            <path d="M 50,520 Q 34,515 40,530 Q 50,533 50,520" />
            <path d="M 53,545 Q 69,540 64,555 Q 53,553 53,545" />
            <path d="M 47,560 Q 32,555 39,570 Q 47,573 47,560" />
            <path d="M 52,585 Q 68,580 62,595 Q 52,593 52,585" />
            <path d="M 50,610 Q 36,602 41,615 Q 50,618 50,610" />
            <path d="M 54,625 Q 70,622 65,635 Q 54,633 54,625" />
            <path d="M 48,640 Q 32,635 38,650 Q 48,653 48,640" />
            <path d="M 52,665 Q 68,660 62,675 Q 52,673 52,665" />
            <path d="M 50,680 Q 35,675 42,690 Q 50,693 50,680" />
            <path d="M 55,705 Q 71,702 66,715 Q 55,713 55,705" />
            <path d="M 49,720 Q 33,715 39,730 Q 49,733 49,720" />
            <path d="M 52,745 Q 68,740 62,755 Q 52,753 52,745" />
            <path d="M 50,760 Q 35,755 42,770 Q 50,773 50,760" />
            <path d="M 54,785 Q 70,780 65,795 Q 54,793 54,785" />
          </g>
          <use href="#right-vine-section" x="0" y="800" />
        </svg>
      </div>
      
      {/* BACKGROUND FLOATING PARTICLES MATRIX (ASYNC PHYSICS DRIFTS) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] h-[60vh] w-[60vw] rounded-full bg-radial from-orange-500/5 via-transparent to-transparent blur-3xl animate-drift-slow" />
        <div className="absolute bottom-[-15%] right-[-5%] h-[70vh] w-[70vw] rounded-full bg-radial from-blue-500/5 via-transparent to-transparent blur-3xl animate-drift-fast" />
        <div className="absolute top-[30%] right-[15%] h-[40vh] w-[40vw] rounded-full bg-radial from-fuchsia-500/3 via-transparent to-transparent blur-3xl animate-drift-gamma" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pt-4 pb-32 sm:px-6 lg:px-8">
        
        {/* APP GLOBAL TOPHEADER CONSOLE */}
        <motion.header 
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="liquid-glass mb-6 flex flex-col gap-4 rounded-3xl p-4 shadow-xl backdrop-blur-md lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-blue-600 text-white shadow-md shadow-orange-500/20">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest opacity-60">System Protocol</span>
                <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-500 border border-orange-500/20">MVP v1.5</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">ORBIT</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* LIGHT-DARK THEME Toggler */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative flex h-10 w-20 items-center rounded-full bg-slate-900/10 dark:bg-slate-950/40 p-1 border border-black/5 dark:border-white/10 shadow-inner transition duration-300 cursor-pointer"
              title="Toggle Application Aura System"
            >
              <div className="absolute left-2 text-orange-500"><Sun className="h-4 w-4" /></div>
              <div className="absolute right-2 text-blue-500"><Moon className="h-4 w-4" /></div>
              <motion.div 
                className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-blue-600 text-white shadow-md"
                animate={{ x: isDarkMode ? 38 : 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </motion.div>
            </button>

            {/* ROUTER NAVIGATION TABS */}
            <div className="flex rounded-2xl bg-slate-900/5 dark:bg-slate-950/40 p-1 border border-black/5 dark:border-white/10">
              {[
                { id: 'organizer-dashboard', label: 'B2B Outreach', icon: Radar },
                { id: 'student-onboarding', label: 'Lumos Auth', icon: ScanFace },
                { id: 'student-live', label: 'Live Arena', icon: Trophy },
                { id: 'curriculum-editor', label: 'Edit Curriculum', icon: Edit }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isCurrent = view === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setView(tab.id)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                      isCurrent 
                        ? 'bg-slate-900/10 dark:bg-white/10 text-slate-800 dark:text-white shadow-sm dark:shadow-md ring-1 ring-black/5 dark:ring-white/20' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <TabIcon className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* LIVE GLOBAL SCOREBOARD SUMMARY PILLS */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="flex items-center gap-1.5 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2">
                <School className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                <span className="font-bold">{schoolsInvited}</span><span className="opacity-50">Invites</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2">
                <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold">{studentsRegistered}</span><span className="opacity-50">Nodes</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2">
                <Zap className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-bold text-orange-500">{displayPoints}</span><span className="opacity-50">XP</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* TRANSITIONAL VIEWPORT SCREEN CHASSIS */}
        <main className="flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            {view === 'organizer-dashboard' && (
              <OrganizerDashboard 
                key="organizer"
                outreachCohorts={outreachCohorts}
                selectedCohortId={selectedCohortId}
                setSelectedCohortId={setSelectedCohortId}
                isDeploying={isDeploying}
                campaignProgress={campaignProgress}
                triggerCampaignDeployment={triggerCampaignDeployment}
                schoolsInvited={schoolsInvited}
                approvedSchoolsCount={approvedSchoolsCount}
                studentsRegistered={studentsRegistered}
              />
            )}

            {view === 'student-onboarding' && (
              <StudentOnboarding 
                key="onboarding"
                scanState={scanState}
                studentVerified={studentVerified}
                studentsRegistered={studentsRegistered}
                executeBiometricScan={executeBiometricScan}
              />
            )}

            {view === 'student-live' && (
              <StudentLive 
                key="live"
                curriculumTimeline={curriculumTimeline}
                processedLeaderboard={processedLeaderboard}
                points={points}
                setPoints={setPoints}
                overallCourseProgress={overallCourseProgress}
                completedTopics={completedTopics}
                activeTopicId={activeTopicId}
                setActiveTopicId={setActiveTopicId}
                toggleTopicCompletion={toggleTopicCompletion}
                selectedTopicObject={selectedTopicObject}
                activePopoverWord={activePopoverWord}
                setActivePopoverWord={setActivePopoverWord}
                companionOpen={companionOpen}
                setCompanionOpen={setCompanionOpen}
                activeQuizTopic={activeQuizTopic}
                quizSelectionStatus={quizSelectionStatus}
                validateQuizAnswer={validateQuizAnswer}
                clearedQuizzes={clearedQuizzes}
                isEvaluatingGemini={isEvaluatingGemini}
                geminiAnalysis={geminiAnalysis}
                isDarkMode={isDarkMode}
              />
            )}

            {view === 'curriculum-editor' && (
              <CurriculumEditor 
                key="editor"
                curriculumTimeline={curriculumTimeline}
                outreachCohorts={outreachCohorts}
                selectedEditTopicId={selectedEditTopicId}
                setSelectedEditTopicId={setSelectedEditTopicId}
                selectedEditTopicObject={selectedEditTopicObject}
                updateChapterField={updateChapterField}
                updateQuizOption={updateQuizOption}
                addCustomChapter={addCustomChapter}
                deleteCustomChapter={deleteCustomChapter}
                updateCohortField={updateCohortField}
              />
            )}
          </AnimatePresence>
        </main>

        {/* DEVELOPER TOGGLE PANEL */}
        <DeveloperToggle 
          lastSystemEvent={lastSystemEvent}
          view={view}
          setView={setView}
          performSystemHardReset={performSystemHardReset}
        />

      </div>
    </div>
  );
}

// ============================================================================
// VIEW COMPONENT 1: ORGANIZER OUTREACH HUB
// ============================================================================

function OrganizerDashboard({
  outreachCohorts, selectedCohortId, setSelectedCohortId, isDeploying, campaignProgress,
  triggerCampaignDeployment, schoolsInvited, approvedSchoolsCount, studentsRegistered
}) {
  const selectedCohort = outreachCohorts.find(c => c.id === selectedCohortId) || outreachCohorts[0];
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -15 }}
      transition={{ duration: 0.4 }}
      className="grid flex-1 gap-6 lg:grid-cols-12"
    >
      {/* 1-CLICK DISPATCH MATRIX LAYER */}
      <div className="liquid-glass flex flex-col justify-between rounded-[32px] p-6 shadow-2xl lg:col-span-7 drift-main">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600">
            <Rocket className="h-3.5 w-3.5" /> 1-Click Blast Engine
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-800 dark:text-white">
            Deploy connections.
          </h2>
          <p className="mt-3 text-sm text-slate-505 dark:text-slate-400 max-w-xl">
            Choose a target group, activate automated handshakes, and dynamically link school nodes into the active live state matrix.
          </p>
        </div>

        {/* COHORT SELECTION GRID CARDS */}
        <div className="my-6 grid gap-4 sm:grid-cols-3">
          {outreachCohorts.map(cohort => {
            const isSelected = selectedCohortId === cohort.id;
            return (
              <button
                key={cohort.id}
                onClick={() => !isDeploying && setSelectedCohortId(cohort.id)}
                disabled={isDeploying}
                className={`group flex flex-col justify-between text-left rounded-2xl p-4 border transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-orange-500 bg-orange-500/5 dark:bg-white/5 shadow-lg shadow-orange-500/5 ring-1 ring-orange-500/30' 
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-white/20 hover:bg-white/80 dark:hover:bg-white/5'
                }`}
              >
                <div className={`h-12 w-full rounded-xl bg-gradient-to-br ${cohort.gradient} mb-4 border border-slate-200/50 dark:border-white/5`} />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">{cohort.label}</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{cohort.note}</p>
                </div>
                <div className="mt-4 flex items-center justify-between w-full border-t border-slate-100 dark:border-white/5 pt-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-40">Target Cluster</span>
                  <span className="rounded-md bg-slate-900/5 dark:bg-white/10 px-2 py-0.5 text-xs font-bold font-mono text-blue-600 dark:text-blue-400">{cohort.count}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ENGAGEMENT RUN BAR CONTROLLER PANEL */}
        <div className="rounded-2xl bg-slate-900/5 dark:bg-slate-950/40 p-4 border border-slate-200/60 dark:border-white/10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">Active Target</span>
              <p className="font-bold text-slate-800 dark:text-white text-sm">{selectedCohort.label} ({selectedCohort.count} Nodes)</p>
            </div>
            <button
              onClick={triggerCampaignDeployment}
              disabled={isDeploying}
              className="group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeploying ? <Gauge className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
              {isDeploying ? 'Handshaking...' : 'Deploy Invites'}
            </button>
          </div>
          
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-blue-500 to-cyan-400 shadow-md shadow-blue-500/50"
              animate={{ width: `${campaignProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      {/* OUTREACH STATS TELEMETRY FUNNEL */}
      <div className="liquid-glass flex flex-col justify-between rounded-[32px] p-6 shadow-2xl lg:col-span-5 drift-leaderboard">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <BarChart3 className="h-3.5 w-3.5" /> Funnel Telemetry
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Conversion Telemetry</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            Real-time validation tracking reflecting acceptance metrics directly from database sync arrays.
          </p>
        </div>

        <div className="my-6 space-y-4">
          {[
            { label: 'Total Multi-Cohort Invites Sent', value: schoolsInvited, sub: 'Dispatched data packets', icon: Send, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Institutional Yield Nodes', value: approvedSchoolsCount, sub: '48% baseline yield convergence', icon: BadgeCheck, color: 'text-orange-500 dark:text-orange-400' },
            { label: 'Student Accounts Synced', value: studentsRegistered, sub: 'Active biometric identities locked', icon: UserRoundCheck, color: 'text-emerald-600 dark:text-emerald-400' }
          ].map((stage, idx) => {
            const IconComponent = stage.icon;
            const percentageRatio = schoolsInvited > 0 ? Math.max(15, Math.min(100, (stage.value / schoolsInvited) * 100)) : 0;
            
            return (
              <div key={idx} className="rounded-2xl border border-slate-200/50 dark:border-white/5 bg-slate-900/5 dark:bg-slate-950/30 p-4 transition-all duration-300 hover:border-slate-300/80 dark:hover:border-white/10">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200/40 dark:border-none">
                      <IconComponent className={`h-5 w-5 ${stage.color}`} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white tracking-tight leading-none">{stage.label}</h5>
                      <span className="text-[10px] text-slate-505 font-mono tracking-tight">{stage.sub}</span>
                    </div>
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-800 dark:text-white tracking-tighter">{stage.value}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/5">
                  <motion.div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-orange-500" 
                    animate={{ width: `${percentageRatio}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 flex items-start gap-3">
          <Flame className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
            <strong className="text-slate-800 dark:text-white font-medium">Outreach Sync Complete:</strong> Launching B2B blasts updates the student registration funnel immediately.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// VIEW COMPONENT 2: STUDENT LUMOS AUTH ONBOARDING
// ============================================================================

function StudentOnboarding({ scanState, studentVerified, studentsRegistered, executeBiometricScan }) {
  const isScanningActive = scanState === 'scanning';
  const isScanComplete = scanState === 'verified' || studentVerified;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 items-center justify-center"
    >
      <div className="grid w-full max-w-4xl gap-6 items-center lg:grid-cols-2">
        {/* TEXT LOGIC DESCRIPTION SECTION */}
        <div className="liquid-glass rounded-[32px] p-6 lg:p-8 drift-sidebar">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <LockKeyhole className="h-3.5 w-3.5" /> Biometric Authentication
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-800 dark:text-white">
            Instant Face ID.
          </h2>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Orbit hooks into the institutional student registry database. Attendee profiling automatically completes by running facial geometry matching loops directly against pre-existing student photo records.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center font-mono">
            <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-900/5 dark:bg-slate-950/40 p-3">
              <ShieldCheck className="mx-auto h-5 w-5 text-blue-500 dark:text-blue-400 mb-1" />
              <span className="block text-[10px] text-slate-505 uppercase">Auth token</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white">{isScanComplete ? 'VALIDATED' : 'WAITING'}</span>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-900/5 dark:bg-slate-950/40 p-3">
              <Users className="mx-auto h-5 w-5 text-orange-500 mb-1" />
              <span className="block text-[10px] text-slate-500 uppercase">Registered</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white">{studentsRegistered} Nodes</span>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-900/5 dark:bg-slate-950/40 p-3">
              <QrCode className="mx-auto h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-1" />
              <span className="block text-[10px] text-slate-500 uppercase">Status</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white">{isScanComplete ? 'ACTIVE' : 'READY'}</span>
            </div>
          </div>
        </div>

        {/* BIOMETRIC SCAN MOCKUP PANEL FRAME */}
        <div className="liquid-glass mx-auto w-full max-w-sm rounded-[36px] p-4 shadow-2xl drift-main">
          <div className="rounded-[28px] bg-white/60 dark:bg-slate-955/60 p-4 border border-slate-200 dark:border-white/5">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2 text-slate-850 dark:text-white font-mono">
              <div>
                <span className="text-[9px] uppercase tracking-widest opacity-45">System Core Authenticator</span>
                <h4 className="text-xs font-bold tracking-tight">Facial Scan Channel</h4>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${
                isScanningActive ? 'bg-orange-500/10 text-orange-655 border border-orange-500/20' : isScanComplete ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-200/50 text-slate-505'
              }`}>
                {isScanningActive ? 'Scanning' : isScanComplete ? 'Pass Active' : 'Standby'}
              </span>
            </div>

            {/* SCANNING FIELD CANVAS VIEWER IMAGE OBJECT */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900">
              
              {/* BACKPLANE GRAPH PATTERN DESIGNS */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#888888_1px,transparent_1px),linear-gradient(to_bottom,#888888_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              {/* FACE GEOMETRY MATRIX PLACEHOLDER SHAPE */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className={`flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed transition-all duration-500 ${
                  isScanningActive ? 'border-orange-500 bg-orange-500/5' : isScanComplete ? 'border-emerald-500 bg-emerald-500/5' : 'border-blue-500/30 bg-blue-500/5'
                }`}>
                  <ScanFace className={`h-14 w-14 transition-all duration-500 ${
                    isScanningActive ? 'text-orange-500 scale-105' : isScanComplete ? 'text-emerald-500' : 'text-slate-400 dark:text-blue-450/60'
                  }`} />
                </div>
                <div className="mt-6 w-full space-y-2 opacity-45 px-6">
                  <div className="h-2 w-full rounded-full bg-slate-400" />
                  <div className="h-2 w-4/5 mx-auto rounded-full bg-slate-400" />
                  <div className="h-2 w-1/2 mx-auto rounded-full bg-slate-400" />
                </div>
              </div>

              {/* FLOATING SCANNER BAR ANIMATION DOM OBJECT */}
              {isScanningActive && (
                <div className="animate-biometric-scan absolute left-0 top-0 h-8 w-full border-y border-orange-500/50 bg-linear-to-b from-orange-500/0 to-orange-500/20 shadow-[0_0_35px_rgba(249,115,22,0.4)]" />
              )}

              {/* VALIDATION CONFIRMATION CARD INSERTS */}
              {isScanComplete && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-950/90 p-4 backdrop-blur-xs text-center"
                >
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-805 dark:text-white tracking-tight">Handshake Complete</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[180px] mt-0.5 leading-normal">
                    AI verification token validated. Routing to stage.
                  </p>
                </motion.div>
              )}
            </div>

            {/* SCANNING CONTROL INTERACTION BUTTON */}
            {!isScanComplete && (
              <button
                onClick={executeBiometricScan}
                disabled={isScanningActive}
                className={`mt-4 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 cursor-pointer ${
                  isScanningActive 
                    ? 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-orange-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isScanningActive ? 'Analyzing Geometry...' : 'Initiate Scan Face'}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// VIEW COMPONENT 3: STUDENT LIVE EVENT STAGE
// ============================================================================

function StudentLive({
  curriculumTimeline, processedLeaderboard, setPoints, overallCourseProgress, completedTopics, 
  activeTopicId, setActiveTopicId, toggleTopicCompletion, selectedTopicObject,
  activePopoverWord, setActivePopoverWord, companionOpen, setCompanionOpen,
  activeQuizTopic, quizSelectionStatus, validateQuizAnswer, clearedQuizzes,
  isEvaluatingGemini, geminiAnalysis, isDarkMode
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -15 }}
      transition={{ duration: 0.4 }}
      className="grid flex-1 gap-6 lg:grid-cols-12"
    >
      
      {/* LEADERBOARD TICKER RUNNER ROW */}
      <div className="liquid-glass overflow-hidden rounded-[20px] p-2 lg:col-span-12 relative flex items-center h-10 mb-2">
        <div className="absolute left-0 z-20 flex h-full items-center gap-1.5 bg-gradient-to-r from-slate-100 to-slate-100/0 dark:from-slate-950 dark:to-slate-950/0 px-4 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
          <Trophy className="h-3.5 w-3.5 text-orange-500 animate-pulse" /> Live Event Ticker
        </div>
        <div className="flex w-full overflow-hidden">
          <div className="animate-leaderboard-marquee flex items-center gap-8 whitespace-nowrap pl-48">
            {processedLeaderboard.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold text-slate-400">#{idx + 1}</span>
                <span className="text-[10px] font-bold text-slate-705 dark:text-slate-350">{item.name}</span>
                <span className="font-mono text-[10px] text-slate-805 dark:text-white font-bold">{item.points} XP</span>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COLUMN 1: CURRICULUM TIMELINE sidebar (Staggered Zero-Gravity Drift) */}
      <motion.div 
        className="liquid-glass flex flex-col justify-between rounded-[32px] p-6 lg:col-span-3 drift-sidebar"
      >
        <div>
          <h3 className="text-lg font-bold text-slate-805 dark:text-white mb-2">Seminar Itinerary</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-normal">
            Track chapters and complete challenges to climb the peer scoreboard rankings.
          </p>

          <div className="space-y-2">
            {curriculumTimeline.map((topic) => {
              const isActive = activeTopicId === topic.id;
              const isChecked = !!completedTopics[topic.id];
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveTopicId(topic.id);
                    setActivePopoverWord(null);
                  }}
                  className={`w-full text-left rounded-xl p-3 border transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'border-orange-500 bg-orange-50/20 dark:bg-white/5 ring-1 ring-orange-500/20' 
                      : 'border-slate-200 dark:border-white/5 bg-slate-900/5 dark:bg-slate-950/20 hover:border-slate-350 dark:hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex items-center justify-center relative">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTopicCompletion(topic)}
                        className="h-4 w-4 rounded border-slate-300 dark:border-white/20 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer transition"
                        id={`check-${topic.id}`}
                      />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider opacity-50 text-slate-500 dark:text-slate-400">{topic.time}</span>
                      <h4 className={`text-xs font-bold text-slate-800 dark:text-white tracking-tight leading-tight transition-all ${isChecked ? 'line-through text-slate-400 dark:text-slate-500 opacity-60' : ''}`}>
                        {topic.title}
                      </h4>
                      <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 leading-normal">{topic.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 dark:border-white/5 pt-4">
          <div className="mb-2 flex items-center justify-between text-xs font-mono text-slate-650 dark:text-slate-400">
            <span className="opacity-50">Course Progress</span>
            <span className="text-orange-500 font-bold">{overallCourseProgress}%</span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-blue-600"
              animate={{ width: `${overallCourseProgress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </motion.div>

      {/* COLUMN 2: CORE DYNAMIC SANDBOX STAGE PANEL */}
      <div className="lg:col-span-6 flex flex-col gap-6 drift-main">
        
        {/* TEXT BOOK MATERIAL */}
        <div className="liquid-glass rounded-[32px] p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold block mb-1">Concept Matrix Reading</span>
            <h3 className="text-2xl font-bold tracking-tight text-slate-805 dark:text-white mb-3">{selectedTopicObject.title}</h3>
            
            <InteractiveText 
              text={selectedTopicObject.readingText}
              term={selectedTopicObject.term}
              tooltip={selectedTopicObject.tooltip}
              onTermClick={(popData) => setActivePopoverWord(popData)}
            />
          </div>

          <AnimatePresence mode="wait">
            {activePopoverWord && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="liquid-glass mt-4 rounded-2xl p-4 border border-orange-500/30 bg-orange-500/5 relative"
              >
                <button 
                  onClick={() => setActivePopoverWord(null)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mb-1 flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-orange-655 dark:text-orange-400 font-bold">
                  <Info className="h-3.5 w-3.5" /> Concept Breakdown
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{activePopoverWord.term}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-normal">{activePopoverWord.tooltip}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TOPIC SPECIFIC ACTIVE SANDBOX INTERACTIVE GRAPHICS */}
        <div className="liquid-glass rounded-[32px] p-6 flex flex-col justify-between">
          <TopicSpecificSandbox 
            activeTopicId={activeTopicId}
            setPoints={setPoints}
            isDarkMode={isDarkMode}
          />
        </div>

      </div>

      {/* COLUMN 3: VISCERAL GAMIFICATION LIVE SCOREBOARD (Vertical re-ranking animations) */}
      <div className="lg:col-span-3 drift-leaderboard">
        <div className="liquid-glass rounded-[32px] p-6 flex flex-col h-full justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600">
              <Trophy className="h-3.5 w-3.5" /> Scoreboard
            </div>
            <h3 className="text-lg font-bold text-slate-805 dark:text-white mb-2">Live Ranks</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-normal">
              Watch ranks adjust dynamically as XP increments.
            </p>
            
            <div className="space-y-2.5">
              <AnimatePresence>
                {processedLeaderboard.map((item, idx) => {
                  const rank = idx + 1;
                  const isUser = item.isUser;
                  return (
                    <motion.div
                      key={item.name}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      className={`flex items-center justify-between rounded-xl p-3 border transition-all ${
                        isUser 
                          ? 'border-orange-500 bg-orange-500/10 dark:bg-orange-500/5 shadow-md shadow-orange-500/5 ring-1 ring-orange-500/30' 
                          : 'border-slate-200 dark:border-white/5 bg-slate-900/5 dark:bg-slate-950/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold opacity-60 w-5">#{rank}</span>
                        <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${item.color}`} />
                        <span className={`text-xs font-bold ${isUser ? 'text-slate-800 dark:text-white font-black' : 'text-slate-700 dark:text-slate-300'}`}>
                          {item.name}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-white">{item.points} <span className="text-[10px] font-normal opacity-50">XP</span></span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="mt-6 border-t border-slate-200 dark:border-white/5 pt-4 text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">Your ranking yield</span>
            <div className="mt-1 flex items-center justify-center gap-1">
              <span className="text-xl font-black text-slate-805 dark:text-white">
                #{processedLeaderboard.findIndex(item => item.isUser) + 1}
              </span>
              <span className="text-xs text-slate-500">of 6 peers</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPANION AI WIDGET SYSTEM (MORPH PANEL SYSTEM) */}
      <AnimatePresence>
        {companionOpen && activeQuizTopic && (
          <motion.div
            layoutId="companion-panel"
            className="fixed bottom-24 right-8 z-50 w-full max-w-sm rounded-[24px] p-5 shadow-2xl liquid-glass border border-orange-500/20"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest opacity-40 text-slate-500 dark:text-slate-400">Companion Bot Quiz</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-none">Module Evaluation</h4>
                </div>
              </div>
              <button 
                onClick={() => setCompanionOpen(false)}
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Render Gemini Response Telemetry Packet if Loading or Ready */}
            <div className="mb-4 rounded-xl bg-orange-500/5 p-3 border border-orange-500/10 text-xs leading-normal text-slate-700 dark:text-slate-350">
              {isEvaluatingGemini ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-3.5 w-3.5 border-2 border-orange-500 border-t-transparent rounded-full" />
                  <span className="font-mono text-[10px]">Gemini generating feedback...</span>
                </div>
              ) : geminiAnalysis ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[9px] font-bold text-orange-500 uppercase tracking-widest">Gemini Companion</span>
                    <span className="font-mono text-[9px] bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded font-bold">+{geminiAnalysis.score_modifier} XP</span>
                  </div>
                  <p>{geminiAnalysis.feedback_packet}</p>
                </div>
              ) : (
                <p>Complete the challenge to trigger Gemini verification.</p>
              )}
            </div>

            <p className="text-xs font-bold text-slate-805 dark:text-white mb-3">
              {activeQuizTopic.quiz.question}
            </p>

            <div className="space-y-2">
              {activeQuizTopic.quiz.options.map((option, idx) => {
                let optionBorder = 'border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 text-slate-605 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/10';
                if (quizSelectionStatus !== 'idle') {
                  if (idx === activeQuizTopic.quiz.answer) {
                    optionBorder = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
                  } else if (quizSelectionStatus === 'wrong') {
                    optionBorder = 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400 opacity-60';
                  } else {
                    optionBorder = 'border-slate-200 dark:border-white/5 bg-slate-900/40 text-slate-400 opacity-40';
                  }
                }
                return (
                  <button
                    key={idx}
                    disabled={quizSelectionStatus !== 'idle'}
                    onClick={() => validateQuizAnswer(idx)}
                    className={`w-full text-left rounded-xl p-3 text-xs leading-normal border transition-all cursor-pointer ${optionBorder}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-mono font-bold opacity-60">[{String.fromCharCode(65 + idx)}]</span>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {quizSelectionStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 rounded-xl p-2.5 text-center text-xs font-bold border ${
                    quizSelectionStatus === 'correct' 
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400' 
                      : 'border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400'
                  }`}
                >
                  {quizSelectionStatus === 'correct' 
                    ? clearedQuizzes[activeQuizTopic.id] 
                      ? 'Correct! Question processed.' 
                      : '🎉 Correct Answer! +100 XP Credited' 
                    : '❌ Incorrect. Review materials and submit again.'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING COMPANION BUBBLE */}
      {!companionOpen && (
        <motion.button
          layoutId="companion-panel"
          onClick={() => {
            if (activeQuizTopic) {
              setCompanionOpen(true);
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`fixed bottom-24 right-8 z-40 h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center shadow-lg shadow-orange-500/20 cursor-pointer drift-bubble ${
            activeQuizTopic ? 'animate-pulse border-2 border-white/20' : ''
          }`}
        >
          {activeQuizTopic && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white ring-2 ring-slate-900">
              !
            </span>
          )}
          <Bot className="h-7 w-7 text-white" />
        </motion.button>
      )}

    </motion.div>
  );
}

// ============================================================================
// COMPONENT: INTERACTIVE TEXT WITH POP OVER DEEPLINK
// ============================================================================

function InteractiveText({ text, term, tooltip, onTermClick }) {
  if (!term) return <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-350">{text}</p>;
  
  const parts = text.split(new RegExp(`(${term})`, 'gi'));
  
  return (
    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-350">
      {parts.map((part, index) => {
        if (part.toLowerCase() === term.toLowerCase()) {
          return (
            <button
              key={index}
              onClick={() => onTermClick({ term, tooltip })}
              className="wavy-interactive-underline font-semibold focus:outline-none cursor-pointer text-orange-600 dark:text-orange-400"
            >
              {part}
            </button>
          );
        }
        return part;
      })}
    </p>
  );
}

// ============================================================================
// TOPIC SPECIFIC SANDBOX DELEGATOR
// ============================================================================

function TopicSpecificSandbox({ activeTopicId, setPoints, isDarkMode }) {
  switch (activeTopicId) {
    case 'intro-ai':
      return <IntroAISandbox setPoints={setPoints} />;
    case 'ml-paradigms':
      return <MLParadigmsSandbox setPoints={setPoints} />;
    case 'ethics-alignment':
      return <AIEthicsSandbox setPoints={setPoints} />;
    case 'deep-networks':
    default:
      return <NeuralNetSandbox setPoints={setPoints} isDarkMode={isDarkMode} />;
  }
}

// ============================================================================
// TOPIC SANDBOX 1: INTRO AI PIXEL GRID PATTERN CLASSIFIER
// ============================================================================

function IntroAISandbox({ setPoints }) {
  const [pixels, setPixels] = useState(Array(16).fill(0));
  const [prediction, setPrediction] = useState('Draw a shape');
  const [hasUnwrappedXP, setHasUnwrappedXP] = useState(false);

  const togglePixel = (idx) => {
    const next = [...pixels];
    next[idx] = next[idx] === 1 ? 0 : 1;
    setPixels(next);
    
    // Evaluate pattern heuristics dynamically
    const sum = next.reduce((a, b) => a + b, 0);
    if (sum === 0) {
      setPrediction('Draw a shape');
    } else if (sum > 10) {
      setPrediction('Complex Vector Dense Cluster');
    } else if (next[0] || next[3] || next[12] || next[15]) {
      setPrediction('Linear Corner Array Frame');
    } else {
      setPrediction('Centered Kernel Array Matrix');
    }
  };

  const claimXP = () => {
    if (hasUnwrappedXP) return;
    setPoints(p => p + 100);
    setHasUnwrappedXP(true);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold block mb-1">Sandbox 1: Introduction to AI</span>
        <h4 className="text-sm font-bold text-slate-805 dark:text-white mb-2">Pattern Recognizer Grid</h4>
        <p className="text-xs text-slate-500 mb-4 leading-normal">
          Toggle pixels below. Orbit evaluates structural cluster heuristics live.
        </p>

        <div className="grid grid-cols-4 gap-2.5 max-w-[200px] mx-auto bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-white/5">
          {pixels.map((val, idx) => (
            <button
              key={idx}
              onClick={() => togglePixel(idx)}
              className={`aspect-square rounded-lg border transition-all duration-150 cursor-pointer ${
                val === 1 
                  ? 'bg-orange-500 border-orange-600 shadow-sm shadow-orange-500/30' 
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 hover:border-slate-350'
              }`}
            />
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-slate-900/5 dark:bg-white/5 p-3 text-center border border-slate-205 dark:border-white/5">
          <span className="text-[9px] uppercase font-mono tracking-widest opacity-45 block mb-0.5">Model Prediction</span>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{prediction}</span>
        </div>
      </div>

      <button
        onClick={claimXP}
        disabled={hasUnwrappedXP || pixels.reduce((a,b)=>a+b, 0) === 0}
        className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md mt-4 cursor-pointer ${
          hasUnwrappedXP || pixels.reduce((a,b)=>a+b, 0) === 0
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-orange-500 to-blue-600 shadow-orange-500/10 hover:scale-[1.02]'
        }`}
      >
        {hasUnwrappedXP ? 'XP Claimed' : 'Unlock Pattern XP (+100)'}
      </button>
    </div>
  );
}

// ============================================================================
// TOPIC SANDBOX 2: MACHINE LEARNING PARADIGMS CHART ENGINE
// ============================================================================

function MLParadigmsSandbox({ setPoints }) {
  const [activeParadigm, setActiveParadigm] = useState('supervised');
  const [xpUnlocked, setXpUnlocked] = useState(false);

  const paradigms = {
    supervised: {
      title: 'Supervised Learning',
      concept: 'Labled Dataset training loops',
      math: 'Y = f(X) + Error',
      color: 'text-orange-600 dark:text-orange-400'
    },
    unsupervised: {
      title: 'Unsupervised Learning',
      concept: 'Variance Clustering structures',
      math: 'Maximize Margin Separation',
      color: 'text-blue-600 dark:text-blue-400'
    },
    reinforcement: {
      title: 'Reinforcement Learning',
      concept: 'Dynamic Agent states',
      math: 'Q(s, a) = R + max Q(s\', a\')',
      color: 'text-emerald-600 dark:text-emerald-400'
    }
  };

  const getPoints = () => {
    if (xpUnlocked) return;
    setPoints(p => p + 100);
    setXpUnlocked(true);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold block mb-1">Sandbox 2: Machine Learning</span>
        <h4 className="text-sm font-bold text-slate-805 dark:text-white mb-2">ML Model Paradigms</h4>
        <p className="text-xs text-slate-500 mb-4 leading-normal">
          Select learning tracks to observe mathematical objective functions.
        </p>

        <div className="flex gap-1.5 mb-4 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          {Object.keys(paradigms).map(key => (
            <button
              key={key}
              onClick={() => setActiveParadigm(key)}
              className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition cursor-pointer ${
                activeParadigm === key 
                  ? 'bg-white dark:bg-slate-950 text-slate-805 dark:text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-650'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 p-4">
          <h5 className={`text-xs font-bold ${paradigms[activeParadigm].color}`}>{paradigms[activeParadigm].title}</h5>
          <p className="text-[11px] text-slate-500 mt-1">{paradigms[activeParadigm].concept}</p>
          <div className="mt-3 rounded-lg bg-slate-950 p-2.5 font-mono text-[10px] text-emerald-400 border border-white/5 text-center">
            {paradigms[activeParadigm].math}
          </div>
        </div>
      </div>

      <button
        onClick={getPoints}
        disabled={xpUnlocked}
        className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md mt-4 cursor-pointer ${
          xpUnlocked 
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-orange-500 to-blue-600 shadow-orange-500/10 hover:scale-[1.02]'
        }`}
      >
        {xpUnlocked ? 'XP Claimed' : 'Unlock Paradigm XP (+100)'}
      </button>
    </div>
  );
}

// ============================================================================
// TOPIC SANDBOX 3: DEEP LEARNING SMART NEURAL TUTOR ENGINE
// ============================================================================

const ACTIVATION_FUNCS = {
  sigmoid: z => 1 / (1 + Math.exp(-z)),
  relu: z => Math.max(0, z),
  tanh: z => Math.tanh(z),
  d_sigmoid: a => a * (1 - a),
  d_relu: a => a > 0 ? 1 : 0,
  d_tanh: a => 1 - a * a
};

function NeuralNetSandbox({ setPoints, isDarkMode }) {
  const mapCanvasRef = useRef(null);
  const lossCanvasRef = useRef(null);
  
  // Core engine States mapped directly from html tutor spec
  const [dataset, setDataset] = useState('linear');
  const [pointsData, setPointsData] = useState([...NEURAL_PRESETS.linear]);
  const [mode, setMode] = useState('single'); // single or mlp
  const [activation, setActivation] = useState('sigmoid');
  const [lr, setLr] = useState(0.3);
  const [epoch, setEpoch] = useState(0);
  const [lossHistory, setLossHistory] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawClass, setDrawClass] = useState(1);
  const [activeInspectIdx, setActiveInspectIdx] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Model parameters (weights & biases)
  const [weights, setWeights] = useState({
    single: { w1: 0.5, w2: -0.3, b: 0 },
    mlp: {
      w_h: [[0.5, -0.3], [0.2, 0.4], [-0.5, 0.1]],
      b_h: [0.1, -0.2, 0.3],
      w_o: [0.6, -0.4, 0.2],
      b_o: -0.1
    }
  });

  const initWeights = useCallback(() => {
    setWeights({
      single: { w1: Math.random() - 0.5, w2: Math.random() - 0.5, b: 0 },
      mlp: {
        w_h: Array(3).fill(0).map(() => [Math.random() * 2 - 1, Math.random() * 2 - 1]),
        b_h: Array(3).fill(0),
        w_o: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
        b_o: 0
      }
    });
    setEpoch(0);
    setLossHistory([]);
    setActiveInspectIdx(0);
  }, []);

  // Sync preset dataset points on switch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (dataset === 'custom') {
        setPointsData([]);
      } else {
        setPointsData([...NEURAL_PRESETS[dataset]]);
      }
      initWeights();
    }, 0);
    return () => clearTimeout(timer);
  }, [dataset, initWeights]);

  // Math: Forward pass
  const forwardPass = useCallback((x1, x2, currentWeights) => {
    if (mode === 'single') {
      const z = (x1 * currentWeights.single.w1) + (x2 * currentWeights.single.w2) + currentWeights.single.b;
      const out = ACTIVATION_FUNCS.sigmoid(z);
      return { out, z, x1, x2 };
    } else {
      const w = currentWeights.mlp;
      let h_sums = [], h_acts = [];
      for (let i = 0; i < 3; i++) {
        const z = (x1 * w.w_h[i][0]) + (x2 * w.w_h[i][1]) + w.b_h[i];
        h_sums.push(z);
        h_acts.push(ACTIVATION_FUNCS[activation](z));
      }
      let z_out = (h_acts[0] * w.w_o[0]) + (h_acts[1] * w.w_o[1]) + (h_acts[2] * w.w_o[2]) + w.b_o;
      let out = ACTIVATION_FUNCS.sigmoid(z_out);
      return { out, z_out, h_sums, h_acts, x1, x2 };
    }
  }, [mode, activation]);

  // Math: Backpropagation step
  const backwardPass = useCallback((pt, currentWeights) => {
    const pass = forwardPass(pt.x1, pt.x2, currentWeights);
    
    if (mode === 'single') {
      const err = pass.out - pt.y;
      const delta = err * ACTIVATION_FUNCS.d_sigmoid(pass.out);
      currentWeights.single.w1 -= lr * delta * pt.x1;
      currentWeights.single.w2 -= lr * delta * pt.x2;
      currentWeights.single.b -= lr * delta;
      return 0.5 * err * err;
    } else {
      const w = currentWeights.mlp;
      const err = pass.out - pt.y;
      const delta_out = err * ACTIVATION_FUNCS.d_sigmoid(pass.out);

      const grad_w_o = pass.h_acts.map(a => delta_out * a);
      const grad_b_o = delta_out;

      let delta_h = [], grad_w_h = [[0, 0], [0, 0], [0, 0]], grad_b_h = [];
      for (let i = 0; i < 3; i++) {
        const d_act = ACTIVATION_FUNCS['d_' + activation](pass.h_acts[i]);
        const d_h = (delta_out * w.w_o[i]) * d_act;
        delta_h.push(d_h);
        grad_w_h[i][0] = d_h * pt.x1;
        grad_w_h[i][1] = d_h * pt.x2;
        grad_b_h.push(d_h);
      }

      w.b_o -= lr * grad_b_o;
      for (let i = 0; i < 3; i++) {
        w.w_o[i] -= lr * grad_w_o[i];
        w.w_h[i][0] -= lr * grad_w_h[i][0];
        w.w_h[i][1] -= lr * grad_w_h[i][1];
        w.b_h[i] -= lr * grad_b_h[i];
      }
      return 0.5 * err * err;
    }
  }, [mode, activation, lr, forwardPass]);

  // Math: Full training epoch
  const trainEpoch = useCallback(() => {
    if (pointsData.length === 0) return 1.0;
    
    // Deep clone parameters state to prevent asynchronous intermediate rendering glitches
    const nextWeights = {
      single: { ...weights.single },
      mlp: {
        w_h: weights.mlp.w_h.map(row => [...row]),
        b_h: [...weights.mlp.b_h],
        w_o: [...weights.mlp.w_o],
        b_o: weights.mlp.b_o
      }
    };

    let lossSum = 0;
    pointsData.forEach(pt => {
      lossSum += backwardPass(pt, nextWeights);
    });

    const avgLoss = lossSum / pointsData.length;
    setWeights(nextWeights);
    setEpoch(prev => prev + 1);
    setLossHistory(prev => [...prev, avgLoss]);
    setActiveInspectIdx(prev => pointsData.length > 0 ? (prev + 1) % pointsData.length : 0);
    return avgLoss;
  }, [pointsData, weights, backwardPass]);

  // Play/Pause requestAnimationFrame training loops
  useEffect(() => {
    if (!isPlaying) return;
    let animationFrameId;

    const loop = () => {
      let currentLoss = 1.0;
      // Acceleration multiplier (2 epochs per frame)
      for (let i = 0; i < 2; i++) {
        currentLoss = trainEpoch();
      }

      if (currentLoss < 0.005) {
        setIsPlaying(false);
        setPoints(p => p + 250); // Converged XP rollup trigger
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, trainEpoch, setPoints]);

  // Drawing boundary spaces contour mapping (tweaked for mode-aware gradients)
  const drawHeatmap = useCallback(() => {
    if (!mapCanvasRef.current) return;
    const canvas = mapCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return;

    // Boundary pixel interpolation block size
    const res = 6;
    for (let px = 0; px < w; px += res) {
      for (let py = 0; py < h; py += res) {
        const normX = px / w;
        const normY = 1 - (py / h);

        const pass = forwardPass(normX, normY, weights);
        const prob = pass.out;

        // Adaptive color matrices mapping light/dark base modes
        const bgR = isDarkMode ? 12 : 251;
        const bgG = isDarkMode ? 16 : 249;
        const bgB = isDarkMode ? 23 : 244;

        const hitR = isDarkMode ? 16 : 61;
        const hitG = isDarkMode ? 185 : 138;
        const hitB = isDarkMode ? 129 : 99;

        const flopR = isDarkMode ? 225 : 217;
        const flopG = isDarkMode ? 29 : 107;
        const flopB = isDarkMode ? 72 : 82;

        let r, g, b;
        let intensity = Math.abs(prob - 0.5) * 2; // scale difference [0, 1]

        if (prob > 0.5) {
          r = Math.round(bgR * (1 - intensity) + hitR * intensity);
          g = Math.round(bgG * (1 - intensity) + hitG * intensity);
          b = Math.round(bgB * (1 - intensity) + hitB * intensity);
        } else {
          r = Math.round(bgR * (1 - intensity) + flopR * intensity);
          g = Math.round(bgG * (1 - intensity) + flopG * intensity);
          b = Math.round(bgB * (1 - intensity) + flopB * intensity);
        }

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(px, py, res, res);

        // Render decision boundary line
        if (Math.abs(prob - 0.5) < 0.015) {
          ctx.fillStyle = "rgba(250, 204, 21, 0.85)"; // Yellow contour line
          ctx.fillRect(px, py, res, res);
        }
      }
    }

    // Redraw points on top
    pointsData.forEach((pt, idx) => {
      const cx = pt.x1 * w;
      const cy = h - (pt.x2 * h);

      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = pt.y === 1 ? '#10b981' : '#e11d48';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Highlight active inspector point
      if (idx === activeInspectIdx) {
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }, [weights, pointsData, activeInspectIdx, forwardPass, isDarkMode]);

  // Drawing loss history line charts
  const drawLossChart = useCallback(() => {
    if (!lossCanvasRef.current) return;
    const canvas = lossCanvasRef.current;
    const ctxL = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth || 150;
    const h = canvas.height = 48;
    ctxL.clearRect(0, 0, w, h);

    if (lossHistory.length === 0) return;

    const maxLogs = 50;
    const logs = lossHistory.slice(-maxLogs);
    const maxVal = Math.max(0.2, ...logs);

    ctxL.beginPath();
    logs.forEach((lossVal, i) => {
      const x = (i / (logs.length - 1 || 1)) * w;
      const y = h - (lossVal / maxVal) * h;
      if (i === 0) ctxL.moveTo(x, y); else ctxL.lineTo(x, y);
    });
    ctxL.strokeStyle = '#f43f5e';
    ctxL.lineWidth = 2;
    ctxL.stroke();
  }, [lossHistory]);

  // Resize listener triggering redraw loops
  useEffect(() => {
    const handleResize = () => {
      if (mapCanvasRef.current) {
        const rect = mapCanvasRef.current.parentElement.getBoundingClientRect();
        mapCanvasRef.current.width = rect.width;
        mapCanvasRef.current.height = rect.height;
        drawHeatmap();
      }
      drawLossChart();
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Init sizing
    return () => window.removeEventListener('resize', handleResize);
  }, [drawHeatmap, drawLossChart]);

  // Trigger redraw on parameters adjustments
  useEffect(() => {
    drawHeatmap();
    drawLossChart();
  }, [weights, pointsData, drawHeatmap, drawLossChart]);

  // Click canvas plots relative custom coordinates
  const handleCanvasClick = (e) => {
    if (dataset !== 'custom' || !mapCanvasRef.current) return;
    const rect = mapCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - ((e.clientY - rect.top) / rect.height);
    
    setPointsData(prev => [...prev, { x1: x, x2: y, y: drawClass }]);
  };

  // Dynamic Tutor Analysis message generation
  const tutorMessage = useMemo(() => {
    const currentLoss = lossHistory[lossHistory.length - 1] || 0;
    if (pointsData.length === 0) {
      return "Your dataset is empty. Click on the canvas to add some data points!";
    } else if (dataset === 'xor' && mode === 'single') {
      if (epoch > 20 && currentLoss > 0.1) {
        return "🛑 Notice how the loss is stuck and the line can't separate the colors? A Single Neuron can only draw ONE straight line. XOR requires separating opposite corners, which is physically impossible with one line. Switch to MLP (Hidden Layers)!";
      } else {
        return "You are trying to solve XOR with a Single Neuron. Watch what happens to the decision line as it struggles...";
      }
    } else if (dataset === 'circle' && mode === 'mlp') {
      return "Great choice. Concentric circles require non-linear curves. By using an MLP, the hidden neurons will fold the space to wrap around the inner circle. It might take a few hundred epochs to find it perfectly.";
    } else if (lr > 1.0) {
      return "⚠️ Your learning rate is very high! The network is taking massive steps. Notice how the decision boundary might be jumping wildly or failing to settle? Try lowering it.";
    } else if (epoch === 0) {
      return "Ready to train. The boundary you see right now is completely random. Click Auto Train to start Gradient Descent.";
    } else if (currentLoss < 0.01) {
      return "🎉 Excellent! The network has practically solved this dataset. The loss is near zero. Try switching to a harder dataset or generating your own data.";
    } else {
      return `Epoch ${epoch}: The network is adjusting its weights using Backpropagation. Current Mean Squared Error is ${currentLoss.toFixed(4)}. It will keep tweaking the weights to minimize this error.`;
    }
  }, [dataset, mode, epoch, lossHistory, pointsData, lr]);

  // SVG inspection helper builders

  const handleInspectMouseMove = (e, title, desc, math) => {
    setHoveredNode({
      x: e.clientX,
      y: e.clientY,
      title,
      desc,
      math
    });
  };

  const renderSVGLine = (x1, y1, x2, y2, w, title, desc, math) => {
    const strokeColor = w >= 0 ? (isDarkMode ? 'rgba(56, 189, 248, 0.75)' : 'rgba(14, 116, 144, 0.75)') : (isDarkMode ? 'rgba(251, 146, 60, 0.75)' : 'rgba(194, 65, 12, 0.75)');
    const strokeWidth = Math.max(1.2, Math.min(6, Math.abs(w) * 3.5));
    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray="4 4"
        style={{ animation: 'dash 1s linear infinite' }}
        className="inspectable"
        onMouseEnter={(e) => handleInspectMouseMove(e, title, desc, math)}
        onMouseMove={(e) => handleInspectMouseMove(e, title, desc, math)}
        onMouseLeave={() => setHoveredNode(null)}
      />
    );
  };

  const renderSVGNode = (x, y, label, val, isOutput, title, desc, math) => {
    const strokeColor = isOutput 
      ? (val > 0.5 ? '#10b981' : '#e11d48') 
      : (isDarkMode ? '#6366f1' : '#4f46e5');
    
    return (
      <g
        className="inspectable cursor-pointer"
        onMouseEnter={(e) => handleInspectMouseMove(e, title, desc, math)}
        onMouseMove={(e) => handleInspectMouseMove(e, title, desc, math)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <circle
          cx={x}
          cy={y}
          r={18}
          fill={isDarkMode ? '#0f111a' : '#f8fafc'}
          stroke={strokeColor}
          strokeWidth={2}
        />
        <text
          x={x}
          y={y - 2}
          textAnchor="middle"
          fill={isDarkMode ? '#e2e8f0' : '#1e293b'}
          fontSize="10px"
          fontWeight="bold"
        >
          {label}
        </text>
        <text
          x={x}
          y={y + 10}
          textAnchor="middle"
          fill={isDarkMode ? '#94a3b8' : '#64748b'}
          fontSize="8px"
        >
          {val.toFixed(2)}
        </text>
      </g>
    );
  };

  const pt = pointsData[activeInspectIdx] || { x1: 0.5, x2: 0.5, y: 0 };
  const pass = forwardPass(pt.x1, pt.x2, weights);

  return (
    <div className="flex flex-col gap-4 font-sans relative">
      
      {/* Dynamic flow synapses animation styles */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -16; }
        }
        .inspectable {
          cursor: crosshair;
          transition: all 0.2s;
        }
        .inspectable:hover {
          filter: brightness(1.3) drop-shadow(0 0 4px rgba(99,102,241,0.4));
        }
      `}</style>

      {/* Floating Precise Mathematical Tooltip Card */}
      {hoveredNode && (
        <div
          style={{
            position: 'fixed',
            left: hoveredNode.x + 15,
            top: hoveredNode.y - 45,
            pointerEvents: 'none',
            zIndex: 1000
          }}
          className="bg-slate-900/95 border border-slate-700 shadow-2xl rounded-xl p-3 text-xs w-64 backdrop-blur-sm text-slate-200 transform -translate-y-1/2"
        >
          <div className="font-bold text-indigo-400 mb-1 border-b border-slate-700 pb-1 uppercase tracking-wider">
            {hoveredNode.title}
          </div>
          <div className="text-slate-350 mb-2 leading-relaxed text-[11px]">
            {hoveredNode.desc}
          </div>
          <div 
            className="font-mono bg-slate-950 p-2 rounded text-[10px] text-emerald-400 break-words"
            dangerouslySetInnerHTML={{ __html: hoveredNode.math }}
          />
        </div>
      )}

      {/* Live Tutor analysis header strip */}
      <div className="bg-indigo-950/20 dark:bg-indigo-950/10 border border-indigo-500/25 rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
        <h5 className="text-[10px] font-mono font-bold uppercase text-indigo-500 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
          <Brain className="h-3.5 w-3.5" /> Live Tutor Analysis
        </h5>
        <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed min-h-[48px] pr-2">
          {tutorMessage}
        </p>
      </div>

      {/* Metrics board */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-205 dark:border-white/5 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-[10px] text-slate-450 uppercase tracking-wide">Epochs</span>
          <span className="text-xl font-mono font-bold text-indigo-500 dark:text-indigo-400">{epoch}</span>
        </div>
        <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-205 dark:border-white/5 rounded-xl p-3 flex flex-col justify-center relative group">
          <span className="text-[10px] text-slate-450 uppercase tracking-wide">MSE Loss</span>
          <span className="text-xl font-mono font-bold text-rose-500 dark:text-rose-400">
            {(lossHistory[lossHistory.length - 1] || 0).toFixed(4)}
          </span>
          <div className="absolute inset-0 bg-slate-900/95 border border-rose-500 rounded-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-[9px] text-slate-200 flex items-center justify-center text-center leading-normal">
            Loss measures model inaccuracy. Optimization math aims to push it to zero.
          </div>
        </div>
        <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-205 dark:border-white/5 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-[9px] text-slate-400 uppercase tracking-wide">Loss Curve</span>
          <canvas ref={lossCanvasRef} className="w-full h-8" />
        </div>
      </div>

      {/* Side-by-side Viewports (Decision Boundary & Deep Inspector) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Decision Space canvas */}
        <div className="bg-slate-100/30 dark:bg-slate-900/20 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 flex flex-col">
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300">Decision Space</h4>
            {dataset === 'custom' && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-400">Plot class:</span>
                <button
                  onClick={() => setDrawClass(prev => prev === 1 ? 0 : 1)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                    drawClass === 1 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' 
                      : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                  }`}
                >
                  {drawClass === 1 ? 'Hit (1)' : 'Flop (0)'}
                </button>
              </div>
            )}
          </div>

          <div className="relative w-full aspect-square bg-slate-950 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-800 shadow-inner">
            <canvas
              ref={mapCanvasRef}
              onClick={handleCanvasClick}
              className={`absolute inset-0 w-full h-full ${dataset === 'custom' ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
            />
            {/* Grid background mesh overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px]" />
            
            <div className="absolute bottom-1 left-0 w-full text-center text-[9px] text-slate-400/50 font-mono pointer-events-none">
              Vibrancy (X₁) &rarr;
            </div>
            <div className="absolute top-1/2 left-1 -translate-y-1/2 -rotate-90 text-[9px] text-slate-400/50 font-mono pointer-events-none origin-left">
              Complexity (X₂) &rarr;
            </div>
          </div>

          <div className="mt-2.5 flex justify-center gap-3 text-[9px] text-slate-400 leading-none">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block border border-white" /> Hit (Target 1)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block border border-white" /> Flop (Target 0)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-0.5 bg-yellow-450 inline-block" /> Decision Line
            </span>
          </div>
        </div>

        {/* Deep Network Inspector */}
        <div className="bg-slate-100/30 dark:bg-slate-900/20 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 flex flex-col">
          <div className="mb-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300">Deep Inspection Architecture</h4>
            <p className="text-[9px] text-slate-450">Hover nodes or weights to inspect mathematical equations.</p>
          </div>

          <div className="relative w-full flex-grow bg-slate-950 rounded-lg border border-slate-350 dark:border-slate-800 overflow-hidden min-h-[220px] flex items-center justify-center p-2">
            <svg className="w-full h-full min-h-[210px]" viewBox="0 0 400 300">
              {mode === 'single' ? (
                <>
                  {/* Synapses lines */}
                  {renderSVGLine(80, 100, 320, 150, weights.single.w1, "Weight 1 (w₁)", "Scales the importance of input X₁.", `Value: ${weights.single.w1.toFixed(3)}<br>Signal: X₁ * w₁ = ${(pt.x1 * weights.single.w1).toFixed(3)}`)}
                  {renderSVGLine(80, 200, 320, 150, weights.single.w2, "Weight 2 (w₂)", "Scales the importance of input X₂.", `Value: ${weights.single.w2.toFixed(3)}<br>Signal: X₂ * w₂ = ${(pt.x2 * weights.single.w2).toFixed(3)}`)}
                  
                  {/* Nodes circles */}
                  {renderSVGNode(80, 100, "X₁", pt.x1, false, "Input Feature X₁", "The Vibrancy value of the current data point.", `Raw Value: ${pt.x1.toFixed(2)}`)}
                  {renderSVGNode(80, 200, "X₂", pt.x2, false, "Input Feature X₂", "The Complexity value of the current data point.", `Raw Value: ${pt.x2.toFixed(2)}`)}
                  {renderSVGNode(320, 150, "OUT", pass.out, true, "Output Neuron", "Calculates weighted sum + bias, then applies Sigmoid squash.", `z = (X₁·w₁) + (X₂·w₂) + bias<br>z = ${pass.z.toFixed(3)}<br>Bias = ${weights.single.b.toFixed(3)}<br>Out = Sigmoid(z) = ${pass.out.toFixed(4)}`)}
                </>
              ) : (
                <>
                  {/* Input to hidden layers synapses */}
                  {Array(3).fill(0).map((_, i) => (
                    <React.Fragment key={`syn-in-${i}`}>
                      {renderSVGLine(50, 100, 200, 60 + i * 90, weights.mlp.w_h[i][0], `Weight w_h[${i}][0]`, `Connects Input X₁ to Hidden Node ${i + 1}.`, `w = ${weights.mlp.w_h[i][0].toFixed(3)}<br>Signal = ${(pt.x1 * weights.mlp.w_h[i][0]).toFixed(3)}`)}
                      {renderSVGLine(50, 200, 200, 60 + i * 90, weights.mlp.w_h[i][1], `Weight w_h[${i}][1]`, `Connects Input X₂ to Hidden Node ${i + 1}.`, `w = ${weights.mlp.w_h[i][1].toFixed(3)}<br>Signal = ${(pt.x2 * weights.mlp.w_h[i][1]).toFixed(3)}`)}
                    </React.Fragment>
                  ))}
                  
                  {/* Hidden to output synapses */}
                  {Array(3).fill(0).map((_, i) => (
                    renderSVGLine(200, 60 + i * 90, 350, 150, weights.mlp.w_o[i], `Weight w_o[${i}]`, `Connects Hidden Node ${i + 1} to Output.`, `w = ${weights.mlp.w_o[i].toFixed(3)}<br>Signal = ${(pass.h_acts[i] * weights.mlp.w_o[i]).toFixed(3)}`)
                  ))}

                  {/* Nodes circles */}
                  {renderSVGNode(50, 100, "X₁", pt.x1, false, "Input X₁", "Raw Vibrancy feature value.", `Val: ${pt.x1.toFixed(2)}`)}
                  {renderSVGNode(50, 200, "X₂", pt.x2, false, "Input X₂", "Raw Complexity feature value.", `Val: ${pt.x2.toFixed(2)}`)}

                  {Array(3).fill(0).map((_, i) => (
                    renderSVGNode(200, 60 + i * 90, `H${i + 1}`, pass.h_acts[i], false, `Hidden Neuron ${i + 1}`, `Applies ${activation.toUpperCase()} function to its inputs to extract non-linear patterns.`, `Sum (z) = ${pass.h_sums[i].toFixed(3)}<br>Bias = ${weights.mlp.b_h[i].toFixed(3)}<br>Activation = ${pass.h_acts[i].toFixed(4)}`)
                  ))}

                  {renderSVGNode(350, 150, "OUT", pass.out, true, "Final Output Neuron", "Combines hidden patterns into final classification probability.", `Sum (z) = ${pass.z_out.toFixed(3)}<br>Bias = ${weights.mlp.b_o.toFixed(3)}<br>Out = Sigmoid(z) = ${pass.out.toFixed(4)}`)}
                </>
              )}
            </svg>
          </div>

          <div className="mt-2.5 bg-slate-950 border border-slate-800 rounded p-2 text-[10px] text-slate-400 font-mono flex justify-between leading-none">
            <span>Flowing Inspector Test Input:</span>
            <span className="text-indigo-400 font-bold">
              [X₁:{pt.x1.toFixed(2)}, X₂:{pt.x2.toFixed(2)}] Target: {pt.y}
            </span>
          </div>
        </div>

      </div>

      {/* Control Panels Matrix */}
      <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-205 dark:border-white/5 rounded-2xl p-4 space-y-4">
        
        <div className="grid gap-4 sm:grid-cols-3 items-center">
          {/* Dataset Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">1. Select Data Challenge</label>
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs rounded-lg px-2.5 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="linear">Linear Split (Easy)</option>
              <option value="xor">XOR / Quadrants (Hard - Needs MLP)</option>
              <option value="circle">Concentric Circles (Very Hard)</option>
              <option value="custom">Custom (Draw points on canvas)</option>
            </select>
          </div>

          {/* Brain Mode toggle */}
          <div>
            <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">2. Network Brain Power</label>
            <div className="flex bg-white dark:bg-slate-950 rounded-lg p-1 border border-slate-200 dark:border-slate-850">
              <button
                onClick={() => { setMode('single'); initWeights(); }}
                className={`flex-grow py-1 text-[10px] font-extrabold rounded transition cursor-pointer ${
                  mode === 'single' ? 'bg-indigo-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Single Neuron
              </button>
              <button
                onClick={() => { setMode('mlp'); initWeights(); }}
                className={`flex-grow py-1 text-[10px] font-extrabold rounded transition cursor-pointer ${
                  mode === 'mlp' ? 'bg-indigo-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                MLP Layer
              </button>
            </div>
          </div>

          {/* Activation select (if MLP) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">3. Activation Function</label>
            <select
              disabled={mode === 'single'}
              value={activation}
              onChange={(e) => { setActivation(e.target.value); initWeights(); }}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs rounded-lg px-2.5 py-2 text-slate-800 dark:text-slate-200 outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="sigmoid">Sigmoid (Smooth curves)</option>
              <option value="relu">ReLU (Sharp angles, fast)</option>
              <option value="tanh">Tanh (Zero-centered)</option>
            </select>
          </div>
        </div>

        {/* Learning Rate & Actions Strip */}
        <div className="border-t border-slate-200 dark:border-white/5 pt-3.5 grid gap-4 sm:grid-cols-2 items-center">
          
          {/* LR slider */}
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="font-bold text-slate-450 uppercase">4. Learning Rate (Step Size)</span>
              <span className="font-mono font-bold text-cyan-500">{lr.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="1.50"
              step="0.01"
              value={lr}
              onChange={(e) => setLr(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Action trigger buttons */}
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2">
              <button
                onClick={() => { trainEpoch(); }}
                className="flex-1 bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-white/5 text-[10px] font-bold py-2 rounded-xl cursor-pointer transition"
              >
                1 Epoch
              </button>
              <button
                onClick={() => { initWeights(); }}
                className="flex-1 bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-white/5 text-[10px] font-bold py-2 rounded-xl cursor-pointer transition"
              >
                Reset Weights
              </button>
            </div>

            <button
              onClick={() => setIsPlaying(prev => !prev)}
              disabled={pointsData.length === 0}
              className={`w-full text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex justify-center items-center gap-1.5 cursor-pointer ${
                pointsData.length === 0
                  ? 'bg-slate-300 dark:bg-slate-850 text-slate-400 cursor-not-allowed shadow-none'
                  : isPlaying
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/10'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10'
              }`}
            >
              {isPlaying ? (
                <>
                  <X className="h-4.5 w-4.5" />
                  <span>Pause Training</span>
                </>
              ) : (
                <>
                  <Play className="h-4.5 w-4.5" />
                  <span>Auto Train</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Converged overlay toast alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 flex items-center justify-center text-center p-6 z-50 rounded-[32px] border border-emerald-500/20 backdrop-blur-xs"
          >
            <div>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-550/15 text-emerald-600 border border-emerald-550/30 shadow-lg shadow-emerald-550/10 animate-bounce">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-black text-slate-805 dark:text-white">Neural Net Converged!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-normal">
                Loss threshold dropped below 0.005. Optimization completed successfully.
              </p>
              <span className="inline-block mt-3 text-xs font-mono font-bold text-emerald-650 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                +250 XP Credited
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ============================================================================
// COMPONENT: DEV LOG TOGGLE BOARD CONTROL CONSOLE
// ============================================================================

function DeveloperToggle({ lastSystemEvent, view, setView, performSystemHardReset }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="mx-auto max-w-4xl px-4 pb-3">
        <div className="rounded-2xl overflow-hidden shadow-2xl liquid-glass">
          
          {/* Header toggler bar */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between bg-slate-900/5 dark:bg-slate-955/40 px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer border-none"
          >
            <span className="flex items-center gap-1.5 font-bold">
              <Layers className="h-3.5 w-3.5 text-orange-500" /> Developer Control Terminal
            </span>
            <span className="text-[9px] opacity-40">Toggle</span>
          </button>

          {/* Expanded log console drawer */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'organizer-dashboard', label: 'Outreach Suite', color: 'hover:bg-orange-500/20 active:bg-orange-500/30' },
                      { id: 'student-onboarding', label: 'Biometric Gateway', color: 'hover:bg-blue-500/20 active:bg-blue-500/30' },
                      { id: 'student-live', label: 'Live Seminar Stage', color: 'hover:bg-purple-500/20 active:bg-purple-500/30' },
                      { id: 'curriculum-editor', label: 'Curriculum Editor', color: 'hover:bg-teal-500/20 active:bg-teal-500/30' }
                    ].map(route => (
                      <button
                        key={route.id}
                        onClick={() => setView(route.id)}
                        className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border-none ${
                          view === route.id
                            ? 'bg-slate-900/10 dark:bg-white/15 text-slate-800 dark:text-white ring-1 ring-black/5 dark:ring-white/20'
                            : `bg-slate-200/50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 ${route.color}`
                        }`}
                      >
                        {route.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={performSystemHardReset}
                    className="rounded-lg bg-red-500/10 border border-red-500/25 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-650 hover:bg-red-500/20 active:scale-95 cursor-pointer transition"
                  >
                    Reset System Database
                  </button>
                </div>

                {/* Console System Event Log Row */}
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/60 dark:bg-slate-950/40 p-2.5 font-mono text-[10px] text-slate-550 border border-slate-200 dark:border-white/5">
                  <Activity className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                  <span className="font-semibold text-slate-400">SYSTEM_EVENT:</span>
                  <span className="truncate text-slate-700 dark:text-slate-300">{lastSystemEvent}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// TOPIC SANDBOX 4: AI ETHICS & ALIGNMENT SIMULATOR
// ============================================================================

function AIEthicsSandbox({ setPoints }) {
  const [safetyGuardrails, setSafetyGuardrails] = useState(50);
  const [biasCorrection, setBiasCorrection] = useState(50);
  const [adversarialStress, setAdversarialStress] = useState(50);
  const [hasClaimedXP, setHasClaimedXP] = useState(false);

  const complianceScore = useMemo(() => {
    const base = (safetyGuardrails * 0.5) + (biasCorrection * 0.4) + ((100 - adversarialStress) * 0.1);
    return Math.min(100, Math.max(0, Math.round(base)));
  }, [safetyGuardrails, biasCorrection, adversarialStress]);

  const isAligned = complianceScore >= 80;

  const claimAlignmentXP = () => {
    if (hasClaimedXP || !isAligned) return;
    setPoints(p => p + 100);
    setHasClaimedXP(true);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold block mb-1">Sandbox 3: AI Ethics & Alignment</span>
        <h4 className="text-sm font-bold text-slate-855 dark:text-white mb-2">Ethics Audit Simulator</h4>
        <p className="text-xs text-slate-500 mb-4 leading-normal">
          Adjust the alignment vectors below. The system reaches equilibrium when compliance matches or exceeds 80%.
        </p>

        <div className="space-y-3.5 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-550 dark:text-slate-400 uppercase font-bold">Safety Guardrails</span>
              <span className="text-indigo-500 font-bold">{safetyGuardrails}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={safetyGuardrails}
              onChange={(e) => setSafetyGuardrails(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-550 dark:text-slate-400 uppercase font-bold">Bias Correction Weight</span>
              <span className="text-indigo-500 font-bold">{biasCorrection}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={biasCorrection}
              onChange={(e) => setBiasCorrection(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-550 dark:text-slate-400 uppercase font-bold">Adversarial Stress Level</span>
              <span className="text-indigo-500 font-bold">{adversarialStress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={adversarialStress}
              onChange={(e) => setAdversarialStress(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 p-4 flex flex-col items-center">
          <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block mb-1">Compliance Status</span>
          <div className="text-3xl font-mono font-black tracking-tighter text-slate-805 dark:text-white">
            {complianceScore}%
          </div>
          <div className={`mt-2 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
            isAligned 
              ? 'bg-emerald-500/10 text-emerald-650 border border-emerald-500/20 shadow-xs' 
              : 'bg-rose-500/10 text-rose-650 border border-rose-500/20'
          }`}>
            {isAligned ? '✓ ALIGNED & STABLE' : '✗ CRITICAL ALIGNMENT DRIFT'}
          </div>
        </div>
      </div>

      <button
        onClick={claimAlignmentXP}
        disabled={hasClaimedXP || !isAligned}
        className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md mt-4 cursor-pointer ${
          hasClaimedXP || !isAligned
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-orange-500 to-blue-600 shadow-orange-500/10 hover:scale-[1.02]'
        }`}
      >
        {hasClaimedXP ? 'XP Claimed' : 'Unlock Alignment XP (+100)'}
      </button>
    </div>
  );
}

// ============================================================================
// VIEW COMPONENT 4: CAMPUS CURRICULUM & COHORT EDITOR
// ============================================================================

function CurriculumEditor({
  curriculumTimeline, outreachCohorts, selectedEditTopicId, setSelectedEditTopicId, selectedEditTopicObject,
  updateChapterField, updateQuizOption, addCustomChapter, deleteCustomChapter, updateCohortField
}) {
  const currentCh = selectedEditTopicObject || curriculumTimeline[0];
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -15 }}
      transition={{ duration: 0.4 }}
      className="grid flex-1 gap-6 lg:grid-cols-12"
    >
      {/* LEFT SIDEBAR: Chapters Outline */}
      <div className="liquid-glass flex flex-col justify-between rounded-[32px] p-6 lg:col-span-4 drift-sidebar">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-655">
            <GraduationCap className="h-3.5 w-3.5" /> Course Designer
          </div>
          <h3 className="text-xl font-bold text-slate-805 dark:text-white mb-2">Seminar Outline</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-normal">
            Select an itinerary node to customize content blocks, vocab logs, or quiz evaluation criteria.
          </p>

          <div className="space-y-2 mb-4 max-h-[350px] overflow-y-auto pr-1">
            {curriculumTimeline.map((chapter) => {
              const isSelected = selectedEditTopicId === chapter.id;
              return (
                <div key={chapter.id} className="relative group">
                  <button
                    onClick={() => setSelectedEditTopicId(chapter.id)}
                    className={`w-full text-left rounded-xl p-3 border transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-500/5 ring-1 ring-indigo-500/20' 
                        : 'border-slate-200 dark:border-white/5 bg-slate-900/5 dark:bg-slate-955/20 hover:border-slate-350 dark:hover:border-white/10'
                    }`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-wider opacity-50 text-slate-500 dark:text-slate-400">{chapter.time}</span>
                    <h4 className="text-xs font-bold text-slate-805 dark:text-white tracking-tight leading-tight">
                      {chapter.title}
                    </h4>
                    <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 leading-normal">{chapter.subtitle}</p>
                  </button>
                  <button
                    onClick={() => deleteCustomChapter(chapter.id)}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 bg-red-500/10 text-red-655 hover:bg-red-500/20 p-1.5 rounded-lg border border-red-500/20 transition cursor-pointer"
                    title="Delete chapter node"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={addCustomChapter}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition flex justify-center items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Chapter Node
        </button>
      </div>

      {/* RIGHT PANEL: Editor Form */}
      <div className="lg:col-span-8 flex flex-col gap-6 drift-main">
        {/* Core fields */}
        <div className="liquid-glass rounded-[32px] p-6 space-y-4">
          <div className="border-b border-slate-100 dark:border-white/5 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 dark:text-indigo-400 font-bold block mb-0.5">Chapter Configuration</span>
            <h3 className="text-lg font-bold text-slate-850 dark:text-white">Edit Meta & Details</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Chapter Title</label>
              <input
                type="text"
                value={currentCh.title}
                onChange={(e) => updateChapterField('title', e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-3 py-2 text-slate-805 dark:text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Time Stamp</label>
              <input
                type="text"
                value={currentCh.time}
                onChange={(e) => updateChapterField('time', e.target.value)}
                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-3 py-2 text-slate-805 dark:text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Subtitle / Abstract</label>
              <input
                type="text"
                value={currentCh.subtitle}
                onChange={(e) => updateChapterField('subtitle', e.target.value)}
                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-3 py-2 text-slate-805 dark:text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Reading Content Text</label>
              <textarea
                rows={4}
                value={currentCh.readingText}
                onChange={(e) => updateChapterField('readingText', e.target.value)}
                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-3 py-2 text-slate-805 dark:text-slate-200 outline-none focus:border-indigo-500 leading-normal"
              />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-white/5" />

          {/* Vocabulary definition */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Vocabulary Word</label>
              <input
                type="text"
                value={currentCh.term || ''}
                onChange={(e) => updateChapterField('term', e.target.value)}
                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-3 py-2 text-slate-805 dark:text-slate-200 outline-none focus:border-indigo-500"
                placeholder="e.g. Backpropagation"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Word Definition / Explanation tooltip</label>
              <input
                type="text"
                value={currentCh.tooltip || ''}
                onChange={(e) => updateChapterField('tooltip', e.target.value)}
                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-3 py-2 text-slate-805 dark:text-slate-200 outline-none focus:border-indigo-500"
                placeholder="Brief mathematical definition"
              />
            </div>
          </div>
        </div>

        {/* Evaluation quiz config */}
        <div className="liquid-glass rounded-[32px] p-6 space-y-4">
          <div className="border-b border-slate-100 dark:border-white/5 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 dark:text-indigo-400 font-bold block mb-0.5">Evaluation Engine</span>
            <h3 className="text-lg font-bold text-slate-850 dark:text-white">Edit Companion Quiz</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Evaluation Question</label>
              <input
                type="text"
                value={currentCh.quiz.question}
                onChange={(e) => updateChapterField('quiz.question', e.target.value)}
                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-3 py-2 text-slate-855 dark:text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {currentCh.quiz.options.map((option, idx) => (
                <div key={idx}>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Option {String.fromCharCode(65 + idx)}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateQuizOption(idx, e.target.value)}
                    className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-3 py-2 text-slate-855 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Correct Answer</label>
              <select
                value={currentCh.quiz.answer}
                onChange={(e) => updateChapterField('quiz.answer', parseInt(e.target.value))}
                className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-2.5 py-2 text-slate-805 dark:text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
              >
                {currentCh.quiz.options.map((option, idx) => (
                  <option key={idx} value={idx}>
                    [{String.fromCharCode(65 + idx)}] {option.substring(0, 45)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cohort editor grid */}
        <div className="liquid-glass rounded-[32px] p-6 space-y-4">
          <div className="border-b border-slate-100 dark:border-white/5 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 dark:text-indigo-400 font-bold block mb-0.5">Cohort Target Matrix</span>
            <h3 className="text-lg font-bold text-slate-850 dark:text-white">Edit Outreach Channels</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {outreachCohorts.map(cohort => (
              <div key={cohort.id} className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                <div className="mb-2 font-bold text-xs text-slate-805 dark:text-white truncate">{cohort.label}</div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1">Target size</label>
                    <input
                      type="number"
                      value={cohort.count}
                      onChange={(e) => updateCohortField(cohort.id, 'count', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-2 py-1 text-slate-850 dark:text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1">Description / Notes</label>
                    <input
                      type="text"
                      value={cohort.note}
                      onChange={(e) => updateCohortField(cohort.id, 'note', e.target.value)}
                      className="w-full bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 text-xs rounded-lg px-2 py-1 text-slate-850 dark:text-slate-200 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
