"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/category";

import Loading from "@/components/common/Loading";
import Empty from "@/components/common/Empty";

export default function Categories() {
  const { data, isLoading, isError } = useCategories();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Empty title="Failed to load categories" />;
  }

  const categories: Category[] = data?.data?.data || [];

  if (categories.length === 0) {
    return <Empty title="No categories found" />;
  }

  return (
    <section className="border-b border-[#e9e2d8] bg-[#fffdf9] py-16 md:py-24">
      <div className="container-custom">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-primary tracking-[0.35em] uppercase text-xs">The Floo Edit</p>
            <h2 className="font-luxury mt-3 text-4xl md:text-5xl">Dress For The Moment</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">Setiap momen punya ceritanya sendiri. Temukan siluet, warna, dan detail yang terasa paling kamu.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {categories.slice(0, 5).map((item, index) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className={index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}
            >
              <Link href={`/category/${item.slug}`}>
                <div className="group relative h-[260px] overflow-hidden bg-[#2d241f] shadow-sm sm:h-[310px] lg:h-full lg:min-h-[250px]">
                  <div className="absolute inset-0">
                    <Image
                      src={item.image || "/images/products/floo-kebaya-rose-01.png"}
                      alt={item.name}
                      fill
                      sizes="(max-width:768px) 100vw,
         (max-width:1200px) 50vw,
         25vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211914]/75 via-[#211914]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white md:p-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">Collection 0{index + 1}</p>
                      <h3 className={`font-luxury mt-2 ${index === 0 ? "text-4xl md:text-5xl" : "text-2xl"}`}>{item.name}</h3>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm transition group-hover:bg-[#b88a55]">
                      <ArrowRight size={17} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
