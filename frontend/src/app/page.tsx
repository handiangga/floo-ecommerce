import MainLayout from "@/components/layout/MainLayout";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import BestSeller from "@/components/home/BestSeller";
import NewArrival from "@/components/home/NewArrival";
import Story from "@/components/home/Story";
import Featured from "@/components/home/Featured";
import Review from "@/components/home/Review";
import Instagram from "@/components/home/Instagram";

export default function Home() {
  return (
    <MainLayout>
      <Hero />

      <Categories />

      <Featured />

      <BestSeller />

      <Story />

      <NewArrival />
      <Review />
      <Instagram />
    </MainLayout>
  );
}
