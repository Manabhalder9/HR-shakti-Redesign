import React from 'react';
import { AlertCircle, ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { EmptyState } from '../WorkspaceLayout';
import type { MemberUser } from '../../context/AuthContext';
import { Link } from '../../context/RouterContext';
import type {
  DashboardApplication,
  DashboardBlogPost,
  DashboardCourse,
  DashboardDiscussion,
  DashboardJob,
  DashboardSectionKey,
  DashboardSectionState,
  DashboardTask,
} from '../../hooks/useDashboardData';
import { formatDate } from '../../lib/api';

function getInitials(user: MemberUser): string {
  const explicit = user.avatarInitials?.trim();
  if (explicit) return explicit;
  return (
    user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'HR'
  );
}

export function SectionErrorNotice({
  message,
  onRetry,
  compact = false,
}: {
  message: string;
  onRetry: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`dash-error-banner${compact ? ' dash-error-banner--compact' : ''}`}
      role="alert"
    >
      <div className="dash-error-copy">
        <AlertCircle size={14} aria-hidden="true" />
        <span>{message}</span>
      </div>
      <button type="button" className="dash-retry-btn" onClick={onRetry}>
        <RotateCcw size={12} aria-hidden="true" />
        <span>Retry</span>
      </button>
    </div>
  );
}

export function DashboardSectionCard({
  headingId,
  title,
  subtitle,
  actionLabel,
  actionHref,
  children,
}: {
  headingId: string;
  title: string;
  subtitle?: string;
  actionLabel: string;
  actionHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="dash-card" aria-labelledby={headingId}>
      <div className="dash-card-header">
        <div className="dash-card-title-group">
          <h2 id={headingId}>{title}</h2>
          {subtitle && <p className="dash-card-subtitle">{subtitle}</p>}
        </div>
        <Link href={actionHref} className="dash-card-action">
          <span>{actionLabel}</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
      <div className="dash-card-body">{children}</div>
    </section>
  );
}

export function DashboardGreetingStrip({ user }: { user: MemberUser }) {
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;
  const identityParts = [user.title, user.organization, user.location].filter(
    (value): value is string => Boolean(value && value.trim())
  );

  return (
    <header className="dash-greeting">
      <div className="dash-greeting-identity">
        <div className="dash-greeting-avatar" aria-hidden="true">
          {getInitials(user)}
        </div>
        <div className="dash-greeting-copy">
          <h1>Welcome back, {firstName}</h1>
          {identityParts.length > 0 && (
            <p className="dash-greeting-role">
              {identityParts.map((part, idx) => (
                <React.Fragment key={part}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <span>{part}</span>
                </React.Fragment>
              ))}
            </p>
          )}
          <p className="dash-greeting-summary">
            Review priority deliverables, active cohorts, peer conversations, and open HR roles.
          </p>
        </div>
      </div>

      <div className="dash-greeting-actions">
        <Link href="/discussions" className="button button-primary dash-action-btn">
          Start discussion
        </Link>
        <Link href="/profile" className="button button-secondary dash-action-btn">
          Edit profile
        </Link>
      </div>
    </header>
  );
}

