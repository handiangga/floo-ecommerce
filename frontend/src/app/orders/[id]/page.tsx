"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Empty from "@/components/common/Empty";
import Loading from "@/components/common/Loading";
import MainLayout from "@/components/layout/MainLayout";
import { OrderService } from "@/services/order.service";
import { Order } from "@/types/order";

const money = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null | undefined>();
  useEffect(() => { OrderService.getMyOrder(id).then((result) => setOrder(result.data as Order)).catch(() => setOrder(null)); }, [id]);
  if (order === undefined) return <MainLayout><Loading /></MainLayout>;
  if (!order) return <MainLayout><Empty title="Order not found" /></MainLayout>;
  return <MainLayout><section className="container-custom max-w-3xl py-12"><Link href="/orders" className="text-sm text-primary">← Back to orders</Link><div className="mt-6 rounded-2xl border border-border p-6"><div className="flex flex-wrap justify-between gap-4"><div><h1 className="font-luxury text-4xl">Order Details</h1><p className="mt-2 text-muted-foreground">{order.invoice}</p></div><span className="h-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary">{order.status.replaceAll("_", " ")}</span></div><div className="mt-8 space-y-4">{order.items.map((item) => <div key={item.id} className="flex justify-between border-b border-border pb-4"><div><p className="font-medium">{item.product_name}</p><p className="text-sm text-muted-foreground">{item.color_name} · {item.size_name} × {item.qty}</p></div><span>{money(item.subtotal)}</span></div>)}</div><div className="mt-6 space-y-2 border-t border-border pt-5"><div className="flex justify-between"><span>Subtotal</span><span>{money(order.subtotal)}</span></div><div className="flex justify-between"><span>Shipping</span><span>{money(order.shipping_cost)}</span></div><div className="flex justify-between font-semibold"><span>Total</span><span>{money(order.total)}</span></div></div></div></section></MainLayout>;
}
