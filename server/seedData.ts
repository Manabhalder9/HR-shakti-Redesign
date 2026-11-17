export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'member' | 'moderator' | 'admin';
  title: string;
  organization: string;
  location: string;
  bio: string;
  skills: string[];
  avatarInitials: string;
  connected?: boolean;
  followers: number;
  following: number;
}

export interface ReplyRecord {
  id: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface DiscussionRecord {
  id: string;
  kind: 'discussion' | 'question';
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  communityId: string;
  communityName: string;
  tags: string[];
  commentCount: number;
  likes: number;
  likedByMe?: boolean;
  createdAt: string;
  reason?: string;
  poll?: {
    question: string;
    totalVotes: number;
    votedOptionId?: string;
    options: PollOption[];
  };
  replies: ReplyRecord[];
}

export interface BlogPostRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorTitle: string;
  readingTime: string;
  publishedAt: string;
  coverImage?: string;
}

export interface NewsItemRecord {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  category: string;
}

export interface JobRecord {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: string;
  employmentType: string;
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  postedAt: string;
}

export interface CommunityRecord {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  description: string;
  cadence: string;
  coverImage?: string;
  joined?: boolean;
}

export interface CourseRecord {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  instructor: string;
  description: string;
  modules: string[];
  enrolled?: boolean;
  progress?: number;
}

export interface EventRecord {
  id: string;
  title: string;
  format: string;
  date: string;
  time: string;
  location: string;
  host: string;
  description: string;
  seatsLeft: number;
  registered?: boolean;
}

