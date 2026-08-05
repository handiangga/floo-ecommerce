"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomerSession } from "@/lib/session";
export default function GoogleCallbackPage() { const router = useRouter(); const params = useSearchParams(); useEffect(() => { const token = params.get("token"); if (token) { CustomerSession.save(token); router.replace("/account"); } else router.replace("/login"); }, [params, router]); return <main className="grid min-h-screen place-items-center">Menyelesaikan login Google…</main>; }
