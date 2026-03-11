'use client';

import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ToolsPage() {
  const tools = [
    {
      id: 1,
      name: 'Email Bot',
      description: 'Automated email processing and responses',
      status: 'active',
      created: '2 days ago',
    },
    {
      id: 2,
      name: 'Calendar Manager',
      description: 'Sync and manage calendar events',
      status: 'draft',
      created: '5 days ago',
    },
    {
      id: 3,
      name: 'Data Scraper',
      description: 'Extract data from web sources',
      status: 'active',
      created: '1 week ago',
    },
  ];

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tools Library</h1>
        
        {/* Toolbar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:border-neutral-600 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <Link
            href="/build"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Tool
          </Link>
        </div>
      </div>

      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="group bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-all hover:bg-neutral-800/50"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{tool.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      tool.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>
                <p className="text-sm text-neutral-400">{tool.description}</p>
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-xs text-neutral-500">Created {tool.created}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-400 mb-4">No tools yet</p>
          <Link
            href="/build"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create your first tool
          </Link>
        </div>
      )}
    </div>
  );
}
