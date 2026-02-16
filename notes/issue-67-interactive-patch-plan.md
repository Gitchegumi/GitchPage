# Patch: Restore Original UI, Add Interactive Bill Tracking Toggle

## Overview
- Restores `public/debtpipe/index.html` to main-branch polished UI
- Adds "Interactive Bill Tracking" toggle in header
- Implements custom payments & flow remaining as an overlay mode
- Keeps CSV as primary format; JSON optional via export button

## Implementation

### 1. Header augmentation (after line 54)
Insert before closing `</div>` in header:
```html
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" id="interactiveMode" class="w-4 h-4 accent-emerald-500" />
            <span>Interactive Bill Tracking</span>
          </label>
          <button onclick="downloadJSON()" class="hidden bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 px-3 rounded" title="Export Interactive State (JSON)">JSON Export</button>
        </div>
```

### 2. Additional CSS (after line 44, before `</style>`)
```css
      .checkbox-cell { width: 24px; }
      .payment-input { width: 60px; padding: 2px; border: 1px solid #cbd5e1; border-radius: 4px; text-align: center; background: #1e293b; color: #f8fafc; font-size: 10px; }
      .paid-row { background-color: #064e3b !important; }
      .custom-row { background-color: #1e3a8a !important; }
      .interactive-note { font-size: 11px; color: #94a3b8; margin-top: 6px; font-style: italic; }
```

### 3. Replace window.onload and state variables (after line 343)
Replace existing `window.onload` block with:
```javascript
      let chartInstance = null;
        let lastResult = null; // Globally accessible for PDF
        let interactiveMode = false;
        let debtBills = []; // static bill definitions (from CSV for interactive mode)
        let debtCustomPayments = {}; // { "DebtName::monthIdx": amount }
        let debtPaymentsPaid = {}; // { "DebtName::monthIdx": boolean }
        let interactiveTimeline = null;

        window.onload = () => {
          const now = new Date();
          document.getElementById("startDate").value = now.toISOString().slice(0, 7);

          // Load data from localStorage
          const savedData = localStorage.getItem("debtpipe_data");
          const savedExtra = localStorage.getItem("debtpipe_extra");
          const savedMethod = localStorage.getItem("debtpipe_method");
          const savedStart = localStorage.getItem("debtpipe_start");

          // Load interactive state
          const savedBills = localStorage.getItem('debtBills');
          const savedCustom = localStorage.getItem('debtCustomPayments');
          const savedPaid = localStorage.getItem('debtPaymentsPaid');

          if (savedBills) debtBills = JSON.parse(savedBills);
          if (savedCustom) debtCustomPayments = JSON.parse(savedCustom);
          if (savedPaid) debtPaymentsPaid = JSON.parse(savedPaid);

          if (savedData) document.getElementById("debtData").value = savedData;
          if (savedExtra) document.getElementById("extra").value = savedExtra;
          if (savedMethod) document.getElementById("method").value = savedMethod;
          if (savedStart) document.getElementById("startDate").value = savedStart;

          lucide.createIcons();
          runSimulation();

          // Setup interactive toggle
          const toggle = document.getElementById('interactiveMode');
          if (toggle) {
            toggle.addEventListener('change', (e) => {
              toggleInteractiveMode(e.target.checked);
            });
          }
          // If we have saved custom/paid state, enable interactive automatically
          if (Object.keys(debtCustomPayments).length > 0 || Object.keys(debtPaymentsPaid).length > 0) {
            if (toggle) toggle.checked = true;
            toggleInteractiveMode(true);
          }
        };
```

