import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Facebook,
  Heart,
  Headset,
  Home as HomeIcon,
  Instagram,
  Landmark,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  Phone,
  RotateCcw,
  Ruler,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  X,
  Youtube,
} from "lucide-react";
import { startLogin } from "@/const";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const heroImage = "/manus-storage/async-images/35W81GozDtq8TxCgiWwjRo/image-1.webp";

type PropertyType = "House" | "Apartment" | "Land" | "Commercial";
type ListingMode = "For Sale" | "For Rent";
type Property = {
  id?: number;
  type: ListingMode;
  typeColor: "sale" | "rent";
  category: PropertyType;
  price: string;
  priceValue: number;
  priceSuffix?: string;
  title: string;
  location: string;
  bedrooms?: number;
  details: string[];
  image: string;
};

const categoryCards = [
  { eyebrow: "LAND & ACREAGE", title: "Land for sale", description: "Residential plots, agricultural land, commercial and investment acreage.", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85", icon: Landmark, accent: "green" },
  { eyebrow: "HOMES", title: "Houses for sale", description: "Family homes, villas, apartments and newly constructed houses.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85", icon: HomeIcon, accent: "navy" },
  { eyebrow: "FLEXIBLE LIVING", title: "Rentals", description: "Apartments, single rooms, furnished homes and commercial rentals.", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85", icon: Sparkles, accent: "gold" },
  { eyebrow: "BUSINESS SPACES", title: "Commercial property", description: "Offices, shops, warehouses and commercial buildings for sale or rent.", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85", icon: Landmark, accent: "ink" },
];

const properties: Property[] = [
  { type: "For Sale", typeColor: "sale", category: "House", price: "UGX 850,000,000", priceValue: 850000000, title: "4 Bedroom House — Kololo", location: "Kololo, Kampala", bedrooms: 4, details: ["4 Beds", "4 Baths", "3,500 Sqft"], image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1000&q=88" },
  { type: "For Sale", typeColor: "sale", category: "Land", price: "UGX 120,000,000", priceValue: 120000000, title: "50 Acres Agricultural Land", location: "Mukono", details: ["50 Acres", "Freehold", "Road Access"], image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=88" },
  { type: "For Rent", typeColor: "rent", category: "Apartment", price: "UGX 1,200,000", priceValue: 1200000, priceSuffix: "/ month", title: "2 Bedroom Apartment — Kisaasi", location: "Kisaasi, Kampala", bedrooms: 2, details: ["2 Beds", "2 Baths", "1,200 Sqft"], image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=88" },
  { type: "For Sale", typeColor: "sale", category: "Commercial", price: "UGX 2,500,000,000", priceValue: 2500000000, title: "Commercial Building — Ntinda", location: "Ntinda, Kampala", details: ["12 Rooms", "6 Baths", "5,000 Sqft"], image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=88" },
  { type: "For Rent", typeColor: "rent", category: "House", price: "UGX 2,000,000", priceValue: 2000000, priceSuffix: "/ month", title: "3 Bedroom House — Bwebajja", location: "Bwebajja, Wakiso", bedrooms: 3, details: ["3 Beds", "3 Baths", "2,500 Sqft"], image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=88" },
];

const locations = [
  { name: "Kampala", count: "1,245 properties", image: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?auto=format&fit=crop&w=700&q=82" },
  { name: "Entebbe", count: "412 properties", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=82" },
  { name: "Mukono", count: "356 properties", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=82" },
  { name: "Jinja", count: "289 properties", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=700&q=82" },
  { name: "Kira", count: "276 properties", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=700&q=82" },
  { name: "Nansana", count: "198 properties", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=82" },
];

const trustItems = [
  { icon: ShieldCheck, title: "Verified Listings", description: "Real properties, real owners, real details." },
  { icon: UsersRound, title: "Trusted Agents", description: "Work with verified and rated agents." },
  { icon: LockKeyhole, title: "Secure Transactions", description: "Your data and conversations are protected." },
  { icon: Headset, title: "24/7 Support", description: "We're always here to help." },
];
const navLinks = ["Buy", "Rent", "Land", "Commercial"];
const formatUGX = (value: number) => `UGX ${Math.round(value).toLocaleString("en-US")}`;

export default function Home() {
  const [, navigate] = useLocation();
  const auth = trpc.auth.me.useQuery();
  const liveListings = trpc.listings.list.useQuery({ sort: "recommended" });
  const utils = trpc.useUtils();
  const favorite = trpc.favorites.toggle.useMutation({ onSuccess: () => utils.listings.list.invalidate() });
  const inquiry = trpc.inquiries.create.useMutation({
    onSuccess: () => {
      showNotice("Thanks — your inquiry is saved. An A&O property advisor will contact you shortly.");
      setInquiryName(""); setInquiryEmail(""); setInquiryPhone("");
    },
    onError: error => showNotice(error.message),
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Any type");
  const [priceRange, setPriceRange] = useState("Any price");
  const [bedrooms, setBedrooms] = useState("Any");
  const [liked, setLiked] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [filterOpen, setFilterOpen] = useState(true);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterListing, setFilterListing] = useState("All listings");
  const [filterType, setFilterType] = useState("All property types");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterBeds, setFilterBeds] = useState("Any bedrooms");
  const [sortBy, setSortBy] = useState("Recommended");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("I would like to schedule a viewing and learn more about this property.");
  const [mortgagePrice, setMortgagePrice] = useState(850000000);
  const [downPayment, setDownPayment] = useState(170000000);
  const [interestRate, setInterestRate] = useState(16);
  const [termYears, setTermYears] = useState(15);

  const liveProperties = useMemo<Property[]>(() => (liveListings.data?.properties ?? []).map((property) => ({
    id: property.id,
    type: property.listingMode === "sale" ? "For Sale" : "For Rent",
    typeColor: property.listingMode,
    category: property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) as PropertyType,
    price: formatUGX(property.price),
    priceValue: property.price,
    priceSuffix: property.listingMode === "rent" ? "/ month" : undefined,
    title: property.title,
    location: property.location,
    bedrooms: property.bedrooms || undefined,
    details: [property.bedrooms ? `${property.bedrooms} Beds` : "Land", property.bathrooms ? `${property.bathrooms} Baths` : "Freehold", property.area],
    image: property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=88",
  })), [liveListings.data]);
  const homepageProperties = liveProperties.length ? liveProperties : properties;

  const resultLabel = useMemo(() => {
    const pieces = [location, propertyType !== "Any type" ? propertyType : "", priceRange !== "Any price" ? priceRange : "", bedrooms !== "Any" ? `${bedrooms} beds` : ""].filter(Boolean);
    return pieces.length ? `Showing matches for ${pieces.join(" · ")}` : "Explore our latest property opportunities";
  }, [location, propertyType, priceRange, bedrooms]);

  const filteredProperties = useMemo(() => {
    const min = filterMinPrice ? Number(filterMinPrice) : 0;
    const max = filterMaxPrice ? Number(filterMaxPrice) : Number.POSITIVE_INFINITY;
    const minBeds = filterBeds === "Any bedrooms" ? 0 : Number(filterBeds.replace("+", ""));
    const filtered = homepageProperties.filter((property) => {
      const matchesLocation = !filterLocation || property.location.toLowerCase().includes(filterLocation.toLowerCase());
      const matchesListing = filterListing === "All listings" || property.type === filterListing;
      const matchesType = filterType === "All property types" || property.category === filterType;
      const matchesPrice = property.priceValue >= min && property.priceValue <= max;
      const matchesBeds = minBeds === 0 || (property.bedrooms ?? 0) >= minBeds;
      return matchesLocation && matchesListing && matchesType && matchesPrice && matchesBeds;
    });
    return [...filtered].sort((a, b) => sortBy === "Price: Low to high" ? a.priceValue - b.priceValue : sortBy === "Price: High to low" ? b.priceValue - a.priceValue : a.title.localeCompare(b.title));
  }, [homepageProperties, filterLocation, filterListing, filterType, filterMinPrice, filterMaxPrice, filterBeds, sortBy]);

  const monthlyMortgage = useMemo(() => {
    const principal = Math.max(0, mortgagePrice - downPayment);
    const monthlyRate = interestRate / 100 / 12;
    const months = termYears * 12;
    if (!principal || !monthlyRate) return principal / Math.max(months, 1);
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }, [mortgagePrice, downPayment, interestRate, termYears]);
  const totalInterest = Math.max(0, (monthlyMortgage * termYears * 12) - Math.max(0, mortgagePrice - downPayment));

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4000);
  };
  const handleSearch = () => {
    setFilterLocation(location);
    setFilterType(propertyType === "Any type" ? "All property types" : propertyType);
    setFilterBeds(bedrooms === "Any" ? "Any bedrooms" : bedrooms);
    if (priceRange === "Under UGX 500M") { setFilterMinPrice(""); setFilterMaxPrice("500000000"); }
    else if (priceRange === "UGX 500M – 1B") { setFilterMinPrice("500000000"); setFilterMaxPrice("1000000000"); }
    else if (priceRange === "Over UGX 1B") { setFilterMinPrice("1000000000"); setFilterMaxPrice(""); }
    else { setFilterMinPrice(""); setFilterMaxPrice(""); }
    showNotice(resultLabel);
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (propertyType !== "Any type") params.set("propertyType", propertyType.toLowerCase());
    if (priceRange === "Under UGX 500M") params.set("maxPrice", "500000000");
    if (priceRange === "UGX 500M – 1B") { params.set("minPrice", "500000000"); params.set("maxPrice", "1000000000"); }
    if (priceRange === "Over UGX 1B") params.set("minPrice", "1000000000");
    if (bedrooms !== "Any") params.set("minBedrooms", bedrooms.replace("+", ""));
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
  };
  const resetFilters = () => {
    setFilterLocation(""); setFilterListing("All listings"); setFilterType("All property types"); setFilterMinPrice(""); setFilterMaxPrice(""); setFilterBeds("Any bedrooms"); setSortBy("Recommended");
  };
  const openInquiry = (property: Property) => {
    setSelectedProperty(property);
    setMortgagePrice(property.priceValue);
    setDownPayment(Math.round(property.priceValue * .2));
    window.setTimeout(() => document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };
  const handleInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProperty?.id) {
      showNotice("Choose a specific property so we can route your inquiry to the right advisor.");
      return;
    }
    inquiry.mutate({ propertyId: selectedProperty.id, name: inquiryName, email: inquiryEmail, phone: inquiryPhone, message: inquiryMessage });
  };
  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    showNotice("You're on the list — we'll keep you posted on new opportunities.");
    setEmail("");
  };

  return (
    <div className="site-shell">
      {notice && <div className="floating-notice" role="status">{notice}</div>}
      <header className="site-header"><div className="nav-wrap">
        <button className="brand-lockup" onClick={() => scrollTo("top")} aria-label="A&O Real Estate Solutions home"><span className="brand-mark"><span>A</span><i>&amp;</i><span>O</span></span><span className="brand-copy"><strong>A&amp;O</strong><small>REAL ESTATE SOLUTIONS</small><em>Building Dreams, Finding Homes</em></span></button>
        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`}><button className="nav-link active" onClick={() => scrollTo("top")}>Home</button>{navLinks.map((item) => <button key={item} className="nav-link has-chevron" onClick={() => navigate("/properties")}>{item}<ChevronDown size={13} /></button>)}<button className="nav-link" onClick={() => navigate("/list-property")}>List a Property</button><button className="nav-link" onClick={() => scrollTo("why-us")}>About Us</button><button className="nav-link" onClick={() => scrollTo("footer")}>Contact</button></nav>
        <div className="header-actions"><button className="icon-button search-button" aria-label="Search" onClick={() => scrollTo("search-panel")}><Search size={19} /></button><button className="sign-in-button" onClick={() => startLogin()}>Sign In</button><button className="gold-button compact" onClick={() => { window.location.href = "/list-property"; }}>Get Started</button></div>
        <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div></header>

      <main id="top">
        <section className="hero-section" style={{ backgroundImage: `linear-gradient(90deg, rgba(4, 30, 58, .96) 0%, rgba(4, 30, 58, .85) 34%, rgba(4, 30, 58, .18) 72%, rgba(4, 30, 58, .1) 100%), url(${heroImage})` }}><div className="hero-inner"><div className="hero-copy"><div className="eyebrow light"><span /> UGANDA'S TRUSTED REAL ESTATE MARKETPLACE</div><h1>Find Land.<br />Discover Homes.<br /><span>Make Your Next Move.</span></h1><p>Buy, sell, rent and invest in properties across Uganda.<br className="desktop-break" /> From residential homes to prime land and commercial spaces —<br className="desktop-break" /> we make it simple, secure and seamless.</p><div className="hero-links"><button onClick={() => navigate("/properties")}>Explore listings <ArrowUpRight size={16} /></button><button onClick={() => navigate("/list-property")}>List your property <ArrowRight size={16} /></button></div></div></div></section>
        <section className="search-panel-wrap" id="search-panel"><div className="search-panel"><label className="search-field location-field"><MapPin size={20} /><span><small>Location</small><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Kampala, Entebbe, Mukono..." /></span></label><label className="search-field"><HomeIcon size={20} /><span><small>Property Type</small><select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}><option>Any type</option><option>House</option><option>Apartment</option><option>Land</option><option>Commercial</option></select></span></label><label className="search-field"><span className="field-icon tag-icon">◆</span><span><small>Price Range</small><select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}><option>Any price</option><option>Under UGX 500M</option><option>UGX 500M – 1B</option><option>Over UGX 1B</option></select></span></label><label className="search-field"><BedDouble size={20} /><span><small>Bedrooms</small><select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}><option>Any</option><option>1</option><option>2</option><option>3</option><option>4+</option></select></span></label><button className="search-cta" onClick={handleSearch}><Search size={19} /> Search Properties</button></div></section>

        <section className="content-section category-section" id="categories"><div className="section-heading centered-heading"><div><div className="eyebrow"><span /> FIND YOUR PLACE</div><h2>Ways to move forward</h2></div><p>From a first plot to a forever home, discover spaces that match your next chapter.</p></div><div className="category-grid">{categoryCards.map(({ icon: Icon, ...card }) => <button className={`category-card accent-${card.accent}`} key={card.title} onClick={() => { const type = card.title.includes("Land") ? "Land" : card.title.includes("Commercial") ? "Commercial" : card.title.includes("Rent") ? "Apartment" : "House"; setFilterType(type); scrollTo("featured"); }}><div className="category-photo" style={{ backgroundImage: `url(${card.image})` }}><span className="category-icon"><Icon size={24} /></span></div><div className="category-body"><div><small>{card.eyebrow}</small><h3>{card.title}</h3><p>{card.description}</p></div><span className="round-arrow"><ArrowUpRight size={17} /></span></div></button>)}</div></section>

        <section className="content-section featured-section" id="featured"><div className="section-heading"><div><div className="eyebrow"><span /> CURATED FOR YOU</div><h2>Premium listings</h2></div><div className="results-actions"><span className="result-count">{filteredProperties.length} of {homepageProperties.length} matches</span><button className="text-link" onClick={() => navigate("/properties")}>View all properties <ArrowRight size={15} /></button></div></div>
          <div className={`filter-panel ${filterOpen ? "is-open" : ""}`}><div className="filter-panel-head"><div><span className="filter-title"><SlidersHorizontal size={17} /> Detailed filters</span><small>Refine by budget, category, location and lifestyle.</small></div><button className="filter-toggle" onClick={() => setFilterOpen((value) => !value)}>{filterOpen ? "Hide filters" : "Show filters"}<ChevronDown size={15} className={filterOpen ? "turn" : ""} /></button></div>{filterOpen && <div className="filter-controls"><label><span>Location</span><div className="filter-input"><MapPin size={15} /><input value={filterLocation} onChange={(event) => setFilterLocation(event.target.value)} placeholder="Any Uganda location" /></div></label><label><span>Listing status</span><select value={filterListing} onChange={(event) => setFilterListing(event.target.value)}><option>All listings</option><option>For Sale</option><option>For Rent</option></select></label><label><span>Property type</span><select value={filterType} onChange={(event) => setFilterType(event.target.value)}><option>All property types</option><option>House</option><option>Apartment</option><option>Land</option><option>Commercial</option></select></label><label><span>Min. price (UGX)</span><input type="number" min="0" value={filterMinPrice} onChange={(event) => setFilterMinPrice(event.target.value)} placeholder="No minimum" /></label><label><span>Max. price (UGX)</span><input type="number" min="0" value={filterMaxPrice} onChange={(event) => setFilterMaxPrice(event.target.value)} placeholder="No maximum" /></label><label><span>Bedrooms</span><select value={filterBeds} onChange={(event) => setFilterBeds(event.target.value)}><option>Any bedrooms</option><option>1</option><option>2</option><option>3</option><option>4+</option></select></label><label><span>Sort by</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option>Recommended</option><option>Price: Low to high</option><option>Price: High to low</option></select></label><button className="reset-button" onClick={resetFilters}><RotateCcw size={14} /> Reset</button></div>}</div>
          {filteredProperties.length ? <div className="property-grid">{filteredProperties.map((property) => { const index = homepageProperties.indexOf(property); const isSaved = property.id ? (liveListings.data?.savedIds.includes(property.id) ?? false) : liked.includes(index); return <article className="property-card" key={property.id ?? property.title}><div className="property-image" style={{ backgroundImage: `url(${property.image})` }}><span className={`listing-badge ${property.typeColor}`}>{property.type}</span><button className={`heart-button ${isSaved ? "liked" : ""}`} aria-label="Save property" onClick={() => { if (property.id) { if (!auth.data) { startLogin(); return; } favorite.mutate({ id: property.id }); } else { setLiked((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]); } }}><Heart size={17} fill={isSaved ? "currentColor" : "none"} /></button></div><div className="property-info"><div className="property-price">{property.price} {property.priceSuffix && <small>{property.priceSuffix}</small>}</div><h3>{property.title}</h3><div className="property-meta">{property.details.map((detail, detailIndex) => <span key={detail}><span className="meta-icon">{detailIndex === 0 ? <BedDouble size={14} /> : detailIndex === 1 ? <Bath size={14} /> : <Ruler size={14} />}</span>{detail}</span>)}</div><div className="property-location"><MapPin size={14} /> {property.location}</div><button className="inquiry-link" onClick={() => openInquiry(property)}>Ask about this property <ArrowRight size={13} /></button></div></article>; })}</div> : <div className="empty-results"><Search size={24} /><h3>No exact matches yet</h3><p>Try widening your price range or removing one of the filters.</p><button className="outline-light-button" onClick={resetFilters}>Clear filters</button></div>}
        </section>

        <section className="content-section decision-section" id="tools"><div className="tool-card mortgage-card"><div className="tool-heading"><span className="tool-icon"><Calculator size={21} /></span><div><div className="eyebrow"><span /> PLAN WITH CONFIDENCE</div><h2>Mortgage calculator</h2></div></div><p className="tool-intro">Estimate your monthly repayment before you make your next move. Adjust the figures to see what feels comfortable.</p><div className="calculator-grid"><label><span>Property price (UGX)</span><input type="number" min="0" value={mortgagePrice} onChange={(event) => setMortgagePrice(Number(event.target.value))} /></label><label><span>Down payment (UGX)</span><input type="number" min="0" max={mortgagePrice} value={downPayment} onChange={(event) => setDownPayment(Math.min(mortgagePrice, Number(event.target.value)))} /></label><label><span>Interest rate</span><div className="input-suffix"><input type="number" min="0" max="40" step=".1" value={interestRate} onChange={(event) => setInterestRate(Number(event.target.value))} /><b>%</b></div></label><label><span>Loan term</span><div className="input-suffix"><select value={termYears} onChange={(event) => setTermYears(Number(event.target.value))}><option value={5}>5 years</option><option value={10}>10 years</option><option value={15}>15 years</option><option value={20}>20 years</option><option value={25}>25 years</option></select><CalendarDays size={15} /></div></label></div><div className="mortgage-result"><div><small>Estimated monthly payment</small><strong>{formatUGX(monthlyMortgage)}</strong><span>Principal + interest only</span></div><div className="result-stat"><small>Total interest</small><b>{formatUGX(totalInterest)}</b></div><div className="result-stat"><small>Loan amount</small><b>{formatUGX(Math.max(0, mortgagePrice - downPayment))}</b></div></div></div>
          <div className="tool-card inquiry-card" id="inquiry-form"><div className="tool-heading"><span className="tool-icon gold-icon"><Send size={20} /></span><div><div className="eyebrow"><span /> TALK TO A PROPERTY ADVISOR</div><h2>Property inquiry</h2></div></div><p className="tool-intro">Have a question or ready to view? Send us your details and we’ll connect you with the right A&amp;O advisor.</p>{selectedProperty && <div className="selected-property"><img src={selectedProperty.image} alt="" /><div><small>Enquiring about</small><strong>{selectedProperty.title}</strong><span>{selectedProperty.price} · {selectedProperty.location}</span></div><button aria-label="Clear selected property" onClick={() => setSelectedProperty(null)}><X size={15} /></button></div>}<form className="inquiry-form" onSubmit={handleInquiry}><div className="form-row"><label><span>Your name</span><input required value={inquiryName} onChange={(event) => setInquiryName(event.target.value)} placeholder="e.g. Sarah Namusoke" /></label><label><span>Email address</span><input required type="email" value={inquiryEmail} onChange={(event) => setInquiryEmail(event.target.value)} placeholder="you@example.com" /></label></div><div className="form-row"><label><span>Phone number</span><input required type="tel" value={inquiryPhone} onChange={(event) => setInquiryPhone(event.target.value)} placeholder="+256 700 000 000" /></label><label><span>I'm interested in</span><select required value={selectedProperty?.id?.toString() ?? ""} onChange={(event) => { const found = homepageProperties.find((property) => property.id?.toString() === event.target.value); if (found) setSelectedProperty(found); }}><option value="">Select a property</option>{homepageProperties.map((property) => <option key={property.id ?? property.title} value={property.id ?? ""}>{property.title}</option>)}</select></label></div><label><span>Your message</span><textarea rows={3} value={inquiryMessage} onChange={(event) => setInquiryMessage(event.target.value)} /></label><button className="gold-button form-submit" type="submit" disabled={inquiry.isPending}>{inquiry.isPending ? "Sending..." : "Send inquiry"} <ArrowRight size={16} /></button></form></div></section>

        <section className="content-section locations-section"><div className="section-heading"><div><div className="eyebrow"><span /> POPULAR LOCATIONS</div><h2>Explore top locations</h2></div><button className="text-link" onClick={() => showNotice("Location browsing is ready to expand with more towns across Uganda.")}>View all locations <ArrowRight size={15} /></button></div><div className="location-grid">{locations.map((locationItem) => <button className="location-card" key={locationItem.name} onClick={() => { setLocation(locationItem.name); setFilterLocation(locationItem.name); scrollTo("featured"); }} style={{ backgroundImage: `linear-gradient(0deg, rgba(4, 23, 43, .82), rgba(4, 23, 43, .04) 72%), url(${locationItem.image})` }}><span><strong><MapPin size={14} /> {locationItem.name}</strong><small>{locationItem.count}</small></span></button>)}</div></section>
        <section className="trust-section" id="why-us"><div className="trust-intro"><div className="eyebrow"><span /> WHY CHOOSE A&amp;O?</div><h2>Trusted. Simple. Secure.</h2><p>We connect you with verified property owners, trusted agents and genuine listings. Your dream property is just a few clicks away.</p><button className="outline-light-button" onClick={() => scrollTo("tools")}>How it works <ArrowRight size={16} /></button></div><div className="trust-grid">{trustItems.map(({ icon: Icon, title, description }) => <div className="trust-item" key={title}><span className="trust-icon"><Icon size={23} /></span><h3>{title}</h3><p>{description}</p></div>)}</div></section>
        <section className="listing-cta" id="list-property"><div className="cta-copy"><div className="eyebrow light"><span /> FOR PROPERTY OWNERS &amp; AGENTS</div><h2>Get more exposure.<br /><span>Find the right buyers or tenants.</span></h2><p>List your land, house or commercial property in minutes and reach thousands of potential buyers and renters across Uganda.</p></div><button className="gold-button" onClick={() => showNotice("Our listing team will be in touch to help you get started.")}>List a Property <ArrowRight size={17} /></button><div className="cta-stamp"><span>Your property journey</span><strong>starts here</strong></div></section>
      </main>

      <footer className="site-footer" id="footer"><div className="footer-main"><div className="footer-brand"><button className="brand-lockup footer-logo" onClick={() => scrollTo("top")}><span className="brand-mark"><span>A</span><i>&amp;</i><span>O</span></span><span className="brand-copy"><strong>A&amp;O</strong><small>REAL ESTATE SOLUTIONS</small><em>Building Dreams, Finding Homes</em></span></button><p>Your trusted partner for land, homes, rentals and commercial property in Uganda.</p></div><div className="footer-col"><h4>Quick Links</h4><button onClick={() => scrollTo("top")}>Home</button><button onClick={() => scrollTo("featured")}>Buy</button><button onClick={() => scrollTo("featured")}>Rent</button><button onClick={() => scrollTo("categories")}>Land</button><button onClick={() => scrollTo("list-property")}>List a Property</button></div><div className="footer-col"><h4>Support</h4><button onClick={() => showNotice("FAQs are on their way.")}>FAQ</button><button onClick={() => scrollTo("footer")}>Contact Us</button><button onClick={() => showNotice("Terms and conditions are being prepared.")}>Terms &amp; Conditions</button><button onClick={() => showNotice("Your privacy matters to us.")}>Privacy Policy</button><button onClick={() => showNotice("We'll show you how it works.")}>How It Works</button></div><div className="footer-col contact-col"><h4>Contact Us</h4><a href="tel:+256700123456"><Phone size={14} /> +256 700 123 456</a><a href="mailto:info@aorealestatesolutions.ug"><Mail size={14} /> info@aorealestatesolutions.ug</a><span><MapPin size={14} /> Kampala, Uganda</span><div className="socials"><a href="https://facebook.com" aria-label="Facebook"><Facebook size={15} /></a><a href="https://instagram.com" aria-label="Instagram"><Instagram size={15} /></a><a href="https://youtube.com" aria-label="YouTube"><Youtube size={15} /></a></div></div><div className="footer-col newsletter-col"><h4>Get property updates</h4><p>Be the first to know about new listings, price drops and exclusive deals.</p><form onSubmit={handleSubscribe}><input type="email" aria-label="Email address" placeholder="Enter your email address" value={email} onChange={(event) => setEmail(event.target.value)} required /><button aria-label="Subscribe"><ArrowRight size={16} /></button></form><small><Clock3 size={13} /> One thoughtful email, never spam.</small></div></div><div className="footer-bottom"><span>© 2025 A&amp;O Real Estate Solutions. All rights reserved.</span><span>Building Dreams, Guided by Faith &nbsp;|&nbsp; Proverbs 16:3</span></div></footer>
    </div>
  );
}
