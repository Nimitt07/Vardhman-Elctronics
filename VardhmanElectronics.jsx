import React, { useMemo, useReducer, useState } from "react";
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

const categories = ["All", "Smartphones", "Laptops", "Audio", "Accessories"];
const orderStatuses = ["Pending", "Confirmed", "Shipped", "Delivered"];

const initialUsers = [
  { id: 1, username: "admin", password: "vardhman@admin", role: "admin" },
  { id: 2, username: "rahul", password: "rahul123", role: "user" },
  { id: 3, username: "priya", password: "priya123", role: "user" },
];

const initialProducts = [
  {
    id: 101,
    name: "Samsung Galaxy M55 5G",
    category: "Smartphones",
    price: 24999,
    originalPrice: 32999,
    stock: 14,
    image: "📱",
    description:
      "A vivid AMOLED 5G smartphone with fast charging, a crisp camera system, and dependable all-day battery life.",
    rating: 4.6,
    reviews: 842,
  },
  {
    id: 102,
    name: "Realme Narzo 70 Pro",
    category: "Smartphones",
    price: 18999,
    originalPrice: 23999,
    stock: 22,
    image: "📲",
    description:
      "Smooth performance, sharp photos, and a premium glass finish built for daily entertainment and multitasking.",
    rating: 4.4,
    reviews: 615,
  },
  {
    id: 103,
    name: "OnePlus Nord CE4",
    category: "Smartphones",
    price: 26999,
    originalPrice: 29999,
    stock: 9,
    image: "📱",
    description:
      "Clean OxygenOS experience with a powerful processor, flagship-inspired design, and excellent charging speed.",
    rating: 4.7,
    reviews: 1038,
  },
  {
    id: 104,
    name: "Dell Inspiron 15",
    category: "Laptops",
    price: 57990,
    originalPrice: 67990,
    stock: 7,
    image: "💻",
    description:
      "Reliable Intel-powered laptop for work, study, browsing, and everyday productivity with a comfortable keyboard.",
    rating: 4.5,
    reviews: 391,
  },
  {
    id: 105,
    name: "HP Pavilion x360",
    category: "Laptops",
    price: 71990,
    originalPrice: 82990,
    stock: 5,
    image: "🖥️",
    description:
      "Flexible touchscreen laptop with 360-degree hinge, strong battery life, and a sleek portable build.",
    rating: 4.3,
    reviews: 278,
  },
  {
    id: 106,
    name: "Lenovo IdeaPad Slim 5",
    category: "Laptops",
    price: 64990,
    originalPrice: 74990,
    stock: 11,
    image: "💻",
    description:
      "Slim performance laptop with vibrant display, fast storage, and efficient thermal design for busy days.",
    rating: 4.6,
    reviews: 507,
  },
  {
    id: 107,
    name: "boAt Airdopes 141",
    category: "Audio",
    price: 1299,
    originalPrice: 4490,
    stock: 35,
    image: "🎧",
    description:
      "Compact true wireless earbuds with punchy bass, low-latency mode, and a pocket-friendly charging case.",
    rating: 4.2,
    reviews: 3204,
  },
  {
    id: 108,
    name: "Sony WH-CH720N",
    category: "Audio",
    price: 8990,
    originalPrice: 14990,
    stock: 13,
    image: "🎧",
    description:
      "Wireless noise cancelling headphones with balanced Sony audio, lightweight comfort, and long battery life.",
    rating: 4.8,
    reviews: 1198,
  },
  {
    id: 109,
    name: "JBL Go 4 Speaker",
    category: "Audio",
    price: 3499,
    originalPrice: 4999,
    stock: 18,
    image: "🔊",
    description:
      "Portable Bluetooth speaker with bold sound, durable build, and a compact body made for travel.",
    rating: 4.4,
    reviews: 741,
  },
  {
    id: 110,
    name: "65W Fast Charger",
    category: "Accessories",
    price: 1499,
    originalPrice: 2499,
    stock: 40,
    image: "🔌",
    description:
      "Universal fast charger for phones, tablets, and compatible laptops with intelligent safety protection.",
    rating: 4.5,
    reviews: 902,
  },
  {
    id: 111,
    name: "Type-C Braided Cable",
    category: "Accessories",
    price: 399,
    originalPrice: 799,
    stock: 64,
    image: "🔗",
    description:
      "Durable braided USB Type-C cable with quick charging support and reinforced connectors.",
    rating: 4.1,
    reviews: 1367,
  },
  {
    id: 112,
    name: "Ambrane 20000mAh Power Bank",
    category: "Accessories",
    price: 2199,
    originalPrice: 3499,
    stock: 24,
    image: "🔋",
    description:
      "High-capacity power bank with dual output, fast charging, and travel-ready safety protection.",
    rating: 4.6,
    reviews: 1886,
  },
];

