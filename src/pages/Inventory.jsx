import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Boxes, Search, Plus, ScanBarcode, PackagePlus, PackageX,
  ShoppingCart, Sparkles, Wallet, AlertTriangle, X, Palette, Ruler,
  Layers, Eye,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Usemediaquery from "../hooks/Usemediaquery.js";

const COL = {
  bg: "#15110E",
  text: "#F6F1E7",
  muted: "#A79C8E",
  gold: "#C9974E",
  sage: "#7C9B80",
  wine: "#9C4E52",
  teal: "#5B9088",
};
const F_DISPLAY = "'Fraunces',serif";
const F_BODY = "'Inter',sans-serif";
const F_MONO = "'JetBrains Mono',monospace";

const CATEGORIES = ["Menswear", "Womenswear", "Kids", "Footwear", "Accessories"];
const LOW_STOCK_THRESHOLD = 6;

/* ---------- fonts (idempotent) ---------- */
function useFonts() {
  useEffect(() => {
    const id = "sentinel-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ---------- scroll reveal ---------- */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        transform: visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, opacity 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- animated number ---------- */
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 550 }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;
    let raf;
    const start = performance.now();
    const step = (now) => {
      const prog = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - prog, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (prog < 1) raf = requestAnimationFrame(step);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ---------- particle constellation (same signature bg) ---------- */
function ParticleField() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const handleMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h, particles, raf;
    const colors = ["#C9974E", "#7C9B80", "#9C4E52", "#F6F1E7"];

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(55, Math.floor((w * h) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.6,
        c: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      const { x: mx, y: my } = mouseRef.current;
      for (const pt of particles) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0 || pt.x > w) pt.vx *= -1;
        if (pt.y < 0 || pt.y > h) pt.vy *= -1;
        const dx = mx - pt.x, dy = my - pt.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          pt.x += dx * 0.0018;
          pt.y += dy * 0.0018;
        }
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(201,151,78,${0.1 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const pt of particles) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = pt.c;
        ctx.globalAlpha = 0.45;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(step);
    };

    init();
    window.addEventListener("resize", init);
    if (!reducedMotion) raf = requestAnimationFrame(step);
    else step();
    window.addEventListener("mousemove", handleMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [handleMove, reducedMotion]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.55 }} />;
}

/* ---------- Glass ---------- */
function Glass({ children, style = {} }) {
  return (
    <div
      style={{
        borderRadius: "20px",
        border: "1px solid rgba(246,241,231,0.10)",
        backdropFilter: "blur(22px) saturate(140%)",
        WebkitBackdropFilter: "blur(22px) saturate(140%)",
        background: "linear-gradient(160deg, rgba(246,241,231,0.07), rgba(246,241,231,0.015))",
        boxShadow: "0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(246,241,231,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Stat card ---------- */
function StatCard({ icon, label, value, prefix = "", suffix = "", accent }) {
  return (
    <Reveal>
      <Glass style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${accent}1c`, border: `1px solid ${accent}40` }}>
            {icon}
          </div>
          <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: COL.muted, fontFamily: F_BODY }}>{label}</span>
        </div>
        <div style={{ fontSize: 24, fontFamily: F_MONO, color: COL.text, fontWeight: 500 }}>
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        </div>
      </Glass>
    </Reveal>
  );
}

/* ---------- Status pill ---------- */
function StatusPill({ stock }) {
  const status = stock === 0 ? "Out" : stock <= LOW_STOCK_THRESHOLD ? "Low" : "In stock";
  const color = stock === 0 ? COL.wine : stock <= LOW_STOCK_THRESHOLD ? COL.gold : COL.sage;
  return (
    <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, color, background: `${color}1a`, border: `1px solid ${color}40`, fontFamily: F_BODY, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

/* ---------- Field wrapper for the add-product form ---------- */
function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: COL.muted, fontFamily: F_BODY }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(246,241,231,0.14)",
  background: "rgba(246,241,231,0.04)",
  color: COL.text,
  fontFamily: F_BODY,
  fontSize: 13.5,
  outline: "none",
};

let idCounter = 100;
const nextId = () => ++idCounter;

const INITIAL_PRODUCTS = [
  { id: 1, name: "Men's Slim Denim", brand: "Levi's", category: "Menswear", size: "32", color: "Indigo", purchasePrice: 950, sellingPrice: 1699, discount: 10, stock: 24, barcode: "8901234560012" },
  { id: 2, name: "Cotton Kurta", brand: "Fabindia", category: "Menswear", size: "M", color: "Blue", purchasePrice: 620, sellingPrice: 1199, discount: 0, stock: 14, barcode: "8901234560029" },
  { id: 3, name: "Ethnic Saree — Silk", brand: "Nalli", category: "Womenswear", size: "Free", color: "Maroon", purchasePrice: 2200, sellingPrice: 4499, discount: 15, stock: 9, barcode: "8901234560036" },
  { id: 4, name: "Formal Shirt", brand: "Van Heusen", category: "Menswear", size: "L", color: "White", purchasePrice: 780, sellingPrice: 1499, discount: 5, stock: 3, barcode: "8901234560043" },
  { id: 5, name: "Sneakers", brand: "Puma", category: "Footwear", size: "9", color: "Black", purchasePrice: 1450, sellingPrice: 2999, discount: 0, stock: 4, barcode: "8901234560050" },
  { id: 6, name: "Kids Party Frock", brand: "Gini & Jony", category: "Kids", size: "6-7Y", color: "Pink", purchasePrice: 540, sellingPrice: 999, discount: 0, stock: 11, barcode: "8901234560067" },
  { id: 7, name: "Leather Belt", brand: "Woodland", category: "Accessories", size: "Free", color: "Brown", purchasePrice: 320, sellingPrice: 699, discount: 0, stock: 0, barcode: "8901234560074" },
  { id: 8, name: "Wool Blazer", brand: "Raymond", category: "Menswear", size: "40", color: "Grey", purchasePrice: 2600, sellingPrice: 5499, discount: 20, stock: 5, barcode: "8901234560081" },
];

const INITIAL_HISTORY = [
  { id: 1, type: "sold", text: "Sold 2 units — Cotton Kurta", meta: "35 min ago" },
  { id: 2, type: "added", text: "Restocked 15 units — Men's Slim Denim", meta: "2 hrs ago" },
  { id: 3, type: "sold", text: "Sold 1 unit — Sneakers", meta: "4 hrs ago" },
];

export default function Inventory() {
  useFonts();
  const isMobile = Usemediaquery("(max-width: 700px)");
  const isTablet = Usemediaquery("(max-width: 980px)");

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", brand: "", category: CATEGORIES[0], size: "", color: "",
    purchasePrice: "", sellingPrice: "", discount: "", stock: "", barcode: "",
  });

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const stockValue = products.reduce((s, p) => s + p.purchasePrice * p.stock, 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    return { totalProducts, stockValue: Math.round(stockValue / 1000), lowStock, outOfStock };
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const addHistory = (type, text) => {
    setHistory((h) => [{ id: Date.now(), type, text, meta: "Just now" }, ...h].slice(0, 8));
  };

  const adjustStock = (id, delta) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newStock = Math.max(0, product.stock + delta);
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
    addHistory(delta > 0 ? "added" : "sold", `${delta > 0 ? "Restocked" : "Sold"} ${Math.abs(delta)} unit${Math.abs(delta) > 1 ? "s" : ""} — ${product.name}`);
  };

  const handleScan = () => {
    const generated = String(Math.floor(1e12 + Math.random() * 9e12)).slice(0, 13);
    setForm((f) => ({ ...f, barcode: generated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const product = {
      id: nextId(),
      name: form.name.trim(),
      brand: form.brand.trim() || "—",
      category: form.category,
      size: form.size.trim() || "—",
      color: form.color.trim() || "—",
      purchasePrice: Number(form.purchasePrice) || 0,
      sellingPrice: Number(form.sellingPrice) || 0,
      discount: Number(form.discount) || 0,
      stock: Number(form.stock) || 0,
      barcode: form.barcode.trim() || "—",
    };
    setProducts((ps) => [product, ...ps]);
    addHistory("added", `Added ${product.stock} units — ${product.name}`);
    setForm({ name: "", brand: "", category: CATEGORIES[0], size: "", color: "", purchasePrice: "", sellingPrice: "", discount: "", stock: "", barcode: "" });
  };

  const section = { position: "relative", zIndex: 10, maxWidth: 1120, margin: "0 auto", padding: isMobile ? "0 18px" : "0 24px" };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", overflowX: "hidden", background: COL.bg, fontFamily: F_BODY }}>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        .inv-row:hover { background: rgba(246,241,231,0.03); }
        .inv-icon-btn {
          border: 1px solid rgba(246,241,231,0.14);
          background: transparent;
          color: ${COL.text};
          border-radius: 8px;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .inv-icon-btn:hover { background: rgba(246,241,231,0.08); transform: scale(1.06); }
        .cat-pill {
          border: 1px solid rgba(246,241,231,0.14);
          background: transparent;
          color: ${COL.muted};
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 12.5px;
          font-family: ${F_BODY};
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          white-space: nowrap;
        }
        .cat-pill.active {
          background: ${COL.gold};
          color: ${COL.bg};
          border-color: ${COL.gold};
        }
        .add-btn {
          transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease;
        }
        .add-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 24px rgba(201,151,78,0.35); }
      `}</style>

      <ParticleField />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", filter: "blur(140px)", background: `radial-gradient(circle, ${COL.sage}18, transparent 70%)`, left: "-100px", top: 40 }} />
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", filter: "blur(130px)", background: `radial-gradient(circle, ${COL.gold}1c, transparent 70%)`, right: "-90px", top: 700 }} />
      </div>

      <Navbar />

      <section style={{ ...section, paddingTop: isMobile ? 110 : 140, paddingBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 32 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, fontSize: 12, marginBottom: 14, background: `${COL.sage}1a`, border: `1px solid ${COL.sage}4d`, color: COL.sage }}>
              <Sparkles size={12} /> Inventory
            </div>
            <h1 style={{ fontSize: isMobile ? 26 : 34, lineHeight: 1.2, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
              Stock, tracked to the unit.
            </h1>
          </div>
          <button className="add-btn" onClick={() => setFormOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 999, fontSize: 13.5, fontWeight: 500, background: COL.gold, color: COL.bg, border: "none", cursor: "pointer", fontFamily: F_BODY }}>
            {formOpen ? <X size={16} /> : <Plus size={16} />}
            {formOpen ? "Close" : "Add product"}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: 20, marginBottom: 28 }}>
          <StatCard icon={<Boxes size={16} color={COL.sage} />} label="Total products" value={stats.totalProducts} accent={COL.sage} />
          <StatCard icon={<Wallet size={16} color={COL.gold} />} label="Stock value" value={stats.stockValue} prefix="₹" suffix="K" accent={COL.gold} />
          <StatCard icon={<AlertTriangle size={16} color={COL.gold} />} label="Low stock" value={stats.lowStock} accent={COL.gold} />
          <StatCard icon={<PackageX size={16} color={COL.wine} />} label="Out of stock" value={stats.outOfStock} accent={COL.wine} />
        </div>

        {/* Add product form */}
        {formOpen && (
          <Reveal>
            <Glass style={{ padding: isMobile ? "22px 18px" : "28px 30px", marginBottom: 28 }}>
              <h3 style={{ fontSize: 16, marginBottom: 20, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Add a new product</h3>
              <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 16 }}>
                <Field label="Product name">
                  <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Men's Slim Denim" required />
                </Field>
                <Field label="Brand">
                  <input style={inputStyle} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Levi's" />
                </Field>
                <Field label="Category">
                  <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} style={{ background: COL.bg }}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Size">
                  <input style={inputStyle} value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="e.g. M / 32 / 9" />
                </Field>
                <Field label="Color">
                  <input style={inputStyle} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="e.g. Indigo" />
                </Field>
                <Field label="Opening stock">
                  <input style={inputStyle} type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" />
                </Field>
                <Field label="Purchase price (₹)">
                  <input style={inputStyle} type="number" min="0" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} placeholder="0" />
                </Field>
                <Field label="Selling price (₹)">
                  <input style={inputStyle} type="number" min="0" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} placeholder="0" />
                </Field>
                <Field label="Discount (%)">
                  <input style={inputStyle} type="number" min="0" max="100" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="0" />
                </Field>
                <div style={{ gridColumn: isMobile ? "1" : "span 2" }}>
                  <Field label="Barcode">
                    <div style={{ display: "flex", gap: 8 }}>
                      <input style={{ ...inputStyle, flex: 1 }} value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} placeholder="Scan or type barcode" />
                      <button type="button" onClick={handleScan} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderRadius: 10, border: `1px solid ${COL.teal}4d`, background: `${COL.teal}1a`, color: COL.teal, cursor: "pointer", fontFamily: F_BODY, fontSize: 12.5 }}>
                        <ScanBarcode size={14} /> Scan
                      </button>
                    </div>
                  </Field>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button type="submit" style={{ width: "100%", padding: "11px 18px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, background: COL.gold, color: COL.bg, border: "none", cursor: "pointer", fontFamily: F_BODY, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <PackagePlus size={15} /> Save product
                  </button>
                </div>
              </form>
            </Glass>
          </Reveal>
        )}

        {/* Search + filters */}
        <Reveal>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Glass style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", flex: isMobile ? "1 1 100%" : "0 1 280px" }}>
              <Search size={15} color={COL.muted} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products or brands"
                style={{ border: "none", background: "transparent", outline: "none", color: COL.text, fontFamily: F_BODY, fontSize: 13.5, width: "100%" }}
              />
            </Glass>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", flex: 1 }}>
              <button className={`cat-pill${category === "All" ? " active" : ""}`} onClick={() => setCategory("All")}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c} className={`cat-pill${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Product list */}
        <Reveal>
          <Glass style={{ padding: isMobile ? "10px 12px" : "10px 20px", marginBottom: 28 }}>
            {!isMobile && (
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 12, padding: "14px 10px", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", color: COL.muted, borderBottom: "1px solid rgba(246,241,231,0.08)" }}>
                <span>Product</span>
                <span>Category</span>
                <span>Purchase</span>
                <span>Selling</span>
                <span>Stock</span>
                <span>Status</span>
              </div>
            )}
            {filtered.length === 0 && (
              <div style={{ padding: "32px 10px", textAlign: "center", color: COL.muted, fontSize: 13.5, fontFamily: F_BODY }}>
                No products match this search.
              </div>
            )}
            {filtered.map((p) =>
              isMobile ? (
                <div key={p.id} className="inv-row" style={{ padding: "16px 10px", borderBottom: "1px solid rgba(246,241,231,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, color: COL.text, fontFamily: F_BODY }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: COL.muted, fontFamily: F_BODY }}>{p.brand} · {p.size} · {p.color}</div>
                    </div>
                    <StatusPill stock={p.stock} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, fontFamily: F_MONO, color: COL.muted }}>
                    <span>₹{p.sellingPrice}{p.discount > 0 ? ` (-${p.discount}%)` : ""}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button className="inv-icon-btn" onClick={() => adjustStock(p.id, -1)} aria-label="Sell one unit"><ShoppingCart size={13} /></button>
                      <span style={{ color: COL.text, minWidth: 18, textAlign: "center" }}>{p.stock}</span>
                      <button className="inv-icon-btn" onClick={() => adjustStock(p.id, 1)} aria-label="Restock one unit"><PackagePlus size={13} /></button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={p.id} className="inv-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 12, alignItems: "center", padding: "14px 10px", borderBottom: "1px solid rgba(246,241,231,0.06)" }}>
                  <div>
                    <div style={{ fontSize: 13.5, color: COL.text, fontFamily: F_BODY }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, color: COL.muted, fontFamily: F_BODY, display: "flex", gap: 8, marginTop: 2 }}>
                      <span>{p.brand}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Ruler size={10} />{p.size}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Palette size={10} />{p.color}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 12.5, color: COL.muted, fontFamily: F_BODY }}>{p.category}</span>
                  <span style={{ fontSize: 13, color: COL.text, fontFamily: F_MONO }}>₹{p.purchasePrice}</span>
                  <span style={{ fontSize: 13, color: COL.text, fontFamily: F_MONO }}>
                    ₹{p.sellingPrice}
                    {p.discount > 0 && <span style={{ color: COL.gold, fontSize: 11 }}> -{p.discount}%</span>}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button className="inv-icon-btn" onClick={() => adjustStock(p.id, -1)} aria-label="Sell one unit"><ShoppingCart size={13} /></button>
                    <span style={{ fontSize: 13, color: COL.text, fontFamily: F_MONO, minWidth: 18, textAlign: "center" }}>{p.stock}</span>
                    <button className="inv-icon-btn" onClick={() => adjustStock(p.id, 1)} aria-label="Restock one unit"><PackagePlus size={13} /></button>
                  </div>
                  <StatusPill stock={p.stock} />
                </div>
              )
            )}
          </Glass>
        </Reveal>

        {/* Stock history */}
        <Reveal>
          <Glass style={{ padding: isMobile ? "22px 18px" : "26px 26px", marginBottom: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <Layers size={16} color={COL.teal} />
              <h3 style={{ fontSize: 15.5, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Stock history</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {history.map((h) => {
                const accent = h.type === "sold" ? COL.wine : COL.sage;
                return (
                  <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: `${accent}0f`, border: `1px solid ${accent}26` }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${accent}26`, color: accent }}>
                      {h.type === "sold" ? <ShoppingCart size={14} /> : <PackagePlus size={14} />}
                    </div>
                    <span style={{ fontSize: 13, flex: 1, color: COL.text, fontFamily: F_BODY }}>{h.text}</span>
                    <span style={{ fontSize: 11.5, color: COL.muted, fontFamily: F_MONO }}>{h.meta}</span>
                  </div>
                );
              })}
            </div>
          </Glass>
        </Reveal>
      </section>

      <footer style={{ ...section, paddingBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, paddingTop: 32, borderTop: "1px solid rgba(246,241,231,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at 30% 30%, ${COL.gold}, #8a6431)` }}>
              <Eye size={12} color={COL.bg} strokeWidth={2.2} />
            </div>
            <span style={{ fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Sentinel</span>
          </div>
          <span style={{ fontSize: 12.5, color: COL.muted }}>© 2026 Sentinel. Retail intelligence that never blinks.</span>
        </div>
      </footer>
    </div>
  );
}