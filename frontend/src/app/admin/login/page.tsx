"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminService } from "@/services/admin.service";
import { AdminSession } from "@/lib/session";
import { showError, showSuccessToast } from "@/lib/alert";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setLoading(true);
    try {
      await AdminService.login(
        String(values.get("email")),
        String(values.get("password")),
      );
      AdminSession.save();
      void showSuccessToast("Login berhasil. Selamat datang, Admin!");
      router.replace("/admin");
    } catch {
      await showError(
        "Login admin gagal",
        "Email atau password admin tidak valid.",
      );
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-muted p-6">
      <form
        onSubmit={(event) => void submit(event)}
        className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-sm"
      >
        <p className="text-primary text-sm font-medium">FLOO FASHION</p>
        <h1 className="font-luxury mt-2 text-4xl">Admin Login</h1>
        <input
          required
          name="email"
          type="email"
          placeholder="Email"
          className="mt-7 w-full rounded-xl border p-3"
        />
        <input
          required
          name="password"
          type="password"
          placeholder="Password"
          className="mt-3 w-full rounded-xl border p-3"
        />
        <button
          disabled={loading}
          className="mt-5 w-full rounded-full bg-primary py-3 text-white disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