const initialState = {
  users: initialUsers,
  products: initialProducts,
  orders: [],
  cart: [],
};

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getCartTotal(cart, products) {
  return cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function appReducer(state, action) {
  switch (action.type) {
    case "REGISTER_USER":
      return {
        ...state,
        users: [
          ...state.users,
          {
            id: action.payload.id,
            username: action.payload.username,
            password: action.payload.password,
            role: "user",
          },
        ],
      };
    case "ADD_TO_CART": {
      const product = state.products.find((item) => item.id === action.payload.productId);
      if (!product || product.stock <= 0) return state;
      const existing = state.cart.find((item) => item.productId === product.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, product.stock) }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { productId: product.id, quantity: Math.min(action.payload.quantity, product.stock) }],
      };
    }
    case "UPDATE_CART_QTY":
      return {
        ...state,
        cart: state.cart
          .map((item) => {
            if (item.productId !== action.payload.productId) return item;
            const product = state.products.find((entry) => entry.id === item.productId);
            return { ...item, quantity: Math.max(1, Math.min(action.payload.quantity, product?.stock || 1)) };
          })
          .filter((item) => item.quantity > 0),
      };
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((item) => item.productId !== action.payload.productId) };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "PLACE_ORDER": {
      const orderedItems = state.cart
        .map((item) => {
          const product = state.products.find((entry) => entry.id === item.productId);
          return product
            ? {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image,
              }
            : null;
        })
        .filter(Boolean);
      const subtotal = getCartTotal(state.cart, state.products);
      const total = Math.round(subtotal * 1.18);
      return {
        ...state,
        orders: [
          {
            orderId: `VE-${Date.now().toString().slice(-7)}`,
            userId: action.payload.user.id,
            username: action.payload.user.username,
            items: orderedItems,
            total,
            status: "Pending",
            date: new Date().toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          ...state.orders,
        ],
        products: state.products.map((product) => {
          const ordered = state.cart.find((item) => item.productId === product.id);
          return ordered ? { ...product, stock: Math.max(0, product.stock - ordered.quantity) } : product;
        }),
        cart: [],
      };
    }
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.orderId === action.payload.orderId ? { ...order, status: action.payload.status } : order
        ),
      };
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [{ ...action.payload, id: Date.now(), rating: 4.4, reviews: 0, image: action.payload.image || "📦" }, ...state.products],
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? { ...product, ...action.payload } : product
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload.id),
        cart: state.cart.filter((item) => item.productId !== action.payload.id),
      };
    default:
      return state;
  }
}

