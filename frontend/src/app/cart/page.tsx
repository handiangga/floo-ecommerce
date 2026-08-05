"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/common/Loading";
import Empty from "@/components/common/Empty";
import { useCart, useCartActions } from "@/hooks/useCart";

const money = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

export default function CartPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useCart();
  const { update, remove } = useCartActions();
  const cart = data?.data?.cart;
  const summary = data?.data?.summary;
  const items = cart?.items ?? [];
  useEffect(() => { if (!localStorage.getItem("access_token")) router.replace("/login?next=/cart"); }, [router]);

  if (isLoading) return <MainLayout><Loading /></MainLayout>;
  if (isError) return <MainLayout><Empty title="Please sign in to view your cart" /></MainLayout>;

  return <MainLayout><section className="container-custom py-12"><h1 className="font-luxury text-5xl">Shopping Bag</h1>{!items.length ? <Empty title="Your bag is empty" /> : <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]"><div className="space-y-4">{items.map((item: any) => <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border p-5"><div><p className="font-medium">{item.product_variant?.product?.name ?? item.product_variant?.sku}</p><p className="mt-1 text-sm text-muted-foreground">{money(item.price)} · Stock {item.product_variant?.stock}</p></div><div className="flex items-center gap-3"><button onClick={() => update.mutate({ id: item.id, qty: Math.max(1, item.qty - 1) })}>−</button><span>{item.qty}</span><button onClick={() => update.mutate({ id: item.id, qty: item.qty + 1 })}>+</button><button className="ml-3 text-sm text-destructive" onClick={() => remove.mutate(item.id)}>Remove</button></div></div>)}</div><aside className="h-fit rounded-2xl bg-muted p-6"><h2 className="text-xl font-semibold">Order Summary</h2><div className="mt-5 flex justify-between"><span>Subtotal</span><span>{money(summary?.selected_subtotal ?? 0)}</span></div><Link href="/checkout" className="mt-6 block rounded-full bg-primary py-3 text-center font-medium text-white">Proceed to Checkout</Link></aside></div>}</section></MainLayout>;
}
