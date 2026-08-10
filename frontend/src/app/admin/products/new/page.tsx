"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { Category } from "@/types/category";
import { AdminSession } from "@/lib/session";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Array<{ id: number; name: string }>>([]);
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!AdminSession.has()) {
      router.replace("/admin/login");
      return;
    }
    AdminService.categories().then((result) => setCategories(result.data?.data ?? result.data ?? []));
    AdminService.collections().then((result) => setCollections(result.data?.data ?? result.data ?? []));
  }, [router]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const productForm = new FormData(event.currentTarget);
    const imageFiles = productForm.getAll("images").filter((file): file is File => file instanceof File && file.size > 0);

    if (imageFiles.length > 10) {
      setMessage("Maksimal 10 foto untuk satu produk.");
      return;
    }

    productForm.delete("images");
    productForm.set("collection_ids", JSON.stringify(productForm.getAll("collection_ids").map(Number)));
    ["is_featured", "is_best_seller", "is_new_arrival", "is_ready_stock", "is_preorder"].forEach((field) => {
      productForm.set(field, productForm.get(field) ? "true" : "false");
    });

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

      router.replace(`/admin/products/${productId}`);
    } catch {
      setMessage("Produk belum dapat dibuat. Periksa data wajib dan ukuran file foto.");
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
          <p className="mt-2 text-sm text-muted-foreground">Buat informasi produk, lalu lanjutkan mengatur foto dan varian pada halaman edit.</p>

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
              <label className="grid gap-1.5 text-sm font-medium md:col-span-2">Foto produk <span className="font-normal text-muted-foreground">Maks. 10 foto, JPG/PNG/WEBP, masing-masing maks. 5 MB.</span><span className="flex items-center gap-2 rounded-xl border border-dashed p-3 font-normal"><ImagePlus className="size-4 text-primary" /><input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="w-full text-sm" /></span></label>
              <div className="grid gap-3 rounded-xl bg-muted/60 p-4 text-sm md:col-span-2 sm:grid-cols-2">
                <label className="flex items-center gap-2"><input name="is_ready_stock" type="checkbox" defaultChecked /> Ready stock</label>
                <label className="flex items-center gap-2"><input name="is_preorder" type="checkbox" /> Pre-order</label>
                <label className="flex items-center gap-2"><input name="is_featured" type="checkbox" /> Featured</label>
                <label className="flex items-center gap-2"><input name="is_best_seller" type="checkbox" /> Best seller</label>
                <label className="flex items-center gap-2"><input name="is_new_arrival" type="checkbox" /> New arrival</label>
                <label className="grid gap-1">Lama pre-order (hari)<input name="preorder_days" type="number" min="0" defaultValue="0" className="rounded border bg-white p-2" /></label>
              </div>
            </div>
            {message && <p className="mt-5 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{message}</p>}
            <button disabled={isSaving} className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white disabled:opacity-60">{isSaving ? "Membuat produk…" : "Buat Produk & Lanjutkan"}</button>
          </form>
        </div>
      </main>
    </div>
  );
}
