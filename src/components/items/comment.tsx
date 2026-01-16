"use client";

import { MdDelete } from "react-icons/md";
import { font_default } from "@/lib/fonts";
import { Comment } from "@/lib/types";

interface CommentItemProps {
  item: Comment;
  i: number;
  postAuthorId: string;
  currentUserId?: string;
  reloadPage: () => void;
}

export const CommentItem = ({
  item,
  i,
  postAuthorId,
  currentUserId,
  reloadPage,
}: CommentItemProps) => {
  const handleDelete = async () => {
    try {
      const response = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      reloadPage();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      key={item.id}
      className={`border p-2 md:max-w-2/3
        rounded flex flex-col gap-5 relative ${
          currentUserId === item.user_id
            ? "self-end"
            : "self-start"
        } ${
        postAuthorId === item.user_id
          ? "bg-yellow-100"
          : "bg-light"
      }`}
    >
      {currentUserId === item.user_id && (
        <button
          onClick={handleDelete}
          className="absolute p-2 rounded-full right-[50%] translate-x-[50%] md:-right-5 md:translate-x-0 -top-5 border border-dark bg-light text-red-500 hover:opacity-95 hover:border-red-500"
        >
          <MdDelete />
        </button>
      )}
      <div className="w-full flex justify-between italic">
        <strong>{currentUserId === item.user_id ? `Вы` : postAuthorId === item.user_id ? `${item.author} (автор)`: item.author}</strong>
        <strong>{new Date(item.created_at).toLocaleString()}</strong>
      </div>
      <pre className={`whitespace-pre-wrap ${font_default.className}`}>
        {item.content}
      </pre>
    </div>
  );
};
