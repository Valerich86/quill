import type { Metadata } from "next";
import { Suspense } from "react";
import { font_accent } from "@/lib/fonts";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AddPhotosForm from "@/components/forms/add-photos";

export const metadata: Metadata = {
  title: "Новая статья | Добавление фото",
};

export default async function AddPhotosPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ isUpdating?: string }> }) {
  const user = await verifySession();
  if (!user) redirect("/auth/login");
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  const id = params.id;
  const isUpdating = searchParams.isUpdating === 'true';

  return (
    <div className="content flex flex-col justify-center items-center gap-10">
      <h1 className={`${font_accent.className} text-center text-light text-2xl`}>Добавление фото </h1>
      <Suspense>
        <AddPhotosForm postId={id} isUpdating={isUpdating}/>
      </Suspense>
    </div>
  );
}
