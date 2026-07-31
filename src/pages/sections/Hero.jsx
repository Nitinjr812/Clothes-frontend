import { HiOutlineArrowRight, HiOutlinePlayCircle } from "react-icons/hi2";

// The signature element: a garment swing-tag rendered as a live stat card.
// It stands in for the generic "dashboard screenshot" hero and is drawn
// straight from the subject — every item in a fashion showroom carries
// a tag just like this one.
function SwingTag() {
  const bars = [3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1];

  return (
    <div className="motion-safe:animate-swing origin-top flex flex-col items-center">
      <svg className="w-10 h-[60px]" viewBox="0 0 40 90" aria-hidden="true">
        <path
          d="M20 0 C 6 20, 34 40, 20 90"
          stroke="rgba(243,241,234,0.25)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
      <div className="relative w-[250px] p-6 pb-5.5 bg-linear-to-br from-surface-raised to-surface border border-gold-border rounded-2xl shadow-[0_30px_80px_-25px_rgba(0,0,0,0.7)] flex flex-col gap-1.5">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-void border border-gold-border" />
        <span className="font-mono text-[0.7rem] tracking-wider uppercase text-muted">
          Today&rsquo;s sale · Live
        </span>
        <span className="font-display text-[2.1rem] font-medium text-ink my-0.5">₹48,260</span>
        <span className="font-mono text-[0.78rem] text-emerald">▲ 18% vs yesterday</span>
        <div className="flex items-end gap-0.5 h-7 my-3.5">
          {bars.map((w, i) => (
            <span key={i} className="block h-full bg-faint opacity-70" style={{ width: `${w}px` }} />
          ))}
        </div>
        <span className="font-mono text-[0.66rem] tracking-wide text-faint">
          SKU · RS-BOUTIQUE-2091
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="pt-16 pb-14 sm:pt-22 sm:pb-18 bg-void relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 82% 8%, rgba(201,167,106,0.09), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-[1240px] mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] items-center gap-10 md:gap-12">
        <div data-aos="fade-up">
          <span className="inline-block font-mono text-xs tracking-[0.14em] uppercase text-gold mb-3.5">
            Retail OS for fashion &amp; jewellery showrooms
          </span>
          <h1 className="font-display font-medium text-[2.1rem] sm:text-[2.8rem] lg:text-[3.4rem] leading-[1.14] text-ink mb-5">
            Every hanger, every ledger, every rupee — <em className="text-gold italic">tailored to fit.</em>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted max-w-[500px] mb-8">
            RetailSphere brings billing, inventory, staff, and fraud intelligence onto one
            showroom-grade dashboard — built for boutiques that measure success down to the
            last thread.
          </p>
          <div className="flex items-center gap-3.5 flex-wrap mb-6">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 text-sm font-medium text-void bg-linear-to-b from-gold-bright to-gold py-3.5 px-6 rounded-full shadow-[0_10px_30px_-10px_rgba(201,167,106,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-10px_rgba(201,167,106,0.7)]"
            >
              Book a demo <HiOutlineArrowRight />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink border border-hairline-strong bg-white/2 py-3.5 px-6 rounded-full transition-colors duration-200 hover:bg-surface-hover"
            >
              <HiOutlinePlayCircle /> See how it works
            </a>
          </div>
          <p className="text-sm text-faint">
            Trusted by 200+ clothing &amp; jewellery showrooms across India
          </p>
        </div>

        <div className="flex justify-center md:order-2 -order-1" data-aos="zoom-in" data-aos-delay="150">
          <SwingTag />
        </div>
      </div>
    </section>
  );
}