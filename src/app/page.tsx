import CreatePost from "@/components/sections/createPost";
import HeroSection from "@/components/sections/hero";
import SelectionPosts from "@/components/sections/selection-posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Главная",
};

export default function Home() {
  return (
    <main className="flex flex-col gap-10">
      <HeroSection />
      <SelectionPosts criteria={"published_at"} headline={"Наши новые статьи"} limit={5}/>
      <SelectionPosts criteria={"views"} headline={"Самые популярные статьи"} limit={5}/>
      <CreatePost />
    </main>
  );
}
