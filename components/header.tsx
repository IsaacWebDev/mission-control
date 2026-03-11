'use client';

import { useEffect, useState } from 'react';
import { Search, MessageSquare, Settings } from 'lucide-react';
import { withClientOnly } from './ClientOnly';

/**
 * Client-only time display component
 * Wrapped with withClientOnly to prevent hydration mismatches
 */
const TimeDisplay = withClientOnly(({ time }: { time: string }) => (
  <time 
    className="text-sm text-white/70"
    aria-label={`Current time: ${time}`}
  >
    {time}
  </time>
));

/**
 * Client-only interactive button component
 * Wrapped with withClientOnly to prevent hydration mismatches
 */
const DynamicButton = withClientOnly(
  ({ icon: Icon, onClick, label }: { 
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
    onClick: () => void;
    label: string;
  }) => (
    <button 
      onClick={onClick}
      className="glass-button w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-white/70" aria-hidden={true} />
    </button>
  )
);

/**
 * Header component with proper hydration handling
 * 
 * Solution: Use Next.js dynamic imports with ssr: false for client-only content
 * This is the proper fix vs suppressHydrationWarning which masks the issue
 */
export default function Header() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header 
      className="h-14 glass-header sticky top-0 z-50 flex items-center justify-between px-6"
      role="banner"
    >
      {/* Left: Version badge - Static content (SSR safe) */}
      <div className="flex items-center gap-3">
        <span 
          className="text-[10px] px-2 py-1 bg-white/[0.06] border border-white/[0.08] rounded-full text-white/70"
          aria-label="Version 4.1"
        >
          v4.1
        </span>
      </div>

      {/* Center: Search - Static content (SSR safe) */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" 
            aria-hidden="true"
          />
          <input 
            type="text"
            placeholder="Search..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = e.currentTarget.value;
                console.log('[Header] Search submitted:', value);
                alert(`🔍 Search\n\nSearching for: "${value}"\n\nComing soon...`);
              }
            }}
            className="glass-input w-full h-9 rounded-[10px] pl-10 pr-4 text-sm text-white/95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right: Status badges, time, and actions */}
      <div className="flex items-center gap-3">
        {/* Session count - Static (SSR safe) */}
        <div 
          className="text-[11px] px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-white/85"
          aria-label="3 of 15 sessions active"
        >
          Sessions 3/15
        </div>
        
        {/* Gateway status - Static (SSR safe) */}
        <div 
          className="text-[11px] px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400"
          aria-label="Gateway connected, 42ms latency"
        >
          Gateway • 42ms
        </div>
        
        {/* Events status - Static (SSR safe) */}
        <div 
          className="text-[11px] px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400"
          aria-label="Events live"
        >
          Events • Live
        </div>
        
        {/* Time display - Client-only (no hydration mismatch) */}
        <TimeDisplay time={time} />
        
        {/* Messages button - Client-only (no hydration mismatch) */}
        <DynamicButton 
          icon={MessageSquare}
          label="Messages"
          onClick={() => {
            console.log('[Header] Messages clicked');
            alert('💬 Messages\n\nComing soon...');
          }}
        />
        
        {/* Settings button - Client-only (no hydration mismatch) */}
        <DynamicButton 
          icon={Settings}
          label="Settings"
          onClick={() => {
            console.log('[Header] Settings clicked');
            alert('⚙️ Settings\n\nComing soon...');
          }}
        />
      </div>
    </header>
  );
}
