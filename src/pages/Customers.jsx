import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Users, UserPlus, Search, Cake, Star, Crown, Phone, ShoppingBag,
  MessageCircle, ChevronDown, X, Sparkles, Eye,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import useMediaQuery from "../hooks/useMediaQuery.js";

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

const TIERS = ["Silver", "Gold", "Platinum"];
const TIER_ACCENT = { Silver: COL.teal, Gold: COL.gold, Platinum: COL.sage };

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
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 500 }) {
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

/* ---------- Tier badge ---------- */
function TierBadge({ tier }) {
  const accent = TIER_ACCENT[tier];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, padding: "4px 10px", borderRadius: 999, color: accent, background: `${accent}1a`, border: `1px solid ${accent}40`, fontFamily: F_BODY, whiteSpace: "nowrap" }}>
      <Crown size={11} /> {tier}
    </span>
  );
}

/* ---------- Field wrapper ---------- */
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

function initials(name) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function tierFromSpend(spend) {
  if (spend >= 50000) return "Platinum";
  if (spend >= 20000) return "Gold";
  return "Silver";
}

let idCounter = 100;
const nextId = () => ++idCounter;

const INITIAL_CUSTOMERS = [
  {
    id: 1, name: "Anjali Mehta", phone: "98765 12340", birthday: "3 Aug", upcomingBirthday: true,
    totalSpend: 62400, points: 624, lastPurchase: "5 days ago",
    purchases: [
      { item: "Ethnic Saree — Silk", date: "26 Jul", amount: 4499 },
      { item: "Cotton Kurta", date: "12 Jun", amount: 1199 },
      { item: "Leather Belt", date: "3 May", amount: 699 },
    ],
  },
  {
    id: 2, name: "Rohan Kapoor", phone: "91234 56712", birthday: "9 Aug", upcomingBirthday: true,
    totalSpend: 28900, points: 289, lastPurchase: "2 weeks ago",
    purchases: [
      { item: "Formal Shirt", date: "18 Jul", amount: 1499 },
      { item: "Men's Slim Denim", date: "30 Jun", amount: 1699 },
    ],
  },
  {
    id: 3, name: "Simran Kaur", phone: "99887 23456", birthday: "22 Sep", upcomingBirthday: false,
    totalSpend: 84200, points: 842, lastPurchase: "1 month ago",
    purchases: [
      { item: "Wool Blazer", date: "15 Jun", amount: 5499 },
      { item: "Sneakers", date: "2 May", amount: 2999 },
    ],
  },
  {
    id: 4, name: "Karan Malhotra", phone: "90123 98765", birthday: "14 Aug", upcomingBirthday: true,
    totalSpend: 15600, points: 156, lastPurchase: "3 days ago",
    purchases: [{ item: "Cotton Kurta", date: "28 Jul", amount: 1199 }],
  },
  {
    id: 5, name: "Neha Sharma", phone: "97654 87654", birthday: "30 Nov", upcomingBirthday: false,
    totalSpend: 41300, points: 413, lastPurchase: "10 days ago",
    purchases: [
      { item: "Kids Party Frock", date: "21 Jul", amount: 999 },
      { item: "Ethnic Saree — Silk", date: "9 Jun", amount: 4499 },
    ],
  },
  {
    id: 6, name: "Arjun Nair", phone: "98000 33221", birthday: "1 Jan", upcomingBirthday: false,
    totalSpend: 9800, points: 98, lastPurchase: "2 months ago",
    purchases: [{ item: "Leather Belt", date: "25 May", amount: 699 }],
  },
];

