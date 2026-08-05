"use client";

import Empty from "@/components/common/Empty";
import Loading from "@/components/common/Loading";
import ProductCard from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Product, ProductQuery } from "@/types/product";

interface ProductCatalogProps {
  title: string;
  eyebrow?: string;
  params?: ProductQuery;
}

export default function ProductCatalog({ title, eyebrow = "Floo Fashion", params }: ProductCatalogProps) {
  const { data, isLoading, isError } = useProducts({ limit: 24, ...params });
  const products: Product[] = data?.data ?? [];

  if (isLoading) return <Loading />;
  if (isError) return <Empty title="Failed to load products" />;

  return <section className="container-custom py-12"><div className="text-center"><p className="text-primary text-sm uppercase tracking-[0.35em]">{eyebrow}</p><h1 className="font-luxury mt-3 text-5xl">{title}</h1></div>{products.length ? <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <Empty title="No products found" />}</section>;
}
