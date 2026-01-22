"use client";

import { BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "@/app/loading";
import { Post } from "@/lib/types";
import Pagination from "../ui/pagination";
import SearchTagsForm from "../ui/search-tags";
import SearchStringForm from "../ui/search-string";

interface PostsProps {
  userId?: string;
  currentUserId?: string;
}

interface PaginationData {
  data: Post[];
  heading: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function Posts({ userId, currentUserId }: PostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [heading, setHeading] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    fetchPosts();
  }, [refetch]);

  const fetchPosts = async (
    page: number = 1,
    tags: string[] | null = null,
    searchString: string | null = null
  ) => {
    setIsLoading(true);
    const baseUrl = userId ? `/api/user/${userId}/posts` : `/api/posts`;
    try {
      const url = new URL(baseUrl, window.location.origin);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", pagination.limit.toString());
      if (tags) url.searchParams.set("tags", tags.join(", "));
      if (searchString) url.searchParams.set("searchString", searchString);
      const response = await fetch(url.toString());
      const data: PaginationData = await response.json();
      setPosts(data.data);
      setPagination(data.pagination);
      setHeading(data.heading);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId:string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {method: 'DELETE'});
      setRefetch(prev => !prev);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    window.scrollTo(0, 0);
    fetchPosts(newPage);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="pb-7 w-full">
        <div className="flex gap-5 justify-center md:justify-start">
          <SearchTagsForm handleSearch={fetchPosts} />
          <SearchStringForm handleSearch={fetchPosts} />
        </div>
        <h1 className={`text-light text-2xl text-center italic whitespace-normal`}>{heading}</h1>
      </div>
      {/* Список постов */}
      <div className="space-y-10">
        <Pagination
          pagination={pagination}
          isLoading={isLoading}
          handlePageChange={handlePageChange}
        />
        {posts.length === 0 ? (
          <div className="text-light text-center py-8">Постов пока нет</div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="border p-4 bg-light rounded-lg flex flex-col gap-3 relative"
            >
              {currentUserId &&
                post.user_id &&
                post.user_id === currentUserId && (
                  <div className="flex gap-2 absolute right-[50%] translate-x-[50%] md:-right-5 md:translate-x-0 -top-5 text-light">
                    <Link
                    href={`/posts/update/${post.id}`}
                    className="p-3 rounded-full bg-accent_1"
                  >
                    <BsPencilFill />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-3 rounded-full bg-red-500"
                  >
                    <MdDelete />
                  </button>
                  </div>
                )}
              {post && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="text-xl font-semibold">{post.title}</h3>
              {post.status === "PUBLISHED" && (
                <Link
                  href={`/posts/${post.slug}?id=${post.id}`}
                  className="italic underline text-blue-700"
                >
                  {post.slug}
                </Link>
              )}
              <p className="text-dark mb-2">{post.excerpt}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Автор: <strong className="italic">{post.author}</strong>
                </span>
                {post.published_at && (
                  <span>
                    Опубликован:{" "}
                    <strong className="italic">
                      {new Date(post.published_at).toLocaleDateString()}
                    </strong>
                  </span>
                )}
                {!post.published_at && (
                  <span>
                    Создан:{" "}
                    <strong className="italic">
                      {new Date(post.created_at).toLocaleDateString()}
                    </strong>{" "}
                    (не опубликован)
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <Pagination
          pagination={pagination}
          isLoading={isLoading}
          handlePageChange={handlePageChange}
        />
      </div>

      {/* Информация о пагинации */}
      <div className="mt-4 text-center text-sm text-light">
        Страница {pagination.page} из {pagination.totalPages} | Всего постов:{" "}
        {pagination.total}
      </div>
    </>
  );
}
