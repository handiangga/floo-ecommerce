"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

const products = [
  {
    id: 1,
    name: "Kebaya Kirana Premium",
    image: "/images/products/1.jpg",
    hoverImage: "/images/products/2.jpg",
    price: 329000,
    oldPrice: 399000,
    sold: 1280,
    rating: 4.9,
    badge: "BEST SELLER",
  },
  {
    id: 2,
    name: "Kebaya Maheswari",
    image: "/images/products/2.jpg",
    hoverImage: "/images/products/3.jpg",
    price: 319000,
    oldPrice: 379000,
    sold: 980,
    rating: 4.8,
    badge: "HOT",
  },
  {
    id: 3,
    name: "Kebaya Jasmine",
    image: "/images/products/3.jpg",
    hoverImage: "/images/products/4.jpg",
    price: 349000,
    sold: 840,
    rating: 4.9,
    badge: "NEW",
  },
  {
    id: 4,
    name: "Kebaya Lavina",
    image: "/images/products/4.jpg",
    hoverImage: "/images/products/1.jpg",
    price: 339000,
    sold: 710,
    rating: 5,
  },
];

export default function BestSeller() {
  return (
    <section className="py-24">
      <div className="container-custom">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="text-primary text-sm uppercase tracking-[0.35em]">
              Bestseller
            </p>

            <h2 className="font-luxury mt-3 text-5xl">Most Loved</h2>
          </div>

          <Link
            href="/best-seller"
            className="hidden items-center gap-2 text-primary md:flex"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
