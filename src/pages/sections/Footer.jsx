const COLUMNS = [
  {
    title: "Product",
    links: ["Platform", "POS billing", "Inventory", "AI insights", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy policy", "Terms of service"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline pt-14 pb-6">
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-8 mb-11">
        <div className="col-span-2 sm:col-span-1">
          <span className="font-display text-xl font-medium text-ink">
            Retail<em className="text-gold">Sphere</em>
          </span>
          <p className="text-sm text-muted mt-3.5 max-w-[260px]">
            The retail operating system for fashion &amp; jewellery showrooms.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm text-ink mb-4">{col.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted hover:text-gold transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8 border-t border-hairline pt-5">
        <span className="text-xs text-faint">
          © {new Date().getFullYear()} RetailSphere. All rights reserved.
        </span>
      </div>
    </footer>
  );
}