import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Compass,
  Newspaper,
  Users,
} from 'lucide-react';
import {
  EmptyState,
  LoadingState,
  PageHeader,
  WorkspaceLayout,
} from '../components/WorkspaceLayout';
import { useAuth } from '../context/AuthContext';
import { Link } from '../context/RouterContext';
import { api, formatDate } from '../lib/api';

export function JobsPage() {
  const { savedIds, toggleSave } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState('All');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    Promise.all([api.get('/jobs'), api.get('/jobs/applications/mine')])
      .then(([j, a]) => {
        setJobs(j.items || []);
        setAppliedIds((a.items || []).map((app: any) => app.jobId));
      })
      .finally(() => setLoading(false));
  }, []);

  const applyToJob = async (job: any) => {
    await api.post(`/jobs/${job.id}/apply`);
    setAppliedIds((prev) => (prev.includes(job.id) ? prev : [...prev, job.id]));
    setNotice(`Application submitted for ${job.title} at ${job.company}.`);
  };

  const visibleJobs =
    filterMode === 'All' ? jobs : jobs.filter((j) => j.workMode.toLowerCase().includes(filterMode.toLowerCase()));

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="CAREER & ROLES"
        title="Open roles in people work"
        description="Published HRBP, Talent Acquisition, Total Rewards, and L&D opportunities from trusted organizations."
        action={
          <Link href="/applications" className="button button-secondary">
            My applications ({appliedIds.length})
          </Link>
        }
      />

      {notice && <div className="notice notice-success">{notice}</div>}

      <div className="feed-toolbar">
        <div className="feed-tabs">
          {['All', 'Hybrid', 'Remote'].map((mode) => (
            <button
              key={mode}
              type="button"
              className={filterMode === mode ? 'active' : ''}
              onClick={() => setFilterMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading open roles…" />
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {visibleJobs.map((job) => {
            const isApplied = appliedIds.includes(job.id);
            const isSaved = savedIds.includes(job.id);
            return (
              <article className="panel" key={job.id} style={{ borderTop: '3px solid var(--terracotta)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <p className="eyebrow" style={{ marginBottom: 6 }}>
                      {job.company} · {job.workMode}
                    </p>
                    <h2 style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: '1.35rem', marginBottom: 6 }}>
                      {job.title}
                    </h2>
                    <p style={{ color: 'var(--ink-muted)', fontSize: '0.84rem', marginBottom: 10 }}>
                      {job.location} · {job.experience} · {job.salary}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => toggleSave(job.id)}
                    >
                      <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button
                      type="button"
                      className={`button ${isApplied ? 'button-secondary' : 'button-primary'}`}
                      disabled={isApplied}
                      onClick={() => applyToJob(job)}
                    >
                      {isApplied ? (
                        <>
                          <Check size={15} /> Applied
                        </>
                      ) : (
                        'Apply now'
                      )}
                    </button>
                  </div>
                </div>
                <p style={{ color: 'var(--ink-soft)', marginBottom: 10 }}>{job.description}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                  Key focus: {(job.requirements || []).join(' · ')}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/jobs/applications/mine')
      .then((res) => setApps(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="APPLICATIONS"
        title="My role applications"
        description="Track every open role you have applied to across HR Shakti."
        action={
          <Link href="/jobs" className="button button-primary">
            Browse open roles <ArrowRight size={15} />
          </Link>
        }
      />

      {loading ? (
        <LoadingState />
      ) : apps.length === 0 ? (
        <EmptyState
          title="No applications submitted yet"
          description="Explore open HR and People Ops roles to apply."
          action={
            <Link href="/jobs" className="button button-primary">
              Explore roles
            </Link>
          }
        />
      ) : (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          {apps.map((app) => (
            <div
              key={app.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '1rem' }}>{app.jobTitle}</strong>
                <span style={{ color: 'var(--ink-muted)', fontSize: '0.82rem' }}>
                  {app.company} · Applied {formatDate(app.appliedAt)}
                </span>
              </div>
              <span
                style={{
                  padding: '4px 10px',
                  background: 'var(--surface-saffron)',
                  color: 'var(--walnut)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function CareerPathsPage() {
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/career/paths')
      .then((res) => setPaths(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="CAREER PATHS"
        title="Map your next chapter in people work"
        description="Structured capability transitions across HR Business Partnering, Talent Craft, and Total Rewards."
      />
      {loading ? (
        <LoadingState />
      ) : (
        <div className="item-grid">
          {paths.map((cp) => (
            <article className="item-card" key={cp.id}>
              <div className="item-card-top">
                <span className="item-glyph">
                  <Compass size={16} />
                </span>
                <span className="item-meta">{cp.horizon}</span>
              </div>
              <h3>{cp.title}</h3>
              <p>{cp.focus}</p>
              <ul style={{ margin: '0 0 14px', paddingLeft: 18, color: 'var(--ink-soft)', fontSize: '0.8rem' }}>
                {cp.steps.map((s: string) => (
                  <li key={s} style={{ marginBottom: 4 }}>
                    {s}
                  </li>
                ))}
              </ul>
              <Link href="/learning" className="item-open">
                Explore matching courses <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function OrganizationsPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/organizations')
      .then((res) => setOrgs(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="ORGANIZATIONS"
        title="Workplaces building in the open"
        description="Discover companies sharing their people practices, compensation philosophy, and open opportunities."
      />
      {loading ? (
        <LoadingState />
      ) : (
        <div className="item-grid">
          {orgs.map((org) => (
            <article className="item-card" key={org.id}>
              <div className="item-card-top">
                <span className="item-glyph">
                  <Building2 size={16} />
                </span>
                <span className="item-meta">
                  {org.industry} · {org.size}
                </span>
              </div>
              <h3>{org.name}</h3>
              <p>{org.description}</p>
              <Link href="/jobs" className="item-open">
                {org.openRoles} open roles <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function LearningPage({ section = 'courses' }: { section?: 'courses' | 'paths' | 'hub' }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/learning/courses')
      .then((res) => setCourses(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  const toggleEnroll = async (id: string) => {
    const res = await api.post(`/learning/courses/${id}/enroll`);
    setCourses((prev) => prev.map((c) => (c.id === id ? res.item : c)));
  };

  const titleBySection = {
    courses: {
      eyebrow: 'LEARNING LIBRARY',
      title: 'Courses built for people practitioners',
      description: 'Cohort-tested modules on compensation architecture, strategic HRBP craft, structured hiring, and workplace governance.',
    },
    paths: {
      eyebrow: 'LEARNING PATHS',
      title: 'Follow a structured curriculum',
      description: 'Curated sequences combining courses, field guides, and peer case circles.',
    },
    hub: {
      eyebrow: 'KNOWLEDGE HUB',
      title: 'Practical playbooks & templates',
      description: 'Field-tested frameworks for onboarding, performance calibration, and transparent pay conversations.',
    },
  }[section];

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow={titleBySection.eyebrow}
        title={titleBySection.title}
        description={titleBySection.description}
        action={
          <Link href="/certificates" className="button button-secondary">
            My credentials
          </Link>
        }
      />

      {loading ? (
        <LoadingState label="Loading learning library…" />
      ) : (
        <div className="item-grid">
          {courses.map((course) => (
            <article className="item-card item-course" key={course.id}>
              <div className="item-card-top">
                <span className="item-glyph glyph-course">
                  <BookOpen size={16} />
                </span>
                <span className="item-meta">
                  {course.level} · {course.duration}
                </span>
              </div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div style={{ fontSize: '0.76rem', color: 'var(--ink-muted)', marginBottom: 12 }}>
                Led by {course.instructor}
                {course.enrolled ? ` · ${course.progress}% complete` : ''}
              </div>
              <button
                type="button"
                className={`button ${course.enrolled ? 'button-secondary' : 'button-primary'}`}
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => toggleEnroll(course.id)}
              >
                {course.enrolled ? 'Enrolled · Continue' : 'Enroll in course'}
              </button>
            </article>
          ))}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function BlogsPage() {
  const { savedIds, toggleSave } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/blogs/posts')
      .then((res) => setPosts(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="THE HR SHAKTI JOURNAL"
        title="Ideas for the work behind work"
        description="Long-form essays, playbooks, and candid lessons from practitioners across people operations."
      />

      {loading ? (
        <LoadingState label="Loading journal articles…" />
      ) : (
        <div className="item-grid">
          {posts.map((post) => {
            const isSaved = savedIds.includes(post.id);
            return (
              <article className="item-card" key={post.id}>
                {post.coverImage && (
                  <img
                    className="item-card-image"
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="item-card-top">
                  <span className="item-meta" style={{ color: 'var(--terracotta)' }}>
                    {post.category}
                  </span>
                  <span className="item-meta">{post.readingTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                  }}
                >
                  <button
                    type="button"
                    className="button button-quiet"
                    onClick={() => toggleSave(post.id)}
                  >
                    <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <Link href={`/blogs/${post.slug}`} className="item-open">
                    Read essay <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function BlogDetailPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/blogs/posts/${encodeURIComponent(slug)}`)
      .then((res) => setPost(res.item))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <WorkspaceLayout>
      <div style={{ marginBottom: 14 }}>
        <Link href="/blogs" style={{ fontSize: '0.84rem', fontWeight: 700 }}>
          ← Back to HR Shakti Journal
        </Link>
      </div>
      {loading ? (
        <LoadingState />
      ) : !post ? (
        <EmptyState title="Article not found" description="Try browsing the full journal archive." />
      ) : (
        <article className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }}
              referrerPolicy="no-referrer"
            />
          )}
          <div style={{ padding: '28px 30px' }}>
            <p className="eyebrow">
              {post.category} · {formatDate(post.publishedAt)} · {post.readingTime}
            </p>
            <h1 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)', marginBottom: 12 }}>
              {post.title}
            </h1>
            <p style={{ color: 'var(--ink-muted)', marginBottom: 24 }}>
              By <strong>{post.authorName}</strong> — {post.authorTitle}
            </p>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1.02rem', color: 'var(--ink)' }}>
              {post.content}
            </div>
          </div>
        </article>
      )}
    </WorkspaceLayout>
  );
}

export function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/news')
      .then((res) => setNews(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="THE PEOPLE & WORK BRIEFING"
        title="News shaping the world of work"
        description="Curated reporting from HR publications and policy briefings, attributed to their original sources."
      />
      {loading ? (
        <LoadingState />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {news.map((item) => (
            <article className="home-news-story" key={item.id}>
              <p className="home-news-meta">
                <span>
                  {item.category} · {item.source}
                </span>
                <time>{formatDate(item.publishedAt)}</time>
              </p>
              <h3>{item.title}</h3>
              <p className="home-news-summary">{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function EventsPage({ mineOnly = false }: { mineOnly?: boolean }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/events')
      .then((res) => setEvents(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  const toggleRegister = async (id: string) => {
    const res = await api.post(`/events/${id}/register`);
    setEvents((prev) => prev.map((e) => (e.id === id ? res.item : e)));
  };

  const visible = mineOnly ? events.filter((e) => e.registered) : events;

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow={mineOnly ? 'MY EVENTS' : 'EVENTS & ROUNDTABLES'}
        title={mineOnly ? 'Your registered gatherings' : 'Be in the room'}
        description="Interactive peer roundtables, regional HR salons, and live compensation clinics."
        action={
          <Link href={mineOnly ? '/events' : '/my-events'} className="button button-secondary">
            {mineOnly ? 'All events' : 'My registrations'}
          </Link>
        }
      />

      {loading ? (
        <LoadingState />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No registered events yet"
          description="Browse upcoming HR Shakti roundtables and reserve your seat."
          action={
            <Link href="/events" className="button button-primary">
              Browse events
            </Link>
          }
        />
      ) : (
        <div className="item-grid">
          {visible.map((ev) => (
            <article className="item-card item-event" key={ev.id}>
              <div className="item-card-top">
                <span className="item-glyph glyph-event">
                  <Calendar size={16} />
                </span>
                <span className="item-meta">
                  {formatDate(ev.date)} · {ev.seatsLeft} seats left
                </span>
              </div>
              <h3>{ev.title}</h3>
              <p>{ev.description}</p>
              <div style={{ fontSize: '0.76rem', color: 'var(--ink-muted)', marginBottom: 14 }}>
                {ev.time} · {ev.location}
              </div>
              <button
                type="button"
                className={`button ${ev.registered ? 'button-secondary' : 'button-primary'}`}
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => toggleRegister(ev.id)}
              >
                {ev.registered ? (
                  <>
                    <Check size={15} /> Registered
                  </>
                ) : (
                  'Reserve a seat'
                )}
              </button>
            </article>
          ))}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function MentorshipPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/mentorship')
      .then((res) => setMentors(res.mentors || []))
      .finally(() => setLoading(false));
  }, []);

  const toggleRequest = async (id: string) => {
    const res = await api.post(`/mentorship/${id}/request`);
    setMentors((prev) => prev.map((m) => (m.id === id ? res.item : m)));
  };

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="MENTORSHIP"
        title="Find a sounding board"
        description="Connect 1:1 with experienced HR leaders who have built through the challenges ahead of you."
      />
      {loading ? (
        <LoadingState />
      ) : (
        <div className="item-grid">
          {mentors.map((mentor) => (
            <article className="item-card" key={mentor.id}>
              <div className="item-card-top">
                <span className="item-glyph">
                  <Users size={16} />
                </span>
                <span className="item-meta">{mentor.availability}</span>
              </div>
              <h3>{mentor.name}</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--terracotta)', fontWeight: 700, marginBottom: 8 }}>
                {mentor.role}
              </div>
              <p>{mentor.bio}</p>
              <div style={{ fontSize: '0.74rem', color: 'var(--ink-muted)', marginBottom: 14 }}>
                Topics: {mentor.topics.join(' · ')}
              </div>
              <button
                type="button"
                className={`button ${mentor.requested ? 'button-secondary' : 'button-primary'}`}
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => toggleRequest(mentor.id)}
              >
                {mentor.requested ? 'Request sent ✓' : 'Request mentorship session'}
              </button>
            </article>
          ))}
        </div>
      )}
    </WorkspaceLayout>
  );
}
