"use client";

import Image from "next/image";
import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import { motion } from "framer-motion";

import Loading from "@/components/common/Loading";
import Empty from "@/components/common/Empty";

import { useBanners } from "@/hooks/useBanner";
import { Banner } from "@/types/banner";

export default function Hero() {
  const { data, isLoading, isError } = useBanners();

  if (isLoading) return <Loading />;

  if (isError) return <Empty title="Failed to load banner" />;

  const banners: Banner[] = data?.data?.data || [];

  if (banners.length === 0) {
    return <Empty title="Banner not found" />;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      effect="fade"
      loop
      speed={1000}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation
      className="h-screen"
    >
      {banners.filter((banner) => banner.image?.trim()).map((banner) => (
        <SwiperSlide key={banner.id}>
          <section className="relative h-[92vh] min-h-[720px] overflow-hidden">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority
              sizes="100vw"
              unoptimized
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />

            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10">
              <div className="max-w-xl text-white">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 tracking-[0.4em] uppercase text-sm text-[#d8b68d]"
                >
                  NEW COLLECTION
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-luxury text-5xl leading-tight md:text-7xl"
                >
                  {banner.title}
                </motion.h1>

                {banner.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 max-w-md text-base leading-8 text-white/80"
                  >
                    {banner.description}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-10 flex flex-wrap gap-4"
                >
                  <Link
                    href={banner.link}
                    className="rounded-full bg-primary px-8 py-4 font-medium text-white transition hover:scale-105"
                  >
                    {banner.button_text || "Shop Now"}
                  </Link>

                  <Link
                    href="/products"
                    className="flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 backdrop-blur transition hover:bg-white hover:text-black"
                  >
                    View Collection
                    <ChevronRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
