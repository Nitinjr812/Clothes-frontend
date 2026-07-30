import { useEffect, useRef, useState, useCallback } from "react";
import {
  Check, Sparkles, ChevronDown, Store, TrendingUp, Building2, Eye,
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
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 450 }) {
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

/* ---------- Billing toggle ---------- */
function BillingToggle({ yearly, onChange }) {
  return (
    <Glass style={{ display: "inline-flex", alignItems: "center", padding: 4, borderRadius: 999, gap: 2 }}>
      {["Monthly", "Yearly"].map((label, i) => {
        const isYearly = i === 1;
        const active = yearly === isYearly;
        return (
          <button
            key={label}
            onClick={() => onChange(isYearly)}
            style={{
              border: "none", cursor: "pointer", padding: "8px 18px", borderRadius: 999,
              fontSize: 13, fontFamily: F_BODY, fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
              transition: "background 0.25s ease, color 0.25s ease",
              background: active ? COL.gold : "transparent",
              color: active ? COL.bg : COL.muted,
            }}
          >
            {label}
            {isYearly && (
              <span style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 999, background: active ? "rgba(21,17,14,0.2)" : `${COL.sage}26`, color: active ? COL.bg : COL.sage }}>
                Save 20%
              </span>
            )}
          </button>
        );
      })}
    </Glass>
  );
}

/* ---------- Plan card ---------- */
function PlanCard({ plan, yearly, delay }) {
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
  return (
    <Reveal delay={delay}>
      <Glass
        style={{
          padding: "32px 28px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          border: plan.highlight ? `1px solid ${COL.gold}66` : "1px solid rgba(246,241,231,0.10)",
          boxShadow: plan.highlight
            ? "0 20px 60px rgba(201,151,78,0.18), inset 0 1px 0 rgba(246,241,231,0.08)"
            : "0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(246,241,231,0.08)",
        }}
      >
        {plan.highlight && (
          <span style={{ position: "absolute", top: -12, left: 28, fontSize: 11, padding: "5px 12px", borderRadius: 999, background: COL.gold, color: COL.bg, fontFamily: F_BODY, fontWeight: 600 }}>
            Most popular
          </span>
        )}
        <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, background: `${plan.accent}1c`, border: `1px solid ${plan.accent}40` }}>
          <plan.icon size={19} color={plan.accent} />
        </div>
        <h3 style={{ fontSize: 20, marginBottom: 6, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>{plan.name}</h3>
        <p style={{ fontSize: 13, color: COL.muted, marginBottom: 22, lineHeight: 1.5 }}>{plan.tagline}</p>

        <div style={{ marginBottom: 26 }}>
          {price !== null ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 32, fontFamily: F_MONO, color: COL.text, fontWeight: 500 }}>
                <AnimatedNumber value={price} prefix="₹" />
              </span>
              <span style={{ fontSize: 13, color: COL.muted }}>/ counter / mo</span>
            </div>
          ) : (
            <div style={{ fontSize: 28, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>Custom</div>
          )}
          {price !== null && yearly && (
            <span style={{ fontSize: 12, color: COL.sage, fontFamily: F_BODY }}>billed yearly</span>
          )}
        </div>

        <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1 }}>
          {plan.features.map((f, i) => (
            <li key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: COL.text, fontFamily: F_BODY }}>
              <Check size={15} color={plan.accent} style={{ flexShrink: 0, marginTop: 1 }} />
              {f}
            </li>
          ))}
        </ul>

        <button
          style={{
            width: "100%", padding: "13px 20px", borderRadius: 999, fontSize: 13.5, fontWeight: 500,
            fontFamily: F_BODY, border: plan.highlight ? "none" : "1px solid rgba(246,241,231,0.18)",
            background: plan.highlight ? COL.gold : "transparent",
            color: plan.highlight ? COL.bg : COL.text,
            cursor: "pointer",
          }}
        >
          {plan.cta}
        </button>
      </Glass>
    </Reveal>
  );
}

/* ---------- FAQ accordion ---------- */
function FaqItem({ q, a, open, onToggle }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(246,241,231,0.08)" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 4px", background: "transparent", border: "none", cursor: "pointer",
          color: COL.text, fontFamily: F_BODY, fontSize: 14.5, textAlign: "left",
        }}
      >
        {q}
        <ChevronDown size={17} color={COL.muted} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s ease", flexShrink: 0, marginLeft: 12 }} />
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <p style={{ fontSize: 13.5, color: COL.muted, lineHeight: 1.6, padding: "0 4px 18px" }}>{a}</p>
      </div>
    </div>
  );
}

