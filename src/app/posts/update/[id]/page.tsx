import type { Metadata } from "next";
import { Suspense } from "react";
import { font_accent } from "@/lib/fonts";
import UpdatePostForm from "@/components/forms/update-post";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Редактирование",
};

export default async function UpdatePostPage(props: {params: Promise<{id:string}>}) {
  const user = await verifySession();
  if (!user) redirect("/auth/login");
  const {id} = await props.params;

  return (
    <div className="content flex flex-col justify-center items-center gap-10">
      <h1 className={`${font_accent.className} text-center text-light text-2xl`}>Редактирование статьи</h1>
      <Suspense>
        <UpdatePostForm postId={id}/>
      </Suspense>
    </div>
  );
}
