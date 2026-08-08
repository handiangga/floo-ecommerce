"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminSession } from "@/lib/session";
import { AdminService } from "@/services/admin.service";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status?: string;
  createdAt?: string;
};

export default function CustomersPage() {
  const router = useRouter();
  const [items, setItems] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!AdminSession.has()) {
      router.replace("/admin/login");
      return;
    }

    AdminService.customers()
      .then((result) => setItems(result.data ?? []))
      .catch((requestError: { response?: { status?: number } }) => {
        if ([401, 403].includes(requestError.response?.status ?? 0)) {
          AdminSession.clear();
          router.replace("/admin/login");
        } else {
          setError("Data customer belum dapat dimuat.");
        }
      });
  }, [router]);

  const visible = useMemo(
    () =>
      items.filter((item) =>
        (item.name + " " + item.email).toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Customer relationship</p>
              <h1 className="font-luxury text-4xl">Customers</h1>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm shadow-sm">
              <Users className="size-4 text-primary" />{items.length} customer
            </div>
          </div>
          {error && <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau email customer" className="w-full rounded-xl border bg-white py-3 pl-9 pr-3 text-sm" />
          </div>
          <section className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-muted/60 text-xs text-muted-foreground"><tr><th className="p-4">CUSTOMER</th><th className="p-4">KONTAK</th><th className="p-4">BERGABUNG</th><th className="p-4">STATUS</th></tr></thead>
                <tbody>{visible.map((item) => <tr key={item.id} className="border-t"><td className="p-4 font-medium">{item.name}</td><td className="p-4"><p>{item.email}</p><p className="text-xs text-muted-foreground">{item.phone || "—"}</p></td><td className="p-4 text-muted-foreground">{item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "—"}</td><td className="p-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">{item.status || "ACTIVE"}</span></td></tr>)}</tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
