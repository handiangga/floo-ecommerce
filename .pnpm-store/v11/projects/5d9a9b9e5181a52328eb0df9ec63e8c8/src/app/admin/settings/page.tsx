"use client";

import { FormEvent, useEffect, useState } from "react";
import { MapPin, Store, Truck } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { showError, showSuccess } from "@/lib/alert";

type Setting = Record<string, string | boolean>;
const empty: Setting = {
  store_name: "Floo Fashionn",
  sender_name: "",
  phone: "",
  email: "",
  address: "",
  province: "",
  city: "",
  district: "",
  subdistrict: "",
  postal_code: "",
  courier_jne: true,
  courier_jnt: true,
  courier_sicepat: true,
  courier_anteraja: true,
};
const inputFields = [
  ["store_name", "Nama toko"],
  ["sender_name", "Nama pengirim"],
  ["phone", "Nomor WhatsApp"],
  ["email", "Email toko"],
  ["province", "Provinsi"],
  ["city", "Kota/Kabupaten"],
  ["district", "Kecamatan"],
  ["subdistrict", "Kelurahan"],
  ["postal_code", "Kode pos"],
];
const couriers = [
  ["courier_jne", "JNE"],
  ["courier_jnt", "J&T"],
  ["courier_sicepat", "SiCepat"],
  ["courier_anteraja", "AnterAja"],
];

export default function StoreSettingsPage() {
  const [setting, setSetting] = useState<Setting>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    AdminService.storeSettings()
      .then((r) => setSetting({ ...empty, ...r.data }))
      .catch(() => void showError("Pengaturan belum dimuat"))
      .finally(() => setLoading(false));
  }, []);
  const set = (key: string, value: string | boolean) =>
    setSetting((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await AdminService.updateStoreSettings(setting);
      await showSuccess("Pengaturan toko tersimpan");
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } } };
      await showError("Pengaturan belum tersimpan", e.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };
  if (loading)
    return (
      <div className="flex min-h-screen bg-[#f8f5f1]">
        <AdminSidebar />
        <main className="grid flex-1 place-items-center text-sm text-[#806b59]">
          Memuat pengaturan toko...
        </main>
      </div>
    );
  return (
    <div className="flex min-h-screen bg-[#f8f5f1]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[#806b59]">Operasional toko</p>
          <h1 className="mt-1 font-luxury text-4xl">Pengaturan Toko</h1>
          <p className="mt-2 text-sm text-[#806b59]">
            Simpan alamat asal pengiriman sebelum mengaktifkan ongkir real-time.
          </p>
          <form onSubmit={(e) => void submit(e)} className="mt-7 space-y-5">
            <section className="border border-[#eadfd4] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-luxury text-2xl">
                <Store className="size-5 text-[#b88a55]" /> Informasi pengirim
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {inputFields.slice(0, 4).map(([key, label]) => (
                  <label key={key} className="text-sm text-[#644e3b]">
                    {label}
                    <input
                      required={key !== "email"}
                      type={key === "email" ? "email" : "text"}
                      value={String(setting[key])}
                      onChange={(e) => set(key, e.target.value)}
                      className="mt-2 w-full border border-[#eadfd4] p-3 outline-none focus:border-[#b88a55]"
                    />
                  </label>
                ))}
              </div>
            </section>
            <section className="border border-[#eadfd4] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-luxury text-2xl">
                <MapPin className="size-5 text-[#b88a55]" /> Alamat asal
                pengiriman
              </h2>
              <textarea
                required
                value={String(setting.address)}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Jalan, nomor bangunan, patokan"
                className="mt-5 min-h-24 w-full border border-[#eadfd4] p-3 outline-none focus:border-[#b88a55]"
              />
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {inputFields.slice(4).map(([key, label]) => (
                  <label key={key} className="text-sm text-[#644e3b]">
                    {label}
                    <input
                      required
                      value={String(setting[key])}
                      onChange={(e) => set(key, e.target.value)}
                      className="mt-2 w-full border border-[#eadfd4] p-3 outline-none focus:border-[#b88a55]"
                    />
                  </label>
                ))}
              </div>
            </section>
            <section className="border border-[#eadfd4] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-luxury text-2xl">
                <Truck className="size-5 text-[#b88a55]" /> Kurir aktif
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {couriers.map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between border border-[#eadfd4] p-4 text-sm"
                  >
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(setting[key])}
                      onChange={(e) => set(key, e.target.checked)}
                      className="size-4 accent-[#b88a55]"
                    />
                  </label>
                ))}
              </div>
            </section>
            <button
              disabled={saving}
              className="bg-[#b88a55] px-6 py-3 text-sm text-white disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Pengaturan Toko"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
