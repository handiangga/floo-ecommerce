import { Star } from "lucide-react";

const reviews = [
  { name: "Anisa D.", initial: "A", text: "Bahannya premium, jahitannya rapi banget. Modelnya juga elegan parah!" },
  { name: "Siti N.", initial: "S", text: "Ordernya cepat sampai dan packagingnya lucu, super aman. Recommended!" },
  { name: "Putri A.", initial: "P", text: "Udah langganan di Floo Fashion, selalu puas setiap kali belanja." },
];

export default function Review() {
  return <section className="border-t border-[#e9e2d8] bg-[#fdfbf8] py-16 md:py-24"><div className="container-custom"><div className="text-center"><p className="text-xs uppercase tracking-[.25em] text-primary">Loved by Floo Girls</p><h2 className="mt-2 font-luxury text-4xl md:text-5xl">Customer Review</h2></div><div className="mt-10 grid gap-4 md:grid-cols-3">{reviews.map((review) => <article key={review.name} className="border border-[#eadfd4] bg-[#f6f1eb] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"><div className="flex gap-1 text-[#b88a55]">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="size-3 fill-current" />)}</div><p className="mt-5 text-base leading-7 text-[#4c4037]">“{review.text}”</p><div className="mt-6 flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-[#b88a55] font-luxury text-white">{review.initial}</span><div><p className="text-sm font-medium">{review.name}</p><p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Verified Buyer</p></div></div></article>)}</div></div></section>;
}
