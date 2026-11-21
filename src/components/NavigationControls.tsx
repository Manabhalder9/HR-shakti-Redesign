import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isRouteActive, Link, useRouter } from '../context/RouterContext';
import { useTheme } from '../context/ThemeContext';
import { DISCOVERY_NAV, type DiscoveryGroup } from '../data/navigation';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className="icon-button theme-button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}

export function GlobalSearchInput({
  id,
  className = '',
}: {
  id: string;
  className?: string;
}) {
  const { navigate, pathname, search } = useRouter();
  const initialQ = pathname === '/search' ? new URLSearchParams(search).get('q') || '' : '';
  const [query, setQuery] = useState(initialQ);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pathname === '/search') {
      setQuery(new URLSearchParams(search).get('q') || '');
    }
  }, [pathname, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  return (
    <form className={`global-search ${className}`.trim()} role="search" onSubmit={handleSubmit}>
      <label htmlFor={id} className="sr-only">
        Search HR Shakti
      </label>
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search people, jobs, discussions…"
      />
      {query && (
        <button
          type="button"
          className="global-search-clear"
          aria-label="Clear search"
          onClick={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
      <button
        type="submit"
        className="global-search-submit"
        aria-label="Search HR Shakti"
        title="Search"
      >
        <Search size={15} aria-hidden="true" />
      </button>
    </form>
  );
}

export function DiscoveryNav() {
  const { pathname } = useRouter();
  const [openId, setOpenId] = useState<string>('');
  const navRef = useRef<HTMLElement>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const clearTimers = () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    setOpenId('');
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId('');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearTimers();
    };
  }, []);

  const handleTriggerKeyDown = (e: React.KeyboardEvent, group: DiscoveryGroup) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpenId(group.id);
      window.setTimeout(() => {
        const firstLink = navRef.current?.querySelector<HTMLAnchorElement>(`#nav-panel-${group.id} a`);
        firstLink?.focus();
      }, 0);
      return;
    }
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const idx = DISCOVERY_NAV.findIndex((g) => g.id === group.id);
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const next = DISCOVERY_NAV[(idx + delta + DISCOVERY_NAV.length) % DISCOVERY_NAV.length];
    setOpenId(next.id);
    triggerRefs.current[next.id]?.focus();
  };

  return (
    <nav
      className="discovery-nav"
      aria-label="Explore HR Shakti"
      ref={navRef}
      onPointerEnter={() => {
        if (closeTimerRef.current) {
          window.clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }
      }}
      onPointerLeave={() => {
        clearTimers();
        closeTimerRef.current = window.setTimeout(() => setOpenId(''), 150);
      }}
      onBlurCapture={(e) => {
        if (!navRef.current?.contains(e.relatedTarget as Node | null)) {
          setOpenId('');
        }
      }}
    >
      {DISCOVERY_NAV.map((group, idx) => {
        const isCurrentGroup = group.items.some((item) => isRouteActive(pathname, item.href));
        const isOpen = openId === group.id;

        return (
          <div className="discovery-nav-item" key={group.id}>
            <button
              ref={(el) => {
                triggerRefs.current[group.id] = el;
              }}
              type="button"
              className={`discovery-nav-trigger${isCurrentGroup ? ' active' : ''}${isOpen ? ' opened' : ''}`}
              aria-expanded={isOpen}
              aria-controls={`nav-panel-${group.id}`}
              onPointerDown={clearTimers}
              onClick={() => {
                clearTimers();
                setOpenId(isOpen ? '' : group.id);
              }}
              onKeyDown={(e) => handleTriggerKeyDown(e, group)}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') {
                  clearTimers();
                  hoverTimerRef.current = window.setTimeout(() => setOpenId(group.id), 110);
                }
              }}
            >
              {group.label}
              <ChevronDown size={13} aria-hidden="true" />
            </button>

            <div
              className="discovery-menu"
              id={`nav-panel-${group.id}`}
              aria-label={`${group.label} destinations`}
              hidden={!isOpen}
            >
              <div className="discovery-menu-links">
                <p className="eyebrow">
                  {String(idx + 1).padStart(2, '0')} / {group.label.toUpperCase()}
                </p>
                <p className="discovery-menu-intro">{group.intro}</p>
                <div className="discovery-menu-list">
                  {group.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-current={isRouteActive(pathname, item.href) ? 'page' : undefined}
                      onClick={() => setOpenId('')}
                    >
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                      </span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={group.featured.href}
                className="discovery-feature"
                onClick={() => setOpenId('')}
              >
                <span className="discovery-feature-kicker">FEATURED DESTINATION</span>
                <strong>{group.featured.label}</strong>
                <span>{group.featured.description}</span>
                <span className="discovery-feature-action">
                  Open <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export function AccountMenu() {
  const { user, signOut } = useAuth();
  const { navigate, pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div className="account-menu" ref={menuRef}>
      <button
        type="button"
        className="account-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="avatar">{user.avatarInitials}</span>
        <span style={{ maxWidth: 118, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.name}
        </span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open && (
        <div className="account-popover" role="menu">
          <div className="account-greeting">
            <strong>{user.name}</strong>
            <span>{user.title}</span>
          </div>
          <Link href="/dashboard" role="menuitem" onClick={() => setOpen(false)}>
            <LayoutDashboard size={15} aria-hidden="true" /> Workspace dashboard
          </Link>
          <Link href="/profile" role="menuitem" onClick={() => setOpen(false)}>
            <User size={15} aria-hidden="true" /> My profile
          </Link>
          <Link href="/saved" role="menuitem" onClick={() => setOpen(false)}>
            <Bookmark size={15} aria-hidden="true" /> Saved items
          </Link>
          <Link href="/settings" role="menuitem" onClick={() => setOpen(false)}>
            <Settings size={15} aria-hidden="true" /> Account settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOut();
              navigate('/');
            }}
          >
            <LogOut size={15} aria-hidden="true" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function MobileDiscoveryDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, signOut } = useAuth();
  const { pathname, navigate } = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="mobile-discovery-layer"
      role="dialog"
      aria-modal="true"
      aria-label="Explore HR Shakti"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mobile-discovery-drawer">
        <div className="mobile-discovery-heading">
          <div>
            <p className="eyebrow" style={{ marginBottom: 4 }}>
              NAVIGATION
            </p>
            <h2>Explore HR Shakti</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Close navigation" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="navigation-groups" style={{ padding: '8px 0' }}>
          {DISCOVERY_NAV.map((group, idx) => (
            <details className="navigation-group" key={group.id} open={idx === 0}>
              <summary>
                <span>{group.label}</span>
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <div className="navigation-group-links">
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={isRouteActive(pathname, item.href) ? 'page' : undefined}
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                    <small>{item.description}</small>
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </div>

        <div className="mobile-discovery-utility">
          <span>Appearance ({theme === 'dark' ? 'Dark' : 'Light'})</span>
          <button type="button" className="button button-secondary" onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </button>
        </div>

        <div className="mobile-discovery-account">
          {user ? (
            <>
              <Link href="/dashboard" onClick={onClose}>
                Workspace dashboard <ArrowRight size={15} />
              </Link>
              <Link href="/profile" onClick={onClose}>
                My profile <ArrowRight size={15} />
              </Link>
              <button
                type="button"
                className="button button-secondary"
                style={{ marginTop: 8 }}
                onClick={async () => {
                  onClose();
                  await signOut();
                  navigate('/');
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={onClose}>
                Sign in <ArrowRight size={15} />
              </Link>
              <Link
                href="/register"
                className="button button-primary"
                style={{ marginTop: 8 }}
                onClick={onClose}
              >
                Join HR Shakti <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
