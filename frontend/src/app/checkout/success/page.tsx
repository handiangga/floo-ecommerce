"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock3, Package, ShoppingBag } from "lucide-react";
import { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<MainLayout><section className="container-custom min-h-[70vh] py-12" /></MainLayout>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const isPending = params.get("payment") === "pending";
  return <MainLayout><section className="container-custom grid min-h-[70vh] max-w-2xl place-items-center py-12"><div className="w-full border border-[#eadfd4] bg-white p-8 text-center shadow-[0_18px_45px_rgba(74,50,30,.08)] md:p-12"><span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#edf4e8] text-[#6d9855]"><CheckCircle2 className="size-9" /></span><p className="mt-6 text-xs uppercase tracking-[.25em] text-[#b88a55]">Pesanan diterima</p><h1 className="mt-3 font-luxury text-4xl md:text-5xl">{isPending ? "Menunggu Pembayaran" : "Terima kasih"}</h1><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">{isPending ? "Pesananmu berhasil dibuat. Selesaikan pembayaran sesuai instruksi yang tersedia pada detail pesanan." : "Pesananmu sedang kami siapkan dengan penuh perhatian."}</p>{orderId && <div className="mt-6 flex items-center justify-center gap-2 bg-[#fcf8f2] p-4 text-sm"><Clock3 className="size-4 text-[#b88a55]" /> Nomor pesanan: <strong>#{orderId}</strong></div>}<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href={orderId ? "/orders/" + orderId : "/orders"} className="inline-flex items-center justify-center gap-2 bg-[#2d241f] px-5 py-3 text-sm text-white"><Package className="size-4" /> Lihat detail pesanan</Link><Link href="/products" className="inline-flex items-center justify-center gap-2 border border-[#d8c2a9] px-5 py-3 text-sm text-[#574438]"><ShoppingBag className="size-4" /> Lanjut belanja</Link></div></div></section></MainLayout>;
}
