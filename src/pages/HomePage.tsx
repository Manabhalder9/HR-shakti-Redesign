import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Calendar,
  Compass,
  MessageSquare,
  Users,
} from 'lucide-react';
import { Link } from '../context/RouterContext';
import { useTheme } from '../context/ThemeContext';
import { api, excerptText, formatDate } from '../lib/api';
import { PublicLayout } from '../components/PublicLayout';

interface StatsData {
  totalMembers: number;
  openRoles: number;
  publicCommunities: number;
  conversations: number;
  publishedCourses: number;
}

export function HomePage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get('/news?limit=3'),
      api.get('/users/public-stats'),
      api.get('/discussions?kind=discussion&limit=4'),
      api.get('/blogs/posts?limit=3'),
      api.get('/jobs?limit=2'),
      api.get('/communities?limit=2'),
      api.get('/learning/courses?limit=2'),
      api.get('/events?limit=2'),
    ])
      .then(([n, st, d, b, j, c, crs, ev]) => {
        if (!active) return;
        setNews(n.items || []);
        setStats(st);
        setDiscussions(d.items || []);
        setBlogs(b.items || []);
        setJobs(j.items || []);
        setCommunities(c.items || []);
        setCourses(crs.items || []);
        setEvents(ev.items || []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const statRows = [
    { label: 'Open roles', note: 'Published job listings', value: stats?.openRoles },
    { label: 'Members', note: 'People building better work', value: stats?.totalMembers },
    { label: 'Public communities', note: 'Active spaces to join', value: stats?.publicCommunities },
    { label: 'Conversations', note: 'Discussions shaping work', value: stats?.conversations },
    { label: 'Published courses', note: 'Courses available to explore', value: stats?.publishedCourses },
  ];

  return (
    <PublicLayout>
      {/* 1. Hero Section */}
      <section className="hero-wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> FOR PEOPLE WHO MAKE WORK BETTER
          </p>
          <h1>
            A better kind of work begins <em>together.</em>
          </h1>
          <p className="hero-intro">
            A professional home for the people behind people. Find trusted peers, practical ideas,
            and opportunities to grow your impact.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="button button-primary">
              Find your people <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/communities" className="button button-secondary">
              Explore the network
            </Link>
          </div>
          <div className="hero-note">
            <span className="hero-note-rule" />
            <span>Built for the work behind work.</span>
          </div>
        </div>

        <div className="hero-visual" data-active-theme={theme}>
          <img
            src="/assets/aistudio/Light_Theme_Hero_Image_31a45a5e.png"
            alt={
              theme === 'light'
                ? 'HR Shakti platform interface preview showing HR dashboard analytics, active vacancies, talent matrix, and AI advisor in light mode'
                : ''
            }
            aria-hidden={theme !== 'light'}
            className="hero-image hero-image-light"
            width={2752}
            height={1536}
            loading="eager"
            decoding={theme === 'light' ? 'sync' : 'async'}
            fetchPriority={theme === 'light' ? 'high' : 'low'}
          />
          <img
            src="/assets/aistudio/Dark_Theme_Hero_Image_3f99ee77.png"
            alt={
              theme === 'dark'
                ? 'HR Shakti platform interface preview showing HR dashboard analytics, active vacancies, talent matrix, and AI advisor in dark mode'
                : ''
            }
            aria-hidden={theme !== 'dark'}
            className="hero-image hero-image-dark"
            width={2752}
            height={1536}
            loading="eager"
            decoding={theme === 'dark' ? 'sync' : 'async'}
            fetchPriority={theme === 'dark' ? 'high' : 'low'}
          />
        </div>
      </section>

      {/* 2. Terracotta Editorial Intro Band */}
      <section className="home-intro">
        <div>
          <p className="eyebrow">A PEOPLE-FIRST PROFESSIONAL NETWORK</p>
          <h2>Good work grows when good people find each other.</h2>
        </div>
        <div>
          <p>
            HR Shakti brings the practice of people work into one thoughtful place: learn from peers,
            build your craft, find opportunities, and take part in the conversations shaping work.
          </p>
          <p className="brand-expansion">
            Human Resource for Skills, Harmony, Advancement, Knowledge, Talent &amp; Innovation
          </p>
        </div>
      </section>

      {/* 3. People & Work Briefing (News) */}
      <section className="home-news" aria-labelledby="home-news-title">
        <div className="home-news-heading">
          <div>
            <p className="eyebrow">THE PEOPLE &amp; WORK BRIEFING</p>
            <h2 id="home-news-title">The stories shaping the world of work.</h2>
            <p>Fresh reporting from HR publications, with every story credited to its source.</p>
          </div>
          <Link href="/news">
            Explore all HR news <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="home-news-grid" role="status" aria-label="Loading HR news">
            <div className="home-news-skeleton" />
            <div className="home-news-skeleton" />
            <div className="home-news-skeleton" />
          </div>
        ) : (
          <div className="home-news-grid">
            {news.slice(0, 3).map((item, idx) => (
              <article className="home-news-story" key={item.id}>
                <p className="home-news-meta">
                  <span>{idx === 0 ? '01 / EDITOR’S PICK' : `0${idx + 1} / HR BRIEFING`}</span>
                  {item.publishedAt && <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>}
                </p>
                <h3>
                  <Link href="/news">{item.title}</Link>
                </h3>
                {idx === 0 && item.description && (
                  <p className="home-news-summary">{excerptText(item.description, 230)}</p>
                )}
                <Link className="home-news-source" href="/news">
                  Read at {item.source} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. Live Network Statistics */}
      <section className="home-statistics" aria-label="HR Shakti platform statistics">
        <div className="home-stats-heading">
          <p className="eyebrow">A LIVE VIEW OF THE NETWORK</p>
          <h2>Real opportunities. Real community.</h2>
        </div>

        <dl className="home-stats-grid">
          {statRows.map((row) => (
            <div className="home-stat" key={row.label}>
              <dt>{row.label}</dt>
              <dd>
                {loading || row.value === undefined ? (
                  <span className="stat-loading" role="status" aria-label="Loading count" />
                ) : (
                  new Intl.NumberFormat().format(row.value)
                )}
              </dd>
              <dd className="home-stat-note">{row.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 5. Pathways Section */}
      <section className="pathways-section">
        <div className="pathways-heading">
          <p className="eyebrow">MAKE YOUR NEXT MOVE</p>
          <h2>Choose a path. Find your pace.</h2>
          <p>Start where you are. Follow the thread that matters to your work.</p>
        </div>

        <div className="pathways-grid">
          <Link className="pathway pathway-communities" href="/communities">
            <span className="pathway-number">01 / CONNECT</span>
            <Users size={24} aria-hidden="true" />
            <h3>Find your circle</h3>
            <p>Exchange hard-won insight with people who understand the work.</p>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>

          <Link className="pathway pathway-learning" href="/learning">
            <span className="pathway-number">02 / LEARN</span>
            <BookOpen size={25} aria-hidden="true" />
            <h3>Build your practice</h3>
            <p>Explore courses and learning paths made for your next chapter.</p>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>

          <Link className="pathway pathway-careers" href="/career">
            <span className="pathway-number">03 / ADVANCE</span>
            <Compass size={24} aria-hidden="true" />
            <h3>Move your career</h3>
            <p>Explore your next role and the capabilities that help you get there.</p>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>

          <Link className="pathway pathway-events" href="/events">
            <span className="pathway-number">04 / GATHER</span>
            <Calendar size={24} aria-hidden="true" />
            <h3>Be in the room</h3>
            <p>Meet peers and hear new perspectives at upcoming events.</p>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>

          <Link className="pathway pathway-conversations" href="/discussions">
            <span className="pathway-number">05 / SHARE</span>
            <MessageSquare size={24} aria-hidden="true" />
            <h3>Trade practical ideas</h3>
            <p>Bring real questions to people who have worked through them.</p>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>

          <Link className="pathway pathway-mentorship" href="/mentorship">
            <span className="pathway-number">06 / CONNECT</span>
            <Briefcase size={24} aria-hidden="true" />
            <h3>Find a sounding board</h3>
            <p>Learn with mentors and peers who understand your next step.</p>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 6. Community Pulse & HR Shakti Journal */}
      <section className="home-stories">
        <div className="home-story-column home-discussions">
          <div className="home-story-heading">
            <div>
              <p className="eyebrow">COMMUNITY PULSE</p>
              <h2>Questions worth answering.</h2>
            </div>
            <Link href="/discussions">
              All discussions <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="discussion-stories">
            {discussions.slice(0, 3).map((d) => (
              <Link className="discussion-story" key={d.id} href={`/discussions/${d.id}`}>
                <span className="discussion-story-mark">
                  <MessageSquare size={17} aria-hidden="true" />
                </span>
                <div>
                  <h3>{d.title}</h3>
                  <p>{excerptText(d.content, 170)}</p>
                  <span className="discussion-byline">
                    {d.authorName} · {d.communityName} · {formatDate(d.createdAt)}
                  </span>
                  {d.tags?.length > 0 && (
                    <span className="discussion-tags">
                      {d.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </span>
                  )}
                </div>
                <span className="discussion-replies">
                  {d.commentCount}
                  <small>replies</small>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="home-story-column home-knowledge">
          <div className="home-story-heading">
            <div>
              <p className="eyebrow">THE HR SHAKTI JOURNAL</p>
              <h2>Ideas for the work behind work.</h2>
            </div>
            <Link href="/blogs">
              All articles <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="knowledge-stories">
            {blogs.slice(0, 3).map((b, idx) => (
              <Link
                key={b.id}
                className={`knowledge-story${idx === 0 ? ' knowledge-featured' : ''}`}
                href={`/blogs/${b.slug}`}
              >
                {b.coverImage && (
                  <img
                    src={b.coverImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="knowledge-story-copy">
                  <p className="knowledge-meta">
                    {b.category} · {formatDate(b.publishedAt)}
                  </p>
                  <h3>{b.title}</h3>
                  {idx === 0 && b.excerpt && (
                    <p className="knowledge-excerpt">{excerptText(b.excerpt, 190)}</p>
                  )}
                  <span className="knowledge-author">
                    {b.authorName} · {b.readingTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Live Preview (4 Columns) */}
      <section className="live-preview">
        <div className="preview-heading">
          <div>
            <p className="eyebrow">FROM THE HR SHAKTI NETWORK</p>
            <h2>See what is taking shape.</h2>
            <p>Live listings from the HR Shakti community platform.</p>
          </div>
          <Link href="/feed">
            Visit your feed <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="preview-columns">
          <div>
            <div className="section-title">
              <h2>Open roles</h2>
              <Link href="/jobs">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="item-grid">
              {jobs.slice(0, 2).map((job) => (
                <Link className="item-card item-job" key={job.id} href="/jobs">
                  <div className="item-card-top">
                    <span className="item-glyph">
                      <Briefcase size={16} />
                    </span>
                    <span className="item-meta">{job.workMode}</span>
                  </div>
                  <h3>{job.title}</h3>
                  <p>{job.company} · {job.location}</p>
                  <span className="item-open">
                    View role <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="section-title">
              <h2>Communities</h2>
              <Link href="/communities">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="item-grid">
              {communities.slice(0, 2).map((c) => (
                <Link className="item-card item-community" key={c.id} href="/communities">
                  <div className="item-card-top">
                    <span className="item-glyph glyph-community">
                      <Users size={16} />
                    </span>
                    <span className="item-meta">{c.memberCount.toLocaleString()} members</span>
                  </div>
                  <h3>{c.name}</h3>
                  <p>{c.description}</p>
                  <span className="item-open">
                    Explore circle <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="section-title">
              <h2>Learning</h2>
              <Link href="/learning">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="item-grid">
              {courses.slice(0, 2).map((course) => (
                <Link className="item-card item-course" key={course.id} href="/learning">
                  <div className="item-card-top">
                    <span className="item-glyph glyph-course">
                      <BookOpen size={16} />
                    </span>
                    <span className="item-meta">{course.level}</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <span className="item-open">
                    View course <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="section-title">
              <h2>Events</h2>
              <Link href="/events">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="item-grid">
              {events.slice(0, 2).map((ev) => (
                <Link className="item-card item-event" key={ev.id} href="/events">
                  <div className="item-card-top">
                    <span className="item-glyph glyph-event">
                      <Calendar size={16} />
                    </span>
                    <span className="item-meta">{formatDate(ev.date)}</span>
                  </div>
                  <h3>{ev.title}</h3>
                  <p>{ev.description}</p>
                  <span className="item-open">
                    See event <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Closing Band */}
      <section className="closing-band">
        <div>
          <p className="eyebrow">THE NEXT GOOD CONVERSATION STARTS HERE</p>
          <h2>
            Your work matters.
            <br />
            Let’s make it matter more.
          </h2>
        </div>
        <Link href="/register" className="button button-primary">
          Join HR Shakti <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <span className="closing-mark" aria-hidden="true">
          H
        </span>
      </section>
    </PublicLayout>
  );
}
