import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ActionLink, LogoMark } from "./primitives";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Modules", href: "#modules" },
  { label: "Workflow", href: "#workflow" },
  { label: "How it works", href: "#how-it-works" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out",
        scrolled
          ? "border-b border-white/10 bg-ink-900/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 transition-all duration-300 ease-out sm:px-8",
          scrolled ? "h-14" : "h-[72px]",
        )}
      >
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label="Construction Management System — home"
        >
          <LogoMark className={cn("transition-all duration-300", scrolled ? "h-7 w-7" : "h-8 w-8")} />
          <span className="hidden text-[15px] font-extrabold tracking-tight text-white sm:block">
            Construction MS
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-md px-3 py-2 text-[13.5px] font-medium text-slate-300 transition-colors duration-200 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-lg px-3.5 py-2 text-[13.5px] font-semibold text-slate-200 transition-colors duration-200 hover:text-white sm:block"
          >
            Sign in
          </Link>
          <ActionLink to="/register" size="sm" className="hidden sm:inline-flex">
            Get started
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </ActionLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-ink-900 px-5 pb-6 pt-2 lg:hidden"
          >
            <ul className="space-y-0.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-[15px] font-medium text-slate-200 hover:bg-white/5"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="my-4 h-px bg-white/10" />
            <div className="flex flex-col gap-2.5">
              <ActionLink to="/login" tone="light" size="md" onClick={() => setOpen(false)}>
                Sign in
              </ActionLink>
              <ActionLink to="/register" size="md" onClick={() => setOpen(false)}>
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ActionLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