interface MetricTileProps {
  label: string;
  value: number | null;
  footnote?: string;
  href: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function DashboardMetricTile({
  label,
  value,
  footnote,
  href,
  loading,
  error,
  onRetry,
}: MetricTileProps) {
  if (error) {
    return (
      <div className="dash-kpi-tile dash-kpi-tile--error" role="alert">
        <div className="dash-kpi-head">
          <Link href={href} className="dash-kpi-label dash-kpi-label-link">
            {label}
          </Link>
          <button type="button" className="dash-retry-btn dash-retry-btn--xs" onClick={onRetry}>
            <RotateCcw size={11} aria-hidden="true" />
            <span>Retry</span>
          </button>
        </div>
        <strong className="dash-kpi-value" aria-label={`${label} unavailable`}>
          —
        </strong>
        <span className="dash-kpi-footnote">Could not load metric</span>
      </div>
    );
  }

  return (
    <Link href={href} className="dash-kpi-tile">
      <div className="dash-kpi-head">
        <span className="dash-kpi-label">{label}</span>
        <ArrowRight size={13} className="dash-kpi-arrow" aria-hidden="true" />
      </div>
      {loading || value === null ? (
        <span className="dash-kpi-skel-value" aria-hidden="true" />
      ) : (
        <strong className="dash-kpi-value">{value}</strong>
      )}
      {loading || value === null ? (
        <span className="dash-kpi-skel-foot" aria-hidden="true" />
      ) : footnote ? (
        <span className="dash-kpi-footnote">{footnote}</span>
      ) : null}
    </Link>
  );
}

export interface DashboardDerivedMetricsProp {
  openTasks: {
    count: number | null;
    highPriorityCount: number;
    totalCount: number | null;
    loading: boolean;
    error: string | null;
  };
  unreadMessages: {
    count: number | null;
    unreadConversationsCount: number;
    loading: boolean;
    error: string | null;
  };
  enrolledCourses: {
    count: number | null;
    inProgressCount: number;
    averageProgress: number | null;
    items: DashboardCourse[];
    loading: boolean;
    error: string | null;
  };
  activeApplications: {
    count: number | null;
    items: DashboardApplication[];
    latest: DashboardApplication | null;
    loading: boolean;
    error: string | null;
  };
}

export function DashboardActivityMetrics({
  metrics,
  onRetry,
}: {
  metrics: DashboardDerivedMetricsProp;
  onRetry: (key: DashboardSectionKey) => void;
}) {
  const openTasksFootnote =
    metrics.openTasks.count === 0
      ? 'All tasks completed'
      : metrics.openTasks.highPriorityCount > 0
      ? `${metrics.openTasks.highPriorityCount} high priority`
      : metrics.openTasks.totalCount !== null
      ? `${metrics.openTasks.totalCount} total tracked`
      : undefined;

  const unreadMessagesFootnote =
    metrics.unreadMessages.count === 0
      ? 'No unread messages'
      : `${metrics.unreadMessages.unreadConversationsCount} unread ${
          metrics.unreadMessages.unreadConversationsCount === 1 ? 'conversation' : 'conversations'
        }`;

  const enrolledCoursesFootnote =
    metrics.enrolledCourses.count === 0
      ? 'Explore Learning Academy'
      : metrics.enrolledCourses.averageProgress !== null
      ? `${metrics.enrolledCourses.inProgressCount} in progress · ${metrics.enrolledCourses.averageProgress}% avg`
      : `${metrics.enrolledCourses.inProgressCount} in progress`;

  const latestApp = metrics.activeApplications.latest;
  const activeAppsSummary = latestApp
    ? [latestApp.status, latestApp.company].filter(Boolean).join(' · ')
    : '';
  const activeApplicationsFootnote =
    metrics.activeApplications.count === 0
      ? 'No active applications'
      : activeAppsSummary || 'View application status';

  return (
    <section className="dash-kpi-grid" aria-label="Key workspace metrics">
      <DashboardMetricTile
        label="Open Tasks"
        value={metrics.openTasks.count}
        footnote={openTasksFootnote}
        href="/tasks"
        loading={metrics.openTasks.loading}
        error={metrics.openTasks.error}
        onRetry={() => onRetry('tasks')}
      />
      <DashboardMetricTile
        label="Unread Messages"
        value={metrics.unreadMessages.count}
        footnote={unreadMessagesFootnote}
        href="/messages"
        loading={metrics.unreadMessages.loading}
        error={metrics.unreadMessages.error}
        onRetry={() => onRetry('conversations')}
      />
      <DashboardMetricTile
        label="Enrolled Courses"
        value={metrics.enrolledCourses.count}
        footnote={enrolledCoursesFootnote}
        href="/learning"
        loading={metrics.enrolledCourses.loading}
        error={metrics.enrolledCourses.error}
        onRetry={() => onRetry('courses')}
      />
      <DashboardMetricTile
        label="Active Applications"
        value={metrics.activeApplications.count}
        footnote={activeApplicationsFootnote}
        href="/applications"
        loading={metrics.activeApplications.loading}
        error={metrics.activeApplications.error}
        onRetry={() => onRetry('applications')}
      />
    </section>
  );
}

export function PriorityTasksCard({
  tasksSection,
  prioritizedTasks,
  pendingTaskIds,
  taskUpdateError,
  onClearTaskError,
  onToggleTask,
  onRetry,
}: {
  tasksSection: DashboardSectionState<DashboardTask>;
  prioritizedTasks: DashboardTask[];
  pendingTaskIds: Record<string, boolean>;
  taskUpdateError: string | null;
  onClearTaskError: () => void;
  onToggleTask: (task: DashboardTask) => Promise<void>;
  onRetry: () => void;
}) {
  const isLoading = tasksSection.loading || !tasksSection.initialized;

  return (
    <DashboardSectionCard
      headingId="dash-section-tasks"
      title="Priority tasks"
      subtitle="Check off deliverables directly or manage your full queue"
      actionLabel="Manage tasks"
      actionHref="/tasks"
    >
      {taskUpdateError && (
        <div className="dash-inline-error" role="alert">
          <div className="dash-error-copy">
            <AlertCircle size={14} aria-hidden="true" />
            <span>{taskUpdateError}</span>
          </div>
          <button
            type="button"
            className="dash-inline-dismiss"
            onClick={onClearTaskError}
            aria-label="Dismiss task update error"
          >
            <X size={13} aria-hidden="true" />
          </button>
        </div>
      )}

      {tasksSection.error ? (
        <SectionErrorNotice message={tasksSection.error} onRetry={onRetry} />
      ) : isLoading ? (
        <div className="dash-skeleton-list" aria-busy="true" aria-label="Loading tasks">
          <div className="dash-skel-row" />
          <div className="dash-skel-row" />
          <div className="dash-skel-row" />
        </div>
      ) : prioritizedTasks.length === 0 ? (
        <EmptyState
          title="No tasks tracked yet"
          description="Create tasks for HR reviews, compliance follow-ups, and team rituals."
          action={
            <Link href="/tasks" className="button button-secondary dash-action-btn">
              Add your first task
            </Link>
          }
        />
      ) : (
        <ul className="dash-task-list">
          {prioritizedTasks.map((task) => {
            const isBusy = Boolean(pendingTaskIds[task.id]);
            const priorityClass =
              task.priority === 'High' && !task.done
                ? 'dash-priority-high'
                : task.priority === 'Medium' && !task.done
                ? 'dash-priority-medium'
                : '';

            const metaParts: React.ReactNode[] = [];
            if (task.category) metaParts.push(<span key="cat">{task.category}</span>);
            if (task.dueDate) {
              metaParts.push(
                <span key="due" className="dash-tabular">
                  Due {formatDate(task.dueDate)}
                </span>
              );
            }
            if (task.done) {
              metaParts.push(
                <span key="status" className="dash-task-done-label">
                  Completed
                </span>
              );
            } else if (task.priority) {
              metaParts.push(
                <span key="prio" className={priorityClass}>
                  {task.priority} priority
                </span>
              );
            }

            return (
              <li
                key={task.id}
                className={`dash-task-row${task.done ? ' is-done' : ''}${
                  isBusy ? ' is-pending' : ''
                }`}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={task.done}
                  aria-busy={isBusy}
                  aria-label={`Mark "${task.title}" as ${task.done ? 'open' : 'completed'}`}
                  disabled={isBusy}
                  className={`dash-task-check${task.done ? ' checked' : ''}`}
                  onClick={() => void onToggleTask(task)}
                >
                  {task.done && <Check size={12} strokeWidth={2.6} aria-hidden="true" />}
                </button>
                <div className="dash-task-main">
                  <span className="dash-task-title">{task.title}</span>
                  {metaParts.length > 0 && (
                    <div className="dash-meta-line">
                      {metaParts.map((part, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <span aria-hidden="true">·</span>}
                          {part}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardSectionCard>
  );
}

export function LearningReadingCard({
  coursesSection,
  enrolledCourses,
  blogsSection,
  onRetryCourses,
  onRetryBlogs,
}: {
  coursesSection: DashboardSectionState<DashboardCourse>;
  enrolledCourses: DashboardCourse[];
  blogsSection: DashboardSectionState<DashboardBlogPost>;
  onRetryCourses: () => void;
  onRetryBlogs: () => void;
}) {
  const coursesLoading = coursesSection.loading || !coursesSection.initialized;
  const blogsLoading = blogsSection.loading || !blogsSection.initialized;
  const featuredPost = blogsSection.items[0] || null;

  return (
    <DashboardSectionCard
      headingId="dash-section-learning"
      title="Learning & reading"
      subtitle="Active enrolled cohorts and HR Shakti Journal"
      actionLabel="Learning Academy"
      actionHref="/learning"
    >
      {coursesSection.error ? (
        <SectionErrorNotice message={coursesSection.error} onRetry={onRetryCourses} />
      ) : coursesLoading ? (
        <div className="dash-skeleton-list" aria-busy="true" aria-label="Loading enrolled courses">
          <div className="dash-skel-row dash-skel-row--tall" />
          <div className="dash-skel-row dash-skel-row--tall" />
        </div>
      ) : enrolledCourses.length === 0 ? (
        <EmptyState
          title="No enrolled courses"
          description="Explore practitioner-led HR cohorts to track progress here."
          action={
            <Link href="/learning" className="button button-secondary dash-action-btn">
              Explore courses
            </Link>
          }
        />
      ) : (
        <div className="dash-course-list">
          {enrolledCourses.slice(0, 2).map((course) => {
            const hasValidProgress =
              typeof course.progress === 'number' && Number.isFinite(course.progress);
            const pct = hasValidProgress
              ? Math.min(100, Math.max(0, Math.round(course.progress!)))
              : null;
            const metaParts = [course.instructor, course.duration].filter(
              (v): v is string => Boolean(v && v.trim())
            );

            return (
              <Link key={course.id} href="/learning" className="dash-course-item">
                <div className="dash-course-top">
                  <strong>{course.title}</strong>
                  {pct !== null && <span className="dash-course-pct">{pct}%</span>}
                </div>
                {metaParts.length > 0 && (
                  <div className="dash-meta-line">
                    {metaParts.map((part, idx) => (
                      <React.Fragment key={part}>
                        {idx > 0 && <span aria-hidden="true">·</span>}
                        <span>{part}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {pct !== null && (
                  <div
                    className="dash-progress-track"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${course.title} completion`}
                  >
                    <span className="dash-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <div className="dash-featured-reading">
        <div className="dash-reading-head">
          <span className="dash-reading-kicker">Featured in HR Shakti Journal</span>
          <Link href="/blogs" className="dash-subtle-link">
            All articles
          </Link>
        </div>

        {blogsSection.error ? (
          <SectionErrorNotice message={blogsSection.error} onRetry={onRetryBlogs} compact />
        ) : blogsLoading ? (
          <div className="dash-rail-skeleton" aria-busy="true" aria-label="Loading featured article">
            <span className="dash-skel-line" />
            <span className="dash-skel-line short" />
          </div>
        ) : featuredPost ? (
          <Link href={`/blogs/${featuredPost.slug}`} className="dash-reading-link">
            <strong>{featuredPost.title}</strong>
            {(featuredPost.category || featuredPost.readingTime) && (
              <div className="dash-meta-line">
                {featuredPost.category && <span>{featuredPost.category}</span>}
                {featuredPost.category && featuredPost.readingTime && (
                  <span aria-hidden="true">·</span>
                )}
                {featuredPost.readingTime && <span>{featuredPost.readingTime}</span>}
              </div>
            )}
          </Link>
        ) : (
          <p className="dash-muted-note">No journal articles available right now.</p>
        )}
      </div>
    </DashboardSectionCard>
  );
}

export function CommunityConversationsCard({
  discussionsSection,
  communitiesSection,
  joinedCirclesCount,
  onRetryDiscussions,
  onRetryCommunities,
}: {
  discussionsSection: DashboardSectionState<DashboardDiscussion>;
  communitiesSection: DashboardSectionState<unknown>;
  joinedCirclesCount: number;
  onRetryDiscussions: () => void;
  onRetryCommunities: () => void;
}) {
  const isLoading = discussionsSection.loading || !discussionsSection.initialized;

  return (
    <DashboardSectionCard
      headingId="dash-section-community"
      title="Community conversations"
      subtitle="Recent peer questions and practice threads"
      actionLabel="All discussions"
      actionHref="/discussions"
    >
      {discussionsSection.error ? (
        <SectionErrorNotice message={discussionsSection.error} onRetry={onRetryDiscussions} />
      ) : isLoading ? (
        <div className="dash-skeleton-list" aria-busy="true" aria-label="Loading discussions">
          <div className="dash-skel-row" />
          <div className="dash-skel-row" />
          <div className="dash-skel-row" />
        </div>
      ) : discussionsSection.items.length === 0 ? (
        <EmptyState
          title="No active discussions"
          description="Share an HR practice question or peer update with the community."
          action={
            <Link href="/discussions" className="button button-secondary dash-action-btn">
              Start a conversation
            </Link>
          }
        />
      ) : (
        <div className="dash-list">
          {discussionsSection.items.slice(0, 4).map((discussion) => {
            const metaParts: React.ReactNode[] = [];
            if (discussion.communityName) {
              metaParts.push(<span key="community">{discussion.communityName}</span>);
            }
            if (discussion.authorName) {
              metaParts.push(<span key="author">{discussion.authorName}</span>);
            }
            if (discussion.poll) {
              const voteText =
                typeof discussion.poll.totalVotes === 'number'
                  ? `Poll (${discussion.poll.totalVotes} ${
                      discussion.poll.totalVotes === 1 ? 'vote' : 'votes'
                    })`
                  : 'Poll';
              metaParts.push(
                <span key="poll" className="dash-poll-indicator dash-tabular">
                  {voteText}
                </span>
              );
            }

            return (
              <Link
                key={discussion.id}
                href={`/discussions/${discussion.id}`}
                className="dash-list-row"
              >
                <div className="dash-list-main">
                  <strong title={discussion.title}>{discussion.title}</strong>
                  {metaParts.length > 0 && (
                    <div className="dash-meta-line">
                      {metaParts.map((part, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <span aria-hidden="true">·</span>}
                          {part}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
                {typeof discussion.commentCount === 'number' && (
                  <span className="dash-list-metric">
                    {discussion.commentCount}{' '}
                    {discussion.commentCount === 1 ? 'reply' : 'replies'}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <div className="dash-card-footer">
        <div className="dash-footer-meta">
          {communitiesSection.error ? (
            <button
              type="button"
              className="dash-inline-retry-link"
              onClick={onRetryCommunities}
            >
              Communities unavailable · Retry
            </button>
          ) : !communitiesSection.initialized || communitiesSection.loading ? (
            <span>Loading communities…</span>
          ) : (
            <span>
              {joinedCirclesCount} joined{' '}
              {joinedCirclesCount === 1 ? 'community' : 'communities'}
              {typeof discussionsSection.total === 'number' && !discussionsSection.error
                ? ` · ${discussionsSection.total} active threads`
                : ''}
            </span>
          )}
        </div>
        <div className="dash-footer-links">
          <Link href="/feed">Community Feed</Link>
          <span aria-hidden="true">·</span>
          <Link href="/communities">My Communities</Link>
        </div>
      </div>
    </DashboardSectionCard>
  );
}

export function CareerOpenRolesCard({
  applicationsSection,
  activeApplication,
  activeApplicationsCount,
  jobsSection,
  onRetryApplications,
  onRetryJobs,
}: {
  applicationsSection: DashboardSectionState<DashboardApplication>;
  activeApplication: DashboardApplication | null;
  activeApplicationsCount: number | null;
  jobsSection: DashboardSectionState<DashboardJob>;
  onRetryApplications: () => void;
  onRetryJobs: () => void;
}) {
  const appsLoading = applicationsSection.loading || !applicationsSection.initialized;
  const jobsLoading = jobsSection.loading || !jobsSection.initialized;

  return (
    <DashboardSectionCard
      headingId="dash-section-career"
      title="Career & open roles"
      subtitle="Your active applications and published HR openings"
      actionLabel="Explore jobs"
      actionHref="/jobs"
    >
      {applicationsSection.error ? (
        <SectionErrorNotice
          message={applicationsSection.error}
          onRetry={onRetryApplications}
          compact
        />
      ) : appsLoading ? (
        <div
          className="dash-skel-row dash-skel-row--strip"
          aria-busy="true"
          aria-label="Loading active applications"
        />
      ) : activeApplication ? (
        <Link href="/applications" className="dash-application-strip">
          <div className="dash-application-info">
            <span className="dash-application-kicker">Active application</span>
            <strong>{activeApplication.jobTitle}</strong>
            {(activeApplication.company || activeApplication.appliedAt) && (
              <span className="dash-application-org">
                {[
                  activeApplication.company,
                  activeApplication.appliedAt
                    ? `Applied ${formatDate(activeApplication.appliedAt)}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            )}
          </div>
          {activeApplication.status && (
            <span className="dash-application-status">{activeApplication.status}</span>
          )}
        </Link>
      ) : null}

      {jobsSection.error ? (
        <SectionErrorNotice message={jobsSection.error} onRetry={onRetryJobs} />
      ) : jobsLoading ? (
        <div className="dash-skeleton-list" aria-busy="true" aria-label="Loading open roles">
          <div className="dash-skel-row" />
          <div className="dash-skel-row" />
          <div className="dash-skel-row" />
        </div>
      ) : jobsSection.items.length === 0 ? (
        <EmptyState
          title="No open roles published"
          description="Explore HR career paths and revisit as new openings are posted."
          action={
            <Link href="/career" className="button button-secondary dash-action-btn">
              Career Insights
            </Link>
          }
        />
      ) : (
        <div className="dash-list">
          {jobsSection.items.slice(0, 3).map((job) => {
            const metaParts: React.ReactNode[] = [];
            if (job.company) metaParts.push(<span key="company">{job.company}</span>);
            if (job.location) metaParts.push(<span key="location">{job.location}</span>);
            if (job.salary) {
              metaParts.push(
                <span key="salary" className="dash-tabular">
                  {job.salary}
                </span>
              );
            }

            return (
              <Link key={job.id} href="/jobs" className="dash-list-row">
                <div className="dash-list-main">
                  <strong title={job.title}>{job.title}</strong>
                  {metaParts.length > 0 && (
                    <div className="dash-meta-line">
                      {metaParts.map((part, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <span aria-hidden="true">·</span>}
                          {part}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
                {job.workMode && <span className="dash-list-metric">{job.workMode}</span>}
              </Link>
            );
          })}
        </div>
      )}

      <div className="dash-card-footer">
        <div className="dash-footer-meta">
          {typeof jobsSection.total === 'number' && !jobsSection.error ? (
            <span>
              {jobsSection.total} open {jobsSection.total === 1 ? 'role' : 'roles'}
              {activeApplicationsCount !== null && activeApplicationsCount > 0
                ? ` · ${activeApplicationsCount} active`
                : ''}
            </span>
          ) : jobsSection.error && applicationsSection.error ? (
            <span>Opportunities unavailable</span>
          ) : applicationsSection.error ? (
            <span>Applications unavailable</span>
          ) : activeApplicationsCount !== null ? (
            <span>
              {activeApplicationsCount} active{' '}
              {activeApplicationsCount === 1 ? 'application' : 'applications'}
            </span>
          ) : (
            <span>Loading opportunities…</span>
          )}
        </div>
        <div className="dash-footer-links">
          <Link href="/applications">My Applications</Link>
          <span aria-hidden="true">·</span>
          <Link href="/career">Career Insights</Link>
        </div>
      </div>
    </DashboardSectionCard>
  );
}
