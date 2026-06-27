import MainLayout from "@/components/layout/MainLayout";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import BestSeller from "@/components/home/BestSeller";

export default function Home() {
  return (
    <MainLayout>
      <Hero />

      <Categories />

      <BestSeller />
    </MainLayout>
  );
}
