import { exec } from 'child_process';
import { promisify } from 'util';
import type { SystemHealth, AgentHealthInfo, Agent } from './types';
import { GatewayError } from './errors';
import { logError } from './logging';

const execAsync = promisify(exec);

export interface OpenClawConfig {
  gatewayUrl: string;
  gatewayToken: string;
  timeout: number;
}

export const config: OpenClawConfig = {
  gatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789',
  gatewayToken: process.env.OPENCLAW_GATEWAY_TOKEN || '',
  timeout: 30000, // 30 seconds
};

/**
 * Execute OpenClaw CLI command
 */
export async function execOpenClaw(command: string): Promise<unknown> {
  try {
    // On Windows, use openclaw.cmd instead of openclaw
    const windowsCommand = command.replace(/^openclaw\b/, 'openclaw.cmd');
    
    const { stdout, stderr } = await execAsync(windowsCommand, {
      timeout: config.timeout,
      shell: 'cmd.exe',
    });
    
    if (stderr && !stderr.includes('Debugger')) {
      console.warn('OpenClaw stderr:', stderr);
    }
    
    // Try to parse JSON
    try {
      return JSON.parse(stdout);
    } catch {
      return stdout;
    }
  } catch (error) {
    logError(error, { command });
    
    // Throw structured GatewayError
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ETIMEDOUT') {
      throw new GatewayError('Gateway request timed out');
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new GatewayError(errorMessage);
  }
}

/**
 * Call gateway health endpoint
 */
export async function fetchHealth(): Promise<SystemHealth> {
  const result = await execOpenClaw('openclaw gateway call health --json');
  return result as SystemHealth;
}

/**
 * Fetch sessions
 */
export async function fetchSessions(agentId?: string): Promise<{ count: number; sessions: unknown[] }> {
  const cmd = agentId
    ? `openclaw sessions --agent ${agentId} --json`
    : 'openclaw sessions --all-agents --json';
    
  const result = await execOpenClaw(cmd);
  return result as { count: number; sessions: unknown[] };
}

/**
 * Fetch agents from health response
 */
export async function fetchAgents(): Promise<AgentHealthInfo[]> {
  const health = await fetchHealth();
  return health.agents || [];
}

/**
 * Calculate agent status
 */
export function calculateAgentStatus(
  ageMs: number,
  agentId: string
): 'idle' | 'busy' | 'spawned' {
  if (agentId.includes('subagent:')) return 'spawned';
  if (ageMs < 5 * 60 * 1000) return 'busy'; // 5 minutes
  return 'idle';
}

/**
 * Transform agent health info to agent
 */
export function transformAgent(healthInfo: AgentHealthInfo): Agent {
  const lastActivity = healthInfo.sessions.recent[0]?.updatedAt || null;
  const ageMs = lastActivity ? Date.now() - lastActivity : Infinity;
  
  return {
    agentId: healthInfo.agentId,
    isDefault: healthInfo.isDefault,
    status: calculateAgentStatus(ageMs, healthInfo.agentId),
    sessionCount: healthInfo.sessions.count,
    activeSessions: healthInfo.sessions.recent.filter(
      (s) => (s.age || 0) < 2 * 60 * 60 * 1000
    ).length,
    lastActivityMs: lastActivity,
    heartbeat: {
      enabled: healthInfo.heartbeat.enabled,
      intervalMs: healthInfo.heartbeat.everyMs,
    },
    workspace: healthInfo.sessions.path.replace('/sessions/sessions.json', '').replace('\\sessions\\sessions.json', ''),
  };
}
