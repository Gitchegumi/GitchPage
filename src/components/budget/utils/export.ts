import {
  BudgetData,
  IncomeItem,
  DebtItem,
  BillItem,
  allocateIncomeToHalves,
  allocateExpensesToHalves,
} from "../types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

/**
 * Format number as currency
 */
function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Export budget data as CSV
 */
export function exportToCSV(data: BudgetData) {
  // All rows share the same column schema so Papa.unparse always emits a full header row.
  // N/A fields are left as empty strings.
  const incomes = data.incomes.map((inc) => ({
    Type: "Income",
    Name: inc.name,
    Category: "",
    Frequency: inc.frequency,
    Amounts: inc.amounts.join(";"),
    Monthly: inc.monthlyAmount,
    InterestRate: "",
    PayDay: inc.payDate ?? "",
    Paid: "",
    Balance: "",
    Limit: "",
  }));

  const debts = data.debts.map((d) => ({
    Type: "Debt",
    Name: d.name,
    Category: d.category,
    Frequency: "",
    Amounts: "",
    Monthly: d.monthlyAmount,
    InterestRate:
      d.interestRate != null ? parseFloat(d.interestRate.toFixed(4)) : "",
    PayDay: d.dueBy ?? "",
    Paid: d.paid ? "Yes" : "No",
    Balance: d.balance ?? "",
    Limit: d.availableCredit ?? "",
  }));

  const bills = data.bills.map((b) => ({
    Type: "Bill",
    Name: b.name,
    Category: b.category,
    Frequency: "",
    Amounts: "",
    Monthly: b.monthlyAmount,
    InterestRate: "",
    PayDay: b.dueBy ?? "",
    Paid: b.paid ? "Yes" : "No",
    Balance: "",
    Limit: "",
  }));

  const combined = [...incomes, ...debts, ...bills];
  const csv = Papa.unparse(combined);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `budget_${data.month}.csv`);
  link.click();
}

/**
 * Export budget data as Excel
 */
export async function exportToExcel(data: BudgetData) {
  // Lazy load ExcelJS only when this function is called (client-side only)
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();

  // Income Sheet
  const incomeWS = wb.addWorksheet("Income");
  incomeWS.columns = [
    { header: "Name", key: "name", width: 30 },
    { header: "Frequency", key: "frequency", width: 15 },
    { header: "Amounts", key: "amounts", width: 20 },
    {
      header: "Monthly Amount",
      key: "monthlyAmount",
      width: 15,
      style: { numFmt: "$#,##0.00" },
    },
    { header: "Pay Day", key: "payDate", width: 10 },
  ];
  data.incomes.forEach((inc) => {
    incomeWS.addRow({
      name: inc.name,
      frequency: inc.frequency,
      amounts: inc.amounts.join(", "),
      monthlyAmount: inc.monthlyAmount,
      payDate: inc.payDate ?? "",
    });
  });

  // Debts Sheet
  const debtsWS = wb.addWorksheet("Debts");
  debtsWS.columns = [
    { header: "Name", key: "name", width: 30 },
    { header: "Category", key: "category", width: 15 },
    {
      header: "Monthly Payment",
      key: "monthlyAmount",
      width: 15,
      style: { numFmt: "$#,##0.00" },
    },
    {
      header: "Balance",
      key: "balance",
      width: 15,
      style: { numFmt: "$#,##0.00" },
    },
    { header: "Interest Rate (%)", key: "interestRate", width: 15 },
    {
      header: "Limit (CC)",
      key: "availableCredit",
      width: 15,
      style: { numFmt: "$#,##0.00" },
    },
    { header: "Due Day", key: "dueBy", width: 10 },
    { header: "Paid", key: "paid", width: 8 },
  ];
  data.debts.forEach((d) => {
    debtsWS.addRow({
      name: d.name,
      category: d.category,
      monthlyAmount: d.monthlyAmount,
      balance: d.balance ?? "",
      interestRate: d.interestRate ?? "",
      availableCredit: d.availableCredit ?? "",
      dueBy: d.dueBy ?? "",
      paid: d.paid ? "Yes" : "No",
    });
  });

  // Bills Sheet
  const billsWS = wb.addWorksheet("Bills");
  billsWS.columns = [
    { header: "Name", key: "name", width: 30 },
    { header: "Category", key: "category", width: 15 },
    {
      header: "Amount",
      key: "monthlyAmount",
      width: 15,
      style: { numFmt: "$#,##0.00" },
    },
    { header: "Due Day", key: "dueBy", width: 10 },
    { header: "Paid", key: "paid", width: 8 },
  ];
  data.bills.forEach((b) => {
    billsWS.addRow({
      name: b.name,
      category: b.category,
      monthlyAmount: b.monthlyAmount,
      dueBy: b.dueBy ?? "",
      paid: b.paid ? "Yes" : "No",
    });
  });

  // Generate and download
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `budget_${data.month}.xlsx`);
  link.click();
}

