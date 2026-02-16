# DebtPipe Bill Tracking — Fix Implementation Plan

## Goal
Merge PR #70 functionality into main WITHOUT breaking existing UX.
- Preserve original glassmorphism UI, CSV upload/download, dark theme
- Keep CSV as primary data format (JSON optional in interactive mode only)
- Add bill tracking as an "Interactive Mode" toggle overlay on the timeline
- Custom payments + flow remaining become editable fields when mode is ON

## Changes Required

### 1. HTML/CSS (minimal additions)
- Add toggle switch in toolbar: "Interactive Mode" (checkbox or toggle)
- Add CSS classes for interactive table cells: `.checkbox-cell`, `.payment-input`, `.paid-row`, `.custom-row`
- All existing styles remain unchanged

### 2. JavaScript — New State & Functions
Add these variables after existing declarations:
```javascript
let interactiveMode = false;
let debtBills = []; // static bill defs (from CSV)
let debtCustomPayments = {}; // { "DebtName::monthIdx": amount }
let debtPaymentsPaid = {}; // { "DebtName::monthIdx": boolean }
```

Add these functions:
- `toggleInteractiveMode(on)` — switches view, re-renders timeline
- `loadInteractiveDataFromCSV(csvText)` — populate `debtBills` from CSV parsing
- `recalculateTimeline()` — apply custom payments/carry to `lastResult.timeline`
- `renderInteractiveTimeline()` — table with checkboxes + payment inputs
- `onPaidToggle(debtName, monthIdx)` — update `debtPaymentsPaid` and recalc
- `onCustomPaymentChange(debtName, monthIdx, value)` — update `debtCustomPayments` and recalc
- `exportToJSON()` / `importFromJSON()` — optional advanced usage (not primary)

### 3. JavaScript — Hook into Existing Flow
- In `runSimulation()`: after parsing CSV, also populate `debtBills` for interactive mode
- Save interactive state to localStorage separately (keys: `debtpipe_interactive_data`, `debtpipe_interactive_custom`, `debtpipe_interactive_paid`)
- Load interactive state on page init alongside existing CSV data
- When toggling interactive mode ON, call `recalculateTimeline()` then `renderInteractiveTimeline()`
- When toggling OFF, call original `renderTimelineTransposed()`

### 4. Backward Compatibility
- If interactive mode OFF, page behaves exactly like original (CSV-only, read-only timeline)
- If interactive mode ON, timeline becomes editable but all original buttons (Export PDF, Clear) still work
- No changes to CSV template or upload logic
- Existing localStorage keys (`debtpipe_data`, etc.) untouched

### 5. UX Details
- Toggle switch label: "Interactive Bill Tracking" with help tooltip explaining custom payments
- When interactive mode is ON, add a small note: "Changes below are non-destructive and can be reset by toggling off"
- In interactive table:
  - Each month column has checkbox (indicates manually paid) and number input (custom payment amount)
  - Styling: `.paid-row` (green tint), `.custom-row` (blue tint) to highlight modifications
  - Disable inputs for months before current (optional)

## Patch Structure (files)
```
GitchPage/
  public/debtpipe/index.html        # Modify: add toggle + scripts
  src/app/debtpipe/page.tsx         # Already fine (only container change)
```

## Implementation Steps
1. Restore main-branch index.html (done)
2. Add CSS classes for interactive table (copy from PR, but integrate into existing `<style>` block)
3. Add state variables and localStorage loading for interactive data
4. Implement `toggleInteractiveMode`, `recalculateTimeline`, `renderInteractiveTimeline`
5. Modify `runSimulation` to also set `debtBills` from CSV
6. Add toggle UI element in header or settings panel
7. Wire toggle to switch between `renderTimelineTransposed` and `renderInteractiveTimeline`
8. Test with CSV import → run → toggle interactive → modify payments → verify recalculation
9. Ensure PDF export still works (uses `lastResult.timeline`, which `recalculateTimeline` updates)
10. Commit on `issue/67-debtpipe-bill-tracking` with message "fix: restore original UI, add Interactive Mode toggle for bill tracking features"

## Notes
- Keep the original `renderTimelineTransposed` unchanged; call it when interactiveMode=false
- `recalculateTimeline` should deep-clone `lastResult.timeline` then apply custom adjustments, storing result in a separate variable `interactiveTimeline` that `renderInteractiveTimeline` uses
- Toggle OFF should clear `interactiveTimeline` and revert to original `lastResult.timeline`
- localStorage keys should be namespaced to avoid collision with future features
