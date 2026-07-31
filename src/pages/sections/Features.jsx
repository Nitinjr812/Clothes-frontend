import {
  HiOutlineShoppingBag,
  HiOutlineArchiveBox,
  HiOutlineChartBar,
  HiOutlineShieldExclamation,
  HiOutlineBuildingStorefront,
  HiOutlineSparkles,
} from "react-icons/hi2";

const FEATURES = [
  {
    icon: HiOutlineShoppingBag,
    title: "POS billing",
    text: "Ring up sales by size, colour, and style with GST and discounts applied instantly.",
  },
  {
    icon: HiOutlineArchiveBox,
    title: "Inventory intelligence",
    text: "Stock adjusts the moment a bill prints — no manual counts, no closing-time surprises.",
  },
  {
    icon: HiOutlineChartBar,
    title: "Owner analytics",
    text: "Revenue, margin, and footfall in one view, refreshed live from every till in the store.",
  },
  {
    icon: HiOutlineShieldExclamation,
    title: "Fraud detection",
    text: "Unusual discounts, cash mismatches, and stock edits are flagged before they add up.",
  },
  {
    icon: HiOutlineBuildingStorefront,
    title: "Multi-branch control",
    text: "Compare branches, staff, and stock side by side without leaving the dashboard.",
  },
  {
    icon: HiOutlineSparkles,
    title: "AI insights",
    text: "Demand forecasts and reorder suggestions, tuned to your best-selling colours and sizes.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="max-w-[620px] mb-12" data-aos="fade-up">
          <span className="inline-block font-mono text-xs tracking-[0.14em] uppercase text-gold mb-3.5">
            Platform
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-4xl leading-tight text-ink">
            One dashboard, the whole showroom floor.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              className="bg-surface border border-hairline rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-border hover:bg-surface-raised"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gold-soft text-gold mb-4.5">
                <f.icon size={22} />
              </span>
              <h3 className="font-display text-lg font-medium text-ink mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}