"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, Gem, HandHeart, ShieldCheck } from "lucide-react";
import { useHomepageCraftsmanship } from "@/hooks/useHomepageCraftsmanship";

const fallback = {
  eyebrow: "Our Craftsmanship",
  title: "Crafted with Care, Made to Be Remembered.",
  description: "Setiap koleksi Floo Fashion hadir dari pemilihan material, detail yang dikerjakan dengan teliti, hingga siluet yang dirancang untuk membuat setiap perempuan tampil istimewa.",
  button_label: "Discover Our Story",
  button_link: "/products",
  features: [
    { title: "Premium Material", description: "Material pilihan berkualitas" },
    { title: "Thoughtful Details", description: "Detail dikerjakan dengan teliti" },
    { title: "Exclusive Design", description: "Desain khas Floo Fashion" },
    { title: "Loved by Customers", description: "Dipercaya 100K+ customer" },
  ],
  images: ["/images/products/3.jpg", "/images/products/4.jpg", "/images/products/5.jpg", "/images/products/6.jpg", "/images/products/7.jpg"],
  gallery: [
    { title: "Detail Payet", description: "Bordir dan payet dikerjakan satu per satu dengan presisi." },
    { title: "Bahan Premium", description: "Kain pilihan dengan tekstur mewah dan nyaman dipakai." },
    { title: "Handmade Process", description: "Setiap jahitan dibuat dengan ketelitian oleh tangan ahli." },
    { title: "Timeless Elegance", description: "Hasil akhir yang anggun untuk momen berharga Anda." },
    { title: "Finishing Touch", description: "Sentuhan akhir yang membuat setiap koleksi terasa istimewa." },
  ],
};
const icons = [Award, HandHeart, Gem, ShieldCheck];

export default function Story() {
  const { data } = useHomepageCraftsmanship();
  const content = data?.data || fallback;
  const title = String(content.title || fallback.title);
  const titleParts = title.split(" ");
  const splitAt = Math.max(1, Math.ceil(titleParts.length / 2));
  const features = Array.isArray(content.features) && content.features.length ? content.features : fallback.features;
  const images = [...(Array.isArray(content.images) ? content.images : []), ...fallback.images].slice(0, 5);
  const gallery = [...(Array.isArray(content.gallery) ? content.gallery : []), ...fallback.gallery].slice(0, 5);

  return <section id="floo-story" className="overflow-hidden bg-[#f3eadf]"><div className="border-y border-[#ded0c0] bg-[#fcfaf7]"><div className="container-custom grid grid-cols-2 divide-x divide-[#e5d8ca] md:grid-cols-4">{features.slice(0, 4).map((feature: { title: string; description: string }, index: number) => { const Icon = icons[index] || Award; return <div key={`${feature.title}-${index}`} className="flex flex-col items-center px-4 py-7 text-center md:px-8"><span className="flex size-14 items-center justify-center rounded-full border border-[#c69a6a] text-[#b47d43]"><Icon className="size-6" strokeWidth={1.35} /></span><p className="mt-3 font-luxury text-lg text-[#443229]">{feature.title}</p><p className="mt-1 text-xs text-[#806b59]">{feature.description}</p></div>; })}</div></div><div className="container-custom grid gap-8 py-12 xl:grid-cols-[.95fr_1.85fr] xl:items-center md:py-16"><div className="max-w-md"><p className="text-xs uppercase tracking-[.27em] text-[#a07750]">{content.eyebrow || fallback.eyebrow}</p><div className="mt-4 h-px w-24 bg-[#caa780]" /><h2 className="mt-7 font-luxury text-4xl leading-[1.02] text-[#2d241f] md:text-[54px]">{titleParts.slice(0, splitAt).join(" ")}<br /><span className="text-[#b47d43]">{titleParts.slice(splitAt).join(" ")}</span></h2><p className="mt-6 text-[15px] leading-7 text-[#6a594d]">{content.description || fallback.description}</p><Link href={content.button_link || "/products"} className="mt-8 inline-flex items-center gap-3 bg-[#a9783e] px-6 py-3 text-[11px] uppercase tracking-[.14em] text-white transition hover:bg-[#2d241f]">{content.button_label || fallback.button_label}<span aria-hidden>›</span></Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-[1.18fr_1fr_1fr] md:grid-rows-2">{images.map((image: string, index: number) => { const item = gallery[index] || fallback.gallery[index]; return <figure key={`${image}-${index}`} className={`group relative overflow-hidden rounded-xl bg-[#d9c3ad] ${index === 0 ? "col-span-2 h-[360px] md:col-span-1 md:row-span-2 md:h-[580px]" : "h-[175px] md:h-[283px]"}`}><Image src={image} alt={item.title} fill sizes="(max-width: 768px) 50vw, 25vw" unoptimized className="object-cover transition duration-700 group-hover:scale-105" />{index > 0 && <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1f1712]/90 via-[#1f1712]/40 to-transparent px-4 pb-4 pt-14 text-white"><span className="text-lg font-luxury text-[#f3d6ab]">0{index}</span><p className="mt-1 text-xs font-semibold uppercase tracking-[.08em]">{item.title}</p><p className="mt-1 text-[11px] leading-4 text-white/90">{item.description}</p></figcaption>}</figure>; })}</div></div></section>;
}
