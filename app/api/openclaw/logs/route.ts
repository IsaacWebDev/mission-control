import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import type { LogEntry, LogLevel } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * SSE endpoint for real-time log streaming
 * Executes: openclaw logs --follow --format json
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get('level') as LogLevel | null;
  const search = searchParams.get('search');

  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Spawn openclaw logs --follow --format json
      const proc = spawn('openclaw.cmd', ['logs', '--follow', '--format', 'json'], {
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let buffer = '';

      proc.stdout.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const logEntry: LogEntry = JSON.parse(line);

            // Apply filters
            if (level && logEntry.level !== level) continue;
            if (search && !JSON.stringify(logEntry).toLowerCase().includes(search.toLowerCase())) continue;

            // Send SSE event
            const data = `data: ${JSON.stringify(logEntry)}\n\n`;
            controller.enqueue(encoder.encode(data));
          } catch (err) {
            // Not JSON, skip
            console.warn('Non-JSON log line:', line);
          }
        }
      });

      proc.stderr.on('data', (chunk: Buffer) => {
        console.error('openclaw logs stderr:', chunk.toString());
      });

      proc.on('close', (code: number | null) => {
        console.log(`openclaw logs exited with code ${code}`);
        controller.close();
      });

      proc.on('error', (err: Error) => {
        console.error('openclaw logs error:', err);
        controller.close();
      });

      // Cleanup on disconnect
      request.signal.addEventListener('abort', () => {
        proc.kill();
        controller.close();
      });

      // Send heartbeat every 15 seconds
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);

      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
