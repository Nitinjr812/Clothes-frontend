import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  ShieldAlert, IndianRupee, Receipt, Percent, RotateCcw, Pencil, Trash2,
  Camera, Search, AlertTriangle, XCircle, Users, Eye,
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

const SEVERITY_COLOR = { critical: COL.wine, warning: COL.gold, info: COL.teal };
const ACTION_ICON = {
  "Cash mismatch": IndianRupee,
  "Bill cancelled": XCircle,
  "Discount applied": Percent,
  "Return processed": RotateCcw,
  "Item edited": Pencil,
  "Item deleted": Trash2,
  "Billed": Receipt,
};

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

/* ---------- Toggle switch ---------- */
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={checked}
      style={{
        width: 40, height: 22, borderRadius: 999, position: "relative", cursor: "pointer",
        border: `1px solid ${checked ? COL.gold : "rgba(246,241,231,0.2)"}`,
        background: checked ? `${COL.gold}33` : "rgba(246,241,231,0.06)",
        transition: "background 0.25s ease, border-color 0.25s ease",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute", top: 2, left: checked ? 20 : 2,
          width: 16, height: 16, borderRadius: "50%",
          background: checked ? COL.gold : COL.muted,
          transition: "left 0.25s cubic-bezier(.22,1,.36,1), background 0.25s ease",
        }}
      />
    </button>
  );
}

/* ---------- Rule row ---------- */
function RuleRow({ label, description, enabled, onToggle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 4px", borderBottom: "1px solid rgba(246,241,231,0.06)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, color: COL.text, fontFamily: F_BODY, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 12, color: COL.muted, fontFamily: F_BODY }}>{description}</div>
      </div>
      <ToggleSwitch checked={enabled} onChange={onToggle} />
    </div>
  );
}

/* ---------- Employee risk row (mini bar) ---------- */
function RiskRow({ name, count, max, hasCritical }) {
  const [ref, visible] = useReveal();
  const accent = hasCritical ? COL.wine : COL.gold;
  const pct = max ? (count / max) * 100 : 0;
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, fontFamily: F_BODY }}>
        <span style={{ color: COL.text }}>{name}</span>
        <span style={{ color: COL.muted, fontFamily: F_MONO, fontSize: 12 }}>{count} flagged</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: "rgba(246,241,231,0.07)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: visible ? `${pct}%` : 0, borderRadius: 999, background: accent, transition: "width 0.9s cubic-bezier(.22,1,.36,1)" }} />
      </div>
    </div>
  );
}

/* ---------- Log entry row ---------- */
function LogEntry({ entry }) {
  const color = SEVERITY_COLOR[entry.severity];
  const Icon = ACTION_ICON[entry.action] || Receipt;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 14px", borderRadius: 12, background: `${color}0f`, border: `1px solid ${color}26` }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${color}26`, color }}>
        <Icon size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 13.5, color: COL.text, fontFamily: F_BODY, fontWeight: 500 }}>{entry.employee}</span>
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, color, background: `${color}1a`, fontFamily: F_BODY }}>{entry.action}</span>
        </div>
        <div style={{ fontSize: 13, color: COL.muted, fontFamily: F_BODY }}>{entry.detail}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 11.5, color: COL.muted, fontFamily: F_MONO, whiteSpace: "nowrap" }}>{entry.time}</span>
        {entry.cctv && (
          <button style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, padding: "4px 9px", borderRadius: 999, border: `1px solid ${COL.teal}4d`, background: `${COL.teal}1a`, color: COL.teal, cursor: "pointer", fontFamily: F_BODY, whiteSpace: "nowrap" }}>
            <Camera size={11} /> View clip
          </button>
        )}
      </div>
    </div>
  );
}

