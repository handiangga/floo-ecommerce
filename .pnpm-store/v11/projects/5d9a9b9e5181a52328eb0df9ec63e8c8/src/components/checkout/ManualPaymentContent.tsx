"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Package,
  ShoppingBag,
  UploadCloud,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/common/Loading";
import { PaymentService } from "@/services/order.service";

type Payment = {
  id: number;
  amount?: number;
  method?: "BANK_TRANSFER" | "QRIS";
  proof_url?: string | null;
  proof_submitted_at?: string | null;
  verification_note?: string | null;
};
const money = (value?: number) =>
  "Rp" + Number(value || 0).toLocaleString("id-ID");

export default function ManualPaymentContent({
  orderId,
}: {
  orderId: string | null;
}) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!orderId) return;
    PaymentService.getForOrder(orderId)
      .then((result) => setPayment(result.data || null))
      .catch(() =>
        setMessage(
          "Instruksi pembayaran belum dapat dimuat. Silakan buka detail pesanan dan coba lagi.",
        ),
      )
      .finally(() => setLoading(false));
  }, [orderId]);

  const uploadProof = async () => {
    if (!payment || !file) {
      setMessage(
        "Pilih foto atau screenshot bukti pembayaran terlebih dahulu.",
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Ukuran bukti pembayaran maksimal 5 MB.");
      return;
    }
    const form = new FormData();
    form.append("proof", file);
    setUploading(true);
    setMessage("");
    try {
      const result = await PaymentService.submitProof(payment.id, form);
      setPayment(result.data || payment);
      setFile(null);
      setMessage(
        "Bukti pembayaran sudah terkirim. Admin akan memverifikasi sebelum pesanan diproses.",
      );
    } catch (error: unknown) {
      const response = error as { response?: { data?: { message?: string } } };
      setMessage(
        response.response?.data?.message ||
          "Bukti belum dapat diunggah. Coba gunakan gambar JPG, PNG, atau WEBP.",
      );
    } finally {
      setUploading(false);
    }
  };

  const isQRIS = payment?.method === "QRIS";
  const submitted = Boolean(payment?.proof_url || payment?.proof_submitted_at);
  if (loading)
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );

  return (
    <MainLayout>
      <section className="container-custom max-w-5xl py-10 md:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#edf4e8] text-[#6d9855]">
            <CheckCircle2 className="size-9" />
          </span>
          <p className="mt-5 text-xs uppercase tracking-[.25em] text-[#b88a55]">
            Pesanan berhasil dibuat
          </p>
          <h1 className="mt-3 font-luxury text-4xl md:text-5xl">
            Selesaikan Pembayaran
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            Bayar sesuai total pesanan, lalu kirim bukti pembayaran agar tim
            Floo Fashion dapat memproses pesananmu.
          </p>
          {orderId && (
            <p className="mt-4 inline-flex items-center gap-2 bg-[#fcf8f2] px-4 py-2 text-sm">
              <Clock3 className="size-4 text-[#b88a55]" /> Nomor pesanan:{" "}
              <strong>#{orderId}</strong>
            </p>
          )}
        </div>
        {message && (
          <p
            className={
              (submitted
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800") +
              " mx-auto mt-7 max-w-2xl border p-4 text-center text-sm"
            }
          >
            {message}
          </p>
        )}
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <section className="border border-[#eadfd4] bg-white p-5 md:p-7">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f5eadb] text-[#b88a55]">
                <CreditCard className="size-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[.18em] text-[#b88a55]">
                  {isQRIS ? "Scan QRIS" : "Transfer BCA"}
                </p>
                <h2 className="mt-1 font-luxury text-3xl">
                  {isQRIS ? "Bayar dengan QRIS" : "Rekening Tujuan"}
                </h2>
              </div>
            </div>
            {payment?.amount && (
              <div className="mt-5 border-y border-[#eadfd4] py-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Total yang perlu dibayar
                  </span>
                  <strong className="text-lg text-[#392a20]">
                    {money(payment.amount)}
                  </strong>
                </div>
              </div>
            )}
            {isQRIS ? (
              <div className="mt-6">
                <div className="mx-auto max-w-sm rounded-[28px] border-2 border-[#d9b676] bg-[#fffdfa] p-3 shadow-[0_12px_30px_rgba(112,76,36,.12)]">
                  <Image
                    src="/images/payment/qris-bca-floo-fashionn.png"
                    alt="QRIS pembayaran Floo Fashion"
                    width={1024}
                    height={1536}
                    className="h-auto w-full rounded-[18px]"
                    priority
                  />
                </div>
                <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                  Buka aplikasi pembayaran pilihanmu, scan QRIS, lalu bayar
                  tepat sesuai total pesanan.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-[#eadfd4] bg-[#fcf8f2] p-5 text-center">
                <p className="text-xs uppercase tracking-[.2em] text-[#a07750]">
                  BCA
                </p>
                <p className="mt-3 font-luxury text-2xl text-[#38291f]">
                  Flora Aldina
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-[.13em] text-[#1b4f98]">
                  0374283614
                </p>
                <p className="mt-4 text-xs leading-5 text-muted-foreground">
                  Transfer tepat sesuai total pesanan agar verifikasi lebih
                  cepat.
                </p>
              </div>
            )}
          </section>
          <aside className="border border-[#40332a] bg-[#2d241f] p-6 text-[#fffaf5]">
            <p className="text-xs uppercase tracking-[.22em] text-[#d4a56f]">
              Langkah terakhir
            </p>
            <h2 className="mt-2 font-luxury text-3xl">Kirim bukti bayar</h2>
            {submitted ? (
              <div className="mt-6 border border-emerald-300/30 bg-emerald-950/20 p-4 text-sm leading-6 text-emerald-100">
                <CheckCircle2 className="mb-2 size-5" /> Bukti sudah diterima.
                Pesanan akan diproses setelah admin mencocokkan pembayaran.
              </div>
            ) : (
              <>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Unggah screenshot/foto bukti transfer atau pembayaran QRIS.
                  Format JPG, PNG, atau WEBP maksimal 5 MB.
                </p>
                <label className="mt-6 flex cursor-pointer flex-col items-center gap-3 border border-dashed border-[#d7ae7d] bg-white/5 p-5 text-center">
                  <UploadCloud className="size-7 text-[#d4a56f]" />
                  <span className="text-sm">
                    {file ? file.name : "Pilih bukti pembayaran"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setFile(event.target.files?.[0] || null)
                    }
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void uploadProof()}
                  disabled={uploading}
                  className="mt-4 w-full bg-[#c69a68] py-3 text-sm font-medium text-white transition hover:bg-[#d6ad78] disabled:opacity-60"
                >
                  {uploading ? "Mengirim bukti..." : "Kirim bukti pembayaran"}
                </button>
              </>
            )}
            {payment?.verification_note && (
              <p className="mt-4 border border-amber-300/25 bg-amber-950/20 p-3 text-xs leading-5 text-amber-100">
                Catatan admin: {payment.verification_note}
              </p>
            )}
            <p className="mt-5 text-xs leading-5 text-white/55">
              Jangan kirim bukti pembayaran kepada siapa pun selain melalui
              halaman Floo Fashion ini.
            </p>
          </aside>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={orderId ? "/orders/" + orderId : "/orders"}
            className="inline-flex items-center justify-center gap-2 bg-[#2d241f] px-5 py-3 text-sm text-white"
          >
            <Package className="size-4" /> Lihat detail pesanan
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-[#d8c2a9] px-5 py-3 text-sm text-[#574438]"
          >
            <ShoppingBag className="size-4" /> Lanjut belanja
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
