'use client';

import {useEffect, useRef} from 'react';

interface ViewsCounterProps {
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
}

export default function ViewsCounter({postId, postAuthorId, currentUserId}:ViewsCounterProps) {

  // защита от двойного монтирования компонента
  const hasSentView = useRef(false);

  useEffect(() => {
    if (!currentUserId || postAuthorId === currentUserId || hasSentView.current) return;
    hasSentView.current = true;
    const addView = async() => {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addView: true }),
        });
      } catch (error) {
        console.error(error);
      }
    }
    addView();
  }, [postId, postAuthorId, currentUserId]);


  return (
    <></>
  );
}
