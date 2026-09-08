import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Award, Gem, HandHeart, Heart, ShieldCheck, Sparkles, Truck } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";

const values = [
  { icon: Gem, title: "Kualitas Premium", text: "Material pilihan terbaik, nyaman dan tahan lama." },
  { icon: HandHeart, title: "Detail Handmade", text: "Dikerjakan oleh tangan ahli dengan ketelitian tinggi." },
  { icon: Sparkles, title: "Desain Eksklusif", text: "Desain original Floo Fashion yang timeless & elegan." },
  { icon: ShieldCheck, title: "Dipercaya 100K+", text: "Terima kasih untuk ribuan pelanggan setia kami." },
];

const journey = [
  { year: "2019", title: "Awal Mula", text: "Floo Fashion dimulai dari sebuah mimpi sederhana untuk menghadirkan kebaya modern yang tetap menjaga nilai budaya.", icon: Sparkles },
  { year: "2020 – 2021", title: "Bertumbuh", text: "Dukungan kalian membuat kami tumbuh lebih kuat. Koleksi kami semakin beragam dengan kualitas yang terus kami tingkatkan.", icon: Heart },
  { year: "2022 – 2023", title: "Semakin Dipercaya", text: "Floo Fashion dipercaya oleh lebih dari 50.000+ pelanggan dari berbagai kota di Indonesia.", icon: Award },
  { year: "2024 – Sekarang", title: "Menuju Masa Depan", text: "Kami terus berinovasi untuk menghadirkan koleksi terbaik dan pengalaman belanja yang lebih istimewa.", icon: Gem },
];

