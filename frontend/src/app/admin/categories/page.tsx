"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { FolderPlus, Layers3, Pencil, Plus, Trash2, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { confirmDelete, showError, showSuccess } from "@/lib/alert";

type Category = { id: number; name: string; parent_id: number | null; sort_order?: number; subcategories?: Category[] };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [presetParent, setPresetParent] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const load = () => AdminService.categories().then((result) =>
    setItems(result.data?.data?.data || result.data?.data || []),
  );
  useEffect(() => { void load().catch(() => void showError("Kategori belum dapat dimuat")); }, []);
  const parents = useMemo(() => items.filter((item) => !item.parent_id), [items]);
  const childrenOf = (parent: Category) => parent.subcategories?.length ? parent.subcategories : items.filter((item) => item.parent_id === parent.id);
  const close = () => { setOpen(false); setEditing(null); setPresetParent(null); };
  const startAdd = (parentId: number | null = null) => { setEditing(null); setPresetParent(parentId); setOpen(true); };
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const payload = { name: String(form.get("name") || "").trim(), parent_id: form.get("parent_id") ? Number(form.get("parent_id")) : null, sort_order: Number(form.get("sort_order") || 0) };
    if (!payload.name) return;
    setSaving(true);
    try {
      if (editing) await AdminService.updateCategory(editing.id, payload); else await AdminService.createCategory(payload);
      await load(); close(); await showSuccess(editing ? "Kategori berhasil diperbarui" : payload.parent_id ? "Subkategori berhasil ditambahkan" : "Kategori berhasil ditambahkan");
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Periksa nama kategori yang diisi.";
      await showError(editing ? "Kategori belum dapat diperbarui" : "Kategori belum dapat ditambahkan", message);
    } finally { setSaving(false); }
  };
  const edit = (item: Category) => { setEditing(item); setPresetParent(item.parent_id); setOpen(true); };
  const remove = async (item: Category) => {
    if (!(await confirmDelete(item.parent_id ? `subkategori ${item.name}` : `kategori ${item.name}`, item.parent_id ? "Produk yang memakai subkategori ini harus dipindahkan terlebih dahulu." : "Subkategori dan produk di dalamnya harus dipindahkan terlebih dahulu."))) return;
    try { await AdminService.removeCategory(item.id); await load(); await showSuccess("Kategori berhasil dihapus"); }
    catch (error: unknown) { const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Kategori mungkin masih dipakai oleh produk."; await showError("Kategori belum dapat dihapus", message); }
  };
  return <div className="flex min-h-screen bg-[#f8f5f1]"><AdminSidebar /><main className="min-w-0 flex-1 p-6 md:p-10"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[#806b59]">Katalog produk</p><h1 className="font-luxury text-4xl">Categories</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#806b59]">Kategori adalah jenis produk. Subkategori membantu pelanggan menemukan koleksi yang lebih spesifik.</p></div><button onClick={() => startAdd()} className="inline-flex items-center gap-2 rounded-xl bg-[#b88a55] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(184,138,85,.22)]"><Plus className="size-4" /> Tambah Kategori</button></header>
    <div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-[#eadfd4] bg-white p-5"><Layers3 className="size-5 text-[#b88a55]" /><p className="mt-3 text-2xl font-semibold text-[#40342d]">{parents.length}</p><p className="text-sm text-[#806b59]">Kategori utama</p></div><div className="rounded-2xl border border-[#eadfd4] bg-white p-5"><FolderPlus className="size-5 text-[#b88a55]" /><p className="mt-3 text-2xl font-semibold text-[#40342d]">{items.filter((item) => item.parent_id).length}</p><p className="text-sm text-[#806b59]">Subkategori</p></div><div className="rounded-2xl border border-[#eadfd4] bg-[#fffaf3] p-5 text-sm leading-6 text-[#806b59]">Contoh: <b className="text-[#40342d]">Kebaya</b> adalah kategori, sedangkan <b className="text-[#40342d]">Premium</b> adalah subkategori.</div></div>
    {open && <form onSubmit={(event) => void save(event)} className="mt-6 overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-[0_12px_35px_rgba(73,48,30,.08)]"><div className="flex items-center justify-between border-b border-[#eee5dc] px-6 py-5"><div><h2 className="font-luxury text-2xl">{editing ? "Edit kategori" : presetParent ? "Tambah subkategori" : "Tambah kategori"}</h2><p className="mt-1 text-xs text-[#806b59]">Description tidak diperlukan dan sengaja tidak ditampilkan.</p></div><button type="button" onClick={close} className="rounded-full p-2 text-[#806b59] hover:bg-[#f5eadb]"><X className="size-5" /></button></div><div className="grid gap-5 p-6 md:grid-cols-[1.2fr_1fr_.55fr]"><label className="text-sm font-medium text-[#644e3b]">Nama kategori<input autoFocus required name="name" defaultValue={editing?.name || ""} placeholder="Contoh: Kebaya atau Premium" className="mt-2 w-full rounded-xl border border-[#eadfd4] bg-[#fffcf8] px-4 py-3 text-sm outline-none focus:border-[#b88a55]" /></label><label className="text-sm font-medium text-[#644e3b]">Kategori utama<select name="parent_id" defaultValue={editing?.parent_id || presetParent || ""} className="mt-2 w-full rounded-xl border border-[#eadfd4] bg-[#fffcf8] px-4 py-3 text-sm outline-none focus:border-[#b88a55]"><option value="">Ini kategori utama</option>{parents.filter((parent) => parent.id !== editing?.id).map((parent) => <option key={parent.id} value={parent.id}>{parent.name}</option>)}</select></label><label className="text-sm font-medium text-[#644e3b]">Urutan<input name="sort_order" type="number" min="0" defaultValue={editing?.sort_order ?? 0} className="mt-2 w-full rounded-xl border border-[#eadfd4] bg-[#fffcf8] px-4 py-3 text-sm outline-none focus:border-[#b88a55]" /></label></div><div className="flex justify-end border-t border-[#eee5dc] bg-[#fcfaf7] px-6 py-4"><button disabled={saving} className="rounded-xl bg-[#2d241f] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan"}</button></div></form>}
    <section className="mt-6 space-y-4">{parents.map((parent) => { const children = childrenOf(parent); return <article key={parent.id} className="overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-[0_8px_25px_rgba(73,48,30,.05)]"><div className="flex flex-wrap items-center gap-4 p-5"><span className="flex size-11 items-center justify-center rounded-xl bg-[#f5eadb] text-[#b88a55]"><Layers3 className="size-5" /></span><div className="min-w-[160px] flex-1"><h2 className="font-medium text-[#40342d]">{parent.name}</h2><p className="mt-1 text-xs text-[#806b59]">Kategori utama · {children.length} subkategori</p></div><button onClick={() => startAdd(parent.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8c2ab] px-3 py-2 text-xs font-medium text-[#806b59] hover:bg-[#fff7ec]"><Plus className="size-3.5" /> Tambah Subkategori</button><button onClick={() => edit(parent)} className="inline-flex items-center gap-1 text-sm text-[#a07750]"><Pencil className="size-4" /> Edit</button><button onClick={() => void remove(parent)} className="inline-flex items-center gap-1 text-sm text-rose-600"><Trash2 className="size-4" /> Hapus</button></div><div className="border-t border-[#eee5dc] bg-[#fcfaf7] px-5 py-4">{children.length ? <div className="flex flex-wrap gap-2">{children.map((child) => <span key={child.id} className="inline-flex items-center gap-2 rounded-full border border-[#eadfd4] bg-white px-3 py-2 text-xs text-[#644e3b]"><FolderPlus className="size-3.5 text-[#b88a55]" />{child.name}<button onClick={() => edit(child)} title="Edit subkategori"><Pencil className="size-3.5 text-[#a07750]" /></button><button onClick={() => void remove(child)} title="Hapus subkategori"><Trash2 className="size-3.5 text-rose-600" /></button></span>)}</div> : <p className="text-xs text-[#967e6b]">Belum ada subkategori.</p>}</div></article>; })}{!parents.length && <div className="rounded-2xl border border-dashed border-[#d8c2ab] p-12 text-center text-sm text-[#806b59]">Belum ada kategori. Mulai dengan Kebaya, Dress, Rok, Kemeja Pria, Hijab, atau Accessories.</div>}</section></div></main></div>;
}
