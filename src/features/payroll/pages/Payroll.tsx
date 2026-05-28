import { useState, useMemo } from "react";
import { Layout } from "@/shared/components/Layout";
import { formatBsDate, formatBsMonthYear } from "@/shared/lib/nepaliDate";
import {
  Download,
  FileSpreadsheet,
  Users,
  TrendingDown,
  Wallet,
  BarChart3,
  X,
} from "lucide-react";
import { usePayrollByDate, usePayrollExport } from "../index";
import { usePayrollSummary } from "../hooks/usePayrollSummary";
import { PayrollEntry } from "../types/payroll.types";
import { usePayrollMarkAsPaid } from "../hooks/usePayrollMarkAsPaid";

/* ─────────────────────── helpers ─────────────────────── */

const formatDate = (dateStr: string) =>
  formatBsDate(dateStr, { weekday: true });

const currentDateStr = () => new Date().toISOString().slice(0, 10);

/* ─────────────────────── field label ─────────────────────── */

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-bold tracking-[.15em] uppercase text-slate-400 mb-1.5">
    {children}
  </label>
);

/* ─────────────────────── main page ─────────────────────── */

export default function Payroll() {
  const [showExportModal, setShowExportModal] = useState(false);
  const selectedDate = currentDateStr();
  const markAsPaid = usePayrollMarkAsPaid();
  const [payingId, setPayingId] = useState<string | null>(null);
  const { data: payrollData, isLoading } = usePayrollByDate(selectedDate);
  const { data: summaryData } = usePayrollSummary(selectedDate);
  const exportPayroll = usePayrollExport();

  const handleExport = async () => {
    try {
      const result = await exportPayroll.mutateAsync(selectedDate);
      const csvContent = result.data;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll-${selectedDate.slice(0, 7)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setShowExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const payroll = useMemo(() => payrollData?.data || [], [payrollData?.data]);
  const summary = useMemo(
    () =>
      summaryData?.data || {
        total_wages: 0,
        total_advances: 0,
        total_net_pay: 0,
      },
    [summaryData?.data],
  );

  const handleMarkPaid = async (entry: PayrollEntry) => {
    if (Number(entry.days_worked_since_last_payment) === 0) return;
    setPayingId(entry.id);
    try {
      await markAsPaid.mutateAsync({
        employee_id: entry.id,
        start_date: entry.calculation_start_date,
        end_date: new Date().toISOString().slice(0, 10),
        amount: Number(entry.net_pay),
        days_paid: entry.days_worked_since_last_payment,
      });
    } finally {
      setPayingId(null);
    }
  };


  /* loading */
  if (isLoading && payroll.length === 0)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-[3px] border-amber-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium tracking-wide">
              Loading payroll…
            </p>
          </div>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">

          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-6 bg-red-500 rounded-full" />
                <span className="text-[10px] font-bold tracking-[.2em] uppercase text-red-600">
                  Construction Management System
                </span>
              </div>
              <h1 className="text-[2rem] font-extrabold text-slate-900 leading-tight tracking-tight">
                Payroll
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Monthly wages, advances, and net pay overview
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Today: {formatDate(currentDateStr())}
              </p>
            </div>
            {payroll.length > 0 && (
              <button
                onClick={() => setShowExportModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Payroll
              </button>
            )}
          </div>

          {/* ── DATE DISPLAY ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                Payroll for {formatBsDate(selectedDate)}
                {selectedDate === currentDateStr() && (
                  <span className="ml-2 text-xs text-slate-500 font-normal">
                    (Current Month)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-slate-400">
                Total Wages
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1.5 tabular-nums leading-none">
               Rs {Number(summary.total_wages).toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Gross earnings</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-amber-500">
                Total Advances
              </p>
              <p className="text-2xl font-extrabold text-amber-600 mt-1.5 tabular-nums leading-none">
                Rs {Number(summary.total_advances).toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Deducted from pay</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-emerald-500">
                Net Pay
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1.5 tabular-nums leading-none">
                Rs {Number(summary.total_net_pay).toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">After deductions</p>
            </div>
          </div>

          {/* ── TABLE ── */}
          {payroll.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* table header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">
                    {payroll.length} Employee{payroll.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Payroll for {formatBsMonthYear(selectedDate)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      {[
                        { label: "Employee", align: "left" },
                        { label: "Role", align: "left" },
                        { label: "Days Worked", align: "center" },
                        { label: "Daily Rate", align: "right" },
                        { label: "Total Wage", align: "right" },
                        { label: "Advance", align: "right" },
                        { label: "Net Pay", align: "right" },
                        { label: "Actions", align: "right" },
                      ].map((col) => (
                        <th
                          key={col.label}
                          className={`px-5 py-3.5 text-${col.align} text-[10px] font-bold tracking-[.15em] uppercase text-slate-400`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {payroll.map((entry: PayrollEntry) => {
                      const initials = entry.name.slice(0, 2).toUpperCase();
                      const netPay = Number(entry.net_pay);
                      const isNegativePay = netPay < 0;

                      return (
                        <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors group">

                          {/* employee */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {initials}
                              </div>
                              <span className="text-sm font-semibold text-slate-800">{entry.name}</span>
                            </div>
                          </td>

                          {/* role */}
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                              {entry.role}
                            </span>
                          </td>

                          {/* days worked — field renamed */}
                          <td className="px-5 py-4 text-center">
                            <span className="text-sm font-bold text-slate-900 tabular-nums">
                              {entry.days_worked_since_last_payment}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1">days</span>
                          </td>

                          {/* daily rate */}
                          <td className="px-5 py-4 text-right">
                            <span className="text-sm text-slate-600 tabular-nums">
                              Rs {Number(entry.daily_rate).toLocaleString("en-IN")}
                            </span>
                          </td>

                          {/* total wage — field renamed */}
                          <td className="px-5 py-4 text-right">
                            <span className="text-sm font-semibold text-slate-800 tabular-nums">
                              Rs {Number(entry.total_wage_earned).toLocaleString("en-IN")}
                            </span>
                          </td>

                          {/* advance */}
                          <td className="px-5 py-4 text-right">
                            {Number(entry.advance) > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-700 tabular-nums">
                                <TrendingDown className="w-3 h-3" />
                                Rs {Number(entry.advance).toLocaleString("en-IN")}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">—</span>
                            )}
                          </td>

                          {/* net pay — handle negative */}
                          <td className="px-5 py-4 text-right">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tabular-nums border
                              ${isNegativePay
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-emerald-50 border-emerald-200 text-emerald-700"
                              }`}>
                              <Wallet className="w-3 h-3" />
                              {isNegativePay ? "-" : ""}Rs {Math.abs(netPay).toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            {entry.days_worked_since_last_payment > 0 ? (
                              <button
                                onClick={() => handleMarkPaid(entry)}
                                disabled={payingId === entry.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
                              >
                                {payingId === entry.id ? 'Saving…' : '✓ Mark as paid'}
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">Paid up to date</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* table footer */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
                <p className="text-[11px] text-slate-400">
                  Showing {payroll.length} record{payroll.length !== 1 ? "s" : ""}
                </p>
                <p className="text-[11px] text-slate-400">
                  Net total&nbsp;
                  <span className="font-bold text-emerald-600">
                    Rs {Number(summary.total_net_pay).toLocaleString("en-IN")}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">
                No payroll data
              </h3>
              <p className="text-sm text-slate-400">
                No payroll records found for {formatBsMonthYear(selectedDate)}
              </p>
            </div>
          )}

          {/* ── FOOTER NOTE ── */}
          <p className="text-center text-[11px] text-slate-400">
            Payroll is calculated from attendance records &nbsp;·&nbsp; Advances are
            deducted from gross wages
          </p>
        </div>
      </div>

      {/* ── EXPORT MODAL ── */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">

            {/* header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                  <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Export Payroll</p>
                  <p className="text-[11px] text-slate-400">
                    Payroll for {formatBsMonthYear(selectedDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* body */}
            <div className="p-6 space-y-5">
              {/* preview */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-[10px] font-bold tracking-[.15em] uppercase text-slate-400">
                    Export Preview
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Employees",
                      value: payroll.length,
                      color: "text-slate-800",
                    },
                    {
                      label: "Total Wages",
                      value: `Rs ${Number(summary.total_wages).toLocaleString("en-IN")}`,
                      color: "text-slate-800",
                    },
                    {
                      label: "Net Pay",
                      value: `Rs ${Number(summary.total_net_pay).toLocaleString("en-IN")}`,
                      color: "text-emerald-700",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[10px] text-slate-400">{item.label}</p>
                      <p
                        className={`text-sm font-extrabold tabular-nums ${item.color}`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* format */}
              <div>
                <FieldLabel>Format</FieldLabel>
                <div className="flex gap-4">
                  {(["csv", "pdf"] as const).map((fmt) => (
                    <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value={fmt}
                        defaultChecked={fmt === "csv"}
                        className="w-4 h-4 accent-slate-900"
                      />
                      <span className="text-sm font-semibold text-slate-700 uppercase">
                        {fmt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={exportPayroll.isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exportPayroll.isPending ? 'Exporting...' : 'Download CSV'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}