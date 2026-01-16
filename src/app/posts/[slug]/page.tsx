import type { Metadata } from "next";
import { Suspense } from "react";
import { verifySession } from "@/lib/auth";
import PostItem from "@/components/items/post";

export const metadata: Metadata = {
  title: "Статья | Просмотр",
};

export default async function PostPage(props: {searchParams?: Promise<{ id?: string }>;}) {
  const searchParams = await props.searchParams;
  const id = searchParams?.id || '';
  const user = await verifySession()||null;

  return (
    <div className="content flex flex-col justify-center items-center gap-10 px-3 md:px-offsetX">
      <Suspense>
        <PostItem postId={id} currentUserId={user?.id}/>
      </Suspense>
    </div>
  );
}
