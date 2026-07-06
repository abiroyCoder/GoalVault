import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, ArrowRight, Lock, Users, CheckCircle, Zap } from "lucide-react";

const features = [
  { icon: Lock,         title: "Stake XLM",          sub: "Lock collateral on your goal" },
  { icon: Users,        title: "Community Vote",      sub: "Peers verify your proof"       },
  { icon: CheckCircle,  title: "Auto-settle",         sub: "Contract resolves on threshold" },
  { icon: Zap,          title: "Instant Payout",      sub: "Funds back in seconds"          },
];

const steps = [
  { n: "01", t: "Create"  },
  { n: "02", t: "Prove"   },
  { n: "03", t: "Verify"  },
  { n: "04", t: "Collect" },
];

export function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#F4F1EA] text-[#1C1C1A]"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Header ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[#DCD7CA] bg-[#FAF8F4]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-xl bg-[#1A6B3C] flex items-center justify-center text-white transition-all duration-150 group-hover:scale-[1.02]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M12 2v9M8 5h8" />
              </svg>
            </div>
            <span
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              className="text-base tracking-tight group-hover:text-[#1A6B3C] transition-colors"
            >
              GoalVault
            </span>
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A6B3C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#155730] transition-colors"
          >
            Enter Dashboard <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* ── Hero & Preview Grid ── */}
      <section className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          
          {/* Left Column: Heading and CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-left space-y-6"
          >
            <h1
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              className="text-5xl sm:text-6xl leading-[1.05] tracking-tight"
            >
              Stake XLM.<br />
              <span className="text-[#1A6B3C]">Prove it.</span>
            </h1>

            <p className="text-base text-[#736E64] max-w-sm">
              Lock Lumens on goals. Community verifies. Smart contract settles.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1A6B3C] px-7 py-3 text-sm font-semibold text-white hover:bg-[#155730] transition-colors shadow-sm"
              >
                Enter Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 rounded-xl border border-[#DCD7CA] bg-[#FAF8F4] px-7 py-3 text-sm font-semibold text-[#1C1C1A] hover:border-[#1A6B3C]/40 transition-colors"
              >
                Create a Goal
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Ledger Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="rounded-2xl border border-[#DCD7CA] bg-[#FAF8F4] overflow-hidden"
          >
            {/* mock browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#DCD7CA] bg-[#FAF8F4]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DCD7CA]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#DCD7CA]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#DCD7CA]" />
              <span className="ml-3 text-[10px] text-[#736E64] font-mono">goaldvault · stellar testnet</span>
            </div>
            <div className="divide-y divide-[#DCD7CA]">
              {[
                { label: "Goal Created",       detail: "30 days of DSA",         val: "100 XLM",  green: false },
                { label: "Proof Submitted",     detail: "GitHub — 30 commits",    val: "—",        green: false },
                { label: "Community Approved",  detail: "3/3 votes passed",       val: "+100 XLM", green: true  },
                { label: "Vault Funded",        detail: "Forfeited stake pooled",  val: "+75 XLM",  green: false },
              ].map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#FAF8F4]/60 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#1C1C1A]">{row.label}</p>
                    <p className="text-[11px] text-[#736E64] mt-0.5">{row.detail}</p>
                  </div>
                  <span className={`text-xs font-mono font-semibold ${row.green ? "text-[#1A6B3C]" : "text-[#736E64]"}`}>
                    {row.val}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Feature Focus & Visual Ledger Escrow Diagram ── */}
      <section className="border-t border-[#DCD7CA] bg-[#FAF8F4] py-20 px-6">
        <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Column - Sophisticated Feature Stack */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A6B3C] mb-2">Protocol Architecture</p>
              <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif" }} className="text-3xl sm:text-4xl text-[#1C1C1A] leading-tight">
                Escrow enforcement.
              </h2>
            </div>
            
            <div className="space-y-6">
              {features.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex gap-4">
                  <div className="h-8 w-8 rounded-lg bg-[#F4F1EA] border border-[#DCD7CA] flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-[#1A6B3C]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#1C1C1A] uppercase tracking-wider">{title}</h3>
                    <p className="text-xs text-[#736E64] mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Cool Visual Escrow Ledger Flow Mockup (No AI Slop, pure CSS) */}
          <div className="lg:col-span-7 bg-[#F4F1EA] rounded-2xl border border-[#DCD7CA] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCD7CA] pb-3">
              <span className="text-[10px] font-bold text-[#736E64] font-mono">MEMO: ESCROW_SECURE_INIT</span>
              <span className="text-[10px] text-[#1A6B3C] font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1A6B3C] animate-ping" />
                TX_ESCROWED
              </span>
            </div>

            <div className="space-y-3 font-mono text-[11px] text-[#736E64]">
              <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCD7CA] flex items-center justify-between">
                <span>1. Stake Collateral</span>
                <span className="font-semibold text-[#1C1C1A]">- 150.00 XLM</span>
              </div>
              <div className="flex justify-center my-1 text-[#1A6B3C] animate-pulse">↓</div>
              <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCD7CA] flex items-center justify-between">
                <span>2. Verification Pool Locked</span>
                <span className="font-semibold text-amber-700">Pending Votes (0/3)</span>
              </div>
              <div className="flex justify-center my-1 text-[#1A6B3C] animate-pulse">↓</div>
              <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCD7CA] flex items-center justify-between">
                <span>3. Automated Settlement Route</span>
                <span className="text-[#1A6B3C] font-semibold">Success: Refund / Fail: Burn</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCD7CA] flex items-center justify-between">
              <span className="text-[9px] text-[#736E64]">Stellar Soroban Execution Context</span>
              <span className="text-[9px] font-bold text-[#1C1C1A] underline">Inspect contract code</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Steps Timeline ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A6B3C] mb-2">Protocol Timeline</p>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif" }} className="text-3xl text-[#1C1C1A]">
            The Lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {steps.map(({ n, t }) => (
            <div key={n} className="bg-[#FAF8F4] rounded-2xl border border-[#DCD7CA] p-5 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#1A6B3C]/40 transition-colors">
              <span style={{ fontFamily: "'DM Serif Display', Georgia, serif" }} className="text-4xl text-[#1A6B3C]/15 absolute top-2 right-4">
                {n}
              </span>
              <div className="mt-auto">
                <span className="text-[10px] font-bold text-[#736E64] uppercase tracking-widest block mb-1">Step {n}</span>
                <h4 className="text-sm font-semibold text-[#1C1C1A]">{t}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-[#DCD7CA] bg-[#1A6B3C]">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            className="text-4xl text-white mb-5"
          >
            Commit to something today.
          </h2>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FAF8F4] px-8 py-3 text-sm font-semibold text-[#1A6B3C] hover:bg-[#F4F1EA] transition-colors"
          >
            Enter Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#DCD7CA] bg-[#FAF8F4] px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-lg bg-[#1A6B3C] flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M12 2v9M8 5h8" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#1C1C1A]">GoalVault</span>
          </div>
          <p className="text-xs text-[#736E64]">Built on Stellar Soroban · Testnet</p>
        </div>
      </footer>
    </div>
  );
}
