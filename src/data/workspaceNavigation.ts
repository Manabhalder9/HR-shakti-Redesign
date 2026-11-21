import { isRouteActive } from '../context/RouterContext';

export type WorkspaceIconKey =
  | 'dashboard'
  | 'ai'
  | 'feed'
  | 'discussions'
  | 'communities'
  | 'network'
  | 'messages'
  | 'mentorship'
  | 'jobs'
  | 'applications'
  | 'career'
  | 'organizations'
  | 'learning'
  | 'my-learning'
  | 'credentials'
  | 'events'
  | 'my-events'
  | 'knowledge'
  | 'templates'
  | 'toolkit'
  | 'compliance'
  | 'benchmarks'
  | 'reports'
  | 'calendar'
  | 'tasks'
  | 'files'
  | 'saved'
  | 'surveys'
  | 'profile'
  | 'support'
  | 'settings';

export type WorkspaceContextMode =
  | 'overview'
  | 'community'
  | 'career'
  | 'learning'
  | 'knowledge'
  | 'workspace'
  | 'account'
  | 'none';

export interface WorkspaceNavItem {
  id: string;
  label: string;
  href: string;
  icon: WorkspaceIconKey;
  matchAlso?: string[];
  upcoming?: boolean;
}

export interface WorkspaceNavGroup {
  id: string;
  label: string;
  icon: WorkspaceIconKey;
  defaultOpen?: boolean;
  items: WorkspaceNavItem[];
}

export interface WorkspacePageMeta {
  title: string;
  groupId: string;
  groupLabel: string;
  contextMode: WorkspaceContextMode;
  wide?: boolean;
}

export interface WorkspaceContextAction {
  label: string;
  href: string;
  icon: WorkspaceIconKey;
}

export interface WorkspaceContextResource {
  label: string;
  meta: string;
  href: string;
}

export interface WorkspaceContextConfig {
  kicker: string;
  heading: string;
  summary: string;
  actions: WorkspaceContextAction[];
  resourcesHeading: string;
  resources: WorkspaceContextResource[];
  tipHeading?: string;
  tipBody?: string;
}

export interface UpcomingModuleInfo {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  phaseNote: string;
  plannedCapabilities: string[];
  relatedLinks: Array<{ label: string; href: string }>;
}

/**
 * Complete 30-page HRShakti workspace navigation (plus Dashboard Overview entry).
 * Overlapping legacy routes (/questions, /people, /learning-paths, /blogs, /news)
 * map to their canonical parent item via `matchAlso` so there are zero duplicates.
 */
