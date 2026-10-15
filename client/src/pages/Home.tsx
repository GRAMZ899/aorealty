import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
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
  Ruler,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
  Youtube,
} from "lucide-react";

const heroImage = "/manus-storage/async-images/35W81GozDtq8TxCgiWwjRo/image-1.webp";

const categoryCards = [
  {
    eyebrow: "LAND & ACREAGE",
    title: "Land for sale",
    description: "Residential plots, agricultural land, commercial and investment acreage.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85",
    icon: Landmark,
    accent: "green",
  },
  {
    eyebrow: "HOMES",
    title: "Houses for sale",
    description: "Family homes, villas, apartments and newly constructed houses.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
    icon: HomeIcon,
    accent: "navy",
  },
  {
    eyebrow: "FLEXIBLE LIVING",
    title: "Rentals",
    description: "Apartments, single rooms, furnished homes and commercial rentals.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85",
    icon: Sparkles,
    accent: "gold",
  },
  {
    eyebrow: "BUSINESS SPACES",
    title: "Commercial property",
    description: "Offices, shops, warehouses and commercial buildings for sale or rent.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85",
    icon: Landmark,
    accent: "ink",
  },
];

const properties = [
  {
    type: "For Sale",
    typeColor: "sale",
    price: "UGX 850,000,000",
    title: "4 Bedroom House — Kololo",
    location: "Kololo, Kampala",
    details: ["4 Beds", "4 Baths", "3,500 Sqft"],
    image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1000&q=88",
  },
  {
    type: "For Sale",
    typeColor: "sale",
    price: "UGX 120,000,000",
    title: "50 Acres Agricultural Land",
    location: "Mukono",
    details: ["50 Acres", "Freehold", "Road Access"],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=88",
  },
  {
    type: "For Rent",
    typeColor: "rent",
    price: "UGX 1,200,000",
    priceSuffix: "/ month",
    title: "2 Bedroom Apartment — Kisaasi",
    location: "Kisaasi, Kampala",
    details: ["2 Beds", "2 Baths", "1,200 Sqft"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=88",
  },
  {
    type: "For Sale",
    typeColor: "sale",
    price: "UGX 2,500,000,000",
    title: "Commercial Building — Ntinda",
    location: "Ntinda, Kampala",
    details: ["12 Rooms", "6 Baths", "5,000 Sqft"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=88",
  },
  {
    type: "For Rent",
    typeColor: "rent",
    price: "UGX 2,000,000",
    priceSuffix: "/ month",
    title: "3 Bedroom House — Bwebajja",
    location: "Bwebajja, Wakiso",
    details: ["3 Beds", "3 Baths", "2,500 Sqft"],
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=88",
  },
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

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Any type");
  const [priceRange, setPriceRange] = useState("Any price");
  const [bedrooms, setBedrooms] = useState("Any");
  const [liked, setLiked] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");

  const resultLabel = useMemo(() => {
    const pieces = [location, propertyType !== "Any type" ? propertyType : "", priceRange !== "Any price" ? priceRange : "", bedrooms !== "Any" ? `${bedrooms} beds` : ""].filter(Boolean);
    return pieces.length ? `Showing matches for ${pieces.join(" · ")}` : "Explore our latest property opportunities";
  }, [location, propertyType, priceRange, bedrooms]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const handleSearch = () => {
    setNotice(resultLabel);
    setTimeout(() => setNotice(""), 3800);
    scrollTo("featured");
  };

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setNotice("You're on the list — we'll keep you posted on new opportunities.");
    setEmail("");
    setTimeout(() => setNotice(""), 4200);
  };

  return (
    <div className="site-shell">
      {notice && <div className="floating-notice" role="status">{notice}</div>}

      <header className="site-header">
        <div className="nav-wrap">
          <button className="brand-lockup" onClick={() => scrollTo("top")} aria-label="A&O Real Estate Solutions home">
            <span className="brand-mark"><span>A</span><i>&amp;</i><span>O</span></span>
            <span className="brand-copy"><strong>A&amp;O</strong><small>REAL ESTATE SOLUTIONS</small><em>Building Dreams, Finding Homes</em></span>
          </button>
          <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`}>
            <button className="nav-link active" onClick={() => scrollTo("top")}>Home</button>
            {navLinks.map((item) => <button key={item} className="nav-link has-chevron" onClick={() => scrollTo(item === "Commercial" ? "featured" : "categories")}>{item}<ChevronDown size={13} /></button>)}
            <button className="nav-link" onClick={() => scrollTo("list-property")}>List a Property</button>
            <button className="nav-link" onClick={() => scrollTo("why-us")}>About Us</button>
            <button className="nav-link" onClick={() => scrollTo("footer")}>Contact</button>
          </nav>
          <div className="header-actions">
            <button className="icon-button search-button" aria-label="Search" onClick={() => scrollTo("search-panel")}><Search size={19} /></button>
            <button className="sign-in-button" onClick={() => setNotice("Sign in is coming soon — your saved properties will live here.")}>Sign In</button>
            <button className="gold-button compact" onClick={() => scrollTo("list-property")}>Get Started</button>
          </div>
          <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section" style={{ backgroundImage: `linear-gradient(90deg, rgba(4, 30, 58, .96) 0%, rgba(4, 30, 58, .85) 34%, rgba(4, 30, 58, .18) 72%, rgba(4, 30, 58, .1) 100%), url(${heroImage})` }}>
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow light"><span /> UGANDA'S TRUSTED REAL ESTATE MARKETPLACE</div>
              <h1>Find Land.<br />Discover Homes.<br /><span>Make Your Next Move.</span></h1>
              <p>Buy, sell, rent and invest in properties across Uganda.<br className="desktop-break" /> From residential homes to prime land and commercial spaces —<br className="desktop-break" /> we make it simple, secure and seamless.</p>
              <div className="hero-links"><button onClick={() => scrollTo("featured")}>Explore listings <ArrowUpRight size={16} /></button><button onClick={() => scrollTo("list-property")}>List your property <ArrowRight size={16} /></button></div>
            </div>
          </div>
        </section>

        <section className="search-panel-wrap" id="search-panel">
          <div className="search-panel">
            <label className="search-field location-field"><MapPin size={20} /><span><small>Location</small><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Kampala, Entebbe, Mukono..." /></span></label>
            <label className="search-field"><HomeIcon size={20} /><span><small>Property Type</small><select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}><option>Any type</option><option>House</option><option>Apartment</option><option>Land</option><option>Commercial</option></select></span></label>
            <label className="search-field"><span className="field-icon tag-icon">◆</span><span><small>Price Range</small><select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}><option>Any price</option><option>Under UGX 500M</option><option>UGX 500M – 1B</option><option>Over UGX 1B</option></select></span></label>
            <label className="search-field"><BedDouble size={20} /><span><small>Bedrooms</small><select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}><option>Any</option><option>1</option><option>2</option><option>3</option><option>4+</option></select></span></label>
            <button className="search-cta" onClick={handleSearch}><Search size={19} /> Search Properties</button>
          </div>
        </section>

        <section className="content-section category-section" id="categories">
          <div className="section-heading centered-heading"><div><div className="eyebrow"><span /> FIND YOUR PLACE</div><h2>Ways to move forward</h2></div><p>From a first plot to a forever home, discover spaces that match your next chapter.</p></div>
          <div className="category-grid">
            {categoryCards.map(({ icon: Icon, ...card }) => <button className={`category-card accent-${card.accent}`} key={card.title} onClick={() => { setPropertyType(card.title.replace(" for sale", "").replace("Houses", "House").replace("Rentals", "Rental")); scrollTo("featured"); }}><div className="category-photo" style={{ backgroundImage: `url(${card.image})` }}><span className="category-icon"><Icon size={24} /></span></div><div className="category-body"><div><small>{card.eyebrow}</small><h3>{card.title}</h3><p>{card.description}</p></div><span className="round-arrow"><ArrowUpRight size={17} /></span></div></button>)}
          </div>
        </section>

        <section className="content-section featured-section" id="featured">
          <div className="section-heading"><div><div className="eyebrow"><span /> CURATED FOR YOU</div><h2>Premium listings</h2></div><button className="text-link" onClick={() => setNotice("More verified listings are being added every week.")}>View all properties <ArrowRight size={15} /></button></div>
          <div className="property-grid">
            {properties.map((property, index) => <article className="property-card" key={property.title}><div className="property-image" style={{ backgroundImage: `url(${property.image})` }}><span className={`listing-badge ${property.typeColor}`}>{property.type}</span><button className={`heart-button ${liked.includes(index) ? "liked" : ""}`} aria-label="Save property" onClick={() => setLiked((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])}><Heart size={17} fill={liked.includes(index) ? "currentColor" : "none"} /></button></div><div className="property-info"><div className="property-price">{property.price} {property.priceSuffix && <small>{property.priceSuffix}</small>}</div><h3>{property.title}</h3><div className="property-meta">{property.details.map((detail, detailIndex) => <span key={detail}><span className="meta-icon">{detailIndex === 0 ? <BedDouble size={14} /> : detailIndex === 1 ? <Bath size={14} /> : <Ruler size={14} />}</span>{detail}</span>)}</div><div className="property-location"><MapPin size={14} /> {property.location}</div></div></article>)}
          </div>
        </section>

        <section className="content-section locations-section">
          <div className="section-heading"><div><div className="eyebrow"><span /> POPULAR LOCATIONS</div><h2>Explore top locations</h2></div><button className="text-link" onClick={() => setNotice("Location browsing is ready to expand with more towns across Uganda.")}>View all locations <ArrowRight size={15} /></button></div>
          <div className="location-grid">{locations.map((locationItem) => <button className="location-card" key={locationItem.name} onClick={() => { setLocation(locationItem.name); handleSearch(); }} style={{ backgroundImage: `linear-gradient(0deg, rgba(4, 23, 43, .82), rgba(4, 23, 43, .04) 72%), url(${locationItem.image})` }}><span><strong><MapPin size={14} /> {locationItem.name}</strong><small>{locationItem.count}</small></span></button>)}</div>
        </section>

        <section className="trust-section" id="why-us">
          <div className="trust-intro"><div className="eyebrow"><span /> WHY CHOOSE A&amp;O?</div><h2>Trusted. Simple. Secure.</h2><p>We connect you with verified property owners, trusted agents and genuine listings. Your dream property is just a few clicks away.</p><button className="outline-light-button" onClick={() => scrollTo("featured")}>How it works <ArrowRight size={16} /></button></div>
          <div className="trust-grid">{trustItems.map(({ icon: Icon, title, description }) => <div className="trust-item" key={title}><span className="trust-icon"><Icon size={23} /></span><h3>{title}</h3><p>{description}</p></div>)}</div>
        </section>

        <section className="listing-cta" id="list-property"><div className="cta-copy"><div className="eyebrow light"><span /> FOR PROPERTY OWNERS &amp; AGENTS</div><h2>Get more exposure.<br /><span>Find the right buyers or tenants.</span></h2><p>List your land, house or commercial property in minutes and reach thousands of potential buyers and renters across Uganda.</p></div><button className="gold-button" onClick={() => setNotice("Our listing team will be in touch to help you get started.")}>List a Property <ArrowRight size={17} /></button><div className="cta-stamp"><span>Your property journey</span><strong>starts here</strong></div></section>
      </main>

      <footer className="site-footer" id="footer"><div className="footer-main"><div className="footer-brand"><button className="brand-lockup footer-logo" onClick={() => scrollTo("top")}><span className="brand-mark"><span>A</span><i>&amp;</i><span>O</span></span><span className="brand-copy"><strong>A&amp;O</strong><small>REAL ESTATE SOLUTIONS</small><em>Building Dreams, Finding Homes</em></span></button><p>Your trusted partner for land, homes, rentals and commercial property in Uganda.</p></div><div className="footer-col"><h4>Quick Links</h4><button onClick={() => scrollTo("top")}>Home</button><button onClick={() => scrollTo("featured")}>Buy</button><button onClick={() => scrollTo("featured")}>Rent</button><button onClick={() => scrollTo("categories")}>Land</button><button onClick={() => scrollTo("list-property")}>List a Property</button></div><div className="footer-col"><h4>Support</h4><button onClick={() => setNotice("FAQs are on their way.")}>FAQ</button><button onClick={() => scrollTo("footer")}>Contact Us</button><button onClick={() => setNotice("Terms and conditions are being prepared.")}>Terms &amp; Conditions</button><button onClick={() => setNotice("Your privacy matters to us.")}>Privacy Policy</button><button onClick={() => setNotice("We'll show you how it works.")}>How It Works</button></div><div className="footer-col contact-col"><h4>Contact Us</h4><a href="tel:+256700123456"><Phone size={14} /> +256 700 123 456</a><a href="mailto:info@aorealestatesolutions.ug"><Mail size={14} /> info@aorealestatesolutions.ug</a><span><MapPin size={14} /> Kampala, Uganda</span><div className="socials"><a href="https://facebook.com" aria-label="Facebook"><Facebook size={15} /></a><a href="https://instagram.com" aria-label="Instagram"><Instagram size={15} /></a><a href="https://youtube.com" aria-label="YouTube"><Youtube size={15} /></a></div></div><div className="footer-col newsletter-col"><h4>Get property updates</h4><p>Be the first to know about new listings, price drops and exclusive deals.</p><form onSubmit={handleSubscribe}><input type="email" aria-label="Email address" placeholder="Enter your email address" value={email} onChange={(event) => setEmail(event.target.value)} required /><button aria-label="Subscribe"><ArrowRight size={16} /></button></form><small><Clock3 size={13} /> One thoughtful email, never spam.</small></div></div><div className="footer-bottom"><span>© 2025 A&amp;O Real Estate Solutions. All rights reserved.</span><span>Building Dreams, Guided by Faith &nbsp;|&nbsp; Proverbs 16:3</span></div></footer>
    </div>
  );
}
