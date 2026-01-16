"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UploadedPhotos from "../lists/uploaded-photos";

export default function AddPhotosForm({
  postId,
  isUpdating = false,
}: {
  postId: string;
  isUpdating?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    getUploaded();
  }, [refetch]);

  const getUploaded = async () => {
    try {
      const response = await fetch(`/api/photos/${postId}`);
      const photos = await response.json();
      setUploadedPhotos(photos);
    } catch (error) {
      console.error("Ошибка: ", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let formData = new FormData(event.currentTarget);
      const file = formData.get("file") as File | null;
      if (!file) {
        setError("Выберите файл");
        return;
      }

      const response = await fetch(`/api/photos`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setError("Ошибка загрузки файла");
      }
      formData = new FormData();
      reloadPage();
    } catch (error) {
      console.error("Ошибка: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadPage = () => {
    setRefetch(!refetch);
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <fieldset className="fieldset">
          <legend className="legend">
            {uploadedPhotos.length === 0
              ? "Загрузите основное фото статьи"
              : "Загрузите дополнительные фотографии"}
          </legend>
          <input
            type="file"
            name="file"
            className="input-file"
            accept="image/*"
          />
          {error && <p className="error">{error}</p>}
        </fieldset>

        {/* caption */}
        {uploadedPhotos.length > 0 && (
          <fieldset className="fieldset">
            <legend className="legend">Подпись</legend>
            <input className="input" name="caption" />
          </fieldset>
        )}

        <input type="hidden" name="post_id" value={postId}></input>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-accent_2 mt-5 text-white p-2 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
        >
          {isLoading ? "Сохранение..." : "Добавить фото"}
        </button>
      </form>

      <UploadedPhotos photos={uploadedPhotos} reload={reloadPage} />

      {!isUpdating && (
        <button
          disabled={isLoading}
          onClick={() => router.push(`/posts/create/${postId}/add-tags`)}
          className="bg-accent_1 mt-5 w-[90%] md:w-1/3 text-white p-2 rounded-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:opacity-90 active:scale-99 cursor-pointer"
        >
          Далее
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
    </>
  );
}