export const WORKSPACE_NAV_GROUPS: WorkspaceNavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'dashboard',
    defaultOpen: true,
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
      { id: 'ai-assistant', label: 'HRShakti AI Assistant', href: '/ai-assistant', icon: 'ai', upcoming: true },
    ],
  },
  {
    id: 'community',
    label: 'Community & Network',
    icon: 'communities',
    defaultOpen: true,
    items: [
      { id: 'feed', label: 'Community Feed', href: '/feed', icon: 'feed' },
      {
        id: 'discussions',
        label: 'Discussion Forums',
        href: '/discussions',
        icon: 'discussions',
        matchAlso: ['/questions'],
      },
      { id: 'communities', label: 'My Communities', href: '/communities', icon: 'communities' },
      {
        id: 'network',
        label: 'My Network',
        href: '/network',
        icon: 'network',
        matchAlso: ['/people'],
      },
      { id: 'messages', label: 'Messages', href: '/messages', icon: 'messages' },
      { id: 'mentorship', label: 'Mentorship Hub', href: '/mentorship', icon: 'mentorship' },
    ],
  },
  {
    id: 'career',
    label: 'Career & Talent',
    icon: 'jobs',
    defaultOpen: false,
    items: [
      { id: 'jobs', label: 'Explore Jobs', href: '/jobs', icon: 'jobs' },
      { id: 'applications', label: 'My Applications', href: '/applications', icon: 'applications' },
      { id: 'career', label: 'Career Insights', href: '/career', icon: 'career' },
      { id: 'organizations', label: 'Organizations Directory', href: '/organizations', icon: 'organizations' },
    ],
  },
  {
    id: 'learning',
    label: 'Learning & Events',
    icon: 'learning',
    defaultOpen: false,
    items: [
      {
        id: 'learning',
        label: 'Learning Academy',
        href: '/learning',
        icon: 'learning',
        matchAlso: ['/learning-paths'],
      },
      { id: 'my-learning', label: 'My Learning', href: '/my-learning', icon: 'my-learning', upcoming: true },
      { id: 'certificates', label: 'Credentials', href: '/certificates', icon: 'credentials' },
      { id: 'events', label: 'Events & Webinars', href: '/events', icon: 'events' },
      { id: 'my-events', label: 'My Registrations', href: '/my-events', icon: 'my-events' },
    ],
  },
  {
    id: 'resources',
    label: 'Knowledge & Resources',
    icon: 'knowledge',
    defaultOpen: false,
    items: [
      {
        id: 'knowledge-hub',
        label: 'Knowledge Hub',
        href: '/knowledge-hub',
        icon: 'knowledge',
        matchAlso: ['/blogs', '/news'],
      },
      { id: 'templates', label: 'HR Templates Library', href: '/templates', icon: 'templates', upcoming: true },
      { id: 'toolkit', label: 'HR Toolkit', href: '/toolkit', icon: 'toolkit', upcoming: true },
      { id: 'compliance', label: 'Compliance & Labour Law', href: '/compliance', icon: 'compliance', upcoming: true },
      { id: 'benchmarks', label: 'Industry Benchmarks', href: '/benchmarks', icon: 'benchmarks', upcoming: true },
      { id: 'reports', label: 'Reports & Research', href: '/reports', icon: 'reports', upcoming: true },
    ],
  },
  {
    id: 'workspace',
    label: 'Personal Workspace',
    icon: 'tasks',
    defaultOpen: true,
    items: [
      { id: 'calendar', label: 'My Calendar', href: '/calendar', icon: 'calendar' },
      { id: 'tasks', label: 'My Tasks', href: '/tasks', icon: 'tasks' },
      { id: 'files', label: 'My Files', href: '/files', icon: 'files', upcoming: true },
      { id: 'saved', label: 'Saved Items', href: '/saved', icon: 'saved' },
      { id: 'surveys', label: 'Surveys', href: '/surveys', icon: 'surveys' },
    ],
  },
  {
    id: 'account',
    label: 'Account & Support',
    icon: 'settings',
    defaultOpen: false,
    items: [
      { id: 'profile', label: 'My Profile', href: '/profile', icon: 'profile' },
      { id: 'support', label: 'Help Desk', href: '/support', icon: 'support' },
      { id: 'settings', label: 'Settings', href: '/settings', icon: 'settings' },
    ],
  },
];

export function isWorkspaceItemActive(pathname: string, item: WorkspaceNavItem): boolean {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (isRouteActive(clean, item.href)) return true;
  if (item.matchAlso?.some((alt) => isRouteActive(clean, alt))) return true;
  return false;
}

export function isWorkspaceGroupActive(pathname: string, group: WorkspaceNavGroup): boolean {
  return group.items.some((item) => isWorkspaceItemActive(pathname, item));
}

