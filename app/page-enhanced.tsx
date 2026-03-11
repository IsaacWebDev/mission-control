'use client';

import { Users, Bot, Play, AlertCircle, Server, Shield, Archive, Terminal } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-5">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard title="Active Sessions" value={4} max={68} icon={Users} type="sessions" />
        <StatCard title="Agents Online" value={0} max={5} icon={Bot} type="agents" />
        <StatCard title="Tasks Running" value={0} max={12} icon={Play} type="tasks" />
        <StatCard title="Errors 24h" value={0} icon={AlertCircle} type="errors" />
      </div>

      {/* System Panels Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <SystemHealthCard />
        <SecurityAuditCard />
        <BackupPipelinesCard />
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <SessionsCard />
        <RecentLogsCard />
      </div>

      {/* Action Bar */}
      <ActionBar />
    </div>
  );
}

// Helper function to determine status color based on value and type
function getStatStatus(value: number, type: string, max?: number): 'success' | 'warning' | 'error' | 'neutral' {
  if (type === 'errors') {
    if (value === 0) return 'success';
    if (value < 5) return 'warning';
    return 'error';
  }
  
  if (type === 'agents' || type === 'sessions') {
    if (value === 0) return 'neutral';
    return 'success';
  }
  
  if (type === 'tasks') {
    if (value === 0) return 'neutral';
    if (max && value / max > 0.8) return 'warning';
    return 'success';
  }
  
  return 'neutral';
}

function getStatusColor(status: 'success' | 'warning' | 'error' | 'neutral'): string {
  const colors = {
    success: 'text-[#10b981]',
    warning: 'text-[#fbbf24]',
    error: 'text-[#f87171]',
    neutral: 'text-[#9ca3af]'
  };
  return colors[status];
}

function StatCard({ title, value, max, icon: Icon, type }: any) {
  const status = getStatStatus(value, type, max);
  const colorClass = getStatusColor(status);

  const borderColors: any = {
    success: 'border-t-[#10b981]',
    warning: 'border-t-[#fbbf24]',
    error: 'border-t-[#f87171]',
    neutral: 'border-t-[#9ca3af]'
  };

  return (
    <div className={`glass-stat-card rounded-xl border-t-[3px] ${borderColors[status]} p-5 h-[110px]`}>
      <Icon className={`w-5 h-5 ${colorClass} mb-3`} />
      <div className="flex items-baseline gap-1">
        <div className={`text-3xl font-semibold ${colorClass}`}>{value}</div>
        {max && <div className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>/ {max}</div>}
      </div>
      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{title}</div>
    </div>
  );
}

function ProgressBar({ label, value, max, unit = 'GB' }: { label: string; value: number; max: number; unit?: string }) {
  const percentage = (value / max) * 100;
  let status: 'success' | 'warning' | 'error' = 'success';
  
  if (percentage >= 90) status = 'error';
  else if (percentage >= 70) status = 'warning';

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{value}{unit} / {max}{unit}</span>
      </div>
      <div className="progress-track">
        <div 
          className={`progress-fill-enhanced status-${status}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SystemHealthCard() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
          <Server className="w-4 h-4" />
          System Health
        </h3>
        <span className="status-badge status-success">
          ● Online
        </span>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Gateway</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span>
            <span style={{ color: 'rgba(255,255,255,0.95)' }}>online (42ms)</span>
          </div>
        </div>
        
        <ProgressBar label="Memory" value={2.4} max={8} />
        
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Disk</span>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>45GB / 500GB (9%)</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Uptime</span>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>7d 4h 23m</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>DB Size</span>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>1.2 GB</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Errors</span>
          <span className="text-[#fbbf24] font-semibold">2</span>
        </div>
      </div>
    </div>
  );
}

function SecurityAuditCard() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
          <Shield className="w-4 h-4" />
          Security & Audit
        </h3>
        <span className="status-badge-md status-error">
          6 failed logins
        </span>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Audit Events</span>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>247</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Login Failures</span>
          <span className="text-[#f87171] font-semibold">3</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Activities</span>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>1,423</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Webhooks</span>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>5 active</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Notifications</span>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>2 unread</span>
        </div>
      </div>
    </div>
  );
}

function BackupPipelinesCard() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
        <Archive className="w-4 h-4" />
        Backup & Pipelines
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Latest Backup</span>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>2 hours ago</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Active Pipelines</span>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>3</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Pipeline Runs</span>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>127 today</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Tasks by Status</span>
          <span className="text-[#10b981] font-semibold">12 running</span>
        </div>
      </div>
    </div>
  );
}

function SessionsCard() {
  const sessions = [
    { id: 'sess_abc123', status: 'active', type: 'agent:frontend', time: '2 min ago' },
    { id: 'sess_def456', status: 'idle', type: 'agent:ux-researcher', time: '15 min ago' },
    { id: 'sess_ghi789', status: 'active', type: 'user:main', time: '1 hour ago' }
  ];

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>Sessions (3)</h3>
      <div className="space-y-3">
        {sessions.map(s => (
          <div key={s.id} className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-3">
              <div className="text-xs font-mono overflow-wrap break-word" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.id}</div>
              <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.95)' }}>{s.type}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`status-badge ${
                s.status === 'active' ? 'status-success' : 'status-neutral'
              }`}>
                {s.status}
              </span>
              <span className="text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentLogsCard() {
  const logs = [
    { time: '05:32', level: 'info', msg: 'Frontend agent completed task' },
    { time: '05:18', level: 'warn', msg: 'High memory usage detected' },
    { time: '05:10', level: 'info', msg: 'Session started: agent:ux-researcher' },
    { time: '05:02', level: 'error', msg: 'API rate limit exceeded' }
  ];

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
        <Terminal className="w-4 h-4" />
        Recent Logs
      </h3>
      <div className="space-y-2">
        {logs.map((log, i) => (
          <div key={i} className="log-entry">
            <span className="log-time">{log.time}</span>
            <span className={`log-level log-level-${log.level}`}>
              {log.level.toUpperCase()}
            </span>
            <span className="log-message">{log.msg}</span>
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

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Spawn Agent', sub: 'Create new' },
          { label: 'View Logs', sub: 'Console' },
          { label: 'Task Board', sub: 'Kanban' },
          { label: 'Memory', sub: 'Search' },
          { label: 'Orchestration', sub: 'Flows' }
        ].map(btn => (
          <button 
            key={btn.label}
            onClick={() => handleAction(btn.label, btn.sub)}
            className="action-button"
          >
            <span className="action-button-label">{btn.label}</span>
            <span className="action-button-sublabel">{btn.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
