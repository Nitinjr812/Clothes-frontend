import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Eye, Menu, X, LayoutDashboard, Boxes, ShieldCheck, Tag, Users, ChevronRight } from "lucide-react";
import useMediaQuery from "../hooks/useMediaQuery.js";

const COL = {
  bg: "#15110E",
  text: "#F6F1E7",
  muted: "#A79C8E",
  gold: "#C9974E",
  wine: "#9C4E52",
};
const F_DISPLAY = "'Fraunces',serif";
const F_BODY = "'Inter',sans-serif";

// `to: null` means the page isn't built yet — rendered as a non-navigating label.
const LINKS = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Inventory", icon: Boxes, to: "/inventory" },
  { label: "Employees", icon: Users, to: "/employees" },
  { label: "Fraud Shield", icon: ShieldCheck, to: "/fraud-shield" },
  { label: "Pricing", icon: Tag, to: "/pricing" },
];

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

function Logo({ size = 30, textSize = 19 }) {
  return (
    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <div
        className="sentinel-logo-badge"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle at 30% 30%, ${COL.gold}, #8a6431)`,
          transition: "transform 0.4s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <Eye size={size * 0.5} color={COL.bg} strokeWidth={2.2} />
      </div>
      <span style={{ fontFamily: F_DISPLAY, color: COL.text, fontWeight: 600, fontSize: textSize, letterSpacing: "0.01em" }}>
        Sentinel
      </span>
    </Link>
  );
}

export default function Navbar() {
  const isMobile = useMediaQuery("(max-width: 860px)");
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          color: ${COL.muted};
          cursor: pointer;
          transition: color 0.25s ease;
          padding-bottom: 4px;
          text-decoration: none;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0%;
          height: 1.5px;
          background: ${COL.gold};
          transition: width 0.3s cubic-bezier(.22,1,.36,1);
        }
        .nav-link:hover {
          color: ${COL.text};
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link.active {
          color: ${COL.gold};
        }
        .nav-link.active::after {
          width: 100%;
        }
        .nav-cta {
          transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease, background 0.25s ease;
        }
        .nav-cta:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 10px 24px rgba(201,151,78,0.35);
        }
        .nav-cta:active {
          transform: translateY(0) scale(0.98);
        }
        .sentinel-logo-badge:hover {
          transform: rotate(-12deg) scale(1.08);
        }
        .nav-icon-btn {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .nav-icon-btn:hover {
          background: rgba(246,241,231,0.08);
          transform: scale(1.05);
        }
        .drawer-link {
          transition: background 0.2s ease, padding-left 0.2s ease, border-color 0.2s ease;
          text-decoration: none;
        }
        .drawer-link:hover {
          background: rgba(201,151,78,0.08);
          padding-left: 22px;
          border-color: rgba(201,151,78,0.35);
        }
        .drawer-link.active {
          background: rgba(201,151,78,0.1);
          border-color: rgba(201,151,78,0.35);
        }
        .drawer-cta {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .drawer-cta:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 24px rgba(201,151,78,0.35);
        }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* ---- Top bar ---- */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", padding: "16px 16px 0" }}>
        <Glass style={{ width: "100%", maxWidth: 1120, padding: isMobile ? "10px 16px" : "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size={isMobile ? 28 : 30} textSize={isMobile ? 18 : 19} />

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 30, fontSize: 13.5, fontFamily: F_BODY }}>
              {LINKS.map((l) =>
                l.to ? (
                  <Link
                    key={l.label}
                    to={l.to}
                    className={`nav-link${location.pathname === l.to ? " active" : ""}`}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <span key={l.label} className="nav-link" style={{ cursor: "default" }}>
                    {l.label}
                  </span>
                )
              )}
            </div>
          )}

          {!isMobile ? (
            <button
              className="nav-cta"
              style={{ fontSize: 13, padding: "9px 17px", borderRadius: 999, fontWeight: 500, background: COL.gold, color: COL.bg, fontFamily: F_BODY, border: "none", cursor: "pointer" }}
            >
              Book a demo
            </button>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="nav-icon-btn"
              aria-label="Open menu"
              style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(246,241,231,0.14)", background: "transparent", color: COL.text, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Menu size={19} />
            </button>
          )}
        </Glass>
      </div>

      {/* ---- Mobile sidebar drawer ---- */}
      {isMobile && open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 60,
              background: "rgba(0,0,0,0.55)",
              animation: "overlayFadeIn 0.3s ease",
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 70,
              width: "min(300px, 80vw)",
              animation: "drawerSlideIn 0.35s cubic-bezier(.22,1,.36,1)",
              padding: 14,
            }}
          >
            <Glass style={{ height: "100%", display: "flex", flexDirection: "column", padding: 22, borderRadius: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
                <Logo size={28} textSize={17} />
                <button
                  onClick={() => setOpen(false)}
                  className="nav-icon-btn"
                  aria-label="Close menu"
                  style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(246,241,231,0.14)", background: "transparent", color: COL.text, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <X size={17} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {LINKS.map((l) => {
                  const Icon = l.icon;
                  const isActive = l.to && location.pathname === l.to;
                  const content = (
                    <>
                      <Icon size={17} color={COL.gold} />
                      {l.label}
                    </>
                  );
                  const rowStyle = {
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 16px", borderRadius: 12,
                    border: "1px solid transparent",
                    color: COL.text, fontFamily: F_BODY, fontSize: 14.5, cursor: "pointer",
                  };
                  return l.to ? (
                    <Link
                      key={l.label}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={`drawer-link${isActive ? " active" : ""}`}
                      style={rowStyle}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={l.label} className="drawer-link" style={{ ...rowStyle, cursor: "default" }}>
                      {content}
                    </div>
                  );
                })}
              </div>

              <button
                className="drawer-cta"
                style={{
                  width: "100%", padding: "13px 20px", borderRadius: 999, fontSize: 14, fontWeight: 500,
                  background: COL.gold, color: COL.bg, fontFamily: F_BODY, border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16,
                }}
              >
                Book a demo <ChevronRight size={16} />
              </button>
            </Glass>
          </div>
        </>
      )}
    </>
  );
}