"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Empty from "@/components/common/Empty";
import Loading from "@/components/common/Loading";
import ProductCard from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

export default function NewArrival() {
  const { data, isError, isLoading } = useProducts({
    is_new_arrival: true,
    limit: 4,
  });

  const products: Product[] = data?.data ?? [];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Empty title="Failed to load new arrivals" />;
  }

  if (products.length === 0) {
    return <Empty title="No new arrivals found" />;
  }

  return (
    <section className="py-24">
      <div className="container-custom">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="text-primary text-sm uppercase tracking-[0.35em]">
              Just arrived
            </p>

            <h2 className="font-luxury mt-3 text-5xl">New Arrival</h2>
          </div>

          <Link
            href="/new-arrival"
            className="hidden items-center gap-2 text-primary md:flex"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