const ROUTE_META_MAP: Record<string, WorkspacePageMeta> = {
  '/dashboard': {
    title: 'Dashboard',
    groupId: 'overview',
    groupLabel: 'Overview',
    contextMode: 'overview',
  },
  '/ai-assistant': {
    title: 'HRShakti AI Assistant',
    groupId: 'overview',
    groupLabel: 'Overview',
    contextMode: 'none',
    wide: true,
  },
  '/feed': {
    title: 'Community Feed',
    groupId: 'community',
    groupLabel: 'Community & Network',
    contextMode: 'community',
  },
  '/discussions': {
    title: 'Discussion Forums',
    groupId: 'community',
    groupLabel: 'Community & Network',
    contextMode: 'community',
  },
  '/questions': {
    title: 'Questions & Answers',
    groupId: 'community',
    groupLabel: 'Community & Network',
    contextMode: 'community',
  },
  '/communities': {
    title: 'My Communities',
    groupId: 'community',
    groupLabel: 'Community & Network',
    contextMode: 'community',
  },
  '/network': {
    title: 'My Network',
    groupId: 'community',
    groupLabel: 'Community & Network',
    contextMode: 'community',
  },
  '/people': {
    title: 'People Directory',
    groupId: 'community',
    groupLabel: 'Community & Network',
    contextMode: 'community',
  },
  '/messages': {
    title: 'Messages',
    groupId: 'community',
    groupLabel: 'Community & Network',
    contextMode: 'none',
    wide: true,
  },
  '/mentorship': {
    title: 'Mentorship Hub',
    groupId: 'community',
    groupLabel: 'Community & Network',
    contextMode: 'community',
  },
  '/jobs': {
    title: 'Explore Jobs',
    groupId: 'career',
    groupLabel: 'Career & Talent',
    contextMode: 'career',
  },
  '/applications': {
    title: 'My Applications',
    groupId: 'career',
    groupLabel: 'Career & Talent',
    contextMode: 'career',
  },
  '/career': {
    title: 'Career Insights',
    groupId: 'career',
    groupLabel: 'Career & Talent',
    contextMode: 'career',
  },
  '/organizations': {
    title: 'Organizations Directory',
    groupId: 'career',
    groupLabel: 'Career & Talent',
    contextMode: 'career',
  },
  '/learning': {
    title: 'Learning Academy',
    groupId: 'learning',
    groupLabel: 'Learning & Events',
    contextMode: 'learning',
  },
  '/learning-paths': {
    title: 'Learning Paths',
    groupId: 'learning',
    groupLabel: 'Learning & Events',
    contextMode: 'learning',
  },
  '/my-learning': {
    title: 'My Learning',
    groupId: 'learning',
    groupLabel: 'Learning & Events',
    contextMode: 'learning',
  },
  '/certificates': {
    title: 'Credentials',
    groupId: 'learning',
    groupLabel: 'Learning & Events',
    contextMode: 'learning',
  },
  '/events': {
    title: 'Events & Webinars',
    groupId: 'learning',
    groupLabel: 'Learning & Events',
    contextMode: 'learning',
  },
  '/my-events': {
    title: 'My Registrations',
    groupId: 'learning',
    groupLabel: 'Learning & Events',
    contextMode: 'learning',
  },
  '/knowledge-hub': {
    title: 'Knowledge Hub',
    groupId: 'resources',
    groupLabel: 'Knowledge & Resources',
    contextMode: 'knowledge',
  },
  '/blogs': {
    title: 'HR Shakti Journal',
    groupId: 'resources',
    groupLabel: 'Knowledge & Resources',
    contextMode: 'knowledge',
  },
  '/news': {
    title: 'People & Work Briefing',
    groupId: 'resources',
    groupLabel: 'Knowledge & Resources',
    contextMode: 'knowledge',
  },
  '/templates': {
    title: 'HR Templates Library',
    groupId: 'resources',
    groupLabel: 'Knowledge & Resources',
    contextMode: 'knowledge',
  },
  '/toolkit': {
    title: 'HR Toolkit',
    groupId: 'resources',
    groupLabel: 'Knowledge & Resources',
    contextMode: 'none',
    wide: true,
  },
  '/compliance': {
    title: 'Compliance & Labour Law',
    groupId: 'resources',
    groupLabel: 'Knowledge & Resources',
    contextMode: 'knowledge',
  },
  '/benchmarks': {
    title: 'Industry Benchmarks',
    groupId: 'resources',
    groupLabel: 'Knowledge & Resources',
    contextMode: 'none',
    wide: true,
  },
  '/reports': {
    title: 'Reports & Research',
    groupId: 'resources',
    groupLabel: 'Knowledge & Resources',
    contextMode: 'none',
    wide: true,
  },
  '/calendar': {
    title: 'My Calendar',
    groupId: 'workspace',
    groupLabel: 'Personal Workspace',
    contextMode: 'none',
    wide: true,
  },
  '/tasks': {
    title: 'My Tasks',
    groupId: 'workspace',
    groupLabel: 'Personal Workspace',
    contextMode: 'workspace',
  },
  '/files': {
    title: 'My Files',
    groupId: 'workspace',
    groupLabel: 'Personal Workspace',
    contextMode: 'none',
    wide: true,
  },
  '/saved': {
    title: 'Saved Items',
    groupId: 'workspace',
    groupLabel: 'Personal Workspace',
    contextMode: 'workspace',
  },
  '/surveys': {
    title: 'Surveys',
    groupId: 'workspace',
    groupLabel: 'Personal Workspace',
    contextMode: 'workspace',
  },
  '/profile': {
    title: 'My Profile',
    groupId: 'account',
    groupLabel: 'Account & Support',
    contextMode: 'account',
  },
  '/support': {
    title: 'Help Desk',
    groupId: 'account',
    groupLabel: 'Account & Support',
    contextMode: 'account',
  },
  '/settings': {
    title: 'Settings',
    groupId: 'account',
    groupLabel: 'Account & Support',
    contextMode: 'none',
    wide: true,
  },
  '/notifications': {
    title: 'Notifications',
    groupId: 'account',
    groupLabel: 'Account & Support',
    contextMode: 'account',
  },
  '/search': {
    title: 'Search Workspace',
    groupId: 'overview',
    groupLabel: 'Overview',
    contextMode: 'none',
    wide: true,
  },
};

