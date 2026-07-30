import { useEffect, useRef, useState, useCallback } from "react";
import {
  ShieldCheck, BarChart3, Boxes, Users, ScanBarcode, Sparkles,
  AlertTriangle, IndianRupee, Smartphone, Receipt,
  Camera, Building2, Calculator, ChevronRight,
  Lock, Eye, PackageX
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

/* ---------- fonts ---------- */
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
      { threshold: 0.15 }
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
        transform: visible ? "translateY(0)" : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.8s cubic-bezier(.22,1,.36,1) ${delay}ms, opacity 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

function CountUp({ to, suffix = "", duration = 1400 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const start = performance.now();
          const step = (now) => {
            const prog = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - prog, 3);
            setVal(Math.round(to * eased));
            if (prog < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration, started]);
  return (
    <span ref={ref}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ---------- Interactive particle constellation canvas ---------- */
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
      const count = Math.min(70, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        c: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      const { x: mx, y: my } = mouseRef.current;

      for (const p of particles) {
        // gentle drift
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // subtle attraction toward cursor
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          p.x += dx * 0.0018;
          p.y += dy * 0.0018;
        }
      }

      // connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(201,151,78,${0.12 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // line to cursor for near particles
        const dx = particles[i].x - mx, dy = particles[i].y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 200) {
          ctx.strokeStyle = `rgba(246,241,231,${0.18 * (1 - d / 200)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.55;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(step);
    };

    init();
    window.addEventListener("resize", init);
    if (!reducedMotion) {
      raf = requestAnimationFrame(step);
    } else {
      step(); // draw once, static
    }
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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.9 }}
    />
  );
}

/* ---------- Glass ---------- */
function Glass({ children, style = {}, float = false }) {
  return (
    <div
      className={float ? "sentinel-float" : ""}
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

function FloatCard({ icon, label, value, sub, accent, style, delay = 0 }) {
  return (
    <div className="sentinel-float" style={{ position: "absolute", animationDelay: `${delay}ms`, ...style }}>
      <Glass style={{ padding: "14px 16px", width: 190 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${accent}22` }}>{icon}</div>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: COL.muted, fontFamily: F_BODY }}>{label}</span>
        </div>
        <div style={{ fontSize: 19, lineHeight: 1, fontFamily: F_MONO, color: COL.text, fontWeight: 500 }}>{value}</div>
        {sub && <div style={{ fontSize: 11, marginTop: 4, color: accent, fontFamily: F_BODY }}>{sub}</div>}
      </Glass>
    </div>
  );
}

