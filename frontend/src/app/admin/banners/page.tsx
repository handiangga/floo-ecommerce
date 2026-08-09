"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ImageIcon,
  ImagePlus,
  Link2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { AdminSession } from "@/lib/session";
import { confirmDelete, showError, showSuccess } from "@/lib/alert";

type Banner = {
  id: number;
  title: string;
  image?: string;
  link?: string;
  status?: string;
  createdAt?: string;
};

const destinationLabels: Record<string, string> = {
  "/new-arrival": "New Arrival",
  "/products/new-arrival": "New Arrival",
  "/best-seller": "Best Seller",
  "/products/best-seller": "Best Seller",
  "/kebaya": "Koleksi Kebaya",
  "/categories/kebaya": "Koleksi Kebaya",
  "/couple": "Couple Collection",
  "/categories/couple": "Couple Collection",
  "/big-size": "Big Size Collection",
  "/categories/big-size": "Big Size Collection",
  "/sale": "Sale",
  "/products": "Semua Produk",
};

function destinationLabel(link?: string) {
  return destinationLabels[link || ""] || "Halaman lain";
}

export default function BannersPage() {
  const router = useRouter();
  const [items, setItems] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const load = () =>
    AdminService.banners().then((result) =>
      setItems(result.data?.data || result.data || []),
    );

  useEffect(() => {
    if (!AdminSession.has()) {
      router.replace("/admin/login");
      return;
    }
    load().catch((error: { response?: { status?: number } }) => {
      if ([401, 403].includes(error.response?.status || 0)) {
        AdminSession.clear();
        router.replace("/admin/login");
      } else setMessage("Banner belum dapat dimuat.");
    });
  }, [router]);

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSaving(true);
    setMessage("");
    let saved = false;
    try {
      const imageFile = form.get("image_file");
      const fields = {
        title: String(form.get("title")),
        link: String(form.get("link") || ""),
        status: String(form.get("status") || "ACTIVE"),
      };
      const payload = new FormData();
      Object.entries(fields).forEach(([key, value]) =>
        payload.append(key, value),
      );
      const hasNewImage = imageFile instanceof File && imageFile.size > 0;
      if (!editing && !hasNewImage) {
        await showError(
          "Gambar banner diperlukan",
          "Pilih gambar sebelum menambahkan banner baru.",
        );
        return;
      }
      if (hasNewImage) payload.append("image_file", imageFile);
      const requestPayload = hasNewImage ? payload : fields;
      if (editing) await AdminService.updateBanner(editing.id, requestPayload);
      else await AdminService.createBanner(requestPayload);
      saved = true;
    } catch (error: unknown) {
      const detail =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as { message?: string })?.message ||
        "Periksa data dan ukuran gambar yang diisi.";
      setMessage(`Banner belum dapat disimpan. ${detail}`);
      await showError("Banner belum dapat disimpan", detail);
      return;
    } finally {
      setSaving(false);
    }

    if (saved) {
      formElement.reset();
      setShowForm(false);
      setEditing(null);
      setImagePreview(null);
      void load().catch(() => {
        setMessage(
          "Banner berhasil disimpan. Daftar akan diperbarui saat halaman dibuka kembali.",
        );
      });
      void showSuccess(
        editing ? "Banner berhasil diperbarui" : "Banner berhasil ditambahkan",
      );
    }
  };
  const remove = async (id: number) => {
    if (!(await confirmDelete("banner"))) return;
    try {
      await AdminService.removeBanner(id);
      await load();
      await showSuccess("Banner berhasil dihapus");
    } catch {
      setMessage("Banner belum dapat dihapus.");
      await showError("Banner belum dapat dihapus");
    }
  };
  const toggleStatus = async (item: Banner) => {
    const status = item.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    try {
      const payload = {
        title: item.title,
        link: item.link || "",
        status,
      };
      await AdminService.updateBanner(item.id, payload);
      await load();
      await showSuccess(
        status === "ACTIVE" ? "Banner diaktifkan" : "Banner dinonaktifkan",
      );
    } catch {
      await showError("Status banner belum dapat diubah");
    }
  };

  const previewImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f5f1]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-[#806b59]">Homepage content</p>
              <h1 className="font-luxury text-4xl">Banners</h1>
              <p className="mt-2 text-sm text-[#806b59]">
                Kelola visual utama yang tampil pada hero homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setImagePreview(null);
                setShowForm((value) => !value);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#b88a55] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(184,138,85,.22)] transition hover:-translate-y-0.5 hover:bg-[#9e7040]"
            >
              <Plus className="size-4" /> Tambah Banner
            </button>
          </div>
          {message && (
            <p className="mt-5 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {message}
            </p>
          )}
          {showForm && (
            <form
              onSubmit={(event) => void add(event)}
              className="mt-6 overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-[0_12px_35px_rgba(73,48,30,.08)]"
            >
              <div className="border-b border-[#eee5dc] bg-gradient-to-r from-[#fffaf3] to-white px-6 py-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#f5eadb] text-[#b88a55]">
                    <ImagePlus className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-luxury text-2xl">
                      {editing ? "Edit Banner" : "Banner Baru"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Lengkapi isi banner agar tampil rapi di hero homepage.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 p-6 lg:grid-cols-[1.05fr_1.35fr_1fr]">
                <label className="text-sm font-medium text-[#644e3b]">
                  Judul banner
                  <span className="mt-1 block text-xs font-normal text-[#967e6b]">
                    Nama internal untuk memudahkan pengelolaan.
                  </span>
                  <input
                    required
                    name="title"
                    defaultValue={editing?.title || ""}
                    placeholder="Contoh: Koleksi Lebaran"
                    className="mt-3 w-full rounded-xl border border-[#eadfd4] bg-[#fffcf8] px-4 py-3 text-sm outline-none transition focus:border-[#b88a55] focus:ring-4 focus:ring-[#f5eadb]"
                  />
                </label>
                <div className="text-sm font-medium text-[#644e3b]">
                  Gambar banner
                  <span className="mt-1 block text-xs font-normal text-[#967e6b]">
                    Gunakan JPG, PNG, atau WEBP. Maksimal 10 MB.
                  </span>
                  <label className="group mt-3 flex min-h-[118px] cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[#d8c2ab] bg-[#fffcf8] p-3 transition hover:border-[#b88a55] hover:bg-[#fff7ec]">
                    <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f4e8da] text-[#b88a55]">
                      {imagePreview || editing?.image ? (
                        <img
                          src={imagePreview || editing?.image}
                          alt="Preview banner"
                          className="size-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="size-7" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9e7040]">
                        <Upload className="size-4" /> Pilih gambar
                      </span>
                      <span className="mt-1 block text-xs font-normal leading-5 text-[#967e6b]">
                        {editing?.image
                          ? "Gambar lama dipakai bila tidak diganti."
                          : "Belum ada gambar dipilih."}
                      </span>
                    </div>
                    <input
                      name="image_file"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={previewImage}
                      className="mt-3 block w-full text-xs font-normal text-[#806b59] file:mr-3 file:rounded-lg file:border-0 file:bg-[#ead6bc] file:px-3 file:py-2 file:text-xs file:font-medium file:text-[#644e3b] hover:file:bg-[#dec29e]"
                    />
                  </label>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-[#644e3b]">
                    Tujuan saat banner diklik
                    <span className="mt-1 block text-xs font-normal text-[#967e6b]">
                      Pelanggan akan diarahkan ke halaman ini.
                    </span>
                    <select
                      name="link"
                      defaultValue={editing?.link || "/new-arrival"}
                      className="mt-3 w-full rounded-xl border border-[#eadfd4] bg-[#fffcf8] px-4 py-3 text-sm outline-none transition focus:border-[#b88a55] focus:ring-4 focus:ring-[#f5eadb]"
                    >
                      <option value="/new-arrival">New Arrival</option>
                      <option value="/best-seller">Best Seller</option>
                      <option value="/kebaya">Koleksi Kebaya</option>
                      <option value="/couple">Couple Collection</option>
                      <option value="/big-size">Big Size</option>
                      <option value="/sale">Sale</option>
                      <option value="/products">Semua Produk</option>
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-[#644e3b]">
                    Status tayang
                    <select
                      name="status"
                      defaultValue={editing?.status || "ACTIVE"}
                      className="mt-2 w-full rounded-xl border border-[#eadfd4] bg-[#fffcf8] px-4 py-3 text-sm outline-none transition focus:border-[#b88a55] focus:ring-4 focus:ring-[#f5eadb]"
                    >
                      <option value="ACTIVE">Aktif — tampil di homepage</option>
                      <option value="INACTIVE">
                        Nonaktif — disimpan sebagai draft
                      </option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eee5dc] bg-[#fcfaf7] px-6 py-4">
                <p className="inline-flex items-center gap-2 text-xs text-[#806b59]">
                  <Check className="size-4 text-[#8ea76f]" /> Pastikan gambar
                  sudah sesuai sebelum disimpan.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditing(null);
                      setImagePreview(null);
                    }}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm text-[#806b59] hover:text-[#40342d]"
                  >
                    <X className="size-4" /> Batal
                  </button>
                  <button
                    disabled={saving}
                    className="rounded-xl bg-[#2d241f] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#4a392f] disabled:opacity-60"
                  >
                    {saving
                      ? "Menyimpan..."
                      : editing
                        ? "Simpan Perubahan"
                        : "Simpan Banner"}
                  </button>
                </div>
              </div>
            </form>
          )}
          <section className="mt-6 overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-[0_10px_28px_rgba(73,48,30,.06)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#fcfaf7] text-[11px] uppercase tracking-[.12em] text-[#806b59]">
                  <tr>
                    <th className="p-4">Preview</th>
                    <th className="p-4">Banner</th>
                    <th className="p-4">Tujuan</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#eee5dc] transition hover:bg-[#fffcf8]"
                    >
                      <td className="p-4">
                        <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl bg-[#f3e8dc] text-[#a07750] shadow-sm">
                          {item.image ? (
                            <>
                              <img
                                src={item.image}
                                alt=""
                                className="size-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.classList.add("hidden");
                                  event.currentTarget.nextElementSibling?.classList.remove(
                                    "hidden",
                                  );
                                }}
                              />
                              <ImagePlus
                                className="hidden size-5"
                                aria-label="Gambar banner tidak tersedia"
                              />
                            </>
                          ) : (
                            <ImagePlus className="size-5" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-[#40342d]">
                          {item.title}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f0e9] px-3 py-1.5 text-xs font-medium text-[#806b59]">
                          <Link2 className="size-3" />{" "}
                          {destinationLabel(item.link)}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => void toggleStatus(item)}
                          className={
                            "rounded-full px-3 py-1.5 text-xs transition " +
                            (item.status === "INACTIVE"
                              ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              : "bg-[#edf4e8] text-[#6d9855] hover:bg-[#dcebd5]")
                          }
                        >
                          {item.status === "INACTIVE" ? "NONAKTIF" : "AKTIF"}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(item);
                            setShowForm(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="mr-4 inline-flex items-center gap-1 text-xs text-[#a07750]"
                        >
                          <Pencil className="size-4" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void remove(item.id)}
                          className="inline-flex items-center gap-1 text-xs text-rose-600"
                        >
                          <Trash2 className="size-4" /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!items.length && (
              <div className="p-12 text-center text-sm text-[#806b59]">
                Belum ada banner. Tambahkan hero pertama untuk homepage.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