export function createInitialStore() {
  const demoUser: UserRecord = {
    id: 'u-demo',
    name: 'Priya Nair',
    email: 'priya@hrshakti.com',
    password: 'password123',
    role: 'member',
    title: 'Head of People Operations',
    organization: 'Aravind FinTech',
    location: 'Bengaluru, India',
    bio: 'Building transparent compensation systems, thoughtful manager enablement, and steady onboarding rituals for 450+ distributed team members.',
    skills: ['People Operations', 'Compensation Design', 'Org Design', 'Manager Coaching', 'Employee Relations'],
    avatarInitials: 'PN',
    followers: 312,
    following: 148,
  };

  const people: UserRecord[] = [
    demoUser,
    {
      id: 'u-2',
      name: 'Rohan Deshmukh',
      email: 'rohan@kaverilabs.in',
      role: 'member',
      title: 'VP of Talent & Culture',
      organization: 'Kaveri Labs',
      location: 'Pune, India',
      bio: 'Leading structured hiring calibration and early-career engineering academies across four cities.',
      skills: ['Talent Acquisition', 'Structured Interviews', 'Employer Brand'],
      avatarInitials: 'RD',
      connected: true,
      followers: 486,
      following: 192,
    },
    {
      id: 'u-3',
      name: 'Meera Krishnan',
      email: 'meera@sahayog.org',
      role: 'moderator',
      title: 'Principal HR Business Partner',
      organization: 'Sahayog Mobility',
      location: 'Chennai, India',
      bio: 'Partnering with manufacturing and product engineering leaders on succession planning and ethical workplace compliance.',
      skills: ['HRBP', 'Succession Planning', 'POSH & Compliance', 'Change Management'],
      avatarInitials: 'MK',
      connected: true,
      followers: 620,
      following: 215,
    },
    {
      id: 'u-4',
      name: 'Ananya Sengupta',
      email: 'ananya@vervecraft.co',
      role: 'member',
      title: 'Director of Learning & Development',
      organization: 'VerveCraft Systems',
      location: 'Hyderabad, India',
      bio: 'Designing peer-led manager circles and capability frameworks that stick beyond the workshop.',
      skills: ['L&D Strategy', 'Leadership Cohorts', 'Competency Mapping'],
      avatarInitials: 'AS',
      connected: false,
      followers: 274,
      following: 130,
    },
    {
      id: 'u-5',
      name: 'Vikramaditya Rao',
      email: 'vikram@meridianhealth.in',
      role: 'member',
      title: 'Total Rewards Lead',
      organization: 'Meridian HealthTech',
      location: 'Mumbai, India',
      bio: 'Making pay bands, equity education, and benefits clear enough for every candidate and manager.',
      skills: ['Total Rewards', 'Pay Equity', 'ESOP Education'],
      avatarInitials: 'VR',
      connected: false,
      followers: 398,
      following: 164,
    },
    {
      id: 'u-6',
      name: 'Kavita Subramanian',
      email: 'kavita@banyanwork.com',
      role: 'member',
      title: 'People Analytics & HRIS Architect',
      organization: 'Banyan Work',
      location: 'Delhi NCR, India',
      bio: 'Turning retention signals, onboarding surveys, and exit narratives into practical leadership decisions.',
      skills: ['People Analytics', 'HRIS', 'Workforce Planning'],
      avatarInitials: 'KS',
      connected: true,
      followers: 345,
      following: 175,
    },
  ];

  const communities: CommunityRecord[] = [
    {
      id: 'c-1',
      name: 'People Partners Circle',
      category: 'HRBP & Strategy',
      memberCount: 1840,
      description: 'Candid peer exchange for HRBPs navigating org restructures, leadership alignment, and complex people decisions.',
      cadence: 'Weekly peer case study · Thursdays',
      coverImage: '/src/assets/images/community_gathering_workshop_1794889489213.jpg',
      joined: true,
    },
    {
      id: 'c-2',
      name: 'Total Rewards & Pay Equity Guild',
      category: 'Compensation',
      memberCount: 1120,
      description: 'Benchmarks, salary band architecture, ESOP communication templates, and annual merit-cycle trade-offs.',
      cadence: 'Monthly comp clinic · First Tuesday',
      joined: true,
    },
    {
      id: 'c-3',
      name: 'Talent Craft & Structured Hiring',
      category: 'Talent Acquisition',
      memberCount: 2350,
      description: 'Replacing gut-feel interviews with calibrated scorecards, humane candidate feedback, and realistic job previews.',
      cadence: 'Bi-weekly rubric review',
      joined: false,
    },
    {
      id: 'c-4',
      name: 'Learning Architects Collective',
      category: 'Learning & Development',
      memberCount: 940,
      description: 'For L&D builders designing first-time manager bootcamps, internal mobility guilds, and cohort-based learning.',
      cadence: 'Monthly workshop swap',
      joined: false,
    },
    {
      id: 'c-5',
      name: 'Workplace Policy & POSH Practitioners',
      category: 'Governance & Care',
      memberCount: 1490,
      description: 'Practical guidance on respectful workplace committees, compliant documentation, and trauma-informed inquiry craft.',
      cadence: 'Legal & policy digest every Friday',
      joined: false,
    },
    {
      id: 'c-6',
      name: 'First-90-Days Onboarding Lab',
      category: 'Employee Experience',
      memberCount: 785,
      description: 'Rituals, buddy playbooks, and milestone check-ins that help new hires feel anchored in hybrid and on-site teams.',
      cadence: 'Open template library',
      joined: false,
    },
  ];

  const news: NewsItemRecord[] = [
    {
      id: 'n-1',
      title: 'Pay Transparency Rules Push Mid-Market Teams to Publish Clearer Band Ranges',
      description: 'People teams across India and APAC are pairing published compensation bands with manager coaching workshops so internal equity conversations stay constructive rather than reactive.',
      source: 'People Matters Briefing',
      publishedAt: '2026-11-14T09:00:00Z',
      url: 'https://hrshakti.com/news',
      category: 'Compensation',
    },
    {
      id: 'n-2',
      title: 'Why First-Time Managers Account for 60% of Preventable Early Attrition',
      description: 'New cohort studies show structured 90-day peer coaching for newly promoted team leads improves six-month retention more reliably than annual engagement surveys.',
      source: 'Workplace Craft Review',
      publishedAt: '2026-11-12T11:30:00Z',
      url: 'https://hrshakti.com/news',
      category: 'Leadership',
    },
    {
      id: 'n-3',
      title: 'Skills-First Internal Mobility Gains Ground Over External Lateral Hiring',
      description: 'Organizations tightening hiring budgets are building internal talent marketplaces and transparent capability ladders to retain mid-tenure specialists.',
      source: 'HR Policy Digest',
      publishedAt: '2026-11-10T07:45:00Z',
      url: 'https://hrshakti.com/news',
      category: 'Talent Strategy',
    },
    {
      id: 'n-4',
      title: 'Hybrid Attendance Mandates Give Way to Team-Level Rhythm Charters',
      description: 'Instead of rigid company-wide badge counts, progressive HR leaders are shifting toward quarterly collaboration charters negotiated by each function.',
      source: 'Modern Work Chronicle',
      publishedAt: '2026-11-08T14:15:00Z',
      url: 'https://hrshakti.com/news',
      category: 'Culture',
    },
  ];

  const blogs: BlogPostRecord[] = [
    {
      id: 'b-1',
      slug: 'designing-performance-conversations-people-trust',
      title: 'Designing Performance Conversations People Actually Trust',
      category: 'Performance & Craft',
      excerpt: 'When calibration becomes a black box, trust erodes fast. Here is how three mid-sized HR teams rebuilt review cycles around shared evidence and clear expectations.',
      content: `Most performance review frustration is not about receiving feedback—it is about feeling surprised by the outcome.\n\nAcross forty interviews with HR business partners and engineering managers, one pattern stood out: teams that separated developmental coaching from compensation calibration saw higher clarity and significantly fewer escalations.\n\nThree practical shifts make the biggest difference:\n1. Publish the rubric alongside plain-English examples of what "exceeding" looks like in each role level.\n2. Require managers to preview themes two weeks before formal ratings are finalized.\n3. Train calibration facilitators to challenge recency bias with concrete project artifacts rather than adjectives.\n\nWhen people understand how decisions are weighed, even difficult feedback becomes a shared plan forward.`,
      authorName: 'Meera Krishnan',
      authorTitle: 'Principal HRBP, Sahayog Mobility',
      readingTime: '6 min read',
      publishedAt: '2026-11-11T08:00:00Z',
      coverImage: '/src/assets/images/journal_featured_craft_1794889486989.jpg',
    },
    {
      id: 'b-2',
      slug: 'the-first-90-days-rituals-without-noise',
      title: 'The First 90 Days: Rituals That Build Belonging Without Noise',
      category: 'Onboarding',
      excerpt: 'New hires do not need forty slide decks in week one. They need clarity on context, a trusted peer buddy, and an unhurried rhythm.',
      content: `Great onboarding respects cognitive load. Instead of front-loading every compliance module and product history slide into days one through three, sequence context over twelve weeks.\n\nPair each joiner with a cross-functional peer buddy outside their reporting line, establish a 30-day listening check-in led by People Ops, and give hiring managers a two-page blueprint of expectations for month one.`,
      authorName: 'Ananya Sengupta',
      authorTitle: 'Director of L&D, VerveCraft Systems',
      readingTime: '5 min read',
      publishedAt: '2026-11-06T08:00:00Z',
      coverImage: '/src/assets/images/journal_onboarding_rituals_1794889489621.jpg',
    },
    {
      id: 'b-3',
      slug: 'making-total-rewards-legible-at-offer-stage',
      title: 'Making Total Rewards Legible Before a Candidate Signs',
      category: 'Total Rewards',
      excerpt: 'Plain-language offer letters and realistic ESOP scenario walkthroughs turn compensation calls into moments of credibility.',
      content: `Candidates remember how honestly you explained their offer long after they join. Replacing opaque CTC tables with clear cash, variable, benefits, and equity explanations builds durable goodwill from day zero.`,
      authorName: 'Vikramaditya Rao',
      authorTitle: 'Total Rewards Lead, Meridian HealthTech',
      readingTime: '4 min read',
      publishedAt: '2026-10-29T08:00:00Z',
      coverImage: '/src/assets/images/community_gathering_workshop_1794889489213.jpg',
    },
  ];

  const discussions: DiscussionRecord[] = [
    {
      id: 'd-1',
      kind: 'discussion',
      title: 'How are you structuring manager enablement for newly promoted leads without pulling them out of sprints for days?',
      content: `We promoted 18 senior individual contributors into first-time manager roles this quarter. Full-day classroom workshops created calendar resentment, yet skipping foundational coaching led to uneven 1:1s.\n\nWe are testing 75-minute bi-weekly peer case circles paired with short written field guides on difficult conversations and delegation. What cadence has actually changed manager behavior in your org?`,
      authorId: 'u-4',
      authorName: 'Ananya Sengupta',
      authorTitle: 'Director of L&D · VerveCraft Systems',
      communityId: 'c-4',
      communityName: 'Learning Architects Collective',
      tags: ['Manager Enablement', 'L&D', 'Leadership'],
      commentCount: 14,
      likes: 42,
      createdAt: '2026-11-15T10:20:00Z',
      reason: 'Trending in Learning Architects Collective',
      poll: {
        question: 'Which format drives the highest follow-through for new managers?',
        totalVotes: 68,
        options: [
          { id: 'po-1', label: 'Bi-weekly 75-min peer case circles', votes: 34 },
          { id: 'po-2', label: '1:1 external leadership coaching', votes: 16 },
          { id: 'po-3', label: 'Two-day offsite immersion cohort', votes: 11 },
          { id: 'po-4', label: 'Async playbooks + office hours', votes: 7 },
        ],
      },
      replies: [
        {
          id: 'r-1',
          authorId: 'u-3',
          authorName: 'Meera Krishnan',
          authorTitle: 'Principal HRBP',
          content: 'Bi-weekly 60-minute peer circles anchored around real anonymized dilemmas worked best for us. Attendance stayed above 88% when we kept groups to 6 managers.',
          createdAt: '2026-11-15T12:10:00Z',
          likes: 11,
        },
        {
          id: 'r-2',
          authorId: 'u-2',
          authorName: 'Rohan Deshmukh',
          authorTitle: 'VP of Talent & Culture',
          content: 'Pairing each new manager with an experienced peer mentor outside their department for the first 90 days cut escalation tickets in half.',
          createdAt: '2026-11-15T15:40:00Z',
          likes: 8,
        },
      ],
    },
    {
      id: 'd-2',
      kind: 'discussion',
      title: 'Sharing salary band midpoints internally: what happened when you opened comp ranges to managers?',
      content: `We are preparing to share full band ranges (minimum, midpoint, maximum) with all people managers ahead of the April cycle. Curious how you handled outliers sitting above the 75th percentile and what FAQs managers needed most.`,
      authorId: 'u-5',
      authorName: 'Vikramaditya Rao',
      authorTitle: 'Total Rewards Lead · Meridian HealthTech',
      communityId: 'c-2',
      communityName: 'Total Rewards & Pay Equity Guild',
      tags: ['Pay Transparency', 'Compensation', 'Managers'],
      commentCount: 19,
      likes: 56,
      createdAt: '2026-11-13T09:15:00Z',
      reason: 'Active in Total Rewards & Pay Equity Guild',
      replies: [
        {
          id: 'r-3',
          authorId: 'u-demo',
          authorName: 'Priya Nair',
          authorTitle: 'Head of People Operations',
          content: 'Giving managers a two-page "how to answer tough pay questions" script before opening the dashboard saved dozens of awkward conversations.',
          createdAt: '2026-11-13T11:30:00Z',
          likes: 14,
        },
      ],
    },
    {
      id: 'd-3',
      kind: 'discussion',
      title: 'Moving away from generic engagement scores toward pulse questions tied to real team decisions',
      content: `Annual 60-question surveys gave us nice heatmaps that rarely changed Tuesday morning behavior. This year we moved to a focused 8-question quarterly pulse with mandatory action-owner notes within 14 days.`,
      authorId: 'u-6',
      authorName: 'Kavita Subramanian',
      authorTitle: 'People Analytics Architect · Banyan Work',
      communityId: 'c-1',
      communityName: 'People Partners Circle',
      tags: ['People Analytics', 'Listening', 'Culture'],
      commentCount: 9,
      likes: 31,
      createdAt: '2026-11-10T16:45:00Z',
      reason: 'Recommended from People Partners Circle',
      replies: [],
    },
    {
      id: 'q-1',
      kind: 'question',
      title: 'What is a fair notice-period buyout policy that protects project handovers without locking candidates in?',
      content: `Our 90-day notice period is hurting offer acceptance because candidates assume we expect the same rigidity. We want to transition to 45–60 days with mutual buyout flexibility—how have you structured the transition cleanly?`,
      authorId: 'u-2',
      authorName: 'Rohan Deshmukh',
      authorTitle: 'VP of Talent & Culture',
      communityId: 'c-5',
      communityName: 'Workplace Policy & POSH Practitioners',
      tags: ['Policy', 'Notice Period', 'Talent'],
      commentCount: 7,
      likes: 24,
      createdAt: '2026-11-14T14:00:00Z',
      replies: [
        {
          id: 'r-4',
          authorId: 'u-3',
          authorName: 'Meera Krishnan',
          authorTitle: 'Principal HRBP',
          content: 'Standardize at 60 days for IC roles, make early release default once a documented handover checklist is signed off by the manager, and reserve buyout only for uncompleted handover milestones.',
          createdAt: '2026-11-14T17:10:00Z',
          likes: 15,
        },
      ],
    },
    {
      id: 'q-2',
      kind: 'question',
      title: 'How do you run calibrated exit interviews so departing employees give candid feedback instead of polite defaults?',
      content: `Too many exit interviews end with "better growth opportunity" when the real friction was manager communication or unclear role scope. Looking for scripts or timing tweaks that surfaced real insight.`,
      authorId: 'u-demo',
      authorName: 'Priya Nair',
      authorTitle: 'Head of People Operations',
      communityId: 'c-1',
      communityName: 'People Partners Circle',
      tags: ['Retention', 'Exit Interviews', 'HRBP'],
      commentCount: 5,
      likes: 18,
      createdAt: '2026-11-09T11:20:00Z',
      replies: [],
    },
  ];

  const jobs: JobRecord[] = [
    {
      id: 'j-1',
      title: 'Senior People Business Partner — Product & Engineering',
      company: 'Sahayog Mobility',
      location: 'Bengaluru / Hybrid',
      workMode: 'Hybrid (3 days)',
      employmentType: 'Full-time',
      salary: '₹28L – ₹36L / yr',
      experience: '6–9 years',
      description: 'Partner closely with VPs of Engineering and Product on org design, leadership coaching, performance calibration, and retention strategy across 220 builders.',
      requirements: ['6+ years in progressive HRBP roles', 'Strong org-design and facilitation craft', 'Fluency with compensation cycles and people data'],
      postedAt: '2026-11-14',
    },
    {
      id: 'j-2',
      title: 'Head of Talent Acquisition & Employer Brand',
      company: 'Kaveri Labs',
      location: 'Pune / Remote-friendly',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      salary: '₹32L – ₹42L / yr',
      experience: '8+ years',
      description: 'Lead a 9-person recruiting team building structured hiring scorecards, diverse talent pipelines, and thoughtful candidate experiences across India.',
      requirements: ['Led technical & GTM recruiting teams', 'Built structured interview calibration systems', 'Strong stakeholder partnership'],
      postedAt: '2026-11-12',
    },
    {
      id: 'j-3',
      title: 'Total Rewards & People Analytics Specialist',
      company: 'Meridian HealthTech',
      location: 'Mumbai / Remote',
      workMode: 'Remote',
      employmentType: 'Full-time',
      salary: '₹22L – ₹28L / yr',
      experience: '4–6 years',
      description: 'Own salary benchmarking, job architecture leveling, ESOP education sessions, and executive retention dashboards.',
      requirements: ['Compensation modeling & market benchmarking', 'Advanced spreadsheet / BI fluency', 'Clear written communication'],
      postedAt: '2026-11-10',
    },
    {
      id: 'j-4',
      title: 'Learning & Organizational Development Lead',
      company: 'VerveCraft Systems',
      location: 'Hyderabad',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      salary: '₹24L – ₹30L / yr',
      experience: '5–8 years',
      description: 'Design cohort-based manager academies, internal career mobility frameworks, and onboarding rituals that scale gracefully.',
      requirements: ['Adult learning & workshop facilitation', 'Program measurement beyond completion rates', 'Curriculum design experience'],
      postedAt: '2026-11-08',
    },
  ];

  const courses: CourseRecord[] = [
    {
      id: 'crs-1',
      title: 'Compensation Architecture & Pay Equity in Practice',
      category: 'Total Rewards',
      level: 'Intermediate',
      duration: '4 weeks · 6 modules',
      instructor: 'Vikramaditya Rao',
      description: 'Build defensible job levels, salary bands, compa-ratio diagnostics, and manager merit guides from scratch.',
      modules: ['Job leveling & role ladders', 'Market benchmarking & percentiles', 'Managing compa-ratio outliers', 'Transparent manager talking points'],
      enrolled: true,
      progress: 65,
    },
    {
      id: 'crs-2',
      title: 'The Strategic HRBP Playbook',
      category: 'Business Partnering',
      level: 'Advanced',
      duration: '5 weeks · 8 modules',
      instructor: 'Meera Krishnan',
      description: 'Move beyond transactional escalations to shape quarterly workforce planning, leadership alignment, and healthy team norms.',
      modules: ['Reading P&L & headcount trade-offs', 'Diagnosing team friction early', 'Facilitating calibration with candor', 'Executive stakeholder influence'],
      enrolled: true,
      progress: 30,
    },
    {
      id: 'crs-3',
      title: 'Structured Hiring & Bias-Resistant Scorecards',
      category: 'Talent Acquisition',
      level: 'Foundational',
      duration: '3 weeks · 5 modules',
      instructor: 'Rohan Deshmukh',
      description: 'Design role-specific rubrics, behavioral anchor questions, and debrief protocols that improve signal and candidate respect.',
      modules: ['Intake alignment with hiring managers', 'Rubric & work-sample design', 'Calibrated debrief facilitation'],
      enrolled: false,
      progress: 0,
    },
    {
      id: 'crs-4',
      title: 'Trauma-Informed Workplace Inquiries & POSH Craft',
      category: 'Governance & Care',
      level: 'Specialist',
      duration: '4 weeks · 6 modules',
      instructor: 'Adv. Nandini Iyer',
      description: 'Run fair, confidential, legally sound internal committee hearings while upholding dignity for all participants.',
      modules: ['IC constitution & neutrality', 'Evidence & witness documentation', 'Drafting defensible inquiry reports'],
      enrolled: false,
      progress: 0,
    },
  ];

  const events: EventRecord[] = [
    {
      id: 'ev-1',
      title: 'Roundtable: Rethinking Annual Appraisals for 2027',
      format: 'Live Peer Roundtable',
      date: '2026-11-26',
      time: '6:00 PM – 7:30 PM IST',
      location: 'Online · Interactive Circle',
      host: 'People Partners Circle',
      description: 'An interactive 40-person working session comparing continuous check-ins, merit pools, and manager calibration playbooks.',
      seatsLeft: 14,
      registered: true,
    },
    {
      id: 'ev-2',
      title: 'Bengaluru People Ops Salon: Designing Career Ladders',
      format: 'In-Person Gathering',
      date: '2026-12-04',
      time: '5:30 PM – 8:00 PM IST',
      location: 'Indiranagar, Bengaluru',
      host: 'HR Shakti Bengaluru Chapter',
      description: 'Evening conversation with three People leaders sharing real progression matrices—both IC and management tracks.',
      seatsLeft: 9,
      registered: false,
    },
    {
      id: 'ev-3',
      title: 'Clinic: Communicating ESOPs & Total Rewards Clearly',
      format: 'Workshop',
      date: '2026-12-10',
      time: '4:00 PM – 5:15 PM IST',
      location: 'Online · Live Q&A',
      host: 'Total Rewards & Pay Equity Guild',
      description: 'Walk through real offer-letter templates and equity calculators candidates can actually understand.',
      seatsLeft: 28,
      registered: false,
    },
  ];

  const organizations = [
    {
      id: 'org-1',
      name: 'Sahayog Mobility',
      industry: 'Clean Mobility & EV',
      size: '650+ employees',
      location: 'Bengaluru & Chennai',
      description: 'Known for transparent progression rubrics and peer-led engineering management circles.',
      openRoles: 3,
    },
    {
      id: 'org-2',
      name: 'Aravind FinTech',
      industry: 'Financial Infrastructure',
      size: '450 employees',
      location: 'Bengaluru',
      description: 'Building humane people operations with published compensation bands and structured 90-day onboarding.',
      openRoles: 2,
    },
    {
      id: 'org-3',
      name: 'VerveCraft Systems',
      industry: 'Enterprise SaaS',
      size: '320 employees',
      location: 'Hyderabad & Remote',
      description: 'Pioneers of async rhythm charters and cohort-based leadership development.',
      openRoles: 4,
    },
    {
      id: 'org-4',
      name: 'Meridian HealthTech',
      industry: 'Digital Health',
      size: '510 employees',
      location: 'Mumbai',
      description: 'Clinician-and-builder workplace focused on pay equity and psychological safety.',
      openRoles: 2,
    },
  ];

  const careerPaths = [
    {
      id: 'cp-1',
      title: 'HR Generalist → Strategic People Business Partner',
      horizon: '18–24 months',
      focus: 'Org design, executive coaching, workforce planning, change leadership',
      steps: ['Own end-to-end employee relations for 1 business unit', 'Lead quarterly talent & succession calibration', 'Co-design headcount & org topology with VP leads'],
    },
    {
      id: 'cp-2',
      title: 'Talent Specialist → Head of Talent & Employer Craft',
      horizon: '24–36 months',
      focus: 'Hiring systems, talent intelligence, interviewer calibration, brand strategy',
      steps: ['Replace ad-hoc interviews with structured scorecards', 'Build internal mobility & referral pipelines', 'Manage multi-pod recruiting metrics and budgets'],
    },
    {
      id: 'cp-3',
      title: 'People Ops Lead → Director of Total Rewards & Analytics',
      horizon: '24 months',
      focus: 'Compensation architecture, pay equity audits, HRIS & people metrics',
      steps: ['Design transparent job leveling framework', 'Run annual compa-ratio & gender pay parity audits', 'Connect retention signals to executive reviews'],
    },
  ];

  const mentors = [
    {
      id: 'm-1',
      name: 'Meera Krishnan',
      role: 'Principal HRBP · Sahayog Mobility',
      topics: ['Stakeholder alignment', 'Org transitions', 'HRBP transition'],
      availability: '2 slots / month',
      bio: '12 years guiding HR generalists into trusted strategic business partners across manufacturing and SaaS.',
      requested: false,
    },
    {
      id: 'm-2',
      name: 'Vikramaditya Rao',
      role: 'Total Rewards Lead · Meridian HealthTech',
      topics: ['Salary bands', 'Merit cycles', 'ESOP communication'],
      availability: '1 slot / month',
      bio: 'Helps solo People leads build their first structured compensation architecture without heavyweight consultants.',
      requested: false,
    },
    {
      id: 'm-3',
      name: 'Rohan Deshmukh',
      role: 'VP of Talent & Culture · Kaveri Labs',
      topics: ['Structured hiring', 'Recruiting ops', 'Scaling 50→300'],
      availability: '3 slots / month',
      bio: 'Advises early-stage talent leaders on calibrated hiring loops and candidate experience.',
      requested: true,
    },
  ];

  const tasks = [
    { id: 't-1', title: 'Finalize Q1 compensation band briefing deck for engineering leads', dueDate: '2026-11-20', priority: 'High', category: 'Compensation', done: false },
    { id: 't-2', title: 'Send 90-day onboarding listening prompts to October joiners', dueDate: '2026-11-18', priority: 'Medium', category: 'Onboarding', done: false },
    { id: 't-3', title: 'Review peer buddy feedback from the Product cohort', dueDate: '2026-11-22', priority: 'Low', category: 'Culture', done: true },
  ];

  const calendarEvents = [
    { id: 'cal-1', title: 'People Ops Weekly Alignment', date: '2026-11-18', time: '10:30', type: 'Team Ritual', notes: 'Review open requisitions and Q1 L&D calendar.' },
    { id: 'cal-2', title: 'Roundtable: Rethinking Annual Appraisals', date: '2026-11-26', time: '18:00', type: 'Community Event', notes: 'HR Shakti People Partners Circle session.' },
    { id: 'cal-3', title: 'Mentorship Check-in with Rohan Deshmukh', date: '2026-11-28', time: '16:00', type: 'Mentorship', notes: 'Discuss hiring scorecard calibration.' },
  ];

  const conversations = [
    {
      id: 'conv-1',
      participantId: 'u-3',
      participantName: 'Meera Krishnan',
      participantTitle: 'Principal HRBP · Sahayog Mobility',
      unread: 1,
      messages: [
        { id: 'msg-1', senderId: 'u-3', senderName: 'Meera Krishnan', text: 'Hi Priya! Loved your comment on the salary midpoint thread. Are you joining Thursday’s roundtable?', time: '10:15 AM' },
        { id: 'msg-2', senderId: 'u-demo', senderName: 'Priya Nair', text: 'Thank you Meera! Yes, already registered—looking forward to comparing manager prep scripts.', time: '10:28 AM' },
        { id: 'msg-3', senderId: 'u-3', senderName: 'Meera Krishnan', text: 'Wonderful. I will share our two-page calibration facilitator guide right after the session.', time: '11:02 AM' },
      ],
    },
    {
      id: 'conv-2',
      participantId: 'u-2',
      participantName: 'Rohan Deshmukh',
      participantTitle: 'VP of Talent & Culture · Kaveri Labs',
      unread: 0,
      messages: [
        { id: 'msg-4', senderId: 'u-2', senderName: 'Rohan Deshmukh', text: 'Happy to review your structured interview rubric whenever you have a draft ready.', time: 'Yesterday' },
      ],
    },
  ];

  const notifications = [
    { id: 'not-1', title: 'Meera Krishnan replied to your discussion comment', time: '18m ago', read: false, href: '/discussions/d-2' },
    { id: 'not-2', title: 'Your registration for "Rethinking Annual Appraisals" is confirmed', time: '3h ago', read: false, href: '/events' },
    { id: 'not-3', title: 'New article in HR Shakti Journal: Designing Performance Conversations', time: 'Yesterday', read: true, href: '/blogs/designing-performance-conversations-people-trust' },
  ];

  const applications = [
    {
      id: 'app-1',
      jobId: 'j-1',
      jobTitle: 'Senior People Business Partner — Product & Engineering',
      company: 'Sahayog Mobility',
      appliedAt: '2026-11-12',
      status: 'In Review',
    },
  ];

  const surveys = [
    {
      id: 'sv-1',
      title: '2026 India & APAC People Operations Priorities Pulse',
      description: '5-minute community benchmark on manager readiness, merit budgets, and AI policy guardrails.',
      questions: [
        { id: 'sq-1', prompt: 'What is your top people priority for Q1 2027?', options: ['Manager capability', 'Retention & career paths', 'Compensation clarity', 'Structured hiring'] },
        { id: 'sq-2', prompt: 'Current workplace cadence across core teams?', options: ['Hybrid (2–3 days)', 'Fully distributed / remote', 'On-site 5 days'] },
      ],
      submitted: false,
      responsesCount: 412,
    },
  ];

  const tickets = [
    { id: 'tk-1', subject: 'Requesting chapter host toolkit for Pune HR meetup', category: 'Community Chapters', status: 'Open', updatedAt: '2026-11-14', message: 'Would love access to the welcome slide deck and registration guidelines.' },
  ];

  const certificates = [
    { id: 'cert-1', title: 'People-First Onboarding Architecture', issuedBy: 'HR Shakti Learning Guild', issuedAt: '2026-09-18', credentialId: 'HRS-2026-8412' },
    { id: 'cert-2', title: 'Structured Interview Calibration Practitioner', issuedBy: 'HR Shakti Learning Guild', issuedAt: '2026-06-04', credentialId: 'HRS-2026-4190' },
  ];

  return {
    users: people,
    communities,
    news,
    blogs,
    discussions,
    jobs,
    courses,
    events,
    organizations,
    careerPaths,
    mentors,
    tasks,
    calendarEvents,
    conversations,
    notifications,
    applications,
    surveys,
    tickets,
    certificates,
    savedIds: ['d-1', 'b-1', 'j-1'] as string[],
    contactMessages: [] as Array<{ id: string; name: string; email: string; topic: string; message: string; createdAt: string }>,
    publicStatsOffsets: {
      totalMembers: 4280,
      openRoles: 34,
      publicCommunities: 18,
      conversations: 312,
      publishedCourses: 24,
    },
  };
}