const processPhotos = ["/images/products/2.jpg", "/images/products/3.jpg", "/images/products/4.jpg", "/images/products/5.jpg"];

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="overflow-hidden bg-[#fbf8f4] text-[#31261f]">
        <div className="relative min-h-[570px] overflow-hidden border-b border-[#e8ded4] bg-[#f6f0e9]">
          <div className="container-custom relative z-10 grid min-h-[570px] items-center gap-10 py-14 lg:grid-cols-[.9fr_1.1fr] lg:py-16">
            <div className="max-w-[500px]">
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#a97843] transition hover:text-[#2d241f]"><ArrowLeft className="size-3.5" /> Kembali ke beranda</Link>
              <p className="mt-10 text-[10px] font-semibold uppercase tracking-[.22em] text-[#b07d4c]">The Floo Story</p>
              <h1 className="mt-3 font-luxury text-5xl leading-[.95] tracking-[-.03em] text-[#30241e] sm:text-6xl lg:text-7xl">Elegance,<br />made <em className="font-luxury font-normal text-[#b47c40]">personal.</em></h1>
              <p className="mt-6 max-w-sm text-[15px] leading-7 text-[#716154]">Floo Fashion adalah rumah modest wear yang merayakan setiap momen perempuan Indonesia—dari acara keluarga hingga hari yang paling istimewa.</p>
              <p className="mt-8 text-xs text-[#968272]">Terakhir diperbarui: 10 Agustus 2026</p>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 w-full lg:w-[56%]">
            <Image src="/images/hero/hero-2.jpg" alt="Koleksi Floo Fashion" fill priority sizes="(max-width: 1024px) 100vw, 56vw" className="object-cover object-[60%_44%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f6f0e9] via-[#f6f0e9]/30 to-transparent" />
            <div className="absolute inset-0 bg-[#473526]/10" />
          </div>
        </div>

        <div className="container-custom relative z-20 -mt-10 pb-16 lg:-mt-16 lg:pb-24">
          <article className="overflow-hidden rounded-[28px] border border-[#e9dfd5] bg-white shadow-[0_20px_60px_rgba(83,54,33,.08)]">
            <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[.92fr_1.08fr] lg:gap-12 lg:p-10">
              <div className="relative min-h-[270px] overflow-hidden rounded-2xl lg:min-h-[330px]"><Image src="/images/products/6.jpg" alt="Detail pengerjaan kebaya Floo" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover object-center" /></div>
              <div className="self-center px-1 lg:pr-8">
                <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b07d4c]">Tentang Floo Fashion</p>
                <h2 className="mt-3 max-w-md font-luxury text-3xl leading-tight text-[#31261f] sm:text-4xl">Dibuat dengan cinta, dirancang untukmu.</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[#716154]">Kami merancang kebaya dan modest wear dengan siluet yang anggun, detail yang teliti, serta material yang nyaman dipakai. Setiap koleksi dibuat agar kamu merasa percaya diri tanpa kehilangan nilai-nilai kesopanan dan keanggunan.</p>
              </div>
            </div>
            <div className="grid border-t border-[#eee5dd] sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, text }) => <div key={title} className="border-b border-[#eee5dd] px-7 py-7 text-center last:border-b-0 sm:nth-[2n]:border-l lg:border-b-0 lg:border-l lg:first:border-l-0"><span className="mx-auto flex size-11 items-center justify-center rounded-full border border-[#d4ad80] text-[#b37c40]"><Icon className="size-5" strokeWidth={1.45} /></span><h3 className="mt-3 font-luxury text-base">{title}</h3><p className="mx-auto mt-1 max-w-[160px] text-[11px] leading-4 text-[#806d5c]">{text}</p></div>)}
            </div>
          </article>
        </div>

        <section className="container-custom pb-20 text-center lg:pb-24">
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#b07d4c]">Our Journey</p>
          <h2 className="mt-2 font-luxury text-3xl sm:text-4xl">Perjalanan Kami</h2>
          <div className="mx-auto mt-4 flex w-20 items-center gap-2 text-[#be8950]"><span className="h-px flex-1 bg-current" /><span className="size-1.5 rotate-45 bg-current" /><span className="h-px flex-1 bg-current" /></div>
          <div className="mt-12 grid gap-9 md:grid-cols-4 md:gap-0">
            {journey.map(({ year, title, text, icon: Icon }, index) => <div key={year} className="relative px-5"><div className="hidden md:block absolute left-[calc(50%+25px)] right-[calc(-50%+25px)] top-5 border-t border-dashed border-[#d9c8b6] last:hidden" /><span className="relative z-10 mx-auto flex size-10 items-center justify-center rounded-full border border-[#d4ad80] bg-[#fbf8f4] text-[#ae793f]"><Icon className="size-4" /></span><p className="mt-5 text-xs text-[#a27d58]">{year}</p><h3 className="mt-1 font-luxury text-lg">{title}</h3><p className="mx-auto mt-3 max-w-[215px] text-[11px] leading-5 text-[#736255]">{text}</p></div>)}
          </div>
        </section>

        <section className="bg-[#f1e6d8] py-12 lg:py-16">
          <div className="container-custom grid items-center gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div className="max-w-sm"><p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#b07d4c]">Crafted with Heart</p><h2 className="mt-3 font-luxury text-3xl sm:text-4xl">Setiap Detail, Berarti</h2><p className="mt-4 text-sm leading-7 text-[#716154]">Dari pemilihan bahan hingga sentuhan akhir, setiap bagian melalui proses yang kami jaga sepenuh hati.</p></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{processPhotos.map((photo, index) => <div key={photo} className="relative aspect-[.85] overflow-hidden rounded-xl"><Image src={photo} alt={`Proses craftsmanship Floo ${index + 1}`} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover" /></div>)}</div>
          </div>
        </section>

        <section className="container-custom py-16 lg:py-24">
          <div className="overflow-hidden rounded-[26px] bg-[#f1e6d8] lg:grid lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative min-h-[260px]"><Image src="/images/hero/hero-2.jpg" alt="Perempuan memakai koleksi Floo Fashion" fill sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover object-[45%_52%]" /></div>
            <div className="flex flex-col justify-center p-8 sm:p-12"><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b07d4c]">Terima kasih</p><h2 className="mt-3 max-w-sm font-luxury text-3xl leading-tight sm:text-4xl">Terima kasih telah menjadi bagian dari perjalanan Floo.</h2><p className="mt-4 max-w-md text-sm leading-6 text-[#766353]">Dukungan kamu adalah alasan kami untuk terus berkarya dan menghadirkan koleksi yang membuatmu tampil memukau.</p><Link href="/products" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#a9783e] px-5 py-3 text-[11px] font-semibold uppercase tracking-[.12em] text-white transition hover:bg-[#2d241f]">Lihat koleksi kami <ArrowRight className="size-3.5" /></Link></div>
          </div>
          <div className="mt-7 grid gap-4 border-t border-[#eadfd4] pt-7 text-center sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[#eadfd4]">
            {[{ icon: Truck, title: "Gratis Ongkir", text: "Min. belanja Rp499.000" }, { icon: ShieldCheck, title: "Pembayaran Aman", text: "100% secure payment" }, { icon: Truck, title: "Pengiriman Cepat", text: "Dikirim setiap hari" }, { icon: HandHeart, title: "Customer Care", text: "Siap membantu kamu" }].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-center justify-center gap-3 px-3"><Icon className="size-4 text-[#ba8248]" strokeWidth={1.5} /><span className="text-left"><b className="block text-[11px] font-medium text-[#574335]">{title}</b><small className="block text-[10px] text-[#8a7563]">{text}</small></span></div>)}
          </div>
        </section>
      </section>
    </MainLayout>
  );
}
