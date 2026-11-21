import React, { useMemo } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Bell,
  Bookmark,
  CheckCircle2,
  LifeBuoy,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';
import { Link } from '../../context/RouterContext';
import type {
  DashboardCalendarEvent,
  DashboardConversation,
  DashboardNotification,
  DashboardRegisteredEvent,
  DashboardSectionKey,
  DashboardSectionState,
  DashboardSurvey,
} from '../../hooks/useDashboardData';

interface MergedScheduleItem {
  key: string;
  title: string;
  date: string;
  time?: string;
  kindLabel?: string;
  source: 'registered' | 'calendar';
  href: '/my-events' | '/calendar';
  sortTimeMinutes: number;
}

function normalizeTitleForMatch(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseStartTimeMinutes(time?: string): number {
  if (!time) return 9999;
  const trimmed = time.trim();

  // Match 12-hour start time e.g. "6:00 PM – 7:30 PM IST" or "10:15 AM"
  const twelveHour = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (twelveHour) {
    let hours = Number(twelveHour[1]) % 12;
    const minutes = Number(twelveHour[2] || '0');
    if (twelveHour[3].toUpperCase() === 'PM') hours += 12;
    return hours * 60 + minutes;
  }

  // Match 24-hour time e.g. "18:00" or "10:30"
  const twentyFourHour = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (twentyFourHour) {
    const hours = Number(twentyFourHour[1]);
    const minutes = Number(twentyFourHour[2]);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return hours * 60 + minutes;
    }
  }

  return 9999;
}

function formatShortScheduleDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCompactTime(time?: string): string | undefined {
  if (!time || !time.trim()) return undefined;
  const trimmed = time.trim();
  const rangeStart = trimmed.split(/[–—-]/)[0]?.trim();
  return rangeStart || trimmed;
}

function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isDuplicateScheduleEntry(
  candidateDate: string,
  candidateTitle: string,
  existing: MergedScheduleItem[]
): boolean {
  const normCandidate = normalizeTitleForMatch(candidateTitle);
  if (!normCandidate) return false;

  return existing.some((item) => {
    if (item.date !== candidateDate) return false;
    const normExisting = normalizeTitleForMatch(item.title);
    if (!normExisting) return false;
    if (normExisting === normCandidate) return true;
    if (normCandidate.length >= 8 && normExisting.includes(normCandidate)) return true;
    if (normExisting.length >= 8 && normCandidate.includes(normExisting)) return true;
    return false;
  });
}

function getSafeInternalHref(href?: string): string {
  if (typeof href !== 'string') return '/notifications';
  const trimmed = href.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return '/notifications';
  return trimmed;
}

function ContextErrorRow({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="dash-ctx-error" role="alert">
      <div className="dash-ctx-error-text">
        <AlertCircle size={13} aria-hidden="true" />
        <span>{message}</span>
      </div>
      <button type="button" className="dash-ctx-retry" onClick={onRetry}>
        <RotateCcw size={11} aria-hidden="true" />
        <span>Retry</span>
      </button>
    </div>
  );
}

function ContextSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="dash-ctx-skeleton" aria-busy="true" aria-label="Loading section">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="dash-ctx-skel-block">
          <span className="dash-ctx-skel-line" />
          <span className="dash-ctx-skel-line dash-ctx-skel-line--short" />
        </div>
      ))}
    </div>
  );
}

export interface DashboardContextPanelProps {
  calendarEventsSection: DashboardSectionState<DashboardCalendarEvent>;
  registeredEventsSection: DashboardSectionState<DashboardRegisteredEvent>;
  notificationsSection: DashboardSectionState<DashboardNotification>;
  conversationsSection: DashboardSectionState<DashboardConversation>;
  surveysSection: DashboardSectionState<DashboardSurvey>;
  savedCount?: number;
  onRetrySection: (key: DashboardSectionKey) => void;
}

