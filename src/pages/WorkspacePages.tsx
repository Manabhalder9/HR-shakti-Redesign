import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  Bookmark,
  Calendar,
  Check,
  CheckSquare,
  HelpCircle,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import {
  EmptyState,
  LoadingState,
  PageHeader,
  WorkspaceLayout,
} from '../components/WorkspaceLayout';
import { useAuth } from '../context/AuthContext';
import { Link, useRouter } from '../context/RouterContext';
import { useTheme } from '../context/ThemeContext';
import { api, formatDate } from '../lib/api';

export function DashboardPage() {
  const { user, signInDemo } = useAuth();
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/discussions?limit=4'),
      api.get('/jobs?limit=3'),
      api.get('/events/my-registrations'),
      api.get('/tasks'),
    ]).then(([d, j, ev, t]) => {
      setDiscussions(d.items || []);
      setJobs(j.items || []);
      setEvents(ev.items || []);
      setTasks(t.items || []);
    });
  }, []);

  if (!user) {
    return (
      <WorkspaceLayout>
        <PageHeader
          eyebrow="YOUR HR SHAKTI"
          title="Your professional home"
          description="Sign in to view your personalized dashboard, saved conversations, tasks, and registrations."
        />
        <div className="panel" style={{ maxWidth: 560 }}>
          <h2>Explore the member workspace</h2>
          <p style={{ color: 'var(--ink-soft)' }}>
            Sign in with your account or launch the pre-populated demo member profile (Priya Nair, Head
            of People Operations).
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
    <WorkspaceLayout>
      <PageHeader
        eyebrow="YOUR HR SHAKTI"
        title="Your professional home"
        description="A personal view of the people, opportunities, and ideas you care about."
        action={
          <Link href="/" className="button button-secondary">
            Go to homepage <ArrowRight size={15} />
          </Link>
        }
      />

      <div className="panel dashboard-welcome">
        <div className="avatar avatar-large">{user.avatarInitials}</div>
        <div style={{ flex: 1 }}>
          <p className="eyebrow" style={{ marginBottom: 4 }}>
            WELCOME BACK
          </p>
          <h2>{user.name}</h2>
          <p>
            {user.title} · {user.organization}. Keep your profile current, follow useful
            conversations, and make your next move when you are ready.
          </p>
        </div>
        <Link href="/profile" className="button button-secondary">
          Edit profile
        </Link>
      </div>

      <div className="calendar-overview">
        <div className="panel">
          <span>Open tasks</span>
          <strong>{tasks.filter((t) => !t.done).length}</strong>
        </div>
        <div className="panel">
          <span>Registered events</span>
          <strong>{events.length}</strong>
        </div>
        <div className="panel">
          <span>Active discussions</span>
          <strong>{discussions.length}</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16 }}>
        <div className="panel">
          <div className="section-title" style={{ marginTop: 0 }}>
            <h2>Recent conversations</h2>
            <Link href="/discussions">
              All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dashboard-records">
            {discussions.slice(0, 4).map((d) => (
              <Link key={d.id} href={`/discussions/${d.id}`}>
                <div>
                  <strong>{d.title}</strong>
                  <span>{d.communityName}</span>
                </div>
                <em>{d.commentCount} replies</em>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title" style={{ marginTop: 0 }}>
            <h2>Published open roles</h2>
            <Link href="/jobs">
              All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dashboard-records">
            {jobs.slice(0, 3).map((j) => (
              <Link key={j.id} href="/jobs">
                <div>
                  <strong>{j.title}</strong>
                  <span>
                    {j.company} · {j.location}
                  </span>
                </div>
                <em>{j.workMode}</em>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

export function PeopleAndNetworkPage({ networkOnly = false }: { networkOnly?: boolean }) {
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/people')
      .then((res) => setPeople(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  const toggleConnect = async (id: string) => {
    const res = await api.post(`/people/${id}/connect`);
    setPeople((prev) => prev.map((p) => (p.id === id ? res.item : p)));
  };

  const visible = networkOnly ? people.filter((p) => p.connected) : people;

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow={networkOnly ? 'MY NETWORK' : 'PEOPLE DIRECTORY'}
        title={networkOnly ? 'Your peer connections' : 'People behind people'}
        description="Connect with HR business partners, talent leaders, total rewards architects, and L&D builders."
      />
      {loading ? (
        <LoadingState />
      ) : (
        <div className="item-grid">
          {visible.map((p) => (
            <article className="item-card" key={p.id}>
              <div className="item-card-top">
                <span className="avatar">{p.avatarInitials}</span>
                <span className="item-meta">{p.location}</span>
              </div>
              <h3>{p.name}</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--terracotta)', fontWeight: 700, marginBottom: 6 }}>
                {p.title} · {p.organization}
              </div>
              <p>{p.bio}</p>
              <button
                type="button"
                className={`button ${p.connected ? 'button-secondary' : 'button-primary'}`}
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => toggleConnect(p.id)}
              >
                {p.connected ? (
                  <>
                    <UserCheck size={15} /> Connected
                  </>
                ) : (
                  <>
                    <UserPlus size={15} /> Connect
                  </>
                )}
              </button>
            </article>
          ))}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-11-30');
  const [time, setTime] = useState('11:00');
  const [type, setType] = useState('Team Ritual');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    api.get('/calendar/events').then((res) => setEvents(res.items || []));
  }, []);

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/calendar/events', { title, date, time, type, notes });
    setEvents((prev) => [res.item, ...prev]);
    setTitle('');
    setNotes('');
  };

  const removeEvent = async (id: string) => {
    await api.delete(`/calendar/events/${id}`);
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="MY CALENDAR"
        title="Your people-ops schedule"
        description="Keep track of mentorship check-ins, roundtables, and team calibration rituals."
      />

      <div className="panel" style={{ marginBottom: 18 }}>
        <h2 style={{ marginBottom: 14 }}>Add calendar entry</h2>
        <form onSubmit={addEvent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-field">
            <label htmlFor="cal-title">Title</label>
            <input id="cal-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Calibration sync…" />
          </div>
          <div className="form-field">
            <label htmlFor="cal-type">Type</label>
            <select id="cal-type" value={type} onChange={(e) => setType(e.target.value)}>
              <option>Team Ritual</option>
              <option>Community Event</option>
              <option>Mentorship</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="cal-date">Date</label>
            <input id="cal-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="cal-time">Time</label>
            <input id="cal-time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="cal-notes">Notes</label>
            <input id="cal-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Agenda or link…" />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="button button-primary">
              <Plus size={15} /> Add to calendar
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <h2 style={{ marginBottom: 12 }}>Upcoming entries ({events.length})</h2>
        <div className="calendar-list">
          {events.map((ev) => (
            <div className="calendar-row" key={ev.id}>
              <span className="calendar-row-icon">
                <Calendar size={17} />
              </span>
              <div>
                <strong>{ev.title}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
                  {formatDate(ev.date)} at {ev.time} · {ev.type}
                </div>
                {ev.notes && <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--ink-soft)' }}>{ev.notes}</p>}
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Remove entry"
                onClick={() => removeEvent(ev.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceLayout>
  );
}

export function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('2026-11-25');

  useEffect(() => {
    api.get('/tasks').then((res) => setTasks(res.items || []));
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/tasks', { title, priority, dueDate, category: 'People Ops' });
    setTasks((prev) => [res.item, ...prev]);
    setTitle('');
  };

  const toggleDone = async (task: any) => {
    const res = await api.patch(`/tasks/${task.id}`, { done: !task.done });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? res.item : t)));
  };

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="MY TASKS"
        title="People-operations checklist"
        description="Stay on top of onboarding rituals, calibration prep, and chapter commitments."
      />

      <div className="panel" style={{ marginBottom: 18 }}>
        <form onSubmit={addTask} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            style={{ flex: '1 1 260px' }}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task…"
          />
          <select style={{ width: 'auto' }} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input style={{ width: 'auto' }} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <button type="submit" className="button button-primary">
            <Plus size={15} /> Add task
          </button>
        </form>
      </div>

      <div className="panel" style={{ padding: 0 }}>
        {tasks.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <button
              type="button"
              className="icon-button"
              onClick={() => toggleDone(t)}
              aria-label={t.done ? 'Mark incomplete' : 'Mark complete'}
            >
              <CheckSquare size={18} color={t.done ? 'var(--terracotta)' : 'var(--ink-muted)'} />
            </button>
            <div style={{ flex: 1 }}>
              <strong style={{ textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.65 : 1 }}>
                {t.title}
              </strong>
              <div style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
                Due {formatDate(t.dueDate)} · {t.priority} priority
              </div>
            </div>
            <button type="button" className="icon-button" aria-label="Delete task" onClick={() => deleteTask(t.id)}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </WorkspaceLayout>
  );
}

export function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState('');

  useEffect(() => {
    api.get('/messages/conversations').then((res) => {
      const items = res.items || [];
      setConversations(items);
      if (items[0]) setSelectedId(items[0].id);
    });
  }, []);

  const active = conversations.find((c) => c.id === selectedId);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !draft.trim()) return;
    const res = await api.post(`/messages/conversations/${active.id}/messages`, { text: draft });
    setConversations((prev) => prev.map((c) => (c.id === active.id ? res.conversation : c)));
    setDraft('');
  };

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="MESSAGES"
        title="Peer conversations"
        description="Direct threads with fellow HR Shakti members and mentors."
      />

      <div className="messages-layout">
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              className={`conversation-row${conv.id === selectedId ? ' selected' : ''}`}
              onClick={() => setSelectedId(conv.id)}
            >
              <strong style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{conv.participantName}</span>
                {conv.unread > 0 && <span className="unread-count">{conv.unread}</span>}
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{conv.participantTitle}</span>
            </button>
          ))}
        </div>

        <div className="panel">
          {!active ? (
            <EmptyState title="Select a conversation" description="Choose a member thread on the left." />
          ) : (
            <>
              <div style={{ paddingBottom: 12, marginBottom: 14, borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ marginBottom: 2 }}>{active.participantName}</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{active.participantTitle}</span>
              </div>
              <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
                {active.messages.map((m: any) => (
                  <div
                    key={m.id}
                    style={{
                      padding: '11px 14px',
                      background: m.senderId === 'u-demo' ? 'var(--surface-copper)' : 'var(--surface-warm)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: 4 }}>
                      <strong>{m.senderName}</strong>
                      <span style={{ color: 'var(--ink-muted)' }}>{m.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{m.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message…"
                />
                <button type="submit" className="button button-primary">
                  <Send size={15} /> Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}

export function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/notifications').then((res) => setItems(res.items || []));
  }, []);

  const markAllRead = async () => {
    const res = await api.post('/notifications/read-all');
    setItems(res.items || []);
  };

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="NOTIFICATIONS"
        title="Recent activity"
        description="Replies, event confirmations, and journal updates from your circles."
        action={
          <button type="button" className="button button-secondary" onClick={markAllRead}>
            <Check size={15} /> Mark all as read
          </button>
        }
      />
      <div className="panel" style={{ padding: 0 }}>
        {items.map((n) => (
          <Link
            key={n.id}
            href={n.href}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              padding: '15px 20px',
              borderBottom: '1px solid var(--border)',
              background: n.read ? 'transparent' : 'var(--surface-copper)',
              color: 'var(--ink)',
            }}
          >
            <strong>{n.title}</strong>
            <span style={{ color: 'var(--ink-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{n.time}</span>
          </Link>
        ))}
      </div>
    </WorkspaceLayout>
  );
}

export function SavedItemsPage() {
  const { toggleSave } = useAuth();
  const [data, setData] = useState<{ discussions: any[]; blogs: any[]; jobs: any[] }>({
    discussions: [],
    blogs: [],
    jobs: [],
  });

  const loadSaved = () => {
    api.get('/saved').then((res) => setData(res));
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleUnsave = async (id: string) => {
    await toggleSave(id);
    loadSaved();
  };

  const total = data.discussions.length + data.blogs.length + data.jobs.length;

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="SAVED ITEMS"
        title="Your reading & reference shelf"
        description="Bookmarked discussions, journal essays, and open roles saved for later."
      />
      {total === 0 ? (
        <EmptyState
          title="No saved items yet"
          description="Use the Save button on any discussion, essay, or role to keep it here."
          action={
            <Link href="/discussions" className="button button-primary">
              Browse discussions
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {data.discussions.map((d) => (
            <div className="panel" key={d.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 4 }}>
                  DISCUSSION
                </p>
                <Link href={`/discussions/${d.id}`}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>{d.title}</strong>
                </Link>
              </div>
              <button type="button" className="button button-secondary" onClick={() => handleUnsave(d.id)}>
                <Bookmark size={14} fill="currentColor" /> Remove
              </button>
            </div>
          ))}
          {data.blogs.map((b) => (
            <div className="panel" key={b.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 4 }}>
                  JOURNAL ESSAY
                </p>
                <Link href={`/blogs/${b.slug}`}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>{b.title}</strong>
                </Link>
              </div>
              <button type="button" className="button button-secondary" onClick={() => handleUnsave(b.id)}>
                <Bookmark size={14} fill="currentColor" /> Remove
              </button>
            </div>
          ))}
          {data.jobs.map((j) => (
            <div className="panel" key={j.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 4 }}>
                  OPEN ROLE
                </p>
                <Link href="/jobs">
                  <strong style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
                    {j.title} — {j.company}
                  </strong>
                </Link>
              </div>
              <button type="button" className="button button-secondary" onClick={() => handleUnsave(j.id)}>
                <Bookmark size={14} fill="currentColor" /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function ProfileAndSettingsPage({ mode = 'profile' }: { mode?: 'profile' | 'settings' }) {
  const { user, updateProfile, signInDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.title || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setTitle(user.title);
      setOrganization(user.organization);
      setLocation(user.location);
      setBio(user.bio);
    }
  }, [user]);

  if (!user) {
    return (
      <WorkspaceLayout>
        <PageHeader eyebrow="ACCOUNT" title="Sign in required" description="Sign in to view or edit your profile." />
        <div className="panel" style={{ maxWidth: 460 }}>
          <button type="button" className="button button-primary" onClick={() => signInDemo()}>
            Continue as Demo Member
          </button>
        </div>
      </WorkspaceLayout>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, title, organization, location, bio });
    setSavedNotice('Profile changes saved.');
  };

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow={mode === 'settings' ? 'SETTINGS' : 'MY PROFILE'}
        title={mode === 'settings' ? 'Workspace preferences' : user.name}
        description={
          mode === 'settings'
            ? 'Manage appearance, theme, and account preferences.'
            : `${user.title} at ${user.organization}`
        }
      />

      {mode === 'settings' && (
        <div className="panel" style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Appearance theme</strong>
            <div style={{ fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
              Currently using {theme === 'dark' ? 'Dark umber' : 'Warm linen'} palette.
            </div>
          </div>
          <button type="button" className="button button-secondary" onClick={toggleTheme}>
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </button>
        </div>
      )}

      {savedNotice && <div className="notice notice-success">{savedNotice}</div>}

      <div className="profile-public">
        <div className="panel" style={{ textAlign: 'center' }}>
          <div className="avatar avatar-large" style={{ margin: '0 auto 12px' }}>
            {user.avatarInitials}
          </div>
          <h2 style={{ fontFamily: '"Fraunces", Georgia, serif', marginBottom: 4 }}>{user.name}</h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 6 }}>{user.title}</p>
          <span style={{ color: 'var(--ink-muted)', fontSize: '0.8rem' }}>
            {user.organization} · {user.location}
          </span>
        </div>

        <form className="panel" onSubmit={handleSave} style={{ display: 'grid', gap: 14 }}>
          <h2>Edit profile details</h2>
          <div className="form-field">
            <label htmlFor="prof-name">Full name</label>
            <input id="prof-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-field">
              <label htmlFor="prof-title">Role / Title</label>
              <input id="prof-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="prof-org">Organization</label>
              <input id="prof-org" value={organization} onChange={(e) => setOrganization(e.target.value)} />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="prof-loc">Location</label>
            <input id="prof-loc" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="prof-bio">Bio</label>
            <textarea id="prof-bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="button button-primary">
              Save profile
            </button>
          </div>
        </form>
      </div>
    </WorkspaceLayout>
  );
}

export function SupportSurveysCredentialsPage({
  view,
}: {
  view: 'support' | 'surveys' | 'certificates';
}) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (view === 'support') api.get('/support/tickets').then((r) => setTickets(r.items || []));
    if (view === 'surveys') api.get('/surveys').then((r) => setSurveys(r.items || []));
    if (view === 'certificates') api.get('/certificates').then((r) => setCerts(r.items || []));
  }, [view]);

  if (view === 'support') {
    return (
      <WorkspaceLayout>
        <PageHeader
          eyebrow="HELP DESK"
          title="Member support & chapter requests"
          description="Reach the HR Shakti community stewardship team for chapter hosting, account help, or moderation support."
        />
        <div className="panel" style={{ marginBottom: 18 }}>
          <h2 style={{ marginBottom: 12 }}>Open a support request</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await api.post('/support/tickets', { subject, category: 'Member Support', message });
              setTickets((prev) => [res.item, ...prev]);
              setSubject('');
              setMessage('');
            }}
            style={{ display: 'grid', gap: 12 }}
          >
            <input required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject…" />
            <textarea required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="button button-primary">
                Submit ticket
              </button>
            </div>
          </form>
        </div>
        <div className="panel" style={{ padding: 0 }}>
          {tickets.map((t) => (
            <div key={t.id} style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{t.subject}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{t.message}</div>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--terracotta)' }}>{t.status}</span>
            </div>
          ))}
        </div>
      </WorkspaceLayout>
    );
  }

  if (view === 'surveys') {
    return (
      <WorkspaceLayout>
        <PageHeader
          eyebrow="SURVEYS"
          title="Community benchmarks & pulse"
          description="Contribute anonymous practitioner signals to shared HR Shakti industry reports."
        />
        <div style={{ display: 'grid', gap: 16 }}>
          {surveys.map((sv) => (
            <div className="panel" key={sv.id}>
              <p className="eyebrow">{sv.responsesCount} RESPONSES</p>
              <h2>{sv.title}</h2>
              <p style={{ color: 'var(--ink-soft)' }}>{sv.description}</p>
              <button
                type="button"
                className={`button ${sv.submitted ? 'button-secondary' : 'button-primary'}`}
                disabled={sv.submitted}
                onClick={async () => {
                  const res = await api.post(`/surveys/${sv.id}/submit`);
                  setSurveys((prev) => prev.map((s) => (s.id === sv.id ? res.item : s)));
                }}
              >
                {sv.submitted ? 'Response recorded ✓' : 'Submit quick pulse'}
              </button>
            </div>
          ))}
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="CREDENTIALS"
        title="Learning certificates"
        description="Verified credentials earned through HR Shakti cohort courses."
      />
      <div className="item-grid">
        {certs.map((c) => (
          <article className="item-card" key={c.id}>
            <div className="item-card-top">
              <span className="item-glyph">
                <Award size={16} />
              </span>
              <span className="item-meta">{c.credentialId}</span>
            </div>
            <h3>{c.title}</h3>
            <p>
              Issued by {c.issuedBy} on {formatDate(c.issuedAt)}
            </p>
          </article>
        ))}
      </div>
    </WorkspaceLayout>
  );
}

export function SearchPage() {
  const { search } = useRouter();
  const q = new URLSearchParams(search).get('q') || '';
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/search?q=${encodeURIComponent(q)}`)
      .then((res) => setResults(res))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="SEARCH"
        title={q ? `Results for “${q}”` : 'Explore HR Shakti'}
        description="Matching conversations, journal essays, open roles, communities, courses, and members."
      />
      {loading ? (
        <LoadingState label="Searching across HR Shakti…" />
      ) : (
        <div style={{ display: 'grid', gap: 18 }}>
          {results?.discussions?.length > 0 && (
            <div className="panel">
              <h2 style={{ marginBottom: 10 }}>Discussions ({results.discussions.length})</h2>
              <div className="dashboard-records">
                {results.discussions.map((d: any) => (
                  <Link key={d.id} href={`/discussions/${d.id}`}>
                    <div>
                      <strong>{d.title}</strong>
                      <span>{d.communityName}</span>
                    </div>
                    <em>{d.commentCount} replies</em>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results?.jobs?.length > 0 && (
            <div className="panel">
              <h2 style={{ marginBottom: 10 }}>Open roles ({results.jobs.length})</h2>
              <div className="dashboard-records">
                {results.jobs.map((j: any) => (
                  <Link key={j.id} href="/jobs">
                    <div>
                      <strong>{j.title}</strong>
                      <span>
                        {j.company} · {j.location}
                      </span>
                    </div>
                    <em>{j.workMode}</em>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results?.blogs?.length > 0 && (
            <div className="panel">
              <h2 style={{ marginBottom: 10 }}>Journal essays ({results.blogs.length})</h2>
              <div className="dashboard-records">
                {results.blogs.map((b: any) => (
                  <Link key={b.id} href={`/blogs/${b.slug}`}>
                    <div>
                      <strong>{b.title}</strong>
                      <span>{b.authorName}</span>
                    </div>
                    <em>{b.readingTime}</em>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function StaticPublicPage({
  page,
}: {
  page: 'about' | 'contact' | 'privacy' | 'terms' | 'cookies';
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (page === 'about') {
    return (
      <PublicLayout>
        <div className="simple-public-page">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> ABOUT HR SHAKTI
          </p>
          <h1>Built for the work behind work.</h1>
          <p>
            HR Shakti (Human Resource for Skills, Harmony, Advancement, Knowledge, Talent &amp;
            Innovation) is a calm, thoughtful professional network for the practitioners shaping how
            people experience work.
          </p>
          <div className="about-principles">
            <article>
              <span>01</span>
              <h2>Practice over noise</h2>
              <p>Candid peer discussions and real field templates instead of performative feeds.</p>
            </article>
            <article>
              <span>02</span>
              <h2>Craft &amp; care together</h2>
              <p>Rigorous total rewards, hiring systems, and L&amp;D paired with human dignity.</p>
            </article>
            <article>
              <span>03</span>
              <h2>Shared generosity</h2>
              <p>Mentors, regional chapters, and open playbooks that lift the entire profession.</p>
            </article>
          </div>
          <Link href="/register" className="button button-primary">
            Join HR Shakti <ArrowRight size={16} />
          </Link>
        </div>
      </PublicLayout>
    );
  }

  if (page === 'contact') {
    return (
      <PublicLayout>
        <div className="simple-public-page">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> CONTACT
          </p>
          <h1>Get in touch with HR Shakti.</h1>
          <p>Questions about partnerships, regional chapters, or community stewardship? Send us a note.</p>
          <div className="panel" style={{ maxWidth: 620, marginTop: 24 }}>
            {sent ? (
              <div className="notice notice-success">
                Thank you for reaching out. Our community team will respond shortly.
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await api.post('/contact', { name, email, message });
                  setSent(true);
                }}
                style={{ display: 'grid', gap: 14 }}
              >
                <div className="form-field">
                  <label htmlFor="c-name">Your name</label>
                  <input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="c-email">Email</label>
                  <input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="c-msg">Message</label>
                  <textarea id="c-msg" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <button type="submit" className="button button-primary">
                  Send message <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </PublicLayout>
    );
  }

  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Community',
    cookies: 'Cookie Preferences',
  };

  return (
    <PublicLayout>
      <div className="simple-public-page">
        <p className="eyebrow">
          <span className="eyebrow-dot" /> HR SHAKTI GOVERNANCE
        </p>
        <h1>{titles[page]}</h1>
        <p>
          HR Shakti respects member privacy, treats peer conversations with care, and never sells
          member directory data to third-party brokers. Session cookies are used solely to maintain
          authentication and saved theme preferences.
        </p>
        <Link href="/" className="button button-secondary" style={{ marginTop: 20 }}>
          Return home
        </Link>
      </div>
    </PublicLayout>
  );
}
