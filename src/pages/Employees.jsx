import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Users, UserPlus, Phone, Check, X, Receipt, Boxes, ShieldCheck,
  Circle, KeyRound, Sparkles, Eye, MoreHorizontal,
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

const ROLES = ["Salesman", "Manager", "Owner"];
const ROLE_ACCENT = { Salesman: COL.teal, Manager: COL.gold, Owner: COL.sage };
const ROLE_ICON = { Salesman: Receipt, Manager: Boxes, Owner: ShieldCheck };

const PERMISSIONS = [
  { key: "billing", label: "Create bills" },
  { key: "discount", label: "Apply discounts" },
  { key: "stock", label: "Edit stock" },
  { key: "reports", label: "View reports" },
  { key: "employees", label: "Manage employees" },
  { key: "settings", label: "Change settings" },
];

const ROLE_PERMISSIONS = {
  Salesman: { billing: true, discount: false, stock: false, reports: false, employees: false, settings: false },
  Manager: { billing: true, discount: true, stock: true, reports: true, employees: false, settings: false },
  Owner: { billing: true, discount: true, stock: true, reports: true, employees: true, settings: true },
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
function StatCard({ icon, label, value, accent }) {
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
          <AnimatedNumber value={value} />
        </div>
      </Glass>
    </Reveal>
  );
}

/* ---------- Role badge ---------- */
function RoleBadge({ role }) {
  const accent = ROLE_ACCENT[role];
  const Icon = ROLE_ICON[role];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, padding: "4px 10px", borderRadius: 999, color: accent, background: `${accent}1a`, border: `1px solid ${accent}40`, fontFamily: F_BODY, whiteSpace: "nowrap" }}>
      <Icon size={11} /> {role}
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

let idCounter = 100;
const nextId = () => ++idCounter;

const INITIAL_EMPLOYEES = [
  { id: 1, name: "Ravi Kumar", phone: "98765 43210", role: "Salesman", status: "online", lastActive: "Active now" },
  { id: 2, name: "Priya Singh", phone: "91234 56780", role: "Manager", status: "online", lastActive: "Active now" },
  { id: 3, name: "Amit Verma", phone: "99887 66554", role: "Salesman", status: "offline", lastActive: "2 hrs ago" },
  { id: 4, name: "Sneha Rao", phone: "90123 45678", role: "Salesman", status: "offline", lastActive: "Yesterday" },
  { id: 5, name: "Vikram Joshi", phone: "97654 32109", role: "Manager", status: "offline", lastActive: "3 hrs ago" },
  { id: 6, name: "Store Owner", phone: "98000 11223", role: "Owner", status: "online", lastActive: "Active now" },
];

