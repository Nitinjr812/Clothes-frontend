import { HiOutlineArrowRight } from "react-icons/hi2";

export default function CtaBanner() {
  return (
    <section id="pricing" className="py-20 sm:py-24">
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8">
        <div
          data-aos="fade-up"
          className="bg-linear-to-br from-surface-raised to-surface border border-gold-border rounded-2xl p-8 sm:p-12 flex flex-wrap items-center justify-between gap-8"
        >
          <div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl leading-tight text-ink max-w-[460px]">
              Ready to tailor your showroom&rsquo;s operations?
            </h2>
            <p className="text-muted mt-2.5 max-w-[420px]">
              Get a walkthrough with your own product catalogue and staff, no commitment.
            </p>
          </div>
          <div className="flex gap-3.5 flex-wrap">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 text-sm font-medium text-void bg-linear-to-b from-gold-bright to-gold py-3.5 px-6 rounded-full shadow-[0_10px_30px_-10px_rgba(201,167,106,0.55)] transition-all duration-200 hover:-translate-y-0.5"
            >
              Book a demo <HiOutlineArrowRight />
            </a>
            <a
              href="#sales"
              className="inline-flex items-center text-sm font-medium text-ink border border-hairline-strong py-3.5 px-6 rounded-full transition-colors duration-200 hover:bg-surface-hover"
            >
              Talk to sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}