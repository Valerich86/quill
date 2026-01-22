import type { Metadata } from "next";
import { Suspense } from "react";
import { font_accent } from "@/lib/fonts";
import CreatePostForm from "@/components/forms/create-post";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Новая статья",
};

export default async function CreatePostPage() {
  const user = await verifySession();
  if (!user) redirect("/auth/login");
  return (
    <div className="content flex flex-col justify-center items-center gap-10">
      <h1
        className={`${font_accent.className} text-center text-light text-2xl`}
      >
        Новая статья
      </h1>
      <Suspense>
        <CreatePostForm userId={user.id} />
      </Suspense>
    </div>
  );
}
