"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, CreditCard, MapPin, PackageCheck, Ticket, Truck } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/common/Loading";
import { AddressService } from "@/services/address.service";
import { OrderService, PaymentService } from "@/services/order.service";
import { useCart } from "@/hooks/useCart";
import { CustomerSession } from "@/lib/session";

type Address = { id: number; label?: string; receiver_name: string; phone?: string; address: string; city?: string; province?: string; postal_code?: string; is_default?: boolean };
const money = (value: number) => "Rp" + Number(value || 0).toLocaleString("id-ID");
const couriers = [{ value: "JNE Regular", price: 18000, eta: "2-4 hari" }, { value: "J&T EZ", price: 16000, eta: "2-4 hari" }, { value: "SiCepat BEST", price: 20000, eta: "1-3 hari" }, { value: "AnterAja Regular", price: 15000, eta: "2-4 hari" }];

export default function CheckoutPage() {
  const router = useRouter();
  const { data, isLoading: cartLoading } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState("");
  const [courier, setCourier] = useState(couriers[0]);
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [voucher, setVoucher] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const hasSession = CustomerSession.has();

  useEffect(() => {
    if (!CustomerSession.has()) { router.replace("/login?next=/checkout"); return; }
    AddressService.getAll().then((result) => {
      const values = result.data || [];
      setAddresses(values);
      if (values[0]) setAddressId(String(values.find((item: Address) => item.is_default)?.id || values[0].id));
    }).catch(() => setMessage("Alamat belum dapat dimuat. Tambahkan alamat terlebih dahulu."));
  }, [router]);

  const items = data?.data?.cart?.items ?? [];
  const subtotal = Number(data?.data?.summary?.selected_subtotal ?? 0);
  const shipping = courier.price;
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!addressId) { setMessage("Pilih alamat pengiriman terlebih dahulu."); return; }
    setLoading(true);
    setMessage("");
    try {
      const order = await OrderService.checkout({ address_id: Number(addressId), payment_method: paymentMethod, voucher_code: voucher.trim(), courier_service: courier.value, shipping_method: "REGULAR", shipping_cost: shipping, notes });
      const orderId = order.data.id;
      try {
        const payment = await PaymentService.createForOrder(orderId);
        if (payment.data?.payment_url) { window.location.assign(payment.data.payment_url); return; }
      } catch {
        router.replace("/checkout/success?order=" + orderId + "&payment=pending");
        return;
      }
      router.replace("/checkout/success?order=" + orderId + "&payment=pending");
    } catch (error: unknown) {
      const response = error as { response?: { data?: { message?: string } } };
      setMessage(response.response?.data?.message || "Checkout belum berhasil. Periksa alamat, voucher, dan stok produk.");
      setLoading(false);
    }
  };

  if (!hasSession || cartLoading) return <MainLayout><Loading /></MainLayout>;
  if (!items.length) return <MainLayout><section className="container-custom max-w-3xl py-20 text-center"><PackageCheck className="mx-auto size-10 text-[#b88a55]" /><h1 className="mt-4 font-luxury text-4xl">Keranjangmu masih kosong</h1><p className="mt-3 text-sm text-muted-foreground">Pilih koleksi Floo yang ingin kamu bawa pulang terlebih dahulu.</p><Link href="/products" className="mt-7 inline-block bg-[#2d241f] px-6 py-3 text-sm text-white">Lihat koleksi</Link></section></MainLayout>;

  return <MainLayout><section className="container-custom max-w-6xl py-10 md:py-14"><Link href="/cart" className="inline-flex items-center gap-1 text-sm text-[#a07750]"><ChevronRight className="size-4 rotate-180" /> Kembali ke keranjang</Link><div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.25em] text-[#b88a55]">Secure checkout</p><h1 className="mt-2 font-luxury text-4xl md:text-5xl">Selesaikan Pesanan</h1></div><p className="text-sm text-muted-foreground">Langkah 2 dari 2 · Pembayaran aman</p></div><form onSubmit={(event) => void submit(event)} className="mt-8 grid gap-7 lg:grid-cols-[1fr_370px]"><div className="space-y-5"><section className="border border-[#eadfd4] bg-white p-5 md:p-6"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-[#f5eadb] text-[#b88a55]"><MapPin className="size-4" /></span><div><h2 className="font-luxury text-2xl">Alamat Pengiriman</h2><p className="text-xs text-muted-foreground">Pilih alamat penerima pesanan.</p></div></div><div className="mt-5 grid gap-3">{addresses.map((address) => <label key={address.id} className={"cursor-pointer border p-4 transition " + (String(address.id) === addressId ? "border-[#b88a55] bg-[#fcf8f2]" : "border-[#eadfd4] hover:border-[#d5b18a]")}><input className="sr-only" type="radio" name="address_id" value={address.id} checked={String(address.id) === addressId} onChange={() => setAddressId(String(address.id))} /><div className="flex justify-between gap-4"><div><p className="font-medium text-[#40342d]">{address.label || "Alamat"} · {address.receiver_name}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{address.address}, {address.city}, {address.province} {address.postal_code}</p><p className="mt-1 text-xs text-muted-foreground">{address.phone}</p></div>{String(address.id) === addressId && <Check className="size-5 shrink-0 text-[#b88a55]" />}</div></label>)}</div>{!addresses.length && <p className="mt-4 text-sm text-[#a45d52]">Belum ada alamat tersimpan.</p>}<Link href="/account" className="mt-4 inline-block text-sm text-[#a07750]">+ Tambah atau kelola alamat</Link></section><section className="border border-[#eadfd4] bg-white p-5 md:p-6"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-[#f5eadb] text-[#b88a55]"><Truck className="size-4" /></span><div><h2 className="font-luxury text-2xl">Pengiriman</h2><p className="text-xs text-muted-foreground">Pilih layanan yang paling sesuai.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{couriers.map((option) => <label key={option.value} className={"cursor-pointer border p-4 transition " + (courier.value === option.value ? "border-[#b88a55] bg-[#fcf8f2]" : "border-[#eadfd4] hover:border-[#d5b18a]")}><input className="sr-only" type="radio" name="courier" checked={courier.value === option.value} onChange={() => setCourier(option)} /><div className="flex justify-between gap-3"><div><p className="font-medium text-sm">{option.value}</p><p className="mt-1 text-xs text-muted-foreground">{option.eta}</p></div><p className="text-sm font-medium">{money(option.price)}</p></div></label>)}</div></section><section className="border border-[#eadfd4] bg-white p-5 md:p-6"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-[#f5eadb] text-[#b88a55]"><CreditCard className="size-4" /></span><div><h2 className="font-luxury text-2xl">Pembayaran</h2><p className="text-xs text-muted-foreground">Kamu akan diarahkan ke halaman pembayaran aman.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{[{ value: "BANK_TRANSFER", label: "Transfer Bank" }, { value: "QRIS", label: "QRIS" }, { value: "COD", label: "COD" }].map((option) => <label key={option.value} className={"cursor-pointer border px-4 py-3 text-sm transition " + (paymentMethod === option.value ? "border-[#b88a55] bg-[#fcf8f2]" : "border-[#eadfd4]")}><input className="sr-only" type="radio" checked={paymentMethod === option.value} onChange={() => setPaymentMethod(option.value)} />{option.label}</label>)}</div></section><section className="border border-[#eadfd4] bg-white p-5 md:p-6"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-[#f5eadb] text-[#b88a55]"><Ticket className="size-4" /></span><div><h2 className="font-luxury text-2xl">Voucher & Catatan</h2><p className="text-xs text-muted-foreground">Voucher akan divalidasi sebelum pesanan dibuat.</p></div></div><input value={voucher} onChange={(event) => setVoucher(event.target.value.toUpperCase())} placeholder="Masukkan kode voucher" className="mt-5 w-full border border-[#eadfd4] px-4 py-3 text-sm outline-none focus:border-[#b88a55]" /><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Catatan untuk pesanan (opsional)" className="mt-3 min-h-24 w-full border border-[#eadfd4] p-4 text-sm outline-none focus:border-[#b88a55]" /></section></div><aside className="h-fit border border-[#40332a] bg-[#2d241f] p-6 text-[#fffaf5] lg:sticky lg:top-28"><h2 className="font-luxury text-3xl">Ringkasan Pesanan</h2><div className="mt-5 space-y-4 border-b border-white/15 pb-5">{items.map((item: { id: number; qty: number; price: number; product_variant?: { product?: { name?: string }; sku?: string } }) => <div key={item.id} className="flex justify-between gap-4 text-sm"><span className="leading-5 text-white/75">{item.product_variant?.product?.name || item.product_variant?.sku} × {item.qty}</span><span>{money(Number(item.price) * item.qty)}</span></div>)}</div><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between text-white/70"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-white/70"><span>Ongkir · {courier.value}</span><span>{money(shipping)}</span></div><div className="flex justify-between border-t border-white/15 pt-4 text-base font-semibold"><span>Total</span><span>{money(total)}</span></div></div>{message && <p className="mt-5 border border-rose-300/40 bg-rose-950/25 p-3 text-sm text-rose-100">{message}</p>}<button disabled={loading || !addressId} className="mt-6 w-full bg-[#c69a68] py-3.5 text-sm font-medium transition hover:bg-[#d6ad78] disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Membuat pesanan..." : "Lanjut ke pembayaran"}</button><p className="mt-4 text-center text-[11px] leading-5 text-white/55">Dengan melanjutkan, kamu menyetujui syarat dan ketentuan Floo Fashion.</p></aside></form></section></MainLayout>;
}
