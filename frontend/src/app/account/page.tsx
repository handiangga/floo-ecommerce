"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/common/Loading";
import { CustomerAuthService } from "@/services/auth.service";
import { AddressPayload, AddressService } from "@/services/address.service";
import IndonesiaRegionSelects from "@/components/account/IndonesiaRegionSelects";
import { showError, showSuccess, showSuccessToast } from "@/lib/alert";
import { Customer } from "@/types/customer";
import { CustomerSession } from "@/lib/session";

type Address = AddressPayload & { id: number };

const keepOneHomeAddress = (values: Address[]) => {
  const home =
    values.find((address) => address.label === "HOME" && address.is_default) ||
    values.find((address) => address.label === "HOME");
  return values.filter(
    (address) => address.label !== "HOME" || address.id === home?.id,
  );
};

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Customer | null | undefined>();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [message, setMessage] = useState("");
  const [addressFormKey, setAddressFormKey] = useState(0);

  const loadAddresses = () =>
    AddressService.getAll().then((result) =>
      setAddresses(keepOneHomeAddress(result.data ?? [])),
    );

  useEffect(() => {
    if (!CustomerSession.has()) {
      router.replace("/login?next=/account");
      return;
    }
    CustomerAuthService.profile()
      .then((result) => setProfile(result.data as Customer))
      .catch(() => setProfile(null));
    loadAddresses().catch(() => undefined);
  }, [router]);

  const updateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    try {
      const result = await CustomerAuthService.updateProfile({
        name: String(fields.get("name")),
        email: String(fields.get("email")),
        phone: String(fields.get("phone")),
      });
      setProfile(result.data as Customer);
      setMessage("Profil berhasil diperbarui.");
    } catch {
      setMessage("Profil belum dapat diperbarui.");
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const nextPassword = String(fields.get("new_password"));
    if (nextPassword !== String(fields.get("password_confirmation"))) {
      setMessage("Konfirmasi password belum sama.");
      return;
    }
    try {
      await CustomerAuthService.changePassword(
        String(fields.get("old_password")),
        nextPassword,
      );
      event.currentTarget.reset();
      setMessage("Password berhasil diubah.");
    } catch {
      setMessage(
        "Password lama tidak sesuai atau password baru terlalu pendek.",
      );
    }
  };

  const addAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const payload: AddressPayload = {
      receiver_name: String(fields.get("receiver_name")),
      phone: String(fields.get("address_phone")),
      label: String(fields.get("label")) as AddressPayload["label"],
      province: String(fields.get("province")),
      city: String(fields.get("city")),
      district: String(fields.get("district")),
      subdistrict: String(fields.get("subdistrict")),
      postal_code: String(fields.get("postal_code")),
      address: String(fields.get("address")),
      notes: "",
      is_default: fields.get("is_default") === "on",
    };
    if (
      !payload.province ||
      !payload.city ||
      !payload.district ||
      !payload.subdistrict
    ) {
      await showError(
        "Lengkapi wilayah alamat",
        "Pilih provinsi, kota/kabupaten, kecamatan, dan kelurahan terlebih dahulu.",
      );
      return;
    }
    try {
      await AddressService.create(payload);
      event.currentTarget.reset();
      setAddressFormKey((current) => current + 1);
      await loadAddresses();
      setMessage("Alamat berhasil ditambahkan.");
      await showSuccess("Alamat berhasil ditambahkan");
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: { message?: string; errors?: { message?: string }[] };
        };
      };
      const details = apiError.response?.data?.errors
        ?.map((item) => item.message)
        .filter(Boolean)
        .join(" ");
      const errorMessage =
        details ||
        apiError.response?.data?.message ||
        "Tidak dapat menyimpan alamat. Periksa koneksi lalu coba lagi.";
      setMessage(errorMessage);
      await showError("Alamat belum tersimpan", errorMessage);
    }
  };

  const logout = async () => {
    try {
      await CustomerAuthService.logout();
    } finally {
      CustomerSession.clear();
      void showSuccessToast("Berhasil keluar dari akun");
      router.replace("/");
    }
  };

  if (profile === undefined)
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  if (!profile)
    return (
      <MainLayout>
        <section className="container-custom py-16 text-center text-muted-foreground">
          Sesi tidak ditemukan. Mengarahkan ke halaman login…
        </section>
      </MainLayout>
    );

  return (
    <MainLayout>
      <section className="container-custom max-w-3xl py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-luxury text-5xl">My Profile</h1>
            <p className="mt-3 text-muted-foreground">
              Kelola detail akun dan alamat pengirimanmu.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/orders"
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary"
            >
              Pesanan Saya
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-destructive px-4 py-2 text-sm text-destructive"
            >
              Keluar
            </button>
          </div>
        </div>
        {message && (
          <p className="mt-5 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
            {message}
          </p>
        )}
        <form
          onSubmit={(event) => void updateProfile(event)}
          className="mt-8 space-y-4 rounded-2xl border border-border p-6"
        >
          <h2 className="text-xl font-semibold">Data Pribadi</h2>
          <label className="block">
            Nama
            <input
              required
              name="name"
              defaultValue={profile.name}
              className="mt-2 w-full rounded-xl border border-border p-3"
            />
          </label>
          <label className="block">
            Email
            <input
              required
              name="email"
              type="email"
              defaultValue={profile.email}
              className="mt-2 w-full rounded-xl border border-border p-3"
            />
          </label>
          <label className="block">
            Nomor telepon
            <input
              required
              name="phone"
              defaultValue={profile.phone}
              className="mt-2 w-full rounded-xl border border-border p-3"
            />
          </label>
          <button className="rounded-full bg-primary px-6 py-3 text-white">
            Simpan Profil
          </button>
        </form>
        <form
          onSubmit={(event) => void changePassword(event)}
          className="mt-6 grid gap-4 rounded-2xl border border-border p-6 md:grid-cols-2"
        >
          <h2 className="text-xl font-semibold md:col-span-2">Ubah Password</h2>
          <input
            required
            name="old_password"
            type="password"
            placeholder="Password lama"
            className="rounded-xl border border-border p-3"
          />
          <input
            required
            name="new_password"
            type="password"
            minLength={6}
            placeholder="Password baru (min. 6 karakter)"
            className="rounded-xl border border-border p-3"
          />
          <input
            required
            name="password_confirmation"
            type="password"
            minLength={6}
            placeholder="Konfirmasi password baru"
            className="rounded-xl border border-border p-3 md:col-span-2"
          />
          <button className="w-fit rounded-full bg-primary px-6 py-3 text-white md:col-span-2">
            Ubah Password
          </button>
        </form>
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Alamat Tersimpan</h2>
          <div className="mt-4 space-y-3">
            {addresses.length ? (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-start justify-between rounded-2xl border border-border p-5"
                >
                  <p>
                    <span className="font-medium">
                      {address.label} · {address.receiver_name}
                    </span>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {address.address}, {address.subdistrict},{" "}
                      {address.district}, {address.city}, {address.province}{" "}
                      {address.postal_code}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      AddressService.remove(address.id).then(loadAddresses)
                    }
                    className="text-sm text-destructive"
                  >
                    Hapus
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                Belum ada alamat tersimpan.
              </p>
            )}
          </div>
        </div>
        <form
          onSubmit={(event) => void addAddress(event)}
          className="mt-8 grid gap-4 rounded-2xl border border-border p-6 md:grid-cols-2"
        >
          <h2 className="text-xl font-semibold md:col-span-2">
            Tambah Alamat Pengiriman
          </h2>
          <input
            required
            name="receiver_name"
            placeholder="Nama penerima"
            className="rounded-xl border border-border p-3"
          />
          <input
            required
            name="address_phone"
            placeholder="Nomor telepon"
            className="rounded-xl border border-border p-3"
          />
          <select name="label" className="rounded-xl border border-border p-3">
            <option value="HOME">Rumah</option>
            <option value="OFFICE">Kantor</option>
            <option value="OTHER">Lainnya</option>
          </select>
          <IndonesiaRegionSelects key={addressFormKey} />
          <input
            required
            name="postal_code"
            placeholder="Kode pos"
            className="rounded-xl border border-border p-3"
          />
          <textarea
            required
            name="address"
            placeholder="Alamat lengkap"
            className="min-h-24 rounded-xl border border-border p-3 md:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" name="is_default" /> Jadikan alamat utama
          </label>
          <button className="w-fit rounded-full bg-primary px-6 py-3 text-white md:col-span-2">
            Simpan Alamat
          </button>
        </form>
      </section>
    </MainLayout>
  );
}