/**
 * Export budget data as PDF
 */
export function exportToPDF(data: BudgetData) {
  const doc = new jsPDF();

  const totalIncome = data.incomes.reduce((sum, i) => sum + i.monthlyAmount, 0);
  const totalBills = data.bills.reduce((sum, b) => sum + b.monthlyAmount, 0);
  const totalDebtPayments = data.debts.reduce(
    (sum, d) => sum + d.monthlyAmount,
    0,
  );
  const totalDebtBalance = data.debts.reduce(
    (sum, d) => sum + (d.balance ?? 0),
    0,
  );
  const expendable = totalIncome - totalBills - totalDebtPayments;

  // Half-month totals logic
  const incHalves = allocateIncomeToHalves(data.incomes);
  const billHalves = allocateExpensesToHalves(data.bills);
  const debtHalves = allocateExpensesToHalves(data.debts);

  const h1 = {
    income: incHalves.firstHalf,
    bills: billHalves.firstHalf,
    debts: debtHalves.firstHalf,
    get expendable() {
      return this.income - this.bills - this.debts;
    },
  };
  const h2 = {
    income: incHalves.secondHalf,
    bills: billHalves.secondHalf,
    debts: debtHalves.secondHalf,
    get expendable() {
      return this.income - this.bills - this.debts;
    },
  };

  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text(`Budget Report: ${data.month}`, 14, 20);

  // Helper to draw a summary card (Top row: 5 cards)
  const drawCard = (
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    value: number,
    color: [number, number, number],
  ) => {
    doc.setDrawColor(220, 220, 220); // Border color
    doc.setFillColor(250, 250, 250); // Background color
    doc.roundedRect(x, y, w, h, 2, 2, "FD");

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(label.toUpperCase(), x + 3, y + 7);

    doc.setFontSize(13);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`$${fmt(value)}`, x + 3, y + 17);
    doc.setFont("helvetica", "normal");
  };

  // Draw 5 Monthly Summary Cards (Grid-like)
  const cardsGap = 3;
  const cardW = (182 - cardsGap * 4) / 5;
  const cardH = 22;
  const summaryY = 28;

  drawCard(
    14,
    summaryY,
    cardW,
    cardH,
    "Total Income",
    totalIncome,
    [34, 197, 94],
  ); // Green
  drawCard(
    14 + (cardW + cardsGap),
    summaryY,
    cardW,
    cardH,
    "Total Bills",
    totalBills,
    [251, 146, 60],
  ); // Orange
  drawCard(
    14 + (cardW + cardsGap) * 2,
    summaryY,
    cardW,
    cardH,
    "Debts",
    totalDebtPayments,
    [248, 113, 113],
  ); // Red
  drawCard(
    14 + (cardW + cardsGap) * 3,
    summaryY,
    cardW,
    cardH,
    "Expendable",
    expendable,
    expendable >= 0 ? [16, 185, 129] : [248, 113, 113],
  );
  drawCard(
    14 + (cardW + cardsGap) * 4,
    summaryY,
    cardW,
    cardH,
    "Debt Balance",
    totalDebtBalance,
    [250, 204, 21],
  ); // Yellow

  // Period Breakdown Cards (2 columns)
  const breakdownY = summaryY + cardH + 8;
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "bold");
  doc.text("Period Overview", 14, breakdownY);
  doc.setFont("helvetica", "normal");

  const drawHalfCard = (
    x: number,
    y: number,
    w: number,
    label: string,
    income: number,
    bills: number,
    debts: number,
    exp: number,
  ) => {
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(250, 250, 250);
    const h = 32;
    doc.roundedRect(x, y, w, h, 2, 2, "FD");

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "bold");
    doc.text(label, x + 4, y + 7);
    doc.setFont("helvetica", "normal");

    const row = (
      ry: number,
      label: string,
      val: number,
      c: [number, number, number],
      bold = false,
    ) => {
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(label, x + 4, ry);
      doc.setTextColor(c[0], c[1], c[2]);
      if (bold) doc.setFont("helvetica", "bold");
      doc.text(`$${fmt(val)}`, x + w - 4, ry, { align: "right" });
      doc.setFont("helvetica", "normal");
    };

    row(y + 14, "Income", income, [34, 197, 94]);
    row(y + 19, "Bills", bills, [251, 146, 60]);
    row(y + 24, "Debts", debts, [248, 113, 113]);

    doc.setDrawColor(230, 230, 230);
    doc.line(x + 4, y + 26, x + w - 4, y + 26);
    row(
      y + 30,
      "Expendable",
      exp,
      exp >= 0 ? [16, 185, 129] : [248, 113, 113],
      true,
    );
  };

  const halfGap = 6;
  const halfW = (182 - halfGap) / 2;
  const halfY = breakdownY + 4;
  drawHalfCard(
    14,
    halfY,
    halfW,
    "1st – 14th",
    h1.income,
    h1.bills,
    h1.debts,
    h1.expendable,
  );
  drawHalfCard(
    14 + halfW + halfGap,
    halfY,
    halfW,
    "15th – End of Month",
    h2.income,
    h2.bills,
    h2.debts,
    h2.expendable,
  );

  let currentY = halfY + 40;

  // Income Table
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text("Income Details", 14, currentY);
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Name", "Frequency", "Pay Day", "Monthly Total"]],
    body: data.incomes.map((inc) => [
      inc.name,
      inc.frequency,
      inc.payDate || "—",
      `$${fmt(inc.monthlyAmount)}`,
    ]),
    headStyles: { fillColor: [46, 125, 50] }, // Green
  });
  currentY = (doc as any).lastAutoTable.finalY + 15;

  // Debts Table
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  doc.text("Debt Details", 14, currentY);
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Name", "Category", "Payment", "Balance", "Paid"]],
    body: data.debts.map((d) => [
      d.name,
      d.category,
      `$${fmt(d.monthlyAmount)}`,
      d.balance !== null ? `$${fmt(d.balance)}` : "—",
      d.paid ? "Yes" : "No",
    ]),
    headStyles: { fillColor: [198, 40, 40] }, // Red
  });
  currentY = (doc as any).lastAutoTable.finalY + 15;

  // Bills Table
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  doc.text("Bill Details", 14, currentY);
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Name", "Category", "Due Day", "Amount", "Paid"]],
    body: data.bills.map((b) => [
      b.name,
      b.category,
      b.dueBy || "—",
      `$${fmt(b.monthlyAmount)}`,
      b.paid ? "Yes" : "No",
    ]),
    headStyles: { fillColor: [239, 108, 0] }, // Orange
  });

  doc.save(`budget_${data.month}.pdf`);
}

