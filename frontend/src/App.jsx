import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Edit2,
  LogOut,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Star,
  Trash2,
  User,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const categories = ["All", "Smartphones", "Laptops", "Audio", "Accessories"];
const statuses = ["Pending", "Confirmed", "Shipped", "Delivered"];
const knownBrands = ["Samsung", "Realme", "OnePlus", "Dell", "HP", "Lenovo", "boAt", "Sony", "JBL", "Ambrane"];
const blankProduct = {
  name: "",
  category: "Smartphones",
  price: "",
  originalPrice: "",
  stock: "",
  image: "📦",
  description: "",
};

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getBrand(product) {
  const name = product?.name || "";
  const matched = knownBrands.find((brand) => name.toLowerCase().startsWith(brand.toLowerCase()));
  return matched || name.split(" ")[0] || "Other";
}

function api(path, options = {}, user) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(user?.id ? { "X-User-Id": String(user.id) } : {}),
      ...(options.headers || {}),
    },
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Request failed");
    return data;
  });
}

function Toasts({ toasts }) {
  return (
    <div className="toasts">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function StockBadge({ stock }) {
  if (stock <= 0) return <span className="stock out">Out of stock</span>;
  return (
    <span className="stock live">
      <span />
      LIVE In Stock
    </span>
  );
}

function Rating({ rating, reviews }) {
  return (
    <div className="rating">
      <Star size={16} fill="#F59E0B" color="#F59E0B" />
      <strong>{rating}</strong>
      <span>({reviews})</span>
    </div>
  );
}

function AnimatedBackground({ currentPage }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 54 }, (_, index) => ({
        id: index,
        left: `${Math.round((index * 37) % 100)}%`,
        top: `${Math.round((index * 61) % 100)}%`,
        size: `${2 + (index % 2)}px`,
        delay: `${-(index * 0.73).toFixed(2)}s`,
        duration: `${22 + (index % 17)}s`,
        sway: `${index % 3 === 0 ? -18 : index % 3 === 1 ? 14 : 8}px`,
        opacity: 0.2 + (index % 5) * 0.04,
      })),
    []
  );
  const meteors = useMemo(
    () =>
      [
        { id: 0, left: "-16%", top: "-10%", delay: "0s", length: "210px", duration: "24s", angle: "29deg", startX: "-30vw", startY: "-12vh", endX: "118vw", endY: "78vh" },
        { id: 1, left: "-4%", top: "-14%", delay: "4.6s", length: "270px", duration: "24s", angle: "34deg", startX: "-34vw", startY: "-16vh", endX: "112vw", endY: "86vh" },
        { id: 2, left: "18%", top: "-12%", delay: "9.8s", length: "230px", duration: "24s", angle: "27deg", startX: "-38vw", startY: "-14vh", endX: "126vw", endY: "74vh" },
        { id: 3, left: "-10%", top: "-18%", delay: "15.1s", length: "290px", duration: "24s", angle: "36deg", startX: "-40vw", startY: "-15vh", endX: "122vw", endY: "92vh" },
        { id: 4, left: "38%", top: "-16%", delay: "20.5s", length: "250px", duration: "24s", angle: "31deg", startX: "-36vw", startY: "-14vh", endX: "108vw", endY: "82vh" },
      ],
    []
  );
  const stars = useMemo(
    () =>
      Array.from({ length: 86 }, (_, index) => ({
        id: index,
        left: `${(index * 29 + 7) % 100}%`,
        top: `${(index * 47 + 11) % 100}%`,
        size: `${3 + (index % 4)}px`,
        delay: `${-(index * 0.41).toFixed(2)}s`,
        duration: `${3.8 + (index % 7) * 0.65}s`,
        opacity: 0.62 + (index % 5) * 0.08,
      })),
    []
  );

  return (
    <div className={`dynamicBg bg-${currentPage}`} aria-hidden="true">
      <style>{`
        .app {
          position: relative;
          isolation: isolate;
          overflow-x: hidden;
          background: transparent;
        }

        .app > :not(.dynamicBg) {
          position: relative;
          z-index: 1;
        }

        .dynamicBg {
          --page-accent: rgba(37, 99, 235, 0.15);
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          background: #0D1B2A;
          pointer-events: none;
        }

        .dynamicBg.bg-cart { --page-accent: rgba(245, 158, 11, 0.18); }
        .dynamicBg.bg-admin { --page-accent: rgba(124, 58, 237, 0.18); }
        .dynamicBg.bg-orders { --page-accent: rgba(16, 185, 129, 0.16); }
        .dynamicBg.bg-detail { --page-accent: rgba(6, 182, 212, 0.14); }
        .dynamicBg.bg-login { --page-accent: rgba(37, 99, 235, 0.13); }

        .ambientOrb {
          position: absolute;
          width: var(--orb-size);
          height: var(--orb-size);
          border-radius: 999px;
          filter: blur(80px);
          opacity: 1;
          will-change: transform;
          transition: background 1.5s ease;
        }

        .ambientOrb.one {
          --orb-size: 560px;
          left: -160px;
          top: -140px;
          background: radial-gradient(circle, var(--page-accent) 0%, rgba(37, 99, 235, 0.04) 45%, transparent 72%);
          animation: orbDriftOne 34s ease-in-out infinite;
        }

        .ambientOrb.two {
          --orb-size: 460px;
          right: -120px;
          top: 16%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.10) 0%, transparent 70%);
          animation: orbDriftTwo 29s ease-in-out infinite;
        }

        .ambientOrb.three {
          --orb-size: 520px;
          left: 16%;
          bottom: -220px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%);
          animation: orbDriftThree 38s ease-in-out infinite;
        }

        .ambientOrb.four {
          --orb-size: 430px;
          right: 18%;
          bottom: 8%;
          background: radial-gradient(circle, var(--page-accent) 0%, transparent 68%);
          animation: orbDriftFour 24s ease-in-out infinite;
        }

        .ambientOrb.five {
          --orb-size: 600px;
          left: 44%;
          top: 34%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.035) 0%, transparent 68%);
          animation: orbDriftFive 40s ease-in-out infinite;
        }

        .particle {
          position: absolute;
          width: var(--size);
          height: var(--size);
          left: var(--left);
          top: var(--top);
          border-radius: 50%;
          background: rgba(226, 242, 255, var(--opacity));
          box-shadow: 0 0 12px rgba(37, 99, 235, 0.25);
          animation: particleFloat var(--duration) linear infinite;
          animation-delay: var(--delay);
          will-change: transform;
        }

        .meteor {
          position: absolute;
          left: var(--left);
          top: var(--top);
          width: var(--length);
          height: 3px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 94% 50%, rgba(255, 255, 255, 1) 0 6px, transparent 7px),
            linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(6, 182, 212, 0.18) 26%, rgba(226, 242, 255, 0.86) 72%, rgba(255, 255, 255, 0.98));
          mask-image: linear-gradient(90deg, transparent 0%, black 22%, black 100%);
          box-shadow:
            0 0 12px rgba(255, 255, 255, 0.9),
            0 0 28px rgba(37, 99, 235, 0.58),
            0 0 46px rgba(6, 182, 212, 0.38);
          opacity: 0;
          transform: rotate(var(--angle)) translate3d(var(--start-x), var(--start-y), 0);
          animation: meteorFall var(--duration) linear infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity;
        }

        .meteor::before {
          content: "";
          position: absolute;
          inset: -7px 8px -7px 42%;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent);
          filter: blur(3px);
          animation: meteorShimmer 1.4s ease-in-out infinite;
        }

        .meteor::after {
          content: "";
          position: absolute;
          right: -7px;
          top: 50%;
          width: 13px;
          height: 13px;
          border-radius: 999px;
          background:
            radial-gradient(circle, #ffffff 0 30%, rgba(125, 211, 252, 0.9) 38%, rgba(37, 99, 235, 0.15) 68%, transparent 72%);
          box-shadow:
            0 0 16px rgba(255, 255, 255, 1),
            0 0 34px rgba(125, 211, 252, 0.72),
            0 0 58px rgba(37, 99, 235, 0.45);
          transform: translateY(-50%);
        }

        .brightStar {
          position: absolute;
          left: var(--left);
          top: var(--top);
          width: var(--size);
          height: var(--size);
          opacity: var(--opacity);
          background: rgba(255, 255, 255, 0.96);
          clip-path: polygon(50% 0%, 61% 36%, 100% 50%, 61% 64%, 50% 100%, 39% 64%, 0% 50%, 39% 36%);
          filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 16px rgba(125, 211, 252, 0.62));
          animation: starTwinkle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: opacity, transform;
        }

        .brightStar::after {
          content: "";
          position: absolute;
          inset: -120%;
          background:
            linear-gradient(90deg, transparent 44%, rgba(255, 255, 255, 0.22) 50%, transparent 56%),
            linear-gradient(0deg, transparent 44%, rgba(255, 255, 255, 0.22) 50%, transparent 56%);
        }

        .hero {
          position: relative;
          overflow: hidden;
        }

        .hero::before,
        .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .hero::before {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 36px 36px;
          animation: heroGridScroll 30s linear infinite;
        }

        .hero::after {
          height: 10px;
          inset: 0 0 auto;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
          animation: heroScan 4s ease-in-out infinite;
        }

        .hero > * {
          position: relative;
          z-index: 1;
        }

        .nav {
          background: rgba(13, 27, 42, 0.74);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .productCard {
          position: relative;
          overflow: hidden;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .productCard:hover {
          background: #F8FAFC;
          box-shadow: 0 28px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px #2563EB40;
        }

        .cartRipple {
          position: absolute;
          left: var(--x);
          top: var(--y);
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.34) 0%, rgba(6, 182, 212, 0.18) 42%, transparent 70%);
          transform: translate(-50%, -50%) scale(0);
          animation: cardRipple 650ms ease-out forwards;
          pointer-events: none;
          z-index: 0;
        }

        .productCard > :not(.cartRipple) {
          position: relative;
          z-index: 1;
        }

        @keyframes orbDriftOne {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(90px, 130px); }
          66% { transform: translate(240px, 40px); }
        }

        @keyframes orbDriftTwo {
          0%, 100% { transform: translate(0, 0); }
          40% { transform: translate(-130px, 90px); }
          75% { transform: translate(-50px, -80px); }
        }

        @keyframes orbDriftThree {
          0%, 100% { transform: translate(0, 0); }
          45% { transform: translate(160px, -100px); }
          80% { transform: translate(-70px, -180px); }
        }

        @keyframes orbDriftFour {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-140px, -120px); }
        }

        @keyframes orbDriftFive {
          0%, 100% { transform: translate(0, 0); }
          35% { transform: translate(-120px, 80px); }
          70% { transform: translate(110px, -120px); }
        }

        @keyframes particleFloat {
          0% { transform: translate3d(0, 12vh, 0); opacity: 0; }
          12% { opacity: var(--opacity); }
          88% { opacity: var(--opacity); }
          100% { transform: translate3d(var(--sway), -112vh, 0); opacity: 0; }
        }

        @keyframes meteorFall {
          0%, 10% {
            opacity: 0;
            transform: rotate(var(--angle)) translate3d(var(--start-x), var(--start-y), 0) scale(0.92);
          }
          12% {
            opacity: 1;
          }
          21% {
            opacity: 1;
          }
          24.5%, 100% {
            opacity: 0;
            transform: rotate(var(--angle)) translate3d(var(--end-x), var(--end-y), 0) scale(1.05);
          }
        }

        @keyframes meteorShimmer {
          0%, 100% { opacity: 0.25; transform: translateX(-12px); }
          50% { opacity: 0.75; transform: translateX(18px); }
        }

        @keyframes starTwinkle {
          0%, 100% {
            opacity: calc(var(--opacity) * 0.55);
            transform: scale(0.78) rotate(0deg);
          }
          42% {
            opacity: var(--opacity);
            transform: scale(1.25) rotate(18deg);
          }
          64% {
            opacity: calc(var(--opacity) * 0.72);
            transform: scale(0.92) rotate(28deg);
          }
        }

        @keyframes heroGridScroll {
          from { background-position: 0 0, 0 0; }
          to { background-position: 144px 144px, 144px 144px; }
        }

        @keyframes heroScan {
          0% { transform: translateY(-40px); opacity: 0; }
          18% { opacity: 1; }
          55% { opacity: 0.75; }
          100% { transform: translateY(120vh); opacity: 0; }
        }

        @keyframes cardRipple {
          to { transform: translate(-50%, -50%) scale(22); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
      <span className="ambientOrb one" />
      <span className="ambientOrb two" />
      <span className="ambientOrb three" />
      <span className="ambientOrb four" />
      <span className="ambientOrb five" />
      {stars.map((star) => (
        <span
          className="brightStar"
          key={star.id}
          style={{
            "--left": star.left,
            "--top": star.top,
            "--size": star.size,
            "--delay": star.delay,
            "--duration": star.duration,
            "--opacity": star.opacity,
          }}
        />
      ))}
      {meteors.map((meteor) => (
        <span
          className="meteor"
          key={meteor.id}
          style={{
            "--left": meteor.left,
            "--top": meteor.top,
            "--delay": meteor.delay,
            "--length": meteor.length,
            "--duration": meteor.duration,
            "--angle": meteor.angle,
            "--start-x": meteor.startX,
            "--start-y": meteor.startY,
            "--end-x": meteor.endX,
            "--end-y": meteor.endY,
          }}
        />
      ))}
      {particles.map((particle) => (
        <span
          className="particle"
          key={particle.id}
          style={{
            "--left": particle.left,
            "--top": particle.top,
            "--size": particle.size,
            "--delay": particle.delay,
            "--duration": particle.duration,
            "--sway": particle.sway,
            "--opacity": particle.opacity,
          }}
        />
      ))}
    </div>
  );
}

function Navbar({ user, cartCount, page, goTo, logout }) {
  const nav = [
    ["home", "Home"],
    ["products", "Products"],
    ["about", "About"],
    ["orders", "Orders"],
    ...(user?.role === "admin" ? [["admin", "Admin"]] : []),
  ];

  return (
    <header className="nav">
      <button className="brand" onClick={() => goTo("home")}>
        <span>VE</span>
        <div>
          <strong>Vardhman</strong>
          <small>Electronics</small>
        </div>
      </button>
      <nav className="navlinks">
        {nav.map(([id, label]) => (
          <button key={id} className={page === id ? "active" : ""} onClick={() => goTo(id)}>
            {id === "admin" && <Settings size={16} />}
            {label}
          </button>
        ))}
      </nav>
      <div className="navright">
        <button className="iconButton cartButton" onClick={() => goTo("cart")} aria-label="Cart">
          <ShoppingCart size={19} />
          {cartCount > 0 && <b>{cartCount}</b>}
        </button>
        {user ? (
          <>
            <span className="userChip">
              <User size={16} />
              {user.username}
            </span>
            <button className="iconButton" onClick={logout} aria-label="Logout">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <button className="primary small" onClick={() => goTo("login")}>
            Login
          </button>
        )}
      </div>
      <nav className="mobileNav">
        {nav.map(([id, label]) => (
          <button key={id} className={page === id ? "active" : ""} onClick={() => goTo(id)}>
            {id === "admin" && <Settings size={14} />}
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function Hero({ goTo }) {
  return (
    <section className="hero">
      <div>
        <span className="eyebrow">Premium Indian Electronics Retailer</span>
        <h1>Your Trusted Electronics Partner</h1>
        <p>Smartphones, laptops, audio gear, and daily tech essentials with honest prices, fresh stock, and dependable service.</p>
        <button className="heroCta" onClick={() => goTo("products")}>
          Shop Now <ShoppingCart size={18} />
        </button>
      </div>
      <div className="heroTiles" aria-label="Electronics categories">
        {[
          ["📱", "Phones"],
          ["💻", "Laptops"],
          ["🎧", "Audio"],
          ["🔋", "Power"],
        ].map(([icon, label]) => (
          <div key={label}>
            <span>{icon}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, onView, onAdd }) {
  const [ripple, setRipple] = useState(null);

  const handleAdd = (event) => {
    const card = event.currentTarget.closest(".productCard");
    const rect = card.getBoundingClientRect();
    const id = Date.now();
    setRipple({
      id,
      x: `${event.clientX - rect.left}px`,
      y: `${event.clientY - rect.top}px`,
    });
    window.setTimeout(() => {
      setRipple((current) => (current?.id === id ? null : current));
    }, 700);
    onAdd(product, 1);
  };

  return (
    <article className="productCard">
      {ripple && <span className="cartRipple" style={{ "--x": ripple.x, "--y": ripple.y }} />}
      <button className="productImage" onClick={() => onView(product)}>
        {product.image}
      </button>
      <div className="productTop">
        <small>{product.category}</small>
        <StockBadge stock={product.stock} />
      </div>
      <button className="productTitle" onClick={() => onView(product)}>
        {product.name}
      </button>
      <p>{product.description}</p>
      <Rating rating={product.rating} reviews={product.reviews} />
      <div className="priceRow">
        <div>
          <strong>{money(product.price)}</strong>
          <del>{money(product.originalPrice)}</del>
        </div>
        <button className="primary small" disabled={product.stock <= 0} onClick={handleAdd}>
          Add
        </button>
      </div>
    </article>
  );
}

function ProductGrid({ products, onView, onAdd }) {
  if (!products.length) return <div className="empty">No products match your search.</div>;
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onView={onView} onAdd={onAdd} />
      ))}
    </div>
  );
}

function Home({ products, onView, onAdd, goTo }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const categoryOk = category === "All" || product.category === category;
      const searchOk = product.name.toLowerCase().includes(query.toLowerCase());
      return categoryOk && searchOk;
    });
  }, [products, query, category]);

  return (
    <>
      <Hero goTo={goTo} />
      <main className="page">
        <section className="section">
          <div className="sectionHead">
            <div>
              <span className="accentText">Fresh Arrivals</span>
              <h2>Featured Products</h2>
            </div>
          </div>
          <ProductGrid products={products.slice(0, 6)} onView={onView} onAdd={onAdd} />
        </section>
        <section className="section">
          <div className="shopTools">
            <label className="searchBox">
              <Search size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search phones, laptops, audio..." />
            </label>
            <div className="categoryBar">
              {categories.map((item) => (
                <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <ProductGrid products={filtered} onView={onView} onAdd={onAdd} />
        </section>
      </main>
    </>
  );
}

function ProductsPage({ products, onView, onAdd }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [stock, setStock] = useState("all");
  const [rating, setRating] = useState("all");
  const [sort, setSort] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const brands = useMemo(() => ["All", ...Array.from(new Set(products.map(getBrand))).sort()], [products]);
  const highestPrice = useMemo(() => Math.max(0, ...products.map((product) => Number(product.price || 0))), [products]);

  const filtered = useMemo(() => {
    const min = minPrice === "" ? 0 : Number(minPrice);
    const max = maxPrice === "" ? Number.POSITIVE_INFINITY : Number(maxPrice);

    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === "All" || product.category === category;
        const matchesBrand = brand === "All" || getBrand(product) === brand;
        const matchesPrice = product.price >= min && product.price <= max;
        const matchesStock = stock === "all" || (stock === "in" ? product.stock > 0 : product.stock <= 0);
        const matchesRating = rating === "all" || Number(product.rating) >= Number(rating);
        return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock && matchesRating;
      })
      .sort((a, b) => {
        if (sort === "priceLow") return a.price - b.price;
        if (sort === "priceHigh") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "reviews") return b.reviews - a.reviews;
        if (sort === "name") return a.name.localeCompare(b.name);
        return b.id - a.id;
      });
  }, [products, query, category, brand, minPrice, maxPrice, stock, rating, sort]);

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setBrand("All");
    setStock("all");
    setRating("all");
    setSort("featured");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <main className="page">
      <section className="productsIntro">
        <div>
          <span className="accentText">Complete Catalog</span>
          <h1>Products</h1>
          <p>Compare smartphones, laptops, audio gear, and accessories with quick filters built for real shopping decisions.</p>
        </div>
        <div className="catalogStats">
          <strong>{filtered.length}</strong>
          <span>matching products</span>
        </div>
      </section>

      <section className="filterPanel">
        <label className="searchBox filterSearch">
          <Search size={20} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product name..." />
        </label>

        <div className="filterGrid">
          <label>
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Brand</span>
            <select value={brand} onChange={(event) => setBrand(event.target.value)}>
              {brands.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Newest first</option>
              <option value="priceLow">Price: low to high</option>
              <option value="priceHigh">Price: high to low</option>
              <option value="rating">Highest rated</option>
              <option value="reviews">Most reviewed</option>
              <option value="name">Name A-Z</option>
            </select>
          </label>
          <label>
            <span>Availability</span>
            <select value={stock} onChange={(event) => setStock(event.target.value)}>
              <option value="all">All stock</option>
              <option value="in">In stock only</option>
              <option value="out">Out of stock</option>
            </select>
          </label>
          <label>
            <span>Min Price</span>
            <input value={minPrice} type="number" min="0" max={highestPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="₹0" />
          </label>
          <label>
            <span>Max Price</span>
            <input value={maxPrice} type="number" min="0" max={highestPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder={highestPrice ? money(highestPrice) : "No limit"} />
          </label>
          <label>
            <span>Rating</span>
            <select value={rating} onChange={(event) => setRating(event.target.value)}>
              <option value="all">All ratings</option>
              <option value="4.5">4.5+ stars</option>
              <option value="4">4.0+ stars</option>
              <option value="3.5">3.5+ stars</option>
            </select>
          </label>
          <button className="ghost filterReset" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </section>

      <ProductGrid products={filtered} onView={onView} onAdd={onAdd} />
    </main>
  );
}

function AboutPage() {
  return (
    <main className="page aboutPage">
      <section className="aboutHero">
        <span className="accentText">About Vardhman Electronics</span>
        <h1>Premium electronics, honest service, and dependable stock.</h1>
        <p>
          Vardhman Electronics is built as a modern Indian electronics store experience: fast browsing, transparent pricing,
          clear stock visibility, and a trusted purchase flow for everyday tech buyers.
        </p>
      </section>
      <section className="aboutGrid">
        {[
          ["Trusted Catalog", "Curated phones, laptops, audio products, and accessories from high-demand brands."],
          ["Live Stock Focus", "The glowing LIVE badge helps customers quickly spot available products before checkout."],
          ["Admin Control", "Product, stock, order, user, and revenue controls are built directly into the dashboard."],
          ["Cloud Ready", "Frontend runs on Vercel, backend on Render, and data on Neon PostgreSQL."],
        ].map(([title, text]) => (
          <article className="aboutCard" key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function ProductDetail({ product, onBack, onAdd }) {
  const [qty, setQty] = useState(1);
  if (!product) return null;
  return (
    <main className="page">
      <section className="detail">
        <button className="ghost" onClick={onBack}>
          Back to shop
        </button>
        <div className="detailGrid">
          <div className="detailImage">{product.image}</div>
          <div>
            <span className="accentText">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="inlineWrap">
              <Rating rating={product.rating} reviews={product.reviews} />
              <StockBadge stock={product.stock} />
            </div>
            <p className="detailText">{product.description}</p>
            <div className="detailPrice">
              <strong>{money(product.price)}</strong>
              <del>{money(product.originalPrice)}</del>
            </div>
            <p className="muted">Available stock: {product.stock}</p>
            <div className="inlineWrap">
              <div className="stepper">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(Math.max(1, product.stock), qty + 1))}>+</button>
              </div>
              <button className="primary" disabled={product.stock <= 0} onClick={() => onAdd(product, qty)}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginPrompt({ title, goTo }) {
  return (
    <main className="page centerPage">
      <section className="panel narrow center">
        <User size={42} color="#2563EB" />
        <h1>{title}</h1>
        <p>Please login or create an account to continue.</p>
        <button className="primary" onClick={() => goTo("login")}>
          Go to Login
        </button>
      </section>
    </main>
  );
}

function Cart({ user, cart, products, setCart, placeOrder, goTo }) {
  if (!user) return <LoginPrompt title="Login to view your cart" goTo={goTo} />;
  const rows = cart.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) })).filter((item) => item.product);
  const subtotal = rows.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const updateQty = (productId, quantity) => {
    const product = products.find((entry) => entry.id === productId);
    setCart((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, product?.stock || 1)) } : item))
    );
  };

  return (
    <main className="page cartLayout">
      <section className="panel">
        <h1>Shopping Cart</h1>
        <div className="stack">
          {rows.length === 0 && <div className="empty">Your cart is empty.</div>}
          {rows.map(({ product, quantity }) => (
            <article className="cartItem" key={product.id}>
              <div className="cartImage">{product.image}</div>
              <div>
                <h3>{product.name}</h3>
                <p>{money(product.price)}</p>
                <div className="stepper compact">
                  <button onClick={() => updateQty(product.id, quantity - 1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => updateQty(product.id, quantity + 1)}>+</button>
                </div>
              </div>
              <div className="itemTotal">
                <strong>{money(product.price * quantity)}</strong>
                <button className="dangerIcon" onClick={() => setCart((current) => current.filter((item) => item.productId !== product.id))}>
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <aside className="panel summary">
        <h2>Order Summary</h2>
        <div className="summaryLine">
          <span>Subtotal</span>
          <strong>{money(subtotal)}</strong>
        </div>
        <div className="summaryLine">
          <span>Estimated GST 18%</span>
          <strong>{money(gst)}</strong>
        </div>
        <div className="summaryTotal">
          <span>Total</span>
          <strong>{money(total)}</strong>
        </div>
        <button className="primary full" onClick={placeOrder}>
          Place Order
        </button>
      </aside>
    </main>
  );
}

function StatusChip({ status }) {
  return <span className={`status ${status.toLowerCase()}`}>{status}</span>;
}

function Orders({ user, orders, goTo }) {
  if (!user) return <LoginPrompt title="Login to view orders" goTo={goTo} />;
  return (
    <main className="page">
      <section className="panel">
        <h1>{user.role === "admin" ? "All Orders" : "My Orders"}</h1>
        <div className="stack">
          {orders.length === 0 && <div className="empty">No orders yet.</div>}
          {orders.map((order) => (
            <article className="orderCard" key={order.orderId}>
              <div className="orderTop">
                <div>
                  <strong>{order.orderId}</strong>
                  <p>{order.date}</p>
                </div>
                <StatusChip status={order.status} />
              </div>
              {order.items.map((item) => (
                <div className="orderLine" key={`${order.orderId}-${item.productId}`}>
                  <span>
                    {item.image} {item.name} x {item.quantity}
                  </span>
                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
              ))}
              <div className="orderTotal">{money(order.total)}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Login({ onLogin, onRegister }) {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const submit = () => {
    const payload = { username, password };
    if (tab === "login") onLogin(payload);
    else onRegister(payload);
  };

  return (
    <main className="page centerPage">
      <section className="panel narrow">
        <div className="tabs">
          {["login", "register"].map((item) => (
            <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>
        <h1>{tab === "login" ? "Welcome back" : "Create account"}</h1>
        <div className="stack">
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
          <input value={password} type="password" onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          <button className="primary full" onClick={submit}>
            {tab === "login" ? "Login" : "Register"}
          </button>
        </div>
        <div className="credentials">
          Admin: admin / vardhman@admin
          <br />
          Users: rahul / rahul123, priya / priya123
        </div>
      </section>
    </main>
  );
}

function Admin({ user, products, orders, users, stats, reloadAll, notify }) {
  const [draft, setDraft] = useState(blankProduct);
  const [editingId, setEditingId] = useState(null);

  const saveProduct = async () => {
    if (!draft.name || !draft.description || Number(draft.price) <= 0 || Number(draft.stock) < 0) {
      notify("error", "Please complete product details.");
      return;
    }
    const payload = {
      ...draft,
      price: Number(draft.price),
      originalPrice: Number(draft.originalPrice || draft.price),
      stock: Number(draft.stock),
    };
    if (editingId) await api(`/api/products/${editingId}`, { method: "PUT", body: JSON.stringify(payload) }, user);
    else await api("/api/products", { method: "POST", body: JSON.stringify(payload) }, user);
    notify("success", editingId ? "Product updated." : "Product added.");
    setDraft(blankProduct);
    setEditingId(null);
    reloadAll();
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setDraft(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    await api(`/api/products/${id}`, { method: "DELETE" }, user);
    notify("success", "Product deleted.");
    reloadAll();
  };

  const changeStatus = async (orderId, status) => {
    await api(`/api/orders/${orderId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }, user);
    notify("success", "Order status updated.");
    reloadAll();
  };

  return (
    <main className="page adminPage">
      <div className="adminHead">
        <div>
          <span className="accentText">Admin Control Room</span>
          <h1>Vardhman Dashboard</h1>
        </div>
      </div>
      <section className="stats">
        {[
          ["Total Products", stats.products, Package],
          ["Total Orders", stats.orders, ShoppingCart],
          ["Total Users", stats.users, User],
          ["Revenue", money(stats.revenue), Check],
        ].map(([label, value, Icon]) => (
          <article className="stat" key={label}>
            <Icon size={24} />
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>
      <section className="panel">
        <div className="panelHead">
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
          {editingId && <button className="ghost" onClick={() => { setEditingId(null); setDraft(blankProduct); }}>Cancel</button>}
        </div>
        <div className="productForm">
          <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Product name" />
          <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
            {categories.slice(1).map((item) => <option key={item}>{item}</option>)}
          </select>
          <input value={draft.price} type="number" onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="Price" />
          <input value={draft.originalPrice} type="number" onChange={(event) => setDraft({ ...draft, originalPrice: event.target.value })} placeholder="Original price" />
          <input value={draft.stock} type="number" onChange={(event) => setDraft({ ...draft, stock: event.target.value })} placeholder="Stock" />
          <input value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} placeholder="Emoji/image" />
          <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Description" />
        </div>
        <button className="primary" onClick={saveProduct}>
          {editingId ? <Check size={17} /> : <Plus size={17} />} {editingId ? "Save Product" : "Add Product"}
        </button>
      </section>
      <section className="panel tablePanel">
        <div className="panelHead">
          <h2>Order Management</h2>
          <span>{orders.length} orders</span>
        </div>
        <table>
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan="6">No orders placed yet.</td></tr>}
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.username}</td>
                <td>{order.date}</td>
                <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td>{money(order.total)}</td>
                <td>
                  <label className="selectWrap">
                    <select value={order.status} onChange={(event) => changeStatus(order.orderId, event.target.value)}>
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <ChevronDown size={16} />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="panel tablePanel">
        <div className="panelHead">
          <h2>Product Management</h2>
          <span>{products.length} products</span>
        </div>
        <table>
          <thead>
            <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.image} {product.name}</td>
                <td>{product.category}</td>
                <td>{money(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="actions">
                    <button onClick={() => editProduct(product)}><Edit2 size={16} /></button>
                    <button className="dangerIcon" onClick={() => deleteProduct(product.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="panel">
        <h2>Users</h2>
        <div className="userGrid">
          {users.map((entry) => (
            <article key={entry.id}>
              <strong>{entry.username}</strong>
              <span>{entry.role}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toasts, setToasts] = useState([]);

  const notify = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, type, message }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3000);
  };

  const loadProducts = () => api("/api/products").then(setProducts).catch((error) => notify("error", error.message));
  const loadOrders = () => user ? api("/api/orders", {}, user).then(setOrders).catch((error) => notify("error", error.message)) : Promise.resolve(setOrders([]));
  const loadAdmin = () => {
    if (user?.role !== "admin") return Promise.resolve();
    return Promise.all([
      api("/api/users", {}, user).then(setUsers),
      api("/api/stats", {}, user).then(setStats),
    ]).catch((error) => notify("error", error.message));
  };
  const reloadAll = () => {
    loadProducts();
    loadOrders();
    loadAdmin();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadOrders();
    loadAdmin();
  }, [user]);

  const goTo = (nextPage) => {
    if (!user && nextPage !== "login") {
      notify("info", "Please login first.");
      setPage("login");
      return;
    }
    if (nextPage === "admin" && user?.role !== "admin") {
      notify("error", "Access Denied.");
      setPage("home");
      return;
    }
    setSelected(null);
    setPage(nextPage);
    if (nextPage === "orders") loadOrders();
    if (nextPage === "admin") reloadAll();
  };

  const onLogin = async (payload) => {
    try {
      const data = await api("/api/login", { method: "POST", body: JSON.stringify(payload) });
      setUser(data.user);
      setCart([]);
      notify("success", `Welcome, ${data.user.username}.`);
      setPage(data.user.role === "admin" ? "admin" : "home");
    } catch (error) {
      notify("error", error.message);
    }
  };

  const onRegister = async (payload) => {
    try {
      const data = await api("/api/register", { method: "POST", body: JSON.stringify(payload) });
      setUser(data.user);
      setCart([]);
      notify("success", "Account created. You are ready to shop.");
      setPage("home");
    } catch (error) {
      notify("error", error.message);
    }
  };

  const addToCart = (product, quantity) => {
    if (!user) {
      notify("info", "Please login to add items to cart.");
      setPage("login");
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) => item.productId === product.id ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } : item);
      }
      return [...current, { productId: product.id, quantity: Math.min(product.stock, quantity) }];
    });
    notify("success", `${product.name} added to cart.`);
  };

  const placeOrder = async () => {
    if (!cart.length) {
      notify("info", "Your cart is empty.");
      return;
    }
    try {
      await api("/api/orders", { method: "POST", body: JSON.stringify({ items: cart }) }, user);
      setCart([]);
      notify("success", "Order placed successfully.");
      reloadAll();
      setPage("orders");
    } catch (error) {
      notify("error", error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setOrders([]);
    setPage("login");
    notify("info", "Logged out.");
  };

  const selectedProduct = selected ? products.find((product) => product.id === selected.id) : null;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <AnimatedBackground currentPage={page} />
      <Toasts toasts={toasts} />
      {user && <Navbar user={user} cartCount={cartCount} page={page} goTo={goTo} logout={logout} />}
      {user && page === "home" && <Home products={products} onView={(product) => { setSelected(product); setPage("detail"); }} onAdd={addToCart} goTo={goTo} />}
      {user && page === "products" && <ProductsPage products={products} onView={(product) => { setSelected(product); setPage("detail"); }} onAdd={addToCart} />}
      {user && page === "about" && <AboutPage />}
      {user && page === "detail" && <ProductDetail product={selectedProduct} onBack={() => goTo("home")} onAdd={addToCart} />}
      {user && page === "cart" && <Cart user={user} cart={cart} products={products} setCart={setCart} placeOrder={placeOrder} goTo={goTo} />}
      {user && page === "orders" && <Orders user={user} orders={orders} goTo={goTo} />}
      {page === "login" && <Login onLogin={onLogin} onRegister={onRegister} />}
      {page === "admin" && user?.role === "admin" && <Admin user={user} products={products} orders={orders} users={users} stats={stats} reloadAll={reloadAll} notify={notify} />}
      <footer>Vardhman Electronics · Premium electronics, honest service, real SQLite database.</footer>
    </div>
  );
}
