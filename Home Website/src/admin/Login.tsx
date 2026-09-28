import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { api, ApiError } from '../services/api';
import { inputClass } from './ui';

export function Login() {
  const { isAdmin, login } = useAdminData();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [failedOnce, setFailedOnce] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setFailedOnce(err instanceof ApiError && err.status === 401);
    } finally {
      setBusy(false);
    }
  };

  const handleSeed = async () => {
    setBusy(true);
    setError('');
    try {
      await api.seedAdmin();
      setUsername('admin');
      setPassword('admin123');
      setNotice('Default admin created. Press "Sign in" to continue (username: admin, password: admin123).');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the admin account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-theme-card border border-theme-border rounded-2xl shadow-lg p-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-theme-text-muted hover:text-brand-primary mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to website
        </Link>
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-theme-text-muted mt-1">Sign in to manage the website</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              autoFocus
              required
              className={`${inputClass} pl-10 py-3`}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
              className={`${inputClass} pl-10 pr-10 py-3`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {notice && <p className="text-sm text-emerald-600 dark:text-emerald-400">{notice}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-lg bg-brand-primary text-on-primary font-semibold text-sm hover:bg-brand-hover disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign in
          </button>
        </form>

        {failedOnce && (
          <div className="mt-6 pt-5 border-t border-theme-border text-center">
            <p className="text-xs text-theme-text-muted mb-2">First time here and no admin account exists yet?</p>
            <button type="button" onClick={handleSeed} disabled={busy} className="text-sm font-semibold text-brand-primary hover:underline">
              Create the default admin account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
