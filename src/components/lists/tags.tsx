"use client";

import { useState, useEffect } from "react";
import { Tag } from "@/lib/types";
import { TagItem } from "../items/tag";

type FormErrors = {
  name?: string;
};

interface TagsProps {
  onSelect: (tag: string) => void;
  userTag?: boolean;
}

export default function Tags({ onSelect, userTag = false }: TagsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [addTagFormVisible, setAddTagFormVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [refetch]);

  const fetchTags = async () => {
    try {
      const response = await fetch(`/api/tags`);
      const tags = await response.json();
      setTags(tags);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/tags", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        }
        return;
      }
      setAddTagFormVisible(false);
      setRefetch(!refetch);
    } catch (error) {
      console.error("Ошибка сети: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <>
      <div className="flex flex-wrap gap-5 justify-between items-center w-full">
        {tags.map((item) => (
          <TagItem item={item} key={item.id} onSelect={onSelect}/>
        ))}
        {userTag && (
          <div
            onClick={() => setAddTagFormVisible(!addTagFormVisible)}
            className={`rounded-full bg-gray-600 text-light px-2 py-1 text-sm cursor-pointer hover:opacity-90`}
          >
            Свой тег
          </div>
        )}
      </div>
      {addTagFormVisible && (
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="legend">Можете добавить свой тег</legend>
            <input className="input" name="name" autoFocus/>
            {errors.name && <p className="error">{errors.name}</p>}
          </fieldset>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-accent_2 mt-5 text-white p-2 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
          >
            {isLoading ? "Сохранение..." : "Добавить тег"}
          </button>
        </form>
      )}
    </>
  );
}

