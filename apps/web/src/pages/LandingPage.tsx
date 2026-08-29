import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Users, CheckCircle, Zap } from "lucide-react";

const features = [
  { icon: Lock,        title: "Stake XLM",       sub: "Lock collateral on your goal" },
  { icon: Users,       title: "Community Vote",   sub: "Peers verify your proof"       },
  { icon: CheckCircle, title: "Auto-settle",      sub: "Contract resolves on threshold" },
  { icon: Zap,         title: "Instant Payout",   sub: "Funds back in seconds"          },
];

const steps = [
  { n: "01", t: "Create",  desc: "Define your goal, set the stake amount, pick a deadline." },
  { n: "02", t: "Prove",   desc: "Complete the goal and submit on-chain proof evidence."     },
  { n: "03", t: "Verify",  desc: "Community verifiers review and vote on your submission."   },
  { n: "04", t: "Collect", desc: "Approved? Stake returned. Forfeited? Vault is funded."     },
];

/* ── Logo SVG ── */
function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L28 8.5V20.5C28 24.09 22.4 27.6 16 30C9.6 27.6 4 24.09 4 20.5V8.5L16 2Z" fill="#1A1916" stroke="#D4872A" strokeWidth="1.5" />
      <line x1="16" y1="9" x2="16" y2="23" stroke="#D4872A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9.5" y1="16" x2="22.5" y2="16" stroke="#D4872A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2" fill="#D4872A" />
      <circle cx="16" cy="16" r="4.5" stroke="#D4872A" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F0E0D] text-[#F2EDDE]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[#2E2C28] bg-[#0F0E0D]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="transition-transform duration-150 group-hover:scale-105">
              <LogoMark />
            </div>
            <span style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 700 }}
              className="text-base text-[#F2EDDE] tracking-tight group-hover:text-[#D4872A] transition-colors">
              GoalVault
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-xs font-semibold text-[#8A8475] hover:text-[#F2EDDE] transition-colors">
              Dashboard
            </Link>
            <Link to="/create"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#D4872A] px-4 py-2 text-xs font-bold text-[#0F0E0D] hover:bg-[#F0A93C] transition-all shadow-[0_0_16px_rgb(212_135_42/0.3)]">
              Get Started <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">

          {/* Left: Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-7"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4872A]/25 bg-[#D4872A]/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4872A]" />
              <span className="text-[11px] font-bold text-[#D4872A] uppercase tracking-widest">Live on Stellar Testnet</span>
            </div>

            <h1 style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}
              className="text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
              Stake XLM.<br />
              <span style={{ background: "linear-gradient(135deg, #F0A93C, #D4872A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Prove it.
              </span>
            </h1>

            <p className="text-base text-[#8A8475] max-w-sm leading-relaxed">
              Lock Lumens on your goals. Community verifies. Soroban smart contract settles — automatically, on-chain, in seconds.
            </p>

            {/* Stats ticker */}
            <div className="flex flex-wrap gap-6 py-2 border-y border-[#2E2C28]">
              {[
                { label: "Goals Created",  val: "2,841" },
                { label: "XLM Staked",    val: "412K"  },
                { label: "Success Rate",  val: "73%"   },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-2xl text-[#D4872A]">{val}</p>
                  <p className="text-[11px] text-[#8A8475] uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D4872A] px-7 py-3 text-sm font-bold text-[#0F0E0D] hover:bg-[#F0A93C] transition-all shadow-[0_0_24px_rgb(212_135_42/0.35)]">
                Enter Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/create"
                className="inline-flex items-center gap-2 rounded-xl border border-[#2E2C28] bg-[#1A1916] px-7 py-3 text-sm font-semibold text-[#F2EDDE] hover:border-[#D4872A]/40 hover:bg-[#232118] transition-all">
                Create a Goal
              </Link>
            </div>
          </motion.div>

          {/* Right: Ledger Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="rounded-2xl border border-[#2E2C28] bg-[#1A1916] overflow-hidden shadow-[0_0_48px_rgb(0_0_0/0.5)]"
          >
            {/* Mock browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#2E2C28] bg-[#1A1916]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2E2C28]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2E2C28]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2E2C28]" />
              <span className="ml-3 text-[10px] text-[#8A8475] font-mono">goalvault · stellar testnet</span>
              <span className="ml-auto text-[10px] font-bold text-[#D4872A] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4872A]" />
                LIVE
              </span>
            </div>
            <div className="divide-y divide-[#2E2C28]">
              {[
                { label: "Goal Created",      detail: "30 days of DSA",        val: "−100 XLM", amber: false },
                { label: "Proof Submitted",   detail: "GitHub — 30 commits",   val: "—",        amber: false },
                { label: "Community Approved",detail: "3/3 votes passed",      val: "+100 XLM", amber: true  },
                { label: "Vault Funded",      detail: "Forfeited stake pooled", val: "+75 XLM",  amber: false },
              ].map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#232118] transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#F2EDDE]">{row.label}</p>
                    <p className="text-[11px] text-[#8A8475] mt-0.5">{row.detail}</p>
                  </div>
                  <span className={`text-xs font-mono font-bold ${row.amber ? "text-[#D4872A]" : "text-[#8A8475]"}`}>
                    {row.val}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-[#2E2C28] bg-[#1A1916] py-20 px-6">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-12 items-center">

          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4872A] mb-3">Protocol Architecture</p>
              <h2 style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
                className="text-3xl sm:text-4xl text-[#F2EDDE] leading-tight">
                Escrow enforcement.<br />On-chain.
              </h2>
            </div>
            <div className="space-y-6">
              {features.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex gap-4 group">
                  <div className="h-9 w-9 rounded-xl bg-[#D4872A]/10 border border-[#D4872A]/20 flex items-center justify-center shrink-0 group-hover:bg-[#D4872A]/20 transition-colors">
                    <Icon className="h-4 w-4 text-[#D4872A]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#F2EDDE]">{title}</h3>
                    <p className="text-xs text-[#8A8475] mt-0.5 leading-relaxed">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow flow terminal */}
          <div className="lg:col-span-7 bg-[#0F0E0D] rounded-2xl border border-[#2E2C28] p-6 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#2E2C28] pb-3">
              <span className="text-[10px] text-[#8A8475]">MEMO: ESCROW_SECURE_INIT</span>
              <span className="text-[10px] text-[#D4872A] font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4872A] animate-ping" />
                TX_ESCROWED
              </span>
            </div>
            <div className="space-y-3 text-[11px] text-[#8A8475]">
              {[
                { step: "1. Stake Collateral",         val: "− 150.00 XLM",             valColor: "#F2EDDE" },
                { step: "2. Verification Pool Locked",  val: "Pending Votes (0/3)",       valColor: "#D4872A" },
                { step: "3. Automated Settlement Route",val: "Success: Refund / Fail: Vault", valColor: "#3D9E6A" },
              ].map((row, i) => (
                <div key={i}>
                  <div className="bg-[#1A1916] p-3.5 rounded-xl border border-[#2E2C28] flex items-center justify-between">
                    <span>{row.step}</span>
                    <span className="font-bold" style={{ color: row.valColor }}>{row.val}</span>
                  </div>
                  {i < 2 && (
                    <div className="flex justify-center my-1.5 text-[#D4872A] text-xs">↓</div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-[#2E2C28] flex items-center justify-between text-[9px] text-[#8A8475]">
              <span>Stellar Soroban · CCPLIPZ4EVQKQ...</span>
              <a href="https://stellar.expert/explorer/testnet/contract/CCPLIPZ4EVQKQKMBXMJJHMW5KKMAUCSQYVDPIBAYFPLW4ZRCLN7TVHKN"
                target="_blank" rel="noreferrer"
                className="font-bold text-[#D4872A] hover:underline">
                Inspect contract ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4872A] mb-3">Protocol Timeline</p>
          <h2 style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
            className="text-3xl sm:text-4xl text-[#F2EDDE]">
            Four steps. Zero trust.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map(({ n, t, desc }) => (
            <div key={n}
              className="card-base card-hover bg-[#1A1916] border-[#2E2C28] rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group">
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
                className="text-5xl text-[#D4872A]/10 absolute top-3 right-4 group-hover:text-[#D4872A]/20 transition-colors">
                {n}
              </span>
              <div className="h-8 w-8 rounded-lg bg-[#D4872A]/10 border border-[#D4872A]/20 flex items-center justify-center">
                <span className="text-xs font-bold text-[#D4872A]">{n}</span>
              </div>
              <div>
                <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                  className="text-sm text-[#F2EDDE]">{t}</h4>
                <p className="text-[11px] text-[#8A8475] mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-[#2E2C28] relative overflow-hidden">
        {/* Amber radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-[#D4872A]/5 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}
            className="text-4xl sm:text-5xl text-[#F2EDDE] mb-4">
            Commit to something{" "}
            <span style={{ background: "linear-gradient(135deg, #F0A93C, #D4872A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              today.
            </span>
          </h2>
          <p className="text-sm text-[#8A8475] mb-8">No middleman. No delays. Just you, your goal, and the chain.</p>
          <Link to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4872A] px-8 py-3.5 text-sm font-bold text-[#0F0E0D] hover:bg-[#F0A93C] transition-all shadow-[0_0_32px_rgb(212_135_42/0.4)]">
            Enter Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#2E2C28] bg-[#1A1916] px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }} className="text-sm text-[#F2EDDE]">GoalVault</span>
          </div>
          <p className="text-xs text-[#8A8475]">Built on Stellar Soroban · Testnet</p>
        </div>
      </footer>
    </div>
  );
}
