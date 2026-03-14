#!/usr/bin/env node
/**
 * Example: simple benchmark using BenchPipe
 */
import { start, event } from '../src/index.js';

// Simulate workload
event({ name: 'startup', tags: { phase: 'init' } });

const t1 = start('load_data');
// Fake loading
await new Promise(r => setTimeout(r, 150));
t1.end({ tags: { rows: 1000 } });

const t2 = start('process');
await new Promise(r => setTimeout(r, 80));
t2.end({ tags: { items: 500 } });

event({ name: 'done', tags: { success: true } });
