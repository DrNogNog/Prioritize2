'use client'; // ← if using Next.js App Router

import { useState, useEffect } from 'react';

interface SettingsForm {
  baseUrl: string;
  email: string;
  apiToken: string;
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    baseUrl: '',
    email: '',
    apiToken: '',
  });

  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Optional: Load saved values from localStorage on mount (for better UX)
  useEffect(() => {
    const saved = localStorage.getItem('jira-credentials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm({
          baseUrl: parsed.baseUrl || '',
          email: parsed.email || '',
          apiToken: parsed.apiToken || '',
        });
      } catch {}
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setMessage('');

    try {
      // Option A: Save to your backend
      const response = await fetch('/api/jira-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      // Option B: Also keep a local copy (useful during development)
      localStorage.setItem('jira-credentials', JSON.stringify(form));

      setStatus('success');
      setMessage('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Reuse same header style */}
      <header className="border-b border-zinc-200 bg-white px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="font-semibold">Settings</h1>
          {/* You can add a back button or close here if needed */}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-6 text-xl font-medium">Jira Connection</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* BASE_URL */}
            <div>
              <label
                htmlFor="baseUrl"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Jira Base URL
              </label>
              <input
                id="baseUrl"
                name="baseUrl"
                type="url"
                value={form.baseUrl}
                onChange={handleChange}
                placeholder="https://your-company.atlassian.net"
                required
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Atlassian Account Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your.email@company.com"
                required
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* API TOKEN */}
            <div>
              <label
                htmlFor="apiToken"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                API Token
              </label>
              <input
                id="apiToken"
                name="apiToken"
                type="password"
                value={form.apiToken}
                onChange={handleChange}
                placeholder="ATATT3xFfGF0..."
                required
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                Generate at:{' '}
                <a
                  href="https://id.atlassian.com/manage-profile/security/api-tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  id.atlassian.com
                </a>
              </p>
            </div>

            {/* Status message */}
            {message && (
              <div
                className={`mt-4 rounded-md p-3 text-sm ${
                  status === 'success'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                    : status === 'error'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                    : ''
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={status === 'saving'}
                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {status === 'saving' ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}