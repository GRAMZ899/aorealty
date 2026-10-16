import { Link, useLocation } from "wouter";
import { Building2, LogIn, LogOut, UserRound } from "lucide-react";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export default function MarketplaceShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const auth = trpc.auth.me.useQuery();
  const utils = trpc.useUtils();
  const logout = trpc.auth.logout.useMutation({ onSuccess: () => utils.auth.me.invalidate() });
  const user = auth.data;

  return (
    <div className="marketplace-app">
      <header className="market-header">
        <Link href="/" className="market-brand">
          <span className="market-mark">A<span>&amp;</span>O</span>
          <span><strong>A&amp;O</strong><small>REAL ESTATE SOLUTIONS</small></span>
        </Link>
        <nav className="market-nav" aria-label="Marketplace">
          <Link href="/properties" className={location.startsWith("/properties") ? "active" : ""}>Buy &amp; Rent</Link>
          <Link href="/list-property" className={location === "/list-property" ? "active" : ""}>List a Property</Link>
          <Link href="/dashboard" className={location === "/dashboard" ? "active" : ""}>My Space</Link>
          {user?.role === "admin" && <Link href="/admin" className={location === "/admin" ? "active" : ""}>Admin</Link>}
        </nav>
        <div className="market-actions">
          {user ? (
            <>
              <span className="market-user"><UserRound size={15} /> {user.name || user.email || "Member"}</span>
              <button className="market-button outline" onClick={() => logout.mutate()}><LogOut size={15} /> Sign out</button>
            </>
          ) : (
            <button className="market-button outline" onClick={() => startLogin()}><LogIn size={15} /> Sign in</button>
          )}
          <Link href="/list-property" className="market-button gold"><Building2 size={15} /> List property</Link>
        </div>
      </header>
      {children}
      <footer className="market-footer"><div><strong>A&amp;O Real Estate Solutions</strong><span>Trusted land, homes, rentals and commercial property across Uganda.</span></div><div><span>Need help? info@aorealty.ug · +256 700 123 456</span><span>© 2026 A&amp;O Real Estate Solutions</span></div></footer>
    </div>
  );
}
