"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHomepageOccasions } from "@/hooks/useHomepageOccasions";

const fallbackOccasions = [
  { title: "Lamaran & Engagement", image: "/images/products/1.jpg", href: "/kebaya" },
  { title: "Wisuda", image: "/images/products/2.jpg", href: "/new-arrival" },
  { title: "Kondangan", image: "/images/products/3.jpg", href: "/products" },
  { title: "Couple Moment", image: "/images/products/4.jpg", href: "/couple" },
];

export default function Occasions() {
  const { data, isError } = useHomepageOccasions();
  const fetched = !isError ? data?.data || [] : [];
  const occasions = fetched.filter((item: { status?: string; image?: string }) => item.status === "ACTIVE" && item.image?.trim());
  const visibleOccasions = occasions.length ? occasions : fallbackOccasions;
  return <section className="bg-[#fcfaf7] py-16 md:py-20"><div className="container-custom grid gap-8 lg:grid-cols-[.82fr_1.7fr] lg:items-center"><div className="max-w-sm"><p className="text-[10px] uppercase tracking-[.26em] text-[#b88a55]">Find Your Moment</p><h2 className="mt-3 font-luxury text-4xl leading-[.98] text-[#2d241f] md:text-5xl">Made for every<br />beautiful occasion.</h2><div className="my-7 h-px w-36 bg-[#b88a55]/60" /><Link href="/products" className="inline-flex items-center gap-2 border border-[#caa780] px-4 py-2.5 text-[11px] uppercase tracking-[.12em] text-[#564237] transition hover:bg-[#b88a55] hover:text-white">Explore all occasion <ArrowRight className="size-3.5" /></Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{visibleOccasions.slice(0, 4).map((item: { id?: number; title: string; image: string }, index: number) => <article key={item.id || item.title} className="group relative h-[300px] overflow-hidden md:h-[340px]"><Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 50vw, 25vw" unoptimized className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#211914]/80 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-4 text-white"><p className="text-[10px] tracking-[.16em] text-[#efd5b0]">{String(index + 1).padStart(2, "0")}.</p><h3 className="mt-2 font-luxury text-xl leading-tight">{item.title}</h3></div></article>)}</div></div></section>;
}
