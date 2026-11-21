import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export interface DashboardTask {
  id: string;
  title: string;
  dueDate?: string;
  priority?: string;
  category?: string;
  done: boolean;
}

export interface DashboardMessage {
  id: string;
  senderId?: string;
  senderName: string;
  text: string;
  time?: string;
}

export interface DashboardConversation {
  id: string;
  participantId?: string;
  participantName: string;
  participantTitle?: string;
  unread: number;
  messages: DashboardMessage[];
}

export interface DashboardNotification {
  id: string;
  title: string;
  time?: string;
  read: boolean;
  href?: string;
}

export interface DashboardCourse {
  id: string;
  title: string;
  category?: string;
  level?: string;
  duration?: string;
  instructor?: string;
  description?: string;
  modules?: string[];
  enrolled?: boolean;
  progress?: number;
}

export interface DashboardApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company?: string;
  appliedAt?: string;
  status?: string;
}

export interface DashboardDiscussion {
  id: string;
  kind?: 'discussion' | 'question';
  title: string;
  content?: string;
  authorId?: string;
  authorName?: string;
  authorTitle?: string;
  communityId?: string;
  communityName?: string;
  tags?: string[];
  commentCount?: number;
  likes?: number;
  createdAt?: string;
  reason?: string;
  poll?: {
    question: string;
    totalVotes: number;
  };
}

export interface DashboardJob {
  id: string;
  title: string;
  company?: string;
  location?: string;
  workMode?: string;
  employmentType?: string;
  salary?: string;
  experience?: string;
  description?: string;
  requirements?: string[];
  postedAt?: string;
}

export interface DashboardCalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type?: string;
  notes?: string;
}

export interface DashboardRegisteredEvent {
  id: string;
  title: string;
  format?: string;
  date: string;
  time?: string;
  location?: string;
  host?: string;
  description?: string;
  seatsLeft?: number;
  registered?: boolean;
}

export interface DashboardCommunity {
  id: string;
  name: string;
  category?: string;
  memberCount?: number;
  description?: string;
  cadence?: string;
  coverImage?: string;
  joined?: boolean;
}

export interface DashboardBlogPost {
  id: string;
  slug: string;
  title: string;
  category?: string;
  excerpt?: string;
  content?: string;
  authorName?: string;
  authorTitle?: string;
  readingTime?: string;
  publishedAt?: string;
  coverImage?: string;
}

export interface DashboardSurvey {
  id: string;
  title: string;
  description?: string;
  questions?: Array<{
    id: string;
    prompt: string;
    options: string[];
  }>;
  submitted: boolean;
  responsesCount?: number;
}