const PLANS = [
  {
    name: "Starter", tagline: "For a single showroom finding its feet.",
    icon: Store, accent: COL.teal, monthlyPrice: 999, yearlyPrice: 799,
    features: ["Billing & GST invoices", "Inventory for up to 500 SKUs", "2 staff logins", "Owner dashboard", "Email support"],
    cta: "Start free trial",
  },
  {
    name: "Growth", tagline: "For stores adding counters and staff.",
    icon: TrendingUp, accent: COL.gold, monthlyPrice: 2499, yearlyPrice: 1999, highlight: true,
    features: ["Everything in Starter", "Fraud detection & alerts", "Unlimited SKUs", "Up to 10 staff logins", "Owner's phone dashboard", "Priority support"],
    cta: "Start free trial",
  },
  {
    name: "Enterprise", tagline: "For multi-branch chains at scale.",
    icon: Building2, accent: COL.sage, monthlyPrice: null, yearlyPrice: null,
    features: ["Everything in Growth", "Multi-branch dashboard", "AI insights & forecasting", "Dedicated account manager", "Custom integrations"],
    cta: "Talk to sales",
  },
];

const FAQS = [
  { q: "Kya mujhe naya hardware kharidna padega?", a: "Nahi zaroori nahi — Sentinel aapke existing barcode scanner aur thermal printer ke saath kaam karta hai. Naya hardware chahiye to hum recommend kar dete hain." },
  { q: "Kya main plan baad mein switch kar sakta hoon?", a: "Haan, kabhi bhi upgrade ya downgrade kar sakte hain — billing agle cycle se adjust ho jaati hai, koi lock-in nahi hai." },
  { q: "GST billing included hai kya?", a: "Haan, saare plans mein GST-compliant invoice generation (PDF/WhatsApp/SMS) shamil hai." },
  { q: "Free trial available hai?", a: "Haan — bina card diye 14-din ka free trial milta hai, poore feature set ke saath." },
  { q: "Mera data kitna secure hai?", a: "Data encrypted rehta hai aur regularly backup hota hai; owner ke alawa access role-permissions se control hota hai." },
];

export default function Pricing() {
  useFonts();
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 980px)");
  const cols = isMobile ? 1 : isTablet ? 2 : 3;
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const section = { position: "relative", zIndex: 10, maxWidth: 1120, margin: "0 auto", padding: isMobile ? "0 18px" : "0 24px" };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", overflowX: "hidden", background: COL.bg, fontFamily: F_BODY }}>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <ParticleField />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", filter: "blur(140px)", background: `radial-gradient(circle, ${COL.gold}1c, transparent 70%)`, left: "-100px", top: 40 }} />
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", filter: "blur(130px)", background: `radial-gradient(circle, ${COL.sage}16, transparent 70%)`, right: "-90px", top: 700 }} />
      </div>

      <Navbar />

      <section style={{ ...section, paddingTop: isMobile ? 120 : 150, paddingBottom: 40, textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, fontSize: 12, marginBottom: 20, background: `${COL.gold}1a`, border: `1px solid ${COL.gold}4d`, color: COL.gold }}>
            <Sparkles size={12} /> Pricing
          </div>
          <h1 style={{ fontSize: isMobile ? 30 : 44, lineHeight: 1.15, marginBottom: 16, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
            Simple pricing, <span style={{ fontStyle: "italic", color: COL.gold }}>per counter.</span>
          </h1>
          <p style={{ fontSize: isMobile ? 14.5 : 16, color: COL.muted, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
            No setup fees, no surprises. Pick a plan that matches how many counters you're running today.
          </p>
          <BillingToggle yearly={yearly} onChange={setYearly} />
        </Reveal>
      </section>

      <section style={{ ...section, marginBottom: isMobile ? 60 : 100 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 24 }}>
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} yearly={yearly} delay={i * 90} />
          ))}
        </div>
      </section>

      <section style={{ ...section, marginBottom: isMobile ? 60 : 100, maxWidth: 720 }}>
        <Reveal>
          <h2 style={{ fontSize: isMobile ? 22 : 28, marginBottom: 24, textAlign: "center", fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
            Frequently asked
          </h2>
          <Glass style={{ padding: isMobile ? "6px 18px" : "6px 28px" }}>
            {FAQS.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </Glass>
        </Reveal>
      </section>

      <section style={{ ...section, marginBottom: isMobile ? 64 : 96 }}>
        <Reveal>
          <Glass style={{ padding: isMobile ? "44px 24px" : "64px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.35, background: `radial-gradient(circle at 50% 0%, ${COL.gold}26, transparent 60%)` }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: isMobile ? 24 : 34, marginBottom: 16, lineHeight: 1.25, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
                Still deciding? Talk to us.
              </h2>
              <p style={{ fontSize: 15, marginBottom: 32, color: COL.muted }}>
                We'll help you pick the right plan for your store size in a 15-minute call.
              </p>
              <button style={{ padding: "14px 24px", borderRadius: 999, fontSize: 14.5, fontWeight: 500, background: COL.gold, color: COL.bg, border: "none", cursor: "pointer", fontFamily: F_BODY }}>
                Book a free walkthrough
              </button>
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