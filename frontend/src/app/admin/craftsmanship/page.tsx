"use client";

import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { Award, Check, Gem, HandHeart, Images, Loader2, Pencil, Save, ShieldCheck, Upload } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { showError, showSuccess } from "@/lib/alert";

type Feature = { title: string; description: string };
type Craftsmanship = {
  eyebrow: string;
  title: string;
  description: string;
  button_label: string;
  button_link: string;
  features: Feature[];
  images: string[];
  gallery: Feature[];
};
type EditableSection = "story" | "features" | "gallery" | null;

const fallback: Craftsmanship = {
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
    { title: "Foto Utama", description: "Model koleksi utama Floo Fashion." },
    { title: "Detail Payet", description: "Bordir dan payet dikerjakan satu per satu dengan presisi." },
    { title: "Bahan Premium", description: "Kain pilihan dengan tekstur mewah dan nyaman dipakai." },
    { title: "Handmade Process", description: "Setiap jahitan dibuat dengan ketelitian oleh tangan ahli." },
    { title: "Timeless Elegance", description: "Hasil akhir yang anggun untuk momen berharga Anda." },
  ],
};

const featureIcons = [Award, HandHeart, Gem, ShieldCheck];
const galleryLabels = [
  { name: "Foto utama / model", hint: "Foto besar sebagai fokus utama section." },
  { name: "Foto detail 1", hint: "Contoh: close-up payet atau bordir." },
  { name: "Foto detail 2", hint: "Contoh: tekstur kain atau lace." },
  { name: "Foto detail 3", hint: "Contoh: proses jahit atau pengerjaan tangan." },
  { name: "Foto detail 4", hint: "Contoh: hasil akhir saat dikenakan." },
];

function normalize(data: Partial<Craftsmanship>): Craftsmanship {
  return {
    ...fallback,
    ...data,
    features: [...(data.features || []), ...fallback.features].slice(0, 4),
    images: [...(data.images || []), ...fallback.images].slice(0, 5),
    gallery: [...(data.gallery || []), ...fallback.gallery].slice(0, 5),
  };
}

