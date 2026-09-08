"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import Empty from "@/components/common/Empty";
import Loading from "@/components/common/Loading";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

export default function BestSeller() {
  const { data, isError, isLoading } = useProducts({
    is_best_seller: true,
    limit: 4,
  });

  const products: Product[] = data?.data ?? [];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Empty title="Failed to load best sellers" />;
  }

  if (products.length === 0) {
    return <Empty title="No best sellers found" />;
  }

  return (
    <section className="bg-[#fcfaf7] py-16 md:py-20">
      <div className="container-custom">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-primary text-[10px] uppercase tracking-[0.35em]">
              Bestseller
            </p>

            <h2 className="font-luxury mt-3 text-4xl md:text-5xl">Most Loved</h2>
          </div>

          <Link
            href="/best-seller"
            className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-primary md:flex"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
