"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Empty from "@/components/common/Empty";
import Loading from "@/components/common/Loading";
import MainLayout from "@/components/layout/MainLayout";
import { OrderService } from "@/services/order.service";
import { Order } from "@/types/order";
import { CustomerSession } from "@/lib/session";

const money = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => { if (!CustomerSession.has()) { router.replace("/login?next=/orders"); return; } OrderService.getMyOrders().then((result) => setOrders(result.data ?? [])).catch(() => setOrders([])); }, [router]);
  if (orders === null) return <MainLayout><Loading /></MainLayout>;
  if (!orders.length) return <MainLayout><section className="container-custom py-12"><h1 className="font-luxury text-5xl">My Orders</h1><Empty title="No orders yet, or please sign in first." /></section></MainLayout>;
  return <MainLayout><section className="container-custom py-12"><h1 className="font-luxury text-5xl">My Orders</h1><div className="mt-8 space-y-4">{orders.map((order) => <Link key={order.id} href={`/orders/${order.id}`} className="block rounded-2xl border border-border p-6 transition hover:border-primary"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{order.invoice}</p><p className="mt-1 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("id-ID")}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary">{order.status.replaceAll("_", " ")}</span></div><div className="mt-5 flex justify-between border-t border-border pt-4"><span className="text-muted-foreground">Total</span><span className="font-semibold">{money(order.total)}</span></div></Link>)}</div></section></MainLayout>;
}
