'use client';

import { useState } from 'react';
import { Bot, Activity, Clock, Zap, Search, Filter, X } from 'lucide-react';
import { useAgents } from '@/hooks/useAgents';
import { StatusBadge } from '@/components/StatusBadge';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import type { Agent } from '@/lib/types';

type StatusFilter = 'all' | 'idle' | 'busy' | 'spawned';

export default function AgentsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useAgents({
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery || undefined,
  });

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  if (isLoading) {
    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold text-white mb-6">Agents</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card rounded-xl p-5 h-[180px] animate-pulse">
              <div className="h-5 bg-gray-700/50 rounded mb-3 w-2/3"></div>
              <div className="h-4 bg-gray-700/50 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold text-white mb-6">Agents</h1>
        <ErrorDisplay
          title="Failed to load agents"
          message={error instanceof Error ? error.message : 'An unexpected error occurred'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const agents = data?.agents || [];
  const totalCount = data?.total || 0;

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Agents</h1>
          <p className="text-white/60 text-sm mt-1">
            {totalCount} {totalCount === 1 ? 'agent' : 'agents'} configured
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <div className="flex gap-2">
              {(['all', 'idle', 'busy', 'spawned'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      {agents.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Bot className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">No agents found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {agents.map((agent: any) => (
            <AgentCard
              key={agent.agentId}
              agent={agent}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>
      )}

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}

function AgentCard({ agent, onClick }: { agent: any; onClick: () => void }) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'busy':
        return { status: 'healthy' as const, label: 'Busy', color: 'text-green-400', pulse: true };
      case 'spawned':
        return { status: 'info' as const, label: 'Spawned', color: 'text-gray-400', pulse: false };
      default:
        return { status: 'info' as const, label: 'Idle', color: 'text-blue-400', pulse: false };
    }
  };

  const statusInfo = getStatusInfo(agent.status);
  const isDefault = agent.isDefault;

  const formatLastActivity = (ms: number | null) => {
    if (!ms) return 'Never';
    const ageMs = Date.now() - ms;
    const minutes = Math.floor(ageMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-xl p-5 cursor-pointer hover:border-blue-500/30 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
            agent.status === 'busy' ? 'from-green-500/20 to-emerald-500/20' :
            agent.status === 'spawned' ? 'from-gray-500/20 to-slate-500/20' :
            'from-blue-500/20 to-cyan-500/20'
          } flex items-center justify-center`}>
            <Bot className={`w-5 h-5 ${statusInfo.color}`} />
          </div>
        </div>
        <StatusBadge
          status={statusInfo.status}
          label={statusInfo.label}
          pulse={statusInfo.pulse}
          className="text-[10px]"
        />
      </div>

      {/* Agent Name */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white/95 truncate">{agent.agentId}</h3>
          {isDefault && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              DEFAULT
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/60 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Sessions
          </span>
          <span className="text-white/95 font-medium">
            {agent.activeSessions}/{agent.sessionCount}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Last Active
          </span>
          <span className="text-white/95 font-medium">
            {formatLastActivity(agent.lastActivityMs)}
          </span>
        </div>

        {agent.heartbeat.enabled && (
          <div className="flex items-center justify-between">
            <span className="text-white/60 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Heartbeat
            </span>
            <span className="text-white/95 font-medium">
              {Math.floor(agent.heartbeat.intervalMs / 1000)}s
            </span>
          </div>
        )}
      </div>

      {/* Hover indicator */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-xs text-white/40 group-hover:text-blue-400 transition-colors">
          Click for details →
        </p>
      </div>
    </div>
  );
}

function AgentDetailModal({ agent, onClose }: { agent: any; onClose: () => void }) {
  const formatLastActivity = (ms: number | null) => {
    if (!ms) return 'Never active';
    return new Date(ms).toLocaleString();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-card rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{agent.agentId}</h2>
              <p className="text-white/60 text-sm">Agent Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-stat-card rounded-xl p-4">
              <div className="text-xs text-white/60 mb-1">Status</div>
              <div className="text-lg font-semibold text-white capitalize">{agent.status}</div>
            </div>
            <div className="glass-stat-card rounded-xl p-4">
              <div className="text-xs text-white/60 mb-1">Total Sessions</div>
              <div className="text-lg font-semibold text-white">{agent.sessionCount}</div>
            </div>
            <div className="glass-stat-card rounded-xl p-4">
              <div className="text-xs text-white/60 mb-1">Active Sessions</div>
              <div className="text-lg font-semibold text-white">{agent.activeSessions}</div>
            </div>
            <div className="glass-stat-card rounded-xl p-4">
              <div className="text-xs text-white/60 mb-1">Default Agent</div>
              <div className="text-lg font-semibold text-white">{agent.isDefault ? 'Yes' : 'No'}</div>
            </div>
          </div>

          <div className="glass-stat-card rounded-xl p-4">
            <div className="text-xs text-white/60 mb-2">Configuration</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Workspace</span>
                <span className="text-white/95 font-mono text-xs">{agent.workspace}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Last Activity</span>
                <span className="text-white/95">{formatLastActivity(agent.lastActivityMs)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Heartbeat</span>
                <span className="text-white/95">
                  {agent.heartbeat.enabled ? `Every ${Math.floor(agent.heartbeat.intervalMs / 1000)}s` : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {agent.status === 'busy' && (
            <div className="glass-card rounded-xl p-4 border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Currently Active</span>
              </div>
              <p className="text-white/70 text-sm">
                This agent is currently processing tasks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