export interface DashboardSectionState<T> {
  items: T[];
  total: number | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

export interface DashboardSectionsMap {
  tasks: DashboardSectionState<DashboardTask>;
  conversations: DashboardSectionState<DashboardConversation>;
  notifications: DashboardSectionState<DashboardNotification>;
  courses: DashboardSectionState<DashboardCourse>;
  applications: DashboardSectionState<DashboardApplication>;
  discussions: DashboardSectionState<DashboardDiscussion>;
  jobs: DashboardSectionState<DashboardJob>;
  calendarEvents: DashboardSectionState<DashboardCalendarEvent>;
  registeredEvents: DashboardSectionState<DashboardRegisteredEvent>;
  communities: DashboardSectionState<DashboardCommunity>;
  blogs: DashboardSectionState<DashboardBlogPost>;
  surveys: DashboardSectionState<DashboardSurvey>;
}

export type DashboardSectionKey = keyof DashboardSectionsMap;

interface ListApiResponse<T> {
  items?: T[];
  total?: number;
}

const ENDPOINT_MAP: Record<DashboardSectionKey, string> = {
  tasks: '/tasks',
  conversations: '/messages/conversations',
  notifications: '/notifications',
  courses: '/learning/courses',
  applications: '/jobs/applications/mine',
  discussions: '/discussions?limit=4',
  jobs: '/jobs?limit=3',
  calendarEvents: '/calendar/events',
  registeredEvents: '/events/my-registrations',
  communities: '/communities',
  blogs: '/blogs/posts?limit=1',
  surveys: '/surveys',
};

const ALL_SECTION_KEYS = Object.keys(ENDPOINT_MAP) as DashboardSectionKey[];

const INACTIVE_APPLICATION_STATUSES = new Set([
  'archived',
  'withdrawn',
  'rejected',
  'closed',
  'declined',
  'not selected',
]);

function createEmptySection<T>(): DashboardSectionState<T> {
  return {
    items: [],
    total: null,
    loading: false,
    initialized: false,
    error: null,
  };
}

function createInitialSections(): DashboardSectionsMap {
  return {
    tasks: createEmptySection<DashboardTask>(),
    conversations: createEmptySection<DashboardConversation>(),
    notifications: createEmptySection<DashboardNotification>(),
    courses: createEmptySection<DashboardCourse>(),
    applications: createEmptySection<DashboardApplication>(),
    discussions: createEmptySection<DashboardDiscussion>(),
    jobs: createEmptySection<DashboardJob>(),
    calendarEvents: createEmptySection<DashboardCalendarEvent>(),
    registeredEvents: createEmptySection<DashboardRegisteredEvent>(),
    communities: createEmptySection<DashboardCommunity>(),
    blogs: createEmptySection<DashboardBlogPost>(),
    surveys: createEmptySection<DashboardSurvey>(),
  };
}

function isActiveApplication(app: DashboardApplication): boolean {
  const status = (app.status || '').trim().toLowerCase();
  if (!status) return false;
  return !INACTIVE_APPLICATION_STATUSES.has(status);
}

export function useDashboardData() {
  const { user, ready } = useAuth();
  const [sections, setSections] = useState<DashboardSectionsMap>(createInitialSections);
  const [pendingTaskIds, setPendingTaskIds] = useState<Record<string, boolean>>({});
  const [taskUpdateError, setTaskUpdateError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const activeUserIdRef = useRef<string | null>(null);
  const requestSeqRef = useRef<Record<DashboardSectionKey, number>>(
    ALL_SECTION_KEYS.reduce(
      (acc, key) => {
        acc[key] = 0;
        return acc;
      },
      {} as Record<DashboardSectionKey, number>
    )
  );
  const inFlightRef = useRef<Partial<Record<DashboardSectionKey, boolean>>>({});

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchSection = useCallback(async (key: DashboardSectionKey, force = false) => {
    const userId = activeUserIdRef.current;
    if (!userId) return;
    if (!force && inFlightRef.current[key]) return;

    inFlightRef.current[key] = true;
    const seq = (requestSeqRef.current[key] || 0) + 1;
    requestSeqRef.current[key] = seq;

    setSections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await api.get<ListApiResponse<unknown>>(ENDPOINT_MAP[key]);
      if (!mountedRef.current || activeUserIdRef.current !== userId || requestSeqRef.current[key] !== seq) {
        return;
      }

      const items = Array.isArray(response?.items) ? response.items : [];
      const total = typeof response?.total === 'number' ? response.total : null;

      setSections((prev) => ({
        ...prev,
        [key]: {
          items,
          total,
          loading: false,
          initialized: true,
          error: null,
        } as DashboardSectionsMap[typeof key],
      }));
    } catch (err) {
      if (!mountedRef.current || activeUserIdRef.current !== userId || requestSeqRef.current[key] !== seq) {
        return;
      }

      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Could not load this section. Please try again.';

      setSections((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          loading: false,
          initialized: true,
          error: message,
        },
      }));
    } finally {
      if (requestSeqRef.current[key] === seq) {
        inFlightRef.current[key] = false;
      }
    }
  }, []);

  // Auth guard: fetch ONLY after AuthContext is ready and an authenticated user exists
  useEffect(() => {
    if (!ready) return;

    const currentUserId = user?.id ?? null;
    if (!currentUserId) {
      activeUserIdRef.current = null;
      inFlightRef.current = {};
      for (const key of ALL_SECTION_KEYS) {
        requestSeqRef.current[key] += 1;
      }
      setSections(createInitialSections());
      setPendingTaskIds({});
      setTaskUpdateError(null);
      return;
    }

    if (activeUserIdRef.current === currentUserId) return;

    activeUserIdRef.current = currentUserId;
    setTaskUpdateError(null);
    setPendingTaskIds({});
    setSections(createInitialSections());

    void Promise.allSettled(ALL_SECTION_KEYS.map((key) => fetchSection(key, true)));
  }, [ready, user?.id, fetchSection]);

  const retrySection = useCallback(
    (key: DashboardSectionKey) => {
      if (!activeUserIdRef.current) return;
      void fetchSection(key, true);
    },
    [fetchSection]
  );

  const retryFailedSections = useCallback(() => {
    if (!activeUserIdRef.current) return;
    const failedKeys = ALL_SECTION_KEYS.filter((key) => Boolean(sections[key].error));
    if (failedKeys.length === 0) return;
    void Promise.allSettled(failedKeys.map((key) => fetchSection(key, true)));
  }, [sections, fetchSection]);

  const toggleTask = useCallback(
    async (task: DashboardTask) => {
      const userId = activeUserIdRef.current;
      if (!userId) return;
      if (pendingTaskIds[task.id]) return;

      const previousDone = Boolean(task.done);
      const nextDone = !previousDone;

      setTaskUpdateError(null);
      setPendingTaskIds((prev) => ({ ...prev, [task.id]: true }));

      // Optimistic update preserving all other task properties
      setSections((prev) => ({
        ...prev,
        tasks: {
          ...prev.tasks,
          items: prev.tasks.items.map((item) =>
            item.id === task.id ? { ...item, done: nextDone } : item
          ),
        },
      }));

      try {
        const res = await api.patch<{ item?: DashboardTask }>(`/tasks/${task.id}`, {
          done: nextDone,
        });
        if (!mountedRef.current || activeUserIdRef.current !== userId) return;

        if (res?.item) {
          setSections((prev) => ({
            ...prev,
            tasks: {
              ...prev.tasks,
              items: prev.tasks.items.map((item) =>
                item.id === task.id ? { ...item, ...res.item } : item
              ),
            },
          }));
        }
      } catch (err) {
        if (!mountedRef.current || activeUserIdRef.current !== userId) return;

        // Roll back only this task's done state on failure
        setSections((prev) => ({
          ...prev,
          tasks: {
            ...prev.tasks,
            items: prev.tasks.items.map((item) =>
              item.id === task.id ? { ...item, done: previousDone } : item
            ),
          },
        }));

        const message =
          err instanceof Error && err.message
            ? `Failed to update task: ${err.message}`
            : 'Could not update task status. Your previous state has been restored.';
        setTaskUpdateError(message);
      } finally {
        if (mountedRef.current) {
          setPendingTaskIds((prev) => {
            const next = { ...prev };
            delete next[task.id];
            return next;
          });
        }
      }
    },
    [pendingTaskIds]
  );

  const clearTaskUpdateError = useCallback(() => setTaskUpdateError(null), []);

  // Derived metrics (strictly separating unread messages from notifications,
  // preserving real totals, checking enrollment & active status semantics,
  // and returning null while a section has not settled so 0 never flashes prematurely)
  const metrics = useMemo(() => {
    const tasksState = sections.tasks;
    const openTaskItems = tasksState.items.filter((t) => !t.done);
    const highPriorityOpenCount = openTaskItems.filter((t) => t.priority === 'High').length;
    const tasksReady = tasksState.initialized && !tasksState.error;

    const convState = sections.conversations;
    const unreadConversationItems = convState.items.filter((c) => (Number(c.unread) || 0) > 0);
    const unreadMessagesTotal = convState.items.reduce(
      (sum, c) => sum + Math.max(0, Number(c.unread) || 0),
      0
    );
    const convReady = convState.initialized && !convState.error;

    const notifState = sections.notifications;
    const unreadNotificationItems = notifState.items.filter((n) => !n.read);
    const notifReady = notifState.initialized && !notifState.error;

    const courseState = sections.courses;
    const enrolledCourseItems = courseState.items.filter((c) => c.enrolled === true);
    const inProgressCourseItems = enrolledCourseItems.filter(
      (c) => typeof c.progress !== 'number' || c.progress < 100
    );
    const coursesWithProgress = enrolledCourseItems.filter((c) => typeof c.progress === 'number');
    const averageProgress =
      coursesWithProgress.length > 0
        ? Math.round(
            coursesWithProgress.reduce((sum, c) => sum + (c.progress ?? 0), 0) /
              coursesWithProgress.length
          )
        : null;
    const coursesReady = courseState.initialized && !courseState.error;

    const appState = sections.applications;
    const activeApplicationItems = appState.items.filter(isActiveApplication);
    const appsReady = appState.initialized && !appState.error;

    return {
      openTasks: {
        count: tasksReady ? openTaskItems.length : null,
        highPriorityCount: tasksReady ? highPriorityOpenCount : 0,
        totalCount: tasksReady ? tasksState.items.length : null,
        loading: tasksState.loading || !tasksState.initialized,
        error: tasksState.error,
      },
      unreadMessages: {
        count: convReady ? unreadMessagesTotal : null,
        unreadConversationsCount: convReady ? unreadConversationItems.length : 0,
        loading: convState.loading || !convState.initialized,
        error: convState.error,
      },
      unreadNotifications: {
        count: notifReady ? unreadNotificationItems.length : null,
        items: unreadNotificationItems,
        loading: notifState.loading || !notifState.initialized,
        error: notifState.error,
      },
      enrolledCourses: {
        count: coursesReady ? enrolledCourseItems.length : null,
        inProgressCount: coursesReady ? inProgressCourseItems.length : 0,
        averageProgress: coursesReady ? averageProgress : null,
        items: enrolledCourseItems,
        loading: courseState.loading || !courseState.initialized,
        error: courseState.error,
      },
      activeApplications: {
        count: appsReady ? activeApplicationItems.length : null,
        items: activeApplicationItems,
        latest: activeApplicationItems[0] ?? null,
        loading: appState.loading || !appState.initialized,
        error: appState.error,
      },
    };
  }, [sections]);

  const failedSections = useMemo(
    () => ALL_SECTION_KEYS.filter((key) => Boolean(sections[key].error)),
    [sections]
  );

  return {
    authReady: ready,
    user,
    sections,
    metrics,
    failedSections,
    pendingTaskIds,
    taskUpdateError,
    clearTaskUpdateError,
    toggleTask,
    retrySection,
    retryFailedSections,
  };
}
