"use client";

import { useState } from "react";

type FormErrors = {
  content?: string;
}

interface CreateCommentFormProps {
  userId: string;
  postId: string;
  reloadPage: () => void;
}

export default function CreateCommentForm({userId, postId, reloadPage}:CreateCommentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        }
        return;
      }
      reloadPage();
    } catch (error) {
      console.error("Ошибка сети: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <fieldset className="fieldset">
        <legend className="legend">Оставьте свой комментарий или ответьте другим</legend>
        <textarea
          className="input"
          name="content"
          rows={3}
        />
        {errors.content && <p className="error">{errors.content}</p>}
      </fieldset>
      <input type="hidden" name="user_id" value={userId}></input>
      <input type="hidden" name="post_id" value={postId}></input>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-accent_1 mt-5 text-white p-2 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
      >
        {isLoading ? "Сохранение..." : "Опубликовать"}
      </button>
    </form>
  );
}
