"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import { CustomerAuthService } from "@/services/auth.service";

const safeDestination = (value: string | null) => value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/admin") ? value : "/account";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = useMemo(() => safeDestination(searchParams.get("next")), [searchParams]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token")) router.replace(destination);
  }, [destination, router]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setError("");
    setIsSubmitting(true);
    try {
      const result = await CustomerAuthService.login(String(values.get("email")), String(values.get("password")));
      localStorage.setItem("access_token", result.data.token);
      router.replace(destination);
    } catch {
      setError("Email atau password tidak valid.");
      setIsSubmitting(false);
    }
  };

  const registerHref = destination === "/account" ? "/register" : `/register?next=${encodeURIComponent(destination)}`;
  return <MainLayout><section className="mx-auto max-w-md px-6 py-16 md:py-24"><div className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-9"><div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"><LockKeyhole className="size-5" /></div><h1 className="mt-5 font-luxury text-4xl">Welcome Back</h1><p className="mt-2 text-sm text-muted-foreground">Masuk untuk melihat pesanan, wishlist, dan melanjutkan checkout.</p><form onSubmit={(event) => void submit(event)} className="mt-7 space-y-4"><label className="grid gap-1.5 text-sm font-medium">Email<input required name="email" type="email" autoComplete="email" placeholder="nama@email.com" className="rounded-xl border border-border p-3 font-normal" /></label><label className="grid gap-1.5 text-sm font-medium">Password<span className="relative"><input required name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Masukkan password" className="w-full rounded-xl border border-border p-3 pr-11 font-normal" /><button type="button" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>{error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}<button disabled={isSubmitting} className="w-full rounded-full bg-primary py-3 text-sm font-medium text-white disabled:opacity-60">{isSubmitting ? "Memproses…" : "Masuk"}</button></form><p className="mt-6 text-center text-sm text-muted-foreground">Belum punya akun? <Link href={registerHref} className="font-medium text-primary hover:underline">Daftar sekarang</Link></p></div></section></MainLayout>;
}
