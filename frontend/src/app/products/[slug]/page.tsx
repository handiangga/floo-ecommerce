"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";

import Empty from "@/components/common/Empty";
import Loading from "@/components/common/Loading";
import MainLayout from "@/components/layout/MainLayout";
import { useProduct } from "@/hooks/useProduct";

const formatPrice = (price: number) => `Rp${price.toLocaleString("id-ID")}`;

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data, isError, isLoading } = useProduct(params.slug);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <MainLayout><Loading /></MainLayout>;
  if (isError || !data?.data) {
    return <MainLayout><Empty title="Product not found" /></MainLayout>;
  }

  const product = data.data;
  const variant = product.variants?.[selectedVariant];
  const price = variant?.discount_price ?? variant?.price ?? 0;
  const images = product.images?.length
    ? product.images
    : [{ id: 0, image_url: product.image_url || "/images/default.jpg" }];

  return (
    <MainLayout>
      <section className="container-custom py-10 md:py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
          Home / Collection / {product.name}
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <div key={image.id} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <Image src={image.image_url} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-primary text-sm uppercase tracking-[0.28em]">{product.category?.name ?? "Floo Fashion"}</p>
                <h1 className="font-luxury mt-3 text-4xl md:text-5xl">{product.name}</h1>
              </div>
              <button type="button" aria-label="Add to wishlist" className="rounded-full border border-border p-3 hover:border-primary hover:text-primary"><Heart size={20} /></button>
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              {variant?.discount_price && <span className="text-lg text-muted-foreground line-through">{formatPrice(variant.price)}</span>}
              <span className="text-3xl font-semibold text-primary">{formatPrice(price)}</span>
            </div>
            <p className="mt-7 leading-7 text-muted-foreground">{product.description}</p>
            {product.variants && product.variants.length > 0 && (
              <div className="mt-8">
                <p className="font-medium">Choose variant</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {product.variants.map((item, index) => (
                    <button key={item.id} type="button" onClick={() => { setSelectedVariant(index); setQuantity(1); }} className={`rounded-full border px-4 py-2 text-sm ${selectedVariant === index ? "border-primary bg-primary text-white" : "border-border hover:border-primary"}`}>
                      {item.color?.name ?? "Default"}{item.size ? ` · ${item.size.name}` : ""}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Stock: {variant?.stock ?? 0}</p>
              </div>
            )}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3"><Minus size={16} /></button>
                <span className="min-w-8 text-center">{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(variant?.stock ?? 1, value + 1))} className="p-3"><Plus size={16} /></button>
              </div>
              <button type="button" disabled={!variant || variant.stock === 0} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"><ShoppingBag size={19} /> Add to Cart</button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
