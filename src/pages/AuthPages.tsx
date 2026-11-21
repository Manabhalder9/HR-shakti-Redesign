import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BrandSymbol } from '../components/BrandMark';
import { PublicLayout } from '../components/PublicLayout';
import { useAuth } from '../context/AuthContext';
import { Link, useRouter } from '../context/RouterContext';

export function LoginPage() {
  const { signIn, signInDemo } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('priya@hrshakti.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setBusy(true);
    try {
      await signInDemo();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PublicLayout>
      <div className="auth-page">
        <div className="auth-editorial">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> WELCOME BACK TO HR SHAKTI
          </p>
          <h1>Good work grows when good people find each other.</h1>
          <p>
            Sign in to rejoin your peer circles, follow conversations shaping people operations, and
            manage your learning and career steps.
          </p>
          <div className="auth-art">
            <BrandSymbol size={42} />
            <span>Human Resource for Skills, Harmony, Advancement, Knowledge, Talent &amp; Innovation</span>
          </div>
        </div>

        <div className="panel auth-card">
          <div className="auth-card-head">
            <BrandSymbol size={28} />
            <span>MEMBER ACCESS</span>
          </div>
          <h2>Sign in to HR Shakti</h2>
          <p>Use your member credentials or explore immediately with the demo account.</p>

          {error && <div className="notice notice-error">{error}</div>}

          <button
            type="button"
            className="button button-secondary"
            style={{ width: '100%', minHeight: 48 }}
            onClick={handleDemo}
            disabled={busy}
          >
            <Sparkles size={16} aria-hidden="true" /> Continue as Demo Member (Priya Nair)
          </button>

          <div className="auth-divider">or sign in with email</div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
            <div className="form-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.com"
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <Link href="/forgot-password" style={{ fontSize: '0.81rem', fontWeight: 700 }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="button button-primary" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          <div className="auth-switch">
            New to HR Shakti? <Link href="/register">Create your account</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export function RegisterPage() {
  const { register, signInDemo } = useAuth();
  const { navigate } = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register({ name, email, password, title, organization });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PublicLayout>
      <div className="auth-page">
        <div className="auth-editorial">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> JOIN THE NETWORK
          </p>
          <h1>A professional home for the people behind people.</h1>
          <p>
            Connect with HR business partners, talent leaders, and learning architects building
            thoughtful workplaces.
          </p>
          <div className="auth-art">
            <BrandSymbol size={42} />
            <span>People. Purpose. Possibility.</span>
          </div>
        </div>

        <div className="panel auth-card">
          <div className="auth-card-head">
            <BrandSymbol size={28} />
            <span>CREATE ACCOUNT</span>
          </div>
          <h2>Join HR Shakti</h2>
          <p>Start participating in discussions, communities, and learning cohorts.</p>

          {error && <div className="notice notice-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 13 }}>
            <div className="form-field">
              <label htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-email">Work or personal email</label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@company.com"
              />
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label htmlFor="reg-title">Role / Title</label>
                <input
                  id="reg-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="People Partner"
                />
              </div>
              <div className="form-field">
                <label htmlFor="reg-org">Organization</label>
                <input
                  id="reg-org"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <button type="submit" className="button button-primary" disabled={busy}>
              {busy ? 'Creating account…' : 'Create account'} <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-divider">or preview workspace immediately</div>

          <button
            type="button"
            className="button button-secondary"
            style={{ width: '100%' }}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await signInDemo();
              navigate('/dashboard');
            }}
          >
            Continue as Demo Member (Priya Nair)
          </button>

          <div className="auth-switch">
            Already a member? <Link href="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <PublicLayout>
      <div className="simple-public-page">
        <p className="eyebrow">
          <span className="eyebrow-dot" /> ACCOUNT RECOVERY
        </p>
        <h1>Reset your password</h1>
        <p>Enter the email address associated with your HR Shakti account and we will send reset instructions.</p>
        <div className="panel" style={{ maxWidth: 480, marginTop: 24 }}>
          {sent ? (
            <div className="notice notice-success">
              If an account matches <strong>{email}</strong>, a recovery link has been dispatched.{' '}
              <Link href="/login">Return to sign in</Link>.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              style={{ display: 'grid', gap: 14 }}
            >
              <div className="form-field">
                <label htmlFor="reset-email">Email address</label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                />
              </div>
              <button type="submit" className="button button-primary">
                Send reset instructions
              </button>
            </form>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
