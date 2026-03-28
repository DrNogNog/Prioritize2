'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Knowledge Explorer', href: '/knowledge-explorer' },
  { label: 'Signals', href: '/signals' },
  { label: 'Context & OKRs', href: '/context-okrs' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Settings', href: '/settings' },
];

const SideNav: FC = () => {
  const pathname = usePathname();

  return (
    <nav className="h-screen w-48 py-6 flex flex-col bg-[#1a1a1a]">
      {/* Logo/Header */}
      <div className="mb-10 pb-2 border-b border-gray-700">
        <div className="flex items-center gap-2 pl-3">
          <span className="font-bold text-white">Clarion</span>
          <span className="text-xs uppercase tracking-wide text-gray-400">PM Platform</span>
        </div>
      </div>

      {/* Navigation Items */}
      <ul className="-mt-8 space-y-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center w-auto px-4 py-2.5 text-sm transition-colors",
                  isActive
                    ? "text-white font-bold"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom user info */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="flex items-center gap-3 pl-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs">
            PR
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Priya Raman</span>
            <span className="text-xs text-gray-400">PM • Acme Corp</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
