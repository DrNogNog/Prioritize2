// src/components/dashboard/HomeContent.tsx
import { FC } from 'react';

const HomeContent: FC = () => {
  const recentActivity = [
    '12 new signals from Zendesk – 2 hours ago',
    'New opportunity: Bulk task reassignment – Yesterday',
    'Q2 2026 context saved – 2 days ago',
    'Jira integration connected (org-level) – 3 days ago',
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Good morning, Priya</h2>
        <p className="mt-1 text-gray-600">
          Mobile App • Q2 2026 • Context updated 2 days ago
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#F5F4F0] border rounded-lg p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Active sources</div>
          <div className="text-3xl font-bold">4</div>
        </div>
        <div className="bg-[#F5F4F0] border rounded-lg p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Signals this week</div>
          <div className="text-3xl font-bold">127</div>
        </div>
        <div className="bg-[#F5F4F0] border rounded-lg p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Open opportunities</div>
          <div className="text-3xl font-bold">12</div>
        </div>
        <div className="bg-[#F5F4F0] border border-l-orange-600 rounded-lg p-6 shadow-sm relative">
          <div className="text-sm text-gray-500 mb-1">Missing connections</div>
          <div className="text-3xl font-bold text-orange-600">2</div>
          <div className="absolute right-0 top-0 bottom-0 w-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick actions */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-5">Quick actions</h3>
          <div className="space-y-4">
            <div className="border border-blue-400 bg-blue-50 rounded-lg">
              <input
                type="text"
                placeholder="Ask your data anything…"
                className="w-full px-4 py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
              />
            </div>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition">
              Extract pain points
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition">
              Update Q2 context
            </button>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-5">Recent activity</h3>
          <ul className="space-y-2 text-gray-700">
            {recentActivity.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile bottom bar – optional */}
      <div className="mt-8 border-t pt-4 text-sm text-gray-600 md:hidden">
        Priya Raman • PM • Acme Corp
      </div>
    </div>
  );
};

export default HomeContent;