/**
 * Download CSV Template
 */
export function downloadTemplate() {
  const template = [
    {
      Type: "Income",
      Name: "Main Salary",
      Frequency: "monthly",
      Amounts: "5000",
      PayDay: "1",
      Paid: "",
      Balance: "",
      Limit: "",
    },
    {
      Type: "Debt",
      Name: "Credit Card",
      Category: "Credit Card",
      Monthly: "100",
      PayDay: "15",
      Paid: "No",
      Balance: "2000",
      Limit: "5000",
    },
    {
      Type: "Bill",
      Name: "Rent",
      Category: "Rent/Mortgage",
      Monthly: "1500",
      PayDay: "1",
      Paid: "No",
      Balance: "",
      Limit: "",
    },
  ];

  const csv = Papa.unparse(template);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "budget_template.csv");
  link.click();
}

/**
 * Import from CSV
 */
export function importFromCSV(
  file: File,
  onComplete: (data: Partial<BudgetData>) => void,
) {
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      const incomes: IncomeItem[] = [];
      const debts: DebtItem[] = [];
      const bills: BillItem[] = [];

      results.data.forEach((row: any) => {
        const type = row.Type;
        if (type === "Income") {
          incomes.push({
            id: crypto.randomUUID(),
            name: row.Name || "Unnamed Income",
            frequency: row.Frequency || "monthly",
            amounts: (row.Amounts || "0").split(";").map(Number),
            monthlyAmount: parseFloat(row.Monthly) || 0,
            payDate: parseInt(row.PayDay) || null,
          });
        } else if (type === "Debt") {
          debts.push({
            id: crypto.randomUUID(),
            name: row.Name || "Unnamed Debt",
            category: row.Category || "Other",
            monthlyAmount: parseFloat(row.Monthly) || 0,
            interestRate: parseFloat(row.InterestRate) || null,
            dueBy: parseInt(row.PayDay) || null,
            paid: row.Paid === "Yes",
            balance: parseFloat(row.Balance) || null,
            availableCredit: parseFloat(row.Limit) || null,
          });
        } else if (type === "Bill") {
          bills.push({
            id: crypto.randomUUID(),
            name: row.Name || "Unnamed Bill",
            category: row.Category || "Other",
            monthlyAmount: parseFloat(row.Monthly) || 0,
            dueBy: parseInt(row.PayDay) || null,
            paid: row.Paid === "Yes",
          });
        }
      });

      onComplete({ incomes, debts, bills });
    },
  });
}
