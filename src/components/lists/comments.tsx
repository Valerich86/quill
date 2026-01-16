"use client";

import { Comment } from "@/lib/types";
import { CommentItem } from "../items/comment";

interface CommentsProps {
  comments: Comment[] | null;
  currentUserId?: string;
  postAuthorId: string;
  reloadPage: () => void;
}

export default function Comments({
  comments,
  currentUserId,
  postAuthorId,
  reloadPage,
}: CommentsProps) {
  if (!comments || comments.length === 0) {
    return (
      <h2 className={`text-light text-xl italic whitespace-normal`}>
        Комментариев к статье пока нет.
      </h2>
    );
  }

  return (
    <>
      <h2 className={`text-light text-2xl italic whitespace-normal`}>
        Комментарии:
      </h2>
      <div className="w-full flex flex-col gap-10">
        {comments.map((item, i) => (
          <CommentItem
            key={item.id}
            item={item}
            i={i}
            postAuthorId={postAuthorId}
            currentUserId={currentUserId}
            reloadPage={reloadPage}
          />
        ))}
      </div>
    </>
  );
}
