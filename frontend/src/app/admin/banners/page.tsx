"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Link2, Plus, Trash2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { AdminSession } from "@/lib/session";

type Banner = { id: number; title: string; image?: string; link?: string; status?: string; createdAt?: string };

export default function BannersPage() {
  const router = useRouter();
  const [items, setItems] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const load = () => AdminService.banners().then((result) => setItems(result.data?.data || result.data || []));

  useEffect(() => {
    if (!AdminSession.has()) { router.replace("/admin/login"); return; }
    load().catch((error: { response?: { status?: number } }) => { if ([401, 403].includes(error.response?.status || 0)) { AdminSession.clear(); router.replace("/admin/login"); } else setMessage("Banner belum dapat dimuat."); });
  }, [router]);

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true); setMessage("");
    try { await AdminService.createBanner({ title: String(form.get("title")), image: String(form.get("image") || ""), link: String(form.get("link") || "") }); event.currentTarget.reset(); setShowForm(false); await load(); } catch { setMessage("Banner belum dapat disimpan. Periksa data yang diisi."); } finally { setSaving(false); }
  };
  const remove = async (id: number) => { if (!window.confirm("Hapus banner ini?")) return; try { await AdminService.removeBanner(id); await load(); } catch { setMessage("Banner belum dapat dihapus."); } };

  return <div className="flex min-h-screen bg-[#f8f5f1]"><AdminSidebar /><main className="min-w-0 flex-1 p-6 md:p-10"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[#806b59]">Homepage content</p><h1 className="font-luxury text-4xl">Banners</h1><p className="mt-2 text-sm text-[#806b59]">Kelola visual utama yang tampil pada hero homepage.</p></div><button type="button" onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 bg-[#b88a55] px-4 py-3 text-sm text-white"><Plus className="size-4" /> Tambah Banner</button></div>{message && <p className="mt-5 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{message}</p>}{showForm && <form onSubmit={(event) => void add(event)} className="mt-6 border border-[#eadfd4] bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#f5eadb] text-[#b88a55]"><ImagePlus className="size-5" /></span><div><h2 className="font-luxury text-2xl">Banner Baru</h2><p className="text-xs text-muted-foreground">Gunakan URL gambar yang jelas dan rasio landscape.</p></div></div><div className="mt-5 grid gap-3 md:grid-cols-3"><input required name="title" placeholder="Judul banner" className="border border-[#eadfd4] px-4 py-3 text-sm outline-none focus:border-[#b88a55]" /><input name="image" placeholder="URL gambar banner" className="border border-[#eadfd4] px-4 py-3 text-sm outline-none focus:border-[#b88a55]" /><input name="link" placeholder="Tujuan link, contoh: /new-arrival" className="border border-[#eadfd4] px-4 py-3 text-sm outline-none focus:border-[#b88a55]" /></div><div className="mt-4 flex justify-end gap-3"><button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-[#806b59]">Batal</button><button disabled={saving} className="bg-[#2d241f] px-5 py-2.5 text-sm text-white disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan Banner"}</button></div></form>}<section className="mt-6 overflow-hidden border border-[#eadfd4] bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#fcfaf7] text-[11px] uppercase tracking-[.12em] text-[#806b59]"><tr><th className="p-4">Preview</th><th className="p-4">Banner</th><th className="p-4">Tujuan</th><th className="p-4">Status</th><th className="p-4 text-right">Aksi</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-[#eee5dc]"><td className="p-4"><div className="flex size-14 items-center justify-center overflow-hidden bg-[#f3e8dc] text-[#a07750]">{item.image ? <span className="line-clamp-2 px-2 text-center text-[10px]">IMAGE</span> : <ImagePlus className="size-5" />}</div></td><td className="p-4"><p className="font-medium text-[#40342d]">{item.title}</p><p className="mt-1 max-w-xs truncate text-xs text-[#806b59]">{item.image || "Belum ada gambar"}</p></td><td className="p-4"><span className="inline-flex items-center gap-1 text-xs text-[#806b59]"><Link2 className="size-3" /> {item.link || "/"}</span></td><td className="p-4"><span className="bg-[#edf4e8] px-2.5 py-1 text-xs text-[#6d9855]">{item.status || "ACTIVE"}</span></td><td className="p-4 text-right"><button type="button" onClick={() => void remove(item.id)} className="inline-flex items-center gap-1 text-xs text-rose-600"><Trash2 className="size-4" /> Hapus</button></td></tr>)}</tbody></table></div>{!items.length && <div className="p-12 text-center text-sm text-[#806b59]">Belum ada banner. Tambahkan hero pertama untuk homepage.</div>}</section></div></main></div>;
}
