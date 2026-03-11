'use client';

import { useState, useMemo } from 'react';
import { useSessions } from '@/hooks/useSessions';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

/**
 * Task interface based on OpenClaw Task structure
 */
interface Task {
  sessionKey: string;
  agentId: string;
  startedAt: string;
  updatedAt: string;
  ageMs: number;
  state?: 'spawning' | 'running' | 'completing' | 'completed' | 'failed';
  labels?: string[];
  error?: string;
}

type TaskStatus = 'all' | 'running' | 'completed' | 'failed';
type SortBy = 'newest' | 'oldest' | 'agent';

/**
 * Calculate task status based on Task data
 * More sophisticated than simple time-based logic
 */
function getTaskStatus(Task: Task): TaskStatus {
  // Check explicit state if available
  if (Task.state === 'failed' || Task.error) return 'failed';
  if (Task.state === 'completed') return 'completed';
  
  // Fallback to age-based heuristic
  // Active if updated within last 5 minutes OR age < 2 hours
  const recentlyUpdated = Date.now() - new Date(Task.updatedAt).getTime() < 5 * 60 * 1000;
  const youngSession = Task.ageMs < 2 * 60 * 60 * 1000;
  
  if (recentlyUpdated || youngSession) return 'running';
  return 'completed';
}

/**
 * Format duration in human-readable format
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: TaskStatus }) {
  const config = {
    running: {
      label: 'Running',
      className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: Loader2,
      animate: true
    },
    completed: {
      label: 'Completed',
      className: 'bg-green-500/20 text-green-400 border-green-500/30',
      icon: CheckCircle2,
      animate: false
    },
    failed: {
      label: 'Failed',
      className: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: XCircle,
      animate: false
    },
    all: {
      label: 'All',
      className: 'bg-white/10 text-white/60 border-white/20',
      icon: Clock,
      animate: false
    }
  }[status];

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 border rounded ${config.className}`}>
      <Icon className={`w-3 h-3 ${config.animate ? 'animate-spin' : ''}`} />
      {config.label}
    </span>
  );
}

/**
 * Task row component
 */
function TaskRow({ task, onClick }: { task: Task; onClick: () => void }) {
  const status = getTaskStatus(task);
  const age = formatDuration(task.ageMs);

  return (
    <div
      onClick={onClick}
      className="group flex justify-between items-center py-3 px-4 border-b border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/80 text-sm font-medium truncate">
            {task.agentId || 'main'}
          </span>
          {task.labels && task.labels.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">
              {task.labels[0]}
            </span>
          )}
        </div>
        <div className="text-white/50 text-xs truncate font-mono">
          {task.sessionKey}
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        <StatusBadge status={status} />
        <span className="text-white/60 text-xs whitespace-nowrap min-w-[60px] text-right">
          {age}
        </span>
        <Eye className="w-4 h-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

/**
 * Loading skeleton
 */
function TaskSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex justify-between items-center py-3 px-4 border-b border-white/10">
          <div className="flex-1">
            <div className="h-4 bg-white/10 rounded w-32 mb-2" />
            <div className="h-3 bg-white/5 rounded w-64" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 bg-white/10 rounded w-20" />
            <div className="h-4 bg-white/10 rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyState({ status, onReset }: { status: TaskStatus; onReset: () => void }) {
  const message = {
    all: 'No tasks found',
    running: 'No running tasks',
    completed: 'No completed tasks',
    failed: 'No failed tasks'
  }[status];

  return (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
      <p className="text-white/60 text-sm mb-4">{message}</p>
      {status !== 'all' && (
        <button
          onClick={onReset}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          Show all tasks
        </button>
      )}
    </div>
  );
}

/**
 * Error fallback component
 */
