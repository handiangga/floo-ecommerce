import { BadgeCheck, Gem, HandHeart, ShieldCheck } from "lucide-react";

const promises = [
  { icon: BadgeCheck, title: "Premium Quality", text: "Material Pilihan Terbaik" },
  { icon: HandHeart, title: "Detail Handmade", text: "Dikerjakan dengan Teliti" },
  { icon: Gem, title: "Exclusive Design", text: "Desain Eksklusif & Elegan" },
  { icon: ShieldCheck, title: "Trusted Brand", text: "Dipercaya 100K+ Customer" },
];

export default function ProductPromise() {
  return <section className="border-y border-[#e9e2d8] bg-[#f7f2eb]"><div className="container-custom grid divide-y divide-[#e4d7c9] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">{promises.map(({ icon: Icon, title, text }) => <div key={title} className="flex items-center gap-3 px-5 py-5"><span className="flex size-9 items-center justify-center rounded-full border border-[#d7b28b] text-[#b88a55]"><Icon className="size-4" /></span><div><p className="text-xs font-medium text-[#4c4037]">{title}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{text}</p></div></div>)}</div></section>;
}
