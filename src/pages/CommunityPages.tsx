import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Check,
  Heart,
  HelpCircle,
  MessageSquare,
  Plus,
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
import { api, excerptText, formatDate } from '../lib/api';

function DiscussionComposer({
  kind = 'discussion',
  communities,
  onCreated,
}: {
  kind?: 'discussion' | 'question';
  communities: any[];
  onCreated: (item: any) => void;
}) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [communityId, setCommunityId] = useState(communities[0]?.id || 'c-1');
  const [tagsText, setTagsText] = useState('');
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const tags = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await api.post('/discussions', {
        kind,
        title,
        content,
        communityId,
        tags,
        ...(showPoll && pollQuestion.trim()
          ? { pollQuestion, pollOptions: pollOptions.filter((o) => o.trim()) }
          : {}),
      });
      setTitle('');
      setContent('');
      setTagsText('');
      setShowPoll(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      onCreated(res.item);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to publish.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel composer">
      <div className="avatar">{user?.avatarInitials || 'PN'}</div>
      <form onSubmit={handleSubmit}>
        {error && <div className="notice notice-error">{error}</div>}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            kind === 'question'
              ? 'Ask a clear, specific HR practice question…'
              : 'Start a conversation or share a field insight…'
          }
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add context, trade-offs you are weighing, or what you have tried so far…"
          required
        />
        <input
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="Tags separated by commas (e.g. Onboarding, Compensation, HRBP)"
        />

        {showPoll && (
          <fieldset className="poll-builder">
            <legend>Optional Community Poll</legend>
            <input
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="Poll question…"
            />
            <div className="poll-builder-options">
              {pollOptions.map((opt, idx) => (
                <input
                  key={idx}
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[idx] = e.target.value;
                    setPollOptions(next);
                  }}
                  placeholder={`Option ${idx + 1}`}
                />
              ))}
            </div>
            {pollOptions.length < 4 && (
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setPollOptions([...pollOptions, ''])}
              >
                <Plus size={14} /> Add option
              </button>
            )}
          </fieldset>
        )}

        <div className="composer-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <select value={communityId} onChange={(e) => setCommunityId(e.target.value)}>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {kind === 'discussion' && (
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setShowPoll((v) => !v)}
              >
                {showPoll ? 'Remove poll' : 'Add poll'}
              </button>
            )}
          </div>
          <button type="submit" className="button button-primary" disabled={busy}>
            {busy ? 'Publishing…' : kind === 'question' ? 'Post question' : 'Publish conversation'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function FeedAndDiscussionsPage({ mode = 'feed' }: { mode?: 'feed' | 'discussions' | 'questions' }) {
  const { savedIds, toggleSave } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'discussion' | 'question'>(
    mode === 'questions' ? 'question' : mode === 'discussions' ? 'discussion' : 'all'
  );
  const [tagFilter, setTagFilter] = useState('All');

  useEffect(() => {
    setTab(mode === 'questions' ? 'question' : mode === 'discussions' ? 'discussion' : 'all');
  }, [mode]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([api.get('/discussions'), api.get('/communities')])
      .then(([d, c]) => {
        if (!active) return;
        setItems(d.items || []);
        setCommunities(c.items || []);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const allTags = ['All', ...Array.from(new Set(items.flatMap((i) => i.tags || []))).slice(0, 8)];

  const filtered = items.filter((item) => {
    if (tab !== 'all' && item.kind !== tab) return false;
    if (tagFilter !== 'All' && !(item.tags || []).includes(tagFilter)) return false;
    return true;
  });

  const handleLike = async (id: string) => {
    const res = await api.post(`/discussions/${id}/like`);
    setItems((prev) => prev.map((it) => (it.id === id ? res.item : it)));
  };

  const titleMap = {
    feed: {
      eyebrow: 'COMMUNITY FEED',
      title: 'What people leaders are talking through',
      description: 'Discussions, practice questions, and live polls from across HR Shakti circles.',
    },
    discussions: {
      eyebrow: 'DISCUSSIONS',
      title: 'Conversations shaping work',
      description: 'Share field notes, compare trade-offs, and test policy ideas with trusted peers.',
    },
    questions: {
      eyebrow: 'QUESTIONS & ANSWERS',
      title: 'Bring real questions to the room',
      description: 'Practical people-operations questions answered by practitioners who have navigated them.',
    },
  }[mode];

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow={titleMap.eyebrow}
        title={titleMap.title}
        description={titleMap.description}
      />

      <DiscussionComposer
        kind={mode === 'questions' ? 'question' : 'discussion'}
        communities={communities}
        onCreated={(created) => setItems((prev) => [created, ...prev])}
      />

      <div className="feed-toolbar">
        <div className="feed-tabs">
          <button
            type="button"
            className={tab === 'all' ? 'active' : ''}
            onClick={() => setTab('all')}
          >
            All activity
          </button>
          <button
            type="button"
            className={tab === 'discussion' ? 'active' : ''}
            onClick={() => setTab('discussion')}
          >
            Discussions
          </button>
          <button
            type="button"
            className={tab === 'question' ? 'active' : ''}
            onClick={() => setTab('question')}
          >
            Q&amp;A
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 6 }}>
          <label htmlFor="tag-filter" style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
            Topic:
          </label>
          <select
            id="tag-filter"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}
          >
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading conversations…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No conversations match that filter"
          description="Try clearing the topic filter or start a new conversation above."
        />
      ) : (
        <div className="feed-list">
          {filtered.map((item) => {
            const isSaved = savedIds.includes(item.id);
            return (
              <article className="discussion-card" key={item.id}>
                <div className="discussion-author">
                  <span className="avatar">
                    {item.authorName
                      .split(' ')
                      .map((p: string) => p[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <div>
                    <strong>{item.authorName}</strong>
                    <span>{item.authorTitle} · {item.communityName}</span>
                  </div>
                  <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
                </div>

                <Link className="discussion-body-link" href={`/discussions/${item.id}`}>
                  <h2>
                    {item.kind === 'question' && (
                      <HelpCircle
                        size={18}
                        className="question-title-icon"
                      />
                    )}
                    {item.title}
                  </h2>
                  <p>{excerptText(item.content, 240)}</p>
                </Link>

                <div className="discussion-meta">
                  <span>{(item.tags || []).join(' · ')}</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      className={`button button-quiet like-button${item.likedByMe ? ' liked' : ''}`}
                      onClick={() => handleLike(item.id)}
                    >
                      <Heart size={14} fill={item.likedByMe ? 'currentColor' : 'none'} />
                      {item.likes}
                    </button>
                    <Link href={`/discussions/${item.id}`} className="button button-quiet">
                      <MessageSquare size={14} /> {item.commentCount} replies
                    </Link>
                    <button
                      type="button"
                      className="button button-quiet"
                      onClick={() => toggleSave(item.id)}
                    >
                      <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </WorkspaceLayout>
  );
}

export function DiscussionDetailPage({ id }: { id: string }) {
  const { savedIds, toggleSave } = useAuth();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/discussions/${encodeURIComponent(id)}`)
      .then((res) => setItem(res.item))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleVote = async (optionId: string) => {
    const res = await api.post(`/discussions/${id}/vote`, { optionId });
    setItem(res.item);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setBusy(true);
    try {
      const res = await api.post(`/discussions/${id}/replies`, { content: replyText });
      setItem(res.item);
      setReplyText('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <WorkspaceLayout>
      <div style={{ marginBottom: 14 }}>
        <Link href="/discussions" className="back-link">
          ← Back to all discussions
        </Link>
      </div>

      {loading ? (
        <LoadingState label="Loading conversation…" />
      ) : !item ? (
        <EmptyState title="Conversation not found" description="This thread may have been removed." />
      ) : (
        <>
          <article className="panel discussion-detail-card">
            <p className="eyebrow">{item.communityName}</p>
            <h1 style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.4rem)' }}>{item.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ink-muted)', fontSize: '0.8rem', marginBottom: 18 }}>
              <strong>{item.authorName}</strong>
              <span>{item.authorTitle}</span>
              <time style={{ marginLeft: 'auto' }}>{formatDate(item.createdAt)}</time>
            </div>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, color: 'var(--ink)' }}>{item.content}</p>

            {item.poll && (
              <div className="panel discussion-poll">
                <p className="eyebrow">COMMUNITY POLL</p>
                <h2>{item.poll.question}</h2>
                <div className="poll-results">
                  {item.poll.options.map((opt: any) => {
                    const pct =
                      item.poll.totalVotes > 0
                        ? Math.round((opt.votes / item.poll.totalVotes) * 100)
                        : 0;
                    const chosen = item.poll.votedOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`poll-result${chosen ? ' selected' : ''}`}
                        onClick={() => handleVote(opt.id)}
                      >
                        <div className="poll-result-copy">
                          <strong>
                            {opt.label} {chosen ? '✓' : ''}
                          </strong>
                          <span>
                            {pct}% · {opt.votes} votes
                          </span>
                        </div>
                        <span className="poll-meter">
                          <span style={{ width: `${pct}%` }} />
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p style={{ marginTop: 10, marginBottom: 0, fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                  {item.poll.totalVotes} total votes · Click any option to vote
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                className="button button-secondary"
                onClick={async () => {
                  const res = await api.post(`/discussions/${id}/like`);
                  setItem(res.item);
                }}
              >
                <Heart size={15} fill={item.likedByMe ? 'currentColor' : 'none'} /> {item.likes} Helpful
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => toggleSave(item.id)}
              >
                <Bookmark size={15} fill={savedIds.includes(item.id) ? 'currentColor' : 'none'} />
                {savedIds.includes(item.id) ? 'Saved' : 'Save thread'}
              </button>
            </div>
          </article>

          <div className="panel" style={{ marginTop: 18 }}>
            <h2 style={{ marginBottom: 12 }}>Add your perspective</h2>
            <form onSubmit={handleReply} style={{ display: 'grid', gap: 12 }}>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Share what worked in your organization or ask a clarifying follow-up…"
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="button button-primary" disabled={busy}>
                  {busy ? 'Posting…' : 'Post reply'}
                </button>
              </div>
            </form>
          </div>

          <div className="section-title">
            <h2>Replies ({item.replies?.length || 0})</h2>
          </div>

          <div className="reply-list">
            {(item.replies || []).map((rep: any) => (
              <div className="reply-card" key={rep.id}>
                <div className="reply-heading">
                  <strong style={{ color: 'var(--ink)' }}>{rep.authorName}</strong>
                  <span>{rep.authorTitle}</span>
                  <time>{formatDate(rep.createdAt)}</time>
                </div>
                <p>{rep.content}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </WorkspaceLayout>
  );
}

export function CommunitiesPage() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/communities')
      .then((res) => setCommunities(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  const toggleJoin = async (id: string) => {
    const res = await api.post(`/communities/${id}/toggle-join`);
    setCommunities((prev) => prev.map((c) => (c.id === id ? res.item : c)));
  };

  return (
    <WorkspaceLayout>
      <PageHeader
        eyebrow="COMMUNITIES"
        title="Find your circle of practice"
        description="Focused practitioner groups built around compensation, talent craft, HRBP strategy, learning, and governance."
        action={
          <Link href="/discussions" className="button button-primary">
            Visit discussions <ArrowRight size={15} />
          </Link>
        }
      />

      {loading ? (
        <LoadingState label="Loading communities…" />
      ) : (
        <div className="item-grid">
          {communities.map((c) => (
            <article className="item-card item-community" key={c.id}>
              {c.coverImage && (
                <img
                  className="item-card-image"
                  src={c.coverImage}
                  alt={c.name}
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="item-card-top">
                <span className="item-glyph glyph-community">
                  <Users size={16} />
                </span>
                <span className="item-meta">
                  {c.category} · {c.memberCount.toLocaleString()} members
                </span>
              </div>
              <h3>{c.name}</h3>
              <p>{c.description}</p>
              <div style={{ fontSize: '0.74rem', color: 'var(--ink-muted)', marginBottom: 14 }}>
                {c.cadence}
              </div>
              <button
                type="button"
                className={`button ${c.joined ? 'button-secondary' : 'button-primary'}`}
                style={{ marginTop: 'auto', width: '100%' }}
                onClick={() => toggleJoin(c.id)}
              >
                {c.joined ? (
                  <>
                    <Check size={15} /> Joined circle
                  </>
                ) : (
                  'Join community'
                )}
              </button>
            </article>
          ))}
        </div>
      )}
    </WorkspaceLayout>
  );
}
