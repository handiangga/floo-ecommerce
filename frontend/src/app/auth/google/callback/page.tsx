"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomerSession } from "@/lib/session";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    CustomerSession.save();
    router.replace("/account");
  }, [router]);

  return <CallbackLoading />;
}

function CallbackLoading() {
  return <main className="grid min-h-screen place-items-center">Menyelesaikan login Google...</main>;
}
