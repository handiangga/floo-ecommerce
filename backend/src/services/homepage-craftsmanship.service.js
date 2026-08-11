const HomepageCraftsmanshipRepository = require("../repositories/homepage-craftsmanship.repository");
const SupabaseService = require("./supabase.service");
const ImageHelper = require("../helpers/image.helper");

const defaults = {
  eyebrow: "Our Craftsmanship",
  title: "Crafted with Care, Made to Be Remembered.",
  description: "Setiap koleksi Floo Fashion hadir dari pemilihan material, detail yang dikerjakan dengan teliti, hingga siluet yang dirancang untuk membuat setiap perempuan tampil istimewa.",
  button_label: "Discover Our Story",
  button_link: "/products",
  features: [
    { title: "Premium Material", description: "Material pilihan berkualitas" },
    { title: "Thoughtful Details", description: "Detail dikerjakan dengan teliti" },
    { title: "Exclusive Design", description: "Desain khas Floo Fashion" },
    { title: "Loved by Customers", description: "Dipercaya 100K+ customer" },
  ],
  images: ["/images/products/3.jpg", "/images/products/4.jpg", "/images/products/5.jpg", "/images/products/6.jpg", "/images/products/7.jpg"],
  gallery: [
    { title: "Detail Payet", description: "Bordir dan payet dikerjakan satu per satu dengan presisi." },
    { title: "Bahan Premium", description: "Kain pilihan dengan tekstur mewah dan nyaman dipakai." },
    { title: "Handmade Process", description: "Setiap jahitan dibuat dengan ketelitian oleh tangan ahli." },
    { title: "Timeless Elegance", description: "Hasil akhir yang anggun untuk momen berharga Anda." },
    { title: "Finishing Touch", description: "Sentuhan akhir yang membuat setiap koleksi terasa istimewa." },
  ],
};

class HomepageCraftsmanshipService {
  async get() { return (await HomepageCraftsmanshipRepository.find()) || defaults; }
  async update(payload, files = []) {
    const current = await HomepageCraftsmanshipRepository.find();
    const existingImages = [...(current?.images || []), ...defaults.images].slice(0, 5);
    const nextImages = [...existingImages];
    const replacedImages = [];

    for (const file of files) {
      const index = Number(file.fieldname.replace("image_", ""));
      if (!Number.isInteger(index) || index < 0 || index > 4) continue;
      const uploaded = await SupabaseService.upload(await ImageHelper.product(file), "craftsmanship");
      if (existingImages[index]) replacedImages.push(existingImages[index]);
      nextImages[index] = uploaded.public_url;
    }

    const features = [0, 1, 2, 3].map((index) => ({
      title: String(payload[`feature_${index}_title`] || "").trim(),
      description: String(payload[`feature_${index}_description`] || "").trim(),
    }));
    if (features.some((feature) => !feature.title || !feature.description)) throw new Error("Semua poin keunggulan wajib diisi");
    const gallery = [0, 1, 2, 3, 4].map((index) => ({
      title: String(payload[`gallery_${index}_title`] || defaults.gallery[index].title).trim(),
      description: String(payload[`gallery_${index}_description`] || defaults.gallery[index].description).trim(),
    }));
    if (gallery.some((item) => !item.title || !item.description)) throw new Error("Lengkapi judul dan keterangan setiap foto galeri");

    const next = {
      eyebrow: String(payload.eyebrow || "").trim(),
      title: String(payload.title || "").trim(),
      description: String(payload.description || "").trim(),
      button_label: String(payload.button_label || "").trim(),
      button_link: String(payload.button_link || "/products").trim(),
      features,
      images: nextImages,
      gallery,
    };
    if (!next.eyebrow || !next.title || !next.description || !next.button_label || !next.button_link) throw new Error("Lengkapi seluruh konten Craftsmanship");

    const result = current
      ? await HomepageCraftsmanshipRepository.update(current.id, next)
      : await HomepageCraftsmanshipRepository.create(next);

    await Promise.all(replacedImages.map(async (oldImage) => {
      try { await SupabaseService.removeByPublicUrl(oldImage); } catch (error) { console.error("Failed to remove replaced craftsmanship image:", error.message); }
    }));
    return result;
  }
}

module.exports = new HomepageCraftsmanshipService();
