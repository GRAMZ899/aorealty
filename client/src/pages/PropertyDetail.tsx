import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, Heart, MapPin, Send, ShieldCheck } from "lucide-react";
import { Link, useRoute } from "wouter";
import MarketplaceShell from "@/components/MarketplaceShell";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";

const formatUGX = (value: number, mode: string) => `UGX ${Math.round(value).toLocaleString("en-US")}${mode === "rent" ? " / month" : ""}`;
const fallback = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=88";

export default function PropertyDetail() {
  const [, params] = useRoute<{ id: string }>("/properties/:id");
  const id = Number(params?.id);
  const auth = trpc.auth.me.useQuery();
  const query = trpc.listings.byId.useQuery({ id }, { enabled: Number.isFinite(id) });
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("I would like to schedule a viewing and learn more about this property.");
  const [notice, setNotice] = useState("");
  const [price, setPrice] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [rate, setRate] = useState(16);
  const [years, setYears] = useState(15);
  const property = query.data?.property;
  const saved = query.data?.saved ?? false;
  const save = trpc.favorites.toggle.useMutation({ onSuccess: () => utils.listings.byId.invalidate({ id }) });
  const inquiry = trpc.inquiries.create.useMutation({ onSuccess: () => { setNotice("Your inquiry is saved. An A&O advisor will be in touch shortly."); setMessage("I would like to schedule a viewing and learn more about this property."); } });
  const priceValue = property?.price ?? price;
  const monthly = useMemo(() => { const principal = Math.max(0, priceValue - deposit); const monthlyRate = rate / 100 / 12; const months = years * 12; if (!principal) return 0; if (!monthlyRate) return principal / months; return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1); }, [priceValue, deposit, rate, years]);

  if (query.isLoading) return <MarketplaceShell><div className="loading-state detail-loading">Loading property details...</div></MarketplaceShell>;
  if (!property) return <MarketplaceShell><div className="empty-state detail-loading"><h3>Property not found</h3><Link href="/properties" className="market-button gold">Back to properties</Link></div></MarketplaceShell>;

  const submitInquiry = (event: FormEvent) => { event.preventDefault(); inquiry.mutate({ propertyId: property.id, name, email, phone, message }); };
  const toggleSave = () => { if (!auth.data) { startLogin(); return; } save.mutate({ id: property.id }); };
  const images = property.images.length ? property.images : [fallback];

  return <MarketplaceShell><main className="market-page detail-page"><Link href="/properties" className="back-link"><ArrowLeft size={15} /> Back to properties</Link><div className="detail-layout"><section><div className="detail-gallery"><div className="detail-main-image" style={{ backgroundImage: `url(${images[0]})` }} /><div className="detail-thumbs">{images.map(image => <div key={image} className="detail-thumb" style={{ backgroundImage: `url(${image})` }} />)}</div></div><div className="detail-copy"><div className="detail-kicker"><span className={`market-status ${property.listingMode}`}>{property.listingMode === "sale" ? "For sale" : "For rent"}</span><span className="verified-pill"><ShieldCheck size={13} /> A&amp;O verified</span></div><h1>{property.title}</h1><p className="property-location-line"><MapPin size={16} /> {property.location}</p><div className="detail-price">{formatUGX(property.price, property.listingMode)}</div><div className="detail-facts"><span><strong>{property.bedrooms || "—"}</strong> bedrooms</span><span><strong>{property.bathrooms || "—"}</strong> bathrooms</span><span><strong>{property.area}</strong> area</span></div><p className="detail-description">{property.description}</p><button className={`market-button ${saved ? "navy" : "outline"}`} onClick={toggleSave}><Heart size={16} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved property" : "Save property"}</button></div></section><aside className="detail-sidebar"><div className="inquiry-card"><div className="market-eyebrow">REQUEST A VIEWING</div><h2>Ask about this property</h2><p>Share your details and the A&amp;O team will coordinate the next step.</p>{notice && <div className="market-notice success">{notice}</div>}<form onSubmit={submitInquiry}><input required value={name} onChange={event => setName(event.target.value)} placeholder="Your name" /><input required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Email address" /><input value={phone} onChange={event => setPhone(event.target.value)} placeholder="Phone number" /><textarea required minLength={10} value={message} onChange={event => setMessage(event.target.value)} rows={4} /><button className="market-button gold" type="submit" disabled={inquiry.isPending}><Send size={15} /> {inquiry.isPending ? "Sending..." : "Send inquiry"}</button></form></div><div className="calculator-card"><div className="market-eyebrow">PLAN THE MOVE</div><h2>Mortgage estimate</h2><label>Deposit (UGX)<input type="number" value={deposit} onChange={event => setDeposit(Number(event.target.value))} placeholder={`${Math.round(priceValue * .2)}`} /></label><label>Interest rate (%)<input type="number" step="0.1" value={rate} onChange={event => setRate(Number(event.target.value))} /></label><label>Term (years)<input type="number" value={years} onChange={event => setYears(Number(event.target.value))} /></label><div className="estimate-output"><span>Estimated monthly payment</span><strong>UGX {Math.round(monthly).toLocaleString("en-US")}</strong><small>Illustrative only — speak with a lender for a formal quote.</small></div></div></aside></div></main></MarketplaceShell>;
}
