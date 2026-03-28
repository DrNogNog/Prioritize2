// src/components/dashboard/HomeContent.tsx
import { FC } from 'react';

const recentActivity = [
  { text: '12 new signals from Zendesk', time: '2 hours ago', color: 'bg-blue-400' },
  { text: 'New opportunity: Bulk task reassignment', time: 'Yesterday', color: 'bg-green-400' },
  { text: 'Q2 2026 context saved', time: '2 days ago', color: 'bg-gray-500' },
  { text: 'Jira integration connected (org-level)', time: '3 days ago', color: 'bg-gray-500' },
];

const HomeContent: FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Good morning, Priya</h2>
        <p className="mt-1 text-gray-400">
          Mobile App · Q2 2026 · Context updated 2 days ago
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Active sources', value: '4', highlight: false },
          { label: 'Signals this week', value: '127', highlight: false },
          { label: 'Open opportunities', value: '12', highlight: false },
          { label: 'Missing connections', value: '2', highlight: true },
        ].map(({ label, value, highlight }) => (
          <div
            key={label}
            className={`bg-[#242424] rounded-lg p-6 relative ${highlight ? 'border-r-2 border-r-orange-500' : ''}`}
          >
            <div className="text-sm text-gray-400 mb-1">{label}</div>
            <div className={`text-3xl font-bold ${highlight ? 'text-orange-500' : 'text-white'}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick actions */}
        <div className="bg-[#242424] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-5 text-white">Quick actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition">
              Ask your data anything ↗
            </button>
            <button className="w-full text-left px-4 py-3 bg-[#2e2e2e] hover:bg-[#333] rounded-lg text-gray-200 border border-gray-600 transition">
              Extract pain points
            </button>
            <button className="w-full text-left px-4 py-3 bg-[#2e2e2e] hover:bg-[#333] rounded-lg text-gray-200 border border-gray-600 transition">
              Update Q2 context
            </button>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-[#242424] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-5 text-white">Recent activity</h3>
          <ul className="space-y-4">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
                <div>
                  <span className="text-gray-200 text-sm">{item.text}</span>
                  <span className="block text-gray-500 text-xs mt-0.5">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