export function resolveWorkspacePageMeta(pathname: string): WorkspacePageMeta {
  const clean = pathname.replace(/\/+$/, '') || '/dashboard';
  if (ROUTE_META_MAP[clean]) return ROUTE_META_MAP[clean];
  if (clean.startsWith('/discussions/')) {
    return {
      title: 'Discussion Thread',
      groupId: 'community',
      groupLabel: 'Community & Network',
      contextMode: 'community',
    };
  }
  if (clean.startsWith('/blogs/')) {
    return {
      title: 'Journal Article',
      groupId: 'resources',
      groupLabel: 'Knowledge & Resources',
      contextMode: 'knowledge',
    };
  }
  return {
    title: 'Workspace',
    groupId: 'overview',
    groupLabel: 'Overview',
    contextMode: 'overview',
  };
}

export const CONTEXT_RAIL_CONFIGS: Record<Exclude<WorkspaceContextMode, 'none'>, WorkspaceContextConfig> = {
  overview: {
    kicker: 'Workspace shortcuts',
    heading: 'Daily actions',
    summary: 'Jump straight into active conversations, personal tasks, or your upcoming schedule.',
    actions: [
      { label: 'Start a discussion', href: '/discussions', icon: 'discussions' },
      { label: 'Review open tasks', href: '/tasks', icon: 'tasks' },
      { label: 'Open my calendar', href: '/calendar', icon: 'calendar' },
    ],
    resourcesHeading: 'Workspace pulse',
    resources: [
      { label: 'Community Feed', meta: 'Recent peer updates', href: '/feed' },
      { label: 'Active Surveys', meta: 'Share benchmark input', href: '/surveys' },
      { label: 'Events & Webinars', meta: 'Upcoming roundtables', href: '/events' },
    ],
  },
  community: {
    kicker: 'Community context',
    heading: 'Peer collaboration',
    summary: 'Move between peer debates, joined practice circles, mentorship pairs, and direct messages.',
    actions: [
      { label: 'Ask a peer question', href: '/questions', icon: 'discussions' },
      { label: 'Explore People Directory', href: '/people', icon: 'network' },
      { label: 'Find a mentor', href: '/mentorship', icon: 'mentorship' },
    ],
    resourcesHeading: 'Related spaces',
    resources: [
      { label: 'My Communities', meta: 'Manage joined circles', href: '/communities' },
      { label: 'Direct Messages', meta: 'Peer & mentor threads', href: '/messages' },
      { label: 'Saved Discussions', meta: 'Bookmarked threads', href: '/saved' },
    ],
    tipHeading: 'Practice etiquette',
    tipBody: 'Anonymize employee and company details when sharing sensitive people operations scenarios.',
  },
  career: {
    kicker: 'Career context',
    heading: 'Role & progression tools',
    summary: 'Keep job search, submitted applications, employer research, and growth frameworks connected.',
    actions: [
      { label: 'Track my applications', href: '/applications', icon: 'applications' },
      { label: 'Explore career paths', href: '/career', icon: 'career' },
      { label: 'Update my profile', href: '/profile', icon: 'profile' },
    ],
    resourcesHeading: 'Career resources',
    resources: [
      { label: 'Organizations Directory', meta: 'People-first employers', href: '/organizations' },
      { label: 'Saved Roles', meta: 'Bookmarked openings', href: '/saved' },
      { label: 'Mentorship Hub', meta: '1:1 career guidance', href: '/mentorship' },
    ],
    tipHeading: 'Profile readiness',
    tipBody: 'Ensure your current role, specialty focus, and bio are updated before applying to open roles.',
  },
  learning: {
    kicker: 'Learning context',
    heading: 'Growth & credentials',
    summary: 'Connect cohort courses, learning paths, live events, and verified HR Shakti credentials.',
    actions: [
      { label: 'View my registrations', href: '/my-events', icon: 'my-events' },
      { label: 'View earned credentials', href: '/certificates', icon: 'credentials' },
      { label: 'Browse upcoming events', href: '/events', icon: 'events' },
    ],
    resourcesHeading: 'Continue learning',
    resources: [
      { label: 'Learning Paths', meta: 'Structured role tracks', href: '/learning-paths' },
      { label: 'My Learning', meta: 'Enrolled course tracker', href: '/my-learning' },
      { label: 'HR Shakti Journal', meta: 'Applied field essays', href: '/blogs' },
    ],
    tipHeading: 'Calendar sync',
    tipBody: 'Registered workshops and roundtables can be tracked alongside team rituals in My Calendar.',
  },
  knowledge: {
    kicker: 'Knowledge context',
    heading: 'Editorial & reference',
    summary: 'Navigate long-form HR essays, industry briefings, templates, and statutory updates in one place.',
    actions: [
      { label: 'Read HR Shakti Journal', href: '/blogs', icon: 'knowledge' },
      { label: 'People & Work Briefing', href: '/news', icon: 'feed' },
      { label: 'Open saved reading list', href: '/saved', icon: 'saved' },
    ],
    resourcesHeading: 'Resource library',
    resources: [
      { label: 'HR Templates Library', meta: 'Policies & rubrics', href: '/templates' },
      { label: 'Compliance Updates', meta: 'Labour law advisories', href: '/compliance' },
      { label: 'Reports & Research', meta: 'Quarterly findings', href: '/reports' },
    ],
    tipHeading: 'Save for reference',
    tipBody: 'Bookmark field essays and discussions to revisit them quickly from Saved Items.',
  },
  workspace: {
    kicker: 'Personal workspace',
    heading: 'Stay organized',
    summary: 'Coordinate your tasks, calendar commitments, saved items, and community survey participation.',
    actions: [
      { label: 'Open my calendar', href: '/calendar', icon: 'calendar' },
      { label: 'View saved items', href: '/saved', icon: 'saved' },
      { label: 'Open my files', href: '/files', icon: 'files' },
    ],
    resourcesHeading: 'Workspace links',
    resources: [
      { label: 'Community Surveys', meta: 'Contribute pulse data', href: '/surveys' },
      { label: 'Help Desk', meta: 'Support & requests', href: '/support' },
      { label: 'Account Settings', meta: 'Theme & preferences', href: '/settings' },
    ],
    tipHeading: 'Daily workflow',
    tipBody: 'Track follow-ups in My Tasks and bookmark key discussions or articles in Saved Items for quick reference.',
  },
  account: {
    kicker: 'Account & support',
    heading: 'Member utilities',
    summary: 'Manage your public HR practitioner identity, support requests, and workspace preferences.',
    actions: [
      { label: 'Edit account settings', href: '/settings', icon: 'settings' },
      { label: 'Open Help Desk', href: '/support', icon: 'support' },
      { label: 'View credentials', href: '/certificates', icon: 'credentials' },
    ],
    resourcesHeading: 'Quick access',
    resources: [
      { label: 'My Profile', meta: 'Public practitioner card', href: '/profile' },
      { label: 'Notifications', meta: 'Activity alerts', href: '/notifications' },
      { label: 'Saved Items', meta: 'Bookmarked library', href: '/saved' },
    ],
    tipHeading: 'Need assistance?',
    tipBody: 'Submit a ticket in Help Desk for chapter support, account access, or community moderation questions.',
  },
};

