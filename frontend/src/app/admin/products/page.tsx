"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Boxes, Edit3, PackageCheck, Plus, Search, Trash2 } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { Product } from "@/types/product";
import { AdminSession } from "@/lib/session";
import { confirmDelete, showError, showSuccess } from "@/lib/alert";

const fallbackImage = "/images/products/default-product.png";
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const refreshProducts = async () => {
    const result = await AdminService.products();
    setProducts(result.data ?? []);
  };

  useEffect(() => {
    if (!AdminSession.has()) {
      router.replace("/admin/login");
      return;
    }
    AdminService.products()
      .then((result) => setProducts(result.data ?? []))
      .catch(() => router.replace("/admin/login"))
      .finally(() => setIsLoading(false));
  }, [router]);

  const categories = useMemo(
    () =>
      Array.from(
        new Map(
          products
            .filter((product) => product.category)
            .map((product) => [product.category!.id, product.category!]),
        ).values(),
      ),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchSearch =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.slug.toLowerCase().includes(keyword);
      const matchCategory =
        category === "all" || String(product.category_id) === category;
      const matchStatus = status === "all" || product.status === status;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, category, status]);

  const removeProduct = async (product: Product) => {
    if (
      !(await confirmDelete(
        "produk",
        `${product.name}: data produk dan variannya tidak dapat dikembalikan.`,
      ))
    )
      return;
    /* Browser confirm lama dinonaktifkan; konfirmasi memakai SweetAlert. */
    if (false) {
      if (
        !window.confirm(
          `Hapus “${product.name}”? Data produk dan variannya tidak dapat dikembalikan.`,
        )
      )
        return;
    }
    setDeletingId(product.id);
    setMessage("");
    try {
      await AdminService.removeProduct(product.id);
      await refreshProducts();
      setMessage("Produk berhasil dihapus.");
      await showSuccess("Produk berhasil dihapus");
    } catch {
      setMessage("Produk belum dapat dihapus.");
      await showError("Produk belum dapat dihapus");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Katalog</p>
              <h1 className="font-luxury text-4xl">Products</h1>
            </div>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-white"
            >
              <Plus className="size-4" /> Tambah Produk
            </Link>
          </div>

          <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm md:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_190px_150px]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama atau slug produk…"
                  className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm"
                />
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-xl border bg-white px-3 text-sm"
              >
                <option value="all">Semua kategori</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border bg-white px-3 text-sm"
              >
                <option value="all">Semua status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {filteredProducts.length} dari {products.length} produk
              </span>
              {message && <span className="text-primary">{message}</span>}
            </div>
          </section>

          <section className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
            {isLoading ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                Memuat produk…
              </p>
            ) : !filteredProducts.length ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                Produk tidak ditemukan.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left text-sm">
                  <thead className="border-b bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="p-4 font-medium">Produk</th>
                      <th className="p-4 font-medium">Kategori</th>
                      <th className="p-4 font-medium">Koleksi</th>
                      <th className="p-4 font-medium">Harga mulai</th>
                      <th className="p-4 font-medium">Stok</th>
                      <th className="p-4 font-medium">Varian</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Diperbarui</th>
                      <th className="p-4 text-right font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const image =
                        product.images?.[0]?.image ??
                        product.images?.[0]?.image_url ??
                        product.image_url ??
                        fallbackImage;
                      const labels = (product.collections ?? []).map((collection) => collection.name);
                      const variants = product.variants ?? [];
                      const prices = variants
                        .map((variant) => Number(variant.discount_price ?? variant.price))
                        .filter((price) => Number.isFinite(price) && price > 0);
                      const lowestPrice = prices.length ? Math.min(...prices) : null;
                      const totalStock = variants.reduce(
                        (total, variant) => total + Math.max(0, Number(variant.stock) || 0),
                        0,
                      );
                      const variantSummary = variants
                        .slice(0, 2)
                        .map((variant) =>
                          [variant.color?.name, variant.size?.name]
                            .filter(Boolean)
                            .join(" / "),
                        )
                        .filter(Boolean);
                      return (
                        <tr key={product.id} className="border-b last:border-0">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                                <Image
                                  src={image}
                                  alt=""
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  /{product.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            <p>{product.category?.name ?? "—"}</p>
                            {product.subcategory?.name && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {product.subcategory.name}
                              </p>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {labels.length ? (
                                labels.map((label) => (
                                  <span
                                    key={String(label)}
                                    className="rounded-full bg-primary/10 px-2 py-1 text-[10px] text-primary"
                                  >
                                    {label}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {lowestPrice === null ? (
                              <span className="text-muted-foreground">Belum diatur</span>
                            ) : (
                              <div>
                                <p className="font-medium text-foreground">{formatRupiah(lowestPrice)}</p>
                                {prices.length > 1 && <p className="mt-0.5 text-xs text-muted-foreground">dari {variants.length} varian</p>}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="inline-flex items-center gap-2">
                              <span className={`flex size-8 items-center justify-center rounded-lg ${totalStock > 5 ? "bg-emerald-50 text-emerald-700" : totalStock > 0 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}><PackageCheck className="size-4" /></span>
                              <div><p className={`font-medium ${totalStock === 0 ? "text-rose-700" : "text-foreground"}`}>{totalStock} pcs</p><p className="text-[11px] text-muted-foreground">{totalStock === 0 ? "Stok habis" : totalStock <= 5 ? "Stok menipis" : "Siap dijual"}</p></div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-start gap-2"><Boxes className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="font-medium">{variants.length} varian</p>{variantSummary.length ? <p className="mt-0.5 max-w-[150px] truncate text-[11px] text-muted-foreground">{variantSummary.join(", ")}{variants.length > 2 ? " + lainnya" : ""}</p> : <p className="mt-0.5 text-[11px] text-muted-foreground">Belum ada varian</p>}</div></div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs ${product.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                            >
                              {product.status === "ACTIVE"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">
                            {new Date(product.updatedAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-1">
                              <Link
                                href={`/admin/products/${product.id}`}
                                className="rounded-lg p-2 text-primary hover:bg-primary/10"
                                aria-label={`Edit ${product.name}`}
                              >
                                <Edit3 className="size-4" />
                              </Link>
                              <button
                                type="button"
                                disabled={deletingId === product.id}
                                onClick={() => void removeProduct(product)}
                                className="rounded-lg p-2 text-destructive hover:bg-destructive/10 disabled:opacity-40"
                                aria-label={`Hapus ${product.name}`}
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
