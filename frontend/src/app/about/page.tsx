import Link from "next/link";
import PolicyPage from "@/components/legal/PolicyPage";

export default function AboutPage() {
  return <PolicyPage eyebrow="The Floo Story" title="Elegance, made personal." intro="Floo Fashion adalah rumah modest wear yang merayakan setiap momen perempuan Indonesia—dari acara keluarga hingga hari yang paling istimewa." updated="8 Agustus 2026" sections={[
    { title: "Tentang Floo Fashion", body: ["Kami merancang kebaya dan modest wear dengan siluet yang anggun, detail yang teliti, serta material yang nyaman dipakai. Setiap koleksi dibuat agar kamu merasa percaya diri tanpa kehilangan karakter personalmu."] },
    { title: "Crafted with heart", body: ["Dari pemilihan bahan, proses pola, hingga detail akhir, kami menjaga kualitas di setiap tahapan. Kami percaya pakaian untuk momen spesial seharusnya terasa istimewa sejak pertama kali dikenakan."] },
    { title: "Belanja dengan tenang", body: ["Kami menyediakan bantuan melalui WhatsApp untuk pertanyaan ukuran, produk, pesanan, atau pengembalian. Silakan hubungi tim Floo Fashion bila membutuhkan rekomendasi sebelum checkout."], children: <Link href="https://wa.me/6281393354305" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-full bg-[#a26c36] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#86562e]">Hubungi WhatsApp Floo</Link> },
  ]} />;
}
