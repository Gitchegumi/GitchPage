Guard against duplicate column insertion in streaming updates for the replay dashboard (PR #81 follow-up).

What changed:
- Add existence checks for timestamp_utc, direction, center, height, index, time_str in the main replay setup
- Ensure update_chart() does not re-insert columns; only streams data
- Ensure on_reset() rebuilds the data source without duplicating columns
- Added fallback-safe code paths to handle repeated restarts

Branch: issue/80-duckdb-viz-refactor

This patch stabilizes the replay UI under repeated restarts and rate-limit scenarios, enabling reliable pagination of OHLCV, indicators, and trades in the DebtPipe context as part of PR #81 follow-ups.