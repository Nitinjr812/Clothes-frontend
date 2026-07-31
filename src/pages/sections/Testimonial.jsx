export default function Testimonial() {
  return (
    <section className="py-20 sm:py-24 bg-surface border-y border-hairline">
      <div
        className="w-full max-w-[720px] mx-auto px-5 sm:px-8 text-center"
        data-aos="zoom-in"
      >
        <p className="font-display italic text-xl sm:text-2xl leading-snug text-ink mb-5">
          &ldquo;We used to close the store an hour late just to count stock. Now the count is
          already done before the last customer leaves.&rdquo;
        </p>
        <span className="font-mono text-sm text-gold">
          Owner, contemporary womenswear boutique — Jaipur
        </span>
      </div>
    </section>
  );
}