export function DashboardContextPanel({
  calendarEventsSection,
  registeredEventsSection,
  notificationsSection,
  conversationsSection,
  surveysSection,
  savedCount,
  onRetrySection,
}: DashboardContextPanelProps) {
  // A. Merge registered events first so duplicate calendar entries preserve the richer registered record
  const upcomingSchedule = useMemo<MergedScheduleItem[]>(() => {
    const merged: MergedScheduleItem[] = [];

    for (const reg of registeredEventsSection.items) {
      if (!reg.title || !reg.date) continue;
      if (isDuplicateScheduleEntry(reg.date, reg.title, merged)) continue;
      merged.push({
        key: `reg-${reg.id}`,
        title: reg.title,
        date: reg.date,
        time: formatCompactTime(reg.time),
        kindLabel: reg.format?.trim() || undefined,
        source: 'registered',
        href: '/my-events',
        sortTimeMinutes: parseStartTimeMinutes(reg.time),
      });
    }

    for (const cal of calendarEventsSection.items) {
      if (!cal.title || !cal.date) continue;
      if (isDuplicateScheduleEntry(cal.date, cal.title, merged)) continue;
      merged.push({
        key: `cal-${cal.id}`,
        title: cal.title,
        date: cal.date,
        time: formatCompactTime(cal.time),
        kindLabel: cal.type?.trim() || undefined,
        source: 'calendar',
        href: '/calendar',
        sortTimeMinutes: parseStartTimeMinutes(cal.time),
      });
    }

    merged.sort((a, b) => {
      const dateDiff = a.date.localeCompare(b.date);
      if (dateDiff !== 0) return dateDiff;
      return a.sortTimeMinutes - b.sortTimeMinutes;
    });

    const todayIso = getTodayIsoDate();
    const futureOrToday = merged.filter((item) => item.date >= todayIso);
    const prioritized = futureOrToday.length > 0 ? futureOrToday : merged;
    return prioritized.slice(0, 3);
  }, [calendarEventsSection.items, registeredEventsSection.items]);

  const calendarLoading = calendarEventsSection.loading || !calendarEventsSection.initialized;
  const registeredLoading =
    registeredEventsSection.loading || !registeredEventsSection.initialized;
  const scheduleBothLoading = calendarLoading && registeredLoading;
  const scheduleBothFailed = Boolean(
    calendarEventsSection.error && registeredEventsSection.error
  );

  // B. Unread notifications & unread messages kept strictly separate
  const unreadNotifications = useMemo(
    () => notificationsSection.items.filter((n) => !n.read).slice(0, 2),
    [notificationsSection.items]
  );

  const unreadConversations = useMemo(
    () => conversationsSection.items.filter((c) => (Number(c.unread) || 0) > 0),
    [conversationsSection.items]
  );

  const latestUnreadConversation = unreadConversations[0] || null;
  const latestUnreadMessage =
    latestUnreadConversation && Array.isArray(latestUnreadConversation.messages)
      ? latestUnreadConversation.messages[latestUnreadConversation.messages.length - 1] || null
      : null;

  const notificationsLoading = notificationsSection.loading || !notificationsSection.initialized;
  const conversationsLoading = conversationsSection.loading || !conversationsSection.initialized;

  const attentionAllCaughtUp =
    !notificationsLoading &&
    !conversationsLoading &&
    !notificationsSection.error &&
    !conversationsSection.error &&
    unreadNotifications.length === 0 &&
    !latestUnreadConversation;

  // C. Community Pulse Survey (only show if at least one survey has submitted === false)
  const surveysLoading = surveysSection.loading || !surveysSection.initialized;
  const activeSurvey = useMemo(
    () => surveysSection.items.find((s) => s.submitted === false) || null,
    [surveysSection.items]
  );

  const showReliableSavedCount = typeof savedCount === 'number' && Number.isFinite(savedCount);

  return (
    <div className="dash-ctx-stack">
      {/* A. Upcoming Schedule */}
      <section className="context-section" aria-labelledby="dash-ctx-schedule-heading">
        <div className="dash-ctx-head">
          <div>
            <div className="context-kicker">Upcoming schedule</div>
            <h2 id="dash-ctx-schedule-heading" className="context-heading">
              Calendar &amp; events
            </h2>
          </div>
        </div>

        {scheduleBothFailed ? (
          <ContextErrorRow
            message="Could not load calendar or registered events."
            onRetry={() => {
              onRetrySection('calendarEvents');
              onRetrySection('registeredEvents');
            }}
          />
        ) : (
          <>
            {calendarEventsSection.error && (
              <ContextErrorRow
                message="Calendar items unavailable."
                onRetry={() => onRetrySection('calendarEvents')}
              />
            )}
            {registeredEventsSection.error && (
              <ContextErrorRow
                message="Registered events unavailable."
                onRetry={() => onRetrySection('registeredEvents')}
              />
            )}

            {scheduleBothLoading ? (
              <ContextSkeleton rows={2} />
            ) : upcomingSchedule.length === 0 ? (
              !calendarEventsSection.error &&
              !registeredEventsSection.error && (
                <p className="context-copy">No upcoming calendar or registered events.</p>
              )
            ) : (
              <ul className="dash-ctx-list">
                {upcomingSchedule.map((entry) => {
                  const metaParts: string[] = [];
                  if (entry.source === 'registered') metaParts.push('Registered');
                  if (entry.kindLabel) metaParts.push(entry.kindLabel);

                  return (
                    <li key={entry.key} className="dash-ctx-list-item">
                      <Link href={entry.href} className="dash-ctx-schedule-row">
                        <div className="dash-ctx-schedule-date">
                          <span>{formatShortScheduleDate(entry.date)}</span>
                          {entry.time && <small>{entry.time}</small>}
                        </div>
                        <div className="dash-ctx-row-body">
                          <strong title={entry.title}>{entry.title}</strong>
                          {metaParts.length > 0 && (
                            <span className="dash-ctx-meta">
                              {metaParts.map((part, idx) => (
                                <React.Fragment key={part}>
                                  {idx > 0 && <span aria-hidden="true"> · </span>}
                                  <span
                                    className={
                                      idx === 0 && entry.source === 'registered'
                                        ? 'dash-ctx-source-tag'
                                        : undefined
                                    }
                                  >
                                    {part}
                                  </span>
                                </React.Fragment>
                              ))}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        <div className="dash-ctx-footer">
          <Link href="/calendar">My Calendar</Link>
          <span aria-hidden="true">·</span>
          <Link href="/events">Events &amp; Webinars</Link>
        </div>
      </section>

      {/* B. Needs Your Attention (Notifications & Messages kept strictly separate) */}
      <section className="context-section" aria-labelledby="dash-ctx-attention-heading">
        <div className="dash-ctx-head">
          <div>
            <div className="context-kicker">Needs your attention</div>
            <h2 id="dash-ctx-attention-heading" className="context-heading">
              Alerts &amp; messages
            </h2>
          </div>
        </div>

        {attentionAllCaughtUp ? (
          <div className="dash-ctx-caught-up">
            <CheckCircle2 size={15} className="dash-ctx-caught-icon" aria-hidden="true" />
            <div>
              <strong>All caught up</strong>
              <p className="context-copy">No unread notifications or messages.</p>
            </div>
          </div>
        ) : (
          <div className="dash-ctx-attention-groups">
            {/* Unread Notifications Group */}
            <div className="dash-ctx-subblock">
              <div className="dash-ctx-subhead">
                <span className="dash-ctx-sublabel">Notifications</span>
                <Link href="/notifications" className="dash-ctx-sublink">
                  View all
                </Link>
              </div>

              {notificationsSection.error ? (
                <ContextErrorRow
                  message="Notifications unavailable."
                  onRetry={() => onRetrySection('notifications')}
                />
              ) : notificationsLoading ? (
                <ContextSkeleton rows={2} />
              ) : unreadNotifications.length === 0 ? (
                <p className="dash-ctx-empty-line">No unread notifications.</p>
              ) : (
                <ul className="dash-ctx-list">
                  {unreadNotifications.map((notification) => (
                    <li key={notification.id} className="dash-ctx-list-item">
                      <Link
                        href={getSafeInternalHref(notification.href)}
                        className="dash-ctx-alert-row"
                      >
                        <Bell size={14} className="dash-ctx-row-icon" aria-hidden="true" />
                        <div className="dash-ctx-row-body">
                          <strong title={notification.title}>{notification.title}</strong>
                          {notification.time && (
                            <span className="dash-ctx-meta">{notification.time}</span>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Unread Messages Group */}
            <div className="dash-ctx-subblock dash-ctx-subblock--divided">
              <div className="dash-ctx-subhead">
                <span className="dash-ctx-sublabel">Unread message</span>
                <Link href="/messages" className="dash-ctx-sublink">
                  Inbox
                </Link>
              </div>

              {conversationsSection.error ? (
                <ContextErrorRow
                  message="Messages unavailable."
                  onRetry={() => onRetrySection('conversations')}
                />
              ) : conversationsLoading ? (
                <ContextSkeleton rows={1} />
              ) : !latestUnreadConversation ? (
                <p className="dash-ctx-empty-line">No unread messages.</p>
              ) : (
                <Link href="/messages" className="dash-ctx-alert-row">
                  <MessageSquare size={14} className="dash-ctx-row-icon" aria-hidden="true" />
                  <div className="dash-ctx-row-body">
                    <strong>{latestUnreadConversation.participantName}</strong>
                    {latestUnreadMessage?.text && (
                      <span className="dash-ctx-excerpt">{latestUnreadMessage.text}</span>
                    )}
                    <span className="dash-ctx-meta dash-tabular">
                      {latestUnreadConversation.unread} unread
                      {latestUnreadMessage?.time ? ` · ${latestUnreadMessage.time}` : ''}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {attentionAllCaughtUp && (
          <div className="dash-ctx-footer">
            <Link href="/notifications">Notifications</Link>
            <span aria-hidden="true">·</span>
            <Link href="/messages">Messages</Link>
          </div>
        )}
      </section>

      {/* C. Community Pulse Survey (omitted completely when no open survey exists) */}
      {surveysSection.error ? (
        <section className="context-section" aria-labelledby="dash-ctx-survey-heading">
          <div className="context-kicker">Community pulse</div>
          <h2 id="dash-ctx-survey-heading" className="context-heading">
            Survey unavailable
          </h2>
          <ContextErrorRow
            message="Could not check open surveys."
            onRetry={() => onRetrySection('surveys')}
          />
        </section>
      ) : surveysLoading ? (
        <section className="context-section" aria-label="Loading community survey">
          <div className="context-kicker">Community pulse</div>
          <ContextSkeleton rows={1} />
        </section>
      ) : activeSurvey ? (
        <section
          className="context-section dash-ctx-survey"
          aria-labelledby="dash-ctx-survey-heading"
        >
          <div className="context-kicker">Community pulse</div>
          <h2 id="dash-ctx-survey-heading" className="context-heading">
            {activeSurvey.title}
          </h2>
          {activeSurvey.description && (
            <p className="context-copy dash-ctx-survey-desc">{activeSurvey.description}</p>
          )}
          <div className="dash-ctx-survey-footer">
            {typeof activeSurvey.responsesCount === 'number' ? (
              <span className="dash-ctx-meta dash-tabular">
                {activeSurvey.responsesCount} responses
              </span>
            ) : (
              <span className="dash-ctx-meta">Open survey</span>
            )}
            <Link href="/surveys" className="dash-ctx-survey-cta">
              <span>Participate</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : null}

      {/* D. Quick Access */}
      <section className="context-section" aria-labelledby="dash-ctx-quick-heading">
        <div className="context-kicker">Quick access</div>
        <h2 id="dash-ctx-quick-heading" className="context-heading dash-ctx-quick-title">
          Member utilities
        </h2>
        <div className="context-action-list dash-ctx-quick-list">
          <Link href="/saved" className="context-action-link dash-ctx-action-link">
            <span className="context-action-icon">
              <Bookmark size={15} aria-hidden="true" />
            </span>
            <span className="context-action-label">Saved Items</span>
            {showReliableSavedCount ? (
              <span className="dash-ctx-count dash-tabular">{savedCount}</span>
            ) : (
              <ArrowRight size={13} className="context-action-arrow" aria-hidden="true" />
            )}
          </Link>
          <Link href="/certificates" className="context-action-link dash-ctx-action-link">
            <span className="context-action-icon">
              <Award size={15} aria-hidden="true" />
            </span>
            <span className="context-action-label">Credentials</span>
            <ArrowRight size={13} className="context-action-arrow" aria-hidden="true" />
          </Link>
          <Link href="/support" className="context-action-link dash-ctx-action-link">
            <span className="context-action-icon">
              <LifeBuoy size={15} aria-hidden="true" />
            </span>
            <span className="context-action-label">Help Desk</span>
            <ArrowRight size={13} className="context-action-arrow" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
