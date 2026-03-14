# BenchPipe

Lightweight benchmarking for QuantPipe and GitchPage.

## Usage

### Record a session
```bash
benchpipe record --output run.jsonl -- node script-to-benchmark.js
```

The child process should use the BenchPipe library to emit events. Example:

```js
import { start, event } from '@gitchpage/benchpipe';

// Custom event
event({ name: 'iteration', duration_ms: 123, tags: { size: 1000 } });

// Timer
const timer = start('load_data');
// ... load data ...
timer.end({ tags: { rows: 5000 } });
```

Events are printed as JSON lines and captured by the CLI into `run.jsonl`.

### Analyze
(Coming later: `benchpipe analyze run.jsonl` will output summary statistics with DuckDB.)

## Development

```bash
cd packages/benchpipe
npm install
npm run build
```

## Output format

Each line is a JSON object:

```json
{
  "type": "measure",
  "name": "load_data",
  "timestamp": 1712345678901.123,
  "duration_ms": 456.78,
  "memory_rss_kb": 12345,
  "tags": {}
}
```
