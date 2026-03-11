'use client';

import { useState } from 'react';
import { X, Activity } from 'lucide-react';

export default function LiveFeed() {
  // Remove useWebSocket entirely for now
  const [feed] = useState([
    { 
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), 
      event: 'System online', 
      type: 'info' 
    },
    { 
      time: new Date(Date.now() - 120000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), 
      event: 'Dashboard loaded', 
      type: 'info' 
    },
  ]);

  return (
    <div 
      className="w-80 glass-sidebar flex flex-col fixed right-0 top-0 h-screen z-50 border-l border-white/10" 
      style={{ position: 'fixed', right: 0 }}
    >
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
        <h2 className="text-white text-sm font-semibold">Live Feed</h2>
        <button className="text-white/60 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {feed.map((item, i) => (
          <div key={i} className="text-sm">
            <div className="text-white/40 text-xs mb-1">{item.time}</div>
            <div className="text-white/80">{item.event}</div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-white/60 text-xs">Connected</span>
        </div>
      </div>
    </div>
  );
}
