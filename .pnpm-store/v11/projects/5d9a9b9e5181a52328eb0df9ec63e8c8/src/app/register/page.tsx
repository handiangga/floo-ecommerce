"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { CustomerSession } from "@/lib/session";
import { CustomerAuthService } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    if (password !== String(data.get("confirmation"))) {
      setError("Konfirmasi password belum sama.");
      return;
    }
    setLoading(true);
    try {
      const payload = { name: String(data.get("name")), email: String(data.get("email")), phone: String(data.get("phone")), password };
      await CustomerAuthService.register(payload);
      await CustomerAuthService.login(payload.email, password);
      CustomerSession.save();
      router.replace("/account");
    } catch {
      setError("Pendaftaran gagal. Email atau nomor WhatsApp mungkin sudah digunakan.");
      setLoading(false);
    }
  };

  return <MainLayout><section className="mx-auto max-w-md px-6 py-16 md:py-24"><div className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-9"><h1 className="font-luxury text-4xl">Create Account</h1><p className="mt-2 text-sm text-muted-foreground">Buat akun untuk belanja lebih cepat.</p><div className="mt-6"><GoogleLoginButton /></div><div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />atau<span className="h-px flex-1 bg-border" /></div><form onSubmit={(event) => void submit(event)} className="space-y-4"><input required name="name" placeholder="Nama lengkap" className="w-full rounded-xl border border-border p-3" /><input required name="email" type="email" placeholder="Email" className="w-full rounded-xl border border-border p-3" /><input required name="phone" placeholder="Nomor WhatsApp" className="w-full rounded-xl border border-border p-3" /><input required name="password" type="password" minLength={8} placeholder="Password (min. 8 karakter)" className="w-full rounded-xl border border-border p-3" /><input required name="confirmation" type="password" minLength={8} placeholder="Konfirmasi password" className="w-full rounded-xl border border-border p-3" />{error && <p className="text-sm text-destructive">{error}</p>}<button disabled={loading} className="w-full rounded-full bg-primary py-3 text-white disabled:opacity-60">{loading ? "Membuat akun..." : "Buat Akun"}</button></form><p className="mt-6 text-center text-sm text-muted-foreground">Sudah punya akun? <Link href="/login" className="text-primary">Masuk</Link></p></div></section></MainLayout>;
}
