"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { ParsedLine } from "@/lib/types";
import Link from "next/link";

interface FormErrors {
  title?: string;
  content?: string;
  excerpt?: string;
}

type PostForm = {
  title: string;
  excerpt: string;
  content: string;
};

export default function UpdatePostForm({ postId }: { postId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<PostForm | null>(null);

  function parseJSXToText(jsonString: string): string {
    const parsedLines: ParsedLine[] = JSON.parse(jsonString);
    return parsedLines
      .map((line) => {
        switch (line.type) {
          case "heading":
            return `!!${line.content}`;
          case "offset":
            return `==${line.content}`;
          case "paragraph":
            return line.content;
          default:
            // На случай, если появятся другие типы — возвращаем контент как есть
            return line.content;
        }
      })
      .join("\n");
  }

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const { post } = await response.json();
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: parseJSXToText(post.content),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          // Устанавливаем ошибки в состояние
          setErrors(errorData.errors);
        }
        return;
      }
      router.push(`/profile`);
    } catch (error) {
      console.error("Ошибка сети: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return <Loading />;

  return (
    <form className="form" onSubmit={handleSubmit}>
      {/* title */}
      <fieldset className="fieldset">
        <legend className="legend">
          Заголовок<span className="text-red-500 ml-1">*</span>
        </legend>
        <input
          className="input"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {errors.title && <p className="error">{errors.title}</p>}
      </fieldset>

      {/* excerpt */}
      <fieldset className="fieldset">
        <legend className="legend">
          Анонс / выдержка<span className="text-red-500 ml-1">*</span>
        </legend>
        <input
          className="input"
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
        />
        {errors.excerpt && <p className="error">{errors.excerpt}</p>}
      </fieldset>

      {/* content */}
      <fieldset className="fieldset">
        <legend className="legend">
          Весь контент<span className="text-red-500 ml-1">*</span>
        </legend>
        <textarea
          className="input"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={10}
          placeholder={`начните строку с "!!", чтобы превратить её в подзаголовок; разделяйте абзацы с помощью "=="`}
        />
        {errors.content && <p className="error">{errors.content}</p>}
      </fieldset>

      <div className="flex w-full justify-between">
        <Link href={`/posts/create/${postId}/add-photos?isUpdating=true`} className={`text-light bg-dark hover:opacity-90 cursor-pointer flex px-3 py-1 gap-5 items-center border border-light rounded`}>
          Изменить фото
        </Link>
        <Link href={`/posts/create/${postId}/add-tags?isUpdating=true`} className={`text-light bg-dark hover:opacity-90 cursor-pointer flex px-3 py-1 gap-5 items-center border border-light rounded`}>
          Изменить теги
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-accent_1 mt-5 text-white p-2 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
      >
        {isLoading ? "Сохранение..." : "Сохранить изменения"}
      </button>
    </form>
  );
}
