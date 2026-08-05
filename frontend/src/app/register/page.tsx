"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRoundPlus } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import { CustomerAuthService } from "@/services/auth.service";

const safeDestination = (value: string | null) => value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/admin") ? value : "/account";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = useMemo(() => safeDestination(searchParams.get("next")), [searchParams]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const password = String(values.get("password"));
    if (password !== String(values.get("password_confirmation"))) {
      setError("Konfirmasi password belum sama.");
      return;
    }
    const payload = { name: String(values.get("name")), email: String(values.get("email")), phone: String(values.get("phone")), password };
    setError("");
    setIsSubmitting(true);
    try {
      await CustomerAuthService.register(payload);
      const login = await CustomerAuthService.login(payload.email, payload.password);
      localStorage.setItem("access_token", login.data.token);
      router.replace(destination);
    } catch {
      setError("Pendaftaran gagal. Pastikan email dan nomor telepon belum digunakan.");
      setIsSubmitting(false);
    }
  };

  const loginHref = destination === "/account" ? "/login" : `/login?next=${encodeURIComponent(destination)}`;
  return <MainLayout><section className="mx-auto max-w-md px-6 py-16 md:py-24"><div className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-9"><div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRoundPlus className="size-5" /></div><h1 className="mt-5 font-luxury text-4xl">Create Account</h1><p className="mt-2 text-sm text-muted-foreground">Buat akun untuk berbelanja lebih cepat dan menyimpan pesananmu.</p><form onSubmit={(event) => void submit(event)} className="mt-7 space-y-4"><label className="grid gap-1.5 text-sm font-medium">Nama lengkap<input required name="name" minLength={2} autoComplete="name" className="rounded-xl border border-border p-3 font-normal" /></label><label className="grid gap-1.5 text-sm font-medium">Email<input required name="email" type="email" autoComplete="email" className="rounded-xl border border-border p-3 font-normal" /></label><label className="grid gap-1.5 text-sm font-medium">Nomor WhatsApp<input required name="phone" minLength={8} autoComplete="tel" placeholder="08xxxxxxxxxx" className="rounded-xl border border-border p-3 font-normal" /></label><label className="grid gap-1.5 text-sm font-medium">Password<input required name="password" type="password" minLength={6} autoComplete="new-password" className="rounded-xl border border-border p-3 font-normal" /></label><label className="grid gap-1.5 text-sm font-medium">Konfirmasi password<input required name="password_confirmation" type="password" minLength={6} autoComplete="new-password" className="rounded-xl border border-border p-3 font-normal" /></label>{error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}<button disabled={isSubmitting} className="w-full rounded-full bg-primary py-3 text-sm font-medium text-white disabled:opacity-60">{isSubmitting ? "Membuat akun…" : "Buat Akun"}</button></form><p className="mt-6 text-center text-sm text-muted-foreground">Sudah punya akun? <Link href={loginHref} className="font-medium text-primary hover:underline">Masuk</Link></p></div></section></MainLayout>;
}
