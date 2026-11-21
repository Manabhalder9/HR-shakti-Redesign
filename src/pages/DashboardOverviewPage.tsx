import { useMemo } from 'react';
import { DashboardContextPanel } from '../components/dashboard/DashboardContextPanel';
import {
  CareerOpenRolesCard,
  CommunityConversationsCard,
  DashboardActivityMetrics,
  DashboardGreetingStrip,
  LearningReadingCard,
  PriorityTasksCard,
} from '../components/dashboard/DashboardMainCanvasSections';
import { LoadingState, PageHeader, WorkspaceLayout } from '../components/WorkspaceLayout';
import { useAuth } from '../context/AuthContext';
import { Link } from '../context/RouterContext';
import { useDashboardData } from '../hooks/useDashboardData';

const PRIORITY_RANK: Record<string, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

function compareDueDate(a?: string, b?: string): number {
  const aValid = Boolean(a && a.trim());
  const bValid = Boolean(b && b.trim());
  if (aValid && bValid) return a!.localeCompare(b!);
  if (aValid) return -1;
  if (bValid) return 1;
  return 0;
}

export function DashboardOverviewPage() {
  const { savedIds, signInDemo } = useAuth();
  const {
    authReady,
    user,
    sections,
    metrics,
    pendingTaskIds,
    taskUpdateError,
    clearTaskUpdateError,
    toggleTask,
    retrySection,
  } = useDashboardData();

  const prioritizedTasks = useMemo(() => {
    return [...sections.tasks.items]
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        const aRank = a.priority && a.priority in PRIORITY_RANK ? PRIORITY_RANK[a.priority] : 3;
        const bRank = b.priority && b.priority in PRIORITY_RANK ? PRIORITY_RANK[b.priority] : 3;
        if (aRank !== bRank) return aRank - bRank;
        return compareDueDate(a.dueDate, b.dueDate);
      })
      .slice(0, 4);
  }, [sections.tasks.items]);

  const joinedCirclesCount = useMemo(
    () => sections.communities.items.filter((c) => c.joined === true).length,
    [sections.communities.items]
  );

  // Wait for auth session resolution before showing signed-out view or firing fetches
  if (!authReady) {
    return (
      <WorkspaceLayout>
        <LoadingState label="Checking your workspace session…" />
      </WorkspaceLayout>
    );
  }

  if (!user) {
    return (
      <WorkspaceLayout>
        <PageHeader
          eyebrow="Workspace overview"
          title="Your professional home"
          description="Sign in to view your tasks, schedule, learning progress, community conversations, and opportunities."
        />
        <div className="panel" style={{ maxWidth: 560 }}>
          <h2>Explore the member workspace</h2>
          <p style={{ color: 'var(--ink-soft)' }}>
            Sign in with your account or launch the pre-populated demo member profile (Priya Nair,
            Head of People Operations).
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className="button button-primary" onClick={() => signInDemo()}>
              Continue as Demo Member
            </button>
            <Link href="/login" className="button button-secondary">
              Go to sign in
            </Link>
          </div>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout
      contextPanel={
        <DashboardContextPanel
          calendarEventsSection={sections.calendarEvents}
          registeredEventsSection={sections.registeredEvents}
          notificationsSection={sections.notifications}
          conversationsSection={sections.conversations}
          surveysSection={sections.surveys}
          savedCount={Array.isArray(savedIds) ? savedIds.length : undefined}
          onRetrySection={retrySection}
        />
      }
    >
      <div className="dash-canvas">
        <DashboardGreetingStrip user={user} />

        <DashboardActivityMetrics metrics={metrics} onRetry={retrySection} />

        <div className="dash-row-primary">
          <PriorityTasksCard
            tasksSection={sections.tasks}
            prioritizedTasks={prioritizedTasks}
            pendingTaskIds={pendingTaskIds}
            taskUpdateError={taskUpdateError}
            onClearTaskError={clearTaskUpdateError}
            onToggleTask={toggleTask}
            onRetry={() => retrySection('tasks')}
          />

          <LearningReadingCard
            coursesSection={sections.courses}
            enrolledCourses={metrics.enrolledCourses.items}
            blogsSection={sections.blogs}
            onRetryCourses={() => retrySection('courses')}
            onRetryBlogs={() => retrySection('blogs')}
          />
        </div>

        <div className="dash-row-secondary">
          <CommunityConversationsCard
            discussionsSection={sections.discussions}
            communitiesSection={sections.communities}
            joinedCirclesCount={joinedCirclesCount}
            onRetryDiscussions={() => retrySection('discussions')}
            onRetryCommunities={() => retrySection('communities')}
          />

          <CareerOpenRolesCard
            applicationsSection={sections.applications}
            activeApplication={metrics.activeApplications.latest}
            activeApplicationsCount={metrics.activeApplications.count}
            jobsSection={sections.jobs}
            onRetryApplications={() => retrySection('applications')}
            onRetryJobs={() => retrySection('jobs')}
          />
        </div>
      </div>
    </WorkspaceLayout>
  );
}
