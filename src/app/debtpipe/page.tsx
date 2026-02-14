"use client";

import { useEffect } from "react";

// Extend Window interface for external scripts
declare global {
  interface Window {
    lucide?: {
      createIcons: () => void;
    };
    html2pdf?: () => {
      set: (options: {
        margin: number;
        filename: string;
        image: { type: string; quality: number };
        html2canvas: { scale: number; useCORS: boolean; letterRendering: boolean; scrollY: number; scrollX: number };
        jsPDF: { unit: string; format: string; orientation: string };
        pagebreak: { mode: string[] };
      }) => {
        from: (content: string) => {
          save: () => void;
        };
      };
    };
  }
}

export default function DebtPipePage() {
  useEffect(() => {
    // Load external scripts once component mounts
    const loadScript = (src: string) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };

    loadScript('https://cdn.tailwindcss.com');
    loadScript('https://cdn.jsdelivr.net/npm/chart.js');
    loadScript('https://unpkg.com/lucide@latest');
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');

    // Initialize Lucide icons after scripts load
    const initIcons = () => {
      if (window.lucide) {
        window.lucide.createIcons();
      }
    };
    setTimeout(initIcons, 1000);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
              <i data-lucide="banknote" className="text-white"></i>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">DebtPipe</h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-400 font-medium">Unlimited Debt Payoff Simulator</div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column: Inputs */}
          <div className="xl:col-span-1 space-y-6">
            <section className="glass p-6 rounded-2xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-400">
                <i data-lucide="settings-2" className="w-4 h-4"></i> Settings
              </h2>
              <div className="space-y-4 text-sm font-medium text-slate-300">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">Start Date</label>
                  <input type="month" id="startDate" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">Method</label>
                  <select id="method" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                    <option value="snowball">Snowball (Smallest First)</option>
                    <option value="avalanche">Avalanche (Highest Rate First)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">Extra Monthly Payment ($)</label>
                  <input type="number" id="extra" defaultValue={500} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-emerald-400" />
                </div>
              </div>
            </section>

            <section className="glass p-6 rounded-2xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-400">
                <i data-lucide="list" className="w-4 h-4"></i> Debt Data
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => document.getElementById('csvInput')?.click()}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-2.5 flex items-center justify-center gap-2 transition-all group text-xs font-bold text-white"
                  >
                    <i data-lucide="upload" className="w-4 h-4 group-hover:text-emerald-400"></i> Upload
                  </button>
                  <button
                    onClick={downloadTemplate}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-2.5 flex items-center justify-center gap-2 transition-all group text-xs font-bold text-white"
                    title="Download CSV Template"
                  >
                    <i data-lucide="download" className="w-4 h-4 group-hover:text-blue-400"></i>
                  </button>
                </div>
                <input type="file" id="csvInput" className="hidden" accept=".csv,.tsv,.txt" onChange={handleFileUpload} />

                <div>
                  <div className="flex justify-between items-center mb-1 px-1">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Manual Entry Format</label>
                    <span className="text-[9px] text-slate-600 italic">Name, Bal, Rate, Min, [Day]</span>
                  </div>
                  <textarea
                    id="debtData"
                    rows={10}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-white"
                    placeholder="Name, Balance, Rate, Min, [DueDay]"
                    defaultValue={`
Credit Card A, 5000, 18.99, 150, 15
Personal Loan, 12000, 8.5, 350, 1
Car Loan, 8000, 5.0, 250, 28
Student Loan, 25000, 6.2, 200, 10
Mortgage, 180000, 4.75, 900, 1`.trim()}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={runSimulation}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                  >
                    <i data-lucide="play" className="w-4 h-4 fill-current"></i> Run
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    title="Export Plan to PDF"
                  >
                    <i data-lucide="file-text" className="w-4 h-4 text-emerald-400"></i>
                  </button>
                  <button
                    onClick={clearData}
                    className="bg-slate-800 hover:bg-rose-900/30 text-slate-500 hover:text-rose-400 p-3 rounded-xl transition-all border border-slate-700 text-white"
                    title="Clear All Data"
                  >
                    <i data-lucide="trash-2" className="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Results */}
          <div className="xl:col-span-3 space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass p-5 rounded-2xl border-l-4 border-emerald-500">
                <div className="text-[10px] uppercase text-slate-500 font-extrabold mb-1 tracking-widest">Time to Freedom</div>
                <div className="text-2xl font-bold text-white" id="metric-months">0 Months</div>
                <div className="text-xs text-slate-400" id="metric-date">Payoff Date: --</div>
              </div>
              <div className="glass p-5 rounded-2xl border-l-4 border-amber-500">
                <div className="text-[10px] uppercase text-slate-500 font-extrabold mb-1 tracking-widest">Total Interest</div>
                <div className="text-2xl font-bold text-amber-400" id="metric-interest">$0.00</div>
                <div className="text-xs text-slate-400">Paid to banks</div>
              </div>
              <div className="glass p-5 rounded-2xl border-l-4 border-rose-500">
                <div className="text-[10px] uppercase text-slate-500 font-extrabold mb-1 tracking-widest">Total Cost</div>
                <div className="text-2xl font-bold text-rose-400" id="metric-total">$0.00</div>
                <div className="text-xs text-slate-400">Principal + Interest</div>
              </div>
              <div className="glass p-5 rounded-2xl border-l-4 border-blue-500">
                <div className="text-[10px] uppercase text-slate-500 font-extrabold mb-1 tracking-widest">Monthly Flow</div>
                <div className="text-2xl font-bold text-blue-400" id="metric-budget">$0.00</div>
                <div className="text-[10px] text-slate-400" id="metric-flow-split">Split: --</div>
              </div>
            </div>

            {/* Main Chart */}
            <section className="glass p-6 rounded-2xl h-[350px]">
              <canvas id="payoffChart"></canvas>
            </section>

            {/* Schedule Section */}
            <section className="glass rounded-2xl overflow-hidden">
              <div className="border-b border-slate-700/50 flex bg-slate-800/30">
                <button onClick={() => switchTab('milestones')} id="tab-milestones" className="p-4 px-6 text-sm font-bold transition-all tab-active">
                  Milestones
                </button>
                <button onClick={() => switchTab('timeline')} id="tab-timeline" className="p-4 px-6 text-sm font-bold text-slate-400 hover:text-white transition-all">
                  Full Timeline View
                </button>
              </div>

              {/* Milestones View */}
              <div id="view-milestones" className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] tracking-widest font-bold">
                      <tr>
                        <th className="p-4">Payoff Order</th>
                        <th className="p-4">Debt Name</th>
                        <th className="p-4 text-center">Interest Rate</th>
                        <th className="p-4 text-center">Month #</th>
                        <th className="p-4 text-right">Target Date</th>
                      </tr>
                    </thead>
                    <tbody id="milestonesBody" className="divide-y divide-slate-700/50 text-slate-300 text-center">
                      {/* Dynamic */}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline View (Transposed) */}
              <div id="view-timeline" className="p-0 hidden">
                <div className="overflow-auto max-h-[600px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead id="timelineHeader" className="bg-slate-800 text-slate-400 uppercase text-[10px] tracking-widest sticky top-0 z-20 text-center">
                      {/* Month/Date Headers */}
                    </thead>
                    <tbody id="timelineBody" className="divide-y divide-slate-700/50 text-slate-400 text-center">
                      {/* Rows: Debts, X-Axis: Months */}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          let chartInstance = null;
          let lastResult = null;

          window.onload = () => {
            const now = new Date();
            document.getElementById('startDate').value = now.toISOString().slice(0, 7);
            
            const savedData = localStorage.getItem('debtpipe_data');
            const savedExtra = localStorage.getItem('debtpipe_extra');
            const savedMethod = localStorage.getItem('debtpipe_method');
            const savedStart = localStorage.getItem('debtpipe_start');
            
            if (savedData) document.getElementById('debtData').value = savedData;
            if (savedExtra) document.getElementById('extra').value = savedExtra;
            if (savedMethod) document.getElementById('method').value = savedMethod;
            if (savedStart) document.getElementById('startDate').value = savedStart;
            
            lucide.createIcons();
            runSimulation();
          };

          function switchTab(view) {
            const mTab = document.getElementById('tab-milestones');
            const tTab = document.getElementById('tab-timeline');
            const mView = document.getElementById('view-milestones');
            const tView = document.getElementById('view-timeline');

            if (view === 'milestones') {
              mTab.classList.add('tab-active'); mTab.classList.remove('text-slate-400');
              tTab.classList.remove('tab-active'); tTab.classList.add('text-slate-400');
              mView.classList.remove('hidden');
              tView.classList.add('hidden');
            } else {
              tTab.classList.add('tab-active'); tTab.classList.remove('text-slate-400');
              mTab.classList.remove('tab-active'); mTab.classList.add('text-slate-400');
              tView.classList.remove('hidden');
              mView.classList.add('hidden');
            }
          }

          function handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target.result;
              const rows = text.split(/\\r?\\n/).filter(r => r.trim());
              const cleanData = rows.map(r => {
                const separator = r.includes('\\t') ? '\\t' : ',';
                return r.split(separator).map(cell => cell.trim().replace(/[$,]/g, '')).join(', ');
              }).join('\\n');
              document.getElementById('debtData').value = cleanData;
              runSimulation();
            };
            reader.readAsText(file);
          }

          function clearData() {
            if (confirm("Clear all data and reset?")) {
              localStorage.clear();
              location.reload();
            }
          }

          function downloadTemplate() {
            const headers = "Name, Balance, Interest Rate (Decimal), Min Payment, Due Day (Optional)\\n";
            const example = "Credit Card A, 5000, 0.1899, 150, 15\\nPersonal Loan, 12000, 0.085, 350, 1\\nCar Loan, 8000, 0.05, 250, 28";
            const blob = new Blob([headers + example], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', ''); a.setAttribute('href', url); a.setAttribute('download', 'DebtPipe_Template.csv');
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }

          function runSimulation() {
            const rawData = document.getElementById('debtData').value;
            const extraPayment = parseFloat(document.getElementById('extra').value) || 0;
            const method = document.getElementById('method').value;
            const startVal = document.getElementById('startDate').value;

            localStorage.setItem('debtpipe_data', rawData);
            localStorage.setItem('debtpipe_extra', extraPayment);
            localStorage.setItem('debtpipe_method', method);
            localStorage.setItem('debtpipe_start', startVal);

            const baseDate = new Date(startVal + '-01T12:00:00');

            // 1. Parse
            const debts = rawData.trim().split('\\n').map(line => {
              const parts = line.split(',').map(s => s.trim());
              let rate = parseFloat(parts[2]);
              if (rate < 1 && rate > 0) rate = rate * 100;
              return {
                name: parts[0],
                balance: parseFloat(parts[1]),
                interestRate: rate || 0,
                minPayment: parseFloat(parts[3]),
                dueDay: parseInt(parts[4]) || 1
              };
            }).filter(d => !isNaN(d.balance) && !isNaN(d.minPayment));

            if (debts.length === 0) return;

            const firstHalfMins = debts.filter(d => d.dueDay <= 14).reduce((sum, d) => sum + d.minPayment, 0);
            const secondHalfMins = debts.filter(d => d.dueDay > 14).reduce((sum, d) => sum + d.minPayment, 0);
            const monthlyBudget = extraPayment + firstHalfMins + secondHalfMins;

            // 2. Sort
            const prioritizedDebts = [...debts];
            if (method === "snowball") {
              prioritizedDebts.sort((a, b) => a.balance - b.balance);
            } else {
              prioritizedDebts.sort((a, b) => b.interestRate - a.interestRate);
            }

            // 3. Simulation Loop
            let currentMonth = 0;
            let totalInterestPaid = 0;
            const initialPrincipal = debts.reduce((sum, d) => sum + d.balance, 0);
            
            const timeline = [];
            const milestones = [];
            let currentDebts = JSON.parse(JSON.stringify(prioritizedDebts));

            while (currentDebts.some(d => d.balance > 0) && currentMonth < 600) {
              currentMonth++;
              let budget = monthlyBudget;
              const monthDate = new Date(baseDate);
              monthDate.setMonth(baseDate.getMonth() + currentMonth - 1);
              const dateStr = monthDate.toLocaleString('default', { month: 'short', year: 'numeric' });

              const snapshot = { month: currentMonth, date: dateStr, balances: {}, payments: {}, interests: {}, total: 0 };

              currentDebts.forEach(d => {
                let interest = 0;
                if (d.balance > 0) {
                  interest = d.balance * ((d.interestRate / 100) / 12);
                  totalInterestPaid += interest;
                  d.balance += interest;
                }
                snapshot.interests[d.name] = interest;
              });

              currentDebts.forEach(d => {
                let paid = 0;
                if (d.balance > 0) {
                  paid = Math.min(d.balance, d.minPayment);
                  d.balance -= paid;
                  budget -= paid;
                }
                snapshot.payments[d.name] = paid;
              });

              for (let d of currentDebts) {
                if (d.balance > 0 && budget > 0) {
                  const extra = Math.min(d.balance, budget);
                  d.balance -= extra;
                  budget -= extra;
                  snapshot.payments[d.name] += extra;
                }
                snapshot.balances[d.name] = d.balance;
                snapshot.total += d.balance;
                if (d.balance <= 0 && !milestones.find(m => m.name === d.name)) {
                  milestones.push({ name: d.name, month: currentMonth, date: dateStr, rate: d.interestRate });
                }
              }
              timeline.push(snapshot);
            }

            // Store for PDF
            lastResult = {
              metrics: {
                months: currentMonth,
                date: new Date(baseDate).setMonth(baseDate.getMonth() + currentMonth - 1),
                interest: totalInterestPaid,
                total: initialPrincipal + totalInterestPaid,
                budget: monthlyBudget,
                split: \`1-14th: $\${(extraPayment + firstHalfMins).toLocaleString()} | 15th+: $\${secondHalfMins.toLocaleString()}\`
              },
              milestones: milestones,
              timeline: timeline,
              debtNames: prioritizedDebts.map(d => d.name),
              method: method,
              extra: extraPayment
            };

            // UI Update
            document.getElementById('metric-months').innerText = \`\${currentMonth} Months\`;
            const finalDate = new Date(lastResult.metrics.date);
            document.getElementById('metric-date').innerText = \`Payoff Date: \${finalDate.toLocaleString('default', { month: 'long', year: 'numeric' })}\`;
            document.getElementById('metric-interest').innerText = \`$\${totalInterestPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}\`;
            document.getElementById('metric-total').innerText = \`$\${lastResult.metrics.total.toLocaleString(undefined, {minimumFractionDigits: 2})}\`;
            document.getElementById('metric-budget').innerText = \`$\${monthlyBudget.toLocaleString()}\`;
            document.getElementById('metric-flow-split').innerText = lastResult.metrics.split;

            renderMilestones(milestones, prioritizedDebts);
            renderTimelineTransposed(timeline, lastResult.debtNames);
            updateChart(timeline);
          }

          function renderMilestones(milestones, allDebts) {
            const payoffOrder = milestones.map(m => m.name);
            const remaining = allDebts.filter(d => !payoffOrder.includes(d.name)).map(d => d.name);
            const combined = [...milestones, ...remaining.map(name => ({ name, month: '--', date: '--', rate: allDebts.find(d => d.name === name).interestRate }))];

            document.getElementById('milestonesBody').innerHTML = combined.map((m, i) => \`
                <tr className="hover:bg-slate-800/30 transition-colors border-b border-slate-700/30">
                  <td className="p-4 text-slate-500 font-mono">#\${i + 1}</td>
                  <td className="p-4 font-bold text-white">\${m.name}</td>
                  <td className="p-4 text-center text-slate-400 font-medium">\${m.rate.toFixed(2)}%</td>
                  <td className="p-4 text-center font-medium">\${m.month}</td>
                  <td className="p-4 text-right text-emerald-400 font-extrabold">\${m.date}</td>
                </tr>
              \`).join('');
          }

          function renderTimelineTransposed(timeline, debtNames) {
            const headerRow = \`<tr><th className="p-3 bg-slate-800 sticky-col z-30 min-w-[150px] border-b border-slate-600">Debt Name</th>\` + 
                timeline.map(step => \`<th className="p-3 text-center border-l border-slate-700/50 min-w-[110px] border-b border-slate-600">\${step.date}</th>\`).join('') + \`</tr>\`;
            document.getElementById('timelineHeader').innerHTML = headerRow;

            document.getElementById('timelineBody').innerHTML = debtNames.map(name => \`
                <tr className="hover:bg-slate-800/20 group">
                  <td className="p-3 font-bold text-slate-200 sticky-col z-10 group-hover:bg-slate-800 transition-colors border-b border-slate-700/30 text-left">\${name}</td>
                  \${timeline.map(step => {
                    const bal = step.balances[name];
                    const paid = step.payments[name];
                    const interest = step.interests[name];
                    const isZero = bal <= 0 && (timeline[timeline.indexOf(step)-1]?.balances[name] > 0 || timeline.indexOf(step) === 0);
                    return \`
                      <td className="p-3 text-center border-l border-slate-700/30 border-b border-slate-700/30 \${isZero ? 'bg-emerald-900/20' : ''}">
                        <div className="\${bal <= 0 ? 'text-emerald-500 font-bold' : 'text-slate-300'}">\${bal <= 0 ? 'PAID' : '$' + Math.round(bal).toLocaleString()}</div>
                        \${paid > 0 ? \`<div className="text-[10px] text-emerald-400 font-bold mt-1">Pay $\${Math.round(paid).toLocaleString()}</div>\` : ''}
                        \${interest > 0 ? \`<div className="text-[9px] text-rose-500/80 font-medium italic">Int. $\${Math.round(interest).toLocaleString()}</div>\` : ''}
                      </td>
                    \`;
                  }).join('')}
                </tr>
              \`).join('');
          }

          function updateChart(timeline) {
            const ctx = document.getElementById('payoffChart').getContext('2d');
            if (chartInstance) chartInstance.destroy();
            chartInstance = new Chart(ctx, {
              type: 'line',
              data: {
                labels: timeline.map(d => d.date),
                datasets: [{
                  label: 'Total Debt',
                  data: timeline.map(d => d.total),
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true,
                  tension: 0.4,
                  borderWidth: 3,
                  pointRadius: 0
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#64748b', callback: v => '$' + v.toLocaleString() }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', autoSkip: true, maxTicksLimit: 12 }
                  }
                },
                plugins: { legend: { display: false } }
              }
            });
          }

          function exportToPDF() {
            if (!lastResult) return alert("Run simulation first.");

            const html = \`
                <div style="font-family: Arial, sans-serif; color: #334155; padding: 15px; background: white; width: 950px;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-bottom: 15px;">
                        <div>
                            <h1 style="font-size: 20pt; margin: 0; color: #0f172a; font-weight: 900;">DebtPipe</h1>
                            <p style="color: #10b981; font-weight: bold; margin: 1px 0 0 0; text-transform: uppercase; font-size: 8pt;">by Gitchegumi</p>
                        </div>
                        <div style="text-align: right; font-size: 8pt; color: #64748b;">
                            <p style="margin: 0;">Plan Generated: \${new Date().toLocaleDateString()}</p>
                            <p style="margin: 1px 0 0 0;">Method: \${lastResult.method.toUpperCase()} | Extra: $\${lastResult.extra}/mo</p>
                        </div>
                    </div>

                    <!-- Metrics Grid -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
                        <div style="border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; background: #f8fafc;">
                            <div style="font-size: 6.5pt; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Time to Freedom</div>
                            <div style="font-size: 12pt; font-weight: bold; color: #0f172a;">\${lastResult.metrics.months} Months</div>
                            <div style="font-size: 6.5pt; color: #64748b;">Payoff: \${new Date(lastResult.metrics.date).toLocaleString('default', { month: 'short', year: 'numeric' })}</div>
                        </div>
                        <div style="border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; background: #f8fafc;">
                            <div style="font-size: 6.5pt; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Total Interest</div>
                            <div style="font-size: 12pt; font-weight: bold; color: #f43f5e;">$\${Math.round(lastResult.metrics.interest).toLocaleString()}</div>
                            <div style="font-size: 6.5pt; color: #64748b;">Paid to banks</div>
                        </div>
                        <div style="border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; background: #f8fafc;">
                            <div style="font-size: 6.5pt; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Total Cost</div>
                            <div style="font-size: 12pt; font-weight: bold; color: #0f172a;">$\${Math.round(lastResult.metrics.total).toLocaleString()}</div>
                            <div style="font-size: 6.5pt; color: #64748b;">Principal + Interest</div>
                        </div>
                        <div style="border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; background: #f8fafc;">
                            <div style="font-size: 6.5pt; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Monthly Flow</div>
                            <div style="font-size: 12pt; font-weight: bold; color: #0f172a;">$\${Math.round(lastResult.metrics.budget).toLocaleString()}</div>
                            <div style="font-size: 6.5pt; color: #64748b;">Total Budget</div>
                        </div>
                    </div>

                    <!-- Milestones -->
                    <h2 style="font-size: 12pt; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; margin-bottom: 10px; color: #0f172a;">Payoff Milestones</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background: #f1f5f9; text-align: left; font-size: 7.5pt; color: #475569;">
                                <th style="padding: 6px; border-bottom: 2px solid #e2e8f0;">Priority</th>
                                <th style="padding: 6px; border-bottom: 2px solid #e2e8f0;">Debt Name</th>
                                <th style="padding: 6px; border-bottom: 2px solid #e2e8f0;">Month</th>
                                <th style="padding: 6px; border-bottom: 2px solid #e2e8f0; text-align: right;">Target Date</th>
                            </tr>
                        </thead>
                        <tbody style="font-size: 8pt;">
                            \${lastResult.milestones.map((m, i) => \`
                                <tr style="page-break-inside: avoid;">
                                    <td style="padding: 5px; border-bottom: 1px solid #f1f5f9; color: #94a3b8; font-family: monospace;">#\${String(i+1).padStart(2, '0')}</td>
                                    <td style="padding: 5px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #1e293b;">\${m.name}</td>
                                    <td style="padding: 5px; border-bottom: 1px solid #f1f5f9;">Month \${m.month}</td>
                                    <td style="padding: 5px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #059669; font-weight: bold;">\${m.date}</td>
                                </tr>
                              \`).join('')}
                        </tbody>
                    </table>

                    <!-- Timeline -->
                    <div style="page-break-inside: avoid;">
                        <h2 style="font-size: 12pt; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; margin-bottom: 10px; color: #0f172a;">Full Payoff Timeline (Balances)</h2>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 6pt; table-layout: fixed;">
                                <thead>
                                    <tr style="background: #f1f5f9; color: #475569;">
                                        <th style="padding: 3px; border: 1px solid #e2e8f0; width: 90px; text-align: left;">Debt Name</th>
                                        \${lastResult.timeline.filter((_, index) => index % 3 === 0 || index === lastResult.timeline.length - 1).map(step => \`
                                            <th style="padding: 3px; border: 1px solid #e2e8f0; text-align: center;">\${step.date}</th>
                                        \`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    \${lastResult.debtNames.map(name => \`
                                        <tr style="page-break-inside: avoid;">
                                            <td style="padding: 3px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc; color: #1e293b; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">\${name}</td>
                                            \${lastResult.timeline.filter((_, index) => index % 3 === 0 || index === lastResult.timeline.length - 1).map(step => {
                                                const bal = step.balances[name];
                                                const isPaid = bal <= 0 && (lastResult.timeline[lastResult.timeline.indexOf(step)-1]?.balances[name] > 0 || lastResult.timeline.indexOf(step) === 0);
                                                return \`<td style="padding: 3px; border: 1px solid #e2e8f0; text-align: center; \${isPaid ? 'background: #ecfdf5; color: #059669; font-weight: bold;' : 'color: #64748b;'}">\${bal <= 0 ? 'PAID' : '$' + Math.round(bal).toLocaleString()}</td>\`;
                                            }).join('')}
                                        </tr>
                                      \`).join('')}
                                </tbody>
                            </table>
                        </div>
                        <p style="font-size: 6pt; color: #94a3b8; margin-top: 8px; font-style: italic;">* Timeline sampled every 3 months for readability.</p>
                    </div>
                </div>
            \`;

            // @ts-ignore
            html2pdf().set({
              margin: 10,
              filename: 'DebtPipe_Payoff_Report.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { 
                scale: 2, 
                useCORS: true, 
                letterRendering: true,
                scrollY: 0,
                scrollX: 0
              },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
              pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            }).from(html).save();
          }
        `
      }} />
    </div>
  );
}
