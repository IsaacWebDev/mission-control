'use client';

import { Users, Bot, Play, AlertCircle, Server, Shield, Archive, Terminal, Check, X, Zap, Eye, Layers } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { useHealth } from '@/hooks/useHealth';
import { useSessions } from '@/hooks/useSessions';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { AgentHealthInfo, SystemHealth, Session } from '@/lib/types';

function DashboardContent() {
  const { data: health, isLoading: healthLoading, error: healthError } = useHealth();
  const { data: sessionsData, isLoading: sessionsLoading } = useSessions({ active: true });

  // Loading state
  if (healthLoading || sessionsLoading) {
    return (
      <div className="p-5">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-stat-card rounded-xl p-5 h-[110px] animate-pulse">
              <div className="h-5 bg-gray-700/50 rounded mb-4 w-1/3"></div>
              <div className="h-8 bg-gray-700/50 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-white/70 text-center">Loading Mission Control data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (healthError || !health) {
    return (
      <div className="p-5">
        <div className="glass-card rounded-2xl p-6 border-red-500/20">
          <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Connection Error
          </h3>
          <p className="text-gray-400 mb-4">
            Failed to connect to OpenClaw Gateway. Check if the gateway is running.
          </p>
          <div className="space-y-2 text-sm text-gray-400 mb-4">
            <p>• Run: <code className="bg-gray-800 px-2 py-1 rounded">openclaw gateway status</code></p>
            <p>• Start: <code className="bg-gray-800 px-2 py-1 rounded">openclaw gateway run</code></p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="glass-button px-4 py-2 rounded-lg"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Calculate metrics from real data
  const agentCount = health.agents?.length || 0;
  const activeAgents = health.agents?.filter((a: AgentHealthInfo) => {
    const lastActivity = a.sessions.recent[0]?.updatedAt;
    if (!lastActivity) return false;
    const ageMs = Date.now() - lastActivity;
    return ageMs < 5 * 60 * 1000; // Active in last 5 minutes
  }).length || 0;

  const totalSessions = health.agents?.reduce(
    (sum: number, agent: AgentHealthInfo) => sum + (agent.sessions?.count || 0), 
    0
  ) || 0;

  const activeSessions = sessionsData?.active || 0;

  const channelCount = Object.keys(health.channels || {}).length;
  const runningChannels = Object.values(health.channels || {}).filter(
    (ch: any) => ch.running
  ).length;

  // Error count - for now, mock (would need logs API)
  const errorCount = 0;

  return (
    <div className="p-5">
      {/* Stats Row - Real Data */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard 
          title="Active Sessions" 
          value={activeSessions.toString()} 
          max={totalSessions.toString()} 
          icon={Users} 
          color="blue"
          status={activeSessions > 0 ? "healthy" : "info"}
          statusText={activeSessions > 0 ? `${activeSessions} active` : "No active sessions"}
        />
        <StatCard 
          title="Agents Online" 
          value={activeAgents.toString()} 
          max={agentCount.toString()} 
          icon={Bot} 
          color="purple"
          status={activeAgents > 0 ? "healthy" : "warning"}
          statusText={`${agentCount} total agents`}
        />
        <StatCard 
          title="Errors 24h" 
          value={errorCount.toString()} 
          icon={errorCount === 0 ? Check : AlertCircle} 
          color={errorCount === 0 ? "green" : "red"}
          status={errorCount === 0 ? "healthy" : "critical"}
          statusText={errorCount === 0 ? "No errors detected" : `${errorCount} errors`}
        />
      </div>

      {/* System Panels Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <SystemHealthCard health={health} />
        <ChannelsCard health={health} />
        <AgentStatsCard health={health} />
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <SessionsCard sessions={sessionsData?.sessions || []} />
        <RecentLogsCard />
      </div>

      {/* Action Bar */}
      <ActionBar />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  max?: string;
  icon: React.ElementType;
  color: 'blue' | 'purple' | 'amber' | 'green' | 'red';
  status: 'critical' | 'warning' | 'healthy' | 'info';
  statusText: string;
}

function StatCard({ title, value, max, icon: Icon, color, status, statusText }: StatCardProps) {
  const borderColors: Record<StatCardProps['color'], string> = {
    blue: 'border-t-blue-500',
    purple: 'border-t-purple-500',
    amber: 'border-t-amber-500',
    green: 'border-t-green-500',
    red: 'border-t-red-500'
  };

  const textColors: Record<StatCardProps['color'], string> = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    green: 'text-green-400',
    red: 'text-red-400'
  };

  const IconComponent = value === "0" && status === "healthy" ? Check : Icon;

  return (
    <div className={`glass-stat-card rounded-xl border-t-[3px] ${borderColors[color]} p-5 h-[110px] flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <IconComponent className={`w-5 h-5 ${textColors[color]}`} />
        <StatusBadge status={status} label={statusText} className="text-[10px]" />
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <div className={`text-3xl font-semibold ${textColors[color]}`}>{value}</div>
          {max && <div className="text-sm text-white/50">/ {max}</div>}
        </div>
        <div className="text-xs text-white/70 mt-1 font-medium">{title}</div>
      </div>
    </div>
  );
}

function SystemHealthCard({ health }: { health: SystemHealth }) {
  const isHealthy = health?.ok || false;
  const uptime = "7d 4h 23m"; // TODO: Calculate from health.ts
  
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/95 flex items-center gap-2">
          <Server className="w-4 h-4" />
          System Health
        </h3>
        <StatusBadge 
          status={isHealthy ? "healthy" : "critical"} 
          label={isHealthy ? "Online" : "Offline"} 
          pulse={isHealthy} 
        />
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-white/70 font-medium">Gateway</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isHealthy ? 'text-green-400' : 'text-red-400'}`}>
              {isHealthy ? 'online' : 'offline'}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/70 font-medium">Total Agents</span>
          <span className="text-white/95 font-medium">{health?.agents?.length || 0}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/70 font-medium">Channels</span>
          <span className="text-white/95 font-medium">{Object.keys(health?.channels || {}).length}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/70 font-medium">Response Time</span>
          <span className="text-white/95 font-mono text-sm">{health?.durationMs ? `${health.durationMs}ms` : 'N/A'}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/70 font-medium">Heartbeat</span>
          <span className="text-white/95 text-sm">{health?.heartbeatSeconds ? `${health.heartbeatSeconds}s` : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}

function ChannelsCard({ health }: { health: SystemHealth }) {
  const channels: Record<string, { configured: boolean; running: boolean }> = health?.channels || {};
  const channelEntries = Object.entries(channels).map(([name, data]) => ({
    id: name,
    name,
    status: data.running ? 'connected' : 'disconnected',
    running: data.running,
    configured: data.configured,
  }));
  
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/95 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Channels
        </h3>
        <StatusBadge 
          status="info" 
          label={`${channelEntries.length} configured`} 
          className="text-[10px]" 
        />
      </div>
      <div className="space-y-3">
        {channelEntries.slice(0, 5).map((channel) => (
          <div key={channel.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium capitalize text-white/95">{channel.name}</div>
              <div className="text-xs text-white/40">
                {channel.status === 'connected' ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            <StatusBadge 
              status={channel.status === 'connected' ? "healthy" : "info"}
              label={channel.status === 'connected' ? "Connected" : "Disconnected"}
              pulse={channel.status === 'connected'}
              className="text-[10px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentStatsCard({ health }: { health: SystemHealth }) {
  const agents = health?.agents || [];
  const defaultAgent = agents.find((a) => a.isDefault);
  const totalSessions = agents.reduce((sum: number, a) => sum + a.sessions.count, 0);
  
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/95 flex items-center gap-2">
          <Bot className="w-4 h-4" />
          Agent Stats
        </h3>
        <StatusBadge status="info" label={`${agents.length} agents`} className="text-[10px]" />
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-white/70 font-medium">Default Agent</span>
          <span className="text-white/95 font-medium">{defaultAgent?.agentId || 'none'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70 font-medium">Total Sessions</span>
          <span className="text-white/95 font-medium">{totalSessions}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70 font-medium">Subagents</span>
          <span className="text-white/95 font-medium">
            {agents.filter((a) => a.agentId.includes('subagent:')).length}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70 font-medium">Heartbeat Enabled</span>
          <span className="text-white/95 font-medium">
            {agents.filter((a) => a.heartbeat?.enabled).length}
          </span>
        </div>
      </div>
    </div>
  );
}

function SessionsCard({ sessions }: { sessions: Session[] }) {
  const displaySessions = sessions.slice(0, 3);
  
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/95">Active Sessions ({sessions.length})</h3>
        <StatusBadge status="info" label={`${sessions.length} active`} className="text-[10px]" />
      </div>
      <div className="space-y-3">
        {displaySessions.length === 0 ? (
          <p className="text-white/50 text-sm text-center py-4">No active sessions</p>
        ) : (
          displaySessions.map((s) => {
            const ageMinutes = Math.floor((s.ageMs || 0) / 60000);
            const timeAgo = ageMinutes < 60 
              ? `${ageMinutes}m ago` 
              : `${Math.floor(ageMinutes / 60)}h ago`;
            
            return (
              <div key={s.sessionId} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-white/50 truncate" title={s.sessionId}>
                    {s.sessionId?.slice(0, 12)}...
                  </div>
                  <div className="text-sm text-white/95 mt-1 font-medium">{s.agentId}</div>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <StatusBadge 
                    status="healthy" 
                    label="active"
                    pulse={true}
                    className="text-[10px]"
                  />
                  <span className="text-xs text-white/50 whitespace-nowrap">{timeAgo}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function RecentLogsCard() {
  // TODO: Implement real-time logs with SSE
  const logs = [
    { time: '05:32:14', level: 'info', msg: 'Health check completed', context: 'gateway' },
    { time: '05:30:42', level: 'info', msg: 'Session activity detected', context: 'agent:main' },
  ];

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white/95 flex items-center gap-2 mb-4">
        <Terminal className="w-4 h-4" />
        Recent Logs
      </h3>
      <div className="space-y-3 font-mono text-xs">
        {logs.map((log, i) => (
          <div key={i} className="grid grid-cols-[auto_1fr] gap-3 items-start">
            <time className="text-white/50 tabular-nums">{log.time}</time>
            <div className="flex items-start gap-2 min-w-0">
              <StatusBadge 
                status={
                  log.level === 'error' ? 'critical' :
                  log.level === 'warn' ? 'warning' :
                  'info'
                }
                label={log.level.toUpperCase()}
                className="flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90 leading-relaxed">
                  {log.msg}
                </p>
                {log.context && (
                  <span className="text-white/40 text-xs">{log.context}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBar() {
  const handleAction = (action: string, description: string) => {
    console.log(`[Mission Control] ${action} clicked`);
    alert(`🚀 ${action}\n${description}\n\nComing soon...`);
  };

  const actions = [
    { label: 'Spawn Agent', sub: 'Create new', icon: Bot, shortcut: '⌘N' },
    { label: 'View Logs', sub: 'Console', icon: Eye, shortcut: '⌘L' },
    { label: 'Tasks', sub: 'Kanban', icon: Layers, shortcut: '⌘T' },
    { label: 'Execute', sub: 'Run command', icon: Zap, shortcut: '⌘E' },
    { label: 'Memory', sub: 'Search', icon: Archive, shortcut: '⌘M' }
  ];

  return (
    <div className="glass-card rounded-2xl p-3">
      <div className="grid grid-cols-5 gap-3">
        {actions.map(btn => (
          <button 
            key={btn.label}
            onClick={() => handleAction(btn.label, btn.sub)}
            className="group glass-button flex flex-col items-center justify-center gap-2 h-20 rounded-xl hover:scale-[1.02] transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <btn.icon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-white/95">{btn.label}</p>
              <p className="text-[10px] text-white/40">{btn.shortcut}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
