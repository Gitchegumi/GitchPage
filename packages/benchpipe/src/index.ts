/**
 * BenchPipe — lightweight benchmarking recorder
 */

export interface BenchEvent {
  type: 'measure' | 'custom';
  name: string;
  timestamp: number; // epoch ms with decimals
  duration_ms?: number;
  memory_rss_kb?: number;
  tags?: Record<string, any>;
}

let eventId = 0;

export function now() {
  return process.hrtime.bigint() / 1_000_000n; // ms as number (float)
}

export function recordMemory() {
  const usage = process.memoryUsage();
  return Math.round(usage.rss / 1024);
}

export function event(partial: Omit<BenchEvent, 'timestamp' | 'type'>) {
  const ev: BenchEvent = {
    type: 'custom',
    timestamp: now(),
    ...partial
  };
  console.log(JSON.stringify(ev));
  return ev;
}

export function start(name: string, tags?: Record<string, any>) {
  const t0 = now();
  const startMem = recordMemory();

  return {
    end: (extraTags?: Record<string, any>) => {
      const t1 = now();
      const endMem = recordMemory();
      const duration = t1 - t0;

      const ev: BenchEvent = {
        type: 'measure',
        name,
        timestamp: startMem,
        duration_ms: duration,
        memory_rss_kb: endMem,
        tags: { ...tags, ...extraTags }
      };
      console.log(JSON.stringify(ev));
      return ev;
    },
    // Also allow manual timing without end
    elapsed: () => now() - t0
  };
}

// Convenience: measure async function
export async function measure<T>(name: string, fn: () => Promise<T>, tags?: Record<string, any>): Promise<T> {
  const timer = start(name, tags);
  try {
    return await fn();
  } finally {
    timer.end();
  }
}
