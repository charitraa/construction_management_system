import { KeyRound, ShieldCheck, LogOut, Database } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const POINTS = [
  {
    icon: KeyRound,
    title: "Every account signs in for itself",
    body: "Access is by email and password. There is no shared login and no anonymous route into the data.",
  },
  {
    icon: ShieldCheck,
    title: "Every screen sits behind authentication",
    body: "Application routes are protected on the client and the API requires a valid session for every request — not just the first one.",
  },
  {
    icon: LogOut,
    title: "Sessions end when you say so",
    body: "Signing out clears the session on the server as well as in the browser, so a shared site laptop does not stay signed in.",
  },
  {
    icon: Database,
    title: "Your records stay your records",
    body: "Projects, payroll and financial history live in your workspace. Nothing is published, and nothing is shown to a visitor who has not signed in.",
  },
];

export function SecuritySection() {
  return (
    <Section tone="muted">
      <Reveal>
        <SectionHeading
          eyebrow="Access & data"
          title="Your project data belongs to your organisation."
          lead="Payroll and client finances are sensitive by nature. The system is built so that seeing any of it requires being signed in as someone entitled to."
          align="center"
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {POINTS.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="flex h-full gap-4 rounded-xl border border-slate-200 bg-white p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-ink-800">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[14.5px] font-bold text-ink-900">{p.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600">
                    {p.body}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-[12.5px] leading-relaxed text-slate-400">
        Stated plainly: this describes the access controls that are implemented today.
        Per-role permissions and audit history are planned, and are not claimed here.
      </p>
    </Section>
  );
}
