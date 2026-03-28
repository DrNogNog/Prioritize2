// src/components/dashboard/TopNav.tsx
import { FC } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const TopNav: FC = () => {
  return (
    <header className="border-b border-gray-700 bg-[#1a1a1a] px-4 sm:px-5 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="flex items-center gap-2.5 sm:gap-3 text-sm text-gray-400 font-medium">
          <span>Org</span>

          <div className="relative inline-flex items-center">
            <select
              defaultValue="Acme Corp"
              className="appearance-none bg-[#2a2a2a] border border-gray-600 text-white font-medium text-xs rounded-lg pl-2.5 pr-8 py-1 min-w-[128px] focus:outline-none"
            >
              <option>Acme Corp</option>
              <option>Future Corp</option>
              <option>Demo Inc</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          <span>Product</span>

          <div className="relative inline-flex items-center">
            <select
              defaultValue="Mobile App"
              className="appearance-none bg-[#2a2a2a] border border-gray-600 text-white font-medium text-xs rounded-lg pl-2.5 pr-8 py-1 min-w-[128px] focus:outline-none"
            >
              <option>Mobile App</option>
              <option>Web Dashboard</option>
              <option>Admin Panel</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <span className="px-2.5 py-0.5 bg-green-900 text-green-300 text-xs font-medium rounded">
          Q2 2026 · Active
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-medium uppercase">
          PR
        </span>
      </div>
    </header>
  );
};

export default TopNav;
