import type { Metadata } from "next";
import { Suspense } from "react";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostItem from "@/components/items/post";
import PublishButton from "@/components/ui/publish-button";
import Image from "next/image";
import Posts from "@/components/lists/posts";
import { font_accent } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Профиль пользователя",
};

export default async function AuthorPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ current: string }>}) {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  const id = params.id;
  const current = searchParams.current;

  return (
    <div className="content flex flex-col justify-center items-center gap-10 px-3 md:px-offsetX">
      
      <Suspense>
        <Posts userId={id} currentUserId={current}/>
      </Suspense>
    </div>
  );
}
