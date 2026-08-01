import { useEffect, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

// Public-facing marketing navbar. Not the in-app dashboard sidebar/topbar —
// this is what a visitor sees on retailsphere.com before signing in.
const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Keeps the drawer mounted (in the DOM) for the duration of the closing
  // animation, instead of relying purely on opacity/pointer-events, which
  // is what made the previous version feel like it "snapped" shut.
  const [menuMounted, setMenuMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true);
      return;
    }
    // Unmount after the exit transition finishes (matches duration-300 below)
    const t = setTimeout(() => setMenuMounted(false), 300);
    return () => clearTimeout(t);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-100 h-[76px] flex items-center backdrop-blur-xl backdrop-saturate-150 border-b transition-colors duration-300 ${
        scrolled
          ? "bg-void/90 border-hairline"
          : "bg-void/60 border-transparent"
      }`}
    >
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8 flex items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <svg className="w-[26px] h-[26px]" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M14 2 L24 8 V20 L14 26 L4 20 V8 Z" stroke="#c9a76a" strokeWidth="1.4" />
            <circle cx="14" cy="14" r="3.2" stroke="#c9a76a" strokeWidth="1.4" />
          </svg>
          <span className="font-display text-xl font-medium tracking-wide text-ink">
            Retail<em className="text-gold">Sphere</em>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 mx-auto" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm text-muted hover:text-ink transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1.5 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3.5 shrink-0">
          <a href="#login" className="text-sm text-ink py-2 px-1">
            Sign in
          </a>
          <a
            href="#demo"
            className="text-sm font-medium text-void bg-linear-to-b from-gold-bright to-gold py-2.5 px-5 rounded-full shadow-[0_8px_24px_-8px_rgba(201,167,106,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_rgba(201,167,106,0.65)] whitespace-nowrap"
          >
            Book a demo
          </a>
        </div>

        <button
          type="button"
          className="md:hidden relative inline-flex border border-hairline rounded-lg p-1.5 text-ink w-9 h-9 items-center justify-center"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <HiOutlineMenu
            size={22}
            className={`absolute transition-all duration-300 ${
              menuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <HiOutlineX
            size={22}
            className={`absolute transition-all duration-300 ${
              menuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
            }`}
          />
        </button>
      </div>

      {menuMounted && (
        <div
          className={`md:hidden absolute top-[76px] left-0 right-0 bg-surface border-b border-hairline px-5 pt-5 pb-6 transition-all duration-300 ease-out ${
            menuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col gap-1 mb-5" aria-label="Mobile">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-base text-ink py-3 px-1 border-b border-hairline transition-all duration-300 ease-out ${
                  menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div
            className={`flex flex-col gap-3 transition-all duration-300 ease-out ${
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: menuOpen ? `${NAV_LINKS.length * 40}ms` : "0ms" }}
          >
            <a
              href="#login"
              className="text-center py-3 rounded-xl border border-hairline-strong text-ink"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </a>
            <a
              href="#demo"
              className="text-center py-3 rounded-xl font-medium text-void bg-linear-to-b from-gold-bright to-gold"
              onClick={() => setMenuOpen(false)}
            >
              Book a demo
            </a>
          </div>
        </div>
      )}
    </header>
  );
}