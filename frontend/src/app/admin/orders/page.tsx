"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";

type Order = { id: number; invoice: string; status: string; total: number; customer?: { name: string } };
const statuses = ["WAITING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const load = () => AdminService.orders().then((result) => setOrders(result.data ?? []));

  useEffect(() => { if (!localStorage.getItem("admin_access_token")) router.replace("/admin/login"); else load().catch(() => router.replace("/admin/login")); }, [router]);
  const update = (order: Order, status: string) => {
    const courier_service = status === "SHIPPED" ? window.prompt("Courier service (e.g. JNE)") ?? "" : "";
    const tracking_number = status === "SHIPPED" ? window.prompt("Tracking number") ?? "" : "";
    if (status !== "SHIPPED" || (courier_service && tracking_number)) AdminService.updateOrderStatus(order.id, status, { courier_service, tracking_number }).then(load);
  };

  return <div className="flex min-h-screen bg-muted"><AdminSidebar /><main className="flex-1 p-6 md:p-10"><h1 className="font-luxury text-4xl">Orders</h1><div className="mt-8 overflow-x-auto rounded-2xl bg-white p-5 shadow-sm"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">Invoice</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b"><td className="p-3 font-medium">{order.invoice}</td><td className="p-3">{order.customer?.name ?? "—"}</td><td className="p-3">Rp{order.total.toLocaleString("id-ID")}</td><td className="p-3"><select value={order.status} onChange={(event) => update(order, event.target.value)} className="rounded border p-2">{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></main></div>;
}
