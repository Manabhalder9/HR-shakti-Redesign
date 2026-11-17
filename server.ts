import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express, { type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { createInitialStore } from './server/seedData.js';

const store = createInitialStore();
const sessions = new Map<string, string>(); // token -> userId

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};
  const result: Record<string, string> = {};
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k) result[k] = decodeURIComponent(rest.join('='));
  }
  return result;
}

function getSessionUser(req: Request) {
  const auth = req.headers.authorization;
  let token = '';
  if (auth && auth.startsWith('Bearer ')) {
    token = auth.slice(7).trim();
  } else {
    token = parseCookies(req).hrshakti_session || '';
  }
  if (!token) return null;
  const userId = sessions.get(token);
  if (!userId) return null;
  return store.users.find((u) => u.id === userId) || null;
}

function sanitizeUser(u: (typeof store.users)[number]) {
  const { password: _pw, ...safe } = u;
  return safe;
}

function createSessionFor(res: Response, userId: string) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, userId);
  res.cookie('hrshakti_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'hrshakti' });
  });

  // Public network statistics
  app.get('/api/users/public-stats', (_req, res) => {
    res.json({
      totalMembers: store.publicStatsOffsets.totalMembers + store.users.length,
      openRoles: store.publicStatsOffsets.openRoles + store.jobs.length,
      publicCommunities: store.publicStatsOffsets.publicCommunities + store.communities.length,
      conversations: store.publicStatsOffsets.conversations + store.discussions.length,
      publishedCourses: store.publicStatsOffsets.publishedCourses + store.courses.length,
    });
  });

  // Auth
  app.get('/api/auth/me', (req, res) => {
    const user = getSessionUser(req);
    if (!user) {
      return res.json({ user: null });
    }
    res.json({ user: sanitizeUser(user) });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both your email and password.' });
    }
    const found = store.users.find(
      (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
    );
    if (!found || (found.password && found.password !== password)) {
      return res.status(401).json({ error: 'Invalid email or password. Try the demo member sign-in below.' });
    }
    const token = createSessionFor(res, found.id);
    res.json({ accessToken: token, user: sanitizeUser(found) });
  });

  app.post('/api/auth/demo', (_req, res) => {
    const demo = store.users.find((u) => u.id === 'u-demo') || store.users[0];
    const token = createSessionFor(res, demo.id);
    res.json({ accessToken: token, user: sanitizeUser(demo) });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, title, organization } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const exists = store.users.some(
      (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
    );
    if (exists) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in instead.' });
    }
    const cleanName = String(name).trim();
    const parts = cleanName.split(/\s+/);
    const initials = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'HR';
    const newUser = {
      id: `u-${Date.now()}`,
      name: cleanName,
      email: String(email).trim().toLowerCase(),
      password: String(password),
      role: 'member' as const,
      title: String(title || 'People & HR Practitioner').trim(),
      organization: String(organization || 'Independent Practice').trim(),
      location: 'India',
      bio: 'Joined HR Shakti to learn with peers and build thoughtful workplaces.',
      skills: ['People Operations', 'Workplace Culture'],
      avatarInitials: initials,
      followers: 1,
      following: 3,
    };
    store.users.push(newUser);
    const token = createSessionFor(res, newUser.id);
    res.status(201).json({ accessToken: token, user: sanitizeUser(newUser) });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = parseCookies(req).hrshakti_session;
    if (token) sessions.delete(token);
    res.clearCookie('hrshakti_session', { path: '/' });
    res.json({ ok: true });
  });

  app.patch('/api/auth/profile', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Please sign in first.' });
    const { name, title, organization, location, bio, skills } = req.body || {};
    if (name) user.name = String(name).trim();
    if (title !== undefined) user.title = String(title).trim();
    if (organization !== undefined) user.organization = String(organization).trim();
    if (location !== undefined) user.location = String(location).trim();
    if (bio !== undefined) user.bio = String(bio).trim();
    if (Array.isArray(skills)) user.skills = skills.map((s) => String(s).trim()).filter(Boolean);
    res.json({ user: sanitizeUser(user) });
  });

  // News & Blogs
  app.get('/api/news', (req, res) => {
    const limit = Number(req.query.limit) || 20;
    res.json({ items: store.news.slice(0, limit), total: store.news.length });
  });

  app.get('/api/blogs/posts', (req, res) => {
    const limit = Number(req.query.limit) || 20;
    res.json({ items: store.blogs.slice(0, limit), total: store.blogs.length });
  });

  app.get('/api/blogs/posts/:slug', (req, res) => {
    const post = store.blogs.find((b) => b.slug === req.params.slug || b.id === req.params.slug);
    if (!post) return res.status(404).json({ error: 'Article not found.' });
    res.json({ item: post });
  });

  // Discussions & Questions
  app.get('/api/discussions', (req, res) => {
    const kind = req.query.kind ? String(req.query.kind) : '';
    const limit = Number(req.query.limit) || 50;
    const list = kind ? store.discussions.filter((d) => d.kind === kind) : store.discussions;
    res.json({ items: list.slice(0, limit), total: list.length });
  });

  app.get('/api/discussions/:id', (req, res) => {
    const item = store.discussions.find((d) => d.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Conversation not found.' });
    res.json({ item });
  });

  app.post('/api/discussions', (req, res) => {
    const user = getSessionUser(req) || store.users[0];
    const { title, content, communityId, tags, kind, pollQuestion, pollOptions } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ error: 'Please include both a headline and details.' });
    }
    const community = store.communities.find((c) => c.id === communityId) || store.communities[0];
    const cleanOptions = Array.isArray(pollOptions)
      ? pollOptions.map((o) => String(o).trim()).filter(Boolean)
      : [];
    const newItem = {
      id: `${kind === 'question' ? 'q' : 'd'}-${Date.now()}`,
      kind: (kind === 'question' ? 'question' : 'discussion') as 'discussion' | 'question',
      title: String(title).trim(),
      content: String(content).trim(),
      authorId: user.id,
      authorName: user.name,
      authorTitle: `${user.title} · ${user.organization}`,
      communityId: community.id,
      communityName: community.name,
      tags: Array.isArray(tags) && tags.length ? tags : ['Practice', 'People Ops'],
      commentCount: 0,
      likes: 1,
      likedByMe: true,
      createdAt: new Date().toISOString(),
      reason: `Shared in ${community.name}`,
      ...(pollQuestion && cleanOptions.length >= 2
        ? {
            poll: {
              question: String(pollQuestion).trim(),
              totalVotes: 0,
              options: cleanOptions.map((label, idx) => ({
                id: `po-${Date.now()}-${idx}`,
                label,
                votes: 0,
              })),
            },
          }
        : {}),
      replies: [],
    };
    store.discussions.unshift(newItem);
    res.status(201).json({ item: newItem });
  });

  app.post('/api/discussions/:id/replies', (req, res) => {
    const user = getSessionUser(req) || store.users[0];
    const item = store.discussions.find((d) => d.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Conversation not found.' });
    const { content } = req.body || {};
    if (!content || !String(content).trim()) {
      return res.status(400).json({ error: 'Please write a response before posting.' });
    }
    const reply = {
      id: `r-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorTitle: user.title,
      content: String(content).trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    item.replies.push(reply);
    item.commentCount += 1;
    res.status(201).json({ reply, item });
  });

  app.post('/api/discussions/:id/like', (req, res) => {
    const item = store.discussions.find((d) => d.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Conversation not found.' });
    item.likedByMe = !item.likedByMe;
    item.likes += item.likedByMe ? 1 : -1;
    res.json({ item });
  });

  app.post('/api/discussions/:id/vote', (req, res) => {
    const item = store.discussions.find((d) => d.id === req.params.id);
    if (!item || !item.poll) return res.status(404).json({ error: 'Poll not found.' });
    const { optionId } = req.body || {};
    const opt = item.poll.options.find((o) => o.id === optionId);
    if (!opt) return res.status(400).json({ error: 'Invalid poll option.' });
    if (item.poll.votedOptionId) {
      const prev = item.poll.options.find((o) => o.id === item.poll!.votedOptionId);
      if (prev && prev.votes > 0) prev.votes -= 1;
    } else {
      item.poll.totalVotes += 1;
    }
    opt.votes += 1;
    item.poll.votedOptionId = opt.id;
    res.json({ item });
  });

  // Communities
  app.get('/api/communities', (req, res) => {
    const limit = Number(req.query.limit) || 50;
    res.json({ items: store.communities.slice(0, limit), total: store.communities.length });
  });

  app.post('/api/communities/:id/toggle-join', (req, res) => {
    const item = store.communities.find((c) => c.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Community not found.' });
    item.joined = !item.joined;
    item.memberCount += item.joined ? 1 : -1;
    res.json({ item });
  });

  // Jobs & Applications
  app.get('/api/jobs', (req, res) => {
    const limit = Number(req.query.limit) || 50;
    res.json({ items: store.jobs.slice(0, limit), total: store.jobs.length });
  });

  app.get('/api/jobs/applications/mine', (_req, res) => {
    res.json({ items: store.applications, total: store.applications.length });
  });

  app.post('/api/jobs/:id/apply', (req, res) => {
    const job = store.jobs.find((j) => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: 'Role not found.' });
    const existing = store.applications.find((a) => a.jobId === job.id);
    if (existing) {
      return res.json({ application: existing, alreadyApplied: true });
    }
    const appRecord = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toISOString().slice(0, 10),
      status: 'Submitted',
    };
    store.applications.unshift(appRecord);
    res.status(201).json({ application: appRecord });
  });

  // Learning
  app.get('/api/learning/courses', (req, res) => {
    const limit = Number(req.query.limit) || 50;
    res.json({ items: store.courses.slice(0, limit), total: store.courses.length });
  });

  app.post('/api/learning/courses/:id/enroll', (req, res) => {
    const course = store.courses.find((c) => c.id === req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    course.enrolled = !course.enrolled;
    course.progress = course.enrolled ? Math.max(course.progress || 10, 10) : 0;
    res.json({ item: course });
  });

  // Events
  app.get('/api/events', (req, res) => {
    const limit = Number(req.query.limit) || 50;
    res.json({ items: store.events.slice(0, limit), total: store.events.length });
  });

  app.get('/api/events/my-registrations', (_req, res) => {
    const mine = store.events.filter((e) => e.registered);
    res.json({ items: mine, total: mine.length });
  });

  app.post('/api/events/:id/register', (req, res) => {
    const ev = store.events.find((e) => e.id === req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found.' });
    ev.registered = !ev.registered;
    ev.seatsLeft += ev.registered ? -1 : 1;
    res.json({ item: ev });
  });

  // Career, Organizations, Mentorship, People
  app.get('/api/career/paths', (_req, res) => {
    res.json({ items: store.careerPaths, total: store.careerPaths.length });
  });

  app.get('/api/organizations', (_req, res) => {
    res.json({ items: store.organizations, total: store.organizations.length });
  });

  app.get('/api/people', (_req, res) => {
    res.json({ items: store.users.map(sanitizeUser), total: store.users.length });
  });

  app.post('/api/people/:id/connect', (req, res) => {
    const person = store.users.find((u) => u.id === req.params.id);
    if (!person) return res.status(404).json({ error: 'Member not found.' });
    person.connected = !person.connected;
    res.json({ item: sanitizeUser(person) });
  });

  app.get('/api/mentorship', (_req, res) => {
    res.json({ mentors: store.mentors });
  });

  app.post('/api/mentorship/:id/request', (req, res) => {
    const mentor = store.mentors.find((m) => m.id === req.params.id);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found.' });
    mentor.requested = !mentor.requested;
    res.json({ item: mentor });
  });

  // Workspace tools: Tasks, Calendar, Messages, Notifications, Saved, Support, Surveys, Certificates
  app.get('/api/tasks', (_req, res) => res.json({ items: store.tasks }));
  app.post('/api/tasks', (req, res) => {
    const { title, dueDate, priority, category } = req.body || {};
    if (!title) return res.status(400).json({ error: 'Task title is required.' });
    const item = {
      id: `t-${Date.now()}`,
      title: String(title).trim(),
      dueDate: String(dueDate || new Date().toISOString().slice(0, 10)),
      priority: String(priority || 'Medium'),
      category: String(category || 'General'),
      done: false,
    };
    store.tasks.unshift(item);
    res.status(201).json({ item });
  });
  app.patch('/api/tasks/:id', (req, res) => {
    const item = store.tasks.find((t) => t.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Task not found.' });
    if (typeof req.body?.done === 'boolean') item.done = req.body.done;
    res.json({ item });
  });
  app.delete('/api/tasks/:id', (req, res) => {
    const idx = store.tasks.findIndex((t) => t.id === req.params.id);
    if (idx !== -1) store.tasks.splice(idx, 1);
    res.json({ ok: true });
  });

  app.get('/api/calendar/events', (_req, res) => res.json({ items: store.calendarEvents }));
  app.post('/api/calendar/events', (req, res) => {
    const { title, date, time, type, notes } = req.body || {};
    if (!title || !date) return res.status(400).json({ error: 'Title and date are required.' });
    const item = {
      id: `cal-${Date.now()}`,
      title: String(title).trim(),
      date: String(date),
      time: String(time || '10:00'),
      type: String(type || 'Meeting'),
      notes: String(notes || ''),
    };
    store.calendarEvents.unshift(item);
    res.status(201).json({ item });
  });
  app.delete('/api/calendar/events/:id', (req, res) => {
    const idx = store.calendarEvents.findIndex((c) => c.id === req.params.id);
    if (idx !== -1) store.calendarEvents.splice(idx, 1);
    res.json({ ok: true });
  });

  app.get('/api/messages/conversations', (_req, res) => res.json({ items: store.conversations }));
  app.post('/api/messages/conversations/:id/messages', (req, res) => {
    const user = getSessionUser(req) || store.users[0];
    const conv = store.conversations.find((c) => c.id === req.params.id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found.' });
    const text = String(req.body?.text || '').trim();
    if (!text) return res.status(400).json({ error: 'Message cannot be empty.' });
    const msg = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      text,
      time: 'Just now',
    };
    conv.messages.push(msg);
    conv.unread = 0;
    res.status(201).json({ message: msg, conversation: conv });
  });

  app.get('/api/notifications', (_req, res) => res.json({ items: store.notifications }));
  app.post('/api/notifications/read-all', (_req, res) => {
    store.notifications.forEach((n) => {
      n.read = true;
    });
    res.json({ items: store.notifications });
  });

  app.get('/api/saved', (_req, res) => {
    res.json({
      ids: store.savedIds,
      discussions: store.discussions.filter((d) => store.savedIds.includes(d.id)),
      blogs: store.blogs.filter((b) => store.savedIds.includes(b.id)),
      jobs: store.jobs.filter((j) => store.savedIds.includes(j.id)),
    });
  });
  app.post('/api/saved/toggle', (req, res) => {
    const id = String(req.body?.id || '');
    if (!id) return res.status(400).json({ error: 'Missing item id.' });
    const idx = store.savedIds.indexOf(id);
    if (idx === -1) store.savedIds.push(id);
    else store.savedIds.splice(idx, 1);
    res.json({ ids: store.savedIds, saved: idx === -1 });
  });

  app.get('/api/support/tickets', (_req, res) => res.json({ items: store.tickets }));
  app.post('/api/support/tickets', (req, res) => {
    const { subject, category, message } = req.body || {};
    if (!subject || !message) return res.status(400).json({ error: 'Subject and details are required.' });
    const item = {
      id: `tk-${Date.now()}`,
      subject: String(subject).trim(),
      category: String(category || 'General Support'),
      status: 'Open',
      updatedAt: new Date().toISOString().slice(0, 10),
      message: String(message).trim(),
    };
    store.tickets.unshift(item);
    res.status(201).json({ item });
  });

  app.get('/api/surveys', (_req, res) => res.json({ items: store.surveys }));
  app.post('/api/surveys/:id/submit', (req, res) => {
    const sv = store.surveys.find((s) => s.id === req.params.id);
    if (!sv) return res.status(404).json({ error: 'Survey not found.' });
    if (!sv.submitted) {
      sv.submitted = true;
      sv.responsesCount += 1;
    }
    res.json({ item: sv });
  });

  app.get('/api/certificates', (_req, res) => res.json({ items: store.certificates }));

  app.get('/api/search', (req, res) => {
    const q = String(req.query.q || '').trim().toLowerCase();
    if (!q) {
      return res.json({
        discussions: store.discussions.slice(0, 3),
        blogs: store.blogs.slice(0, 2),
        jobs: store.jobs.slice(0, 2),
        communities: store.communities.slice(0, 2),
        courses: store.courses.slice(0, 2),
        people: store.users.slice(0, 2).map(sanitizeUser),
      });
    }
    const match = (text: string) => text.toLowerCase().includes(q);
    res.json({
      discussions: store.discussions.filter((d) => match(d.title) || match(d.content) || d.tags.some(match)),
      blogs: store.blogs.filter((b) => match(b.title) || match(b.excerpt) || match(b.category)),
      jobs: store.jobs.filter((j) => match(j.title) || match(j.company) || match(j.location)),
      communities: store.communities.filter((c) => match(c.name) || match(c.description) || match(c.category)),
      courses: store.courses.filter((c) => match(c.title) || match(c.description) || match(c.category)),
      people: store.users.filter((u) => match(u.name) || match(u.title) || match(u.organization)).map(sanitizeUser),
    });
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, topic, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please complete your name, email, and message.' });
    }
    const entry = {
      id: `ct-${Date.now()}`,
      name: String(name).trim(),
      email: String(email).trim(),
      topic: String(topic || 'General inquiry'),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
    };
    store.contactMessages.push(entry);
    res.status(201).json({ ok: true, entry });
  });

  // Vite dev middleware or static production build
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`HR Shakti server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
