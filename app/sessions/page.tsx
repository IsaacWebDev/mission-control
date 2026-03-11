'use client';

import { useState } from 'react';
import { Activity, Clock, MessageSquare, User, X, Filter, ChevronDown } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import { StatusBadge } from '@/components/StatusBadge';
import type { Session } from '@/lib/types';

type TimeRange = 'all' | '1h' | '2h' | '6h' | '24h';

export default function SessionsPage() {
  const [activeOnly, setActiveOnly] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [timeRange, setTimeRange] = useState<TimeRange>('2h');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Calculate active threshold in ms
  const getActiveThreshold = () => {
    switch (timeRange) {
      case '1h': return 60 * 60 * 1000;
      case '2h': return 2 * 60 * 60 * 1000;
      case '6h': return 6 * 60 * 60 * 1000;
      case '24h': return 24 * 60 * 60 * 1000;
      default: return undefined;
    }
  };

  const { data, isLoading, error } = useSessions({
    agentId: selectedAgent || undefined,
    active: activeOnly ? getActiveThreshold() : undefined,
  });

  if (isLoading) {
    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold text-white mb-6">Sessions</h1>
        <div className="glass-card rounded-xl p-6 animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-700/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold text-white mb-6">Sessions</h1>
        <div className="glass-card rounded-xl p-6 border-red-500/20">
          <p className="text-red-400">Failed to load sessions: {error.message}</p>
        </div>
      </div>
    );
  }

  const sessions = data?.sessions || [];
  const activeCount = sessions.length;
  const totalCount = data?.total || sessions.length;

  // Get unique agents from sessions
  const uniqueAgents: string[] = Array.from(new Set(sessions.map((s: any) => s.agentId).filter((id: any): id is string => typeof id === 'string')));

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <p className="text-white/60 text-sm mt-1">
            {activeCount} active · {totalCount} total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Active Toggle */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <button
              onClick={() => setActiveOnly(!activeOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeOnly
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              {activeOnly ? 'Active Only' : 'All Sessions'}
            </button>
          </div>

          {/* Time Range */}
          {activeOnly && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Within:</span>
              <div className="flex gap-2">
                {(['1h', '2h', '6h', '24h', 'all'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      timeRange === range
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {range === 'all' ? 'All' : range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Agent Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">Agent:</span>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500/50"
            >
              <option value="">All Agents</option>
              {uniqueAgents.map((agentId) => (
                <option key={agentId} value={agentId}>
                  {agentId}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      {sessions.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Activity className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">No sessions found</p>
          <p className="text-white/40 text-sm mt-2">
            {activeOnly ? 'Try expanding the time range or viewing all sessions' : 'No sessions exist yet'}
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase">
                    Session ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase">
                    Agent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase">
                    Started
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase">
                    Channel
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session: any) => (
                  <SessionRow
                    key={session.key}
                    session={session}
                    onClick={() => setSelectedSession(session)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}

function SessionRow({ session, onClick }: { session: any; onClick: () => void }) {
  const formatDuration = (ageMs: number) => {
    const minutes = Math.floor(ageMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const formatStartTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 24) return new Date(timestamp).toLocaleDateString();
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const isActive = session.ageMs < 2 * 60 * 60 * 1000; // 2 hours

  // Extract channel from session key (e.g., "agent:main:telegram:...")
  const extractChannel = (key: string) => {
    const parts = key.split(':');
    return parts[2] || 'unknown';
  };

  const channel = extractChannel(session.key);

  return (
    <tr
      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="px-4 py-3">
        <div className="font-mono text-xs text-white/90" title={session.sessionId}>
          {session.sessionId?.slice(0, 16)}...
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-white/95 font-medium">{session.agentId}</div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge
          status={isActive ? 'healthy' : 'info'}
          label={isActive ? 'Active' : 'Idle'}
          pulse={isActive}
          className="text-[10px]"
        />
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-white/70">
          {formatStartTime(session.updatedAt || Date.now())}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-white/70 font-mono">
          {formatDuration(session.ageMs)}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
          {channel}
        </span>
      </td>
      <td className="px-4 py-3">
        <ChevronDown className="w-4 h-4 text-white/40" />
      </td>
    </tr>
  );
}

function SessionDetailModal({ session, onClose }: { session: any; onClose: () => void }) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours % 24 > 0) parts.push(`${hours % 24}h`);
    if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
    if (seconds % 60 > 0) parts.push(`${seconds % 60}s`);

    return parts.join(' ') || '0s';
  };

  const extractChannel = (key: string) => {
    const parts = key.split(':');
    return parts[2] || 'unknown';
  };

  const isActive = session.ageMs < 2 * 60 * 60 * 1000;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-card rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Session Details</h2>
              <p className="text-white/60 text-sm font-mono">{session.sessionId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div className={`rounded-xl p-4 mb-6 ${
          isActive ? 'bg-green-500/10 border border-green-500/20' : 'bg-gray-500/10 border border-gray-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <StatusBadge
              status={isActive ? 'healthy' : 'info'}
              label={isActive ? 'Active Session' : 'Idle Session'}
              pulse={isActive}
            />
            <span className="text-white/70 text-sm">
              {isActive ? 'Currently processing messages' : 'No recent activity'}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-stat-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white/60">Agent</span>
            </div>
            <div className="text-lg font-semibold text-white">{session.agentId}</div>
          </div>

          <div className="glass-stat-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white/60">Channel</span>
            </div>
            <div className="text-lg font-semibold text-white capitalize">
              {extractChannel(session.key)}
            </div>
          </div>

          <div className="glass-stat-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-white/60">Duration</span>
            </div>
            <div className="text-lg font-semibold text-white font-mono">
              {formatDuration(session.ageMs)}
            </div>
          </div>

          <div className="glass-stat-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white/60">Status</span>
            </div>
            <div className="text-lg font-semibold text-white">
              {isActive ? 'Active' : 'Idle'}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="glass-stat-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white/90 mb-3">Session Metadata</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Session Key</span>
              <span className="text-white/90 font-mono text-xs">{session.key}</span>
            </div>
            {session.createdAt && (
              <div className="flex justify-between items-center">
                <span className="text-white/60">Created</span>
                <span className="text-white/90">{formatDate(session.createdAt)}</span>
              </div>
            )}
            {session.updatedAt && (
              <div className="flex justify-between items-center">
                <span className="text-white/60">Last Updated</span>
                <span className="text-white/90">{formatDate(session.updatedAt)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-white/60">Age</span>
              <span className="text-white/90">{formatDuration(session.ageMs)}</span>
            </div>
          </div>
        </div>

        {/* Future: Transcript Section */}
        <div className="glass-card rounded-xl p-4 mt-4 border-dashed border-white/10">
          <h3 className="text-sm font-semibold text-white/70 mb-2">Transcript</h3>
          <p className="text-white/50 text-sm text-center py-4">
            Transcript viewing coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
