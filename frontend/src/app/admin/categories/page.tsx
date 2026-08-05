"use client";
import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";

type Category = { id: number; name: string; description?: string };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const load = () => AdminService.categories().then((r) => setItems(r.data?.data ?? r.data ?? []));
  useEffect(() => { load(); }, []);
  const add = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); await AdminService.createCategory({ name: String(form.get("name")), description: String(form.get("description") || "") }); event.currentTarget.reset(); load(); };
  return <div className="flex min-h-screen bg-muted"><AdminSidebar /><main className="flex-1 p-6 md:p-10"><div className="mx-auto max-w-4xl"><h1 className="font-luxury text-4xl">Categories</h1><form onSubmit={add} className="mt-6 flex flex-wrap gap-3 rounded-2xl bg-white p-5"><input required name="name" placeholder="Category name" className="flex-1 rounded border p-3" /><input name="description" placeholder="Description" className="flex-1 rounded border p-3" /><button className="rounded-full bg-primary px-5 text-white">Add</button></form><div className="mt-5 space-y-3">{items.map((item) => <div key={item.id} className="flex justify-between rounded-xl bg-white p-4"><span>{item.name}</span><button onClick={() => AdminService.removeCategory(item.id).then(load)} className="text-destructive">Delete</button></div>)}</div></div></main></div>;
}