### 4. Add new interactive functions (insert before `function switchTab`)
```javascript
        // Save interactive state to localStorage
        function saveInteractiveData() {
          localStorage.setItem('debtBills', JSON.stringify(debtBills));
          localStorage.setItem('debtCustomPayments', JSON.stringify(debtCustomPayments));
          localStorage.setItem('debtPaymentsPaid', JSON.stringify(debtPaymentsPaid));
        }

        function toggleInteractiveMode(on) {
          interactiveMode = on;
          const toggle = document.getElementById('interactiveMode');
          if (toggle) toggle.checked = on;

          // Show/hide JSON export button
          const jsonBtn = document.querySelector('button[onclick="downloadJSON()"]');
          if (jsonBtn) jsonBtn.classList.toggle('hidden', !on);

          // Add/remove note in results area
          let note = document.getElementById('interactiveNote');
          if (!note && on) {
            note = document.createElement('div');
            note.id = 'interactiveNote';
            note.className = 'interactive-note';
            const results = document.getElementById('results');
            if (results) results.insertBefore(note, results.firstChild);
          }
          if (note) note.textContent = on
            ? "Interactive Bill Tracking is ON: adjust payments below. Changes persist in browser."
            : "";

          if (!lastResult) return;

          if (on) {
            // If we don't have debtBills yet, try to reconstruct from lastResult
            if (debtBills.length === 0 && lastResult.debtNames) {
              debtBills = lastResult.debtNames.map(name => ({
                name,
                statementBalance: lastResult.timeline[0]?.startingBalances[name] || 0,
                interestRate: 0,
                minPayment: 0,
                dueDay: 1
              }));
            }
            recalculateTimeline();
            renderInteractiveTimeline();
          } else {
            interactiveTimeline = null;
            renderTimelineTransposed(lastResult.timeline, lastResult.debtNames);
          }
        }

        // Recalculate timeline with custom payments
        function recalculateTimeline() {
          if (!lastResult) return;
          interactiveTimeline = JSON.parse(JSON.stringify(lastResult.timeline));

          for (const name of lastResult.debtNames) {
            let carryBalance = 0;
            for (let i = 0; i < interactiveTimeline.length; i++) {
              const step = interactiveTimeline[i];
              const start = step.startingBalances[name] || 0;
              const planned = step.plannedPayments[name] || 0;
              const interest = step.interests[name] || 0;
              const key = `${name}::${i}`;
              const customAmt = debtCustomPayments[key] || 0;
              const isPaid = debtPaymentsPaid[key] === true;

              let actualPaid = 0;
              if (isPaid) {
                actualPaid = customAmt > 0 ? customAmt : planned;
              } else if (customAmt > 0) {
                actualPaid = customAmt;
              } else if (planned > 0) {
                actualPaid = planned;
              }

              let balanceBeforeInterest = carryBalance + start - actualPaid;
              let interestAccrued = 0;
              if (balanceBeforeInterest > 0) {
                interestAccrued = balanceBeforeInterest * (lastResult.rates[name] / 100 / 12);
              }
              let newBalance = balanceBeforeInterest + interestAccrued;

              step.balances[name] = newBalance;
              step.payments[name] = actualPaid;
              step.interests[name] = interestAccrued;

              carryBalance = newBalance > 0 ? newBalance : 0;
            }
          }
        }

        function renderInteractiveTimeline() {
          if (!interactiveTimeline) return;
          const { timeline, debtNames } = lastResult;
          renderTimelineHeader(timeline);
          renderInteractiveBody(interactiveTimeline, debtNames);
        }

        function renderInteractiveBody(timeline, debtNames) {
          const container = document.getElementById('timelineBody');
          container.innerHTML = '';

          debtNames.forEach((name) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-800/20 group';
            tr.innerHTML = `<td class="p-3 font-bold text-slate-200 sticky-col z-10 group-hover:bg-slate-800 transition-colors border-b border-slate-700/30 text-left">${name}</td>`;

            timeline.forEach((step, monthIdx) => {
              const start = step.startingBalances[name] || 0;
              const bal = step.balances[name];
              const planned = step.plannedPayments[name] || 0;
              const key = `${name}::${monthIdx}`;
              const isPaid = debtPaymentsPaid[key] === true;
              const customAmt = debtCustomPayments[key] || 0;
              const isFullyPaid = bal <= 0.01 && start > 0;
              const rowClass = isFullyPaid ? 'paid-row' : (customAmt > 0 ? 'custom-row' : '');

              const cell = document.createElement('td');
              cell.className = `p-3 text-center border-l border-slate-700/30 border-b border-slate-700/30 ${rowClass}`;
              cell.innerHTML = `
                <div style="font-size:9px; color:#94a3b8;">Start $${start.toFixed(2)}</div>
                ${planned > 0 ? `<div class="text-[9px] text-rose-500/80">Min: $${planned.toFixed(2)}</div>` : ''}
                <div style="margin:2px 0;">
                  <input type="checkbox" class="checkbox-cell" ${isPaid ? 'checked' : ''} onchange="onPaidToggle('${name}', ${monthIdx})" title="Mark as paid">
                  <input type="number" step="0.01" min="0" class="payment-input" value="${customAmt.toFixed(2)}" onchange="onCustomPaymentChange('${name}', ${monthIdx}, this.value)" title="Custom payment amount">
                </div>
                <div style="font-weight:bold; color:${bal <= 0 ? '#10b981' : '#f8fafc'};">${bal <= 0 ? 'PAID' : '$' + bal.toFixed(2)}</div>
              `;
              tr.appendChild(cell);
            });

            container.appendChild(tr);
          });
        }

        function onPaidToggle(debtName, monthIdx) {
          const key = `${debtName}::${monthIdx}`;
          debtPaymentsPaid[key] = !debtPaymentsPaid[key];
          saveInteractiveData();
          recalculateTimeline();
          renderInteractiveTimeline();
        }

        function onCustomPaymentChange(debtName, monthIdx, value) {
          const key = `${debtName}::${monthIdx}`;
          const numVal = parseFloat(value) || 0;
          if (numVal <= 0) {
            delete debtCustomPayments[key];
          } else {
            debtCustomPayments[key] = numVal;
          }
          saveInteractiveData();
          recalculateTimeline();
          renderInteractiveTimeline();
        }

        function downloadJSON() {
          if (!lastResult) return;
          const data = {
            original: lastResult,
            custom: debtCustomPayments,
            paid: debtPaymentsPaid,
            modifiedTimeline: interactiveTimeline
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'DebtPipe_Interactive_State.json';
          a.click();
          URL.revokeObjectURL(url);
        }

        // End of interactive functions; existing code follows...
```