const LOG = [
  { id: 1, employee: "Ravi Kumar", action: "Cash mismatch", detail: "Counter 2 short by ₹500", severity: "critical", time: "2 min ago", amount: 500, cctv: true },
  { id: 2, employee: "Priya Singh", action: "Bill cancelled", detail: "Bill #4482 cancelled after printing", severity: "warning", time: "18 min ago", cctv: true },
  { id: 3, employee: "Amit Verma", action: "Discount applied", detail: "22% discount on Bill #4470 (limit 10%)", severity: "critical", time: "42 min ago", cctv: false },
  { id: 4, employee: "Sneha Rao", action: "Return processed", detail: "Return #331 — Denim Jacket", severity: "info", time: "1 hr ago", cctv: false },
  { id: 5, employee: "Vikram Joshi", action: "Item edited", detail: "Price changed on Formal Shirt — ₹1,499 → ₹999", severity: "warning", time: "1 hr 20 min ago", cctv: false },
  { id: 6, employee: "Ravi Kumar", action: "Item deleted", detail: "Removed 3 units of Cotton Kurta from stock log", severity: "critical", time: "2 hrs ago", cctv: true },
  { id: 7, employee: "Priya Singh", action: "Billed", detail: "Bill #4479 — ₹2,340", severity: "info", time: "3 hrs ago", cctv: false },
  { id: 8, employee: "Amit Verma", action: "Discount applied", detail: "12% discount on Bill #4465", severity: "warning", time: "4 hrs ago", cctv: false },
  { id: 9, employee: "Sneha Rao", action: "Cash mismatch", detail: "Counter 1 short by ₹120", severity: "warning", time: "5 hrs ago", amount: 120, cctv: true },
  { id: 10, employee: "Vikram Joshi", action: "Bill cancelled", detail: "Bill #4441 cancelled before printing", severity: "info", time: "6 hrs ago", cctv: false },
];

const INITIAL_RULES = [
  { id: "discount", label: "Excess discount", description: "Flags any discount applied above the allowed limit", enabled: true },
  { id: "cancel", label: "Cancelled bill", description: "Flags a bill cancelled after it's been printed", enabled: true },
  { id: "cash", label: "Cash mismatch", description: "Flags when counter cash doesn't match the billed total", enabled: true },
  { id: "walkout", label: "Stock walkout", description: "Flags stock reducing without a matching bill", enabled: false },
];

const SEVERITIES = ["All", "Critical", "Warning", "Info"];

