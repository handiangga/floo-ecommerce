"use client";

import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ChevronRight,
  CreditCard,
  Headphones,
  Mail,
  MapPin,
  Music2,
  Phone,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

const paymentLogos = [
  { name: "VISA", className: "bg-white text-[#1a4695] italic font-black" },
  { name: "mastercard", className: "bg-white text-[#2e2825] font-semibold", mark: "mastercard" },
  { name: "BCA", className: "bg-[#1472b7] text-white font-bold" },
  { name: "mandiri", className: "bg-white text-[#123d84] font-bold", mark: "mandiri" },
  { name: "ShopeePay", className: "bg-[#ee4d2d] text-white font-semibold" },
];

const shippingLogos = [
  { name: "J&T Express", className: "bg-white text-[#d9192d] font-black italic" },
  { name: "JNE", className: "bg-white text-[#184587] font-black italic" },
  { name: "Lion Parcel", className: "bg-white text-[#d9252a] font-bold" },
  { name: "paxel", className: "bg-white text-[#9b3669] font-black" },
  { name: "SiCepat", className: "bg-white text-[#e9362d] font-bold italic" },
  { name: "KALOG", className: "bg-white text-[#1d4a88] font-black" },
];

function BrandLogo({ name, className, mark }: { name: string; className: string; mark?: string }) {
  return (
    <span aria-label={name} className={`flex h-11 min-w-[78px] items-center justify-center rounded-md px-2 text-[11px] shadow-sm ${className}`}>
      {mark === "mastercard" && <span className="mr-1.5 flex -space-x-1"><i className="size-4 rounded-full bg-[#e42c27]" /><i className="size-4 rounded-full bg-[#f5a623]" /></span>}
      {mark === "mandiri" && <span className="mr-1 text-[#f6b617]">⌁</span>}
      {name}
    </span>
  );
}

const collectionLinks = [
  ["New Arrival", "/new-arrival"],
  ["Kebaya", "/kebaya"],
  ["Couple Collection", "/couple"],
  ["Big Size", "/big-size"],
  ["Sale", "/sale"],
  ["Best Seller", "/products?is_best_seller=true"],
] as const;

const careLinks = [
  ["Shipping", "/shipping"],
  ["Return & Refund", "/return"],
  ["Privacy Policy", "/privacy"],
  ["Terms & Conditions", "/terms"],
  ["Size Guide", "/size-guide"],
  ["FAQ", "/faq"],
] as const;

const columnTitle = "mb-5 text-xs font-semibold uppercase tracking-[0.13em] text-[#fff7ef]";

