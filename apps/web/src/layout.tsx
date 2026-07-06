import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Target,
  LayoutDashboard,
  PlusCircle,
  Trophy,
  ShieldCheck,
  Coins,
  Wallet,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  ExternalLink,
} from "lucide-react";
import { useWallet } from "./lib/wallet";
import { useDappStore } from "./lib/store";
import { truncateAddress } from "./lib/utils";

/* ── Navigation items ─────────────────────────────────────────────────── */
const NAV = [
  { label: "Overview",   href: "/dashboard",    icon: LayoutDashboard },
  { label: "Create",     href: "/create",        icon: PlusCircle },
  { label: "Goals",      href: "/active",        icon: Trophy },
  { label: "Verify",     href: "/validation",    icon: ShieldCheck },
  { label: "Vault",      href: "/reward-pool",   icon: Coins },
  { label: "Rankings",   href: "/leaderboard",   icon: Trophy },
];

/* ── Top-center Navbar ─────────────────────────────────────────────────── */
function TopNav() {
  const location = useLocation();
  const wallet = useWallet();
  const notifications = useDappStore((s) => s.notifications);
  const unread = notifications.length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Left — logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative h-8 w-8 flex items-center justify-center rounded-xl bg-accent text-white shadow-soft transition-all duration-150 group-hover:bg-[#155730] group-hover:scale-[1.02]">
              {/* Professional geometric abstract logo (Double layered offset squares representing locked vault ledger blocks) */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M12 2v9M8 5h8" />
              </svg>
            </div>
            <span 
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }} 
              className="text-base text-fg tracking-tight group-hover:text-accent transition-colors"
            >
              GoalVault
            </span>
          </Link>

          {/* Center — main nav (desktop) */}
          <nav className="hidden md:flex items-center gap-0.5 rounded-xl border border-border bg-stone-50 px-1.5 py-1.5">
            {NAV.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className={[
                  "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                  isActive(href)
                    ? "bg-white border border-border text-accent shadow-sm"
                    : "text-muted hover:text-fg hover:bg-white/60",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right — wallet + notifications + profile */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white hover:border-accent/30 transition-colors"
            >
              <Bell className="h-3.5 w-3.5 text-muted" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>

            {/* Wallet status */}
            {wallet.connected ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-fg hover:border-accent/30 transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="hidden sm:block font-mono">{truncateAddress(wallet.address)}</span>
                  <span className="font-semibold text-accent">{wallet.balance.toLocaleString()} XLM</span>
                  <ChevronDown className="h-3 w-3 text-muted" />
                </button>

                {/* Profile dropdown */}
                {profileOpen && (
                  <div
                    className="absolute right-0 mt-1.5 w-48 rounded-xl border border-border bg-white shadow-lg py-1.5 z-50"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Connected</p>
                      <p className="text-xs font-mono text-fg mt-0.5 truncate">{truncateAddress(wallet.address)}</p>
                    </div>
                    {[
                      { label: "Profile", icon: User, href: "/profile" },
                      { label: "Wallet", icon: Wallet, href: "/wallet" },
                      { label: "Settings", icon: Settings, href: "/settings" },
                    ].map(({ label, icon: Icon, href }) => (
                      <button
                        key={href}
                        onClick={() => { navigate(href); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-fg hover:bg-stone-50 transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5 text-muted" />
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-border mt-1 pt-1">
                      <a
                        href={`https://stellar.expert/explorer/testnet/account/${wallet.address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-muted hover:bg-stone-50 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View on Explorer
                      </a>
                      <button
                        onClick={() => { wallet.disconnect(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/wallet"
                className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-fg hover:border-accent/30 transition-colors"
              >
                <Wallet className="h-3.5 w-3.5 text-muted" />
                Connect
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white"
            >
              {menuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
            {NAV.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMenuOpen(false)}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                  isActive(href)
                    ? "bg-accent/8 text-accent border border-accent/15"
                    : "text-muted hover:bg-stone-50 hover:text-fg",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2 grid grid-cols-2 gap-2">
              <Link
                to="/notifications"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted hover:bg-stone-50 hover:text-fg transition-all"
              >
                <Bell className="h-4 w-4" />
                Alerts
                {unread > 0 && <span className="ml-auto bg-accent text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">{unread}</span>}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted hover:bg-stone-50 hover:text-fg transition-all"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

/* ── App Shell (dashboard area only) ──────────────────────────────────── */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <TopNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