function Toasts({ toasts }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border px-4 py-3 text-sm font-semibold shadow-2xl ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-blue-200 bg-blue-50 text-blue-700"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function StockBadge({ stock }) {
  if (stock <= 0) {
    return <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">Out of stock</span>;
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
      <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500 shadow-[0_0_10px_#F59E0B]" />
      LIVE In Stock
    </span>
  );
}

function Navbar({ currentUser, cartCount, currentPage, goTo, logout }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0D1B2A]/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
        <button onClick={() => goTo("home")} className="flex items-center gap-2 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB] text-xl font-black">VE</span>
          <span>
            <span className="block text-lg font-extrabold leading-5">Vardhman</span>
            <span className="block text-xs font-semibold text-slate-300">Electronics</span>
          </span>
        </button>
        <nav className="hidden items-center gap-2 md:flex">
          {["home", "orders"].map((page) => (
            <button
              key={page}
              onClick={() => goTo(page)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize ${
                currentPage === page ? "bg-white text-[#0D1B2A]" : "text-slate-200 hover:bg-white/10"
              }`}
            >
              {page === "orders" ? "My Orders" : "Home"}
            </button>
          ))}
          {currentUser?.role === "admin" && (
            <button
              onClick={() => goTo("admin")}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                currentPage === "admin" ? "bg-white text-[#0D1B2A]" : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <Settings size={16} /> Admin
            </button>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo("cart")}
            className="relative rounded-lg bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Cart"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-[#F59E0B] px-1.5 text-xs font-extrabold text-[#0D1B2A]">
                {cartCount}
              </span>
            )}
          </button>
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold sm:flex">
                <User size={16} /> {currentUser.username}
              </span>
              <button onClick={logout} className="rounded-lg bg-white/10 p-3 hover:bg-white/20" aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => goTo("login")} className="rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-bold hover:bg-blue-500">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero({ goTo }) {
  return (
    <section className="bg-gradient-to-br from-[#0D1B2A] via-[#12345A] to-[#2563EB] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-16">
        <div>
          <span className="mb-4 inline-flex rounded-full bg-[#F59E0B] px-4 py-2 text-sm font-extrabold text-[#0D1B2A]">
            Premium Indian Electronics Retailer
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">Your Trusted Electronics Partner</h1>
          <p className="mt-5 max-w-2xl text-base font-normal leading-7 text-slate-100 md:text-lg">
            Smartphones, laptops, audio gear, and daily tech essentials with honest prices, fresh stock, and a shopping
            experience built for confidence.
          </p>
          <button
            onClick={() => goTo("home")}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-4 text-sm font-extrabold text-[#0D1B2A] shadow-xl hover:bg-slate-100"
          >
            Shop Now <ShoppingCart size={18} />
          </button>
        </div>
        <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-2 gap-3">
            {["📱", "💻", "🎧", "🔋"].map((item, index) => (
              <div key={item} className="rounded-lg bg-white p-6 text-center text-5xl shadow-lg">
                {item}
                <p className="mt-3 text-xs font-bold text-[#0D1B2A]">{["Phones", "Laptops", "Audio", "Power"][index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Rating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <Star className="fill-[#F59E0B] text-[#F59E0B]" size={16} />
      <span className="font-bold text-slate-900">{rating}</span>
      <span className="text-slate-500">({reviews})</span>
    </div>
  );
}

function ProductCard({ product, onView, onAdd }) {
  return (
    <article className="group flex h-full flex-col rounded-lg bg-[#F1F5F9] p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      <button onClick={() => onView(product)} className="rounded-lg bg-white p-6 text-center text-6xl">
        {product.image}
      </button>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#2563EB]">{product.category}</p>
          <StockBadge stock={product.stock} />
        </div>
        <button onClick={() => onView(product)} className="mt-2 text-left text-lg font-extrabold leading-6 text-[#0D1B2A] hover:text-[#2563EB]">
          {product.name}
        </button>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
        <div className="mt-3">
          <Rating rating={product.rating} reviews={product.reviews} />
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-extrabold text-[#0D1B2A]">{formatCurrency(product.price)}</p>
            <p className="text-sm font-semibold text-slate-400 line-through">{formatCurrency(product.originalPrice)}</p>
          </div>
          <button
            onClick={() => onAdd(product, 1)}
            disabled={product.stock <= 0}
            className="rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductGrid({ products, onView, onAdd }) {
  if (!products.length) {
    return <div className="rounded-lg bg-white p-10 text-center font-semibold text-slate-500">No products match your search.</div>;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onView={onView} onAdd={onAdd} />
      ))}
    </div>
  );
}

function HomePage({ products, onView, onAdd, goTo }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = category === "All" || product.category === category;
        const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [products, query, category]
  );
  const featured = products.slice(0, 6);

  return (
    <>
      <Hero goTo={goTo} />
      <main className="bg-[#0D1B2A] px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <section className="mb-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-semibold text-[#F59E0B]">Fresh Arrivals</p>
                <h2 className="text-2xl font-extrabold text-white md:text-3xl">Featured Products</h2>
              </div>
            </div>
            <ProductGrid products={featured} onView={onView} onAdd={onAdd} />
          </section>

          <section>
            <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search phones, laptops, audio..."
                  className="w-full rounded-lg border border-white/10 bg-white px-12 py-4 text-sm font-semibold text-[#0D1B2A] outline-none ring-[#2563EB] placeholder:text-slate-400 focus:ring-4"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-lg px-4 py-3 text-sm font-bold ${
                      category === item ? "bg-[#F59E0B] text-[#0D1B2A]" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <ProductGrid products={filtered} onView={onView} onAdd={onAdd} />
          </section>
        </div>
      </main>
    </>
  );
}

function ProductDetail({ product, onBack, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  if (!product) return null;
  return (
    <main className="min-h-screen bg-[#0D1B2A] px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-lg bg-white p-5 shadow-2xl md:p-8">
        <button onClick={onBack} className="mb-6 rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-[#0D1B2A] hover:bg-slate-200">
          Back to shop
        </button>
        <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg bg-[#F1F5F9] p-10 text-center text-8xl">{product.image}</div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#2563EB]">{product.category}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#0D1B2A] md:text-4xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Rating rating={product.rating} reviews={product.reviews} />
              <StockBadge stock={product.stock} />
            </div>
            <p className="mt-5 leading-7 text-slate-600">{product.description}</p>
            <div className="mt-6">
              <p className="text-3xl font-extrabold text-[#0D1B2A]">{formatCurrency(product.price)}</p>
              <p className="font-semibold text-slate-400 line-through">{formatCurrency(product.originalPrice)}</p>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-600">Available stock: {product.stock}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-lg border border-slate-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-lg font-bold">
                  -
                </button>
                <span className="min-w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-3 text-lg font-bold">
                  +
                </button>
              </div>
              <button
                onClick={() => onAdd(product, quantity)}
                disabled={product.stock <= 0}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-4 text-sm font-extrabold text-white hover:bg-blue-500 disabled:bg-slate-300"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function LoginPrompt({ goTo, title = "Login required" }) {
  return (
    <main className="min-h-screen bg-[#0D1B2A] px-4 py-16">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-2xl">
        <User className="mx-auto text-[#2563EB]" size={42} />
        <h1 className="mt-4 text-2xl font-extrabold text-[#0D1B2A]">{title}</h1>
        <p className="mt-2 text-slate-600">Please login or create an account to continue shopping.</p>
        <button onClick={() => goTo("login")} className="mt-6 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-bold text-white hover:bg-blue-500">
          Go to Login
        </button>
      </div>
    </main>
  );
}

function CartPage({ currentUser, cart, products, dispatch, goTo, notify }) {
  if (!currentUser) return <LoginPrompt goTo={goTo} title="Login to view your cart" />;
  const subtotal = getCartTotal(cart, products);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;
  const rows = cart
    .map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) }))
    .filter((item) => item.product);

  const placeOrder = () => {
    if (!rows.length) {
      notify("info", "Your cart is empty.");
      return;
    }
    dispatch({ type: "PLACE_ORDER", payload: { user: currentUser } });
    notify("success", "Order placed successfully.");
    goTo("orders");
  };

  return (
    <main className="min-h-screen bg-[#0D1B2A] px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg bg-white p-5 shadow-2xl">
          <h1 className="text-2xl font-extrabold text-[#0D1B2A]">Shopping Cart</h1>
          <div className="mt-5 space-y-4">
            {rows.length === 0 && <p className="rounded-lg bg-slate-50 p-6 text-center font-semibold text-slate-500">Your cart is empty.</p>}
            {rows.map(({ product, quantity }) => (
              <div key={product.id} className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-[80px_1fr_auto] sm:items-center">
                <div className="rounded-lg bg-[#F1F5F9] p-4 text-center text-4xl">{product.image}</div>
                <div>
                  <h2 className="font-extrabold text-[#0D1B2A]">{product.name}</h2>
                  <p className="text-sm font-semibold text-slate-500">{formatCurrency(product.price)}</p>
                  <div className="mt-3 inline-flex items-center rounded-lg border border-slate-200">
                    <button
                      onClick={() => dispatch({ type: "UPDATE_CART_QTY", payload: { productId: product.id, quantity: quantity - 1 } })}
                      className="px-3 py-2 font-bold"
                    >
                      -
                    </button>
                    <span className="min-w-10 text-center font-bold">{quantity}</span>
                    <button
                      onClick={() => dispatch({ type: "UPDATE_CART_QTY", payload: { productId: product.id, quantity: quantity + 1 } })}
                      className="px-3 py-2 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                  <p className="font-extrabold text-[#0D1B2A]">{formatCurrency(product.price * quantity)}</p>
                  <button
                    onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: { productId: product.id } })}
                    className="mt-0 rounded-lg bg-red-50 p-3 text-red-600 hover:bg-red-100 sm:mt-3"
                    aria-label="Remove item"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="h-fit rounded-lg bg-white p-5 shadow-2xl">
          <h2 className="text-xl font-extrabold text-[#0D1B2A]">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm font-semibold">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated GST 18%</span>
              <span>{formatCurrency(gst)}</span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between text-lg font-extrabold text-[#0D1B2A]">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          <button onClick={placeOrder} className="mt-6 w-full rounded-lg bg-[#2563EB] px-5 py-4 text-sm font-extrabold text-white hover:bg-blue-500">
            Place Order
          </button>
        </aside>
      </div>
    </main>
  );
}

function StatusChip({ status }) {
  const colors = {
    Pending: "bg-amber-100 text-amber-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Shipped: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-emerald-100 text-emerald-800",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${colors[status]}`}>{status}</span>;
}

function OrdersPage({ currentUser, orders, goTo }) {
  if (!currentUser) return <LoginPrompt goTo={goTo} title="Login to view orders" />;
  const visibleOrders = currentUser.role === "admin" ? orders : orders.filter((order) => order.userId === currentUser.id);
  return (
    <main className="min-h-screen bg-[#0D1B2A] px-4 py-10">
      <section className="mx-auto max-w-5xl rounded-lg bg-white p-5 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-[#0D1B2A]">My Orders</h1>
        <div className="mt-5 space-y-4">
          {visibleOrders.length === 0 && <p className="rounded-lg bg-slate-50 p-6 text-center font-semibold text-slate-500">No orders yet.</p>}
          {visibleOrders.map((order) => (
            <article key={order.orderId} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-extrabold text-[#0D1B2A]">{order.orderId}</p>
                  <p className="text-sm font-semibold text-slate-500">{order.date}</p>
                </div>
                <StatusChip status={order.status} />
              </div>
              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={`${order.orderId}-${item.productId}`} className="flex justify-between gap-4 text-sm">
                    <span className="font-semibold text-slate-600">
                      {item.image} {item.name} x {item.quantity}
                    </span>
                    <span className="font-bold text-[#0D1B2A]">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-right text-lg font-extrabold text-[#0D1B2A]">{formatCurrency(order.total)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function LoginPage({ users, dispatch, setCurrentUser, goTo, notify }) {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const reset = () => {
    setUsername("");
    setPassword("");
  };

  const login = () => {
    const user = users.find((entry) => entry.username === username.trim() && entry.password === password);
    if (!user) {
      notify("error", "Wrong username or password.");
      return;
    }
    setCurrentUser(user);
    notify("success", `Welcome, ${user.username}.`);
    reset();
    goTo("home");
  };

  const register = () => {
    const cleanUsername = username.trim();
    if (!cleanUsername || password.length < 4) {
      notify("error", "Enter a username and a password with at least 4 characters.");
      return;
    }
    if (users.some((entry) => entry.username.toLowerCase() === cleanUsername.toLowerCase())) {
      notify("error", "Username already exists.");
      return;
    }
    const newUser = { id: Date.now(), username: cleanUsername, password, role: "user" };
    dispatch({ type: "REGISTER_USER", payload: newUser });
    setCurrentUser(newUser);
    notify("success", "Account created. You are ready to shop.");
    reset();
    goTo("home");
  };

  return (
    <main className="min-h-screen bg-[#0D1B2A] px-4 py-12">
      <section className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          {["login", "register"].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-lg px-4 py-3 text-sm font-extrabold capitalize ${
                tab === item ? "bg-[#2563EB] text-white" : "text-slate-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-[#0D1B2A]">{tab === "login" ? "Welcome back" : "Create account"}</h1>
        <div className="mt-5 space-y-4">
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            className="w-full rounded-lg border border-slate-200 px-4 py-4 text-sm font-semibold outline-none ring-[#2563EB] focus:ring-4"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-lg border border-slate-200 px-4 py-4 text-sm font-semibold outline-none ring-[#2563EB] focus:ring-4"
          />
          <button
            onClick={tab === "login" ? login : register}
            className="w-full rounded-lg bg-[#2563EB] px-5 py-4 text-sm font-extrabold text-white hover:bg-blue-500"
          >
            {tab === "login" ? "Login" : "Register"}
          </button>
        </div>
        <div className="mt-5 rounded-lg bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">
          Admin: admin / vardhman@admin<br />
          Users: rahul / rahul123, priya / priya123
        </div>
      </section>
    </main>
  );
}

function AdminOrderTable({ orders, dispatch, notify }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-2xl">
      <h2 className="text-xl font-extrabold text-[#0D1B2A]">Order Management</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              {["Order ID", "Customer", "Date", "Items", "Total", "Status"].map((head) => (
                <th key={head} className="px-4 py-3 font-extrabold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center font-semibold text-slate-500">
                  No orders placed yet.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td className="px-4 py-4 font-extrabold text-[#0D1B2A]">{order.orderId}</td>
                <td className="px-4 py-4 font-semibold text-slate-600">{order.username}</td>
                <td className="px-4 py-4 font-semibold text-slate-600">{order.date}</td>
                <td className="px-4 py-4 font-semibold text-slate-600">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="px-4 py-4 font-extrabold text-[#0D1B2A]">{formatCurrency(order.total)}</td>
                <td className="px-4 py-4">
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(event) => {
                        dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId: order.orderId, status: event.target.value } });
                        notify("success", "Order status updated.");
                      }}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-9 text-sm font-bold text-[#0D1B2A]"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminProductForm({ dispatch, editingProduct, setEditingProduct, notify }) {
  const blank = { name: "", category: "Smartphones", price: "", originalPrice: "", stock: "", description: "", image: "📦" };
  const [draft, setDraft] = useState(blank);

  React.useEffect(() => {
    setDraft(editingProduct || blank);
  }, [editingProduct]);

  const updateDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const save = () => {
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
    dispatch({ type: editingProduct ? "UPDATE_PRODUCT" : "ADD_PRODUCT", payload });
    notify("success", editingProduct ? "Product updated." : "Product added.");
    setEditingProduct(null);
    setDraft(blank);
  };

  return (
    <section className="rounded-lg bg-white p-5 shadow-2xl">
      <h2 className="text-xl font-extrabold text-[#0D1B2A]">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} placeholder="Product name" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold" />
        <select value={draft.category} onChange={(event) => updateDraft("category", event.target.value)} className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold">
          {categories.filter((item) => item !== "All").map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} placeholder="Price" type="number" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold" />
        <input value={draft.originalPrice} onChange={(event) => updateDraft("originalPrice", event.target.value)} placeholder="Original price" type="number" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold" />
        <input value={draft.stock} onChange={(event) => updateDraft("stock", event.target.value)} placeholder="Stock" type="number" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold" />
        <input value={draft.image} onChange={(event) => updateDraft("image", event.target.value)} placeholder="Emoji image" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold" />
        <textarea value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} placeholder="Description" className="min-h-24 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold md:col-span-2" />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-500">
          {editingProduct ? <Check size={17} /> : <Plus size={17} />} {editingProduct ? "Save Product" : "Add Product"}
        </button>
        {editingProduct && (
          <button onClick={() => setEditingProduct(null)} className="rounded-lg bg-slate-100 px-5 py-3 text-sm font-bold text-[#0D1B2A]">
            Cancel
          </button>
        )}
      </div>
    </section>
  );
}

function AdminDashboard({ currentUser, state, dispatch, goTo, notify }) {
  const [editingProduct, setEditingProduct] = useState(null);
  if (currentUser?.role !== "admin") return null;
  const revenue = state.orders.filter((order) => order.status === "Delivered").reduce((sum, order) => sum + order.total, 0);
  const stats = [
    { label: "Total Products", value: state.products.length, icon: Package },
    { label: "Total Orders", value: state.orders.length, icon: ShoppingCart },
    { label: "Total Users", value: state.users.length, icon: User },
    { label: "Revenue", value: formatCurrency(revenue), icon: Check },
  ];

  return (
    <main className="min-h-screen bg-[#0D1B2A] px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#F59E0B]">Admin Control Room</p>
            <h1 className="text-3xl font-extrabold text-white">Vardhman Dashboard</h1>
          </div>
          <button onClick={() => goTo("home")} className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-[#0D1B2A]">
            View Store
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg bg-white p-5 shadow-2xl">
              <Icon className="text-[#2563EB]" size={24} />
              <p className="mt-4 text-2xl font-extrabold text-[#0D1B2A]">{value}</p>
              <p className="text-sm font-semibold text-slate-500">{label}</p>
            </div>
          ))}
        </div>
        <AdminOrderTable orders={state.orders} dispatch={dispatch} notify={notify} />
        <AdminProductForm dispatch={dispatch} editingProduct={editingProduct} setEditingProduct={setEditingProduct} notify={notify} />
        <section className="rounded-lg bg-white p-5 shadow-2xl">
          <h2 className="text-xl font-extrabold text-[#0D1B2A]">Product Management</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  {["Product", "Category", "Price", "Stock", "Actions"].map((head) => (
                    <th key={head} className="px-4 py-3 font-extrabold">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-4 font-extrabold text-[#0D1B2A]">{product.image} {product.name}</td>
                    <td className="px-4 py-4 font-semibold text-slate-600">{product.category}</td>
                    <td className="px-4 py-4 font-bold text-[#0D1B2A]">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-4 font-semibold text-slate-600">{product.stock}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setEditingProduct(product)} className="rounded-lg bg-blue-50 p-3 text-[#2563EB] hover:bg-blue-100" aria-label="Edit product">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            dispatch({ type: "DELETE_PRODUCT", payload: { id: product.id } });
                            notify("success", "Product deleted.");
                          }}
                          className="rounded-lg bg-red-50 p-3 text-red-600 hover:bg-red-100"
                          aria-label="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-lg bg-white p-5 shadow-2xl">
          <h2 className="text-xl font-extrabold text-[#0D1B2A]">Users</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <span className="font-extrabold text-[#0D1B2A]">{user.username}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">{user.role}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function VardhmanElectronics() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  const notify = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, type, message }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 2800);
  };

  const goTo = (page) => {
    if (page === "admin" && currentUser?.role !== "admin") {
      notify("error", "Access Denied.");
      setCurrentPage("home");
      return;
    }
    if ((page === "cart" || page === "orders") && !currentUser) {
      setCurrentPage(page);
      return;
    }
    setSelectedProduct(null);
    setCurrentPage(page);
  };

  const addToCart = (product, quantity = 1) => {
    if (!currentUser) {
      notify("info", "Please login to add items to cart.");
      setCurrentPage("login");
      return;
    }
    if (currentUser.role === "admin") {
      notify("info", "Admin can manage products from the dashboard.");
      return;
    }
    if (product.stock <= 0) {
      notify("error", "This product is out of stock.");
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: { productId: product.id, quantity } });
    notify("success", `${product.name} added to cart.`);
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage("detail");
  };

  const logout = () => {
    setCurrentUser(null);
    dispatch({ type: "CLEAR_CART" });
    setCurrentPage("home");
    notify("info", "Logged out.");
  };

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedFreshProduct = selectedProduct ? state.products.find((product) => product.id === selectedProduct.id) : null;

  return (
    <div className="min-h-screen bg-[#0D1B2A] font-sans">
      <Toasts toasts={toasts} />
      <Navbar currentUser={currentUser} cartCount={cartCount} currentPage={currentPage} goTo={goTo} logout={logout} />
      {currentPage === "home" && <HomePage products={state.products} onView={viewProduct} onAdd={addToCart} goTo={goTo} />}
      {currentPage === "detail" && <ProductDetail product={selectedFreshProduct} onBack={() => goTo("home")} onAdd={addToCart} />}
      {currentPage === "cart" && (
        <CartPage currentUser={currentUser} cart={state.cart} products={state.products} dispatch={dispatch} goTo={goTo} notify={notify} />
      )}
      {currentPage === "orders" && <OrdersPage currentUser={currentUser} orders={state.orders} goTo={goTo} />}
      {currentPage === "login" && (
        <LoginPage users={state.users} dispatch={dispatch} setCurrentUser={setCurrentUser} goTo={goTo} notify={notify} />
      )}
      {currentPage === "admin" && (
        <AdminDashboard currentUser={currentUser} state={state} dispatch={dispatch} goTo={goTo} notify={notify} />
      )}
      <footer className="border-t border-white/10 bg-[#0D1B2A] px-4 py-8 text-center text-sm font-semibold text-slate-400">
        Vardhman Electronics · Premium electronics, honest service, in-memory demo store.
      </footer>
    </div>
  );
}
