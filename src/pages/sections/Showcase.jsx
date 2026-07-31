export default function Showcase() {
  const bars = [38, 52, 44, 66, 58, 74, 82];

  return (
    <section id="platform" className="pb-20 sm:pb-24">
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
        <div data-aos="fade-right">
          <span className="inline-block font-mono text-xs tracking-[0.14em] uppercase text-gold mb-3.5">
            Command centre
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-4xl leading-tight text-ink mb-4.5">
            Built to feel like a boutique, not a spreadsheet.
          </h2>
          <p className="text-base leading-relaxed text-muted max-w-[400px]">
            Every card, chart, and alert is designed for the way a showroom actually runs —
            calm enough for the sales floor, precise enough for the books.
          </p>
        </div>

        <div data-aos="fade-left" data-aos-delay="100">
          <div className="bg-surface border border-hairline rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="flex gap-1.5 px-4.5 py-3.5 border-b border-hairline">
              <span className="w-2.5 h-2.5 rounded-full bg-hairline-strong" />
              <span className="w-2.5 h-2.5 rounded-full bg-hairline-strong" />
              <span className="w-2.5 h-2.5 rounded-full bg-hairline-strong" />
            </div>
            <div className="p-6.5">
              <div className="grid grid-cols-3 gap-3.5 mb-6.5">
                <div className="bg-surface-raised border border-hairline rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-xs text-muted">Today's sales</span>
                  <span className="font-mono text-lg text-ink">₹48,260</span>
                </div>
                <div className="bg-surface-raised border border-hairline rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-xs text-muted">Net profit</span>
                  <span className="font-mono text-lg text-ink">₹16,940</span>
                </div>
                <div className="bg-surface-raised border border-hairline rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-xs text-muted">Low stock</span>
                  <span className="font-mono text-lg text-crimson">7</span>
                </div>
              </div>
              <div className="flex items-end gap-2 h-25 px-1">
                {bars.map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t bg-linear-to-b from-gold to-emerald opacity-85"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}