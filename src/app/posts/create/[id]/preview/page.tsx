import type { Metadata } from "next";
import { Suspense } from "react";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostItem from "@/components/items/post";
import PublishButton from "@/components/ui/publish-button";

export const metadata: Metadata = {
  title: "Новая статья | Просмотр",
};

export default async function PreviewPage(props: { params: Promise<{ id: string }> }) {
  const user = await verifySession();
  if (!user) redirect("/auth/login");
  const params = await props.params;
  const {id} = params;

  return (
    <div className="content flex flex-col justify-center items-center gap-10 px-3 md:px-offsetX">
      <h1 className={`text-center text-light text-md italic`}>Предварительный просмотр</h1>
      <Suspense>
        <PostItem postId={id} isPreview/>
      </Suspense>
      <PublishButton postId={id}/>
    </div>
  );
}
