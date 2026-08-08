import PolicyPage from "@/components/legal/PolicyPage";

export default function ShippingPage() {
  return <PolicyPage eyebrow="Customer Care" title="Informasi Pengiriman" intro="Ketahui proses pengemasan, pengiriman, dan cara melacak pesanan Floo Fashion." updated="8 Agustus 2026" sections={[
    { title: "Waktu pemrosesan", body: ["Pesanan yang pembayarannya telah terverifikasi akan diproses pada hari kerja. Untuk produk ready stock, kami usahakan pesanan dikirim dalam 1–2 hari kerja. Produk pre-order atau produk dengan penyesuaian akan mengikuti estimasi yang tercantum pada halaman produk."] },
    { title: "Mitra pengiriman", body: ["Pilihan kurir tersedia saat checkout, sesuai cakupan alamat tujuan. Saat ini pengiriman dapat menggunakan JNE, J&T, SiCepat, atau AnterAja. Ketersediaan layanan dan estimasi tiba dapat berbeda tergantung wilayah tujuan."] },
    { title: "Ongkos kirim & pelacakan", body: ["Biaya pengiriman dihitung otomatis dari alamat, berat pesanan, dan layanan kurir yang dipilih. Nomor resi akan tersedia di halaman Pesanan setelah paket diserahkan kepada kurir."] },
    { title: "Keterlambatan", body: ["Estimasi pengiriman berasal dari kurir dan dapat berubah karena cuaca, hari libur, atau kondisi operasional wilayah. Apabila status pengiriman tidak berubah dalam waktu yang tidak wajar, hubungi kami melalui WhatsApp dengan menyertakan nomor pesanan."] },
  ]} />;
}
