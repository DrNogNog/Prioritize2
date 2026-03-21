import type { ReactNode } from 'react';
import TopNav from '@/components/navigation/TopNav';
import SideNav from '@/components/navigation/SideNav';

export default function IntegrationsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F5F4F0] overflow-hidden">
      {/* Sidebar: fixed width, no shrinking, full height */}
    <SideNav />


      {/* Right column: fills remaining space, no negative margins! */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopNav: starts flush against sidebar on md+ */}
        <TopNav />  {/* ← Ensure TopNav has no extra left padding on md+ (see below) */}

        {/* Main: full scrollable height, bg-white for seamless look */}
        <main className="flex-1 overflow-y-auto bg-[#EEEDE9]">
          {/* Inner wrapper for content padding – slight left indent on desktop feels balanced */}
          <div className="px-4 py-6 md:px-6 lg:px-8 bg-[#EEEDE9]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}