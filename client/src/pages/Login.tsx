import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link } from "wouter";
import MarketplaceShell from "@/components/MarketplaceShell";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const auth = trpc.auth.me.useQuery();
  return <MarketplaceShell><main className="account-gate"><span className="tool-icon"><LockKeyhole size={22} /></span><div className="market-eyebrow">A&amp;O MEMBER ACCESS</div><h1>Make your next move<br /><em>with more confidence.</em></h1><p>Sign in to save listings, send inquiries, submit properties, and track every conversation from one secure space.</p>{auth.data ? <Link href="/dashboard" className="market-button gold">Open my dashboard <ArrowRight size={16} /></Link> : <button className="market-button gold" onClick={() => startLogin()}>Continue with Manus <ArrowRight size={16} /></button>}</main></MarketplaceShell>;
}