export default function Customers() {
  useFonts();
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 980px)");

  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", birthday: "" });

  const withTier = customers.map((c) => ({ ...c, tier: tierFromSpend(c.totalSpend) }));

  const stats = useMemo(() => {
    const total = withTier.length;
    const birthdaysSoon = withTier.filter((c) => c.upcomingBirthday).length;
    const pointsIssued = withTier.reduce((s, c) => s + c.points, 0);
    const repeatPct = Math.round((withTier.filter((c) => c.purchases.length > 1).length / (total || 1)) * 100);
    return { total, birthdaysSoon, pointsIssued, repeatPct };
  }, [withTier]);

  const filtered = withTier.filter((c) => {
    const matchesTier = tier === "All" || c.tier === tier;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
    return matchesTier && matchesSearch;
  });

  const upcoming = withTier.filter((c) => c.upcomingBirthday);

  const sendWish = (c) => {
    const digits = c.phone.replace(/\D/g, "");
    const msg = encodeURIComponent(`Happy Birthday ${c.name}! 🎉 From all of us at Sentinel — enjoy a special discount on your next visit.`);
    window.open(`https://wa.me/91${digits}?text=${msg}`, "_blank");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setCustomers((cs) => [
      { id: nextId(), name: form.name.trim(), phone: form.phone.trim(), birthday: form.birthday || "—", upcomingBirthday: false, totalSpend: 0, points: 0, lastPurchase: "No purchases yet", purchases: [] },
      ...cs,
    ]);
    setForm({ name: "", phone: "", birthday: "" });
    setFormOpen(false);
  };

  const section = { position: "relative", zIndex: 10, maxWidth: 1120, margin: "0 auto", padding: isMobile ? "0 18px" : "0 24px" };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", overflowX: "hidden", background: COL.bg, fontFamily: F_BODY }}>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        .cus-row:hover { background: rgba(246,241,231,0.03); }
        .cus-icon-btn {
          border: 1px solid rgba(246,241,231,0.14);
          background: transparent;
          color: ${COL.text};
          border-radius: 8px;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .cus-icon-btn:hover { background: rgba(246,241,231,0.08); transform: scale(1.06); }
        .tier-pill {
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
        .tier-pill.active { background: ${COL.gold}; color: ${COL.bg}; border-color: ${COL.gold}; }
        .add-btn { transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease; }
        .add-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 24px rgba(201,151,78,0.35); }
        .wish-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .wish-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(124,155,128,0.3); }
      `}</style>

      <ParticleField />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", filter: "blur(140px)", background: `radial-gradient(circle, ${COL.gold}1c, transparent 70%)`, left: "-100px", top: 40 }} />
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", filter: "blur(130px)", background: `radial-gradient(circle, ${COL.wine}16, transparent 70%)`, right: "-90px", top: 700 }} />
      </div>

      <Navbar />

      <section style={{ ...section, paddingTop: isMobile ? 110 : 140, paddingBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 32 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, fontSize: 12, marginBottom: 14, background: `${COL.gold}1a`, border: `1px solid ${COL.gold}4d`, color: COL.gold }}>
              <Sparkles size={12} /> Customers
            </div>
            <h1 style={{ fontSize: isMobile ? 26 : 34, lineHeight: 1.2, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
              Every customer, remembered.
            </h1>
          </div>
          <button className="add-btn" onClick={() => setFormOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 999, fontSize: 13.5, fontWeight: 500, background: COL.gold, color: COL.bg, border: "none", cursor: "pointer", fontFamily: F_BODY }}>
            {formOpen ? <X size={16} /> : <UserPlus size={16} />}
            {formOpen ? "Close" : "Add customer"}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: 20, marginBottom: 28 }}>
          <StatCard icon={<Users size={16} color={COL.sage} />} label="Total customers" value={stats.total} accent={COL.sage} />
          <StatCard icon={<Cake size={16} color={COL.wine} />} label="Birthdays this month" value={stats.birthdaysSoon} accent={COL.wine} />
          <StatCard icon={<Star size={16} color={COL.gold} />} label="Loyalty points issued" value={stats.pointsIssued} accent={COL.gold} />
          <StatCard icon={<ShoppingBag size={16} color={COL.teal} />} label="Repeat customers" value={stats.repeatPct} suffix="%" accent={COL.teal} />
        </div>

        {/* Add customer form */}
        {formOpen && (
          <Reveal>
            <Glass style={{ padding: isMobile ? "22px 18px" : "28px 30px", marginBottom: 28 }}>
              <h3 style={{ fontSize: 16, marginBottom: 20, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Add a new customer</h3>
              <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
                <Field label="Full name">
                  <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Anjali Mehta" required />
                </Field>
                <Field label="Phone number">
                  <input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 98765 12340" required />
                </Field>
                <Field label="Birthday">
                  <input style={inputStyle} value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} placeholder="e.g. 3 Aug" />
                </Field>
              </form>
              <button onClick={handleSubmit} style={{ padding: "11px 22px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, background: COL.gold, color: COL.bg, border: "none", cursor: "pointer", fontFamily: F_BODY, display: "flex", alignItems: "center", gap: 8 }}>
                <UserPlus size={15} /> Save customer
              </button>
            </Glass>
          </Reveal>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "2fr 1fr", gap: 20, marginBottom: 28 }}>
          {/* Customer list */}
          <Reveal>
            <Glass style={{ padding: isMobile ? "16px 12px" : "18px 20px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 999, border: "1px solid rgba(246,241,231,0.14)", background: "rgba(246,241,231,0.04)", flex: isMobile ? "1 1 100%" : "0 1 220px" }}>
                  <Search size={14} color={COL.muted} />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or phone" style={{ border: "none", background: "transparent", outline: "none", color: COL.text, fontFamily: F_BODY, fontSize: 13, width: "100%" }} />
                </div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                  <button className={`tier-pill${tier === "All" ? " active" : ""}`} onClick={() => setTier("All")}>All</button>
                  {TIERS.map((t) => (
                    <button key={t} className={`tier-pill${tier === t ? " active" : ""}`} onClick={() => setTier(t)}>{t}</button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 && (
                <div style={{ padding: "24px 10px", textAlign: "center", color: COL.muted, fontSize: 13.5 }}>No customers match this search.</div>
              )}

              {filtered.map((c) => {
                const isOpen = expanded === c.id;
                return (
                  <div key={c.id} className="cus-row" style={{ borderBottom: "1px solid rgba(246,241,231,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 8px", cursor: "pointer" }} onClick={() => setExpanded(isOpen ? null : c.id)}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `${TIER_ACCENT[c.tier]}22`, color: TIER_ACCENT[c.tier], fontFamily: F_MONO, fontSize: 12, flexShrink: 0 }}>
                        {initials(c.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13.5, color: COL.text, fontFamily: F_BODY }}>{c.name}</span>
                          {c.upcomingBirthday && <Cake size={13} color={COL.wine} />}
                        </div>
                        <div style={{ fontSize: 11.5, color: COL.muted, fontFamily: F_BODY, display: "flex", alignItems: "center", gap: 5 }}>
                          <Phone size={10} /> {c.phone}
                        </div>
                      </div>
                      {!isMobile && <TierBadge tier={c.tier} />}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 12.5, color: COL.gold, fontFamily: F_MONO }}>{c.points} pts</div>
                        <div style={{ fontSize: 11, color: COL.muted, fontFamily: F_BODY }}>{c.lastPurchase}</div>
                      </div>
                      <ChevronDown size={16} color={COL.muted} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s ease", flexShrink: 0 }} />
                    </div>
                    <div style={{ maxHeight: isOpen ? 260 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
                      <div style={{ padding: "0 8px 16px 54px" }}>
                        {c.purchases.length === 0 ? (
                          <p style={{ fontSize: 12.5, color: COL.muted }}>No purchases yet.</p>
                        ) : (
                          c.purchases.map((p, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 0", color: COL.muted, fontFamily: F_BODY }}>
                              <span style={{ color: COL.text }}>{p.item}</span>
                              <span style={{ fontFamily: F_MONO }}>₹{p.amount} · {p.date}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Glass>
          </Reveal>

          {/* Birthday reminders */}
          <Reveal delay={80}>
            <Glass style={{ padding: isMobile ? "20px 16px" : "24px 24px", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <Cake size={16} color={COL.wine} />
                <h3 style={{ fontSize: 15, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Birthdays this month</h3>
              </div>
              {upcoming.length === 0 && <p style={{ fontSize: 12.5, color: COL.muted }}>No birthdays coming up.</p>}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {upcoming.map((c) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: `${COL.wine}0f`, border: `1px solid ${COL.wine}26` }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${COL.wine}26`, color: COL.wine }}>
                      <Cake size={14} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: COL.text, fontFamily: F_BODY }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: COL.muted, fontFamily: F_MONO }}>{c.birthday}</div>
                    </div>
                    <button className="wish-btn" onClick={() => sendWish(c)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, padding: "6px 10px", borderRadius: 999, border: `1px solid ${COL.sage}4d`, background: `${COL.sage}1a`, color: COL.sage, cursor: "pointer", fontFamily: F_BODY, whiteSpace: "nowrap" }}>
                      <MessageCircle size={12} /> Send wish
                    </button>
                  </div>
                ))}
              </div>
            </Glass>
          </Reveal>
        </div>
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