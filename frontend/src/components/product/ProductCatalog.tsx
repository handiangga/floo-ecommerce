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
  categorySlug?: string;
  saleOnly?: boolean;
  description?: string;
}

export default function ProductCatalog({ title, eyebrow = "Floo Fashion", params, categorySlug, saleOnly = false, description }: ProductCatalogProps) {
  const { data, isLoading, isError } = useProducts({ limit: categorySlug || saleOnly ? 100 : 24, ...params });
  const allProducts: Product[] = data?.data ?? [];
  const normalizedSlug = categorySlug?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const products = allProducts.filter((product) => {
    const productCategory = product.category?.slug?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const hasDiscount = product.variants?.some((variant) => Boolean(variant.discount_price && variant.discount_price < variant.price));

    return (!normalizedSlug || productCategory === normalizedSlug) && (!saleOnly || hasDiscount);
  });

  if (isLoading) return <Loading />;
  if (isError) return <Empty title="Failed to load products" />;

  return <section className="container-custom py-12 md:py-16"><div className="mx-auto max-w-2xl text-center"><p className="text-primary text-sm uppercase tracking-[0.35em]">{eyebrow}</p><h1 className="font-luxury mt-3 text-4xl md:text-5xl">{title}</h1>{description && <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">{description}</p>}</div>{products.length ? <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <Empty title={saleOnly ? "Belum ada produk promo saat ini" : "Belum ada produk dalam koleksi ini"} />}</section>;
}
