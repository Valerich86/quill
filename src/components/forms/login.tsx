"use client";

import { useState } from "react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error) {
          setError(errorData.error);
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

      {/* email */}
      <fieldset className="fieldset">
        <legend className="legend">Email <span className="text-red-500 ml-1">*</span></legend>
        <input
          className="input"
          type="email"
          name="email"
        />
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
      </fieldset>
      {error && <p className="error">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-accent_1 mt-5 text-white p-2 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
      >
        {isLoading ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}
