"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  hoverImage?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  sold?: number;
  badge?: string;
}

export default function ProductCard({
  id,
  name,
  image,
  hoverImage,
  price,
  oldPrice,
  rating = 4.9,
  sold = 0,
  badge,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/product/${id}`}>
        <div className="overflow-hidden rounded-[30px] bg-white shadow-sm transition hover:shadow-xl">
          {/* IMAGE */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className={`object-cover transition duration-700 ${
                hoverImage ? "group-hover:opacity-0" : ""
              }`}
            />

            {hoverImage && (
              <Image
                src={hoverImage}
                alt={name}
                fill
                className="object-cover opacity-0 transition duration-700 group-hover:opacity-100"
              />
            )}

            {/* Badge */}
            {badge && (
              <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-lg">
                {badge}
              </div>
            )}

            {/* Wishlist */}
            <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110">
              <Heart size={18} />
            </button>

            {/* Hover Action */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3 opacity-0 transition duration-300 group-hover:opacity-100">
              <button className="rounded-full bg-white p-3 shadow-lg">
                <Eye size={18} />
              </button>

              <button className="rounded-full bg-primary p-3 text-white shadow-lg">
                <ShoppingBag size={18} />
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-5">
            <div className="mb-2 flex items-center gap-1 text-sm">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />

              <span>{rating}</span>

              <span className="text-muted-foreground">({sold})</span>
            </div>

            <h3 className="line-clamp-2 font-medium text-lg">{name}</h3>

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
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
