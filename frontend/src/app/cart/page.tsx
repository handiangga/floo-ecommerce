"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Package, Plus, ShoppingBag, Trash2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/common/Loading";
import Empty from "@/components/common/Empty";
import { useCart, useCartActions } from "@/hooks/useCart";
import { CustomerSession } from "@/lib/session";
import { confirmDelete, showError } from "@/lib/alert";

const money = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

type CartItem = {
  id: number;
  qty: number;
  price: number;
  variant?: {
    sku?: string;
    stock?: number;
    color?: { name?: string; code?: string };
    size?: { name?: string };
    product?: {
      name?: string;
      slug?: string;
      image_url?: string;
      image_path?: string;
      images?: { image?: string; image_url?: string; alt?: string }[];
    };
  };
  product_variant?: CartItem["variant"];
};

function imageUrl(item: CartItem) {
  const product = item.variant?.product || item.product_variant?.product;
  const candidate =
    product?.images?.[0]?.image ||
    product?.images?.[0]?.image_url ||
    product?.image_url ||
    product?.image_path;
  return candidate &&
    (candidate.startsWith("/") || /^https?:\/\//.test(candidate))
    ? candidate
    : "/images/products/default-product.png";
}

export default function CartPage() {
  const router = useRouter();
  const hasToken = CustomerSession.has();
  const { data, isLoading, isError } = useCart();
  const { update, remove } = useCartActions();
  const cart = data?.data?.cart;
  const summary = data?.data?.summary;
  const items = (cart?.items ?? []) as CartItem[];

  useEffect(() => {
    if (!CustomerSession.has()) router.replace("/login?next=/cart");
  }, [router]);

  const updateQuantity = async (item: CartItem, qty: number) => {
    const variant = item.variant || item.product_variant;
    if (qty > Number(variant?.stock ?? 0)) {
      await showError(
        "Stok tidak mencukupi",
        "Jumlah melebihi stok yang tersedia.",
      );
      return;
    }
    update.mutate({ id: item.id, qty });
  };

  const removeItem = async (item: CartItem) => {
    const variant = item.variant || item.product_variant;
    const confirmed = await confirmDelete(
      "produk dari keranjang",
      variant?.product?.name || "Produk ini akan dihapus dari keranjang.",
    );
    if (confirmed) remove.mutate(item.id);
  };

  if (!hasToken)
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  if (isLoading)
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  if (isError)
    return (
      <MainLayout>
        <Empty title="Silakan masuk untuk melihat keranjangmu" />
      </MainLayout>
    );

  return (
    <MainLayout>
      <section className="container-custom py-10 md:py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-primary">
              Floo Fashion
            </p>
            <h1 className="mt-2 font-luxury text-4xl md:text-5xl">
              Shopping Bag
            </h1>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            {summary?.selected_item || 0} item dipilih
          </p>
        </div>

        {!items.length ? (
          <div className="mt-10">
            <Empty title="Keranjangmu masih kosong" />
          </div>
        ) : (
          <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {items.map((item) => {
                const variant = item.variant || item.product_variant;
                const product = variant?.product;
                const colorName = variant?.color?.name || "Belum dipilih";
                const sizeName = variant?.size?.name || "Belum dipilih";
                const stock = Number(variant?.stock ?? 0);

                return (
                  <article
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-[#eadfd4] bg-white p-4 shadow-[0_8px_24px_rgba(73,48,27,.05)] sm:gap-5 sm:p-5"
                  >
                    <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f7f0e8] sm:h-32 sm:w-24">
                      <img
                        src={imageUrl(item)}
                        alt={product?.name || "Produk Floo Fashion"}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src =
                            "/images/products/default-product.png";
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate font-luxury text-xl text-[#2d241f] sm:text-2xl">
                            {product?.name ||
                              variant?.sku ||
                              "Produk Floo Fashion"}
                          </h2>
                          <p className="mt-1 text-xs text-muted-foreground">
                            SKU: {variant?.sku || "-"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void removeItem(item)}
                          className="rounded-full p-2 text-muted-foreground transition hover:bg-red-50 hover:text-destructive"
                          aria-label="Hapus produk dari keranjang"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7efe5] px-3 py-1.5 text-[#6a4c34]">
                          <i
                            className="size-2.5 rounded-full border border-black/10"
                            style={{
                              backgroundColor:
                                variant?.color?.code || "#c9b09a",
                            }}
                          />
                          Warna: <strong>{colorName}</strong>
                        </span>
                        <span className="rounded-full bg-[#f7efe5] px-3 py-1.5 text-[#6a4c34]">
                          Ukuran: <strong>{sizeName}</strong>
                        </span>
                      </div>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                        <div>
                          <p className="font-semibold text-[#2d241f]">
                            {money(Number(item.price || 0))}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {stock > 0
                              ? `Stok tersedia: ${stock}`
                              : "Stok habis"}
                          </p>
                        </div>
                        <div className="flex items-center rounded-full border border-[#ddc8b1] bg-[#fdfaf6] p-1">
                          <button
                            type="button"
                            onClick={() =>
                              void updateQuantity(
                                item,
                                Math.max(1, item.qty - 1),
                              )
                            }
                            disabled={item.qty <= 1 || update.isPending}
                            className="grid size-8 place-items-center rounded-full text-[#664c39] transition hover:bg-[#f1e4d5] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Kurangi jumlah"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="min-w-8 text-center text-sm font-semibold">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              void updateQuantity(item, item.qty + 1)
                            }
                            disabled={item.qty >= stock || update.isPending}
                            className="grid size-8 place-items-center rounded-full text-[#664c39] transition hover:bg-[#f1e4d5] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Tambah jumlah"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-2xl border border-[#eadfd4] bg-[#fcf8f3] p-6 shadow-[0_10px_28px_rgba(73,48,27,.06)] lg:sticky lg:top-28">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-full bg-[#f3e5d4] text-primary">
                  <ShoppingBag className="size-4" />
                </span>
                <h2 className="font-luxury text-2xl">Order Summary</h2>
              </div>
              <div className="mt-6 border-y border-[#eadfd4] py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal produk</span>
                  <strong>{money(summary?.selected_subtotal ?? 0)}</strong>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Ongkir dan diskon voucher akan dihitung di halaman checkout.
                </p>
              </div>
              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9d7145]"
              >
                <Package className="size-4" /> Lanjut ke Checkout
              </Link>
              <Link
                href="/products"
                className="mt-4 block text-center text-sm text-[#74553d] hover:underline"
              >
                Lanjut belanja
              </Link>
            </aside>
          </div>
        )}
      </section>
    </MainLayout>
  );
}
