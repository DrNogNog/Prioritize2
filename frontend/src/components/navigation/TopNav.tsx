import { FC } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const TopNav: FC = () => {
  return (
    <header className="border-b bg-white px-4 sm:px-5 py-2.5 flex items-center justify-between">
      {/* ↓ py-3 → py-2.5 (reduces header height by ~2px) */}
      {/* px-5 sm:px-6 → px-4 sm:px-5 (horizontal breathing room -2px) */}

      <div className="flex items-center gap-4 sm:gap-5">
        {/* ↓ gap-5 sm:gap-6 → gap-4 sm:gap-5 (horizontal spacing -4px total) */}

        <div className="flex items-center gap-2.5 sm:gap-3 text-sm text-gray-500 font-medium">
          {/* ↓ gap-3 sm:gap-4 → gap-2.5 sm:gap-3 */}

          <span className="text-gray-600">Org</span>

          <div className="relative inline-flex items-center">
            <select
              defaultValue="Acme Corp"
              className={`
                appearance-none
                bg-[#F5F4F0]
                border border-gray-600
                text-gray-900 font-medium
                text-xs              // ← text-sm → text-xs  (font -~2px)
                rounded-lg
                pl-2.5 pr-8 py-1     // ← py-1.5 → py-1 (height -2px), pl-3→pl-2.5, pr-9→pr-8
                hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                min-w-[128px]        // ← min-w-[140px] → min-w-[128px] (~-12px width)
              `}
            >
              <option>Acme Corp</option>
              <option>Future Corp</option>
              <option>Demo Inc</option>
            </select>

            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            {/* ↑ w-4 h-4 → w-3.5 h-3.5 (icon -1px, looks balanced) */}
          </div>

          <span className="text-gray-600">Product</span>

          <div className="relative inline-flex items-center">
            <select
              defaultValue="Mobile App"
              className={`
                appearance-none
                bg-[#F5F4F0]
                border border-gray-600
                text-gray-900 font-medium
                text-xs
                rounded-lg
                pl-2.5 pr-8 py-1
                hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                min-w-[128px]
              `}
            >
              <option>Mobile App</option>
              <option>Web Dashboard</option>
              <option>Admin Panel</option>
            </select>

            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* ↓ gap-3 sm:gap-4 → gap-2.5 sm:gap-3 */}

        <span className="px-2.5 py-0.5 bg-[#EAF3DE] text-green-900 text-xs font-medium rounded border border-green-200/70">
          {/* ↓ px-3 py-1 → px-2.5 py-0.5 (height -2px, width tighter), rounded-sm → rounded */}
          Q2 2026 • Active
        </span>

        <span className="
          inline-flex h-8 w-8           // ← h-9 w-9 → h-8 w-8 (circle diameter -8px total, feels -~4px visually)
          items-center justify-center
          rounded-full
          bg-blue-50
          text-blue-700
          text-[10px]                   // ← text-xs → text-[10px] or text-xs if too small
          font-medium
          border border-blue-200/60
          uppercase
        ">
          PR
        </span>
      </div>
    </header>
  );
};

export default TopNav;