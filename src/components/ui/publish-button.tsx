"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PublishButton({ postId }: { postId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const publishPost = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: true }),
      });
      router.replace("/profile");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-y-5 md:justify-between">
      <Link
        href={`/posts/update/${postId}`}
        className=" bg-gray-600 text-white text-center px-5 py-3 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
      >
        {"Вернуться и отредактировать"}
      </Link>
      <button
        disabled={isLoading}
        onClick={publishPost}
        className=" bg-accent_1 text-white px-5 py-3 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
      >
        {isLoading ? "Сохранение..." : "Всё хорошо. Опубликовать"}
      </button>
    </div>
  );
}
