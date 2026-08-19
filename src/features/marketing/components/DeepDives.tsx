import { AppFrame } from "./previews/AppFrame";
import {
  AttendanceScreen,
  ExpensesScreen,
  PayrollScreen,
  ProjectsScreen,
  ReceivablesScreen,
  RevenueScreen,
} from "./previews/screens";
import { SplitFeature } from "./SplitFeature";

export function ProjectSection() {
  return (
    <SplitFeature
      id="projects"
      eyebrow="Projects"
      title="Know exactly where every project stands."
      lead="Each project carries its client, site location, start date, contract budget and current status. The register totals them for you: how many are running, how many are done, how many have slipped."
      points={[
        {
          title: "Ongoing, completed or delayed",
          body: "One status field, applied consistently, so a glance at the board tells you which sites need attention today.",
        },
        {
          title: "Budget and money received, side by side",
          body: "Contract value against payments recorded, per project — the gap is your outstanding balance.",
        },
        {
          title: "A detail view per project",
          body: "Open any project to see its full record, its timeline position, and the expenses booked against it.",
        },
        {
          title: "Export whenever you need it",
          body: "The project register exports to CSV, so client reporting and accounting hand-offs stay simple.",
        },
      ]}
      media={
        <AppFrame active="projects" className="ring-1 ring-black/5">
          <ProjectsScreen />
        </AppFrame>
      }
      footnote="Progress is derived from where today falls in the project timeline. The system does not track individual construction milestones."
    />
  );
}

export function WorkforceSection() {
  return (
    <SplitFeature
      id="workforce"
      eyebrow="Workforce"
      title="Keep your team aligned — and paid correctly."
      lead="Employees are held with their role and daily rate. Attendance is marked per person per day. Payroll then does the arithmetic nobody wants to do by hand at the end of the month."
      points={[
        {
          title: "Full day, half day, absent",
          body: "Mark the whole crew for a date in one screen, then summarise attendance across any range of dates.",
        },
        {
          title: "Advances recorded as they are taken",
          body: "Cash handed out mid-month is logged against the employee and deducted automatically at payment time.",
        },
        {
          title: "Payroll that shows its working",
          body: "Days worked since the last payment × daily rate, less advances, equals net pay — with a day-by-day breakdown behind every figure.",
        },
        {
          title: "Mark as paid, then start the next cycle",
          body: "Recording a payment resets the counter, so the next run only covers days since that payment.",
        },
      ]}
      tone="muted"
      media={
        <div className="space-y-5">
          <AppFrame active="attendance" className="ring-1 ring-black/5">
            <AttendanceScreen />
          </AppFrame>
          <AppFrame active="payroll" className="ring-1 ring-black/5">
            <PayrollScreen />
          </AppFrame>
        </div>
      }
    />
  );
}

export function FinanceSection() {
  return (
    <SplitFeature
      id="finance"
      eyebrow="Cost control"
      title="Keep project costs visible."
      lead="Every rupee that leaves the business is booked to a category and a project. Every rupee that comes in is booked to a client and a payment method. What is left over is the number that matters."
      points={[
        {
          title: "Expenses tagged to the project that caused them",
          body: "Labour, materials, equipment, advances and other — categorised on entry, filterable by project and date range.",
        },
        {
          title: "Client payments with method and date",
          body: "Bank transfer, cheque or cash, recorded against the project it settles.",
        },
        {
          title: "Receivables you can act on",
          body: "Budget against received per project, with an outstanding-only filter that shows just the clients who owe you money.",
        },
        {
          title: "Labour cost separated from material cost",
          body: "The dashboard splits the two, so you can see which side of the job is running over.",
        },
      ]}
      media={
        <div className="space-y-5">
          <AppFrame active="expenses" className="ring-1 ring-black/5">
            <ExpensesScreen />
          </AppFrame>
          <AppFrame active="receivables" className="ring-1 ring-black/5">
            <ReceivablesScreen />
          </AppFrame>
        </div>
      }
      footnote="Amounts are held in Nepali rupees, and dates can be entered on the Bikram Sambat calendar as well as the Gregorian one."
    />
  );
}

export function ReportingSection() {
  return (
    <SplitFeature
      id="reporting"
      eyebrow="Reporting"
      title="Turn project activity into clarity."
      lead="The dashboard reads from the same records your team enters every day — so the reporting is a by-product of doing the work, not a second job at month end."
      points={[
        {
          title: "Revenue against expenses, month by month",
          body: "Six months of trend on one chart, with the period-on-period change stated as a percentage.",
        },
        {
          title: "Where the money went",
          body: "Expense distribution by category, so materials, labour and equipment can be compared directly.",
        },
        {
          title: "Operational counts alongside the money",
          body: "Active projects, employees on the books and today's attendance rate, on the same screen as the financials.",
        },
        {
          title: "CSV export across the modules",
          body: "Projects, employees, attendance, payroll, expenses and revenue each export to CSV, for accountants and for your own records.",
        },
      ]}
      tone="muted"
      media={
        <AppFrame active="revenue" className="ring-1 ring-black/5">
          <RevenueScreen />
        </AppFrame>
      }
    />
  );
}
