import Image from "next/image";
import { Play } from "lucide-react";

export default function Story() {
  return (
    <section className="py-8 md:py-14">
      <div className="container-custom">
        <div className="relative min-h-[420px] overflow-hidden rounded-[32px] bg-stone-900 md:min-h-[520px]">
          <Image
            src="/images/hero/hero-2.jpg"
            alt="Floo Fashion kebaya collection"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

          <div className="relative flex min-h-[420px] items-center px-7 py-12 md:min-h-[520px] md:px-14">
            <div className="max-w-md text-white">
              <p className="text-sm uppercase tracking-[0.35em] text-[#d8b68d]">
                Floo Fashion
              </p>

              <h2 className="font-luxury mt-4 text-4xl leading-tight md:text-6xl">
                Timeless Elegance
                <br />
                in Every Detail
              </h2>

              <p className="mt-6 max-w-sm leading-7 text-white/80">
                Crafted with love, made for your most beautiful moments.
              </p>

              <div className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-[#e6c18d]">
                <span>Our Story</span>
                <span className="h-px w-12 bg-[#e6c18d]" />
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 flex size-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/20 text-white backdrop-blur-sm md:size-22">
              <Play className="ml-1 size-7 fill-current md:size-8" aria-hidden="true" />
              <span className="sr-only">Our Story video coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
