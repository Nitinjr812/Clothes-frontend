const STEPS = [
  {
    n: "01",
    title: "Ring up the sale",
    text: "Your staff bills a customer as usual — size, colour, discount, and GST calculated on the spot.",
  },
  {
    n: "02",
    title: "Stock updates itself",
    text: "The moment the bill prints, inventory is deducted. No end-of-day counting, no reconciling.",
  },
  {
    n: "03",
    title: "You see it live",
    text: "Revenue, margins, and alerts land on your dashboard the same second — wherever you are.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="pb-20 sm:pb-24">
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="max-w-[620px] mb-12" data-aos="fade-up">
          <span className="inline-block font-mono text-xs tracking-[0.14em] uppercase text-gold mb-3.5">
            How it works
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-4xl leading-tight text-ink">
            From the till to your pocket, in real time.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="pt-5 border-t border-hairline-strong"
            >
              <span className="font-mono text-sm text-gold block mb-3.5">{step.n}</span>
              <h3 className="font-display text-xl font-medium text-ink mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}