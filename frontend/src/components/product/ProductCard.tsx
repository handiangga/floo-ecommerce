"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

import { Product } from "@/types/product";
import { ProductService } from "@/services/product.service";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const getImageUrl = (image?: { image_url?: string; image?: string }) => {
    const value = image?.image_url?.trim() || image?.image?.trim();

    return value && (value.startsWith("/") || /^https?:\/\//.test(value))
      ? value
      : undefined;
  };

  const thumbnail =
    getImageUrl({ image_url: product.image_url }) ||
    getImageUrl(product.images?.[0]) ||
    "/images/products/default-product.png";

  const hoverImage = getImageUrl(product.images?.[1]);

  const variant = product.variants?.[0];

  const price = variant?.discount_price || variant?.price || 0;

  const oldPrice = variant?.discount_price ? variant.price : undefined;

  return (
    <motion.div
      onMouseEnter={() => {
        queryClient.prefetchQuery({
          queryKey: ["product", product.slug],
          queryFn: () => ProductService.getBySlug(product.slug),
          staleTime: 1000 * 60 * 5,
        });
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} prefetch>
        <div className="overflow-hidden rounded-[30px] bg-white shadow-sm transition duration-300 hover:shadow-xl">
          {/* IMAGE */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={thumbnail}
              alt={product.name}
              fill
              sizes="(max-width:768px) 100vw, 25vw"
              className={`object-cover transition duration-700 ${
                hoverImage ? "group-hover:opacity-0" : "group-hover:scale-110"
              }`}
            />

            {hoverImage && (
              <Image
                src={hoverImage}
                alt={product.name}
                fill
                sizes="(max-width:768px) 100vw, 25vw"
                className="object-cover opacity-0 transition duration-700 group-hover:opacity-100 group-hover:scale-110"
              />
            )}

            {/* BADGE */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.is_best_seller && (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow">
                  BEST SELLER
                </span>
              )}

              {product.is_new_arrival && (
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow">
                  NEW
                </span>
              )}
            </div>

            {/* WISHLIST */}
            <button
              type="button"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110"
            >
              <Heart size={18} />
            </button>

            {/* HOVER ACTION */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3 opacity-0 transition duration-300 group-hover:opacity-100">
              <button
                type="button"
                className="rounded-full bg-white p-3 shadow-lg transition hover:scale-110"
              >
                <Eye size={18} />
              </button>

              <button
                type="button"
                className="rounded-full bg-primary p-3 text-white shadow-lg transition hover:scale-110"
              >
                <ShoppingBag size={18} />
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-5">
            <div className="mb-2 flex items-center gap-1 text-sm">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />

              <span>5.0</span>

              <span className="text-muted-foreground">(Coming Soon)</span>
            </div>

            <h3 className="line-clamp-2 text-lg font-medium">{product.name}</h3>

            <div className="mt-3 flex items-center gap-2">
              {oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  Rp{oldPrice.toLocaleString("id-ID")}
                </span>
              )}

              <span className="text-xl font-bold text-primary">
                Rp{price.toLocaleString("id-ID")}
              </span>
            </div>

            {variant && (
              <p className="mt-2 text-sm text-muted-foreground">
                Stock {variant.stock}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
