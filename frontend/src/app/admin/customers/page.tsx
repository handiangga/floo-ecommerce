"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
type Customer = { id: number; name: string; email: string; phone?: string; status?: string };
export default function CustomersPage() { const router = useRouter(); const [items, setItems] = useState<Customer[]>([]); useEffect(() => { if (!localStorage.getItem("admin_access_token")) router.replace("/admin/login"); else AdminService.customers().then((r) => setItems(r.data ?? [])).catch(() => router.replace("/admin/login")); }, [router]); return <div className="flex min-h-screen bg-muted"><AdminSidebar /><main className="flex-1 p-6 md:p-10"><h1 className="font-luxury text-4xl">Customers</h1><div className="mt-6 overflow-x-auto rounded-2xl bg-white p-5"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Status</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b"><td className="p-3">{item.name}</td><td className="p-3">{item.email}</td><td className="p-3">{item.phone ?? "—"}</td><td className="p-3">{item.status ?? "ACTIVE"}</td></tr>)}</tbody></table></div></main></div>; }