export default function AdminCraftsmanshipPage() {
  const [content, setContent] = useState<Craftsmanship>(fallback);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [editing, setEditing] = useState<EditableSection>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const result = await AdminService.homepageCraftsmanship();
      setContent(normalize(result.data || {}));
    } catch {
      await showError("Konten belum dapat dimuat", "Coba refresh halaman Craftsmanship.");
    }
  };

  useEffect(() => { void load(); }, []);

  const updateFeature = (index: number, key: keyof Feature, value: string) => {
    setContent((current) => ({
      ...current,
      features: current.features.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };

  const updateGallery = (index: number, key: keyof Feature, value: string) => {
    setContent((current) => ({
      ...current,
      gallery: current.gallery.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };

  const chooseImage = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      event.target.value = "";
      void showError("Gambar terlalu besar", "Ukuran gambar maksimal 10 MB.");
      return;
    }
    setPreviews((current) => current.map((value, valueIndex) => valueIndex === index ? URL.createObjectURL(file) : value));
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = new FormData();

    payload.append("eyebrow", content.eyebrow);
    payload.append("title", content.title);
    payload.append("description", content.description);
    payload.append("button_label", content.button_label);
    payload.append("button_link", content.button_link);
    content.features.slice(0, 4).forEach((feature, index) => {
      payload.append(`feature_${index}_title`, feature.title);
      payload.append(`feature_${index}_description`, feature.description);
    });
    content.gallery.slice(0, 5).forEach((item, index) => {
      payload.append(`gallery_${index}_title`, item.title);
      payload.append(`gallery_${index}_description`, item.description);
      const file = form.get(`image_${index}`);
      if (file instanceof File && file.size) payload.append(`image_${index}`, file);
    });

    setSaving(true);
    try {
      await AdminService.updateHomepageCraftsmanship(payload);
      await load();
      setPreviews([null, null, null, null, null]);
      setEditing(null);
      await showSuccess("Craftsmanship berhasil diperbarui. Perubahan akan tampil di homepage.");
    } catch (error: unknown) {
      const response = (error as { response?: { data?: { message?: string; errors?: { message?: string }[] } } })?.response?.data;
      await showError("Craftsmanship belum dapat disimpan", response?.errors?.[0]?.message || response?.message || "Periksa data dan gambar yang dipilih.");
    } finally {
      setSaving(false);
    }
  };

  const sectionButton = (section: Exclude<EditableSection, null>, label: string) => (
    <button type="button" onClick={() => setEditing((current) => current === section ? null : section)} className="inline-flex items-center gap-2 rounded-xl border border-[#d9bf9e] bg-white px-4 py-2 text-xs font-medium text-[#82582f] transition hover:border-[#b88952] hover:bg-[#fffaf3]">
      {editing === section ? <Check className="size-4" /> : <Pencil className="size-4" />}
      {editing === section ? "Selesai edit" : label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f5f1]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-[#806b59]">Homepage content</p>
              <h1 className="font-luxury text-4xl text-[#2d241f]">Craftsmanship</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806b59]">Atur cerita Floo, keunggulan brand, dan lima foto Behind The Craft yang tampil di homepage.</p>
            </div>
            <div className="rounded-2xl border border-[#eadfd4] bg-white px-4 py-3 text-xs text-[#806b59] shadow-sm"><b className="text-[#2d241f]">3 bagian pengaturan</b><br />Edit satu bagian, lalu simpan semua perubahan di bawah.</div>
          </header>

          <form onSubmit={(event) => void save(event)} className="mt-7 space-y-6 pb-24">
            <section className="overflow-hidden rounded-3xl border border-[#eadfd4] bg-white shadow-sm">
              <SectionHeader icon={<Gem className="size-5" />} number="01" title="Cerita Floo" description="Judul, deskripsi, dan tombol yang tampil di sisi kiri section." action={sectionButton("story", "Edit cerita")} />
              {editing === "story" ? (
                <div className="grid gap-5 p-6 md:grid-cols-2">
                  <Field label="Label kecil di atas judul" hint="Contoh: Our Craftsmanship"><input required value={content.eyebrow} onChange={(event) => setContent({ ...content, eyebrow: event.target.value })} className="input" /></Field>
                  <Field label="Judul utama" hint="Gunakan judul singkat agar rapi di homepage"><input required value={content.title} onChange={(event) => setContent({ ...content, title: event.target.value })} className="input" /></Field>
                  <Field label="Deskripsi" hint="Ceritakan bahan, detail pengerjaan, atau keunggulan koleksi" className="md:col-span-2"><textarea required rows={4} value={content.description} onChange={(event) => setContent({ ...content, description: event.target.value })} className="input resize-y" /></Field>
                  <Field label="Teks tombol" hint="Contoh: Discover Our Story"><input required value={content.button_label} onChange={(event) => setContent({ ...content, button_label: event.target.value })} className="input" /></Field>
                  <Field label="Tujuan tombol" hint="Pilih halaman saat tombol ditekan"><select value={content.button_link} onChange={(event) => setContent({ ...content, button_link: event.target.value })} className="input"><option value="/products">Semua Produk</option><option value="/new-arrival">New Arrival</option><option value="/kebaya">Kebaya</option><option value="/couple">Couple Collection</option><option value="/about">Tentang Floo</option></select></Field>
                </div>
              ) : <StoryPreview content={content} />}
            </section>

            <section className="overflow-hidden rounded-3xl border border-[#eadfd4] bg-white shadow-sm">
              <SectionHeader icon={<Award className="size-5" />} number="02" title="Empat Keunggulan Brand" description="Muncul sebagai baris ikon tepat di atas section Craftsmanship." action={sectionButton("features", "Edit keunggulan")} />
              {editing === "features" ? (
                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">{content.features.slice(0, 4).map((feature, index) => {
                  const Icon = featureIcons[index];
                  return <div key={index} className="rounded-2xl border border-[#eadfd4] bg-[#fffcf8] p-4"><span className="flex size-9 items-center justify-center rounded-full bg-[#f5eadb] text-[#b88a55]"><Icon className="size-4" /></span><label className="mt-4 block text-xs font-medium text-[#644e3b]">Judul<input required value={feature.title} onChange={(event) => updateFeature(index, "title", event.target.value)} className="input mt-1.5" /></label><label className="mt-3 block text-xs font-medium text-[#644e3b]">Keterangan<input required value={feature.description} onChange={(event) => updateFeature(index, "description", event.target.value)} className="input mt-1.5" /></label></div>;
                })}</div>
              ) : <FeaturesPreview features={content.features} />}
            </section>

            <section className="overflow-hidden rounded-3xl border border-[#eadfd4] bg-white shadow-sm">
              <SectionHeader icon={<Images className="size-5" />} number="03" title="Galeri Behind The Craft" description="Total 5 foto: 1 foto utama/model dan 4 foto detail. JPG, PNG, atau WEBP maksimal 10 MB." action={sectionButton("gallery", "Edit galeri")} />
              {editing === "gallery" ? (
                <div className="grid gap-5 p-6 lg:grid-cols-2">{content.images.slice(0, 5).map((image, index) => {
                  const label = galleryLabels[index];
                  return <article key={index} className={`overflow-hidden rounded-2xl border border-dashed border-[#d8c2ab] bg-[#fffcf8] ${index === 0 ? "lg:row-span-2" : ""}`}>
                    <label className="group block cursor-pointer"><div className={`relative overflow-hidden bg-[#f3eadf] ${index === 0 ? "aspect-[4/5]" : "aspect-[16/9]"}`}><Image src={previews[index] || image} alt={label.name} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-[#2d241f]/75 px-3 py-2 text-xs text-white"><span>{label.name}</span><Upload className="size-3.5" /></span></div><input className="sr-only" name={`image_${index}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseImage(index, event)} /></label>
                    <div className="p-4"><p className="text-xs text-[#967e6b]">{label.hint}</p>{index > 0 && <div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs font-medium text-[#644e3b]">Judul overlay<input required value={content.gallery[index]?.title || ""} onChange={(event) => updateGallery(index, "title", event.target.value)} className="input mt-1.5" /></label><label className="text-xs font-medium text-[#644e3b]">Keterangan overlay<input required value={content.gallery[index]?.description || ""} onChange={(event) => updateGallery(index, "description", event.target.value)} className="input mt-1.5" /></label></div>}</div>
                  </article>;
                })}</div>
              ) : <GalleryPreview images={content.images} />}
            </section>

            <footer className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl border border-[#e6d7c6] bg-white/95 p-3 pl-5 shadow-lg backdrop-blur"><p className="hidden text-xs text-[#806b59] sm:block">Semua perubahan dari tiga bagian akan disimpan sekaligus.</p><button disabled={saving} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#2d241f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#b88a55] disabled:opacity-60">{saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{saving ? "Menyimpan..." : "Simpan Perubahan"}</button></footer>
          </form>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ icon, number, title, description, action }: { icon: ReactNode; number: string; title: string; description: string; action: ReactNode }) {
  return <div className="flex flex-col gap-4 border-b border-[#eee5dc] px-6 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-[#f5eadb] text-[#b88a55]">{icon}</span><div><p className="text-[10px] font-semibold tracking-[.16em] text-[#b88952]">BAGIAN {number}</p><h2 className="font-luxury text-2xl text-[#2d241f]">{title}</h2><p className="mt-1 text-xs text-[#806b59]">{description}</p></div></div>{action}</div>;
}

function StoryPreview({ content }: { content: Craftsmanship }) {
  return <div className="grid gap-5 p-6 md:grid-cols-[1.2fr_.8fr]"><div><p className="text-[11px] uppercase tracking-[.16em] text-[#b88952]">{content.eyebrow}</p><p className="mt-2 font-luxury text-2xl text-[#2d241f]">{content.title}</p><p className="mt-3 max-w-2xl text-sm leading-6 text-[#806b59]">{content.description}</p></div><div className="rounded-2xl bg-[#fffcf8] p-4"><p className="text-xs text-[#806b59]">Tombol saat ini</p><p className="mt-2 inline-flex rounded-lg bg-[#a9783e] px-3 py-2 text-xs text-white">{content.button_label}</p><p className="mt-2 text-xs text-[#967e6b]">Menuju: {content.button_link}</p></div></div>;
}

function FeaturesPreview({ features }: { features: Feature[] }) {
  return <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">{features.slice(0, 4).map((feature, index) => { const Icon = featureIcons[index]; return <div key={`${feature.title}-${index}`} className="rounded-2xl border border-[#eadfd4] bg-[#fffcf8] p-4"><span className="flex size-9 items-center justify-center rounded-full bg-[#f5eadb] text-[#b88a55]"><Icon className="size-4" /></span><p className="mt-4 font-medium text-[#2d241f]">{feature.title}</p><p className="mt-1 text-xs leading-5 text-[#806b59]">{feature.description}</p></div>; })}</div>;
}

function GalleryPreview({ images }: { images: string[] }) {
  return <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 lg:grid-cols-5">{images.slice(0, 5).map((image, index) => <div key={`${image}-${index}`} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#f3eadf]"><Image src={image} alt={galleryLabels[index].name} fill unoptimized className="object-cover" /><span className="absolute inset-x-0 bottom-0 bg-[#2d241f]/70 px-2 py-1.5 text-center text-[10px] text-white">{galleryLabels[index].name}</span></div>)}</div>;
}

function Field({ label, hint, children, className = "" }: { label: string; hint: string; children: ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium text-[#644e3b] ${className}`}><span>{label}</span><span className="mt-1 block text-xs font-normal leading-5 text-[#967e6b]">{hint}</span><span className="mt-2 block">{children}</span></label>;
}
