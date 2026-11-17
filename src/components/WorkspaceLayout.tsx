import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  Bell,
  Bookmark,
  Calendar,
  CheckSquare,
  ClipboardList,
  Compass,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isRouteActive, Link, useRouter } from '../context/RouterContext';
import { WORKSPACE_RAIL_LINKS } from '../data/navigation';
import { BrandWordmark } from './BrandMark';
import {
  AccountMenu,
  DiscoveryNav,
  GlobalSearchInput,
  ThemeToggleButton,
} from './NavigationControls';

const RAIL_ICONS: Record<string, React.ReactNode> = {
  '/calendar': <Calendar size={17} aria-hidden="true" />,
  '/tasks': <CheckSquare size={17} aria-hidden="true" />,
  '/support': <HelpCircle size={17} aria-hidden="true" />,
  '/surveys': <ClipboardList size={17} aria-hidden="true" />,
  '/certificates': <Award size={17} aria-hidden="true" />,
  '/network': <Users size={17} aria-hidden="true" />,
};

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { pathname } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="workspace">
      <header className="app-header">
        <div className="app-brand">
          <BrandWordmark compact />
          <span>
            HR <b>SHAKTI</b>
          </span>
        </div>

        <button
          type="button"
          className="icon-button mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <DiscoveryNav />
        <GlobalSearchInput id="workspace-search" className="workspace-search" />

        <div className="app-header-actions">
          <ThemeToggleButton />
          <Link href="/messages" className="icon-button" aria-label="Messages">
            <MessageSquare size={18} aria-hidden="true" />
          </Link>
          <Link href="/notifications" className="icon-button" aria-label="Notifications">
            <Bell size={18} aria-hidden="true" />
          </Link>
          {user ? (
            <AccountMenu />
          ) : (
            <Link href="/login" className="button button-secondary" style={{ minHeight: 38, padding: '0 13px' }}>
              Sign in
            </Link>
          )}
        </div>
      </header>

      <div className={`workspace-grid${menuOpen ? ' menu-open' : ''}`}>
        {menuOpen && (
          <div className="side-rail-backdrop" aria-hidden="true" onMouseDown={() => setMenuOpen(false)} />
        )}

        <aside className="side-rail" aria-label="Workspace navigation">
          <div className="mobile-rail-heading">
            <strong>Explore HR Shakti</strong>
            <button
              type="button"
              className="icon-button"
              aria-label="Close navigation"
              onClick={() => setMenuOpen(false)}
            >
              <X size={19} />
            </button>
          </div>

          <div className="rail-label">{user ? 'Your space' : 'Explore HR Shakti'}</div>

          {user && (
            <Link
              href="/dashboard"
              className={`rail-link${isRouteActive(pathname, '/dashboard') ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard size={17} aria-hidden="true" />
              <span>Dashboard</span>
            </Link>
          )}

          <Link
            href="/feed"
            className={`rail-link${isRouteActive(pathname, '/feed') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <Compass size={17} aria-hidden="true" />
            <span>Community feed</span>
          </Link>

          <div className="rail-divider" />
          <div className="rail-label">Discover</div>
          <Link
            href="/discussions"
            className={`rail-link${isRouteActive(pathname, '/discussions') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Discussions</span>
          </Link>
          <Link
            href="/questions"
            className={`rail-link${isRouteActive(pathname, '/questions') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Questions & answers</span>
          </Link>
          <Link
            href="/communities"
            className={`rail-link${isRouteActive(pathname, '/communities') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Communities</span>
          </Link>
          <Link
            href="/jobs"
            className={`rail-link${isRouteActive(pathname, '/jobs') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Open roles</span>
          </Link>
          <Link
            href="/learning"
            className={`rail-link${isRouteActive(pathname, '/learning') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Learning library</span>
          </Link>
          <Link
            href="/events"
            className={`rail-link${isRouteActive(pathname, '/events') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>Events</span>
          </Link>
          <Link
            href="/blogs"
            className={`rail-link${isRouteActive(pathname, '/blogs') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>HR Shakti Journal</span>
          </Link>

          <div className="rail-divider" />
          <div className="rail-label">Your work</div>
          {WORKSPACE_RAIL_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rail-link${isRouteActive(pathname, item.href) ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {RAIL_ICONS[item.href]}
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="rail-divider" />
          <div className="rail-label">Your account</div>
          <Link
            href="/profile"
            className={`rail-link${isRouteActive(pathname, '/profile') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <User size={17} aria-hidden="true" />
            <span>My profile</span>
          </Link>
          <Link
            href="/saved"
            className={`rail-link${isRouteActive(pathname, '/saved') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <Bookmark size={17} aria-hidden="true" />
            <span>Saved items</span>
          </Link>
          <Link
            href="/settings"
            className={`rail-link${isRouteActive(pathname, '/settings') ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <Settings size={17} aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </aside>

        <main style={{ minWidth: 0 }}>{children}</main>

        <aside className="context-rail" aria-label="Community highlights">
          <div className="context-card panel">
            <p className="eyebrow">PEER PRACTICE</p>
            <h2>Build better workplaces together.</h2>
            <p>
              {user
                ? 'Share a live dilemma with HR peers, save field notes, or join an upcoming roundtable.'
                : 'Sign in with one click as a demo member to post discussions, save articles, and manage tasks.'}
            </p>
            <Link href={user ? '/discussions' : '/login'}>
              {user ? 'Start a discussion' : 'Sign in to workspace'} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="panel context-links">
            <div className="rail-label">Quick destinations</div>
            <Link href="/news">
              <Compass size={15} /> People & Work Briefing
            </Link>
            <Link href="/mentorship">
              <Users size={15} /> Find a mentor
            </Link>
            <Link href="/career">
              <Award size={15} /> Explore career paths
            </Link>
            <Link href="/applications">
              <ClipboardList size={15} /> My applications
            </Link>
            <Link href="/my-events">
              <Calendar size={15} /> My registered events
            </Link>
          </div>

          <div className="context-legal">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <p className="eyebrow">
          <span className="eyebrow-dot" /> {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action && <div className="page-title-action">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="loading-state" role="status">
      <span className="loader" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-mark" aria-hidden="true">
        H
      </span>
      <p>{title}</p>
      <span>{description}</span>
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  );
}
