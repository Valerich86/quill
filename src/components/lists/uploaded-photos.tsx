"use client";

import { AiFillDelete } from "react-icons/ai";
import Image from "next/image";

type PhotoItem = {
  id: string;
  post_id: string;
  url: string;
  caption: string;
  alt: string;
  position: number;
};

interface UploadedPhotosProps {
  photos: PhotoItem[];
  reload: () => void;
}

export default function UploadedPhotos({
  photos,
  reload,
}: UploadedPhotosProps) {
  const handleDelete = async (item: PhotoItem) => {
    try {
      const response = await fetch(`/api/photos`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: item.url, id: item.id }),
      });
      const data = await response.json();
      if (response.ok) {
        reload();
      } else {
        console.error("Ошибка:", data.error);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      return false;
    }
  };

  const UploadedItem = ({ item }: { item: PhotoItem }) => {
    return (
      <div className="flex flex-col items-center relative">
        <button
          className="text-gray-700 absolute -right-2 -top-2 cursor-pointer hover:opacity-90"
          onClick={() => handleDelete(item)}
        >
          <AiFillDelete />
        </button>
        <div className="w-30 h-30">
          <Image
            src={item.url}
            alt={item.alt ? item.alt : ""}
            width={300}
            height={300}
            className="object-cover object-center w-full h-full rounded-2xl"
          />
        </div>
        {item.caption && <p className="italic text-sm">{item.caption}</p>}
      </div>
    );
  };

  if (!photos || photos.length === 0) {
    return <p>Фото не загружены</p>;
  }

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <p className="text-center text-xl">Основное фото</p>
      <UploadedItem item={photos[0]} />
      <p className="text-center text-xl mt-5">Дополнительные фото</p>
      <div className="w-full flex justify-center">
        <div className="flex flex-wrap gap-5 justify-center w-full md:w-2/3">
          {photos
            .filter((_, index) => index > 0)
            .map((item) => (
              <UploadedItem item={item} key={item.id} />
            ))}
        </div>
      </div>
    </div>
  );
}
