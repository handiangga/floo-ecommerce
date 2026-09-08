"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Search, Star, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { AdminSession } from "@/lib/session";

type Review = { id: number; rating: number; comment?: string; status?: string; createdAt?: string; customer?: { name: string }; product?: { name: string } };

export default function ReviewsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const load = () => AdminService.reviews().then((result) => setItems(result.data?.data || result.data || []));

  useEffect(() => { if (!AdminSession.has()) { router.replace("/admin/login"); return; } load().catch((error: { response?: { status?: number } }) => { if ([401, 403].includes(error.response?.status || 0)) { AdminSession.clear(); router.replace("/admin/login"); } else setMessage("Ulasan belum dapat dimuat."); }); }, [router]);
  const visible = useMemo(() => items.filter((item) => ((item.customer?.name || "") + " " + (item.product?.name || "") + " " + (item.comment || "")).toLowerCase().includes(search.toLowerCase())), [items, search]);
  const moderate = async (id: number, action: "approve" | "reject") => { try { if (action === "approve") await AdminService.approveReview(id); else await AdminService.rejectReview(id); await load(); } catch { setMessage("Status ulasan belum dapat diperbarui."); } };

  return <div className="flex min-h-screen bg-[#f8f5f1]"><AdminSidebar /><main className="min-w-0 flex-1 p-6 md:p-10"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[#806b59]">Customer feedback</p><h1 className="font-luxury text-4xl">Reviews</h1><p className="mt-2 text-sm text-[#806b59]">Moderasi ulasan sebelum ditampilkan di storefront.</p></div><div className="bg-white px-4 py-3 text-sm shadow-sm"><strong>{items.length}</strong> total ulasan</div></div>{message && <p className="mt-5 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{message}</p>}<label className="relative mt-6 block max-w-md"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#806b59]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari produk atau customer" className="w-full border border-[#eadfd4] bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-[#b88a55]" /></label><section className="mt-5 grid gap-4 lg:grid-cols-2">{visible.map((item) => <article key={item.id} className="border border-[#eadfd4] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="font-medium text-[#40342d]">{item.product?.name || "Produk Floo"}</p><p className="mt-1 text-xs text-[#806b59]">{item.customer?.name || "Customer"} · {item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "Baru"}</p></div><span className={"px-2.5 py-1 text-[11px] " + (item.status === "APPROVED" ? "bg-[#edf4e8] text-[#6d9855]" : item.status === "REJECTED" ? "bg-rose-50 text-rose-600" : "bg-[#fbf3e7] text-[#a07750]")}>{item.status || "PENDING"}</span></div><div className="mt-4 flex gap-1 text-[#b88a55]">{Array.from({ length: 5 }).map((_, index) => <Star key={String(index)} className={"size-4 " + (index < item.rating ? "fill-current" : "text-[#eadfd4]")} />)}</div><p className="mt-4 text-sm leading-6 text-[#5d4c40]">“{item.comment || "Customer belum menuliskan komentar."}”</p><div className="mt-5 flex justify-end gap-2 border-t border-[#eee5dc] pt-4"><button type="button" onClick={() => void moderate(item.id, "reject")} className="inline-flex items-center gap-1 border border-rose-200 px-3 py-2 text-xs text-rose-600"><X className="size-3.5" /> Tolak</button><button type="button" onClick={() => void moderate(item.id, "approve")} className="inline-flex items-center gap-1 bg-[#2d241f] px-3 py-2 text-xs text-white"><Check className="size-3.5" /> Setujui</button></div></article>)}</section>{!visible.length && <div className="mt-5 border border-[#eadfd4] bg-white p-12 text-center text-sm text-[#806b59]">Belum ada review yang sesuai.</div>}</div></main></div>;
}
