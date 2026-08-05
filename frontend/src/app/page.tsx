import MainLayout from "@/components/layout/MainLayout";
import Hero from "@/components/home/Hero";
import BestSeller from "@/components/home/BestSeller";
import Story from "@/components/home/Story";
import Review from "@/components/home/Review";
import Instagram from "@/components/home/Instagram";
import TrustBar from "@/components/home/TrustBar";
import Occasions from "@/components/home/Occasions";
import ProductPromise from "@/components/home/ProductPromise";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <TrustBar />

      <Occasions />
      <BestSeller />
      <ProductPromise />
      <Story />
      <Review />
      <Instagram />
    </MainLayout>
  );
}
