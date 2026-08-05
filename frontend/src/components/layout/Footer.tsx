import Link from "next/link";
import { Phone, ShoppingBag } from "lucide-react";

const paymentLogos = [
  { name: "VISA", className: "bg-[#173f88] text-white italic tracking-tight" },
  { name: "mastercard", className: "bg-white text-[#242424] font-semibold", mark: "mastercard" },
  { name: "BCA", className: "bg-[#1472b7] text-white font-bold" },
  { name: "mandiri", className: "bg-white text-[#123d84] font-bold", mark: "mandiri" },
  { name: "Shopeepay", className: "bg-[#ee4d2d] text-white font-semibold" },
];

const shippingLogos = [
  { name: "JNE", className: "bg-white text-[#e21d2a] font-black italic" },
  { name: "J&T", className: "bg-[#e31d2d] text-white font-black" },
  { name: "SiCepat", className: "bg-white text-[#e9362d] font-bold italic" },
  { name: "AnterAja", className: "bg-[#e61d2d] text-white font-bold" },
];

function BrandLogo({ name, className, mark }: { name: string; className: string; mark?: string }) {
  return <span aria-label={name} className={"flex h-8 min-w-14 items-center justify-center rounded-[3px] px-2 text-[10px] shadow-sm " + className}>{mark === "mastercard" && <span className="mr-1 flex -space-x-1"><i className="size-3 rounded-full bg-[#e42c27]" /><i className="size-3 rounded-full bg-[#f5a623]" /></span>}{mark === "mandiri" && <span className="mr-1 text-[#f6b617]">〰</span>}{name}</span>;
}

export default function Footer() {
  return (
    <footer className="mt-0 border-t border-[#4a3a2d] bg-[#29231f] text-[#fffaf5]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="font-luxury text-4xl text-[#e6c18d]">FLOO</h2>

            <p className="mt-4 text-sm leading-7 text-white/65">
              Luxury Modest Wear crafted for every beautiful moment. Discover
              premium kebaya collections with elegant details and timeless
              designs.
            </p>
          </div>

          {/* Collection */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Collection</h3>

            <div className="flex flex-col gap-3 text-sm text-white/65">
              <Link
                href="/new-arrival"
                className="hover:text-primary transition-colors"
              >
                New Arrival
              </Link>

              <Link
                href="/kebaya"
                className="hover:text-primary transition-colors"
              >
                Kebaya
              </Link>

              <Link
                href="/couple"
                className="hover:text-primary transition-colors"
              >
                Couple Collection
              </Link>

              <Link
                href="/big-size"
                className="hover:text-primary transition-colors"
              >
                Big Size
              </Link>
            </div>
          </div>

          {/* Customer */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Customer Care</h3>

            <div className="flex flex-col gap-3 text-sm text-white/65">
              <Link
                href="/shipping"
                className="hover:text-primary transition-colors"
              >
                Shipping
              </Link>

              <Link
                href="/return"
                className="hover:text-primary transition-colors"
              >
                Return Policy
              </Link>

              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Connect</h3>

            <div className="space-y-4">
              <a
                href="https://wa.me/6281393354305"
                target="_blank"
                className="flex items-center gap-3 text-sm text-white/65 transition hover:text-[#e6c18d]"
              >
                <Phone size={18} />
                WhatsApp
              </a>

              <a
                href="https://instagram.com/floo_fashionn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/65 transition hover:text-[#e6c18d]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 7.75 4zm8.75 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                </svg>
                Instagram
              </a>

              <a
                href="https://www.tiktok.com/@floo_fashionn"
                target="_blank"
                className="flex items-center gap-3 text-sm text-white/65 transition hover:text-[#e6c18d]"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.24h-3.2v13.27a2.89 2.89 0 1 1-2-2.75V9.72A6.1 6.1 0 1 0 15.82 15V8.4a8.07 8.07 0 0 0 4.77 1.58V6.69z" />
                </svg>
                TikTok
              </a>

              <a
                href="https://shopee.co.id/floo_fashionn"
                target="_blank"
                className="flex items-center gap-3 text-sm text-white/65 transition hover:text-[#e6c18d]"
              >
                <ShoppingBag size={18} />
                Shopee
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 border-t border-white/15 py-7 text-sm sm:grid-cols-2">
          <div><p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#e6c18d]">Secure Payment</p><div className="flex flex-wrap gap-2">{paymentLogos.map((logo) => <BrandLogo key={logo.name} {...logo} />)}</div></div>
          <div className="sm:text-right"><p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#e6c18d]">Shipping Partners</p><div className="flex flex-wrap gap-2 sm:justify-end">{shippingLogos.map((logo) => <BrandLogo key={logo.name} {...logo} />)}</div></div>
        </div>

        <div className="border-t border-white/15 pt-6 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Floo Fashionn. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
