import React, { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { api, ApiError } from '../services/api';
import { FieldLabel, SectionCard, buttonPrimary, inputClass } from './ui';

interface Props {
  onAuthError: () => void;
}

const PasswordInput: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  hint?: string;
}> = ({ label, value, onChange, autoComplete, hint }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export const SettingsPanel: React.FC<Props> = ({ onAuthError }) => {
  const { adminUser, setAdminUsername } = useAdminData();
  const [username, setUsername] = useState(adminUser);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const usernameChanged = username.trim() !== adminUser && username.trim() !== '';
  const passwordChanged = newPassword !== '';
  const nothingToSave = !usernameChanged && !passwordChanged;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordChanged && newPassword.length < 6) return setError('New password must be at least 6 characters.');
    if (passwordChanged && newPassword !== confirmPassword) return setError('The new passwords do not match.');
    if (usernameChanged && username.trim().length < 3) return setError('Login ID must be at least 3 characters.');

    setBusy(true);
    try {
      const result = await api.updateAccount({
        currentPassword,
        ...(usernameChanged ? { newUsername: username.trim() } : {}),
        ...(passwordChanged ? { newPassword } : {}),
      });
      setAdminUsername(result.user.username);
      setUsername(result.user.username);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(
        [usernameChanged && 'Login ID', passwordChanged && 'Password'].filter(Boolean).join(' and ') +
          ' updated. Use the new details the next time you sign in.'
      );
    } catch (err) {
      // 403 means the login token itself expired; a wrong current password is reported as a 400
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) return onAuthError();
      setError(err instanceof Error ? err.message : 'Could not update the account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xl">
      <SectionCard title="Login ID & password" description="Change how you sign in to this admin panel.">
        <div>
          <FieldLabel>Login ID (username)</FieldLabel>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className={inputClass} />
        </div>

        <PasswordInput
          label="New password"
          hint="leave empty to keep your current password"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
        />
        {passwordChanged && (
          <PasswordInput label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
        )}

        <div className="pt-4 border-t border-theme-border">
          <PasswordInput
            label="Current password"
            hint="required to save any change"
            value={currentPassword}
            onChange={setCurrentPassword}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
          </p>
        )}

        <button type="submit" disabled={busy || nothingToSave || !currentPassword} className={buttonPrimary}>
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          Save changes
        </button>
      </SectionCard>
    </form>
  );
};
