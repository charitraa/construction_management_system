import { LandingNav } from "../components/LandingNav";
import { Hero } from "../components/Hero";
import { ValueSection } from "../components/ValueSection";
import { ModuleExplorer } from "../components/ModuleExplorer";
import {
  FinanceSection,
  ProjectSection,
  ReportingSection,
  WorkforceSection,
} from "../components/DeepDives";
import { HowItWorks } from "../components/HowItWorks";
import { WorkflowTabs } from "../components/WorkflowTabs";
import { BeforeAfter } from "../components/BeforeAfter";
import { SecuritySection } from "../components/SecuritySection";
import { CTASection } from "../components/CTASection";
import { LandingFooter } from "../components/LandingFooter";

export default function Landing() {
  return (
    <div className="marketing min-h-screen bg-white antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <LandingNav />

      <main id="main">
        <Hero />
        <ValueSection />
        <ModuleExplorer />
        <ProjectSection />
        <WorkforceSection />
        <FinanceSection />
        <ReportingSection />
        <HowItWorks />
        <WorkflowTabs />
        <BeforeAfter />
        <SecuritySection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  );
}
