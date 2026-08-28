import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
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
  { label: "Overview",  href: "/dashboard",   icon: LayoutDashboard },
  { label: "Create",    href: "/create",       icon: PlusCircle },
  { label: "Goals",     href: "/active",       icon: Trophy },
  { label: "Verify",    href: "/validation",   icon: ShieldCheck },
  { label: "Vault",     href: "/reward-pool",  icon: Coins },
  { label: "Rankings",  href: "/leaderboard",  icon: Trophy },
];

/* ── Logo SVG — Hexagonal shield + crosshair ──────────────────────────── */
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hex shield */}
      <path
        d="M16 2L28 8.5V20.5C28 24.09 22.4 27.6 16 30C9.6 27.6 4 24.09 4 20.5V8.5L16 2Z"
        fill="#1A1916"
        stroke="#D4872A"
        strokeWidth="1.5"
      />
      {/* Crosshair vertical */}
      <line x1="16" y1="9" x2="16" y2="23" stroke="#D4872A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Crosshair horizontal */}
      <line x1="9.5" y1="16" x2="22.5" y2="16" stroke="#D4872A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="16" cy="16" r="2" fill="#D4872A" />
      {/* Target ring */}
      <circle cx="16" cy="16" r="4.5" stroke="#D4872A" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
    </svg>
  );
}

/* ── Top Navbar ────────────────────────────────────────────────────────── */
function TopNav() {
  const location = useLocation();
  const wallet = useWallet();
  const notifications = useDappStore((s) => s.notifications);
  const unread = notifications.length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#2E2C28] bg-[#0F0E0D]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="transition-transform duration-150 group-hover:scale-105">
              <LogoMark size={28} />
            </div>
            <span
              style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 700 }}
              className="text-base text-[#F2EDDE] tracking-tight group-hover:text-[#D4872A] transition-colors"
            >
              GoalVault
            </span>
          </Link>

          {/* Center nav (desktop) */}
          <nav className="hidden md:flex items-center gap-0.5 rounded-xl border border-[#2E2C28] bg-[#1A1916] px-1.5 py-1.5">
            {NAV.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className={[
                  "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                  isActive(href)
                    ? "bg-[#D4872A] text-[#0F0E0D] shadow-sm"
                    : "text-[#8A8475] hover:text-[#F2EDDE] hover:bg-[#232118]",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#2E2C28] bg-[#1A1916] hover:border-[#D4872A]/40 hover:bg-[#232118] transition-all"
            >
              <Bell className="h-3.5 w-3.5 text-[#8A8475]" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#D4872A] text-[8px] font-bold text-[#0F0E0D]">
                  {unread}
                </span>
              )}
            </Link>

            {/* Wallet status */}
            {wallet.connected ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-[#2E2C28] bg-[#1A1916] px-3 py-1.5 text-xs font-semibold text-[#F2EDDE] hover:border-[#D4872A]/40 hover:bg-[#232118] transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-[#D4872A] pulse-amber" />
                  <span className="hidden sm:block font-mono text-[#8A8475]">{truncateAddress(wallet.address || "")}</span>
                  <span className="font-bold text-[#D4872A]">{wallet.balance.toLocaleString()} XLM</span>
                  <ChevronDown className="h-3 w-3 text-[#8A8475]" />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-1.5 w-52 rounded-2xl border border-[#2E2C28] bg-[#1A1916] shadow-[0_8px_32px_rgb(0_0_0/0.5)] py-1.5 z-50"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <div className="px-3 py-2.5 border-b border-[#2E2C28] mb-1">
                      <p className="text-[10px] font-bold text-[#8A8475] uppercase tracking-wider">Connected</p>
                      <p className="text-xs font-mono text-[#F2EDDE] mt-0.5 truncate">{truncateAddress(wallet.address || "")}</p>
                    </div>
                    {[
                      { label: "Profile",  icon: User,     href: "/profile" },
                      { label: "Wallet",   icon: Wallet,   href: "/wallet" },
                      { label: "Settings", icon: Settings, href: "/settings" },
                    ].map(({ label, icon: Icon, href }) => (
                      <button
                        key={href}
                        onClick={() => { navigate(href); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F2EDDE] hover:bg-[#232118] transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5 text-[#8A8475]" />
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-[#2E2C28] mt-1 pt-1">
                      <a
                        href={`https://stellar.expert/explorer/testnet/account/${wallet.address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#8A8475] hover:bg-[#232118] transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View on Explorer
                      </a>
                      <button
                        onClick={() => { wallet.disconnect(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#C0392B] hover:bg-[#C0392B]/10 transition-colors"
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
                className="flex items-center gap-1.5 rounded-xl bg-[#D4872A] px-4 py-1.5 text-xs font-bold text-[#0F0E0D] hover:bg-[#F0A93C] transition-all shadow-[0_0_12px_rgb(212_135_42/0.3)]"
              >
                <Wallet className="h-3.5 w-3.5" />
                Connect
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-[#2E2C28] bg-[#1A1916] text-[#F2EDDE]"
            >
              {menuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-[#2E2C28] bg-[#1A1916] px-4 py-3 space-y-1">
            {NAV.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMenuOpen(false)}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                  isActive(href)
                    ? "bg-[#D4872A] text-[#0F0E0D]"
                    : "text-[#8A8475] hover:bg-[#232118] hover:text-[#F2EDDE]",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#2E2C28] mt-2 grid grid-cols-2 gap-2">
              <Link
                to="/notifications"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#8A8475] hover:bg-[#232118] hover:text-[#F2EDDE] transition-all"
              >
                <Bell className="h-4 w-4" />
                Alerts
                {unread > 0 && <span className="ml-auto bg-[#D4872A] text-[#0F0E0D] text-[9px] font-bold rounded-full px-1.5 py-0.5">{unread}</span>}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#8A8475] hover:bg-[#232118] hover:text-[#F2EDDE] transition-all"
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

/* ── App Shell ─────────────────────────────────────────────────────────── */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F0E0D]">
      <TopNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
