import Image from "next/image";
import Link from "next/link";

const craftImages = ["/images/products/3.jpg", "/images/products/4.jpg", "/images/products/5.jpg", "/images/products/6.jpg"];

export default function Story() {
  return <section id="floo-story" className="bg-[#eee3d6] py-12 md:py-16"><div className="container-custom grid gap-7 lg:grid-cols-[.9fr_2fr] lg:items-center"><div className="max-w-sm"><p className="text-[10px] uppercase tracking-[.25em] text-[#a07750]">Our Craftsmanship</p><h2 className="mt-3 font-luxury text-4xl leading-[.98] text-[#2d241f] md:text-5xl">Luxury Crafted<br />with Heart</h2><p className="mt-5 text-sm leading-6 text-[#6a594d]">Setiap kebaya Floo Fashion dibuat dengan ketelitian tinggi, menggunakan material premium dan sentuhan tangan ahli.</p><Link href="/products" className="mt-6 inline-flex border border-[#caa780] px-4 py-2 text-[11px] uppercase tracking-[.12em] text-[#564237] transition hover:bg-[#b88a55] hover:text-white">Our Story</Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{craftImages.map((image, index) => <div key={image} className="relative h-[220px] overflow-hidden md:h-[270px]"><Image src={image} alt={"Floo craftsmanship " + (index + 1)} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 hover:scale-105" /></div>)}</div></div></section>;
}
