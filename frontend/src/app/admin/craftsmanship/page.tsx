"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Award, Gem, HandHeart, Loader2, Save, ShieldCheck, Upload } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { showError, showSuccess } from "@/lib/alert";

type Feature = { title: string; description: string };
type Craftsmanship = { eyebrow: string; title: string; description: string; button_label: string; button_link: string; features: Feature[]; images: string[]; gallery: Feature[] };

const fallback: Craftsmanship = {
  eyebrow: "Our Craftsmanship", title: "Crafted with Care, Made to Be Remembered.", description: "Setiap koleksi Floo Fashion hadir dari pemilihan material, detail yang dikerjakan dengan teliti, hingga siluet yang dirancang untuk membuat setiap perempuan tampil istimewa.", button_label: "Discover Our Story", button_link: "/products",
  features: [{ title: "Premium Material", description: "Material pilihan berkualitas" }, { title: "Thoughtful Details", description: "Detail dikerjakan dengan teliti" }, { title: "Exclusive Design", description: "Desain khas Floo Fashion" }, { title: "Loved by Customers", description: "Dipercaya 100K+ customer" }],
  images: ["/images/products/3.jpg", "/images/products/4.jpg", "/images/products/5.jpg", "/images/products/6.jpg"],
  gallery: [{ title: "Detail Payet", description: "Bordir dan payet dikerjakan satu per satu dengan presisi." }, { title: "Bahan Premium", description: "Kain pilihan dengan tekstur mewah dan nyaman dipakai." }, { title: "Handmade Process", description: "Setiap jahitan dibuat dengan ketelitian oleh tangan ahli." }, { title: "Timeless Elegance", description: "Hasil akhir yang anggun untuk momen berharga Anda." }],
};
const featureIcons = [Award, HandHeart, Gem, ShieldCheck];

