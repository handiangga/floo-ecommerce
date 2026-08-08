"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

import { Product } from "@/types/product";
import { ProductService } from "@/services/product.service";
import { useCartActions } from "@/hooks/useCart";
import { useWishlistActions } from "@/hooks/useWishlist";
import { CustomerSession } from "@/lib/session";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { add: addToCart } = useCartActions();
  const { add: addToWishlist } = useWishlistActions();
  const requireLogin = () => {
    if (CustomerSession.has()) return true;
    router.push(`/login?next=${encodeURIComponent(`/products/${product.slug}`)}`);
    return false;
  };
  const getImageUrl = (image?: { image_url?: string; image?: string }) => {
    const value = image?.image_url?.trim() || image?.image?.trim();

    return value && (value.startsWith("/") || /^https?:\/\//.test(value))
      ? value
      : undefined;
  };

  const thumbnail =
    getImageUrl({ image_url: product.image_url }) ||
    getImageUrl(product.images?.[0]) ||
    "/images/products/floo-kebaya-rose-01.png";

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
        <div className="overflow-hidden rounded-[22px] border border-[#e3d6c8] bg-white shadow-[0_8px_24px_rgba(73,48,27,0.08)] transition duration-300 hover:border-[#c6a37d] hover:shadow-[0_16px_34px_rgba(73,48,27,0.16)]">
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
              {product.is_new_arrival ? (
                <span className="bg-[#fcfaf7]/95 px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-[#2d241f] shadow-sm">
                  NEW
                </span>
              ) : product.is_best_seller && (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow">
                  BEST SELLER
                </span>
              )}
            </div>

            {/* WISHLIST */}
            <button
              type="button"
              onClick={(event) => { event.preventDefault(); event.stopPropagation(); if (requireLogin()) addToWishlist.mutate(product.id); }}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110"
            >
              <Heart size={18} />
            </button>

            {/* HOVER ACTION */}
            <div className="absolute inset-x-4 bottom-4 flex translate-y-3 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={(event) => { event.preventDefault(); event.stopPropagation(); router.push(`/products/${product.slug}`); }}
                className="flex flex-1 items-center justify-center gap-2 bg-white px-3 py-3 text-xs font-medium text-[#2d241f] shadow-lg transition hover:bg-[#fcfaf7]"
              >
                <Eye size={18} />
                Quick View
              </button>

              <button
                type="button"
                disabled={!variant || variant.stock === 0 || addToCart.isPending}
                onClick={(event) => { event.preventDefault(); event.stopPropagation(); if (variant && requireLogin()) addToCart.mutate({ variantId: variant.id, qty: 1 }); }}
                className="flex flex-1 items-center justify-center gap-2 bg-[#2d241f] px-3 py-3 text-xs font-medium text-white shadow-lg transition hover:bg-[#b88a55]"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="border-t border-[#eee6dd] bg-[#fffdf9] p-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-[#a07750]">{product.category?.name || "Floo Collection"}</p>
            <h3 className="line-clamp-2 font-luxury text-[21px] leading-tight">{product.name}</h3>

            <div className="mt-3 flex items-center gap-2">
              {oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  Rp{oldPrice.toLocaleString("id-ID")}
                </span>
              )}

              <span className="text-base font-semibold text-[#2d241f]">
                Rp{price.toLocaleString("id-ID")}
              </span>
            </div>

            {variant && (
              <p className="mt-2 text-xs text-muted-foreground">
                {variant.stock > 0 ? "Ready to ship" : "Sold out"}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
