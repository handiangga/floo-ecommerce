"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { confirmDelete, showError, showSuccess } from "@/lib/alert";

type Occasion = { id: number; title: string; image: string; sort_order: number; status: "ACTIVE" | "INACTIVE" };

export default function AdminOccasionsPage() {
  const [items, setItems] = useState<Occasion[]>([]);
  const [editing, setEditing] = useState<Occasion | null>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const load = () => AdminService.homepageOccasions().then((result) => setItems(result.data || []));
  useEffect(() => { void load(); }, []);
  const close = () => { setOpen(false); setEditing(null); setPreview(null); };
  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; setPreview(file ? URL.createObjectURL(file) : null); };
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget); const file = form.get("image_file");
    if (!editing && !(file instanceof File && file.size)) { await showError("Gambar diperlukan", "Pilih foto koleksi sebelum menyimpan."); return; }
    const payload = new FormData(); ["title", "sort_order"].forEach((key) => payload.append(key, String(form.get(key) || "")));
    if (file instanceof File && file.size) payload.append("image_file", file);
    setSaving(true);
    try {
      if (editing) await AdminService.updateHomepageOccasion(editing.id, payload); else await AdminService.createHomepageOccasion(payload);
      await load(); close(); await showSuccess(editing ? "Occasion berhasil diperbarui" : "Occasion berhasil ditambahkan");
    } catch (error: unknown) {
      const response = (error as { response?: { data?: { message?: string; errors?: { message?: string }[] } } })?.response?.data;
      const message = response?.errors?.[0]?.message || response?.message || "Periksa data dan gambar yang dipilih.";
      await showError("Occasion belum dapat disimpan", message);
    } finally { setSaving(false); }
  };
  const remove = async (item: Occasion) => {
    if (!(await confirmDelete(`occasion \"${item.title}\"`))) return;
    try { await AdminService.removeHomepageOccasion(item.id); await load(); await showSuccess("Occasion dan gambar bucket berhasil dihapus"); }
    catch { await showError("Occasion belum dapat dihapus"); }
  };

  return <div className="flex min-h-screen bg-[#f8f5f1]"><AdminSidebar /><main className="min-w-0 flex-1 p-6 md:p-10"><div className="mx-auto max-w-7xl"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[#806b59]">Homepage content</p><h1 className="font-luxury text-4xl">Occasions</h1><p className="mt-2 text-sm text-[#806b59]">Keempat urutan teratas tampil di homepage. Kartu bersifat visual; tombol Explore All Occasion menuju katalog.</p></div><button onClick={() => { setEditing(null); setPreview(null); setOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-[#b88a55] px-5 py-3 text-sm font-medium text-white"><Plus className="size-4" /> Tambah Occasion</button></header>
    {open && <form onSubmit={(event) => void save(event)} className="mt-6 overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-sm"><div className="border-b border-[#eee5dc] px-6 py-5"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-[#f5eadb] text-[#b88a55]"><ImagePlus className="size-5" /></span><div><h2 className="font-luxury text-2xl">{editing ? "Edit Occasion" : "Occasion Baru"}</h2><p className="text-xs text-muted-foreground">Atur judul, foto, dan urutan. Sistem menentukan empat slot aktif secara otomatis.</p></div></div></div><div className="grid gap-5 p-6 md:grid-cols-2"><label className="text-sm font-medium text-[#644e3b]">Judul kartu<input required name="title" defaultValue={editing?.title} className="mt-2 w-full rounded-xl border border-[#eadfd4] bg-[#fffcf8] px-4 py-3" /></label><label className="text-sm font-medium text-[#644e3b]">Urutan tampil<input required min="0" name="sort_order" type="number" defaultValue={editing?.sort_order ?? items.length + 1} className="mt-2 w-full rounded-xl border border-[#eadfd4] bg-[#fffcf8] px-4 py-3" /></label></div><div className="px-6 pb-6"><label className="block text-sm font-medium text-[#644e3b]">Foto koleksi<span className="mt-1 block text-xs font-normal text-[#967e6b]">JPG, PNG, WEBP maksimal 10 MB. Foto lama tetap dipakai jika tidak diganti.</span><span className="mt-3 flex min-h-24 cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[#d8c2ab] bg-[#fffcf8] p-3"><span className="flex size-20 items-center justify-center overflow-hidden rounded-lg bg-[#f4e8da]">{preview || editing?.image ? <Image src={preview || editing?.image || ""} alt="Preview" width={80} height={80} unoptimized className="size-full object-cover" /> : <Upload className="size-5 text-[#b88a55]" />}</span><span className="text-sm text-[#9e7040]">Pilih gambar<input name="image_file" type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseFile} className="ml-3 block text-xs text-[#806b59]" /></span></span></label></div><footer className="flex justify-end gap-3 border-t border-[#eee5dc] bg-[#fcfaf7] px-6 py-4"><button type="button" onClick={close} className="inline-flex items-center gap-1 px-4 text-sm text-[#806b59]"><X className="size-4" /> Batal</button><button disabled={saving} className="rounded-xl bg-[#2d241f] px-5 py-2.5 text-sm text-white disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan"}</button></footer></form>}
    <section className="mt-6 overflow-hidden rounded-2xl border border-[#eadfd4] bg-white">{items.map((item) => <article key={item.id} className="flex flex-wrap items-center gap-4 border-b border-[#eee5dc] p-4 last:border-0"><Image src={item.image} alt={item.title} width={88} height={88} unoptimized className="size-[72px] rounded-xl object-cover" /><div className="min-w-[180px] flex-1"><h2 className="font-medium text-[#40342d]">{item.title}</h2><p className="mt-1 text-xs text-[#806b59]">Urutan {item.sort_order} · tampil di katalog melalui tombol Explore All Occasion</p></div><span className={item.status === "ACTIVE" ? "rounded-full bg-[#edf4e8] px-3 py-1 text-xs text-[#6d9855]" : "rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500"}>{item.status === "ACTIVE" ? "SLOT HOMEPAGE" : "CADANGAN"}</span><button onClick={() => { setEditing(item); setPreview(null); setOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex items-center gap-1 text-sm text-[#a07750]"><Pencil className="size-4" /> Edit</button><button onClick={() => void remove(item)} className="inline-flex items-center gap-1 text-sm text-rose-600"><Trash2 className="size-4" /> Hapus</button></article>)}{!items.length && <p className="p-10 text-center text-sm text-[#806b59]">Belum ada occasion. Tambahkan kartu pertama.</p>}</section></div></main></div>;
}
