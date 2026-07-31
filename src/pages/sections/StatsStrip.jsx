const STATS = [
  { value: "₹120Cr+", label: "Processed annually" },
  { value: "200+", label: "Showrooms live" },
  { value: "99.95%", label: "Platform uptime" },
  { value: "38 sec", label: "Avg. checkout time" },
];

export default function StatsStrip() {
  return (
    <section className="border-y border-hairline py-8">
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-y-6 divide-x divide-hairline">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center px-3">
            <span className="font-mono text-2xl text-ink">{stat.value}</span>
            <span className="text-sm text-muted">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}