export const UPCOMING_MODULES: Record<string, UpcomingModuleInfo> = {
  files: {
    key: 'files',
    eyebrow: 'Personal Workspace',
    title: 'My Files',
    description: 'Central document vault for HR policy drafts, downloaded templates, checklists, and earned certificates.',
    phaseNote: 'Workspace shell active in Phase 1 (wide-canvas layout). Full document manager & preview drawer are scheduled for an upcoming implementation phase.',
    plannedCapabilities: [
      'Folder filtering across Policy Drafts, Templates, and Certificates',
      'Metadata upload, quick document notes, and side-drawer preview',
      'Direct save handoff from HR Templates Library and HR Toolkit',
    ],
    relatedLinks: [
      { label: 'Saved Items', href: '/saved' },
      { label: 'Credentials', href: '/certificates' },
      { label: 'My Tasks', href: '/tasks' },
    ],
  },
  'my-learning': {
    key: 'my-learning',
    eyebrow: 'Learning & Events',
    title: 'My Learning',
    description: 'Dedicated personal learning tracker for enrolled courses, module progress, and certification readiness.',
    phaseNote: 'Workspace shell active in Phase 1. Dedicated enrollment tracking and module progress persistence are scheduled for an upcoming phase.',
    plannedCapabilities: [
      'Active enrolled cohorts with module-level progress tracking',
      'Resume-last-lesson shortcuts and estimated completion time',
      'Direct links to earned Credentials upon course completion',
    ],
    relatedLinks: [
      { label: 'Learning Academy', href: '/learning' },
      { label: 'Learning Paths', href: '/learning-paths' },
      { label: 'Credentials', href: '/certificates' },
    ],
  },
  templates: {
    key: 'templates',
    eyebrow: 'Knowledge & Resources',
    title: 'HR Templates Library',
    description: 'Ready-to-adapt HR policies, offer letter structures, interview rubrics, and onboarding checklists.',
    phaseNote: 'Workspace shell active in Phase 1. Searchable templates catalog and document preview modal are scheduled for an upcoming phase.',
    plannedCapabilities: [
      'Category filters across Onboarding, Compensation, Policy, and Performance',
      'Live template preview with copy and download actions',
      'One-click save into My Files and Saved Items',
    ],
    relatedLinks: [
      { label: 'Knowledge Hub', href: '/knowledge-hub' },
      { label: 'HR Shakti Journal', href: '/blogs' },
      { label: 'Saved Items', href: '/saved' },
    ],
  },
  toolkit: {
    key: 'toolkit',
    eyebrow: 'Knowledge & Resources',
    title: 'HR Toolkit',
    description: 'Interactive day-to-day HR calculators and operational planning utilities in a wide workspace canvas.',
    phaseNote: 'Workspace shell active in Phase 1 (wide-canvas layout). Interactive HR calculators and planners are scheduled for an upcoming phase.',
    plannedCapabilities: [
      'Attrition Cost Estimator and Offer/CTC Breakdown Builder',
      'Structured Interview Rubric Generator',
      '30-60-90 Day Onboarding Checklist Planner',
    ],
    relatedLinks: [
      { label: 'My Tasks', href: '/tasks' },
      { label: 'Career Insights', href: '/career' },
      { label: 'Knowledge Hub', href: '/knowledge-hub' },
    ],
  },
  compliance: {
    key: 'compliance',
    eyebrow: 'Knowledge & Resources',
    title: 'Compliance & Labour Law Updates',
    description: 'Curated statutory advisories, regional mandates, and actionable HR compliance checklists.',
    phaseNote: 'Workspace shell active in Phase 1. Filterable compliance feed and task creation workflow are scheduled for an upcoming phase.',
    plannedCapabilities: [
      'Jurisdiction and topic filters (POSH, Wages, Privacy, Leave)',
      'Clear effective dates and organizational impact summaries',
      'Direct "Add to My Tasks" workflow for compliance follow-ups',
    ],
    relatedLinks: [
      { label: 'People & Work Briefing', href: '/news' },
      { label: 'My Tasks', href: '/tasks' },
      { label: 'Discussion Forums', href: '/discussions' },
    ],
  },
  benchmarks: {
    key: 'benchmarks',
    eyebrow: 'Knowledge & Resources',
    title: 'Industry Benchmarks',
    description: 'Comparative HR metrics across attrition, compa-ratio, time-to-hire, and HR-to-employee ratios.',
    phaseNote: 'Workspace shell active in Phase 1 (wide-canvas layout). Interactive benchmark tables and comparison filters are scheduled for an upcoming phase.',
    plannedCapabilities: [
      'Filter by company size, industry segment, and region',
      'Tabular-numeral benchmark comparisons with percentile ranges',
      'Connected insights from HRShakti community pulse surveys',
    ],
    relatedLinks: [
      { label: 'Surveys', href: '/surveys' },
      { label: 'Career Insights', href: '/career' },
      { label: 'Organizations Directory', href: '/organizations' },
    ],
  },
  reports: {
    key: 'reports',
    eyebrow: 'Knowledge & Resources',
    title: 'Reports & Research',
    description: 'Long-form HRShakti quarterly whitepapers, workforce studies, and anonymized community survey digests.',
    phaseNote: 'Workspace shell active in Phase 1 (wide-canvas layout). Research repository and executive summary reader are scheduled for an upcoming phase.',
    plannedCapabilities: [
      'Quarterly benchmark digests and deep-dive people strategy studies',
      'Structured executive summaries with key quantitative findings',
      'Bookmark to Saved Items and reference in team discussions',
    ],
    relatedLinks: [
      { label: 'HR Shakti Journal', href: '/blogs' },
      { label: 'Surveys', href: '/surveys' },
      { label: 'People & Work Briefing', href: '/news' },
    ],
  },
  'ai-assistant': {
    key: 'ai-assistant',
    eyebrow: 'Overview',
    title: 'HRShakti AI Assistant',
    description: 'Dedicated workspace companion for HR policy drafting, interview preparation, and people-ops workflows.',
    phaseNote: 'Reserved in the 30-page workspace navigation. AI integration and backend endpoints are intentionally postponed until the final implementation phase.',
    plannedCapabilities: [
      'Wide focused workspace layout ready for multi-turn HR assistance',
      'Prompt starters for policy outlines, interview guides, and communication drafts',
      'Integration scheduled strictly for the final stage of the redesign',
    ],
    relatedLinks: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Discussion Forums', href: '/discussions' },
      { label: 'Knowledge Hub', href: '/knowledge-hub' },
    ],
  },
};
