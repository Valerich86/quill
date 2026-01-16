"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Tags from "../lists/tags";

export default function AddTagsForm({ postId, isUpdating=false }: { postId: string, isUpdating?: boolean; }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (selectedTags.length === 0) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tags/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: selectedTags }),
      });
      router.push(`/posts/create/${postId}/preview`);
    } catch (error) {
      console.error("Ошибка сети: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeSelectedList = (tag: string) => {
    setSelectedTags(
      (prev) =>
        prev.includes(tag)
          ? prev.filter((t) => t !== tag) // удаляем тег, если есть
          : [...prev, tag] // добавляем тег, если нет
    );
  };

  return (
    <div className="form">
      <Tags onSelect={(tag) => changeSelectedList(tag)} userTag />

      {!isUpdating && (
        <button
        disabled={isLoading}
        onClick={handleSubmit}
        className="bg-accent_1 mt-5 text-white p-2 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
      >
        {isLoading ? "Сохранение..." : "Далее"}
      </button>
      )}
      {isUpdating && (
        <button
          disabled={isLoading}
          onClick={() => router.back()}
          className="bg-accent_1 mt-5 w-[90%] md:w-1/3 text-white p-2 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
        >
          Назад
        </button>
      )}
    </div>
  );
}
