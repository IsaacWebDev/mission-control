'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, Pause, Play, Trash2, Filter, Search, X } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import type { LogEntry, LogLevel } from '@/lib/types';

type LogLevelFilter = 'all' | LogLevel;

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [levelFilter, setLevelFilter] = useState<LogLevelFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // SSE connection
  useEffect(() => {
    if (paused) return;

    const params = new URLSearchParams();
    if (levelFilter !== 'all') params.set('level', levelFilter);
    if (searchQuery) params.set('search', searchQuery);

    const url = `/api/openclaw/logs?${params}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const logEntry = JSON.parse(event.data);
        setLogs((prev) => [...prev.slice(-999), logEntry]); // Keep last 1000 logs
      } catch (err) {
        console.error('Failed to parse log entry:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;

    return () => {
      eventSource.close();
    };
  }, [paused, levelFilter, searchQuery]);

  const clearLogs = () => {
    setLogs([]);
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  // Detect manual scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const filteredLogs = logs.filter((log) => {
    if (levelFilter !== 'all' && log.level !== levelFilter) return false;
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(search) ||
        log.source?.toLowerCase().includes(search) ||
        JSON.stringify(log.context || {}).toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="p-5 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-6 h-6" />
            Live Logs
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
            {paused && ' · Paused'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePause}
            className="glass-button px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            {paused ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </button>

          <button
            onClick={clearLogs}
            className="glass-button px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
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
              placeholder="Search logs..."
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

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <div className="flex gap-2">
              {(['all', 'info', 'warn', 'error'] as LogLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setLevelFilter(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    levelFilter === level
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logs Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="glass-card rounded-xl p-4 flex-1 overflow-y-auto font-mono text-xs"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Terminal className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">
              {paused ? 'Logs paused' : 'Waiting for logs...'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log, idx) => (
              <LogEntryRow key={idx} log={log} />
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* Auto-scroll indicator */}
      {!autoScroll && (
        <div className="mt-2 text-center">
          <button
            onClick={() => {
              setAutoScroll(true);
              logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="glass-button px-3 py-1.5 rounded-lg text-xs"
          >
            ↓ Scroll to bottom
          </button>
        </div>
      )}
    </div>
  );
}

function LogEntryRow({ log }: { log: LogEntry }) {
  const [expanded, setExpanded] = useState(false);

  const getLogLevelStatus = (level: string): 'critical' | 'warning' | 'info' | 'healthy' => {
    switch (level.toLowerCase()) {
      case 'error': return 'critical';
      case 'warn': return 'warning';
      case 'info': return 'info';
      default: return 'healthy';
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString('en-US', { hour12: false });
    } catch {
      return ts;
    }
  };

  const hasContext = log.context && Object.keys(log.context).length > 0;

  return (
    <div className="border-l-2 border-white/10 pl-3 py-2 hover:bg-white/5 rounded">
      <div className="flex items-start gap-3">
        <time className="text-white/50 tabular-nums flex-shrink-0 w-20">
          {formatTimestamp(log.timestamp)}
        </time>

        <StatusBadge
          status={getLogLevelStatus(log.level)}
          label={log.level.toUpperCase()}
          className="flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className="text-white/90 leading-relaxed break-words">{log.message}</p>

          {log.source && (
            <span className="text-white/40 text-xs mt-1 inline-block">{log.source}</span>
          )}

          {hasContext && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-400 text-xs mt-1 hover:underline"
            >
              {expanded ? '▼ Hide context' : '▶ Show context'}
            </button>
          )}

          {expanded && hasContext && (
            <pre className="mt-2 p-2 bg-black/30 rounded text-xs text-white/70 overflow-x-auto">
              {JSON.stringify(log.context, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
