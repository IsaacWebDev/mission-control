'use client';

import { useEffect, useState } from 'react';
import { Command, Search } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-start justify-center pt-20">
        <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-800">
            <Search className="w-5 h-5 text-neutral-500" />
            <input
              autoFocus
              type="text"
              placeholder="Search commands..."
              className="flex-1 bg-transparent outline-none text-white placeholder-neutral-500"
            />
            <kbd className="px-2 py-1 text-xs bg-neutral-800 rounded border border-neutral-700">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-64 overflow-auto p-2">
            <div className="text-center text-neutral-500 text-sm py-8">
              Start typing to search commands...
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-800/30 text-xs text-neutral-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Command className="w-3 h-3" />
              <span>K to open</span>
            </div>
            <span>Coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
TODO: Implement Command Palette

Features to add:
- Search through all pages and tools
- Quick navigate to sections
- Recent tools
- Quick actions (create tool, go to settings)
- Keyboard shortcuts
- Command history

Usage:
Add <CommandPalette /> to app/layout.tsx

Implementation:
1. Create commands array with routes and actions
2. Filter based on search input
3. Handle keyboard navigation (arrow up/down)
4. Execute command on enter
5. Store recent commands
*/