### 5. Modify `runSimulation` to populate `debtBills`
After line 449 (just before `if (debts.length === 0) return;`), add:
```javascript
          // Populate debtBills for interactive mode (from CSV)
          debtBills = debts.map(d => ({
            name: d.name,
            statementBalance: d.balance,
            interestRate: d.interestRate,
            minPayment: d.minPayment,
            dueDay: d.dueDay
          }));
          // Also capture rates for interest recalculation
          lastResult.rates = {};
          debts.forEach(d => lastResult.rates[d.name] = d.interestRate);
```

Also modify `runSimulation` to set `lastResult` before calling `renderTimelineTransposed`. Ensure `lastResult` contains `debtNames`, `timeline`, `rates`.

### 6. Ensure `renderTimelineTransposed` receives proper data
No changes needed; it already takes `timeline` and `debtNames`.

### 7. PDF export continues to use original timeline
When interactiveMode is ON, we want the PDF to reflect the modified balances. Update `exportToPDF` to use `interactiveTimeline` if available:
```javascript
        const timelineForPDF = (interactiveMode && interactiveTimeline) ? interactiveTimeline : lastResult.timeline;
        // Then use timelineForPDF in the table generation loop
```

Find where the PDF table rows are built (around line 762) and replace every reference to `timeline` with `timelineForPDF`.

### 8. Reset button should also clear interactive state
In `clearData()` function, add:
```javascript
        debtBills = [];
        debtCustomPayments = {};
        debtPaymentsPaid = {};
        interactiveTimeline = null;
        if (document.getElementById('interactiveMode')) {
          document.getElementById('interactiveMode').checked = false;
        }
        // remove note if present
        const note = document.getElementById('interactiveNote');
        if (note) note.remove();
```

### 9. Toggle OFF should revert to original view
Already handled in `toggleInteractiveMode(false)` by calling `renderTimelineTransposed` with `lastResult.timeline`.

### 10. Commit message
```
fix(debtpipe): restore original UI with interactive bill tracking toggle

- Restore polished glassmorphism design (main-branch index.html)
- Add "Interactive Bill Tracking" toggle in header
- Implement custom payments and paid checkboxes as overlay layer
- Preserve CSV workflows; JSON export optional
- Keep all existing features (PDF export, chart, milestones)
- Fixes usability regression reported in PR #70 feedback
```

## Testing Checklist
- [ ] Original UI appears identical to main (dark theme, glass cards, Tailwind styling)
- [ ] CSV upload and template download work as before
- [ ] Simulation runs and displays timeline correctly
- [ ] Toggling Interactive ON shows checkboxes and payment inputs in timeline table
- [ ] Modifying custom payment recalculates balances on the fly
- [ ] PDF export reflects current (modified) state
- [ ] Toggle OFF restores original read-only table
- [ ] Clear Data resets everything including interactive state
- [ ] JSON export/import (manual import via localStorage) works (optional)

## Notes
- This is a non-breaking additive change. Existing users see no difference unless they enable Interactive Mode.
- All changes confined to `public/debtpipe/index.html`; `page.tsx` remains with container width tweak.
- localStorage keys namespaced (`debtBills`, `debtCustomPayments`, `debtPaymentsPaid`) to avoid collision.
