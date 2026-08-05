"use client";

import { FormEvent, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";

const types = ["sales", "products", "customers", "payments", "orders"];

export default function ReportsPage() {
  const [type, setType] = useState("sales");
  const [data, setData] = useState<unknown>(null);
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const result = await AdminService.report(type, {
        start_date: String(form.get("start_date") || ""),
        end_date: String(form.get("end_date") || ""),
      });
      setData(result.data);
      setMessage("");
    } catch {
      setMessage("Unable to load report.");
    }
  };

  return <div className="flex min-h-screen bg-muted"><AdminSidebar /><main className="flex-1 p-6 md:p-10"><div className="mx-auto max-w-5xl"><h1 className="font-luxury text-4xl">Reports</h1><form onSubmit={submit} className="mt-6 flex flex-wrap gap-3 rounded-2xl bg-white p-5"><select value={type} onChange={(event) => setType(event.target.value)} className="rounded border p-3">{types.map((item) => <option key={item} value={item}>{item}</option>)}</select><input name="start_date" type="date" className="rounded border p-3" /><input name="end_date" type="date" className="rounded border p-3" /><button className="rounded-full bg-primary px-5 text-white">Generate</button></form>{message && <p className="mt-4 text-destructive">{message}</p>}{data && <pre className="mt-6 overflow-auto rounded-2xl bg-white p-5 text-sm">{JSON.stringify(data, null, 2)}</pre>}</div></main></div>;
}
