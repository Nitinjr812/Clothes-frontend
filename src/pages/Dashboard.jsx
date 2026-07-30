import { useEffect, useRef, useState, useCallback } from "react";
import {
  IndianRupee, TrendingUp, TrendingDown, Wallet, Receipt,
  Banknote, Smartphone, CreditCard, Flame, Snowflake,
  PackageX, AlertTriangle, Eye, Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import useMediaQuery from "../hooks/useMediaQuery.js";

const COL = {
  bg: "#15110E",
  bg2: "#1C1712",
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

/* ---------- fonts (idempotent, same as Home) ---------- */
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
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.12 }
    );
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
        transform: visible ? "translateY(0)" : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.8s cubic-bezier(.22,1,.36,1) ${delay}ms, opacity 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- animated number (transitions when value changes, e.g. period switch) ---------- */
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 650 }) {
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

/* ---------- interactive particle constellation (same signature bg as Home) ---------- */
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

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.55 }}
    />
  );
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

/* ---------- Period toggle ---------- */
function PeriodToggle({ value, onChange }) {
  const opts = [
    { key: "today", label: "Today" },
    { key: "week", label: "This week" },
    { key: "month", label: "This month" },
  ];
  return (
    <Glass style={{ display: "inline-flex", padding: 4, borderRadius: 999 }}>
      {opts.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          style={{
            border: "none",
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: 999,
            fontSize: 13,
            fontFamily: F_BODY,
            fontWeight: 500,
            transition: "background 0.25s ease, color 0.25s ease",
            background: value === o.key ? COL.gold : "transparent",
            color: value === o.key ? COL.bg : COL.muted,
          }}
        >
          {o.label}
        </button>
      ))}
    </Glass>
  );
}

/* ---------- Stat card ---------- */
function StatCard({ icon, label, value, prefix = "", suffix = "", change, accent }) {
  const positive = change >= 0;
  return (
    <Reveal>
      <Glass style={{ padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10, display: "flex",
              alignItems: "center", justifyContent: "center",
              background: `${accent}1c`, border: `1px solid ${accent}40`,
            }}
          >
            {icon}
          </div>
          <span style={{ fontSize: 12.5, textTransform: "uppercase", letterSpacing: "0.05em", color: COL.muted, fontFamily: F_BODY }}>
            {label}
          </span>
        </div>
        <div style={{ fontSize: 26, fontFamily: F_MONO, color: COL.text, fontWeight: 500, marginBottom: 8 }}>
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        </div>
        {typeof change === "number" && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: positive ? COL.sage : COL.wine, fontFamily: F_BODY }}>
            {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(change)}% vs previous period
          </div>
        )}
      </Glass>
    </Reveal>
  );
}

/* ---------- Donut chart ---------- */
function Donut({ data, size = 168, strokeWidth = 24 }) {
  const [ref, visible] = useReveal();
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let acc = 0;
  return (
    <div ref={ref} style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(246,241,231,0.06)" strokeWidth={strokeWidth} />
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = visible ? frac * circumference : 0;
          const gap = circumference - dash;
          const dashOffset = -acc;
          acc += frac * circumference;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={dashOffset}
              style={{ transition: `stroke-dasharray 1.1s cubic-bezier(.22,1,.36,1) ${i * 120}ms` }}
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, color: COL.muted, fontFamily: F_BODY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total</span>
        <span style={{ fontSize: 15, color: COL.text, fontFamily: F_MONO, fontWeight: 500 }}>{total}%</span>
      </div>
    </div>
  );
}

