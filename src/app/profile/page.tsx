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

export default async function ProfilePage() {
  const user = await verifySession();
  if (!user) redirect("/auth/login");

  return (
    <div className="content flex flex-col justify-center items-center gap-10 px-3 md:px-offsetX">
      <div className="w-full flex flex-col md:flex-row gap-10 items-center">
        <div
          className={`border-accent_1 bg-accent_2 border-3 w-50 h-50 flex justify-center items-center rounded-full`}
        >
          {user.avatar !== null && (
            <Image
              src={user.avatar}
              alt=""
              width={500}
              height={500}
              priority
              className="rounded-full h-full w-full object-cover "
            />
          )}
          {user.avatar === null && (
            <span className={`${font_accent.className} text-5xl`}>{user.name.substring(0, 2)}</span>
          )}
        </div>
        <h1 className={`text-center text-light text-2xl italic`}>
          Пользователь {user.name}
        </h1>
      </div>
      <Suspense>
        <Posts userId={user.id} currentUserId={user.id}/>
      </Suspense>
    </div>
  );
}
