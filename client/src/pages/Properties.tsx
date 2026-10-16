import { FormEvent, useState } from "react";
import { Heart, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Link, useLocation } from "wouter";
import MarketplaceShell from "@/components/MarketplaceShell";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";

const formatUGX = (value: number, mode: string) => `UGX ${Math.round(value).toLocaleString("en-US")}${mode === "rent" ? " / month" : ""}`;
const imageFallback = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85";

export default function Properties() {
  const [currentLocation, navigate] = useLocation();
  const queryParams = new URLSearchParams(currentLocation.split("?")[1] ?? "");
  const [location, setLocation] = useState(queryParams.get("location") ?? "");
  const [mode, setMode] = useState(queryParams.get("listingMode") ?? "all");
  const [type, setType] = useState(queryParams.get("propertyType") ?? "all");
  const [minPrice, setMinPrice] = useState(queryParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(queryParams.get("maxPrice") ?? "");
  const [beds, setBeds] = useState(queryParams.get("minBedrooms") ?? "");
  const [sort, setSort] = useState("recommended");
  const [notice, setNotice] = useState("");
  const auth = trpc.auth.me.useQuery();
  const utils = trpc.useUtils();
  const listingQuery = trpc.listings.list.useQuery({
    location: location || undefined,
    listingMode: mode === "all" ? undefined : mode as "sale" | "rent",
    propertyType: type === "all" ? undefined : type as "house" | "apartment" | "land" | "commercial",
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minBedrooms: beds ? Number(beds) : undefined,
    sort: sort as "recommended" | "newest" | "price-low" | "price-high",
  });
  const save = trpc.favorites.toggle.useMutation({
    onSuccess: () => utils.listings.list.invalidate(),
    onError: error => setNotice(error.message),
  });

  const submit = (event: FormEvent) => { event.preventDefault(); listingQuery.refetch(); };
  const toggleSave = (id: number) => {
    if (!auth.data) { startLogin(); return; }
    save.mutate({ id });
  };

  return <MarketplaceShell>
    <main className="market-page">
      <section className="market-hero compact-hero"><div className="market-eyebrow">A&O PROPERTY MARKETPLACE</div><h1>Find a place that moves<br /><em>your story forward.</em></h1><p>Search verified property opportunities across Kampala, Wakiso, Mukono, Entebbe and beyond.</p></section>
      <section className="listing-workspace">
        <div className="workspace-heading"><div><div className="market-eyebrow">LIVE LISTINGS</div><h2>Explore properties</h2></div><span className="result-count">{listingQuery.data?.properties.length ?? 0} approved listings</span></div>
        <form className="filter-rail" onSubmit={submit}>
          <label><span>Location</span><input value={location} onChange={event => setLocation(event.target.value)} placeholder="Kampala, Entebbe..." /></label>
          <label><span>Listing mode</span><select value={mode} onChange={event => setMode(event.target.value)}><option value="all">Buy or rent</option><option value="sale">For sale</option><option value="rent">For rent</option></select></label>
          <label><span>Property type</span><select value={type} onChange={event => setType(event.target.value)}><option value="all">Any type</option><option value="house">House</option><option value="apartment">Apartment</option><option value="land">Land</option><option value="commercial">Commercial</option></select></label>
          <label><span>Min price (UGX)</span><input inputMode="numeric" value={minPrice} onChange={event => setMinPrice(event.target.value.replace(/\D/g, ""))} placeholder="0" /></label>
          <label><span>Max price (UGX)</span><input inputMode="numeric" value={maxPrice} onChange={event => setMaxPrice(event.target.value.replace(/\D/g, ""))} placeholder="No limit" /></label>
          <label><span>Bedrooms</span><select value={beds} onChange={event => setBeds(event.target.value)}><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label>
          <label><span>Sort</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="newest">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
          <button className="market-button gold filter-submit" type="submit"><Search size={16} /> Search</button>
        </form>
        {notice && <div className="market-notice">{notice}</div>}
        {listingQuery.isLoading && <div className="loading-state"><SlidersHorizontal size={20} /> Loading approved listings...</div>}
        {listingQuery.isError && <div className="empty-state"><h3>Listings are temporarily unavailable</h3><p>Refresh in a moment or contact A&amp;O for assistance.</p></div>}
        {!listingQuery.isLoading && !listingQuery.isError && listingQuery.data?.properties.length === 0 && <div className="empty-state"><h3>No properties match these filters</h3><p>Try a wider location, price range, or property type.</p></div>}
        <div className="market-property-grid">{listingQuery.data?.properties.map(property => {
          const saved = listingQuery.data.savedIds.includes(property.id);
          return <article className="market-property-card" key={property.id}>
            <div className="market-property-image" role="link" tabIndex={0} onClick={() => navigate(`/properties/${property.id}`)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") navigate(`/properties/${property.id}`); }} style={{ backgroundImage: `url(${property.images[0] || imageFallback})` }}><span className={`market-status ${property.listingMode}`}>{property.listingMode === "sale" ? "For sale" : "For rent"}</span><button type="button" className={`save-button ${saved ? "saved" : ""}`} onClick={event => { event.stopPropagation(); toggleSave(property.id); }} aria-label={saved ? "Remove from saved" : "Save property"}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button></div>
            <div className="market-property-body"><div className="market-price">{formatUGX(property.price, property.listingMode)}</div><Link href={`/properties/${property.id}`}><h3>{property.title}</h3></Link><p className="property-location-line"><MapPin size={14} /> {property.location}</p><div className="market-facts"><span>{property.bedrooms ? `${property.bedrooms} beds` : "Land"}</span><span>{property.bathrooms ? `${property.bathrooms} baths` : "Freehold"}</span><span>{property.area}</span></div><div className="card-footer"><span className="verified-pill">A&amp;O verified</span><Link href={`/properties/${property.id}`} className="card-link">View details →</Link></div></div>
          </article>;
        })}</div>
      </section>
    </main>
  </MarketplaceShell>;
}
