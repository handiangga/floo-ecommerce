import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";

type PolicySection = {
  title: string;
  body?: string[];
  children?: ReactNode;
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: PolicySection[];
};

export default function PolicyPage({ eyebrow, title, intro, updated, sections }: PolicyPageProps) {
  return (
    <MainLayout>
      <section className="border-b border-[#e9e2d8] bg-[#f5f0e9] pt-16">
        <div className="container-custom py-14 sm:py-20">
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#946335] transition hover:text-[#2d241f]">
            <ArrowLeft className="size-3.5" /> Kembali ke beranda
          </Link>
          <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.25em] text-[#a26c36]">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-luxury text-4xl leading-tight text-[#29231f] sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#665b52] sm:text-base">{intro}</p>
          <p className="mt-7 text-xs text-[#8d8177]">Terakhir diperbarui: {updated}</p>
        </div>
      </section>

      <section className="bg-[#fdfbf8] py-12 sm:py-16">
        <article className="container-custom max-w-3xl">
          <div className="rounded-[2rem] border border-[#e9e2d8] bg-white px-6 py-3 shadow-[0_12px_40px_rgba(65,45,30,0.05)] sm:px-10">
            {sections.map((section, index) => (
              <section key={section.title} className={index ? "border-t border-[#eee7df] py-8" : "py-8"}>
                <h2 className="font-luxury text-2xl text-[#29231f] sm:text-3xl">{section.title}</h2>
                {section.body?.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-7 text-[#665b52] sm:text-[15px]">{paragraph}</p>)}
                {section.children}
              </section>
            ))}
          </div>
        </article>
      </section>
    </MainLayout>
  );
}
