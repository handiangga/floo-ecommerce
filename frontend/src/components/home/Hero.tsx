"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[720px] overflow-hidden">
      {/* Background */}
      <Image
        src="/images/hero/hero-2.jpg"
        alt="Floo Fashionn Hero"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10">
        <div className="max-w-xl text-white">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 tracking-[0.4em] uppercase text-sm text-[#d8b68d]"
          >
            New Collection 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-luxury text-5xl leading-tight md:text-7xl"
          >
            Luxury
            <br />
            Kebaya
            <br />
            Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-md text-base leading-8 text-white/80"
          >
            Discover timeless elegance crafted for weddings, graduations,
            engagements and every unforgettable celebration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/collection"
              className="rounded-full bg-primary px-8 py-4 font-medium text-white transition hover:scale-105"
            >
              Shop Now
            </Link>

            <Link
              href="/new-arrival"
              className="flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-white backdrop-blur transition hover:bg-white hover:text-black"
            >
              View Collection
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Blur */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
