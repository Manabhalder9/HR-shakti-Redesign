import React from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  BookOpenCheck,
  Bookmark,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  CalendarRange,
  CheckSquare,
  ClipboardList,
  FileBarChart2,
  FileCheck2,
  FileText,
  FolderOpen,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  MessagesSquare,
  Rss,
  Scale,
  Settings,
  Ticket,
  TrendingUp,
  User,
  UserPlus,
  UsersRound,
  Wrench,
} from 'lucide-react';
import { Link } from '../context/RouterContext';
import {
  CONTEXT_RAIL_CONFIGS,
  type WorkspaceContextMode,
  type WorkspaceIconKey,
} from '../data/workspaceNavigation';
import type { MemberUser } from '../context/AuthContext';

export function renderWorkspaceIcon(key: WorkspaceIconKey, size = 16): React.ReactNode {
  const props = { size, 'aria-hidden': true as const, strokeWidth: 1.85 };
  switch (key) {
    case 'dashboard':
      return <LayoutDashboard {...props} />;
    case 'ai':
      return <Bot {...props} />;
    case 'feed':
      return <Rss {...props} />;
    case 'discussions':
      return <MessagesSquare {...props} />;
    case 'communities':
      return <UsersRound {...props} />;
    case 'network':
      return <UserPlus {...props} />;
    case 'messages':
      return <Mail {...props} />;
    case 'mentorship':
      return <Handshake {...props} />;
    case 'jobs':
      return <Briefcase {...props} />;
    case 'applications':
      return <FileCheck2 {...props} />;
    case 'career':
      return <TrendingUp {...props} />;
    case 'organizations':
      return <Building2 {...props} />;
    case 'learning':
      return <GraduationCap {...props} />;
    case 'my-learning':
      return <BookOpenCheck {...props} />;
    case 'credentials':
      return <Award {...props} />;
    case 'events':
      return <CalendarRange {...props} />;
    case 'my-events':
      return <Ticket {...props} />;
    case 'knowledge':
      return <BookOpen {...props} />;
    case 'templates':
      return <FileText {...props} />;
    case 'toolkit':
      return <Wrench {...props} />;
    case 'compliance':
      return <Scale {...props} />;
    case 'benchmarks':
      return <BarChart3 {...props} />;
    case 'reports':
      return <FileBarChart2 {...props} />;
    case 'calendar':
      return <Calendar {...props} />;
    case 'tasks':
      return <CheckSquare {...props} />;
    case 'files':
      return <FolderOpen {...props} />;
    case 'saved':
      return <Bookmark {...props} />;
    case 'surveys':
      return <ClipboardList {...props} />;
    case 'profile':
      return <User {...props} />;
    case 'support':
      return <LifeBuoy {...props} />;
    case 'settings':
      return <Settings {...props} />;
  }
}

export function WorkspaceContextRail({
  mode,
  pageTitle,
  user,
  customContent,
}: {
  mode: Exclude<WorkspaceContextMode, 'none'>;
  pageTitle: string;
  user: MemberUser | null;
  customContent?: React.ReactNode;
}) {
  const config = CONTEXT_RAIL_CONFIGS[mode];

  return (
    <aside className="context-rail" aria-label={`${pageTitle} contextual panel`}>
      {!user && (
        <section className="context-section context-auth-callout">
          <div className="context-kicker">Member workspace</div>
          <h2 className="context-heading">Sign in for full access</h2>
          <p className="context-copy">
            Use one-click demo sign-in to post discussions, track applications, save articles, and manage tasks.
          </p>
          <Link href="/login" className="context-primary-link">
            <span>Sign in to workspace</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </section>
      )}

      {customContent ? (
        customContent
      ) : (
        <>
          <section className="context-section">
            <div className="context-kicker">{config.kicker}</div>
            <h2 className="context-heading">{config.heading}</h2>
            <p className="context-copy">{config.summary}</p>
            <div className="context-action-list">
              {config.actions.map((action) => (
                <Link key={action.href + action.label} href={action.href} className="context-action-link">
                  <span className="context-action-icon">{renderWorkspaceIcon(action.icon, 15)}</span>
                  <span className="context-action-label">{action.label}</span>
                  <ArrowRight size={13} className="context-action-arrow" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          <section className="context-section">
            <div className="context-kicker">{config.resourcesHeading}</div>
            <div className="context-resource-list">
              {config.resources.map((item) => (
                <Link key={item.href + item.label} href={item.href} className="context-resource-item">
                  <strong>{item.label}</strong>
                  <span>{item.meta}</span>
                </Link>
              ))}
            </div>
          </section>

          {config.tipHeading && config.tipBody && (
            <section className="context-section context-section-muted">
              <div className="context-kicker">{config.tipHeading}</div>
              <p className="context-copy">{config.tipBody}</p>
            </section>
          )}
        </>
      )}

      <nav className="context-legal" aria-label="Platform links">
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </aside>
  );
}