export default function AdminCraftsmanshipPage() {
  const [content, setContent] = useState<Craftsmanship>(fallback);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);
  const [saving, setSaving] = useState(false);
  const load = async () => {
    try {
      const result = await AdminService.homepageCraftsmanship();
      const data = result.data || {};
      setContent({ ...fallback, ...data, features: data.features?.length ? data.features : fallback.features, images: data.images?.length ? data.images : fallback.images, gallery: data.gallery?.length ? data.gallery : fallback.gallery });
    } catch { await showError("Konten belum dapat dimuat", "Coba refresh halaman Craftsmanship."); }
  };
  useEffect(() => { void load(); }, []);
  const updateFeature = (index: number, key: keyof Feature, value: string) => setContent((current) => ({ ...current, features: current.features.map((feature, currentIndex) => currentIndex === index ? { ...feature, [key]: value } : feature) }));
  const chooseImage = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (file.size > 10 * 1024 * 1024) { event.target.value = ""; void showError("Gambar terlalu besar", "Ukuran gambar maksimal 10 MB."); return; }
    setPreviews((current) => current.map((value, currentIndex) => currentIndex === index ? URL.createObjectURL(file) : value));
  };
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget); const payload = new FormData();
    ["eyebrow", "title", "description", "button_label", "button_link"].forEach((key) => payload.append(key, String(form.get(key) || "")));
    content.features.forEach((feature, index) => { payload.append(`feature_${index}_title`, feature.title); payload.append(`feature_${index}_description`, feature.description); payload.append(`gallery_${index}_title`, content.gallery[index]?.title || ""); payload.append(`gallery_${index}_description`, content.gallery[index]?.description || ""); const file = form.get(`image_${index}`); if (file instanceof File && file.size) payload.append(`image_${index}`, file); });
    setSaving(true);
    try { await AdminService.updateHomepageCraftsmanship(payload); await load(); setPreviews([null, null, null, null]); await showSuccess("Craftsmanship berhasil diperbarui"); }
    catch (error: unknown) { const response = (error as { response?: { data?: { message?: string; errors?: { message?: string }[] } } })?.response?.data; await showError("Craftsmanship belum dapat disimpan", response?.errors?.[0]?.message || response?.message || "Periksa data dan gambar yang dipilih."); }
    finally { setSaving(false); }
  };
  return <div className="flex min-h-screen bg-[#f8f5f1]"><AdminSidebar /><main className="min-w-0 flex-1 p-6 md:p-10"><div className="mx-auto max-w-7xl"><header><p className="text-sm text-[#806b59]">Homepage content</p><h1 className="font-luxury text-4xl text-[#2d241f]">Craftsmanship</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#806b59]">Kelola cerita craftsmanship Floo, keunggulan brand, dan empat foto galeri yang tampil di bawah koleksi produk.</p></header>
    <form onSubmit={(event) => void save(event)} className="mt-7 space-y-6"><section className="overflow-hidden rounded-3xl border border-[#eadfd4] bg-white shadow-sm"><div className="border-b border-[#eee5dc] px-6 py-5"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-[#f5eadb] text-[#b88a55]"><Gem className="size-5" /></span><div><h2 className="font-luxury text-2xl">Cerita Floo</h2><p className="text-xs text-[#806b59]">Teks yang menjelaskan kualitas dan proses pembuatan koleksi Floo.</p></div></div></div><div className="grid gap-5 p-6 md:grid-cols-2"><Field label="Label kecil di atas judul" hint="Contoh: Our Craftsmanship"><input required name="eyebrow" value={content.eyebrow} onChange={(event) => setContent({ ...content, eyebrow: event.target.value })} className="input" /></Field><Field label="Judul utama" hint="Gunakan judul pendek agar rapi di homepage"><input required name="title" value={content.title} onChange={(event) => setContent({ ...content, title: event.target.value })} className="input" /></Field><Field label="Deskripsi" hint="Ceritakan bahan, detail pengerjaan, atau keunggulan produk" className="md:col-span-2"><textarea required name="description" rows={3} value={content.description} onChange={(event) => setContent({ ...content, description: event.target.value })} className="input resize-y" /></Field><Field label="Teks tombol" hint="Contoh: Our Story"><input required name="button_label" value={content.button_label} onChange={(event) => setContent({ ...content, button_label: event.target.value })} className="input" /></Field><Field label="Tujuan tombol" hint="Pilih halaman tujuan tombol"><select name="button_link" value={content.button_link} onChange={(event) => setContent({ ...content, button_link: event.target.value })} className="input"><option value="/products">Semua Produk</option><option value="/new-arrival">New Arrival</option><option value="/kebaya">Kebaya</option><option value="/couple">Couple Collection</option><option value="/about">Tentang Floo</option></select></Field></div></section>
      <section className="overflow-hidden rounded-3xl border border-[#eadfd4] bg-white shadow-sm"><div className="border-b border-[#eee5dc] px-6 py-5"><h2 className="font-luxury text-2xl">Empat Keunggulan Brand</h2><p className="mt-1 text-xs text-[#806b59]">Ditampilkan sebagai baris ikon tepat di atas section Craftsmanship.</p></div><div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">{content.features.slice(0, 4).map((feature, index) => { const Icon = featureIcons[index]; return <div key={index} className="rounded-2xl border border-[#eadfd4] bg-[#fffcf8] p-4"><span className="flex size-9 items-center justify-center rounded-full bg-[#f5eadb] text-[#b88a55]"><Icon className="size-4" /></span><label className="mt-4 block text-xs font-medium text-[#644e3b]">Judul<input required value={feature.title} onChange={(event) => updateFeature(index, "title", event.target.value)} className="input mt-1.5" /></label><label className="mt-3 block text-xs font-medium text-[#644e3b]">Keterangan<input required value={feature.description} onChange={(event) => updateFeature(index, "description", event.target.value)} className="input mt-1.5" /></label></div>; })}</div></section>
      <section className="overflow-hidden rounded-3xl border border-[#eadfd4] bg-white shadow-sm"><div className="border-b border-[#eee5dc] px-6 py-5"><h2 className="font-luxury text-2xl">Galeri Behind The Craft</h2><p className="mt-1 text-xs text-[#806b59]">Foto 1 adalah foto utama/model. Foto 2–4 untuk close-up payet, tekstur kain, proses pengerjaan, atau detail kebaya. JPG, PNG, WEBP maksimal 10 MB.</p></div><div className="grid gap-5 p-6 md:grid-cols-2">{content.images.slice(0, 4).map((image, index) => <div key={index} className="overflow-hidden rounded-2xl border border-dashed border-[#d8c2ab] bg-[#fffcf8]"><label className="group block cursor-pointer"><div className="relative aspect-[16/10] overflow-hidden bg-[#f3eadf]"><Image src={previews[index] || image} alt={`Foto craftsmanship ${index + 1}`} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-[#2d241f]/75 px-3 py-2 text-xs text-white">{index === 0 ? "Foto utama / model" : `Foto detail ${index}`}<Upload className="size-3.5" /></span></div><input className="sr-only" name={`image_${index}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseImage(index, event)} /></label>{index > 0 && <div className="grid gap-3 p-4 sm:grid-cols-2"><label className="text-xs font-medium text-[#644e3b]">Judul overlay<input required value={content.gallery[index]?.title || ""} onChange={(event) => setContent((current) => ({ ...current, gallery: current.gallery.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) }))} className="input mt-1.5" /></label><label className="text-xs font-medium text-[#644e3b]">Keterangan overlay<input required value={content.gallery[index]?.description || ""} onChange={(event) => setContent((current) => ({ ...current, gallery: current.gallery.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) }))} className="input mt-1.5" /></label></div>}</div>)}</div></section>
      <footer className="sticky bottom-4 z-20 flex justify-end rounded-2xl border border-[#e6d7c6] bg-white/95 p-3 shadow-lg backdrop-blur"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#2d241f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#b88a55] disabled:opacity-60">{saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{saving ? "Menyimpan..." : "Simpan Perubahan"}</button></footer>
    </form></div></main></div>;
}

function Field({ label, hint, children, className = "" }: { label: string; hint: string; children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium text-[#644e3b] ${className}`}><span>{label}</span><span className="mt-1 block text-xs font-normal leading-5 text-[#967e6b]">{hint}</span><span className="mt-2 block">{children}</span></label>;
}
