import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const occasions = [
  { title: "Lamaran & Engagement", image: "/images/products/1.jpg", href: "/kebaya" },
  { title: "Wisuda", image: "/images/products/2.jpg", href: "/new-arrival" },
  { title: "Kondangan", image: "/images/products/3.jpg", href: "/products" },
  { title: "Couple Moment", image: "/images/products/4.jpg", href: "/couple" },
];

export default function Occasions() {
  return <section className="bg-[#fcfaf7] py-16 md:py-20"><div className="container-custom grid gap-8 lg:grid-cols-[.82fr_1.7fr] lg:items-center"><div className="max-w-sm"><p className="text-[10px] uppercase tracking-[.26em] text-[#b88a55]">Find Your Moment</p><h2 className="mt-3 font-luxury text-4xl leading-[.98] text-[#2d241f] md:text-5xl">Made for every<br />beautiful occasion.</h2><div className="my-7 h-px w-36 bg-[#b88a55]/60" /><Link href="/products" className="inline-flex items-center gap-2 border border-[#caa780] px-4 py-2.5 text-[11px] uppercase tracking-[.12em] text-[#564237] transition hover:bg-[#b88a55] hover:text-white">Explore all occasion <ArrowRight className="size-3.5" /></Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{occasions.map((item, index) => <Link key={item.title} href={item.href} className="group relative h-[300px] overflow-hidden md:h-[340px]"><Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#211914]/80 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-4 text-white"><p className="text-[10px] tracking-[.16em] text-[#efd5b0]">0{index + 1}.</p><h3 className="mt-2 font-luxury text-xl leading-tight">{item.title}</h3></div></Link>)}</div></div></section>;
}
