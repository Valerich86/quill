"use client";

import { useState } from "react";

interface FormErrors {
  name?: string;
  email?: string;
  bio?: string;
  password?: string;
  confirm?: string;
  avatar?: string;
}

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('/api/auth/register', {
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
      window.location.replace("/");
    } catch (error) {
      console.error("Ошибка сети: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {/* name */}
      <fieldset className="fieldset">
        <legend className="legend">Ваше имя (для всех пользователей) <span className="text-red-500 ml-1">*</span></legend>
        <input
          className="input"
          type="text"
          name="name"
          autoFocus
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </fieldset>

      {/* email */}
      <fieldset className="fieldset">
        <legend className="legend">Email <span className="text-red-500 ml-1">*</span></legend>
        <input
          className="input"
          type="email"
          name="email"
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </fieldset>

      {/* bio */}
      <fieldset className="fieldset">
        <legend className="legend">Пару слов о себе</legend>
        <textarea
          className="input"
          name="bio"
          rows={5}
        />
        {errors.bio && <p className="error">{errors.bio}</p>}
      </fieldset>

      {/* avatar */}
      <fieldset className="fieldset">
        <legend className="legend">Фото для аватара</legend>
        <input
          className="input input-file"
          name="avatar"
          type="file"
          accept="image/*"
        />
        {errors.avatar && <p className="error">{errors.avatar}</p>}
      </fieldset>

      {/* password */}
      <fieldset className="fieldset">
        <legend className="legend">Придумайте пароль <span className="text-red-500 ml-1">*</span></legend>
        <input
          className="input"
          type="password"
          name="password"
          placeholder="минимум 8 символов"
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </fieldset>

      {/* confirm */}
      <fieldset className="fieldset">
        <legend className="legend">Повторите пароль <span className="text-red-500 ml-1">*</span></legend>
        <input
          className="input"
          type="password"
          name="confirm"
        />
        {errors.confirm && <p className="error">{errors.confirm}</p>}
      </fieldset>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-accent_1 mt-5 text-white p-2 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
      >
        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}