function FeatureCard({ icon, title, points, accent, span, cols = 3 }) {
  const effectiveSpan = span ? Math.min(2, cols) : 1;
  return (
    <Reveal>
      <Glass style={{ padding: 24, gridColumn: `span ${effectiveSpan}`, height: "100%" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, background: `${accent}1c`, border: `1px solid ${accent}40` }}>{icon}</div>
        <h3 style={{ fontSize: 18, marginBottom: 8, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>{title}</h3>
        <ul style={{ display: "flex", flexDirection: "column", gap: 6, listStyle: "none", padding: 0, margin: 0 }}>
          {points.map((pt, i) => (
            <li key={i} style={{ fontSize: 13.5, display: "flex", gap: 8, color: COL.muted, fontFamily: F_BODY }}>
              <span style={{ marginTop: 7, width: 4, height: 4, borderRadius: "50%", flexShrink: 0, background: accent }} />
              {pt}
            </li>
          ))}
        </ul>
      </Glass>
    </Reveal>
  );
}

export default function Home() {
  useFonts();
  const scrollY = useScrollY();
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 980px)");
  const cols = isMobile ? 1 : isTablet ? 2 : 3;
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const p = reducedMotion ? 0 : 1;

  const section = { position: "relative", zIndex: 10, maxWidth: 1120, margin: "0 auto", padding: isMobile ? "0 18px" : "0 24px" };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", overflowX: "hidden", background: COL.bg, fontFamily: F_BODY }}>
      <style>{`
        @keyframes sentinelFloat {
          0%, 100% { transform: translateY(0px) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-14px) rotate(var(--r, 0deg)); }
        }
        .sentinel-float { animation: sentinelFloat 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sentinel-float { animation: none; }
        }
      `}</style>

      <ParticleField />

      {/* warm ambient glow layer beneath particles */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 640, height: 640, borderRadius: "50%", filter: "blur(140px)", background: `radial-gradient(circle, ${COL.gold}22, transparent 70%)`, left: "-120px", top: 60 - scrollY * 0.1 * p }} />
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", filter: "blur(130px)", background: `radial-gradient(circle, ${COL.wine}1c, transparent 70%)`, right: "-100px", top: 900 - scrollY * 0.18 * p }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: `radial-gradient(${COL.text} 0.6px, transparent 0.6px)`, backgroundSize: "26px 26px" }} />
      </div>

      <Navbar />

      {/* Hero */}
      <section style={{ ...section, paddingTop: isMobile ? 120 : 160, paddingBottom: isMobile ? 100 : 220 }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, fontSize: 12.5, marginBottom: 24, background: `${COL.gold}1a`, border: `1px solid ${COL.gold}4d`, color: COL.gold }}>
            <Sparkles size={13} /> Built for Indian retail & showrooms
          </div>
          <h1 style={{ fontSize: isMobile ? 34 : 50, lineHeight: 1.12, letterSpacing: "-0.01em", marginBottom: 24, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
            Every counter,
            <br />
            <span style={{ fontStyle: "italic", color: COL.gold }}>watched over.</span>
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 16.5, lineHeight: 1.6, marginBottom: 36, color: COL.muted, maxWidth: 480 }}>
            Sales, stock, staff and fraud — tracked live, from the counter to the owner's
            phone. Every bill, every discount, every return, timestamped and traceable.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
            <button style={{ padding: "13px 22px", borderRadius: 999, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, background: COL.gold, color: COL.bg, border: "none", cursor: "pointer", fontFamily: F_BODY }}>
              Get a free walkthrough <ChevronRight size={16} />
            </button>
            <button style={{ padding: "13px 22px", borderRadius: 999, fontSize: 14, fontWeight: 500, border: "1px solid rgba(246,241,231,0.18)", color: COL.text, background: "transparent", cursor: "pointer", fontFamily: F_BODY }}>
              See it on your phone
            </button>
          </div>
        </div>

        {!isTablet && (
          <div>
            <FloatCard icon={<IndianRupee size={13} color={COL.sage} />} label="Aaj ki sale" value="₹84,230" sub="↑ 12% from yesterday" accent={COL.sage}
              style={{ top: 30, right: 60, ["--r"]: "-3deg" }} delay={0} />
            <FloatCard icon={<AlertTriangle size={13} color={COL.wine} />} label="Fraud alert" value="Cash ₹500 short" sub="Counter 2 · 4:12 PM" accent={COL.wine}
              style={{ top: 190, right: 300, ["--r"]: "2deg" }} delay={900} />
            <FloatCard icon={<PackageX size={13} color={COL.gold} />} label="Low stock" value="Denim XL · 3 left" accent={COL.gold}
              style={{ top: 340, right: 40, ["--r"]: "3deg" }} delay={1500} />
          </div>
        )}
      </section>

      {/* Stats */}
      <section style={{ ...section, marginTop: isMobile ? -60 : -140, marginBottom: isMobile ? 80 : 130 }}>
        <Reveal>
          <Glass style={{ padding: "0 8px" }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)` }}>
              {[
                { to: 47, suffix: "L+", label: "Stock value tracked" },
                { to: 320, suffix: "+", label: "Stores onboarded" },
                { to: 99.2, suffix: "%", label: "Billing uptime" },
                { to: 6, suffix: "sec", label: "Avg. bill time" },
              ].map((s, i) => (
                <div key={i} style={{ padding: isMobile ? "20px 12px" : "32px 20px", textAlign: "center", borderLeft: (i === 0 || (isMobile && i === 2)) ? "none" : "1px solid rgba(246,241,231,0.1)", borderTop: isMobile && i >= 2 ? "1px solid rgba(246,241,231,0.1)" : "none" }}>
                  <div style={{ fontSize: isMobile ? 22 : 28, fontFamily: F_MONO, color: COL.text, fontWeight: 500 }}>
                    <CountUp to={s.to} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4, color: COL.muted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Glass>
        </Reveal>
      </section>

      {/* Feature bento */}
      <section style={{ ...section, marginBottom: isMobile ? 80 : 130 }}>
        <Reveal>
          <div style={{ maxWidth: 560, marginBottom: isMobile ? 36 : 56 }}>
            <span style={{ fontSize: 12.5, textTransform: "uppercase", letterSpacing: "0.08em", color: COL.gold }}>Everything, connected</span>
            <h2 style={{ fontSize: isMobile ? 26 : 34, marginTop: 12, lineHeight: 1.25, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
              One system replaces six registers of paperwork.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 20 }}>
          <FeatureCard span cols={cols} accent={COL.gold} icon={<BarChart3 size={20} color={COL.gold} />} title="Owner dashboard"
            points={["Today's sales, split by cash / UPI / card", "Profit report, best & slow-moving products", "Low stock alerts before you run out", "Daily, weekly and monthly reports, auto-generated"]} />
          <FeatureCard cols={cols} accent={COL.sage} icon={<ScanBarcode size={20} color={COL.sage} />} title="Inventory"
            points={["Barcode scan to add stock", "Size, colour, brand, category tracked", "Stock drops automatically on every sale"]} />
          <FeatureCard cols={cols} accent={COL.wine} icon={<ShieldCheck size={20} color={COL.wine} />} title="Fraud-proof staff"
            points={["Separate login for every employee", "Every discount, return & edit is logged", "Instant alert on unusual activity"]} />
          <FeatureCard cols={cols} accent={COL.teal} icon={<Lock size={20} color={COL.teal} />} title="Role permissions"
            points={["Salesman: billing only", "Manager: stock & pricing", "Owner: everything, everywhere"]} />
          <FeatureCard span cols={cols} accent={COL.sage} icon={<Smartphone size={20} color={COL.sage} />} title="Owner's phone dashboard"
            points={["Live sales, orders & stock from anywhere", "See which staff is online right now", "Cash collected, updated in real time"]} />
          <FeatureCard span cols={cols} accent={COL.gold} icon={<Receipt size={20} color={COL.gold} />} title="Billing, sorted"
            points={["GST bills via thermal printer or barcode scan", "Invoice as PDF, WhatsApp or SMS, instantly"]} />
          <FeatureCard cols={cols} accent={COL.teal} icon={<Users size={20} color={COL.teal} />} title="Customers"
            points={["Purchase history & birthday reminders", "Loyalty points & repeat-customer discounts"]} />
        </div>
      </section>

      {/* Fraud radar */}
      <section style={{ ...section, marginBottom: isMobile ? 80 : 130 }}>
        <Reveal>
          <Glass style={{ padding: isMobile ? "32px 22px" : "48px 40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 1, opacity: 0.7, top: (scrollY * 0.3 * p) % 400, background: `linear-gradient(90deg,transparent,${COL.wine},transparent)` }} />
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 28 : 40, alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, fontSize: 12, marginBottom: 20, background: `${COL.wine}1a`, color: COL.wine, border: `1px solid ${COL.wine}4d` }}>
                  <Eye size={12} /> Fraud detection
                </div>
                <h2 style={{ fontSize: isMobile ? 24 : 30, marginBottom: 16, lineHeight: 1.25, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
                  Nothing leaves the counter unnoticed.
                </h2>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: COL.muted }}>
                  Excess discounts, cancelled bills, repeated returns, cash mismatches or
                  stock walking out without a bill — the owner gets a phone notification
                  the moment it happens, with a link to the CCTV timestamp of that exact sale.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: <IndianRupee size={14} />, text: "Cash mismatch of ₹500 at Counter 2", time: "2 min ago" },
                  { icon: <Receipt size={14} />, text: "Bill #4482 cancelled after printing", time: "18 min ago" },
                  { icon: <Camera size={14} />, text: "CCTV clip linked to Bill #4479", time: "1 hr ago" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: `${COL.wine}0f`, border: `1px solid ${COL.wine}26` }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${COL.wine}26`, color: COL.wine }}>{a.icon}</div>
                    <span style={{ fontSize: 13.5, flex: 1, color: COL.text }}>{a.text}</span>
                    <span style={{ fontSize: 11.5, color: COL.muted, fontFamily: F_MONO }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </Glass>
        </Reveal>
      </section>

      {/* Growth strip */}
      <section style={{ ...section, marginBottom: isMobile ? 80 : 130 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 20 }}>
          <FeatureCard cols={cols} accent={COL.gold} icon={<Sparkles size={20} color={COL.gold} />} title="AI insights"
            points={["Which colour & size is really selling", "Best-performing staff, ranked automatically", "Which stock will run out first"]} />
          <FeatureCard cols={cols} accent={COL.teal} icon={<Building2 size={20} color={COL.teal} />} title="Multi-branch"
            points={["10 showrooms, one dashboard", "Compare branch performance side by side"]} />
          <FeatureCard cols={cols} accent={COL.sage} icon={<Calculator size={20} color={COL.sage} />} title="Accounting"
            points={["Daily cash, expenses, salary & rent", "GST reports, ready to file"]} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...section, marginBottom: isMobile ? 64 : 96 }}>
        <Reveal>
          <Glass style={{ padding: isMobile ? "44px 24px" : "64px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.35, background: `radial-gradient(circle at 50% 0%, ${COL.gold}26, transparent 60%)` }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: isMobile ? 24 : 34, marginBottom: 16, lineHeight: 1.25, fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600 }}>
                Stop finding out about losses next month.
              </h2>
              <p style={{ fontSize: 15, marginBottom: 32, color: COL.muted }}>
                Set up your first counter in under a day. No card required.
              </p>
              <button style={{ padding: "14px 24px", borderRadius: 999, fontSize: 14.5, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8, background: COL.gold, color: COL.bg, border: "none", cursor: "pointer", fontFamily: F_BODY }}>
                Book a free walkthrough <ChevronRight size={16} />
              </button>
            </div>
          </Glass>
        </Reveal>
      </section>

      {/* Footer */}
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