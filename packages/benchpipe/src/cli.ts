#!/usr/bin/env node
/**
 * BenchPipe CLI
 * Usage: benchpipe record [--output file.jsonl] -- command [args...]
 *
 * Runs a child process and collects JSON-line events emitted by benchpipe instrumentation.
 * The child process should import '@gitchpage/benchpipe' and call bench.event() or bench.start().
 */

import { spawn } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Command } from 'commander';

const program = new Command();

program
  .name('benchpipe')
  .description('Benchmark recorder for GitchPage tools')
  .command('record')
  .argument('<command>', 'command to run')
  .argument('[args...]', 'command arguments')
  .option('-o, --output <file>', 'output JSONL file', `bench-${Date.now()}.jsonl`)
  .action(async (command, args, options) => {
    const outputPath = options.output;
    const childArgs = [command, ...args];

    // Ensure output directory exists
    const outDir = process.cwd();
    mkdirSync(outDir, { recursive: true });

    console.error(`[BenchPipe] Recording: ${command} ${args.join(' ')}`);
    console.error(`[BenchPipe] Output: ${outputPath}`);

    const child = spawn(command, childArgs, {
      stdio: ['ignore', 'pipe', 'inherit'],
      env: { ...process.env, BENCHPIPE_RECORDING: '1' }
    });

    const lines: string[] = [];
    let buffer = '';

    child.stdout?.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      process.stdout.write(text); // passthrough
      buffer += text;
      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        if (line.trim().startsWith('{') && line.trim().endsWith('}')) {
          lines.push(line.trim());
        }
      }
    });

    child.on('close', (code) => {
      // Write JSONL file
      writeFileSync(outputPath, lines.join('\n'));
      console.error(`\n[BenchPipe] Saved ${lines.length} events to ${outputPath}`);
      process.exit(code ?? 0);
    });

    child.on('error', (err) => {
      console.error('[BenchPipe] Failed to start:', err);
      process.exit(1);
    });
  });

program.parse();
