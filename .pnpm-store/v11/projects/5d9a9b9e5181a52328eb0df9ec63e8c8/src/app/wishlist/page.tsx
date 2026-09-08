"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import MainLayout from "@/components/layout/MainLayout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";
import Empty from "@/components/common/Empty";
import ProductCard from "@/components/product/ProductCard";
import { useWishlist, useWishlistActions } from "@/hooks/useWishlist";
import { CustomerSession } from "@/lib/session";

export default function WishlistPage() {
  const router = useRouter();
  const hasToken = CustomerSession.has();
  const { data, isLoading, isError } = useWishlist();
  const { remove } = useWishlistActions();
  const items = data?.data ?? [];
  useEffect(() => { if (!CustomerSession.has()) router.replace("/login?next=/wishlist"); }, [router]);
  if (!hasToken) return <MainLayout><Loading /></MainLayout>;
  if (isLoading) return <MainLayout><Loading /></MainLayout>;
  if (isError) return <MainLayout><Empty title="Please sign in to view your wishlist" /></MainLayout>;
  return <MainLayout><section className="container-custom py-12"><h1 className="font-luxury text-5xl">Wishlist</h1>{!items.length ? <Empty title="Your wishlist is empty" /> : <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{items.map((item: any) => <div key={item.id}><ProductCard product={item.product} /><button className="mt-3 text-sm text-destructive" onClick={() => remove.mutate(item.product_id)}>Remove from wishlist</button></div>)}</div>}</section></MainLayout>;
}
