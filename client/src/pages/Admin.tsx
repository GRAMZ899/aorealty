import { useState } from "react";
import { Check, ClipboardCheck, MessageSquare, X } from "lucide-react";
import MarketplaceShell from "@/components/MarketplaceShell";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";

export default function Admin() {
  const auth = trpc.auth.me.useQuery();
  const queue = trpc.listings.reviewQueue.useQuery(undefined, { enabled: auth.data?.role === "admin" });
  const stats = trpc.listings.stats.useQuery(undefined, { enabled: auth.data?.role === "admin" });
  const inquiries = trpc.inquiries.all.useQuery(undefined, { enabled: auth.data?.role === "admin" });
  const moderate = trpc.listings.moderate.useMutation({ onSuccess: () => { queue.refetch(); stats.refetch(); } });
  const [note, setNote] = useState<Record<number, string>>({});
  const [notice, setNotice] = useState("");
  if (auth.isLoading) return <MarketplaceShell><div className="loading-state detail-loading">Checking admin access...</div></MarketplaceShell>;
  if (!auth.data) return <MarketplaceShell><main className="account-gate"><h1>Admin review is protected.</h1><p>Sign in with your A&amp;O account to continue.</p><button className="market-button gold" onClick={() => startLogin()}>Sign in</button></main></MarketplaceShell>;
  if (auth.data.role !== "admin") return <MarketplaceShell><main className="account-gate"><h1>This space is for A&amp;O admins.</h1><p>Your account does not have moderation access.</p></main></MarketplaceShell>;
  const act = (id: number, status: "approved" | "rejected") => {
    if (status === "rejected" && !note[id]?.trim()) {
      setNotice("Add a moderation note before rejecting a listing.");
      return;
    }
    setNotice("");
    moderate.mutate({ id, status, moderationNote: note[id]?.trim() || undefined });
  };
  return <MarketplaceShell><main className="market-page admin-page"><div className="dashboard-welcome"><div><div className="market-eyebrow">OPERATIONS CONSOLE</div><h1>Keep the marketplace trusted.</h1><p>Review new listings, then give owners a clear next step.</p></div></div>{notice && <div className="market-notice error">{notice}</div>}<div className="admin-stat-grid"><div><ClipboardCheck size={19} /><strong>{stats.data?.pending ?? 0}</strong><span>Pending review</span></div><div><Check size={19} /><strong>{stats.data?.approved ?? 0}</strong><span>Approved listings</span></div><div><MessageSquare size={19} /><strong>{stats.data?.inquiries ?? 0}</strong><span>Inquiries</span></div></div><section className="admin-section"><div className="panel-heading"><div><ClipboardCheck size={17} /><h2>Review queue</h2></div><span className="panel-count">{queue.data?.length ?? 0}</span></div>{queue.data?.length === 0 ? <div className="panel-empty"><p>Everything is up to date. No listings are waiting for review.</p></div> : <div className="review-list">{queue.data?.map(property => <article className="review-card" key={property.id}><div className="review-image" style={{ backgroundImage: `url(${property.images[0]})` }} /><div className="review-body"><span className="status-chip pending">Pending</span><h3>{property.title}</h3><p>{property.location} · UGX {Number(property.price).toLocaleString("en-US")} · submitted by {property.ownerName || property.ownerEmail}</p><p>{property.description}</p><textarea value={note[property.id] || ""} onChange={event => setNote(current => ({ ...current, [property.id]: event.target.value }))} placeholder="Required for rejection; optional for approval" rows={2} /><div className="review-actions"><button className="market-button gold" onClick={() => act(property.id, "approved")}><Check size={15} /> Approve</button><button className="market-button outline danger" onClick={() => act(property.id, "rejected")}><X size={15} /> Reject</button></div></div></article>)}</div>}</section><section className="admin-section"><div className="panel-heading"><div><MessageSquare size={17} /><h2>Recent inquiries</h2></div></div><div className="inquiry-list admin-inquiries">{inquiries.data?.map(row => <div className="inquiry-row" key={row.inquiry.id}><strong>{row.inquiry.name} · {row.propertyTitle}</strong><span>{row.inquiry.email} {row.inquiry.phone ? `· ${row.inquiry.phone}` : ""}</span><p>{row.inquiry.message}</p></div>)}</div></section></main></MarketplaceShell>;
}
