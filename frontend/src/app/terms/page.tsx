import PolicyPage from "@/components/legal/PolicyPage";

export default function TermsPage() {
  return <PolicyPage eyebrow="Legal" title="Syarat & Ketentuan" intro="Dengan mengakses dan berbelanja di Floo Fashion, kamu menyetujui ketentuan berikut." updated="8 Agustus 2026" sections={[
    { title: "Produk & ketersediaan", body: ["Kami berupaya menampilkan foto, warna, ukuran, dan deskripsi produk seakurat mungkin. Namun tampilan warna dapat berbeda pada setiap layar. Ketersediaan stok dapat berubah dan pesanan dapat dibatalkan apabila stok ternyata tidak tersedia; pembayaran yang telah diterima akan dikembalikan sesuai prosedur."] },
    { title: "Harga & pembayaran", body: ["Harga yang berlaku adalah harga pada saat checkout dalam Rupiah Indonesia. Pesanan diproses setelah pembayaran terverifikasi oleh sistem pembayaran kami. Promo atau voucher dapat memiliki syarat, masa berlaku, dan kuota tersendiri."] },
    { title: "Akun pelanggan", body: ["Pelanggan bertanggung jawab menjaga kerahasiaan akun dan informasi masuknya. Segera hubungi kami bila terdapat aktivitas yang tidak dikenali pada akun atau pesananmu."] },
    { title: "Perubahan ketentuan", body: ["Floo Fashion dapat memperbarui halaman ini untuk menyesuaikan layanan dan peraturan yang berlaku. Versi terbaru akan selalu ditampilkan di situs dan berlaku sejak tanggal pembaruan."] },
  ]} />;
}
