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
    <section className="py-24">
      <div className="container-custom">
        <div className="mb-14 text-center">
          <p className="text-primary tracking-[0.35em] uppercase text-sm">
            Collection
          </p>

          <h2 className="font-luxury mt-3 text-5xl">Shop By Category</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/category/${item.slug}`}>
                <div className="group overflow-hidden rounded-[34px] bg-white shadow-lg">
                  <div className="relative h-[380px] overflow-hidden">
                    <Image
                      src={item.image || "/images/category/default.png"}
                      alt={item.name}
                      fill
                      sizes="(max-width:768px) 100vw,
         (max-width:1200px) 50vw,
         25vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="font-luxury text-3xl">{item.name}</h3>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Explore Collection
                      </p>
                    </div>

                    <div className="rounded-full bg-primary p-3 text-white">
                      <ArrowRight size={18} />
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
