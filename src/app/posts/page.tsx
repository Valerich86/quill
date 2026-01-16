import type { Metadata } from "next";
import { verifySession } from "@/lib/auth";
import Posts from "@/components/lists/posts";

export const metadata: Metadata = {
  title: "Статьи",
};

export default async function PostsPage() {
  const user = await verifySession();
  return (
    <div className="content flex flex-col justify-center items-center gap-10 px-3 md:px-offsetX relative">
      <Posts />
    </div>
  );
}