function ErrorFallback({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="glass-card p-8 text-center">
      <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
      <h3 className="text-red-400 text-lg font-semibold mb-2">
        Failed to Load Tasks
      </h3>
      <p className="text-white/60 text-sm mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="glass-button px-4 py-2 rounded-lg text-sm text-white/80 hover:text-white transition-colors inline-flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
}

/**
 * Main Tasks Page Component
 */
function TasksPageContent() {
  const { data, isLoading, error, refetch } = useSessions();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 20;

  // Process sessions - map from API Session type to local Task type
  const tasks: Task[] = (data?.sessions || []).map((s: import('@/lib/types').Session) => ({
    sessionKey: s.sessionId || '',
    agentId: s.agentId || 'main',
    startedAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : new Date().toISOString(),
    ageMs: s.ageMs || 0,
    state: s.status === 'active' ? 'running' : 'completed',
    labels: [],
  }));

  // Get unique agents for filter
  const agents = useMemo(() => {
    const agentSet = new Set(tasks.map((s: Task) => s.agentId || 'main'));
    return Array.from(agentSet).sort();
  }, [tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s: Task) => 
        s.agentId?.toLowerCase().includes(query) ||
        s.sessionKey?.toLowerCase().includes(query) ||
        s.labels?.some(l => l.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((s: Task) => getTaskStatus(s) === statusFilter);
    }

    // Agent filter
    if (agentFilter !== 'all') {
      filtered = filtered.filter((s: Task) => (s.agentId || 'main') === agentFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
        case 'oldest':
          return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
        case 'agent':
          return (a.agentId || 'main').localeCompare(b.agentId || 'main');
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, searchQuery, statusFilter, agentFilter, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const running = tasks.filter((s: Task) => getTaskStatus(s) === 'running').length;
    const completed = tasks.filter((s: Task) => getTaskStatus(s) === 'completed').length;
    const failed = tasks.filter((s: Task) => getTaskStatus(s) === 'failed').length;
    return { running, completed, failed, total: tasks.length };
  }, [tasks]);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, agentFilter, sortBy]);

  // Handle error state
  if (error) {
    return <ErrorFallback error={error.message} onRetry={() => refetch()} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Tasks</h1>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="glass-button px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          aria-label="Refresh tasks"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="text-white/60 text-sm mb-1">Running</div>
          <div className="text-white text-2xl font-semibold">{stats.running}</div>
        </div>
        
        <div className="glass-card p-4">
          <div className="text-white/60 text-sm mb-1">Completed</div>
          <div className="text-white text-2xl font-semibold">{stats.completed}</div>
        </div>
        
        <div className="glass-card p-4">
          <div className="text-white/60 text-sm mb-1">Failed</div>
          <div className="text-white text-2xl font-semibold">{stats.failed}</div>
        </div>

        <div className="glass-card p-4">
          <div className="text-white/60 text-sm mb-1">Total</div>
          <div className="text-white text-2xl font-semibold">{stats.total}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full h-9 rounded-lg pl-10 pr-4 text-sm text-white/95"
              aria-label="Search tasks"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus)}
            className="glass-input h-9 rounded-lg px-3 text-sm text-white/95 cursor-pointer"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          {/* Agent filter */}
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="glass-input h-9 rounded-lg px-3 text-sm text-white/95 cursor-pointer"
            aria-label="Filter by agent"
          >
            <option value="all">All Agents</option>
            {agents.map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="glass-input h-9 rounded-lg px-3 text-sm text-white/95 cursor-pointer"
            aria-label="Sort tasks"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="agent">By Agent</option>
          </select>
        </div>

        {/* Active filters indicator */}
        {(searchQuery || statusFilter !== 'all' || agentFilter !== 'all') && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
            <Filter className="w-3 h-3 text-white/50" />
            <span className="text-xs text-white/60">
              {filteredTasks.length} of {tasks.length} tasks
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setAgentFilter('all');
              }}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors ml-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="glass-card">
        {isLoading ? (
          <div className="p-4">
            <TaskSkeleton />
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState 
            status={statusFilter} 
            onReset={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setAgentFilter('all');
            }}
          />
        ) : (
          <>
            <div className="divide-y divide-white/10">
              {paginatedTasks.map((task: Task) => (
                <TaskRow
                  key={task.sessionKey}
                  task={task}
                  onClick={() => setExpandedTask(
                    expandedTask === task.sessionKey ? null : task.sessionKey
                  )}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                <div className="text-xs text-white/60">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="glass-button px-3 py-1.5 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="glass-button px-3 py-1.5 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Wrapped export with ErrorBoundary
 */
export default function TasksPage() {
  return (
    <ErrorBoundary>
      <TasksPageContent />
    </ErrorBoundary>
  );
}
