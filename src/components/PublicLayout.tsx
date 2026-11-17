import React, { useState } from 'react';
import { ArrowRight, Bell, Menu, MessageSquare, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from '../context/RouterContext';
import { BrandWordmark } from './BrandMark';
import {
  AccountMenu,
  DiscoveryNav,
  GlobalSearchInput,
  MobileDiscoveryDrawer,
  ThemeToggleButton,
} from './NavigationControls';

export function PublicHeader() {
  const { user, ready } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="public-header">
        <div className="public-header-inner">
          <BrandWordmark />
          <DiscoveryNav />
          <GlobalSearchInput id="public-search" className="public-search" />
          <Link href="/search" className="mobile-search-link" aria-label="Search HR Shakti">
            <Search size={19} aria-hidden="true" />
          </Link>

          <div className="public-actions">
            <ThemeToggleButton />
            {ready && user ? (
              <>
                <Link href="/messages" className="public-shortcut" aria-label="Messages">
                  <MessageSquare size={18} aria-hidden="true" />
                </Link>
                <Link href="/notifications" className="public-shortcut" aria-label="Notifications">
                  <Bell size={18} aria-hidden="true" />
                </Link>
                <AccountMenu />
              </>
            ) : (
              <>
                <Link href="/login" className="sign-in-link">
                  Sign in
                </Link>
                <Link href="/register" className="button button-primary join-entry">
                  <span className="join-label-full">Join HR Shakti</span>
                  <span className="join-label-compact">Join</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="mobile-discovery-trigger icon-button"
            aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            {drawerOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </header>
      <MobileDiscoveryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="footer-main">
        <div>
          <BrandWordmark theme="dark" />
          <p>A professional home for the people who make work better.</p>
        </div>

        <div className="footer-links">
          <div>
            <strong>Explore</strong>
            <Link href="/communities">Communities</Link>
            <Link href="/discussions">Discussions</Link>
            <Link href="/people">People</Link>
          </div>
          <div>
            <strong>Grow</strong>
            <Link href="/career">Career paths</Link>
            <Link href="/jobs">Open jobs</Link>
            <Link href="/learning">Learning</Link>
            <Link href="/events">Events</Link>
          </div>
          <div>
            <strong>HR Shakti</strong>
            <Link href="/about">About</Link>
            <Link href="/blogs">Journal</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login">Sign in</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} HR Shakti</span>
        <nav aria-label="Legal and account links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/register">Create account</Link>
        </nav>
        <span>People. Purpose. Possibility.</span>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <PublicFooter />
    </div>
  );
}