/* ---------- Trend bar chart ---------- */
function TrendBars({ data, accent }) {
  const [ref, visible] = useReveal();
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160, padding: "0 4px" }}>
      {data.map((d, i) => {
        const isPeak = d.value === max;
        const h = visible ? (d.value / max) * 100 : 0;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
            <div
              title={`${d.label}: ${d.value}`}
              style={{
                width: "100%",
                maxWidth: 30,
                borderRadius: 7,
                height: `${h}%`,
                background: isPeak ? accent : `${accent}45`,
                transition: `height 0.9s cubic-bezier(.22,1,.36,1) ${i * 60}ms`,
              }}
            />
            <span style={{ fontSize: 11, color: COL.muted, fontFamily: F_MONO }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Product row with mini bar ---------- */
function ProductRow({ name, meta, pct, accent }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, fontFamily: F_BODY }}>
        <span style={{ color: COL.text }}>{name}</span>
        <span style={{ color: COL.muted, fontFamily: F_MONO, fontSize: 12 }}>{meta}</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: "rgba(246,241,231,0.07)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: visible ? `${pct}%` : 0, borderRadius: 999, background: accent, transition: "width 0.9s cubic-bezier(.22,1,.36,1)" }} />
      </div>
    </div>
  );
}

/* ---------- Alert row (fraud-radar style, reused for low stock) ---------- */
function AlertRow({ icon, text, meta }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: `${COL.wine}0f`, border: `1px solid ${COL.wine}26` }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${COL.wine}26`, color: COL.wine }}>
        {icon}
      </div>
      <span style={{ fontSize: 13, flex: 1, color: COL.text, fontFamily: F_BODY }}>{text}</span>
      <span style={{ fontSize: 11.5, color: COL.muted, fontFamily: F_MONO }}>{meta}</span>
    </div>
  );
}

/* ---------- Mock data per period ---------- */
const DATA = {
  today: {
    dateLabel: "30 Jul, 2026",
    sales: 84230, salesChange: 12.4,
    profit: 21840, profitChange: 8.1,
    avgBill: 1360, billChange: -3.2,
    stockValueL: 47,
    split: [
      { label: "UPI", value: 44, color: COL.gold, icon: Smartphone },
      { label: "Cash", value: 38, color: COL.sage, icon: Banknote },
      { label: "Card", value: 18, color: COL.teal, icon: CreditCard },
    ],
    trend: [
      { label: "10a", value: 18 }, { label: "12p", value: 42 }, { label: "2p", value: 61 },
      { label: "4p", value: 54 }, { label: "6p", value: 82 }, { label: "8p", value: 96 },
    ],
    bestSellers: [
      { name: "Men's Slim Denim", meta: "18 sold", pct: 100 },
      { name: "Cotton Kurta — Blue", meta: "14 sold", pct: 78 },
      { name: "Formal Shirt — White", meta: "11 sold", pct: 61 },
      { name: "Ethnic Saree — Silk", meta: "9 sold", pct: 50 },
    ],
    slowMovers: [
      { name: "Wool Blazer — Grey", meta: "1 sold", pct: 12 },
      { name: "Kids Party Frock", meta: "2 sold", pct: 20 },
      { name: "Formal Tie — Maroon", meta: "1 sold", pct: 12 },
      { name: "Winter Muffler", meta: "0 sold", pct: 4 },
    ],
  },
  week: {
    dateLabel: "24–30 Jul, 2026",
    sales: 612400, salesChange: 9.6,
    profit: 158300, profitChange: 11.2,
    avgBill: 1290, billChange: 4.4,
    stockValueL: 47,
    split: [
      { label: "UPI", value: 48, color: COL.gold, icon: Smartphone },
      { label: "Cash", value: 33, color: COL.sage, icon: Banknote },
      { label: "Card", value: 19, color: COL.teal, icon: CreditCard },
    ],
    trend: [
      { label: "Mon", value: 62 }, { label: "Tue", value: 48 }, { label: "Wed", value: 71 },
      { label: "Thu", value: 55 }, { label: "Fri", value: 83 }, { label: "Sat", value: 97 }, { label: "Sun", value: 76 },
    ],
    bestSellers: [
      { name: "Men's Slim Denim", meta: "96 sold", pct: 100 },
      { name: "Cotton Kurta — Blue", meta: "81 sold", pct: 84 },
      { name: "Ethnic Saree — Silk", meta: "64 sold", pct: 67 },
      { name: "Formal Shirt — White", meta: "58 sold", pct: 60 },
    ],
    slowMovers: [
      { name: "Wool Blazer — Grey", meta: "3 sold", pct: 15 },
      { name: "Kids Party Frock", meta: "5 sold", pct: 22 },
      { name: "Winter Muffler", meta: "2 sold", pct: 10 },
      { name: "Formal Tie — Maroon", meta: "4 sold", pct: 18 },
    ],
  },
  month: {
    dateLabel: "Jul, 2026",
    sales: 2384000, salesChange: 6.8,
    profit: 641200, profitChange: 14.5,
    avgBill: 1310, billChange: 2.1,
    stockValueL: 47,
    split: [
      { label: "UPI", value: 51, color: COL.gold, icon: Smartphone },
      { label: "Cash", value: 29, color: COL.sage, icon: Banknote },
      { label: "Card", value: 20, color: COL.teal, icon: CreditCard },
    ],
    trend: [
      { label: "W1", value: 58 }, { label: "W2", value: 72 }, { label: "W3", value: 64 }, { label: "W4", value: 89 },
    ],
    bestSellers: [
      { name: "Men's Slim Denim", meta: "412 sold", pct: 100 },
      { name: "Ethnic Saree — Silk", meta: "356 sold", pct: 86 },
      { name: "Cotton Kurta — Blue", meta: "298 sold", pct: 72 },
      { name: "Formal Shirt — White", meta: "231 sold", pct: 56 },
    ],
    slowMovers: [
      { name: "Wool Blazer — Grey", meta: "9 sold", pct: 14 },
      { name: "Winter Muffler", meta: "6 sold", pct: 9 },
      { name: "Kids Party Frock", meta: "13 sold", pct: 20 },
      { name: "Formal Tie — Maroon", meta: "11 sold", pct: 17 },
    ],
  },
};

const LOW_STOCK = [
  { name: "Denim XL — Blue", left: "3 left" },
  { name: "Cotton Kurta — Size M", left: "5 left" },
  { name: "Saree — Red Silk", left: "2 left" },
  { name: "Sneakers — Size 9", left: "4 left" },
];

export default function Dashboard() {
  useFonts();
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 980px)");
  const cols = isMobile ? 1 : isTablet ? 2 : 3;
  const [period, setPeriod] = useState("today");
  const d = DATA[period];

  const section = { position: "relative", zIndex: 10, maxWidth: 1120, margin: "0 auto", padding: isMobile ? "0 18px" : "0 24px" };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", overflowX: "hidden", background: COL.bg, fontFamily: F_BODY }}>
      <style>{`
        @keyframes sentinelFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <ParticleField />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", filter: "blur(140px)", background: `radial-gradient(circle, ${COL.gold}1c, transparent 70%)`, left: "-100px", top: 40 }} />
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", filter: "blur(130px)", background: `radial-gradient(circle, ${COL.teal}16, transparent 70%)`, right: "-90px", top: 620 }} />
      </div>

      <Navbar />

      <section style={{ ...section, paddingTop: isMobile ? 110 : 140, paddingBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 32 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, fontSize: 12, marginBottom: 14, background: `${COL.gold}1a`, border: `1px solid ${COL.gold}4d`, color: COL.gold }}>
              <Sparkles size={12} /> Owner dashboard
            </div>
            <h1 style={{ fontSize: isMobile ? 26 : 34, lineHeight: 1.2, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600, marginBottom: 6 }}>
              Namaste, here's your store today.
            </h1>
            <p style={{ fontSize: 13.5, color: COL.muted, fontFamily: F_MONO }}>{d.dateLabel}</p>
          </div>
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: 20, marginBottom: 28 }}>
          <StatCard icon={<IndianRupee size={17} color={COL.sage} />} label="Total sales" value={d.sales} prefix="₹" change={d.salesChange} accent={COL.sage} />
          <StatCard icon={<TrendingUp size={17} color={COL.gold} />} label="Profit" value={d.profit} prefix="₹" change={d.profitChange} accent={COL.gold} />
          <StatCard icon={<Receipt size={17} color={COL.teal} />} label="Avg. bill value" value={d.avgBill} prefix="₹" change={d.billChange} accent={COL.teal} />
          <StatCard icon={<Wallet size={17} color={COL.gold} />} label="Stock value" value={d.stockValueL} suffix="L" accent={COL.gold} />
        </div>

        {/* Trend + split */}
        <div style={{ display: "grid", gridTemplateColumns: cols === 1 ? "1fr" : "2fr 1fr", gap: 20, marginBottom: 28 }}>
          <Reveal>
            <Glass style={{ padding: isMobile ? "22px 18px" : "28px 30px" }}>
              <h3 style={{ fontSize: 16, marginBottom: 20, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Sales trend</h3>
              <TrendBars data={d.trend} accent={COL.gold} />
            </Glass>
          </Reveal>
          <Reveal delay={100}>
            <Glass style={{ padding: isMobile ? "22px 18px" : "28px 30px" }}>
              <h3 style={{ fontSize: 16, marginBottom: 18, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Payment split</h3>
              <Donut data={d.split} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                {d.split.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontFamily: F_BODY }}>
                      <Icon size={14} color={s.color} />
                      <span style={{ color: COL.text, flex: 1 }}>{s.label}</span>
                      <span style={{ color: COL.muted, fontFamily: F_MONO }}>{s.value}%</span>
                    </div>
                  );
                })}
              </div>
            </Glass>
          </Reveal>
        </div>

        {/* Best sellers / slow movers / low stock */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 20, marginBottom: 60 }}>
          <Reveal>
            <Glass style={{ padding: isMobile ? "22px 18px" : "26px 26px", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <Flame size={16} color={COL.gold} />
                <h3 style={{ fontSize: 15.5, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Best sellers</h3>
              </div>
              {d.bestSellers.map((p, i) => (
                <ProductRow key={i} name={p.name} meta={p.meta} pct={p.pct} accent={COL.gold} />
              ))}
            </Glass>
          </Reveal>
          <Reveal delay={80}>
            <Glass style={{ padding: isMobile ? "22px 18px" : "26px 26px", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <Snowflake size={16} color={COL.teal} />
                <h3 style={{ fontSize: 15.5, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Slow movers</h3>
              </div>
              {d.slowMovers.map((p, i) => (
                <ProductRow key={i} name={p.name} meta={p.meta} pct={p.pct} accent={COL.teal} />
              ))}
            </Glass>
          </Reveal>
          <Reveal delay={160}>
            <Glass style={{ padding: isMobile ? "22px 18px" : "26px 26px", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={16} color={COL.wine} />
                  <h3 style={{ fontSize: 15.5, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Low stock alerts</h3>
                </div>
                <span style={{ fontSize: 11.5, padding: "3px 9px", borderRadius: 999, color: COL.wine, background: `${COL.wine}1a`, fontFamily: F_MONO }}>{LOW_STOCK.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {LOW_STOCK.map((s, i) => (
                  <AlertRow key={i} icon={<PackageX size={14} />} text={s.name} meta={s.left} />
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