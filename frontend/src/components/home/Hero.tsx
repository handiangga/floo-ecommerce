"use client";

import Image from "next/image";
import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import { motion } from "framer-motion";

import Loading from "@/components/common/Loading";
import { useBanners } from "@/hooks/useBanner";
import { Banner } from "@/types/banner";

const fallbackBanner: Banner = {
  id: "floo-campaign-2026",
  title: "Elegance in Every Detail",
  description:
    "Kebaya premium dengan detail mewah, dirancang untuk momen berharga Anda.",
  image: "/images/hero/floo-campaign-2026.png",
  link: "/new-arrival",
  button_text: "Shop Collection",
  sort_order: 0,
};

export default function Hero() {
  const { data, isLoading, isError } = useBanners();

  if (isLoading) return <Loading />;

  const fetchedBanners: Banner[] = !isError ? data?.data?.data || [] : [];
  const banners = fetchedBanners.filter((banner) => banner.image?.trim());
  const visibleBanners = banners.length ? banners : [fallbackBanner];
  const usesManagedBanners = banners.length > 0;

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
      className="h-[92vh] min-h-[680px]"
    >
      {visibleBanners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <section className="relative h-[92vh] min-h-[680px] overflow-hidden">
            <motion.div
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 7, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority
                sizes="100vw"
                unoptimized
                className="object-cover"
              />
            </motion.div>

            {usesManagedBanners ? (
              <Link
                href={banner.link || "/products"}
                aria-label={`Lihat ${banner.title}`}
                className="absolute inset-0 z-[1]"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />

                <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10">
                  <div className="max-w-xl text-white">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.65, delay: 0.1 }}
                      className="mb-5 text-xs uppercase tracking-[0.42em] text-[#e6c18d]"
                    >
                      NEW COLLECTION
                    </motion.p>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.75, delay: 0.2 }}
                      className="font-luxury text-5xl leading-[1.02] md:text-7xl"
                    >
                      {banner.title}
                    </motion.h1>

                    {banner.description && (
                      <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.32 }}
                        className="mt-7 max-w-md text-base leading-8 text-white/85"
                      >
                        {banner.description}
                      </motion.p>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.45 }}
                      className="mt-9 flex flex-wrap gap-3"
                    >
                      <Link
                        href={banner.link}
                        className="rounded-full bg-[#b88a55] px-7 py-3.5 text-sm font-medium text-white transition duration-300 hover:scale-[1.03] hover:bg-[#c89b65]"
                      >
                        {banner.button_text || "Shop Collection"}
                      </Link>

                      <Link
                        href="#floo-story"
                        className="flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-sm backdrop-blur-sm transition duration-300 hover:border-white hover:bg-white hover:text-[#2d241f]"
                      >
                        Watch Campaign
                        <ChevronRight size={18} />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
              </>
            )}
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