function initials(name) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function Employees() {
  useFonts();
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 980px)");

  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", role: "Salesman", pin: "" });

  const stats = useMemo(() => {
    const total = employees.length;
    const online = employees.filter((e) => e.status === "online").length;
    const salesmen = employees.filter((e) => e.role === "Salesman").length;
    const managers = employees.filter((e) => e.role === "Manager").length;
    return { total, online, salesmen, managers };
  }, [employees]);

  const toggleStatus = (id) => {
    setEmployees((es) => es.map((e) => (e.id === id ? { ...e, status: e.status === "online" ? "offline" : "online", lastActive: e.status === "online" ? "Just now" : "Active now" } : e)));
  };

  const removeEmployee = (id) => {
    setEmployees((es) => es.filter((e) => e.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setEmployees((es) => [
      { id: nextId(), name: form.name.trim(), phone: form.phone.trim(), role: form.role, status: "offline", lastActive: "Never logged in" },
      ...es,
    ]);
    setForm({ name: "", phone: "", role: "Salesman", pin: "" });
    setFormOpen(false);
  };

  const section = { position: "relative", zIndex: 10, maxWidth: 1120, margin: "0 auto", padding: isMobile ? "0 18px" : "0 24px" };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", overflowX: "hidden", background: COL.bg, fontFamily: F_BODY }}>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        .emp-row:hover { background: rgba(246,241,231,0.03); }
        .emp-icon-btn {
          border: 1px solid rgba(246,241,231,0.14);
          background: transparent;
          color: ${COL.text};
          border-radius: 8px;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .emp-icon-btn:hover { background: rgba(246,241,231,0.08); transform: scale(1.06); }
        .role-pill {
          border: 1px solid rgba(246,241,231,0.14);
          background: transparent;
          color: ${COL.muted};
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-family: ${F_BODY};
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .role-pill.active {
          background: ${COL.gold};
          color: ${COL.bg};
          border-color: ${COL.gold};
        }
        .add-btn { transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease; }
        .add-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 24px rgba(201,151,78,0.35); }
        @keyframes statusPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,155,128,0.5); }
          50% { box-shadow: 0 0 0 4px rgba(124,155,128,0); }
        }
      `}</style>

      <ParticleField />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", filter: "blur(140px)", background: `radial-gradient(circle, ${COL.teal}18, transparent 70%)`, left: "-100px", top: 40 }} />
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", filter: "blur(130px)", background: `radial-gradient(circle, ${COL.gold}1c, transparent 70%)`, right: "-90px", top: 700 }} />
      </div>

      <Navbar />

      <section style={{ ...section, paddingTop: isMobile ? 110 : 140, paddingBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 32 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, fontSize: 12, marginBottom: 14, background: `${COL.teal}1a`, border: `1px solid ${COL.teal}4d`, color: COL.teal }}>
              <Sparkles size={12} /> Employees
            </div>
            <h1 style={{ fontSize: isMobile ? 26 : 34, lineHeight: 1.2, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
              Every login, its own permissions.
            </h1>
          </div>
          <button className="add-btn" onClick={() => setFormOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 999, fontSize: 13.5, fontWeight: 500, background: COL.gold, color: COL.bg, border: "none", cursor: "pointer", fontFamily: F_BODY }}>
            {formOpen ? <X size={16} /> : <UserPlus size={16} />}
            {formOpen ? "Close" : "Add employee"}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: 20, marginBottom: 28 }}>
          <StatCard icon={<Users size={16} color={COL.text} />} label="Total staff" value={stats.total} accent={COL.sage} />
          <StatCard icon={<Circle size={16} color={COL.sage} fill={COL.sage} />} label="Online now" value={stats.online} accent={COL.sage} />
          <StatCard icon={<Receipt size={16} color={COL.teal} />} label="Salesmen" value={stats.salesmen} accent={COL.teal} />
          <StatCard icon={<Boxes size={16} color={COL.gold} />} label="Managers" value={stats.managers} accent={COL.gold} />
        </div>

        {/* Add employee form */}
        {formOpen && (
          <Reveal>
            <Glass style={{ padding: isMobile ? "22px 18px" : "28px 30px", marginBottom: 28 }}>
              <h3 style={{ fontSize: 16, marginBottom: 20, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Add a new employee</h3>
              <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 16, marginBottom: 20 }}>
                <Field label="Full name">
                  <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ravi Kumar" required />
                </Field>
                <Field label="Phone number">
                  <input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 98765 43210" required />
                </Field>
                <Field label="Login PIN (4-digit)">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <KeyRound size={14} color={COL.muted} />
                    <input style={{ ...inputStyle, flex: 1 }} maxLength={4} value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })} placeholder="e.g. 4821" />
                  </div>
                </Field>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12.5, color: COL.muted, fontFamily: F_BODY }}>Role</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    {ROLES.map((r) => (
                      <button key={r} type="button" className={`role-pill${form.role === r ? " active" : ""}`} onClick={() => setForm({ ...form, role: r })}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: COL.muted, fontFamily: F_BODY }}>This role will get:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {PERMISSIONS.filter((p) => ROLE_PERMISSIONS[form.role][p.key]).map((p) => (
                    <span key={p.key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, padding: "5px 10px", borderRadius: 999, color: ROLE_ACCENT[form.role], background: `${ROLE_ACCENT[form.role]}1a`, fontFamily: F_BODY }}>
                      <Check size={11} /> {p.label}
                    </span>
                  ))}
                </div>
              </div>

              <button onClick={handleSubmit} style={{ padding: "11px 22px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, background: COL.gold, color: COL.bg, border: "none", cursor: "pointer", fontFamily: F_BODY, display: "flex", alignItems: "center", gap: 8 }}>
                <UserPlus size={15} /> Save employee
              </button>
            </Glass>
          </Reveal>
        )}

        {/* Employee list */}
        <Reveal>
          <Glass style={{ padding: isMobile ? "10px 12px" : "10px 20px", marginBottom: 28 }}>
            {!isMobile && (
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1fr 1fr", gap: 12, padding: "14px 10px", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", color: COL.muted, borderBottom: "1px solid rgba(246,241,231,0.08)" }}>
                <span>Employee</span>
                <span>Phone</span>
                <span>Role</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
            )}
            {employees.map((emp) =>
              isMobile ? (
                <div key={emp.id} className="emp-row" style={{ padding: "16px 10px", borderBottom: "1px solid rgba(246,241,231,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `${ROLE_ACCENT[emp.role]}22`, color: ROLE_ACCENT[emp.role], fontFamily: F_MONO, fontSize: 12.5, flexShrink: 0 }}>
                      {initials(emp.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: COL.text, fontFamily: F_BODY }}>{emp.name}</div>
                      <div style={{ fontSize: 11.5, color: COL.muted, fontFamily: F_BODY, display: "flex", alignItems: "center", gap: 5 }}>
                        <Phone size={10} /> {emp.phone}
                      </div>
                    </div>
                    <RoleBadge role={emp.role} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => toggleStatus(emp.id)} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                      <Circle size={9} color={emp.status === "online" ? COL.sage : COL.muted} fill={emp.status === "online" ? COL.sage : "transparent"} style={emp.status === "online" ? { animation: "statusPulse 2s infinite" } : {}} />
                      <span style={{ fontSize: 12, color: COL.muted, fontFamily: F_BODY }}>{emp.lastActive}</span>
                    </button>
                    {emp.role !== "Owner" && (
                      <button className="emp-icon-btn" onClick={() => removeEmployee(emp.id)} aria-label="Remove"><X size={13} /></button>
                    )}
                  </div>
                </div>
              ) : (
                <div key={emp.id} className="emp-row" style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1fr 1fr", gap: 12, alignItems: "center", padding: "14px 10px", borderBottom: "1px solid rgba(246,241,231,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `${ROLE_ACCENT[emp.role]}22`, color: ROLE_ACCENT[emp.role], fontFamily: F_MONO, fontSize: 12, flexShrink: 0 }}>
                      {initials(emp.name)}
                    </div>
                    <span style={{ fontSize: 13.5, color: COL.text, fontFamily: F_BODY }}>{emp.name}</span>
                  </div>
                  <span style={{ fontSize: 12.5, color: COL.muted, fontFamily: F_BODY, display: "flex", alignItems: "center", gap: 6 }}>
                    <Phone size={11} /> {emp.phone}
                  </span>
                  <RoleBadge role={emp.role} />
                  <button onClick={() => toggleStatus(emp.id)} style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                    <Circle size={9} color={emp.status === "online" ? COL.sage : COL.muted} fill={emp.status === "online" ? COL.sage : "transparent"} style={emp.status === "online" ? { animation: "statusPulse 2s infinite" } : {}} />
                    <span style={{ fontSize: 12, color: COL.muted, fontFamily: F_BODY }}>{emp.lastActive}</span>
                  </button>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="emp-icon-btn" aria-label="More"><MoreHorizontal size={14} /></button>
                    {emp.role !== "Owner" && (
                      <button className="emp-icon-btn" onClick={() => removeEmployee(emp.id)} aria-label="Remove"><X size={14} /></button>
                    )}
                  </div>
                </div>
              )
            )}
          </Glass>
        </Reveal>

        {/* Permission matrix */}
        <Reveal>
          <Glass style={{ padding: isMobile ? "22px 16px" : "26px 26px", marginBottom: 60 }}>
            <h3 style={{ fontSize: 16, marginBottom: 20, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Permission matrix</h3>
            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: isMobile ? 480 : "auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.6fr repeat(3,1fr)", gap: 8, marginBottom: 8 }}>
                  <span />
                  {ROLES.map((r) => (
                    <div key={r} style={{ display: "flex", justifyContent: "center" }}>
                      <RoleBadge role={r} />
                    </div>
                  ))}
                </div>
                {PERMISSIONS.map((p) => (
                  <div key={p.key} style={{ display: "grid", gridTemplateColumns: "1.6fr repeat(3,1fr)", gap: 8, padding: "12px 0", borderTop: "1px solid rgba(246,241,231,0.06)", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: COL.text, fontFamily: F_BODY }}>{p.label}</span>
                    {ROLES.map((r) => (
                      <div key={r} style={{ display: "flex", justifyContent: "center" }}>
                        {ROLE_PERMISSIONS[r][p.key] ? (
                          <Check size={16} color={COL.sage} />
                        ) : (
                          <X size={14} color={COL.muted} style={{ opacity: 0.4 }} />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
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