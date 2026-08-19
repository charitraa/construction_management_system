import { ArrowRight } from "lucide-react";
import { ActionLink, Reveal, Section } from "./primitives";

export function CTASection() {
  return (
    <Section tone="light" className="pb-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[640px] -translate-x-1/2 rounded-full bg-amber-500/12 blur-[100px]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="display-tight text-[1.9rem] font-extrabold text-white sm:text-[2.6rem]">
              Ready to manage your projects?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">
              Sign in to your workspace, create your first project, and put the site
              notebook down.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ActionLink to="/login" size="lg" className="w-full sm:w-auto">
                Sign in to your workspace
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ActionLink>
              <ActionLink to="/register" tone="light" size="lg" className="w-full sm:w-auto">
                Create an account
              </ActionLink>
            </div>
            <p className="mt-6 text-[12.5px] text-slate-400">
              Designed for construction teams.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