export default function FraudShield() {
  useFonts();
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 980px)");

  const [rules, setRules] = useState(INITIAL_RULES);
  const [severity, setSeverity] = useState("All");
  const [employee, setEmployee] = useState("All");
  const [search, setSearch] = useState("");

  const employees = useMemo(() => ["All", ...new Set(LOG.map((l) => l.employee))], []);

  const filtered = LOG.filter((l) => {
    const matchesSeverity = severity === "All" || l.severity === severity.toLowerCase();
    const matchesEmployee = employee === "All" || l.employee === employee;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || l.detail.toLowerCase().includes(q) || l.employee.toLowerCase().includes(q);
    return matchesSeverity && matchesEmployee && matchesSearch;
  });

  const stats = useMemo(() => {
    const critical = LOG.filter((l) => l.severity === "critical").length;
    const cashMismatch = LOG.filter((l) => l.action === "Cash mismatch").reduce((s, l) => s + (l.amount || 0), 0);
    const cancelledBills = LOG.filter((l) => l.action === "Bill cancelled").length;
    const staffFlagged = new Set(LOG.filter((l) => l.severity !== "info").map((l) => l.employee)).size;
    return { critical, cashMismatch, cancelledBills, staffFlagged };
  }, []);

  const riskByEmployee = useMemo(() => {
    const map = {};
    LOG.forEach((l) => {
      if (l.severity === "info") return;
      if (!map[l.employee]) map[l.employee] = { count: 0, hasCritical: false };
      map[l.employee].count += 1;
      if (l.severity === "critical") map[l.employee].hasCritical = true;
    });
    const arr = Object.entries(map).map(([name, v]) => ({ name, ...v }));
    arr.sort((a, b) => b.count - a.count);
    return arr;
  }, []);
  const maxRisk = Math.max(...riskByEmployee.map((r) => r.count), 1);

  const section = { position: "relative", zIndex: 10, maxWidth: 1120, margin: "0 auto", padding: isMobile ? "0 18px" : "0 24px" };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", overflowX: "hidden", background: COL.bg, fontFamily: F_BODY }}>
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        .sev-pill {
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
        .sev-pill.active {
          background: ${COL.gold};
          color: ${COL.bg};
          border-color: ${COL.gold};
        }
        .emp-select {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(246,241,231,0.14);
          background: rgba(246,241,231,0.04);
          color: ${COL.text};
          font-family: ${F_BODY};
          font-size: 13px;
        }
      `}</style>

      <ParticleField />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", filter: "blur(140px)", background: `radial-gradient(circle, ${COL.wine}1c, transparent 70%)`, left: "-100px", top: 40 }} />
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", filter: "blur(130px)", background: `radial-gradient(circle, ${COL.gold}16, transparent 70%)`, right: "-90px", top: 700 }} />
      </div>

      <Navbar />

      <section style={{ ...section, paddingTop: isMobile ? 110 : 140, paddingBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 32 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, fontSize: 12, marginBottom: 14, background: `${COL.wine}1a`, border: `1px solid ${COL.wine}4d`, color: COL.wine }}>
              <ShieldAlert size={12} /> Fraud Shield
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: COL.wine, animation: "pulseDot 1.6s ease-in-out infinite" }} />
            </div>
            <h1 style={{ fontSize: isMobile ? 26 : 34, lineHeight: 1.2, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
              Nothing leaves the counter unnoticed.
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: 20, marginBottom: 28 }}>
          <StatCard icon={<AlertTriangle size={16} color={COL.wine} />} label="Critical alerts" value={stats.critical} accent={COL.wine} />
          <StatCard icon={<IndianRupee size={16} color={COL.gold} />} label="Cash mismatch" value={stats.cashMismatch} prefix="₹" accent={COL.gold} />
          <StatCard icon={<XCircle size={16} color={COL.teal} />} label="Cancelled bills" value={stats.cancelledBills} accent={COL.teal} />
          <StatCard icon={<Users size={16} color={COL.sage} />} label="Staff flagged" value={stats.staffFlagged} accent={COL.sage} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "2fr 1fr", gap: 20, marginBottom: 28 }}>
          {/* Activity log */}
          <Reveal>
            <Glass style={{ padding: isMobile ? "20px 16px" : "26px 26px" }}>
              <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Live activity log</h3>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(246,241,231,0.14)", background: "rgba(246,241,231,0.04)", flex: isMobile ? "1 1 100%" : "0 1 220px" }}>
                  <Search size={14} color={COL.muted} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search log"
                    style={{ border: "none", background: "transparent", outline: "none", color: COL.text, fontFamily: F_BODY, fontSize: 13, width: "100%" }}
                  />
                </div>
                <select className="emp-select" value={employee} onChange={(e) => setEmployee(e.target.value)}>
                  {employees.map((e) => (
                    <option key={e} value={e} style={{ background: COL.bg }}>{e === "All" ? "All employees" : e}</option>
                  ))}
                </select>
                <div style={{ display: "flex", gap: 8 }}>
                  {SEVERITIES.map((s) => (
                    <button key={s} className={`sev-pill${severity === s ? " active" : ""}`} onClick={() => setSeverity(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 520, overflowY: "auto", paddingRight: 4 }}>
                {filtered.length === 0 && (
                  <div style={{ padding: "24px 10px", textAlign: "center", color: COL.muted, fontSize: 13.5 }}>No matching activity.</div>
                )}
                {filtered.map((entry) => (
                  <LogEntry key={entry.id} entry={entry} />
                ))}
              </div>
            </Glass>
          </Reveal>

          {/* Rules + risk */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Reveal delay={80}>
              <Glass style={{ padding: isMobile ? "20px 16px" : "24px 24px" }}>
                <h3 style={{ fontSize: 15, marginBottom: 6, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Alert rules</h3>
                <p style={{ fontSize: 12, color: COL.muted, marginBottom: 6 }}>Turn detection rules on or off.</p>
                <div>
                  {rules.map((r) => (
                    <RuleRow
                      key={r.id}
                      label={r.label}
                      description={r.description}
                      enabled={r.enabled}
                      onToggle={() => setRules((rs) => rs.map((x) => (x.id === r.id ? { ...x, enabled: !x.enabled } : x)))}
                    />
                  ))}
                </div>
              </Glass>
            </Reveal>

            <Reveal delay={140}>
              <Glass style={{ padding: isMobile ? "20px 16px" : "24px 24px" }}>
                <h3 style={{ fontSize: 15, marginBottom: 18, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Staff risk summary</h3>
                {riskByEmployee.map((r) => (
                  <RiskRow key={r.name} name={r.name} count={r.count} max={maxRisk} hasCritical={r.hasCritical} />
                ))}
              </Glass>
            </Reveal>
          </div>
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