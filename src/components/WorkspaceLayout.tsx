import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  LifeBuoy,
  Menu,
  MessageSquare,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isRouteActive, Link, useRouter } from '../context/RouterContext';
import { api } from '../lib/api';
import {
  isWorkspaceGroupActive,
  isWorkspaceItemActive,
  resolveWorkspacePageMeta,
  WORKSPACE_NAV_GROUPS,
} from '../data/workspaceNavigation';
import { BrandSymbol } from './BrandMark';
import { AccountMenu, GlobalSearchInput, ThemeToggleButton } from './NavigationControls';
import { renderWorkspaceIcon, WorkspaceContextRail } from './WorkspaceContextRail';

const SIDEBAR_GROUPS_STORAGE_KEY = 'hrshakti_sidebar_groups_v1';
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'hrshakti_sidebar_collapsed_v1';

function buildInitialGroupState(activeGroupId: string): Record<string, boolean> {
  const defaults: Record<string, boolean> = {};
  for (const group of WORKSPACE_NAV_GROUPS) {
    defaults[group.id] = Boolean(group.defaultOpen) || group.id === activeGroupId;
  }
  try {
    const raw = window.localStorage.getItem(SIDEBAR_GROUPS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      return { ...defaults, ...parsed, [activeGroupId]: true };
    }
  } catch {
    // Ignore storage read errors in restricted environments
  }
  return defaults;
}