export default function Footer() {
  return (
    <footer className="bg-[#231d19] px-3 pb-6 pt-5 text-[#f8efe5] sm:px-5 sm:pt-8">
      <div className="mx-auto max-w-[1660px]">
        <section className="relative overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_15%_30%,#fbf8f3_0%,#eee6db_58%,#e2d2bf_100%)] px-6 py-10 text-[#392a21] sm:px-10 lg:px-16 lg:py-12">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[.9fr_1fr] lg:items-center lg:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[.17em] text-[#a77449]">The Inner Circle</p>
              <h2 className="mt-3 font-luxury text-4xl leading-tight sm:text-5xl">Become a <em className="font-serif font-normal text-[#a56e40]">Floo Girl</em></h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#665449] sm:text-base">Dapatkan akses lebih dulu untuk exclusive launch, private sale, dan birthday voucher spesial untukmu.</p>
            </div>
            <form className="relative z-10" action="#" onSubmit={(event) => event.preventDefault()}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md bg-white px-5 py-4 shadow-sm">
                  <Mail className="size-5 shrink-0 text-[#5c4b3e]" />
                  <input aria-label="Alamat email" type="email" required placeholder="Your email address" className="min-w-0 flex-1 bg-transparent text-sm text-[#30251f] outline-none placeholder:text-[#8e8178]" />
                </label>
                <button type="submit" className="rounded-sm bg-[#9b663b] px-9 py-4 text-sm font-semibold text-white transition hover:bg-[#7d4d2c]">Join the club</button>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-[#705f52]"><ShieldCheck className="size-4" /> Kami tidak akan membagikan email kamu ke pihak lain.</p>
            </form>
          </div>
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-5 select-none text-[210px] leading-none text-[#b88d65]/15">✿</div>
        </section>

        <div className="grid gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.25fr_1fr_1fr_.9fr_1.15fr] lg:gap-8">
          <div className="border-b border-white/15 pb-8 lg:border-b-0 lg:border-r lg:pr-9 lg:pb-0">
            <Link href="/" className="font-luxury text-5xl tracking-[.12em] text-[#fff9f1]">FLOO</Link>
            <p className="mt-1 text-[9px] font-medium tracking-[.52em] text-[#e0c6a4]">FASHION</p>
            <div className="mt-6 flex items-center gap-2 text-[#c89a63]"><i className="h-px w-14 bg-current" /><span>✦</span><i className="h-px w-14 bg-current" /></div>
            <p className="mt-6 max-w-[265px] text-sm leading-7 text-[#e8ddd2]">Luxury modest wear crafted for every beautiful moment. Discover premium kebaya collections with elegant details and timeless designs.</p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-8 rounded-full border border-[#b78452] px-5 py-2.5 text-sm text-[#e8bd87] transition hover:bg-[#b78452] hover:text-white">About Us <ArrowRight className="size-4" /></Link>
          </div>

          <div className="lg:border-r lg:border-white/15 lg:pr-8">
            <h3 className={columnTitle}>Collection</h3>
            <nav className="space-y-3.5">{collectionLinks.map(([label, href]) => <Link key={href} href={href} className="group flex items-center justify-between gap-3 text-sm text-[#eee4d9] transition hover:text-[#dfa668]"><span>{label}</span><ChevronRight className="size-4 text-[#c28c56] transition group-hover:translate-x-0.5" /></Link>)}</nav>
          </div>

          <div className="lg:border-r lg:border-white/15 lg:pr-8">
            <h3 className={columnTitle}>Customer Care</h3>
            <nav className="space-y-3.5">{careLinks.map(([label, href]) => <Link key={href} href={href} className="group flex items-center justify-between gap-3 text-sm text-[#eee4d9] transition hover:text-[#dfa668]"><span>{label}</span><ChevronRight className="size-4 text-[#c28c56] transition group-hover:translate-x-0.5" /></Link>)}</nav>
          </div>

          <div className="lg:border-r lg:border-white/15 lg:pr-8">
            <h3 className={columnTitle}>Connect</h3>
            <div className="space-y-4 text-sm text-[#eee4d9]">
              <a href="https://wa.me/6281393354305" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-[#dfa668]"><Phone className="size-5" /> WhatsApp</a>
              <a href="https://instagram.com/floo_fashionn" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-[#dfa668]"><Camera className="size-5" /> Instagram</a>
              <a href="https://www.tiktok.com/@floo_fashionn" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-[#dfa668]"><Music2 className="size-5" /> TikTok</a>
              <a href="https://shopee.co.id/floo_fashionn" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-[#dfa668]"><ShoppingBag className="size-5" /> Shopee</a>
              <a href="mailto:hello@floofashionn.com" className="flex items-center gap-3 transition hover:text-[#dfa668]"><Mail className="size-5" /> Email Us</a>
            </div>
          </div>

          <div>
            <h3 className={columnTitle}>Info</h3>
            <div className="space-y-4 text-sm leading-6 text-[#eee4d9]">
              <p className="flex items-center gap-3"><MapPin className="size-5 shrink-0" /> Indonesia</p>
              <p className="flex items-center gap-3"><ShieldCheck className="size-5 shrink-0" /> 100% Secure Payment</p>
              <p className="flex items-center gap-3"><CreditCard className="size-5 shrink-0" /> Easy Payment</p>
              <p className="flex items-start gap-3"><Headphones className="mt-0.5 size-5 shrink-0" /><span>Customer Support<small className="mt-1 block text-[#cfc0b2]">Senin - Minggu, 08.00 - 20.00 WIB</small></span></p>
            </div>
          </div>
        </div>

        <div className="mx-5 grid gap-7 border-y border-white/15 py-7 lg:grid-cols-[.85fr_1fr] lg:gap-12 sm:mx-8">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[.14em] text-[#ddc3a3]">Secure Payment</p>
            <div className="flex flex-wrap gap-2.5">{paymentLogos.map((logo) => <BrandLogo key={logo.name} {...logo} />)}</div>
          </div>
          <div className="lg:border-l lg:border-white/15 lg:pl-12">
            <p className="mb-4 text-xs uppercase tracking-[.14em] text-[#ddc3a3]">Shipping Partners</p>
            <div className="flex flex-wrap gap-2.5">{shippingLogos.map((logo) => <BrandLogo key={logo.name} {...logo} />)}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 pb-2 pt-7 text-xs text-[#cbbcaf] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Floo Fashion. All rights reserved.</p>
          <div className="flex gap-7"><Link href="/sitemap" className="transition hover:text-white">Sitemap</Link><Link href="/careers" className="transition hover:text-white">Careers</Link></div>
          <a href="#top" className="flex items-center gap-2 transition hover:text-white">↑ Back to top</a>
        </div>
      </div>
    </footer>
  );
}
