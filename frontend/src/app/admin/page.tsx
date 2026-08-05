"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";

export default function AdminPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("admin_access_token")) {
      router.replace("/admin/login");
      return;
    }
    AdminService.dashboard()
      .then((result) => setOverview(result.data))
      .catch((requestError: { response?: { status?: number } }) => {
        if ([401, 403].includes(requestError.response?.status ?? 0)) {
          localStorage.removeItem("admin_access_token");
          router.replace("/admin/login");
          return;
        }
        setError("Dashboard belum dapat dimuat. Coba refresh halaman.");
      });
  }, [router]);

  if (!overview && !error) return <main className="grid min-h-screen place-items-center">Loading dashboard…</main>;
  if (error) return <div className="flex min-h-screen bg-muted"><AdminSidebar /><main className="grid flex-1 place-items-center p-6"><div className="rounded-2xl bg-white p-7 text-center shadow-sm"><h1 className="font-luxury text-3xl">Dashboard</h1><p className="mt-3 text-sm text-muted-foreground">{error}</p><button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm text-white">Refresh</button></div></main></div>;

  const cards = [["Revenue", "Rp" + (overview?.total_revenue ?? 0).toLocaleString("id-ID")], ["Orders", overview?.total_orders ?? 0], ["Products", overview?.total_products ?? 0], ["Customers", overview?.total_customers ?? 0]];
  return <div className="flex min-h-screen bg-muted"><AdminSidebar /><main className="flex-1 p-6 md:p-10"><p className="text-sm font-medium text-primary">FLOO FASHION</p><h1 className="font-luxury text-4xl">Admin Dashboard</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>)}</div></main></div>;
}