function readInitialCollapsedState(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export interface WorkspaceLayoutProps {
  children: React.ReactNode;
  contextPanel?: React.ReactNode;
  hideContextRail?: boolean;
  wide?: boolean;
}

export function WorkspaceLayout({
  children,
  contextPanel,
  hideContextRail = false,
  wide = false,
}: WorkspaceLayoutProps) {
  const { user } = useAuth();
  const { pathname } = useRouter();
  const pageMeta = useMemo(() => resolveWorkspacePageMeta(pathname), [pathname]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(readInitialCollapsedState);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    buildInitialGroupState(pageMeta.groupId)
  );
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const quickAddRef = useRef<HTMLDivElement>(null);

  // Always ensure the active route's sidebar group is expanded
  useEffect(() => {
    setOpenGroups((prev) => {
      if (prev[pageMeta.groupId]) return prev;
      const next = { ...prev, [pageMeta.groupId]: true };
      try {
        window.localStorage.setItem(SIDEBAR_GROUPS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage write errors
      }
      return next;
    });
    setMenuOpen(false);
    setQuickAddOpen(false);
  }, [pathname, pageMeta.groupId]);

  // Close Quick Actions menu on outside click or Escape
  useEffect(() => {
    if (!quickAddOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!quickAddRef.current?.contains(e.target as Node)) {
        setQuickAddOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuickAddOpen(false);
    };
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [quickAddOpen]);

  // Lightly sync real unread counts for signed-in members from existing Express endpoints
  useEffect(() => {
    if (!user) {
      setUnreadNotifications(0);
      setUnreadMessages(0);
      return;
    }
    let active = true;
    Promise.all([
      api.get<{ items: Array<{ read?: boolean }> }>('/notifications').catch(() => ({ items: [] })),
      api
        .get<{ items: Array<{ unread?: number }> }>('/messages/conversations')
        .catch(() => ({ items: [] })),
    ]).then(([notifs, convs]) => {
      if (!active) return;
      setUnreadNotifications(notifs.items.filter((n) => !n.read).length);
      setUnreadMessages(convs.items.reduce((sum, c) => sum + (c.unread || 0), 0));
    });
    return () => {
      active = false;
    };
  }, [user, pathname]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const next = { ...prev, [groupId]: !prev[groupId] };
      try {
        window.localStorage.setItem(SIDEBAR_GROUPS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage write errors
      }
      return next;
    });
  };

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next));
      } catch {
        // Ignore storage write errors
      }
      return next;
    });
  };

  const allGroupsExpanded = WORKSPACE_NAV_GROUPS.every((g) => Boolean(openGroups[g.id]));

  const handleToggleAllGroups = () => {
    const nextState: Record<string, boolean> = {};
    const targetOpen = !allGroupsExpanded;
    for (const g of WORKSPACE_NAV_GROUPS) {
      nextState[g.id] = targetOpen || g.id === pageMeta.groupId;
    }
    setOpenGroups(nextState);
    try {
      window.localStorage.setItem(SIDEBAR_GROUPS_STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      // Ignore storage write errors
    }
  };

  const handleCollapsedGroupClick = (groupId: string) => {
    setSidebarCollapsed(false);
    const nextGroups = { ...openGroups, [groupId]: true };
    setOpenGroups(nextGroups);
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, 'false');
      window.localStorage.setItem(SIDEBAR_GROUPS_STORAGE_KEY, JSON.stringify(nextGroups));
    } catch {
      // Ignore storage write errors
    }
  };

  const showContextRail =
    !hideContextRail && !wide && (Boolean(contextPanel) || pageMeta.contextMode !== 'none');

  const gridClasses = [
    'workspace-grid',
    sidebarCollapsed ? 'workspace-grid--collapsed' : '',
    showContextRail ? 'workspace-grid--with-context' : 'workspace-grid--wide',
    menuOpen ? 'menu-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="workspace">
      <header className="app-header">
        <div className="app-header-left">
          <button
            type="button"
            className="icon-button mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            href={user ? '/dashboard' : '/'}
            className="app-brand"
            aria-label="HRShakti workspace home"
          >
            <BrandSymbol size={30} />
            <span className="app-brand-name">
              HR <b>SHAKTI</b>
            </span>
          </Link>

          <span className="app-header-divider" aria-hidden="true" />

          <nav className="app-breadcrumb" aria-label="Current location">
            <span className="app-breadcrumb-group">{pageMeta.groupLabel}</span>
            <ChevronRight size={13} className="app-breadcrumb-sep" aria-hidden="true" />
            <span className="app-breadcrumb-current" aria-current="page">
              {pageMeta.title}
            </span>
          </nav>
        </div>

        <div className="app-header-center">
          <GlobalSearchInput id="workspace-search" className="workspace-search" />
        </div>

        <div className="app-header-actions">
          <div className="quick-add-menu" ref={quickAddRef}>
            <button
              type="button"
              className="quick-add-trigger"
              aria-expanded={quickAddOpen}
              aria-haspopup="menu"
              onClick={() => setQuickAddOpen((v) => !v)}
            >
              <Plus size={15} aria-hidden="true" />
              <span>Quick add</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>

            {quickAddOpen && (
              <div className="quick-add-popover" role="menu" aria-label="Quick create actions">
                <div className="quick-add-heading">Create or jump to</div>
                <Link href="/discussions" role="menuitem" onClick={() => setQuickAddOpen(false)}>
                  <MessagesSquare size={15} aria-hidden="true" />
                  <span>
                    <strong>Start a discussion</strong>
                    <small>Share a question or peer update</small>
                  </span>
                </Link>
                <Link href="/tasks" role="menuitem" onClick={() => setQuickAddOpen(false)}>
                  <CheckSquare size={15} aria-hidden="true" />
                  <span>
                    <strong>Add a task</strong>
                    <small>Track a people ops deliverable</small>
                  </span>
                </Link>
                <Link href="/calendar" role="menuitem" onClick={() => setQuickAddOpen(false)}>
                  <Calendar size={15} aria-hidden="true" />
                  <span>
                    <strong>Schedule event</strong>
                    <small>Add an entry to My Calendar</small>
                  </span>
                </Link>
                <Link href="/support" role="menuitem" onClick={() => setQuickAddOpen(false)}>
                  <LifeBuoy size={15} aria-hidden="true" />
                  <span>
                    <strong>Help Desk request</strong>
                    <small>Contact HRShakti member support</small>
                  </span>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/messages"
            className={`icon-button header-utility-btn${isRouteActive(pathname, '/messages') ? ' active' : ''}`}
            aria-label={unreadMessages > 0 ? `Messages (${unreadMessages} unread)` : 'Messages'}
            title="Messages"
          >
            <MessageSquare size={18} aria-hidden="true" />
            {unreadMessages > 0 && (
              <span className="header-icon-count" aria-hidden="true">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </Link>

          <Link
            href="/notifications"
            className={`icon-button header-utility-btn${isRouteActive(pathname, '/notifications') ? ' active' : ''}`}
            aria-label={
              unreadNotifications > 0 ? `Notifications (${unreadNotifications} unread)` : 'Notifications'
            }
            title="Notifications"
          >
            <Bell size={18} aria-hidden="true" />
            {unreadNotifications > 0 && (
              <span className="header-icon-count" aria-hidden="true">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </Link>

          <ThemeToggleButton />

          <span className="app-header-actions-sep" aria-hidden="true" />

          {user ? (
            <AccountMenu />
          ) : (
            <Link href="/login" className="button button-secondary app-signin-btn">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <div className={gridClasses}>
        {menuOpen && (
          <div
            className="side-rail-backdrop"
            aria-hidden="true"
            onMouseDown={() => setMenuOpen(false)}
          />
        )}

        <aside
          className={`side-rail${sidebarCollapsed ? ' side-rail--collapsed' : ''}`}
          aria-label="Workspace navigation"
        >
          <div className="mobile-rail-heading">
            <strong>HRShakti Workspace</strong>
            <button
              type="button"
              className="icon-button"
              aria-label="Close navigation"
              onClick={() => setMenuOpen(false)}
            >
              <X size={19} />
            </button>
          </div>

          <div className="rail-desktop-header">
            {!sidebarCollapsed && <span className="rail-header-title">Workspace</span>}
            <button
              type="button"
              className="rail-collapse-btn"
              onClick={toggleSidebarCollapsed}
              aria-label={sidebarCollapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          {sidebarCollapsed ? (
            <nav className="rail-collapsed-nav" aria-label="Collapsed workspace sections">
              <Link
                href="/dashboard"
                className={`rail-icon-link${isRouteActive(pathname, '/dashboard') ? ' active' : ''}`}
                aria-label="Dashboard"
                title="Dashboard"
              >
                {renderWorkspaceIcon('dashboard', 18)}
              </Link>
              <div className="rail-collapsed-divider" />
              {WORKSPACE_NAV_GROUPS.filter((g) => g.id !== 'overview').map((group) => {
                const groupActive = isWorkspaceGroupActive(pathname, group);
                return (
                  <button
                    key={group.id}
                    type="button"
                    className={`rail-icon-link${groupActive ? ' active' : ''}`}
                    onClick={() => handleCollapsedGroupClick(group.id)}
                    aria-label={`Open ${group.label}`}
                    title={group.label}
                  >
                    {renderWorkspaceIcon(group.icon, 18)}
                  </button>
                );
              })}
            </nav>
          ) : (
            <>
              <nav className="rail-nav-scroll" aria-label="Workspace sections">
                {WORKSPACE_NAV_GROUPS.map((group) => {
                  const isOpen = Boolean(openGroups[group.id]);
                  const hasActiveChild = isWorkspaceGroupActive(pathname, group);
                  const sectionPanelId = `rail-group-${group.id}`;

                  return (
                    <section className="rail-group" key={group.id}>
                      <button
                        type="button"
                        className={`rail-group-trigger${hasActiveChild ? ' has-active' : ''}`}
                        aria-expanded={isOpen}
                        aria-controls={sectionPanelId}
                        onClick={() => toggleGroup(group.id)}
                      >
                        <span className="rail-group-label">{group.label}</span>
                        <span className="rail-group-meta">
                          <span className="rail-group-count">{group.items.length}</span>
                          <ChevronDown
                            size={14}
                            className={`rail-group-chevron${isOpen ? ' open' : ''}`}
                            aria-hidden="true"
                          />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="rail-group-items" id={sectionPanelId}>
                          {group.items.map((item) => {
                            const active = isWorkspaceItemActive(pathname, item);
                            return (
                              <Link
                                key={item.id}
                                href={item.href}
                                className={`rail-link${active ? ' active' : ''}`}
                                aria-current={active ? 'page' : undefined}
                                onClick={() => setMenuOpen(false)}
                              >
                                {renderWorkspaceIcon(item.icon, 16)}
                                <span className="rail-link-label">{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  );
                })}
              </nav>

              <div className="rail-footer">
                <button
                  type="button"
                  className="rail-footer-action"
                  onClick={handleToggleAllGroups}
                >
                  {allGroupsExpanded ? 'Collapse inactive groups' : 'Expand all groups'}
                </button>
              </div>
            </>
          )}
        </aside>

        <main className="workspace-main">
          <div className={`workspace-content${showContextRail ? '' : ' workspace-content--wide'}`}>
            {children}
          </div>
        </main>

        {showContextRail && (
          <WorkspaceContextRail
            mode={pageMeta.contextMode === 'none' ? 'overview' : pageMeta.contextMode}
            pageTitle={pageMeta.title}
            user={user}
            customContent={contextPanel}
          />
        )}
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
      <div className="page-title-copy">
        <p className="page-eyebrow">{eyebrow}</p>
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
