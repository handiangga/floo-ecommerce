"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { Category } from "@/types/category";
import { confirmDelete, showError, showSuccess } from "@/lib/alert";

type Product = {
  name: string;
  description?: string;
  material?: string;
  weight?: number;
  category_id: number;
  status: string;
  is_ready_stock?: boolean;
  is_preorder?: boolean;
  preorder_days?: number;
};
type Variant = {
  id: number;
  price: number;
  discount_price?: number | null;
  stock: number;
  status?: "ACTIVE" | "INACTIVE";
  color?: { name: string };
  size?: { name: string };
};
type ProductImage = {
  id: number;
  image: string;
  alt?: string;
  is_primary?: boolean;
  sort_order?: number;
};
type Option = { id: number; name: string };

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [colors, setColors] = useState<Option[]>([]);
  const [sizes, setSizes] = useState<Option[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [fulfillment, setFulfillment] = useState<"READY_STOCK" | "PREORDER">("READY_STOCK");

  const loadVariants = async () => {
    const result = await AdminService.variants(id);
    setVariants(result.data ?? []);
  };

  const loadImages = async () => {
    const result = await AdminService.images(id);
    setImages(result.data?.data ?? result.data ?? []);
  };

  useEffect(() => {
    void Promise.all([
      AdminService.product(id).then((result) => {
        setProduct(result.data);
        setFulfillment(result.data.is_preorder ? "PREORDER" : "READY_STOCK");
      }),
      AdminService.categories().then((result) =>
        setCategories(result.data?.data ?? result.data ?? []),
      ),
      AdminService.variants(id).then((result) =>
        setVariants(result.data ?? []),
      ),
      AdminService.colors().then((result) =>
        setColors(result.data?.data ?? result.data ?? []),
      ),
      AdminService.sizes().then((result) =>
        setSizes(result.data?.data ?? result.data ?? []),
      ),
      AdminService.images(id).then((result) =>
        setImages(result.data?.data ?? result.data ?? []),
      ),
    ]);
  }, [id]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.delete("fulfillment");
    const preorderDays = Number(data.get("preorder_days") || 0);
    if (fulfillment === "PREORDER" && (!Number.isInteger(preorderDays) || preorderDays < 1)) {
      setMessage("Masukkan lama pre-order minimal 1 hari.");
      return;
    }
    data.set("is_ready_stock", fulfillment === "READY_STOCK" ? "true" : "false");
    data.set("is_preorder", fulfillment === "PREORDER" ? "true" : "false");
    data.set("preorder_days", fulfillment === "PREORDER" ? String(preorderDays) : "0");
    try {
      const result = await AdminService.updateProduct(id, data);
      setProduct(result.data);
      setMessage("Data produk berhasil disimpan.");
    } catch {
      setMessage("Data produk belum dapat disimpan.");
    }
  };

  const uploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setIsUploading(true);
    setMessage("");
    const data = new FormData();
    data.set("product_id", id);
    data.set("sort_order", String(images.length));
    files.forEach((file) => data.append("images", file));
    try {
      await AdminService.uploadImages(data);
      await loadImages();
      setMessage(`${files.length} gambar berhasil diunggah.`);
    } catch {
      setMessage(
        "Upload gambar gagal. Pastikan file JPG, PNG, atau WEBP maksimal 5 MB.",
      );
    } finally {
      event.target.value = "";
      setIsUploading(false);
    }
  };

  const saveOrder = async (nextImages: ProductImage[]) => {
    setImages(nextImages);
    setIsReordering(true);
    try {
      const result = await AdminService.reorderImages(
        id,
        nextImages.map((image) => image.id),
      );
      setImages(result.data ?? nextImages);
    } catch {
      await loadImages();
      setMessage("Urutan gambar belum dapat disimpan.");
    } finally {
      setIsReordering(false);
    }
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length || isReordering) return;
    const nextImages = [...images];
    [nextImages[index], nextImages[target]] = [
      nextImages[target],
      nextImages[index],
    ];
    void saveOrder(nextImages);
  };

  const removeImage = async (imageId: number) => {
    if (!(await confirmDelete("gambar produk"))) return;
    try {
      await AdminService.removeImage(imageId);
      await loadImages();
      setMessage("Gambar berhasil dihapus.");
      await showSuccess("Gambar berhasil dihapus");
    } catch {
      setMessage("Gambar belum dapat dihapus.");
      await showError("Gambar belum dapat dihapus");
    }
  };

  const updateVariant = async (
    event: FormEvent<HTMLFormElement>,
    variantId: number,
  ) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const discountValue = String(data.get("discount_price") ?? "").trim();
    try {
      await AdminService.updateVariant(variantId, {
        price: Number(data.get("price")),
        discount_price: discountValue ? Number(discountValue) : null,
        stock: Number(data.get("stock")),
        status: String(data.get("status")) as "ACTIVE" | "INACTIVE",
      });
      await loadVariants();
      setMessage("Varian berhasil diperbarui.");
    } catch {
      setMessage(
        "Varian belum dapat diperbarui. Harga diskon tidak boleh melebihi harga normal.",
      );
    }
  };

  const createVariant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const discountValue = String(data.get("discount_price") ?? "").trim();
    try {
      await AdminService.createVariant({
        product_id: Number(id),
        color_id: Number(data.get("color_id")),
        size_id: Number(data.get("size_id")),
        price: Number(data.get("price")),
        stock: Number(data.get("stock")),
        discount_price: discountValue ? Number(discountValue) : undefined,
      });
      event.currentTarget.reset();
      await loadVariants();
      setMessage("Varian baru berhasil ditambahkan.");
    } catch {
      setMessage(
        "Varian belum dapat ditambahkan. Kombinasi warna dan ukuran harus unik.",
      );
    }
  };

  const deleteVariant = async (variantId: number) => {
    if (!(await confirmDelete("varian produk"))) return;
    try {
      await AdminService.removeVariant(variantId);
      await loadVariants();
      setMessage("Varian berhasil dihapus.");
      await showSuccess("Varian berhasil dihapus");
    } catch {
      setMessage("Varian belum dapat dihapus.");
      await showError("Varian belum dapat dihapus");
    }
  };

  if (!product) return <main className="p-10">Memuat produk…</main>;

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <Link href="/admin/products" className="text-sm text-primary">
            ← Kembali ke produk
          </Link>
          <h1 className="mt-3 font-luxury text-4xl">Edit Product</h1>
          {message && (
            <p className="mt-3 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
              {message}
            </p>
          )}

          <section className="mt-6 rounded-2xl bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Foto Produk</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Foto pertama menjadi foto utama. Gunakan panah untuk mengubah
                  urutan.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
                <ImagePlus className="size-4" />{" "}
                {isUploading ? "Mengunggah…" : "Tambah Foto"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  disabled={isUploading}
                  onChange={uploadImages}
                />
              </label>
            </div>
            {!images.length ? (
              <div className="mt-5 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Belum ada foto. Tambahkan foto produk pertama.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => (
                  <article
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-border"
                  >
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={image.image}
                        alt={image.alt || `Foto produk ${index + 1}`}
                        fill
                        sizes="(min-width: 1024px) 250px, (min-width: 640px) 45vw, 100vw"
                        className="object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white">
                          Foto utama
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3">
                      <span className="text-xs text-muted-foreground">
                        Urutan {index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Geser foto ke kiri"
                          disabled={index === 0 || isReordering}
                          onClick={() => moveImage(index, -1)}
                          className="rounded p-2 hover:bg-muted disabled:opacity-30"
                        >
                          <ArrowUp className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Geser foto ke kanan"
                          disabled={index === images.length - 1 || isReordering}
                          onClick={() => moveImage(index, 1)}
                          className="rounded p-2 hover:bg-muted disabled:opacity-30"
                        >
                          <ArrowDown className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Hapus foto"
                          onClick={() => void removeImage(image.id)}
                          className="rounded p-2 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <form onSubmit={save} className="mt-6 rounded-2xl bg-white p-6">
            <h2 className="text-xl font-semibold">Informasi Produk</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                required
                name="name"
                defaultValue={product.name}
                aria-label="Nama produk"
                className="rounded border p-3 md:col-span-2"
              />
              <select
                name="category_id"
                defaultValue={product.category_id}
                aria-label="Kategori"
                className="rounded border p-3"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                name="status"
                defaultValue={product.status}
                aria-label="Status"
                className="rounded border p-3"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <textarea
                name="description"
                defaultValue={product.description}
                placeholder="Deskripsi produk"
                className="min-h-28 rounded border p-3 md:col-span-2"
              />
              <input
                name="material"
                defaultValue={product.material}
                placeholder="Material"
                className="rounded border p-3"
              />
              <input
                name="weight"
                type="number"
                min="0"
                defaultValue={product.weight ?? 0}
                placeholder="Berat (gram)"
                className="rounded border p-3"
              />
              <fieldset className="rounded-xl border border-[#eadfd4] bg-[#fcfaf7] p-4 text-sm md:col-span-2">
                <legend className="px-1 font-medium">Ketersediaan produk</legend>
                <p className="mb-3 text-xs text-muted-foreground">Best Seller dihitung dari penjualan selesai dan New Arrival tampil otomatis berdasarkan tanggal produk dibuat.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${fulfillment === "READY_STOCK" ? "border-primary bg-white" : "bg-white/60"}`}>
                    <input checked={fulfillment === "READY_STOCK"} onChange={() => setFulfillment("READY_STOCK")} type="radio" name="fulfillment" value="READY_STOCK" className="mt-1" />
                    <span><b>Ready stock</b><small className="mt-1 block text-muted-foreground">Siap diproses setelah pembayaran diverifikasi.</small></span>
                  </label>
                  <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${fulfillment === "PREORDER" ? "border-primary bg-white" : "bg-white/60"}`}>
                    <input checked={fulfillment === "PREORDER"} onChange={() => setFulfillment("PREORDER")} type="radio" name="fulfillment" value="PREORDER" className="mt-1" />
                    <span><b>Pre-order</b><small className="mt-1 block text-muted-foreground">Produk dibuat/disiapkan terlebih dahulu sebelum dikirim.</small></span>
                  </label>
                </div>
                {fulfillment === "PREORDER" && <label className="mt-3 grid max-w-sm gap-1 font-medium">Lama pre-order (hari)<input required name="preorder_days" type="number" min="1" defaultValue={Math.max(1, Number(product.preorder_days) || 1)} className="rounded border bg-white p-2 font-normal" /><small className="font-normal text-muted-foreground">Wajib diisi agar estimasi pengerjaan terlihat oleh pelanggan.</small></label>}
              </fieldset>
            </div>
            <button className="mt-6 rounded-full bg-primary px-5 py-3 text-white">
              Simpan Produk
            </button>
          </form>

          <section className="mt-6 rounded-2xl bg-white p-6">
            <h2 className="text-xl font-semibold">Varian, Harga & Stok</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Atur harga normal, harga diskon, stok, serta status masing-masing
              varian.
            </p>
            <div className="mt-5 space-y-4">
              {variants.map((variant) => (
                <form
                  key={variant.id}
                  onSubmit={(event) => void updateVariant(event, variant.id)}
                  className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[1.2fr_1fr_1fr_0.7fr_0.8fr_auto] md:items-end"
                >
                  <p className="pb-3 text-sm font-medium md:pb-0">
                    {variant.color?.name} · {variant.size?.name}
                  </p>
                  <label className="grid gap-1 text-xs text-muted-foreground">
                    Harga normal
                    <input
                      name="price"
                      type="number"
                      min="0"
                      required
                      defaultValue={variant.price}
                      className="rounded border p-2 text-sm text-foreground"
                    />
                  </label>
                  <label className="grid gap-1 text-xs text-muted-foreground">
                    Harga diskon
                    <input
                      name="discount_price"
                      type="number"
                      min="0"
                      defaultValue={variant.discount_price ?? ""}
                      placeholder="Opsional"
                      className="rounded border p-2 text-sm text-foreground"
                    />
                  </label>
                  <label className="grid gap-1 text-xs text-muted-foreground">
                    Stok
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      required
                      defaultValue={variant.stock}
                      className="rounded border p-2 text-sm text-foreground"
                    />
                  </label>
                  <label className="grid gap-1 text-xs text-muted-foreground">
                    Status
                    <select
                      name="status"
                      defaultValue={variant.status ?? "ACTIVE"}
                      className="rounded border bg-white p-2 text-sm text-foreground"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="submit"
                      className="rounded-full bg-primary px-3 py-2 text-xs font-medium text-white"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      aria-label="Hapus varian"
                      onClick={() => void deleteVariant(variant.id)}
                      className="rounded-full p-2 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </form>
              ))}
              {!variants.length && (
                <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Belum ada varian produk.
                </p>
              )}
            </div>

            <form
              onSubmit={(event) => void createVariant(event)}
              className="mt-6 grid gap-3 rounded-xl bg-muted/60 p-4 md:grid-cols-5 md:items-end"
            >
              <p className="text-sm font-semibold md:col-span-5">
                Tambah Varian
              </p>
              <label className="grid gap-1 text-xs text-muted-foreground">
                Warna
                <select
                  name="color_id"
                  required
                  defaultValue=""
                  className="rounded border bg-white p-2 text-sm text-foreground"
                >
                  <option value="" disabled>
                    Pilih warna
                  </option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs text-muted-foreground">
                Ukuran
                <select
                  name="size_id"
                  required
                  defaultValue=""
                  className="rounded border bg-white p-2 text-sm text-foreground"
                >
                  <option value="" disabled>
                    Pilih ukuran
                  </option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs text-muted-foreground">
                Harga normal
                <input
                  name="price"
                  type="number"
                  min="0"
                  required
                  className="rounded border bg-white p-2 text-sm text-foreground"
                />
              </label>
              <label className="grid gap-1 text-xs text-muted-foreground">
                Harga diskon
                <input
                  name="discount_price"
                  type="number"
                  min="0"
                  placeholder="Opsional"
                  className="rounded border bg-white p-2 text-sm text-foreground"
                />
              </label>
              <div className="flex gap-2">
                <label className="grid flex-1 gap-1 text-xs text-muted-foreground">
                  Stok
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    required
                    defaultValue="0"
                    className="rounded border bg-white p-2 text-sm text-foreground"
                  />
                </label>
                <button
                  type="submit"
                  className="self-end rounded-full bg-primary p-2.5 text-white"
                  aria-label="Tambah varian"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
