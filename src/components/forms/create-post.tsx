"use client";

import { useState } from "react";

interface FormErrors {
  title?: string;
  content?: string;
  excerpt?: string;
}

export default function CreatePostForm({userId}:{userId:string}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          // Устанавливаем ошибки в состояние
          setErrors(errorData.errors);
        }
        return;
      }
      const {id} = await response.json();
      window.location.replace(`/posts/create/${id}/add-photos`);
    } catch (error) {
      console.error("Ошибка сети: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {/* title */}
      <fieldset className="fieldset">
        <legend className="legend">Заголовок<span className="text-red-500 ml-1">*</span></legend>
        <input
          className="input"
          name="title"
          autoFocus
        />
        {errors.title && <p className="error">{errors.title}</p>}
      </fieldset>

      {/* excerpt */}
      <fieldset className="fieldset">
        <legend className="legend">Анонс / выдержка<span className="text-red-500 ml-1">*</span></legend>
        <input
          className="input"
          name="excerpt"
        />
        {errors.excerpt && <p className="error">{errors.excerpt}</p>}
      </fieldset>

      {/* content */}
      <fieldset className="fieldset">
        <legend className="legend">Весь контент<span className="text-red-500 ml-1">*</span></legend>
        <textarea
          className="input"
          name="content"
          rows={10}
          placeholder={`начните строку с "!!", чтобы превратить её в подзаголовок; разделяйте абзацы с помощью "=="`}
        />
        {errors.content && <p className="error">{errors.content}</p>}
      </fieldset>

      <input type="hidden" name="user_id" value={userId}></input>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-accent_1 mt-5 text-white p-2 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
      >
        {isLoading ? "Сохранение..." : "Далее"}
      </button>
    </form>
  );
}
