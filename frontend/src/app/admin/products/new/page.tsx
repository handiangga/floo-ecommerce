"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { Category } from "@/types/category";
import { AdminSession } from "@/lib/session";
import { showError, showSuccessToast } from "@/lib/alert";

type PendingImage = { id: string; file: File; previewUrl: string };
type VariationGroup = { id: string; name: string; values: string };
type VariantInput = { price: string; stock: string };
type Variant = { key: string; options: Array<{ name: string; value: string }> };

const apiMessage = (error: unknown, fallback: string) => {
  const response = (error as { response?: { data?: { message?: string; errors?: Array<{ message?: string }> } } })?.response;
  return response?.data?.errors?.[0]?.message || response?.data?.message || fallback;
};

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Array<{ id: number; name: string }>>([]);
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [fulfillment, setFulfillment] = useState<"READY_STOCK" | "PREORDER">("READY_STOCK");
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [variationGroups, setVariationGroups] = useState<VariationGroup[]>([
    { id: "variant-1", name: "Warna", values: "" },
    { id: "variant-2", name: "Ukuran", values: "" },
  ]);
  const [variantInputs, setVariantInputs] = useState<Record<string, VariantInput>>({});
  const [bulkGroupId, setBulkGroupId] = useState("variant-1");
  const [bulkValue, setBulkValue] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const setInputFiles = (files: File[]) => {
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    if (imageInputRef.current) imageInputRef.current.files = transfer.files;
  };

  const chooseImages = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    const invalid = selected.find((file) => file.size > 5 * 1024 * 1024);
    if (invalid) {
      setMessage(`Foto “${invalid.name}” melebihi batas 5 MB.`);
      setInputFiles(pendingImages.map((image) => image.file));
      return;
    }
    const existingKeys = new Set(pendingImages.map((image) => `${image.file.name}-${image.file.size}-${image.file.lastModified}`));
    const newFiles = selected.filter((file) => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`));
    const remainingSlots = 10 - pendingImages.length;
    const accepted = newFiles.slice(0, Math.max(0, remainingSlots));
    if (newFiles.length > remainingSlots) setMessage(`Maksimal 10 foto. Hanya ${Math.max(0, remainingSlots)} foto tambahan yang dimasukkan.`);
    else if (accepted.length) setMessage("");
    if (!accepted.length) {
      setInputFiles(pendingImages.map((image) => image.file));
      return;
    }
    const next = [
      ...pendingImages,
      ...accepted.map((file, index) => ({ id: `${file.name}-${file.size}-${file.lastModified}-${pendingImages.length + index}`, file, previewUrl: URL.createObjectURL(file) })),
    ];
    setPendingImages(next);
    setInputFiles(next.map((image) => image.file));
  };

  const removePendingImage = (id: string) => {
    setPendingImages((current) => {
      const removed = current.find((image) => image.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      const next = current.filter((image) => image.id !== id);
      setInputFiles(next.map((image) => image.file));
      return next;
    });
  };

  useEffect(() => {
    if (!AdminSession.has()) {
      router.replace("/admin/login");
      return;
    }
    AdminService.categories().then((result) => setCategories(result.data?.data ?? result.data ?? []));
    AdminService.collections().then((result) => setCollections(result.data?.data ?? result.data ?? []));
  }, [router]);

  const preparedGroups = useMemo(() => variationGroups
    .map((group) => ({
      ...group,
      name: group.name.trim(),
      items: [...new Set(group.values.split(/[\n,]/).map((item) => item.trim()).filter(Boolean))],
    }))
    .filter((group) => group.name && group.items.length), [variationGroups]);

  const variants = useMemo<Variant[]>(() => {
    if (!preparedGroups.length) return [];
    return preparedGroups.reduce<Array<Array<{ name: string; value: string }>>>(
      (combinations, group) => combinations.flatMap((combination) => group.items.map((value) => [
        ...combination,
        { name: group.name, value },
      ])),
      [[]],
    ).map((options) => ({
      options,
      key: options.map((option) => `${option.name.toLowerCase()}:${option.value.toLowerCase()}`).join("|"),
    }));
  }, [preparedGroups]);

  useEffect(() => {
    setVariantInputs((current) => Object.fromEntries(variants.map((variant) => [
      variant.key,
      current[variant.key] ?? { price: "", stock: "" },
    ])));
  }, [variants]);

  const updateVariationGroup = (id: string, patch: Partial<VariationGroup>) => {
    setVariationGroups((current) => current.map((group) => group.id === id ? { ...group, ...patch } : group));
  };

  const addVariationGroup = () => {
    if (variationGroups.length >= 3) return;
    const nextId = `variant-${variationGroups.length + 1}`;
    setVariationGroups((current) => [...current, { id: nextId, name: "", values: "" }]);
    setBulkGroupId(nextId);
    setBulkValue("");
  };

  const removeVariationGroup = (id: string) => {
    if (variationGroups.length <= 1) return;
    const next = variationGroups.filter((group) => group.id !== id);
    setVariationGroups(next);
    if (bulkGroupId === id) {
      setBulkGroupId(next[0]?.id ?? "");
      setBulkValue("");
    }
  };

  const applyBulkUpdate = () => {
    const group = preparedGroups.find((item) => item.id === bulkGroupId);
    const price = bulkPrice === "" ? undefined : Number(bulkPrice);
    const stock = bulkStock === "" ? undefined : Number(bulkStock);
    if (!group || !bulkValue || (price === undefined && stock === undefined)) {
      setMessage("Pilih jenis dan nilai variasi, lalu isi minimal harga atau stok untuk update massal.");
      return;
    }
    if ((price !== undefined && (!Number.isInteger(price) || price < 0)) || (stock !== undefined && (!Number.isInteger(stock) || stock < 0))) {
      setMessage("Harga dan stok massal harus berupa angka nol atau lebih.");
      return;
    }
    setVariantInputs((current) => Object.fromEntries(variants.map((variant) => {
      const matched = variant.options.some((option) => option.name === group.name && option.value === bulkValue);
      const existing = current[variant.key] ?? { price: "", stock: "" };
      return [variant.key, matched ? {
        ...existing,
        ...(price !== undefined ? { price: String(price) } : {}),
        ...(stock !== undefined ? { stock: String(stock) } : {}),
      } : existing];
    })));
    setMessage("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const productForm = new FormData(event.currentTarget);
    const imageFiles = productForm.getAll("images").filter((file): file is File => file instanceof File && file.size > 0);

    if (imageFiles.length > 10) {
      setMessage("Maksimal 10 foto untuk satu produk.");
      return;
    }

    if (!variants.length) {
      setMessage("Isi minimal satu jenis variasi dan nilainya untuk membuat variasi produk.");
      return;
    }

    const invalidVariant = variants.find((variant) => {
      const values = variantInputs[variant.key];
      const price = Number(values?.price);
      const stock = Number(values?.stock);
      return !Number.isInteger(price) || price < 0 || !Number.isInteger(stock) || stock < 0;
    });
    if (invalidVariant) {
      setMessage("Lengkapi harga dan stok setiap variasi.");
      return;
    }

    productForm.delete("images");
    productForm.delete("fulfillment");
    productForm.set("collection_ids", JSON.stringify(productForm.getAll("collection_ids").map(Number)));
    const preorderDays = Number(productForm.get("preorder_days") || 0);
    if (fulfillment === "PREORDER" && (!Number.isInteger(preorderDays) || preorderDays < 1)) {
      setMessage("Masukkan lama pre-order minimal 1 hari.");
      return;
    }
    productForm.set("is_ready_stock", fulfillment === "READY_STOCK" ? "true" : "false");
    productForm.set("is_preorder", fulfillment === "PREORDER" ? "true" : "false");
    productForm.set("preorder_days", fulfillment === "PREORDER" ? String(preorderDays) : "0");

    setIsSaving(true);
    setMessage("");
    try {
      const created = await AdminService.createProduct(productForm);
      const productId = created.data?.id;
      if (!productId) throw new Error("Product creation response is invalid");

      if (imageFiles.length) {
        const imageForm = new FormData();
        imageForm.set("product_id", String(productId));
        imageForm.set("sort_order", "0");
        imageFiles.forEach((file) => imageForm.append("images", file));
        await AdminService.uploadImages(imageForm);
      }

      await Promise.all(variants.map((variant) => {
        const values = variantInputs[variant.key];
        return AdminService.createVariant({
          product_id: Number(productId),
          price: Number(values.price),
          stock: Number(values.stock),
          option_values: variant.options,
        });
      }));

      void showSuccessToast("Produk dan semua variasi berhasil dibuat");
      router.replace(`/admin/products/${productId}`);
    } catch (error) {
      const detail = apiMessage(error, "Produk belum dapat dibuat. Periksa data wajib dan ukuran file foto.");
      setMessage(detail);
      await showError("Produk belum dapat dibuat", detail);
      setIsSaving(false);
    }
  };

  const parents = useMemo(() => categories.filter((category) => !category.parent_id), [categories]);
  const subcategories = useMemo(() => categories.filter((category) => String(category.parent_id ?? "") === categoryId), [categories, categoryId]);

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <Link href="/admin/products" className="text-sm text-primary">← Kembali ke produk</Link>
          <h1 className="mt-3 font-luxury text-4xl">Tambah Produk</h1>
          <p className="mt-2 text-sm text-muted-foreground">Lengkapi informasi, foto, variasi, harga, dan stok sebelum produk disimpan.</p>

          <form onSubmit={(event) => void submit(event)} className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium md:col-span-2">Nama produk<input required name="name" placeholder="Contoh: Kebaya Amara" className="rounded-xl border p-3 font-normal" /></label>
              <label className="grid gap-1.5 text-sm font-medium">Kategori utama<select required name="category_id" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="rounded-xl border bg-white p-3 font-normal"><option value="" disabled>Pilih kategori utama</option>{parents.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              <label className="grid gap-1.5 text-sm font-medium">Subkategori <span className="font-normal text-muted-foreground">Opsional</span><select name="subcategory_id" defaultValue="" disabled={!categoryId} className="rounded-xl border bg-white p-3 font-normal"><option value="">Tanpa subkategori</option>{subcategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              <label className="grid gap-1.5 text-sm font-medium">Status<select name="status" defaultValue="ACTIVE" className="rounded-xl border bg-white p-3 font-normal"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></label>
              <fieldset className="rounded-xl border bg-[#fcfaf7] p-4 text-sm md:col-span-2"><legend className="px-1 font-medium">Collections <span className="font-normal text-muted-foreground">Produk boleh masuk lebih dari satu collection</span></legend><div className="mt-2 flex flex-wrap gap-3">{collections.map((collection) => <label key={collection.id} className="flex items-center gap-2 rounded-full border bg-white px-3 py-2"><input name="collection_ids" type="checkbox" value={collection.id} /> {collection.name}</label>)}</div></fieldset>
              <label className="grid gap-1.5 text-sm font-medium md:col-span-2">Deskripsi<textarea name="description" placeholder="Ceritakan detail produk…" className="min-h-32 rounded-xl border p-3 font-normal" /></label>
              <label className="grid gap-1.5 text-sm font-medium">Material<input name="material" placeholder="Contoh: Brokat premium" className="rounded-xl border p-3 font-normal" /></label>
              <label className="grid gap-1.5 text-sm font-medium">Berat (gram)<input name="weight" type="number" min="0" defaultValue="0" className="rounded-xl border p-3 font-normal" /></label>
              <label className="grid gap-1.5 text-sm font-medium md:col-span-2">Foto produk <span className="font-normal text-muted-foreground">Maks. 10 foto, JPG/PNG/WEBP, masing-masing maks. 5 MB.</span><span className="flex items-center gap-2 rounded-xl border border-dashed p-3 font-normal"><ImagePlus className="size-4 text-primary" /><input ref={imageInputRef} onChange={chooseImages} name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="w-full text-sm" /></span></label>
              {pendingImages.length > 0 && <div className="rounded-xl border border-[#eadfd4] bg-[#fcfaf7] p-4 md:col-span-2"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-medium">Preview foto <span className="font-normal text-muted-foreground">{pendingImages.length}/10 dipilih</span></p><span className="text-xs text-muted-foreground">Foto pertama menjadi gambar utama.</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">{pendingImages.map((image, index) => <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border bg-white"><Image src={image.previewUrl} alt={`Preview foto ${index + 1}`} fill unoptimized className="object-cover" /><span className="absolute left-1.5 top-1.5 rounded-full bg-[#2d241f]/80 px-2 py-1 text-[10px] text-white">{index === 0 ? "Utama" : `Foto ${index + 1}`}</span><button type="button" onClick={() => removePendingImage(image.id)} className="absolute right-1.5 top-1.5 rounded-full bg-white p-1.5 text-destructive shadow-sm transition hover:bg-destructive hover:text-white" aria-label={`Hapus preview foto ${index + 1}`}><X className="size-3.5" /></button></div>)}</div></div>}
              <fieldset className="rounded-xl border border-[#eadfd4] bg-[#fcfaf7] p-4 text-sm md:col-span-2">
                <legend className="px-1 font-medium">Variasi, harga, dan stok</legend>
                <p className="text-xs text-muted-foreground">Ketik sendiri nama variasi dan pilihannya. Sistem akan membuat seluruh kombinasi secara otomatis; maksimal tiga jenis variasi.</p>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {variationGroups.map((group, index) => (
                    <div key={group.id} className="rounded-xl border bg-white p-3">
                      <div className="flex items-center justify-between gap-2"><p className="font-medium">Variasi {index + 1}{index === 2 ? " (opsional)" : ""}</p>{variationGroups.length > 1 && <button type="button" onClick={() => removeVariationGroup(group.id)} className="text-xs text-destructive">Hapus</button>}</div>
                      <label className="mt-2 grid gap-1 text-xs text-muted-foreground">Nama variasi<input value={group.name} onChange={(event) => updateVariationGroup(group.id, { name: event.target.value })} placeholder="Contoh: Warna" className="rounded-lg border p-2 text-sm text-foreground" /></label>
                      <label className="mt-2 grid gap-1 text-xs text-muted-foreground">Pilihan variasi<input value={group.values} onChange={(event) => updateVariationGroup(group.id, { values: event.target.value })} placeholder="Contoh: Maroon, Navy, Gold" className="rounded-lg border p-2 text-sm text-foreground" /></label>
                      <p className="mt-1 text-[11px] text-muted-foreground">Pisahkan setiap pilihan dengan koma.</p>
                    </div>
                  ))}
                  {variationGroups.length < 3 && <button type="button" onClick={addVariationGroup} className="min-h-32 rounded-xl border border-dashed border-primary/40 bg-white/60 p-4 text-left text-sm font-medium text-primary transition hover:bg-white">+ Tambah variasi opsional</button>}
                </div>
                {variants.length > 0 && <>
                  <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex flex-wrap items-end gap-3"><div><p className="text-sm font-semibold">Update massal</p><p className="text-xs text-muted-foreground">Terapkan harga atau stok ke semua kombinasi yang memiliki pilihan tertentu.</p></div></div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                      <select value={bulkGroupId} onChange={(event) => { setBulkGroupId(event.target.value); setBulkValue(""); }} className="rounded-lg border bg-white p-2 text-sm"><option value="">Pilih jenis variasi</option>{preparedGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select>
                      <select value={bulkValue} onChange={(event) => setBulkValue(event.target.value)} className="rounded-lg border bg-white p-2 text-sm"><option value="">Pilih nilai</option>{preparedGroups.find((group) => group.id === bulkGroupId)?.items.map((value) => <option key={value} value={value}>{value}</option>)}</select>
                      <input type="number" min="0" value={bulkPrice} onChange={(event) => setBulkPrice(event.target.value)} placeholder="Harga (opsional)" className="rounded-lg border bg-white p-2 text-sm" />
                      <input type="number" min="0" value={bulkStock} onChange={(event) => setBulkStock(event.target.value)} placeholder="Stok (opsional)" className="rounded-lg border bg-white p-2 text-sm" />
                      <button type="button" onClick={applyBulkUpdate} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Terapkan</button>
                    </div>
                  </div>
                  <div className="mt-5 overflow-x-auto rounded-xl border bg-white"><table className="w-full min-w-[580px] text-left text-sm"><thead className="border-b bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground"><tr>{preparedGroups.map((group) => <th key={group.id} className="p-3">{group.name}</th>)}<th className="p-3">Harga (Rp)</th><th className="p-3">Stok</th></tr></thead><tbody>{variants.map((variant) => { const values = variantInputs[variant.key] ?? { price: "", stock: "" }; return <tr key={variant.key} className="border-b last:border-0">{variant.options.map((option) => <td key={`${variant.key}-${option.name}`} className="p-3">{option.value}</td>)}<td className="p-3"><input required type="number" min="0" value={values.price} onChange={(event) => setVariantInputs((current) => ({ ...current, [variant.key]: { ...values, price: event.target.value } }))} className="w-36 rounded-lg border p-2" placeholder="Contoh: 299000" /></td><td className="p-3"><input required type="number" min="0" value={values.stock} onChange={(event) => setVariantInputs((current) => ({ ...current, [variant.key]: { ...values, stock: event.target.value } }))} className="w-24 rounded-lg border p-2" placeholder="0" /></td></tr>; })}</tbody></table></div>
                </>}
                {!variants.length && <p className="mt-4 rounded-lg border border-dashed bg-white px-3 py-3 text-xs text-muted-foreground">Belum ada variasi. Isi nama serta minimal satu pilihan variasi, misalnya Warna: Maroon, Navy.</p>}
              </fieldset>
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
                {fulfillment === "PREORDER" && <label className="mt-3 grid max-w-sm gap-1 font-medium">Lama pre-order (hari)<input required name="preorder_days" type="number" min="1" defaultValue="1" className="rounded border bg-white p-2 font-normal" /><small className="font-normal text-muted-foreground">Wajib diisi agar estimasi pengerjaan terlihat oleh pelanggan.</small></label>}
              </fieldset>
            </div>
            {message && <p className="mt-5 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{message}</p>}
            <button disabled={isSaving} className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white disabled:opacity-60">{isSaving ? "Membuat produk…" : "Buat Produk & Lanjutkan"}</button>
          </form>
        </div>
      </main>
    </div>
  );
}
